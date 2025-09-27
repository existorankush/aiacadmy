// SST Quiz Bot - Specialized for Social Studies
class SSTQuizBot {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.selectedClass = '6-8';
        this.quizStartTime = null;
        this.quizHistory = this.loadQuizHistory();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTopicSuggestions();
        
        // Initialize spinner hiding
        if (document.getElementById('spinner')) {
            setTimeout(() => {
                document.getElementById('spinner').classList.remove('show');
            }, 1000);
        }
    }

    setupEventListeners() {
        // Class selection buttons
        document.querySelectorAll('.class-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedClass = e.target.dataset.class;
                this.updateTopicSuggestions();
            });
        });

        // Topic suggestion clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('topic-suggestion')) {
                document.getElementById('sst-topic').value = e.target.dataset.topic;
            }
        });

        // Quiz form submission
        document.getElementById('sst-quiz-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateQuiz();
        });

        // Quiz navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finish-btn').addEventListener('click', () => this.finishQuiz());

        // Result buttons
        document.getElementById('retake-quiz').addEventListener('click', () => this.retakeQuiz());
        document.getElementById('new-quiz').addEventListener('click', () => this.startNewQuiz());

        // Answer selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'quiz-answer') {
                this.saveCurrentAnswer(parseInt(e.target.value));
            }
        });
    }

    updateTopicSuggestions() {
        const suggestionsMap = {
            '1-2': [
                'My family', 'My school', 'My neighbourhood', 'Animals around us',
                'Plants around us', 'Our helpers', 'Festivals', 'Good habits'
            ],
            '3-5': [
                'Our Earth', 'Natural features', 'Weather and seasons', 'Our country India',
                'States of India', 'Famous places', 'Transport and communication', 'Our government'
            ],
            '6-8': [
                'The Earth and its movements', 'Major landforms', 'Indian history',
                'Government and democracy', 'Our Constitution', 'Natural resources',
                'Climate of India', 'Freedom struggle'
            ],
            '9-10': [
                'Physical features of India', 'Forest and wildlife', 'Water resources',
                'Agriculture', 'Minerals and energy', 'Manufacturing industries',
                'Democratic politics', 'Electoral politics'
            ],
            '11-12': [
                'Indian physical environment', 'Human settlement', 'Land resources',
                'Water resources', 'Mineral and power resources', 'Planning and sustainable development',
                'Political theory', 'Indian Constitution'
            ]
        };

        const suggestions = suggestionsMap[this.selectedClass] || suggestionsMap['6-8'];
        const suggestedTopicsDiv = document.getElementById('suggested-topics');
        const headerText = document.querySelector('#topic-suggestions h6');
        
        headerText.textContent = `Popular Topics for Class ${this.selectedClass}:`;
        
        suggestedTopicsDiv.innerHTML = suggestions.map(topic => 
            `<span class="topic-suggestion" data-topic="${topic}">${topic}</span>`
        ).join('');
    }

    async generateQuiz() {
        const topic = document.getElementById('sst-topic').value.trim();
        const difficulty = document.getElementById('sst-difficulty').value;
        const numQuestions = parseInt(document.getElementById('sst-numQuestions').value);
        const specificTopics = document.getElementById('sst-specificTopics').value.trim();

        if (!topic) {
            alert('Please enter an SST topic');
            return;
        }

        // Validate topic for SST relevance
        if (!this.validateSSTTopic(topic)) {
            const proceed = confirm(
                'The topic you entered might not be directly related to Social Studies. ' +
                'Would you like to proceed anyway? We\'ll try to generate relevant questions.'
            );
            if (!proceed) return;
        }

        // Show loading
        this.showLoadingScreen(true);
        
        try {
            // Generate quiz using SST knowledge base
            const quizData = await this.generateSSTQuiz({
                topic,
                classLevel: this.selectedClass,
                difficulty,
                numQuestions,
                specificTopics
            });

            if (quizData && quizData.questions && quizData.questions.length > 0) {
                this.currentQuiz = quizData;
                this.startQuiz();
            } else {
                throw new Error('No questions generated');
            }
        } catch (error) {
            console.error('Quiz generation failed:', error);
            this.showErrorMessage(
                'Failed to generate quiz. Please try a different topic or check your connection.'
            );
        } finally {
            this.showLoadingScreen(false);
        }
    }

    validateSSTTopic(topic) {
        const sstKeywords = [
            'geography', 'history', 'civics', 'politics', 'economics', 'government',
            'constitution', 'democracy', 'earth', 'climate', 'population', 'resources',
            'culture', 'society', 'heritage', 'environment', 'development', 'trade',
            'agriculture', 'industry', 'transport', 'communication', 'settlement',
            'india', 'world', 'continent', 'ocean', 'mountain', 'river', 'forest',
            'mineral', 'energy', 'election', 'rights', 'duties', 'law', 'court',
            'ancient', 'medieval', 'modern', 'freedom', 'independence', 'struggle',
            'movement', 'revolution', 'empire', 'dynasty', 'civilization', 'religion',
            'festivals', 'traditions', 'customs', 'language', 'art', 'literature'
        ];

        const topicLower = topic.toLowerCase();
        return sstKeywords.some(keyword => topicLower.includes(keyword));
    }

    async generateSSTQuiz(params) {
        // First try to get questions from our SST knowledge base
        const sstQuiz = this.generateFromSSTKnowledgeBase(params);
        
        if (sstQuiz.questions.length >= params.numQuestions) {
            return sstQuiz;
        }

        // If we don't have enough questions, try AI APIs
        return await this.generateWithAI(params) || sstQuiz;
    }

    generateFromSSTKnowledgeBase(params) {
        if (typeof SSTKnowledgeBase === 'undefined') {
            console.warn('SST Knowledge Base not loaded');
            return { questions: [], topic: params.topic, source: 'fallback' };
        }

        try {
            const generator = new SSTKnowledgeBase();
            console.log(`Generating SST quiz for topic: ${params.topic}, Class: ${params.classLevel}, Difficulty: ${params.difficulty}`);
            
            // Use the enhanced generateSSTQuiz method
            const questions = generator.generateSSTQuiz(
                params.topic,
                params.classLevel,
                params.numQuestions
            );

            // Filter by difficulty if needed
            let filteredQuestions = this.filterByDifficulty(questions, params.difficulty);
            
            // If we don't have enough questions, add contextual ones
            if (filteredQuestions.length < params.numQuestions) {
                const additionalQuestions = this.generateAdditionalSSTQuestions(
                    params.topic,
                    params.classLevel,
                    params.numQuestions - filteredQuestions.length
                );
                filteredQuestions = [...filteredQuestions, ...additionalQuestions];
            }

            return {
                questions: filteredQuestions.slice(0, params.numQuestions).map(q => ({
                    question: q.question,
                    options: q.options,
                    correct: q.correct,
                    explanation: q.explanation || `This answer is based on NCERT textbook content for ${params.topic}.`,
                    difficulty: params.difficulty,
                    category: this.getSSCategory(params.topic),
                    textbookReference: q.textbookReference || `Class ${params.classLevel} SST NCERT`
                })),
                topic: params.topic,
                source: 'sst-knowledge-base',
                classLevel: params.classLevel,
                textbookBased: true
            };
        } catch (error) {
            console.error('Error generating from SST Knowledge Base:', error);
            return this.getFallbackSSTQuestions(params);
        }
    }

    async generateWithAI(params) {
        const prompt = this.buildSSTPrompt(params);
        
        // Try different AI services
        const services = [
            () => this.tryOpenAI(prompt),
            () => this.tryGemini(prompt),
            () => this.tryClaude(prompt),
            () => this.tryHuggingFace(prompt)
        ];

        for (const service of services) {
            try {
                const result = await service();
                if (result && result.questions && result.questions.length > 0) {
                    return {
                        ...result,
                        source: 'ai-generated',
                        topic: params.topic,
                        classLevel: params.classLevel
                    };
                }
            } catch (error) {
                console.warn('AI service failed:', error.message);
                continue;
            }
        }

        return null;
    }

    buildSSTPrompt(params) {
        const classContext = this.getClassContext(params.classLevel);
        const difficultyDescription = {
            'beginner': 'simple and basic',
            'intermediate': 'moderately challenging',
            'advanced': 'complex and analytical'
        }[params.difficulty];

        return `Generate ${params.numQuestions} multiple-choice questions about "${params.topic}" for ${classContext} students. 

Topic Context: ${params.topic}
${params.specificTopics ? `Specific subtopics to focus on: ${params.specificTopics}` : ''}

Requirements:
- Questions should be ${difficultyDescription} and appropriate for ${classContext} level
- Focus on Indian Social Studies curriculum (NCERT aligned)
- Include Geography, History, Civics, and Economics concepts as relevant
- Each question should have exactly 4 options (A, B, C, D)
- Provide clear explanations for correct answers
- Make questions factual and curriculum-based

Return ONLY a JSON object in this exact format:
{
    "questions": [
        {
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": 0,
            "explanation": "Detailed explanation of why this answer is correct"
        }
    ]
}`;
    }

    getClassContext(classLevel) {
        const contexts = {
            '1-2': 'Class 1-2 (Ages 6-8, basic concepts)',
            '3-5': 'Class 3-5 (Ages 8-11, elementary level)',
            '6-8': 'Class 6-8 (Ages 11-14, middle school)',
            '9-10': 'Class 9-10 (Ages 14-16, secondary level)',
            '11-12': 'Class 11-12 (Ages 16-18, senior secondary)'
        };
        return contexts[classLevel] || contexts['6-8'];
    }

    async tryOpenAI(prompt) {
        // Implementation would require API key
        throw new Error('OpenAI API not configured');
    }

    async tryGemini(prompt) {
        // Implementation would require API key
        throw new Error('Gemini API not configured');
    }

    async tryClaude(prompt) {
        // Implementation would require API key  
        throw new Error('Claude API not configured');
    }

    async tryHuggingFace(prompt) {
        // Implementation would require API key
        throw new Error('HuggingFace API not configured');
    }

    startQuiz() {
        if (!this.currentQuiz || !this.currentQuiz.questions.length) {
            this.showErrorMessage('No quiz questions available');
            return;
        }

        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentQuiz.questions.length).fill(null);
        this.quizStartTime = Date.now();

        // Update quiz header
        document.getElementById('quiz-title').textContent = 
            `SST Quiz: ${this.currentQuiz.topic}`;
        document.getElementById('quiz-info').textContent = 
            `Class ${this.selectedClass} | ${this.currentQuiz.questions.length} Questions | Source: ${this.formatSource(this.currentQuiz.source)}`;
        document.getElementById('total-questions').textContent = this.currentQuiz.questions.length;
        document.getElementById('max-score').textContent = this.currentQuiz.questions.length;

        // Show quiz container and hide setup
        document.getElementById('quiz-setup').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('quiz-results').style.display = 'none';

        this.displayCurrentQuestion();
        
        // Smooth scroll to quiz
        document.getElementById('quiz-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    formatSource(source) {
        const sourceMap = {
            'sst-knowledge-base': 'SST Database',
            'ai-generated': 'AI Generated',
            'fallback': 'General Database',
            'error': 'Backup Questions'
        };
        return sourceMap[source] || 'Unknown';
    }

    displayCurrentQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionsContainer = document.getElementById('quiz-questions');

        questionsContainer.innerHTML = `
            <div class="question-card">
                <div class="question-header">
                    <h4 class="question-text">${question.question}</h4>
                    <div class="question-meta">
                        <span class="question-category badge bg-primary me-2">${question.category || 'SST'}</span>
                        ${question.textbookReference ? `<small class="text-muted"><i class="fas fa-book me-1"></i>${question.textbookReference}</small>` : ''}
                    </div>
                </div>
                <div class="options-container">
                    ${question.options.map((option, index) => `
                        <div class="option-item">
                            <input type="radio" id="option-${index}" name="quiz-answer" value="${index}" 
                                   ${this.userAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}>
                            <label for="option-${index}" class="option-label">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">${option}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Update progress
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        
        // Update navigation buttons
        document.getElementById('prev-btn').disabled = this.currentQuestionIndex === 0;
        const isLastQuestion = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
        document.getElementById('next-btn').style.display = isLastQuestion ? 'none' : 'inline-block';
        document.getElementById('finish-btn').style.display = isLastQuestion ? 'inline-block' : 'none';

        // Update score display
        this.updateScoreDisplay();
    }

    saveCurrentAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        let correctAnswers = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer !== null && answer === this.currentQuiz.questions[index].correct) {
                correctAnswers++;
            }
        });
        document.getElementById('current-score').textContent = correctAnswers;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        }
    }

    finishQuiz() {
        const unansweredCount = this.userAnswers.filter(answer => answer === null).length;
        
        if (unansweredCount > 0) {
            const proceed = confirm(
                `You have ${unansweredCount} unanswered question(s). Are you sure you want to finish the quiz?`
            );
            if (!proceed) return;
        }

        this.showResults();
    }

    showResults() {
        const results = this.calculateResults();
        
        // Save to history
        this.saveQuizResult(results);
        
        // Update UI
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('final-total').textContent = results.total;
        document.getElementById('score-message').textContent = this.getScoreMessage(results.percentage);
        
        // Show weak areas if score is low
        if (results.percentage < 70) {
            this.displayWeakAreas(results.incorrectTopics);
        } else {
            document.getElementById('weak-areas').style.display = 'none';
        }
        
        // Hide quiz container and show results
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';
        
        // Smooth scroll to results
        document.getElementById('quiz-results').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    calculateResults() {
        let correctAnswers = 0;
        const incorrectTopics = [];
        
        this.userAnswers.forEach((answer, index) => {
            const question = this.currentQuiz.questions[index];
            if (answer === question.correct) {
                correctAnswers++;
            } else {
                incorrectTopics.push({
                    question: question.question,
                    correctAnswer: question.options[question.correct],
                    userAnswer: answer !== null ? question.options[answer] : 'Not answered',
                    explanation: question.explanation,
                    category: question.category || 'SST'
                });
            }
        });

        const total = this.currentQuiz.questions.length;
        const percentage = (correctAnswers / total) * 100;

        return {
            score: correctAnswers,
            total,
            percentage,
            incorrectTopics,
            timeTaken: Date.now() - this.quizStartTime,
            topic: this.currentQuiz.topic,
            classLevel: this.selectedClass,
            difficulty: document.getElementById('sst-difficulty').value
        };
    }

    getScoreMessage(percentage) {
        if (percentage >= 90) return "Outstanding! You have excellent knowledge of SST!";
        if (percentage >= 80) return "Great job! You have a strong grasp of the concepts!";
        if (percentage >= 70) return "Good work! You understand most of the topics well!";
        if (percentage >= 60) return "Fair attempt! Keep studying to improve your SST knowledge!";
        return "Keep practicing! Review the concepts and try again!";
    }

    displayWeakAreas(incorrectTopics) {
        if (incorrectTopics.length === 0) {
            document.getElementById('weak-areas').style.display = 'none';
            return;
        }

        const weakTopicsDiv = document.getElementById('weak-topics');
        weakTopicsDiv.innerHTML = incorrectTopics.map(topic => `
            <div class="weak-topic-item bg-white p-3 mb-3 rounded border-start border-warning border-4">
                <h6 class="text-danger mb-2">${topic.category}</h6>
                <p class="mb-2"><strong>Q:</strong> ${topic.question}</p>
                <div class="row">
                    <div class="col-md-6">
                        <small class="text-muted">Your Answer:</small>
                        <p class="text-danger mb-0">${topic.userAnswer}</p>
                    </div>
                    <div class="col-md-6">
                        <small class="text-muted">Correct Answer:</small>
                        <p class="text-success mb-0">${topic.correctAnswer}</p>
                    </div>
                </div>
                <small class="text-info">${topic.explanation}</small>
            </div>
        `).join('');

        document.getElementById('weak-areas').style.display = 'block';
    }

    retakeQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentQuiz.questions.length).fill(null);
        this.quizStartTime = Date.now();
        
        document.getElementById('quiz-results').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        
        this.displayCurrentQuestion();
    }

    startNewQuiz() {
        // Reset form and show setup
        document.getElementById('sst-quiz-form').reset();
        document.getElementById('sst-topic').value = '';
        
        document.getElementById('quiz-results').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('quiz-setup').style.display = 'block';
        
        // Scroll to top
        document.getElementById('quiz-setup').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    saveQuizResult(results) {
        const result = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            topic: results.topic,
            classLevel: results.classLevel,
            difficulty: results.difficulty,
            score: results.score,
            total: results.total,
            percentage: Math.round(results.percentage),
            timeTaken: results.timeTaken,
            source: this.currentQuiz.source
        };

        this.quizHistory.push(result);
        
        // Keep only last 50 results
        if (this.quizHistory.length > 50) {
            this.quizHistory = this.quizHistory.slice(-50);
        }
        
        localStorage.setItem('sstQuizHistory', JSON.stringify(this.quizHistory));
    }

    loadQuizHistory() {
        try {
            return JSON.parse(localStorage.getItem('sstQuizHistory')) || [];
        } catch {
            return [];
        }
    }

    showLoadingScreen(show) {
        document.getElementById('quiz-loading').style.display = show ? 'block' : 'none';
        if (show) {
            document.getElementById('quiz-setup').style.display = 'none';
        }
    }

    showErrorMessage(message) {
        alert(message); // Simple alert for now, could be enhanced with better UI
        document.getElementById('quiz-loading').style.display = 'none';
        document.getElementById('quiz-setup').style.display = 'block';
    }

    // Helper methods for enhanced SST quiz generation
    filterByDifficulty(questions, difficulty) {
        if (!questions || questions.length === 0) return questions;
        
        // If difficulty is specified and questions have difficulty levels, filter
        const hasExplicitDifficulty = questions.some(q => q.difficulty);
        if (!hasExplicitDifficulty) return questions;
        
        return questions.filter(q => 
            !q.difficulty || 
            q.difficulty === difficulty || 
            (difficulty === 'beginner' && ['easy', 'simple'].includes(q.difficulty)) ||
            (difficulty === 'intermediate' && ['medium', 'moderate'].includes(q.difficulty)) ||
            (difficulty === 'advanced' && ['hard', 'complex', 'difficult'].includes(q.difficulty))
        );
    }

    generateAdditionalSSTQuestions(topic, classLevel, numNeeded) {
        // Generate additional contextual questions based on the topic
        const templates = this.getSSTQuestionTemplates(topic, classLevel);
        const questions = [];
        
        for (let i = 0; i < Math.min(numNeeded, templates.length); i++) {
            const template = templates[i];
            questions.push({
                question: template.question,
                options: template.options,
                correct: template.correct,
                explanation: template.explanation,
                category: this.getSSCategory(topic),
                source: 'generated'
            });
        }
        
        return questions;
    }

    getSSTQuestionTemplates(topic, classLevel) {
        const topicLower = topic.toLowerCase();
        const templates = [];
        
        // Geography templates
        if (this.isGeographyTopic(topicLower)) {
            templates.push(
                {
                    question: `What is the main characteristic of ${topic}?`,
                    options: [
                        "Physical feature",
                        "Climate pattern", 
                        "Human activity",
                        "All of the above"
                    ],
                    correct: 3,
                    explanation: `${topic} involves multiple geographical aspects including physical, climatic and human factors.`
                },
                {
                    question: `Where in India is ${topic} most commonly found/studied?`,
                    options: [
                        "Northern India",
                        "Southern India",
                        "Throughout India",
                        "Coastal areas"
                    ],
                    correct: 2,
                    explanation: `${topic} can be observed and studied throughout different regions of India.`
                }
            );
        }
        
        // History templates
        if (this.isHistoryTopic(topicLower)) {
            templates.push(
                {
                    question: `What period of Indian history does ${topic} belong to?`,
                    options: [
                        "Ancient period",
                        "Medieval period",
                        "Modern period",
                        "Contemporary period"
                    ],
                    correct: 2, // Default to modern for most topics
                    explanation: `${topic} is an important part of Indian historical studies with lasting impacts.`
                }
            );
        }
        
        // Civics templates
        if (this.isCivicsTopic(topicLower)) {
            templates.push(
                {
                    question: `What is the primary importance of ${topic} in Indian democracy?`,
                    options: [
                        "Ensures citizen rights",
                        "Maintains law and order",
                        "Promotes development",
                        "All of the above"
                    ],
                    correct: 3,
                    explanation: `${topic} plays a crucial role in maintaining democratic values and citizen welfare.`
                }
            );
        }
        
        return templates;
    }

    getSSCategory(topic) {
        const topicLower = topic.toLowerCase();
        
        if (this.isGeographyTopic(topicLower)) return 'Geography';
        if (this.isHistoryTopic(topicLower)) return 'History';
        if (this.isCivicsTopic(topicLower)) return 'Civics';
        if (this.isEconomicsTopic(topicLower)) return 'Economics';
        
        return 'Social Studies';
    }

    isGeographyTopic(topic) {
        const geoKeywords = [
            'earth', 'climate', 'weather', 'landform', 'mountain', 'river', 'ocean',
            'continent', 'map', 'globe', 'latitude', 'longitude', 'monsoon',
            'forest', 'desert', 'plateau', 'plain', 'valley', 'natural resources',
            'minerals', 'soil', 'vegetation', 'agriculture', 'farming'
        ];
        return geoKeywords.some(keyword => topic.includes(keyword));
    }

    isHistoryTopic(topic) {
        const histKeywords = [
            'history', 'ancient', 'medieval', 'modern', 'freedom', 'struggle',
            'independence', 'movement', 'revolution', 'empire', 'dynasty',
            'civilization', 'culture', 'heritage', 'tradition', 'partition',
            'colonial', 'british', 'mughal', 'gupta', 'maurya'
        ];
        return histKeywords.some(keyword => topic.includes(keyword));
    }

    isCivicsTopic(topic) {
        const civicsKeywords = [
            'government', 'democracy', 'constitution', 'parliament', 'election',
            'rights', 'duties', 'citizenship', 'law', 'court', 'justice',
            'political', 'administration', 'governance', 'policy', 'scheme'
        ];
        return civicsKeywords.some(keyword => topic.includes(keyword));
    }

    isEconomicsTopic(topic) {
        const ecoKeywords = [
            'economy', 'economic', 'development', 'growth', 'trade', 'industry',
            'agriculture', 'manufacturing', 'services', 'employment', 'unemployment',
            'poverty', 'income', 'gdp', 'budget', 'finance', 'banking', 'money'
        ];
        return ecoKeywords.some(keyword => topic.includes(keyword));
    }

    getFallbackSSTQuestions(params) {
        // Provide basic SST questions as fallback
        const fallbackQuestions = [
            {
                question: `What is the importance of studying ${params.topic}?`,
                options: [
                    "Understanding our society",
                    "Learning from the past",
                    "Making informed decisions",
                    "All of the above"
                ],
                correct: 3,
                explanation: `Studying ${params.topic} helps us understand society, learn from history, and make better decisions.`
            },
            {
                question: `Which subject area does ${params.topic} primarily belong to?`,
                options: ["Geography", "History", "Civics", "Economics"],
                correct: 0, // Default to Geography
                explanation: `${params.topic} is an important topic in Social Studies curriculum.`
            }
        ];
        
        return {
            questions: fallbackQuestions.slice(0, params.numQuestions),
            topic: params.topic,
            source: 'fallback',
            classLevel: params.classLevel
        };
    }
}

// Initialize the SST Quiz Bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.sstQuizBot = new SSTQuizBot();
});
