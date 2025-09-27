/**
 * ProgressTracker - Comprehensive progress tracking and percentile calculation system
 * Tracks user performance, calculates improvement, and provides global percentile rankings
 */
class ProgressTracker {
    constructor() {
        this.userId = this.generateUserId();
        this.globalStats = this.loadGlobalStats();
        this.userProfile = this.loadUserProfile();
        this.performanceHistory = this.loadPerformanceHistory();
        this.achievements = this.loadAchievements();
        this.weakTopics = [];
        this.strongTopics = [];
    }

    /**
     * Generate unique user ID
     */
    generateUserId() {
        let userId = localStorage.getItem('aicademy_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('aicademy_user_id', userId);
        }
        return userId;
    }

    /**
     * Load global statistics
     */
    loadGlobalStats() {
        const stats = localStorage.getItem('aicademy_global_stats');
        return stats ? JSON.parse(stats) : {
            totalUsers: 1000, // Simulated global user base
            totalQuizzesTaken: 50000,
            averageScore: 65,
            topPerformers: [],
            subjectStats: {},
            lastUpdated: new Date()
        };
    }

    /**
     * Load user profile
     */
    loadUserProfile() {
        const profile = localStorage.getItem(`aicademy_profile_${this.userId}`);
        return profile ? JSON.parse(profile) : {
            userId: this.userId,
            username: 'Student',
            registrationDate: new Date(),
            totalQuizzesTaken: 0,
            totalTimeSaved: 0,
            averageScore: 0,
            currentStreak: 0,
            longestStreak: 0,
            level: 1,
            experiencePoints: 0,
            preferredSubjects: [],
            studyGoals: {},
            lastActive: new Date()
        };
    }

    /**
     * Load performance history
     */
    loadPerformanceHistory() {
        const history = localStorage.getItem(`aicademy_history_${this.userId}`);
        return history ? JSON.parse(history) : [];
    }

    /**
     * Load achievements
     */
    loadAchievements() {
        const achievements = localStorage.getItem(`aicademy_achievements_${this.userId}`);
        return achievements ? JSON.parse(achievements) : {
            unlocked: [],
            inProgress: [],
            available: this.getAvailableAchievements()
        };
    }

    /**
     * Record quiz performance
     */
    recordQuizPerformance(quizResult) {
        const performanceRecord = {
            id: Date.now(),
            timestamp: new Date(),
            exam: quizResult.exam,
            subject: quizResult.subject,
            topic: quizResult.topic || 'General',
            score: quizResult.score,
            totalQuestions: quizResult.totalQuestions,
            percentage: quizResult.percentage,
            timeSpent: quizResult.timeSpent || 0,
            difficulty: quizResult.difficulty || 'medium',
            source: quizResult.source || 'default',
            correctAnswers: quizResult.correctAnswers || [],
            incorrectAnswers: quizResult.incorrectAnswers || [],
            topicBreakdown: quizResult.topicBreakdown || {}
        };

        // Add to performance history
        this.performanceHistory.push(performanceRecord);

        // Keep only last 200 records per user
        if (this.performanceHistory.length > 200) {
            this.performanceHistory = this.performanceHistory.slice(-200);
        }

        // Update user profile
        this.updateUserProfile(performanceRecord);

        // Update weak/strong topics
        this.updateTopicAnalysis(performanceRecord);

        // Check for achievements
        this.checkAchievements(performanceRecord);

        // Update global stats
        this.updateGlobalStats(performanceRecord);

        // Save everything
        this.saveAllData();

        return this.getDetailedProgress();
    }

