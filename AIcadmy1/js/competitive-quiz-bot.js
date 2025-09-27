/**
 * Competitive Exam Quiz Bot
 * Advanced quiz bot for JEE, GATE, and Boards exams
 * Features: Adaptive learning, syllabus tracking, AI-powered question generation
 */

class CompetitiveQuizBot {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.selectedExam = 'jee';
        this.selectedSubject = 'physics';
        this.selectedTopic = null;
        this.quizStartTime = null;
        this.quizHistory = this.loadQuizHistory();
        this.knowledgeBase = new CompetitiveExamKnowledgeBase();
        this.userProfile = this.loadUserProfile();
        this.syllabusProgress = this.loadSyllabusProgress();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateExamInterface();
        this.loadSyllabusProgress();

        // Initialize spinner hiding
        if (document.getElementById('spinner')) {
            setTimeout(() => {
                document.getElementById('spinner').classList.remove('show');
            }, 1000);
        }
    }

    setupEventListeners() {
        // Exam selection
        document.addEventListener('change', (e) => {
            if (e.target.id === 'exam-selector') {
                this.selectedExam = e.target.value;
                this.updateExamInterface();
            }
            if (e.target.id === 'subject-selector') {
                this.selectedSubject = e.target.value;
                this.updateTopicSuggestions();
            }
        });

        // Topic suggestion clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('topic-suggestion')) {
                document.getElementById('topic-input').value = e.target.dataset.topic;
                this.selectedTopic = e.target.dataset.topic;
            }
            if (e.target.classList.contains('syllabus-topic')) {
                this.generateTopicQuiz(e.target.dataset.topic);
            }
        });

        // Quiz form submission
        document.getElementById('competitive-quiz-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateQuiz();
        });

        // Quiz navigation
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finish-btn').addEventListener('click', () => this.finishQuiz());

        // Result actions
        document.getElementById('retake-quiz').addEventListener('click', () => this.retakeQuiz());
        document.getElementById('new-quiz').addEventListener('click', () => this.startNewQuiz());
        document.getElementById('adaptive-quiz').addEventListener('click', () => this.generateAdaptiveQuiz());

        // Answer selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'quiz-answer') {
                this.saveCurrentAnswer(parseInt(e.target.value));
                this.updateRealTimeProgress();
            }
        });

        // AI Training toggle
        document.getElementById('ai-training-toggle').addEventListener('change', (e) => {
            this.userProfile.useAITraining = e.target.checked;
            this.saveUserProfile();
        });
    }

    updateExamInterface() {
        // Update subject options based on exam
        const subjectSelector = document.getElementById('subject-selector');
        const subjects = this.getSubjectsForExam(this.selectedExam);

        subjectSelector.innerHTML = subjects.map(subject =>
            `<option value="${subject}">${this.formatSubjectName(subject)}</option>`
        ).join('');

        this.selectedSubject = subjects[0];
        this.updateTopicSuggestions();
        this.updateSyllabusTracker();
        this.updateExamStats();
    }

    getSubjectsForExam(exam) {
        const examSubjects = {
            jee: ['physics', 'chemistry', 'mathematics'],
            gate: ['computer_science', 'electrical', 'mechanical'],
            boards: ['physics', 'chemistry', 'mathematics']
        };
        return examSubjects[exam] || ['physics'];
    }

    formatSubjectName(subject) {
        return subject.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    updateTopicSuggestions() {
        const topics = this.knowledgeBase.getAvailableTopics(this.selectedExam, this.selectedSubject);
        const suggestionsContainer = document.getElementById('topic-suggestions');

        if (topics.length > 0) {
            suggestionsContainer.innerHTML = topics.map(topic =>
                `<span class="topic-suggestion" data-topic="${topic}">${this.formatTopicName(topic)}</span>`
            ).join('');
        } else {
            suggestionsContainer.innerHTML = '<p class="text-muted">No specific topics available. Enter any topic to get general questions.</p>';
        }
    }

    formatTopicName(topic) {
        return topic.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    updateSyllabusTracker() {
            const syllabus = this.knowledgeBase.getSyllabusCoverage(this.selectedExam, this.selectedSubject);
            const syllabusContainer = document.getElementById('syllabus-tracker');

            let syllabusHTML = '<h6><i class="fas fa-list-alt me-2"></i>Syllabus Coverage</h6>';

            if (typeof syllabus === 'object' && syllabus !== null) {
                Object.entries(syllabus).forEach(([category, topics]) => {
                            if (Array.isArray(topics)) {
                                syllabusHTML += `
                        <div class="syllabus-category">
                            <strong>${this.formatTopicName(category)}:</strong>
                            <div class="syllabus-topics">
                                ${topics.map(topic => {
                                    const progress = this.getTopicProgress(topic);
                                    const progressClass = progress > 70 ? 'bg-success' : progress > 40 ? 'bg-warning' : 'bg-danger';
                                    return `
                                        <div class="syllabus-topic" data-topic="${topic}">
                                            <span>${this.formatTopicName(topic)}</span>
                                            <div class="progress-bar">
                                                <div class="progress-fill ${progressClass}" style="width: ${progress}%"></div>
                                            </div>
                                            <small>${progress}%</small>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }
            });
        }
        
        syllabusContainer.innerHTML = syllabusHTML;
    }

    getTopicProgress(topic) {
        const key = `${this.selectedExam}_${this.selectedSubject}_${topic}`;
        return this.syllabusProgress[key] || 0;
    }

    updateTopicProgress(topic, score) {
        const key = `${this.selectedExam}_${this.selectedSubject}_${topic}`;
        const currentProgress = this.syllabusProgress[key] || 0;
        // Update progress based on quiz performance (weighted average)
        this.syllabusProgress[key] = Math.round((currentProgress * 0.7) + (score * 0.3));
        this.saveSyllabusProgress();
    }

    updateExamStats() {
        const stats = this.knowledgeBase.getQuestionStats(this.selectedExam, this.selectedSubject);
        document.getElementById('exam-stats').innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${stats.totalQuestions}</div>
                    <div class="stat-label">Total Questions</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.difficultyBreakdown.easy}</div>
                    <div class="stat-label">Easy</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.difficultyBreakdown.medium}</div>
                    <div class="stat-label">Medium</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.difficultyBreakdown.hard}</div>
                    <div class="stat-label">Hard</div>
                </div>
            </div>
        `;
    }

    async generateQuiz() {
        const topic = document.getElementById('topic-input').value.trim();
        const difficulty = document.getElementById('difficulty-selector').value;
        const numQuestions = parseInt(document.getElementById('num-questions').value);
        const useAITraining = document.getElementById('ai-training-toggle').checked;

        if (!topic && this.knowledgeBase.getAvailableTopics(this.selectedExam, this.selectedSubject).length > 0) {
            alert('Please enter a topic or select from suggestions');
            return;
        }

        this.showLoadingScreen(true);
        
        try {
            let quizData;
            
            if (useAITraining && this.userProfile.useAITraining) {
                // Use AI-enhanced question generation
                quizData = await this.generateAIEnhancedQuiz({
                    exam: this.selectedExam,
                    subject: this.selectedSubject,
                    topic: topic || null,
                    difficulty,
                    numQuestions,
                    userProfile: this.userProfile
                });
            } else {
                // Use knowledge base
                const questions = this.knowledgeBase.generateExamQuiz(
                    this.selectedExam, 
                    this.selectedSubject, 
                    topic, 
                    difficulty, 
                    numQuestions
                );
                
                quizData = {
                    questions,
                    exam: this.selectedExam,
                    subject: this.selectedSubject,
                    topic: topic || this.selectedSubject,
                    difficulty,
                    source: 'knowledge-base'
                };
            }

            if (quizData && quizData.questions && quizData.questions.length > 0) {
                this.currentQuiz = quizData;
                this.startQuiz();
            } else {
                throw new Error('No questions generated');
            }
        } catch (error) {
            console.error('Quiz generation failed:', error);
            this.showErrorMessage('Failed to generate quiz. Please try a different topic or check your connection.');
        } finally {
            this.showLoadingScreen(false);
        }
    }

    async generateAIEnhancedQuiz(params) {
        // This would integrate with AI services (OpenAI, Gemini, etc.)
        // For now, we'll enhance with knowledge base and add intelligent features
        
        const baseQuestions = this.knowledgeBase.generateExamQuiz(
            params.exam, 
            params.subject, 
            params.topic, 
            params.difficulty, 
            params.numQuestions
        );

        // Enhance questions with AI features
        const enhancedQuestions = baseQuestions.map(q => ({
            ...q,
            aiEnhanced: true,
            conceptualTags: this.generateConceptualTags(q, params),
            difficultyScore: this.calculateDifficultyScore(q),
            studyTips: this.generateStudyTips(q, params.exam, params.subject)
        }));

        // Add adaptive difficulty based on user performance
        if (params.userProfile && params.userProfile.performanceHistory) {
            return this.applyAdaptiveDifficulty(enhancedQuestions, params);
        }

        return {
            questions: enhancedQuestions,
            exam: params.exam,
            subject: params.subject,
            topic: params.topic,
            difficulty: params.difficulty,
            source: 'ai-enhanced'
        };
    }

    generateConceptualTags(question, params) {
        const tags = [];
        const questionLower = question.question.toLowerCase();
        
        // Physics tags
        if (params.subject === 'physics') {
            if (questionLower.includes('velocity') || questionLower.includes('acceleration')) tags.push('kinematics');
            if (questionLower.includes('force') || questionLower.includes('mass')) tags.push('dynamics');
            if (questionLower.includes('energy') || questionLower.includes('work')) tags.push('energy');
            if (questionLower.includes('electric') || questionLower.includes('charge')) tags.push('electricity');
        }
        
        // Chemistry tags
        if (params.subject === 'chemistry') {
            if (questionLower.includes('ph') || questionLower.includes('acid')) tags.push('acids-bases');
            if (questionLower.includes('electron') || questionLower.includes('orbital')) tags.push('atomic-structure');
            if (questionLower.includes('reaction') || questionLower.includes('rate')) tags.push('kinetics');
        }
        
        // Mathematics tags
        if (params.subject === 'mathematics') {
            if (questionLower.includes('derivative') || questionLower.includes('differential')) tags.push('calculus');
            if (questionLower.includes('matrix') || questionLower.includes('determinant')) tags.push('algebra');
            if (questionLower.includes('triangle') || questionLower.includes('angle')) tags.push('geometry');
        }
        
        return tags;
    }

    calculateDifficultyScore(question) {
        let score = 50; // base difficulty
        
        // Adjust based on explicit difficulty
        if (question.difficulty === 'easy') score = 30;
        else if (question.difficulty === 'medium') score = 50;
        else if (question.difficulty === 'hard') score = 80;
        
        // Adjust based on question complexity
        const questionLength = question.question.length;
        if (questionLength > 200) score += 10;
        if (questionLength > 300) score += 10;
        
        // Adjust based on formula usage
        if (question.formulaUsed) score += 15;
        
        // Adjust based on numerical calculations
        if (question.question.match(/\d+\.\d+|\d+/g)) score += 10;
        
        return Math.min(100, Math.max(1, score));
    }

    generateStudyTips(question, exam, subject) {
        const tips = [];
        
        if (question.bookReference) {
            tips.push(`📖 Reference: ${question.bookReference}`);
        }
        
        if (question.formulaUsed) {
            tips.push(`📐 Key Formula: ${question.formulaUsed}`);
        }
        
        if (question.conceptualTags && question.conceptualTags.length > 0) {
            tips.push(`🏷️ Concepts: ${question.conceptualTags.join(', ')}`);
        }
        
        // Add exam-specific tips
        if (exam === 'jee') {
            tips.push('💡 JEE Tip: Focus on concept clarity and numerical problem solving');
        } else if (exam === 'gate') {
            tips.push('💡 GATE Tip: Understand the theoretical foundation and practical applications');
        } else if (exam === 'boards') {
            tips.push('💡 Boards Tip: Ensure you understand the NCERT concepts thoroughly');
        }
        
        return tips;
    }

    applyAdaptiveDifficulty(questions, params) {
        const userPerformance = this.getUserPerformanceForTopic(params.topic);
        
        if (userPerformance < 60) {
            // User struggling, provide more easy questions
            return {
                questions: questions.filter(q => q.difficulty === 'easy').slice(0, Math.ceil(params.numQuestions * 0.7))
                    .concat(questions.filter(q => q.difficulty === 'medium').slice(0, Math.floor(params.numQuestions * 0.3))),
                adaptiveLevel: 'remedial',
                ...params
            };
        } else if (userPerformance > 80) {
            // User doing well, provide challenging questions
            return {
                questions: questions.filter(q => q.difficulty === 'hard').slice(0, Math.ceil(params.numQuestions * 0.6))
                    .concat(questions.filter(q => q.difficulty === 'medium').slice(0, Math.floor(params.numQuestions * 0.4))),
                adaptiveLevel: 'advanced',
                ...params
            };
        }
        
        // Balanced mix for average performance
        return {
            questions: questions.slice(0, params.numQuestions),
            adaptiveLevel: 'balanced',
            ...params
        };
    }

    generateAdaptiveQuiz() {
        const weakAreas = this.knowledgeBase.analyzeWeakAreas(
            this.quizHistory, 
            this.selectedExam, 
            this.selectedSubject
        );
        
        if (weakAreas.length === 0) {
            alert('Great! You don\'t have any weak areas. Taking a general quiz instead.');
            this.generateQuiz();
            return;
        }
        
        // Focus on weakest area
        const weakestTopic = weakAreas[0].topic;
        document.getElementById('topic-input').value = weakestTopic;
        document.getElementById('difficulty-selector').value = 'easy'; // Start with easier questions
        
        this.generateQuiz();
    }

    generateTopicQuiz(topic) {
        document.getElementById('topic-input').value = topic;
        this.generateQuiz();
    }

    startQuiz() {
        if (!this.currentQuiz || !this.currentQuiz.questions.length) {
            this.showErrorMessage('No quiz questions available');
            return;
        }

        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentQuiz.questions.length).fill(null);
        this.quizStartTime = Date.now();

        // Update quiz header with enhanced information
        document.getElementById('quiz-title').textContent = 
            `${this.selectedExam.toUpperCase()} ${this.formatSubjectName(this.selectedSubject)}: ${this.currentQuiz.topic}`;
        
        document.getElementById('quiz-info').innerHTML = `
            <div class="quiz-meta">
                <span class="badge bg-primary me-2">${this.selectedExam.toUpperCase()}</span>
                <span class="badge bg-success me-2">${this.currentQuiz.questions.length} Questions</span>
                <span class="badge bg-info me-2">${this.formatSubjectName(this.currentQuiz.difficulty)}</span>
                <span class="badge bg-warning">${this.formatSource(this.currentQuiz.source)}</span>
                ${this.currentQuiz.adaptiveLevel ? `<span class="badge bg-secondary ms-2">Adaptive: ${this.currentQuiz.adaptiveLevel}</span>` : ''}
            </div>
        `;
        
        document.getElementById('total-questions').textContent = this.currentQuiz.questions.length;
        document.getElementById('max-score').textContent = this.currentQuiz.questions.length;

        // Show quiz container
        document.getElementById('quiz-setup').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('quiz-results').style.display = 'none';

        this.displayCurrentQuestion();
        this.scrollToQuiz();
    }

    displayCurrentQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionsContainer = document.getElementById('quiz-questions');

        let questionHTML = `
            <div class="question-card enhanced">
                <div class="question-header">
                    <div class="question-meta">
                        <span class="question-number">Question ${this.currentQuestionIndex + 1}</span>
                        ${question.difficulty ? `<span class="difficulty-badge ${question.difficulty}">${question.difficulty.toUpperCase()}</span>` : ''}
                        ${question.subtopic ? `<span class="subtopic-badge">${this.formatTopicName(question.subtopic)}</span>` : ''}
                        ${question.difficultyScore ? `<span class="score-badge">Difficulty: ${question.difficultyScore}/100</span>` : ''}
                    </div>
                    <h4 class="question-text">${question.question}</h4>
                    ${question.formulaUsed ? `<div class="formula-hint"><i class="fas fa-calculator"></i> Formula: ${question.formulaUsed}</div>` : ''}
                </div>
                <div class="options-container">
                    ${question.options.map((option, index) => `
                        <div class="option-item enhanced">
                            <input type="radio" id="option-${index}" name="quiz-answer" value="${index}" 
                                   ${this.userAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}>
                            <label for="option-${index}" class="option-label">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">${option}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
                ${question.conceptualTags && question.conceptualTags.length > 0 ? `
                    <div class="concept-tags">
                        <strong>Key Concepts:</strong>
                        ${question.conceptualTags.map(tag => `<span class="concept-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                ${question.studyTips && question.studyTips.length > 0 ? `
                    <div class="study-tips">
                        <details>
                            <summary><i class="fas fa-lightbulb"></i> Study Tips</summary>
                            <ul>
                                ${question.studyTips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </details>
                    </div>
                ` : ''}
            </div>
        `;

        questionsContainer.innerHTML = questionHTML;

        // Update progress and navigation
        this.updateQuizProgress();
        this.updateNavigationButtons();
        this.updateScoreDisplay();
    }

    updateQuizProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        
        // Update progress bar if exists
        const progressBar = document.querySelector('.quiz-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    updateNavigationButtons() {
        document.getElementById('prev-btn').disabled = this.currentQuestionIndex === 0;
        const isLastQuestion = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
        document.getElementById('next-btn').style.display = isLastQuestion ? 'none' : 'inline-block';
        document.getElementById('finish-btn').style.display = isLastQuestion ? 'inline-block' : 'none';
    }

    updateRealTimeProgress() {
        // Real-time feedback during quiz
        const answeredQuestions = this.userAnswers.filter(answer => answer !== null).length;
        const completionRate = (answeredQuestions / this.currentQuiz.questions.length) * 100;
        
        // Update completion indicator
        const completionIndicator = document.getElementById('completion-rate');
        if (completionIndicator) {
            completionIndicator.textContent = `${Math.round(completionRate)}% Complete`;
        }
    }

    saveCurrentAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        this.updateScoreDisplay();
        
        // Save answer with timestamp for analytics
        const answerData = {
            questionIndex: this.currentQuestionIndex,
            selectedAnswer: answerIndex,
            timestamp: Date.now(),
            timeSpent: Date.now() - this.questionStartTime
        };
        
        // Store for detailed analytics
        if (!this.currentQuiz.answerData) {
            this.currentQuiz.answerData = [];
        }
        this.currentQuiz.answerData[this.currentQuestionIndex] = answerData;
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
            this.questionStartTime = Date.now();
            this.displayCurrentQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.questionStartTime = Date.now();
            this.displayCurrentQuestion();
        }
    }

    finishQuiz() {
        const unansweredCount = this.userAnswers.filter(answer => answer === null).length;
        
        if (unansweredCount > 0) {
            const proceed = confirm(
                `You have ${unansweredCount} unanswered question(s). Are you sure you want to finish?`
            );
            if (!proceed) return;
        }

        this.showResults();
    }

    showResults() {
        const results = this.calculateDetailedResults();
        
        // Save to history and update progress
        this.saveQuizResult(results);
        this.updateTopicProgress(this.currentQuiz.topic, results.percentage);
        // Track leaderboard/progress if global handler exists
        if (typeof window.trackQuizResult === 'function') {
            try {
                window.trackQuizResult(results);
            } catch (e) {
                console.warn('Quiz tracking failed:', e);
            }
        }
        
        // Display comprehensive results
        this.displayDetailedResults(results);
        
        // Show results section
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';
        this.scrollToResults();
    }

    calculateDetailedResults() {
        let correctAnswers = 0;
        const incorrectQuestions = [];
        const topicBreakdown = {};
        const difficultyBreakdown = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
        
        this.userAnswers.forEach((answer, index) => {
            const question = this.currentQuiz.questions[index];
            const isCorrect = answer === question.correct;
            
            if (isCorrect) {
                correctAnswers++;
            } else {
                incorrectQuestions.push({
                    question: question.question,
                    correctAnswer: question.options[question.correct],
                    userAnswer: answer !== null ? question.options[answer] : 'Not answered',
                    explanation: question.explanation,
                    subtopic: question.subtopic,
                    bookReference: question.bookReference,
                    studyTips: question.studyTips
                });
            }
            
            // Topic breakdown
            const topic = question.subtopic || 'General';
            if (!topicBreakdown[topic]) {
                topicBreakdown[topic] = { correct: 0, total: 0 };
            }
            topicBreakdown[topic].total++;
            if (isCorrect) topicBreakdown[topic].correct++;
            
            // Difficulty breakdown
            const difficulty = question.difficulty || 'medium';
            difficultyBreakdown[difficulty].total++;
            if (isCorrect) difficultyBreakdown[difficulty].correct++;
        });

        const total = this.currentQuiz.questions.length;
        const percentage = (correctAnswers / total) * 100;
        const grade = this.calculateGrade(percentage);
        const timeTaken = Date.now() - this.quizStartTime;

        return {
            score: correctAnswers,
            total,
            percentage,
            grade,
            timeTaken,
            incorrectQuestions,
            topicBreakdown,
            difficultyBreakdown,
            exam: this.selectedExam,
            subject: this.selectedSubject,
            topic: this.currentQuiz.topic,
            difficulty: this.currentQuiz.difficulty,
            source: this.currentQuiz.source
        };
    }

    calculateGrade(percentage) {
        if (percentage >= 90) return { grade: 'A+', description: 'Outstanding' };
        if (percentage >= 80) return { grade: 'A', description: 'Excellent' };
        if (percentage >= 70) return { grade: 'B+', description: 'Good' };
        if (percentage >= 60) return { grade: 'B', description: 'Above Average' };
        if (percentage >= 50) return { grade: 'C+', description: 'Average' };
        if (percentage >= 40) return { grade: 'C', description: 'Below Average' };
        return { grade: 'D', description: 'Needs Improvement' };
    }

    displayDetailedResults(results) {
        // Update basic score display
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('final-total').textContent = results.total;
        document.getElementById('score-percentage').textContent = `${Math.round(results.percentage)}%`;
        document.getElementById('grade-display').textContent = results.grade.grade;
        document.getElementById('grade-description').textContent = results.grade.description;
        
        // Display detailed analytics
        this.displayTopicBreakdown(results.topicBreakdown);
        this.displayDifficultyAnalysis(results.difficultyBreakdown);
        this.displayIncorrectQuestions(results.incorrectQuestions);
        this.displayRecommendations(results);
        
        // Show time taken
        const minutes = Math.floor(results.timeTaken / 60000);
        const seconds = Math.floor((results.timeTaken % 60000) / 1000);
        document.getElementById('time-taken').textContent = `${minutes}m ${seconds}s`;
    }

    displayTopicBreakdown(topicBreakdown) {
        const container = document.getElementById('topic-breakdown');
        let html = '<h6><i class="fas fa-chart-pie me-2"></i>Topic-wise Performance</h6>';
        
        Object.entries(topicBreakdown).forEach(([topic, performance]) => {
            const percentage = Math.round((performance.correct / performance.total) * 100);
            const statusClass = percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger';
            
            html += `
                <div class="topic-performance">
                    <div class="topic-name">${this.formatTopicName(topic)}</div>
                    <div class="topic-stats">
                        <span class="score">${performance.correct}/${performance.total}</span>
                        <div class="progress">
                            <div class="progress-bar bg-${statusClass}" style="width: ${percentage}%"></div>
                        </div>
                        <span class="percentage text-${statusClass}">${percentage}%</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    displayDifficultyAnalysis(difficultyBreakdown) {
        const container = document.getElementById('difficulty-analysis');
        let html = '<h6><i class="fas fa-layer-group me-2"></i>Difficulty Analysis</h6>';
        
        Object.entries(difficultyBreakdown).forEach(([difficulty, performance]) => {
            if (performance.total > 0) {
                const percentage = Math.round((performance.correct / performance.total) * 100);
                html += `
                    <div class="difficulty-item">
                        <span class="difficulty-label ${difficulty}">${difficulty.toUpperCase()}</span>
                        <span class="difficulty-score">${performance.correct}/${performance.total} (${percentage}%)</span>
                    </div>
                `;
            }
        });
        
        container.innerHTML = html;
    }

    displayIncorrectQuestions(incorrectQuestions) {
        const container = document.getElementById('incorrect-questions');
        
        if (incorrectQuestions.length === 0) {
            container.innerHTML = '<div class="alert alert-success">🎉 Perfect score! All answers correct!</div>';
            return;
        }
        
        let html = `<h6><i class="fas fa-times-circle me-2"></i>Review Incorrect Answers (${incorrectQuestions.length})</h6>`;
        
        incorrectQuestions.forEach((item, index) => {
            html += `
                <div class="incorrect-item">
                    <div class="question-review">
                        <h7>Q${index + 1}: ${item.question}</h7>
                        <div class="answer-comparison">
                            <div class="user-answer">
                                <strong>Your Answer:</strong> <span class="text-danger">${item.userAnswer}</span>
                            </div>
                            <div class="correct-answer">
                                <strong>Correct Answer:</strong> <span class="text-success">${item.correctAnswer}</span>
                            </div>
                        </div>
                        <div class="explanation">
                            <strong>Explanation:</strong> ${item.explanation}
                        </div>
                        ${item.bookReference ? `<div class="reference"><strong>Reference:</strong> ${item.bookReference}</div>` : ''}
                        ${item.studyTips && item.studyTips.length > 0 ? `
                            <div class="study-tips-review">
                                <strong>Study Tips:</strong>
                                <ul>
                                    ${item.studyTips.map(tip => `<li>${tip}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    displayRecommendations(results) {
        const container = document.getElementById('recommendations');
        let recommendations = [];
        
        // Performance-based recommendations
        if (results.percentage < 50) {
            recommendations.push({
                icon: '📚',
                text: 'Focus on strengthening fundamental concepts before attempting more questions',
                action: 'Review basic concepts'
            });
        } else if (results.percentage < 70) {
            recommendations.push({
                icon: '💪',
                text: 'Good foundation! Practice more questions to improve accuracy',
                action: 'Take more practice quizzes'
            });
        } else if (results.percentage < 90) {
            recommendations.push({
                icon: '🎯',
                text: 'Excellent work! Focus on challenging questions to reach mastery',
                action: 'Attempt advanced level questions'
            });
        } else {
            recommendations.push({
                icon: '🏆',
                text: 'Outstanding performance! Consider helping others or exploring advanced topics',
                action: 'Explore advanced concepts'
            });
        }
        
        // Topic-specific recommendations
        Object.entries(results.topicBreakdown).forEach(([topic, performance]) => {
            const percentage = (performance.correct / performance.total) * 100;
            if (percentage < 60) {
                recommendations.push({
                    icon: '🔍',
                    text: `Weak area identified in ${this.formatTopicName(topic)}. Focus practice here.`,
                    action: `Practice ${topic} questions`
                });
            }
        });
        
        let html = '<h6><i class="fas fa-lightbulb me-2"></i>Personalized Recommendations</h6>';
        
        // Enhanced book recommendations using BookRecommendationEngine
        if (window.bookRecommendationEngine) {
            const quizHistory = this.loadQuizHistory();
            const userProfile = window.bookRecommendationEngine.createUserProfile(quizHistory);
            const weakAreas = window.bookRecommendationEngine.weaknessAnalyzer.analyze(quizHistory);
            const bookRecommendations = window.bookRecommendationEngine.generateRecommendations(
                userProfile, quizHistory, weakAreas
            );
            
            if (bookRecommendations.length > 0) {
                html += '<div class="mt-4"><h6><i class="fas fa-book text-primary me-2"></i>Recommended Books</h6>';
                html += '<div class="row">';
                
                bookRecommendations.slice(0, 3).forEach(book => {
                    html += `
                        <div class="col-md-4 mb-3">
                            <div class="card border-${book.urgency === 'high' ? 'danger' : book.urgency === 'medium' ? 'warning' : 'info'} h-100">
                                <img src="${book.image}" class="card-img-top" style="height: 150px; object-fit: cover;" alt="${book.title}">
                                <div class="card-body">
                                    <h6 class="card-title" style="font-size: 0.9rem;">${book.title}</h6>
                                    <p class="card-text text-muted small">${book.author}</p>
                                    <div class="mb-2">
                                        <span class="badge ${book.urgency === 'high' ? 'bg-danger' : book.urgency === 'medium' ? 'bg-warning' : 'bg-info'} text-white" style="font-size: 0.7rem;">
                                            ${book.urgency.toUpperCase()}
                                        </span>
                                    </div>
                                    <p class="small mb-2">${book.recommendationReason}</p>
                                    <div class="d-flex justify-content-between align-items-end">
                                        <div>
                                            <div class="fw-bold text-primary">₹${book.price}</div>
                                            ${book.rentalPrice ? `<div class="small text-muted">Rent: ₹${book.rentalPrice}</div>` : ''}
                                        </div>
                                        <button class="btn btn-sm btn-primary" onclick="window.location.href='resource.html?search=${book.title}'">
                                            <i class="fas fa-shopping-cart me-1"></i>View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                html += '</div>';
                html += `<div class="text-center mt-3">
                    <button class="btn btn-outline-primary" onclick="window.location.href='resource.html'">
                        <i class="fas fa-books me-2"></i>View All Study Resources
                    </button>
                </div>`;
                html += '</div>';
            }
        }
        
        // Study Plan Generation
        if (window.studyPlanGenerator) {
            html += '<div class="mt-4"><h6><i class="fas fa-calendar-alt text-success me-2"></i>Personalized Study Plan</h6>';
            html += `
                <div class="card border-success">
                    <div class="card-body">
                        <p class="card-text">Generate a customized study plan based on your performance and weak areas.</p>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label small">Time Frame:</label>
                                <select class="form-select form-select-sm" id="study-plan-timeframe">
                                    <option value="short">Short Term (2-4 weeks)</option>
                                    <option value="medium" selected>Medium Term (4-8 weeks)</option>
                                    <option value="long">Long Term (8-16 weeks)</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small">Focus Level:</label>
                                <select class="form-select form-select-sm" id="study-plan-intensity">
                                    <option value="light">Light (4-6 hrs/week)</option>
                                    <option value="moderate" selected>Moderate (8-12 hrs/week)</option>
                                    <option value="intensive">Intensive (15+ hrs/week)</option>
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-success btn-sm" onclick="competitiveQuizBot.generateStudyPlan()">
                            <i class="fas fa-magic me-2"></i>Generate My Study Plan
                        </button>
                    </div>
                </div>
            `;
            html += '</div>';
        }
        
        // General study recommendations
        recommendations.forEach(rec => {
            html += `
                <div class="recommendation-item">
                    <span class="rec-icon">${rec.icon}</span>
                    <div class="rec-content">
                        <p>${rec.text}</p>
                        <button class="btn btn-sm btn-outline-primary rec-action">${rec.action}</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    // Generate personalized study plan
    generateStudyPlan() {
        if (!window.studyPlanGenerator) {
            alert('Study plan generator is not available.');
            return;
        }

        const timeFrame = document.getElementById('study-plan-timeframe')?.value || 'medium';
        const quizHistory = this.loadQuizHistory();
        
        if (quizHistory.length === 0) {
            alert('Please take at least one quiz to generate a personalized study plan.');
            return;
        }

        // Create user profile from quiz history
        const userProfile = this.createUserProfile(quizHistory);
        
        // Get weak areas analysis
        const weakAreas = window.bookRecommendationEngine ? 
            window.bookRecommendationEngine.weaknessAnalyzer.analyze(quizHistory) : 
            this.analyzeWeakAreas(quizHistory);

        // Generate the study plan
        const studyPlan = window.studyPlanGenerator.generateStudyPlan(
            userProfile, quizHistory, weakAreas, timeFrame
        );

        // Save the study plan
        const planId = window.studyPlanGenerator.saveStudyPlan(studyPlan);
        
        // Display the study plan
        this.displayStudyPlan(studyPlan);
    }

    createUserProfile(quizHistory) {
        const totalQuizzes = quizHistory.length;
        const totalScore = quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0);
        const averageScore = totalScore / totalQuizzes;
        
        const examCounts = {};
        const subjectCounts = {};
        
        quizHistory.forEach(quiz => {
            examCounts[quiz.exam] = (examCounts[quiz.exam] || 0) + 1;
            subjectCounts[quiz.subject] = (subjectCounts[quiz.subject] || 0) + 1;
        });
        
        const primaryExam = Object.keys(examCounts).reduce((a, b) => 
            examCounts[a] > examCounts[b] ? a : b
        );
        
        const focusSubjects = Object.keys(subjectCounts).sort((a, b) => 
            subjectCounts[b] - subjectCounts[a]
        );

        return {
            totalQuizzes,
            averageScore,
            primaryExam,
            focusSubjects,
            recentPerformance: quizHistory.slice(-5).map(q => q.percentage),
            strongAreas: [],
            improvementNeeded: averageScore < 60
        };
    }

    analyzeWeakAreas(quizHistory) {
        const topicPerformance = {};
        
        quizHistory.forEach(quiz => {
            if (quiz.topicBreakdown) {
                Object.entries(quiz.topicBreakdown).forEach(([topic, performance]) => {
                    if (!topicPerformance[topic]) {
                        topicPerformance[topic] = { correct: 0, total: 0 };
                    }
                    topicPerformance[topic].correct += performance.correct;
                    topicPerformance[topic].total += performance.total;
                });
            }
        });
        
        return Object.entries(topicPerformance)
            .map(([topic, performance]) => ({
                topic,
                accuracy: (performance.correct / performance.total) * 100,
                questionsAttempted: performance.total
            }))
            .filter(area => area.accuracy < 60)
            .sort((a, b) => a.accuracy - b.accuracy);
    }

    displayStudyPlan(studyPlan) {
        // Create a modal to display the study plan
        const modalHtml = `
            <div class="modal fade" id="studyPlanModal" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="fas fa-calendar-alt me-2"></i>${studyPlan.title}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${this.generateStudyPlanHTML(studyPlan)}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" onclick="competitiveQuizBot.downloadStudyPlan('${studyPlan.id}')">
                                <i class="fas fa-download me-2"></i>Download Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('studyPlanModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('studyPlanModal'));
        modal.show();
    }

    generateStudyPlanHTML(plan) {
        let html = `
            <div class="study-plan-overview mb-4">
                <div class="row">
                    <div class="col-md-3 text-center">
                        <div class="metric">
                            <div class="h3 text-primary">${plan.duration}</div>
                            <small>Weeks</small>
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <div class="metric">
                            <div class="h3 text-success">${plan.weeklyHours}</div>
                            <small>Hours/Week</small>
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <div class="metric">
                            <div class="h3 text-info">${plan.totalHours}</div>
                            <small>Total Hours</small>
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <div class="metric">
                            <div class="h3 text-warning">${plan.studyLevel}</div>
                            <small>Level</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (plan.weeks) {
            html += '<h6><i class="fas fa-list-ol me-2"></i>Weekly Breakdown</h6>';
            plan.weeks.forEach(week => {
                html += `
                    <div class="card mb-3">
                        <div class="card-header">
                            <h6 class="mb-0">${week.title}</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>Topics:</strong>
                                    <ul class="small">
                                        ${week.topics.map(topic => `<li>${this.formatTopicName(topic)}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <strong>Goals:</strong>
                                    <ul class="small">
                                        ${week.goals.map(goal => `<li>${goal}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        if (plan.dailySchedule) {
            html += '<h6 class="mt-4"><i class="fas fa-clock me-2"></i>Daily Schedule</h6>';
            html += '<div class="row">';
            plan.dailySchedule.sessions.forEach(session => {
                html += `
                    <div class="col-md-4 mb-2">
                        <div class="card border-left-primary h-100">
                            <div class="card-body py-2">
                                <div class="small font-weight-bold text-primary">${session.time}</div>
                                <div class="small">${session.activity}</div>
                                <div class="text-muted" style="font-size: 0.75rem;">${session.duration} mins</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        if (plan.practiceTargets) {
            html += `
                <h6 class="mt-4"><i class="fas fa-target me-2"></i>Practice Targets</h6>
                <div class="row">
                    <div class="col-md-4">
                        <div class="text-center">
                            <div class="h5 text-info">${plan.practiceTargets.weeklyQuestions}</div>
                            <small>Questions/Week</small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-center">
                            <div class="h5 text-success">${plan.practiceTargets.accuracyTarget}%</div>
                            <small>Target Accuracy</small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-center">
                            <div class="h5 text-warning">${plan.practiceTargets.mockTests}</div>
                            <small>Mock Tests</small>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return html;
    }

    downloadStudyPlan(planId) {
        const plan = window.studyPlanGenerator.getStudyPlan(planId);
        if (!plan) {
            alert('Study plan not found.');
            return;
        }
        
        // Convert plan to downloadable format (text)
        let content = `${plan.title}\n${'='.repeat(plan.title.length)}\n\n`;
        content += `Duration: ${plan.duration} weeks\n`;
        content += `Weekly Hours: ${plan.weeklyHours}\n`;
        content += `Study Level: ${plan.studyLevel}\n\n`;
        
        if (plan.weeks) {
            content += 'WEEKLY BREAKDOWN:\n' + '-'.repeat(20) + '\n';
            plan.weeks.forEach(week => {
                content += `\n${week.title}:\n`;
                content += `Topics: ${week.topics.join(', ')}\n`;
                content += `Goals:\n${week.goals.map(goal => `  - ${goal}`).join('\n')}\n`;
            });
        }
        
        // Create and download file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${plan.title.replace(/\s+/g, '_')}_study_plan.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    formatTopicName(topic) {
        return topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Navigation and utility methods
    retakeQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentQuiz.questions.length).fill(null);
        this.quizStartTime = Date.now();
        this.questionStartTime = Date.now();
        
        document.getElementById('quiz-results').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        
        this.displayCurrentQuestion();
        this.scrollToQuiz();
    }

    startNewQuiz() {
        document.getElementById('competitive-quiz-form').reset();
        document.getElementById('topic-input').value = '';
        
        document.getElementById('quiz-results').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('quiz-setup').style.display = 'block';
        
        this.scrollToSetup();
    }

    // Data persistence methods
    saveQuizResult(results) {
        const result = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            exam: results.exam,
            subject: results.subject,
            topic: results.topic,
            difficulty: results.difficulty,
            score: results.score,
            total: results.total,
            percentage: Math.round(results.percentage),
            grade: results.grade.grade,
            timeTaken: results.timeTaken,
            source: results.source,
            topicBreakdown: results.topicBreakdown
        };

        this.quizHistory.push(result);
        
        // Keep only last 100 results
        if (this.quizHistory.length > 100) {
            this.quizHistory = this.quizHistory.slice(-100);
        }
        
        localStorage.setItem('competitiveQuizHistory', JSON.stringify(this.quizHistory));
        
        // Update user profile
        this.updateUserProfile(results);
    }

    loadQuizHistory() {
        try {
            return JSON.parse(localStorage.getItem('competitiveQuizHistory')) || [];
        } catch {
            return [];
        }
    }

    loadUserProfile() {
        try {
            return JSON.parse(localStorage.getItem('userProfile')) || {
                useAITraining: false,
                preferredDifficulty: 'medium',
                performanceHistory: {},
                totalQuizzesTaken: 0,
                averageScore: 0
            };
        } catch {
            return {
                useAITraining: false,
                preferredDifficulty: 'medium',
                performanceHistory: {},
                totalQuizzesTaken: 0,
                averageScore: 0
            };
        }
    }

    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    updateUserProfile(results) {
        this.userProfile.totalQuizzesTaken++;
        this.userProfile.averageScore = Math.round(
            (this.userProfile.averageScore * (this.userProfile.totalQuizzesTaken - 1) + results.percentage) 
            / this.userProfile.totalQuizzesTaken
        );
        
        // Update performance history for adaptive learning
        const key = `${results.exam}_${results.subject}`;
        if (!this.userProfile.performanceHistory[key]) {
            this.userProfile.performanceHistory[key] = [];
        }
        
        this.userProfile.performanceHistory[key].push({
            score: results.percentage,
            timestamp: Date.now(),
            topic: results.topic
        });
        
        // Keep only last 10 scores per subject
        if (this.userProfile.performanceHistory[key].length > 10) {
            this.userProfile.performanceHistory[key] = this.userProfile.performanceHistory[key].slice(-10);
        }
        
        this.saveUserProfile();
    }

    getUserPerformanceForTopic(topic) {
        const history = this.quizHistory.filter(quiz => 
            quiz.exam === this.selectedExam && 
            quiz.subject === this.selectedSubject &&
            quiz.topic === topic
        );
        
        if (history.length === 0) return 60; // Default average performance
        
        const totalScore = history.reduce((sum, quiz) => sum + quiz.percentage, 0);
        return totalScore / history.length;
    }

    loadSyllabusProgress() {
        try {
            return JSON.parse(localStorage.getItem('syllabusProgress')) || {};
        } catch {
            return {};
        }
    }

    saveSyllabusProgress() {
        localStorage.setItem('syllabusProgress', JSON.stringify(this.syllabusProgress));
    }

    // UI helper methods
    showLoadingScreen(show) {
        document.getElementById('quiz-loading').style.display = show ? 'block' : 'none';
        if (show) {
            document.getElementById('quiz-setup').style.display = 'none';
        }
    }

    showErrorMessage(message) {
        alert(message);
        document.getElementById('quiz-loading').style.display = 'none';
        document.getElementById('quiz-setup').style.display = 'block';
    }

    formatSource(source) {
        const sourceMap = {
            'knowledge-base': 'Knowledge Base',
            'ai-enhanced': 'AI Enhanced',
            'adaptive': 'Adaptive Learning',
            'fallback': 'General Questions'
        };
        return sourceMap[source] || 'Unknown';
    }

    scrollToQuiz() {
        document.getElementById('quiz-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    scrollToResults() {
        document.getElementById('quiz-results').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    scrollToSetup() {
        document.getElementById('quiz-setup').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the competitive quiz page
    if (document.getElementById('competitive-quiz-form')) {
        window.competitiveQuizBot = new CompetitiveQuizBot();
    }
});