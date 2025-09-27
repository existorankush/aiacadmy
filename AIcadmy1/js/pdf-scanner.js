/**
 * PDFScanner - Extracts text from PDF files and generates quiz questions
 * Supports multiple formats and provides intelligent content analysis
 */
class PDFScanner {
    constructor() {
        this.supportedFormats = ['pdf', 'txt', 'docx'];
        this.extractedContent = '';
        this.contentSections = [];
        this.generatedQuestions = [];
        this.processingProgress = 0;
    }

    /**
     * Initialize PDF.js library
     */
    async initializePDFLib() {
        if (typeof pdfjsLib === 'undefined') {
            // Load PDF.js library dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            document.head.appendChild(script);
            
            return new Promise((resolve) => {
                script.onload = () => {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    resolve();
                };
            });
        }
    }

    /**
     * Validate uploaded file format and size
     */
    validateFile(file) {
        const maxSize = 50 * 1024 * 1024; // 50MB limit
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (!this.supportedFormats.includes(fileExtension)) {
            throw new Error(`Unsupported file format. Supported formats: ${this.supportedFormats.join(', ')}`);
        }
        
        if (file.size > maxSize) {
            throw new Error('File size exceeds 50MB limit');
        }
        
        return true;
    }

    /**
     * Extract text content from PDF file
     */
    async extractFromPDF(file) {
        await this.initializePDFLib();
        
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            
            fileReader.onload = async (event) => {
                try {
                    const arrayBuffer = event.target.result;
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    let fullText = '';
                    
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        this.processingProgress = (pageNum / pdf.numPages) * 50; // 50% for extraction
                        
                        const page = await pdf.getPage(pageNum);
                        const textContent = await page.getTextContent();
                        
                        let pageText = '';
                        textContent.items.forEach(item => {
                            pageText += item.str + ' ';
                        });
                        
                        fullText += `\\n--- Page ${pageNum} ---\\n${pageText}\\n`;
                        
                        // Update progress in UI
                        this.updateProgressUI(this.processingProgress);
                    }
                    
                    this.extractedContent = this.cleanAndNormalizeText(fullText);
                    this.processingProgress = 50;
                    this.updateProgressUI(this.processingProgress);
                    
                    resolve(this.extractedContent);
                } catch (error) {
                    reject(new Error(`Failed to extract PDF content: ${error.message}`));
                }
            };
            