    /**
     * Update user profile based on new quiz result
     */
    updateUserProfile(performanceRecord) {
        this.userProfile.totalQuizzesTaken++;
        this.userProfile.totalTimeSaved += performanceRecord.timeSpent;
        this.userProfile.lastActive = new Date();

        // Calculate new average score
        const totalScore = (this.userProfile.averageScore * (this.userProfile.totalQuizzesTaken - 1)) + performanceRecord.percentage;
        this.userProfile.averageScore = Math.round(totalScore / this.userProfile.totalQuizzesTaken);

        // Update streak
        const today = new Date().toDateString();
        const lastQuizDate = this.performanceHistory.length > 1 ? 
            new Date(this.performanceHistory[this.performanceHistory.length - 2].timestamp).toDateString() : null;

        if (lastQuizDate && lastQuizDate !== today) {
            const daysDiff = Math.floor((new Date() - new Date(lastQuizDate)) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
                this.userProfile.currentStreak++;
            } else if (daysDiff > 1) {
                this.userProfile.currentStreak = 1;
            }
        } else if (!lastQuizDate) {
            this.userProfile.currentStreak = 1;
        }

        // Update longest streak
        if (this.userProfile.currentStreak > this.userProfile.longestStreak) {
            this.userProfile.longestStreak = this.userProfile.currentStreak;
        }

        // Update experience points and level
        const pointsEarned = Math.round(performanceRecord.percentage / 10) + (performanceRecord.difficulty === 'hard' ? 5 : performanceRecord.difficulty === 'medium' ? 3 : 1);
        this.userProfile.experiencePoints += pointsEarned;

        // Level up system
        const newLevel = Math.floor(this.userProfile.experiencePoints / 100) + 1;
        if (newLevel > this.userProfile.level) {
            this.userProfile.level = newLevel;
            // Level up achievement
            this.unlockAchievement('LEVEL_UP', `Reached Level ${newLevel}!`);
        }

        // Update preferred subjects
        if (!this.userProfile.preferredSubjects.includes(performanceRecord.subject)) {
            this.userProfile.preferredSubjects.push(performanceRecord.subject);
        }
    }

    /**
     * Update topic analysis (weak/strong topics)
     */
    updateTopicAnalysis(performanceRecord) {
        if (!performanceRecord.topicBreakdown) return;

        Object.entries(performanceRecord.topicBreakdown).forEach(([topic, performance]) => {
            const accuracy = (performance.correct / performance.total) * 100;
            
            // Remove from existing arrays
            this.weakTopics = this.weakTopics.filter(t => t.topic !== topic);
            this.strongTopics = this.strongTopics.filter(t => t.topic !== topic);

            // Add to appropriate array
            if (accuracy < 60) {
                this.weakTopics.push({
                    topic,
                    accuracy,
                    attempts: performance.total,
                    subject: performanceRecord.subject,
                    lastAttempt: new Date()
                });
            } else if (accuracy > 80) {
                this.strongTopics.push({
                    topic,
                    accuracy,
                    attempts: performance.total,
                    subject: performanceRecord.subject,
                    lastAttempt: new Date()
                });
            }
        });

        // Keep only top 20 weak and strong topics
        this.weakTopics = this.weakTopics
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 20);

