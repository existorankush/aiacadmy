document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const uploadArea = document.getElementById('uploadArea');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    const summarySection = document.getElementById('summarySection');
    const summaryContent = document.getElementById('summaryContent');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearChat = document.getElementById('clearChat');
    const typingIndicator = document.getElementById('typingIndicator');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    const filesProcessedStat = document.getElementById('filesProcessed');
    const questionsAnsweredStat = document.getElementById('questionsAnswered');
    const welcomeTime = document.getElementById('welcomeTime');
    const charCount = document.getElementById('charCount');

    // --- State Management ---
    let filesProcessedCount = 0;
    let questionsAnsweredCount = 0;
    let uploadedFile = null;
    let currentSummaryText = "";

    // --- Configuration ---
    const BACKEND_URL = window.location.origin; // Use same origin as the current page

    // --- Initial UI State ---
    const setInitialState = () => {
        welcomeTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        chatInput.disabled = true;
        sendBtn.disabled = true;
        chatInput.placeholder = "Please upload a document to begin chatting...";
    };

    // --- UI Helper Functions ---
    const showLoader = (text) => {
        loadingText.textContent = text;
        loadingOverlay.classList.add('visible');
    };
    
    const hideLoader = () => {
        loadingOverlay.classList.remove('visible');
    };

    const updateStats = () => {
        filesProcessedStat.textContent = filesProcessedCount;
        questionsAnsweredStat.textContent = questionsAnsweredCount;
    };
    
    const setChatActive = (isActive) => {
        chatInput.disabled = !isActive;
        sendBtn.disabled = !isActive;
        chatInput.placeholder = isActive ? "Ask me anything about your materials..." : "Waiting for a document to be summarized...";
    };
    
    const clearChatMessages = () => {
        chatMessages.innerHTML = '';
        addMessageToChat('Please upload a new document to begin.', 'bot');
    };

    // --- Utility Functions ---
    const logDebug = (message, data = null) => {
        console.log(`[TUTOR BOT DEBUG] ${message}`, data || '');
    };

    const logError = (message, error = null) => {
        console.error(`[TUTOR BOT ERROR] ${message}`, error || '');
    };

    // --- File Handling and Summarization ---
    const handleFileSelect = (file) => {
        if (!file) {
            logError('No file selected');
            return;
        }
        
        logDebug('File selected:', file.name);
        uploadedFile = file;

        const fileItemHTML = `
            <div class="file-item" data-filename="${file.name}">
                <div class="file-info">
                    <i class="fas fa-file-alt file-icon"></i>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="remove-file-btn" title="Remove file"><i class="fas fa-times-circle"></i></button>
                </div>
            </div>
        `;
        uploadedFilesContainer.innerHTML = fileItemHTML;
        processFileAndSummarize();
    };

    const processFileAndSummarize = async () => {
        if (!uploadedFile) {
            logError('No file to process');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile);

        logDebug('Starting file processing and summarization');
        showLoader('Contacting AI to summarize your document...');
        summarySection.style.display = 'block';
        summaryContent.innerHTML = '<p>Generating summary, please wait...</p>';
        setChatActive(false);

        try {
            logDebug('Sending file to backend:', `${BACKEND_URL}/upload-and-summarize`);
            
            const response = await fetch(`${BACKEND_URL}/upload-and-summarize`, {
                method: 'POST',
                body: formData,
            });

            logDebug('Backend response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            logDebug('Backend response data:', data);

            if (data.error) {
                logError('Backend returned error:', data.error);
                summaryContent.innerHTML = `<p class="error"><strong>Summarization Failed:</strong> ${data.error}</p>`;
                currentSummaryText = "";
            } else {
                currentSummaryText = data.summary;
                summaryContent.innerHTML = `<p>${currentSummaryText.replace(/\n/g, '<br>')}</p>`;
                
                // Only add welcome message on the very first successful upload
                if (filesProcessedCount === 0) { 
                     addMessageToChat('Hi there! I\'ve reviewed your document. Feel free to ask me anything about it.', 'bot');
                }
                filesProcessedCount++;
                updateStats();
                setChatActive(true);
                logDebug('File processed successfully');
            }
        } catch (error) {
            logError('Error during file processing:', error);
            summaryContent.innerHTML = `<p class="error"><strong>Connection Error:</strong> Could not connect to the backend. Please ensure the server is running. Error: ${error.message}</p>`;
            currentSummaryText = "";
        } finally {
            hideLoader();
        }
    };

    // --- Chat Functionality ---
    const addMessageToChat = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageContentHTML = `
            <p>${text.replace(/\n/g, '<br>')}</p>
            <span class="message-time">${time}</span>
        `;
        
        if (sender === 'user') {
             messageDiv.innerHTML = `
                <div class="message-content">${messageContentHTML}</div>
                <div class="message-avatar"><i class="fas ${avatarIcon}"></i></div>`;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar"><i class="fas ${avatarIcon}"></i></div>
                <div class="message-content">${messageContentHTML}</div>`;
        }
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleSendMessage = async () => {
        const question = chatInput.value.trim();
        if (!question) {
            logDebug('Empty question, not sending');
            return;
        }
        
        if (sendBtn.disabled) {
            logDebug('Send button disabled, not sending');
            return;
        }

        logDebug('Sending message:', question);
        
        addMessageToChat(question, 'user');
        chatInput.value = '';
        charCount.textContent = '0';
        typingIndicator.style.display = 'flex';
        setChatActive(false);

        try {
            logDebug('Sending chat request to backend:', `${BACKEND_URL}/chat`);
            
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ question }),
            });

            logDebug('Chat response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            logDebug('Chat response data:', data);
            
            if (data.error) {
                logError('Backend returned chat error:', data.error);
                addMessageToChat(`<strong>Error:</strong> ${data.error}`, 'bot');
            } else {
                addMessageToChat(data.answer, 'bot');
                questionsAnsweredCount++;
                updateStats();
                logDebug('Chat message processed successfully');
            }
        } catch (error) {
            logError('Error during chat request:', error);
            addMessageToChat(`<strong>Connection Error:</strong> Could not get a response from the server. Error: ${error.message}`, 'bot');
        } finally {
            typingIndicator.style.display = 'none';
            setChatActive(true);
        }
    };
    
    // --- Event Listeners ---
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        logDebug('Upload button clicked');
        fileInput.click();
    });
    
    uploadArea.addEventListener('click', (e) => {
        // Only trigger if clicking the upload area itself, not child elements
        if (e.target === uploadArea || e.target.closest('.upload-content')) {
            e.stopPropagation();
            logDebug('Upload area clicked');
            fileInput.click();
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        logDebug('File input changed');
        handleFileSelect(e.target.files[0]);
    });
    
    uploadArea.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        uploadArea.classList.add('dragover'); 
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        logDebug('File dropped');
        handleFileSelect(e.dataTransfer.files[0]);
    });
    
    uploadedFilesContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-file-btn')) {
            logDebug('Remove file button clicked');
            uploadedFilesContainer.innerHTML = '';
            summarySection.style.display = 'none';
            summaryContent.innerHTML = '';
            uploadedFile = null;
            currentSummaryText = "";
            setChatActive(false);
            clearChatMessages();
        }
    });

    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logDebug('Send button clicked');
        handleSendMessage();
    });
    
    chatInput.addEventListener('keyup', (e) => {
        charCount.textContent = chatInput.value.length;
        if (e.key === 'Enter') {
            e.preventDefault();
            logDebug('Enter key pressed in chat input');
            handleSendMessage();
        }
    });

    chatInput.addEventListener('input', (e) => {
        charCount.textContent = e.target.value.length;
    });

    clearChat.addEventListener('click', () => {
        logDebug('Clear chat button clicked');
        chatMessages.innerHTML = '';
        addMessageToChat('Chat cleared. How can I help you next with the document?', 'bot');
    });
    
    // --- Health Check Function ---
    const checkBackendHealth = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/health`);
            const data = await response.json();
            logDebug('Backend health check:', data);
            return data;
        } catch (error) {
            logError('Backend health check failed:', error);
            return null;
        }
    };
    
    // --- Initialize the App ---
    const initializeApp = async () => {
        logDebug('Initializing AI Tutor Bot');
        logDebug('Backend URL:', BACKEND_URL);
        
        setInitialState();
        
        // Check backend health
        const health = await checkBackendHealth();
        if (health) {
            logDebug('Backend is healthy');
        } else {
            logError('Backend health check failed');
        }
        
        logDebug('App initialized successfully');
    };
    
    // Start the app
    initializeApp();
});