            fileReader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            fileReader.readAsArrayBuffer(file);
        });
    }

    /**
     * Extract text from plain text files
     */
    async extractFromText(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            
            fileReader.onload = (event) => {
                try {
                    this.extractedContent = this.cleanAndNormalizeText(event.target.result);
                    this.processingProgress = 50;
                    this.updateProgressUI(this.processingProgress);
                    resolve(this.extractedContent);
                } catch (error) {
                    reject(new Error(`Failed to extract text content: ${error.message}`));
                }
            };
            
            fileReader.onerror = () => {
                reject(new Error('Failed to read text file'));
            };
            
            fileReader.readAsText(file);
        });
    }

    /**
     * Process uploaded file based on its format
     */
    async processFile(file, progressCallback) {
        try {
            this.validateFile(file);
            this.processingProgress = 0;
            
            if (progressCallback) {
                this.progressCallback = progressCallback;
            }
            
            const fileExtension = file.name.split('.').pop().toLowerCase();
            let extractedText = '';
            
            switch (fileExtension) {
                case 'pdf':
                    extractedText = await this.extractFromPDF(file);
                    break;
                case 'txt':
                    extractedText = await this.extractFromText(file);
                    break;
                case 'docx':
                    // For DOCX support, you would need a library like mammoth.js
                    throw new Error('DOCX format support coming soon');
                default:
                    throw new Error('Unsupported file format');
            }
            
            // Analyze content and create sections
            await this.analyzeContent();
            
            this.processingProgress = 100;
            this.updateProgressUI(this.processingProgress);
            
            return {
                success: true,
                content: this.extractedContent,
                sections: this.contentSections,
                wordCount: this.extractedContent.split(' ').length,
                fileName: file.name
            };
            
        } catch (error) {
            this.processingProgress = 0;
            throw error;
        }
    }

    /**
     * Clean and normalize extracted text
     */
    cleanAndNormalizeText(text) {
        return text
            .replace(/\\n\\s*\\n/g, '\\n\\n') // Remove extra newlines
            .replace(/\\s+/g, ' ') // Normalize spaces
            .replace(/[^\\x20-\\x7E\\n]/g, '') // Remove non-printable characters
            .trim();
    }

    /**
     * Analyze content and create logical sections
     */
    async analyzeContent() {
        this.processingProgress = 60;
        this.updateProgressUI(this.processingProgress);
        
        const sentences = this.extractedContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
        const paragraphs = this.extractedContent.split('\\n\\n').filter(p => p.trim().length > 50);
        
        // Create sections based on content structure
        this.contentSections = [];
        
        // Try to identify chapters or major sections
        const sectionHeaders = this.extractedContent.match(/^[A-Z][A-Za-z\\s]+(?=\\n|:)/gm) || [];
        
        if (sectionHeaders.length > 0) {
            // Content has clear sections
            let currentSection = '';
            let sectionContent = '';
            
            for (const line of this.extractedContent.split('\\n')) {
                const trimmedLine = line.trim();
                
                if (sectionHeaders.includes(trimmedLine)) {
                    if (currentSection && sectionContent) {
                        this.contentSections.push({
                            title: currentSection,
                            content: sectionContent.trim(),
                            wordCount: sectionContent.split(' ').length
                        });
                    }
                    currentSection = trimmedLine;
                    sectionContent = '';
                } else {
                    sectionContent += line + '\\n';
                }
            }
            
            // Add last section
            if (currentSection && sectionContent) {
                this.contentSections.push({
                    title: currentSection,
                    content: sectionContent.trim(),
                    wordCount: sectionContent.split(' ').length
                });
            }
        } else {
            // Split content into equal-sized sections
            const wordsPerSection = 500;
            const words = this.extractedContent.split(' ');
            
            for (let i = 0; i < words.length; i += wordsPerSection) {
                const sectionWords = words.slice(i, i + wordsPerSection);
                const sectionText = sectionWords.join(' ');
                
                this.contentSections.push({
                    title: `Section ${Math.floor(i / wordsPerSection) + 1}`,
                    content: sectionText,
                    wordCount: sectionWords.length
                });
            }
        }
        
        this.processingProgress = 80;
        this.updateProgressUI(this.processingProgress);
    }

    /**
     * Generate quiz questions from extracted content
     */
    async generateQuestions(questionCount = 10, difficulty = 'medium', questionTypes = ['mcq']) {
        if (!this.extractedContent) {
            throw new Error('No content available. Please upload and process a file first.');
        }
        
        this.processingProgress = 85;
        this.updateProgressUI(this.processingProgress);
        
        const questions = [];
        const sentences = this.extractedContent.split(/[.!?]+/)
            .filter(s => s.trim().length > 20)
            .slice(0, questionCount * 3); // Get more sentences for better selection
        
        // Simple question generation algorithm
        for (let i = 0; i < Math.min(questionCount, sentences.length); i++) {
            const sentence = sentences[i].trim();
            
            if (sentence.length < 20) continue;
            
            const question = this.createQuestionFromSentence(sentence, difficulty, questionTypes);
            if (question) {
                questions.push(question);
            }
        }
        
        this.generatedQuestions = questions;
        this.processingProgress = 100;
        this.updateProgressUI(this.processingProgress);
        
        return questions;
    }

    /**
     * Create a question from a sentence
     */
    createQuestionFromSentence(sentence, difficulty, questionTypes) {
        // Extract key information from sentence
        const words = sentence.split(' ').filter(w => w.length > 3);
        if (words.length < 5) return null;
        
        // Simple pattern matching for question generation
        const keyWord = words[Math.floor(Math.random() * words.length)];
        
        // Generate MCQ
        if (questionTypes.includes('mcq')) {
            const question = sentence.replace(keyWord, '______');
            const correctAnswer = keyWord;
            
            // Generate distractors
            const distractors = this.generateDistractors(correctAnswer, sentence);
            
            const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
            
            return {
                id: Date.now() + Math.random(),
                type: 'mcq',
                question: `Fill in the blank: ${question}`,
                options: options,
                correct: options.indexOf(correctAnswer),
                difficulty: difficulty,
                source: 'pdf_upload',
                explanation: `The correct answer is "${correctAnswer}" based on the context provided in the uploaded material.`
            };
        }
        
        return null;
    }

    /**
     * Generate distractors for MCQ questions
     */
    generateDistractors(correctAnswer, context) {
        const distractors = [];
        const words = this.extractedContent.split(' ')
            .filter(w => w.length > 3 && w.toLowerCase() !== correctAnswer.toLowerCase())
            .slice(0, 50);
        
        // Select random words as distractors
        while (distractors.length < 3 && words.length > 0) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const distractor = words[randomIndex];
            
            if (!distractors.includes(distractor) && distractor !== correctAnswer) {
                distractors.push(distractor);
            }
            
            words.splice(randomIndex, 1);
        }
        
        // Fill remaining slots with generic distractors if needed
        const genericDistractors = ['None of the above', 'All of the above', 'Cannot be determined'];
        while (distractors.length < 3) {
            distractors.push(genericDistractors[distractors.length]);
        }
        
        return distractors;
    }

    /**
     * Get content statistics
     */
    getContentStats() {
        if (!this.extractedContent) {
            return null;
        }
        
        const words = this.extractedContent.split(' ').filter(w => w.length > 0);
        const sentences = this.extractedContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = this.extractedContent.split('\\n\\n').filter(p => p.trim().length > 0);
        
        return {
            wordCount: words.length,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.length,
            averageWordsPerSentence: Math.round(words.length / sentences.length),
            sections: this.contentSections.length,
            readabilityLevel: this.calculateReadabilityLevel(words.length, sentences.length)
        };
    }

    /**
     * Calculate readability level (simplified)
     */
    calculateReadabilityLevel(wordCount, sentenceCount) {
        const avgWordsPerSentence = wordCount / sentenceCount;
        
        if (avgWordsPerSentence < 12) return 'Easy';
        if (avgWordsPerSentence < 18) return 'Medium';
        return 'Hard';
    }

    /**
     * Update progress UI
     */
    updateProgressUI(progress) {
        if (this.progressCallback) {
            this.progressCallback(progress);
        }
        
        // Update progress bar if it exists
        const progressBar = document.getElementById('pdf-processing-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }
        
        // Update progress text
        const progressText = document.getElementById('pdf-processing-text');
        if (progressText) {
            if (progress < 50) {
                progressText.textContent = 'Extracting content...';
            } else if (progress < 80) {
                progressText.textContent = 'Analyzing content...';
            } else if (progress < 100) {
                progressText.textContent = 'Generating questions...';
            } else {
                progressText.textContent = 'Complete!';
            }
        }
    }

    /**
     * Clear all data
     */
    reset() {
        this.extractedContent = '';
        this.contentSections = [];
        this.generatedQuestions = [];
        this.processingProgress = 0;
        this.progressCallback = null;
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.PDFScanner = PDFScanner;
    window.pdfScanner = new PDFScanner();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFScanner;
}