        this.strongTopics = this.strongTopics
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, 20);
    }

    /**
     * Check and unlock achievements
     */
    checkAchievements(performanceRecord) {
        const achievements = [
            {
                id: 'FIRST_QUIZ',
                name: 'First Steps',
                description: 'Complete your first quiz',
                condition: () => this.userProfile.totalQuizzesTaken >= 1,
                points: 10
            },
            {
                id: 'QUIZ_MASTER_10',
                name: 'Quiz Master',
                description: 'Complete 10 quizzes',
                condition: () => this.userProfile.totalQuizzesTaken >= 10,
                points: 50
            },
            {
                id: 'PERFECT_SCORE',
                name: 'Perfect Score',
                description: 'Score 100% on any quiz',
                condition: () => performanceRecord.percentage === 100,
                points: 25
            },
            {
                id: 'HIGH_SCORER',
                name: 'High Scorer',
                description: 'Score above 90% on 5 consecutive quizzes',
                condition: () => this.checkConsecutiveHighScores(5, 90),
                points: 100
            },
            {
                id: 'STREAK_5',
                name: '5 Day Streak',
                description: 'Take quizzes for 5 consecutive days',
                condition: () => this.userProfile.currentStreak >= 5,
                points: 75
            },
            {
                id: 'SUBJECT_EXPERT',
                name: 'Subject Expert',
                description: 'Average 85%+ in any subject over 10 quizzes',
                condition: () => this.checkSubjectExpertise(),
                points: 150
            }
        ];

        achievements.forEach(achievement => {
            if (!this.achievements.unlocked.includes(achievement.id) && achievement.condition()) {
                this.unlockAchievement(achievement.id, achievement.name, achievement.description, achievement.points);
            }
        });
    }

    /**
     * Check consecutive high scores
     */
    checkConsecutiveHighScores(count, threshold) {
        if (this.performanceHistory.length < count) return false;
        
        const recentQuizzes = this.performanceHistory.slice(-count);
        return recentQuizzes.every(quiz => quiz.percentage >= threshold);
    }

    /**
     * Check subject expertise
     */
    checkSubjectExpertise() {
        const subjectStats = {};
        
        this.performanceHistory.forEach(quiz => {
            if (!subjectStats[quiz.subject]) {
                subjectStats[quiz.subject] = { total: 0, sum: 0 };
            }
            subjectStats[quiz.subject].total++;
            subjectStats[quiz.subject].sum += quiz.percentage;
        });

        return Object.values(subjectStats).some(stats => 
            stats.total >= 10 && (stats.sum / stats.total) >= 85
        );
    }

    /**
     * Unlock achievement
     */
    unlockAchievement(id, name, description, points) {
        if (!this.achievements.unlocked.includes(id)) {
            this.achievements.unlocked.push(id);
            this.userProfile.experiencePoints += points || 0;
            
            // Show achievement notification
            this.showAchievementNotification(name, description, points);
        }
    }

    /**
     * Update global statistics
     */
    updateGlobalStats(performanceRecord) {
        this.globalStats.totalQuizzesTaken++;
        
        // Update average score
        const totalScore = (this.globalStats.averageScore * (this.globalStats.totalQuizzesTaken - 1)) + performanceRecord.percentage;
        this.globalStats.averageScore = Math.round(totalScore / this.globalStats.totalQuizzesTaken);

        // Update subject stats
        if (!this.globalStats.subjectStats[performanceRecord.subject]) {
            this.globalStats.subjectStats[performanceRecord.subject] = {
                totalAttempts: 0,
                averageScore: 0,
                totalScore: 0
            };
        }

        const subjectStat = this.globalStats.subjectStats[performanceRecord.subject];
        subjectStat.totalAttempts++;
        subjectStat.totalScore += performanceRecord.percentage;
        subjectStat.averageScore = Math.round(subjectStat.totalScore / subjectStat.totalAttempts);

        this.globalStats.lastUpdated = new Date();
    }

    /**
     * Calculate user percentile
     */
    calculatePercentile() {
        // Simulate percentile calculation based on average score
        const userAverage = this.userProfile.averageScore;
        const globalAverage = this.globalStats.averageScore;
        
        let percentile;
        if (userAverage >= 95) percentile = 99;
        else if (userAverage >= 90) percentile = 95;
        else if (userAverage >= 85) percentile = 85;
        else if (userAverage >= 80) percentile = 75;
        else if (userAverage >= 75) percentile = 65;
        else if (userAverage >= 70) percentile = 50;
        else if (userAverage >= 65) percentile = 35;
        else if (userAverage >= 60) percentile = 25;
        else if (userAverage >= 55) percentile = 15;
        else percentile = 5;

        // Add some variation based on quiz count and streak
        const bonusFromQuizzes = Math.min(this.userProfile.totalQuizzesTaken / 2, 10);
        const bonusFromStreak = Math.min(this.userProfile.currentStreak, 5);
        
        percentile = Math.min(99, percentile + bonusFromQuizzes + bonusFromStreak);
        
        return Math.round(percentile);
    }

    /**
     * Get detailed progress report
     */
    getDetailedProgress() {
        const percentile = this.calculatePercentile();
        const recentPerformance = this.getRecentPerformanceTrend();
        const subjectWiseProgress = this.getSubjectWiseProgress();
        const improvementAreas = this.getImprovementAreas();
        
        return {
            userProfile: this.userProfile,
            percentile: percentile,
            rank: this.calculateRank(percentile),
            recentTrend: recentPerformance.trend,
            performanceChange: recentPerformance.change,
            subjectProgress: subjectWiseProgress,
            weakTopics: this.weakTopics.slice(0, 10),
            strongTopics: this.strongTopics.slice(0, 10),
            improvementAreas: improvementAreas,
            achievements: this.achievements,
            nextLevelProgress: this.getNextLevelProgress(),
            studyRecommendations: this.getStudyRecommendations(),
            globalComparison: {
                userAverage: this.userProfile.averageScore,
                globalAverage: this.globalStats.averageScore,
                betterThanPercent: percentile
            },
            statistics: {
                totalQuizzes: this.userProfile.totalQuizzesTaken,
                averageScore: this.userProfile.averageScore,
                currentStreak: this.userProfile.currentStreak,
                longestStreak: this.userProfile.longestStreak,
                level: this.userProfile.level,
                experiencePoints: this.userProfile.experiencePoints
            }
        };
    }

    /**
     * Get recent performance trend
     */
    getRecentPerformanceTrend() {
        if (this.performanceHistory.length < 5) {
            return { trend: 'insufficient_data', change: 0 };
        }

        const recent5 = this.performanceHistory.slice(-5);
        const previous5 = this.performanceHistory.slice(-10, -5);
        
        if (previous5.length === 0) {
            return { trend: 'insufficient_data', change: 0 };
        }

        const recentAvg = recent5.reduce((sum, quiz) => sum + quiz.percentage, 0) / recent5.length;
        const previousAvg = previous5.reduce((sum, quiz) => sum + quiz.percentage, 0) / previous5.length;
        
        const change = recentAvg - previousAvg;
        
        let trend;
        if (change > 5) trend = 'improving';
        else if (change < -5) trend = 'declining';
        else trend = 'stable';
        
        return { trend, change: Math.round(change) };
    }

    /**
     * Get subject-wise progress
     */
    getSubjectWiseProgress() {
        const subjects = {};
        
        this.performanceHistory.forEach(quiz => {
            if (!subjects[quiz.subject]) {
                subjects[quiz.subject] = {
                    quizzes: [],
                    totalQuizzes: 0,
                    averageScore: 0,
                    bestScore: 0,
                    recentTrend: 'stable'
                };
            }
            
            subjects[quiz.subject].quizzes.push(quiz.percentage);
            subjects[quiz.subject].totalQuizzes++;
            
            if (quiz.percentage > subjects[quiz.subject].bestScore) {
                subjects[quiz.subject].bestScore = quiz.percentage;
            }
        });

        // Calculate averages and trends
        Object.keys(subjects).forEach(subject => {
            const subjectData = subjects[subject];
            subjectData.averageScore = Math.round(
                subjectData.quizzes.reduce((sum, score) => sum + score, 0) / subjectData.quizzes.length
            );
            
            // Calculate trend for recent quizzes
            if (subjectData.quizzes.length >= 4) {
                const recent = subjectData.quizzes.slice(-2);
                const previous = subjectData.quizzes.slice(-4, -2);
                
                const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
                const previousAvg = previous.reduce((sum, score) => sum + score, 0) / previous.length;
                
                const change = recentAvg - previousAvg;
                
                if (change > 5) subjectData.recentTrend = 'improving';
                else if (change < -5) subjectData.recentTrend = 'declining';
                else subjectData.recentTrend = 'stable';
            }
        });

        return subjects;
    }

    /**
     * Get improvement areas
     */
    getImprovementAreas() {
        const areas = [];
        
        // Weak subjects
        const subjectProgress = this.getSubjectWiseProgress();
        Object.entries(subjectProgress).forEach(([subject, data]) => {
            if (data.averageScore < 70) {
                areas.push({
                    type: 'subject',
                    name: subject,
                    currentScore: data.averageScore,
                    priority: data.averageScore < 50 ? 'high' : 'medium',
                    recommendation: `Focus on ${subject} fundamentals`
                });
            }
        });

        // Weak topics
        this.weakTopics.slice(0, 5).forEach(topic => {
            areas.push({
                type: 'topic',
                name: topic.topic,
                subject: topic.subject,
                currentScore: topic.accuracy,
                priority: topic.accuracy < 40 ? 'high' : 'medium',
                recommendation: `Practice ${topic.topic} questions`
            });
        });

        return areas.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    /**
     * Calculate rank based on percentile
     */
    calculateRank(percentile) {
        const totalUsers = this.globalStats.totalUsers;
        const rank = Math.ceil((100 - percentile) * totalUsers / 100);
        return rank;
    }

    /**
     * Get next level progress
     */
    getNextLevelProgress() {
        const currentLevelXP = (this.userProfile.level - 1) * 100;
        const nextLevelXP = this.userProfile.level * 100;
        const currentXP = this.userProfile.experiencePoints;
        
        return {
            currentLevel: this.userProfile.level,
            nextLevel: this.userProfile.level + 1,
            currentXP: currentXP,
            xpInCurrentLevel: currentXP - currentLevelXP,
            xpNeededForNext: nextLevelXP - currentXP,
            progressPercent: Math.round(((currentXP - currentLevelXP) / 100) * 100)
        };
    }

    /**
     * Get study recommendations
     */
    getStudyRecommendations() {
        const recommendations = [];
        
        // Based on weak topics
        this.weakTopics.slice(0, 3).forEach(topic => {
            recommendations.push({
                type: 'topic_improvement',
                title: `Strengthen ${topic.topic}`,
                description: `Your accuracy in ${topic.topic} is ${Math.round(topic.accuracy)}%. Practice more questions in this area.`,
                priority: 'high',
                estimatedTime: '30-45 minutes',
                subject: topic.subject
            });
        });

        // Based on streak
        if (this.userProfile.currentStreak < 3) {
            recommendations.push({
                type: 'consistency',
                title: 'Build Study Consistency',
                description: 'Take quizzes daily to build your streak and improve retention.',
                priority: 'medium',
                estimatedTime: '15-20 minutes daily'
            });
        }

        // Based on recent performance
        const recentTrend = this.getRecentPerformanceTrend();
        if (recentTrend.trend === 'declining') {
            recommendations.push({
                type: 'performance_recovery',
                title: 'Performance Recovery',
                description: 'Your recent scores have declined. Consider reviewing fundamental concepts.',
                priority: 'high',
                estimatedTime: '1-2 hours'
            });
        }

        return recommendations.slice(0, 5);
    }

    /**
     * Get available achievements
     */
    getAvailableAchievements() {
        return [
            { id: 'FIRST_QUIZ', name: 'First Steps', description: 'Complete your first quiz' },
            { id: 'QUIZ_MASTER_10', name: 'Quiz Master', description: 'Complete 10 quizzes' },
            { id: 'QUIZ_MASTER_50', name: 'Quiz Expert', description: 'Complete 50 quizzes' },
            { id: 'PERFECT_SCORE', name: 'Perfect Score', description: 'Score 100% on any quiz' },
            { id: 'HIGH_SCORER', name: 'High Scorer', description: 'Score above 90% on 5 consecutive quizzes' },
            { id: 'STREAK_5', name: '5 Day Streak', description: 'Take quizzes for 5 consecutive days' },
            { id: 'STREAK_10', name: '10 Day Streak', description: 'Take quizzes for 10 consecutive days' },
            { id: 'SUBJECT_EXPERT', name: 'Subject Expert', description: 'Average 85%+ in any subject over 10 quizzes' },
            { id: 'SPEED_DEMON', name: 'Speed Demon', description: 'Complete a quiz in under 2 minutes' },
            { id: 'LEVEL_10', name: 'Level 10 Achieved', description: 'Reach level 10' }
        ];
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(name, description, points) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h4>Achievement Unlocked!</h4>
                    <h5>${name}</h5>
                    <p>${description}</p>
                    ${points ? `<span class="points">+${points} XP</span>` : ''}
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }

    /**
     * Save all data to localStorage
     */
    saveAllData() {
        localStorage.setItem('aicademy_global_stats', JSON.stringify(this.globalStats));
        localStorage.setItem(`aicademy_profile_${this.userId}`, JSON.stringify(this.userProfile));
        localStorage.setItem(`aicademy_history_${this.userId}`, JSON.stringify(this.performanceHistory));
        localStorage.setItem(`aicademy_achievements_${this.userId}`, JSON.stringify(this.achievements));
    }

    /**
     * Export progress data
     */
    exportProgressData() {
        const data = {
            profile: this.userProfile,
            history: this.performanceHistory,
            achievements: this.achievements,
            exportDate: new Date()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aicademy_progress_${this.userId}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        window.URL.revokeObjectURL(url);
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.ProgressTracker = ProgressTracker;
    window.progressTracker = new ProgressTracker();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressTracker;
}