/**
 * LeaderboardSystem - Comprehensive ranking and competitive features
 * Manages global leaderboards, subject rankings, and competitive elements
 */
class LeaderboardSystem {
    constructor() {
        this.leaderboards = this.loadLeaderboards();
        this.userRankings = this.loadUserRankings();
        this.competitions = this.loadCompetitions();
        this.refreshInterval = 5 * 60 * 1000; // 5 minutes
        this.startAutoRefresh();
    }

    /**
     * Load existing leaderboards
     */
    loadLeaderboards() {
        const data = localStorage.getItem('aicademy_leaderboards');
        return data ? JSON.parse(data) : {
            global: {
                allTime: [],
                weekly: [],
                monthly: []
            },
            subjects: {},
            exams: {},
            lastUpdated: new Date()
        };
    }

    /**
     * Load user rankings
     */
    loadUserRankings() {
        const data = localStorage.getItem('aicademy_user_rankings');
        return data ? JSON.parse(data) : {};
    }

    /**
     * Load competitions data
     */
    loadCompetitions() {
        const data = localStorage.getItem('aicademy_competitions');
        return data ? JSON.parse(data) : {
            active: [],
            completed: [],
            upcoming: []
        };
    }

    /**
     * Update user score and ranking
     */
    updateUserScore(userId, quizResult) {
        const userKey = userId || window.progressTracker?.userId || 'anonymous_user';
        const userName = this.getUserName(userKey);
        
        // Calculate points based on performance
        const points = this.calculatePoints(quizResult);
        
        // Update user ranking data
        if (!this.userRankings[userKey]) {
            this.userRankings[userKey] = {
                userId: userKey,
                username: userName,
                totalPoints: 0,
                totalQuizzes: 0,
                averageScore: 0,
                bestScore: 0,
                subjects: {},
                exams: {},
                achievements: [],
                joinDate: new Date(),
                lastActive: new Date()
            };
        }

        const userRank = this.userRankings[userKey];
        userRank.totalQuizzes++;
        userRank.totalPoints += points;
        userRank.lastActive = new Date();

        // Update average score
        userRank.averageScore = Math.round(
            ((userRank.averageScore * (userRank.totalQuizzes - 1)) + quizResult.percentage) / userRank.totalQuizzes
        );

        // Update best score
        if (quizResult.percentage > userRank.bestScore) {
            userRank.bestScore = quizResult.percentage;
        }

        // Update subject-specific data
        const subject = quizResult.subject || 'General';
        if (!userRank.subjects[subject]) {
            userRank.subjects[subject] = {
                points: 0,
                quizzes: 0,
                averageScore: 0,
                bestScore: 0
            };
        }

        const subjectRank = userRank.subjects[subject];
        subjectRank.quizzes++;
        subjectRank.points += points;
        subjectRank.averageScore = Math.round(
            ((subjectRank.averageScore * (subjectRank.quizzes - 1)) + quizResult.percentage) / subjectRank.quizzes
        );
        if (quizResult.percentage > subjectRank.bestScore) {
            subjectRank.bestScore = quizResult.percentage;
        }

        // Update exam-specific data
        const exam = quizResult.exam || 'General';
        if (!userRank.exams[exam]) {
            userRank.exams[exam] = {
                points: 0,
                quizzes: 0,
                averageScore: 0,
                bestScore: 0
            };
        }

        const examRank = userRank.exams[exam];
        examRank.quizzes++;
        examRank.points += points;
        examRank.averageScore = Math.round(
            ((examRank.averageScore * (examRank.quizzes - 1)) + quizResult.percentage) / examRank.quizzes
        );
        if (quizResult.percentage > examRank.bestScore) {
            examRank.bestScore = quizResult.percentage;
        }

        // Update leaderboards
        this.updateLeaderboards();
        
        // Save data
        this.saveData();

        return {
            pointsEarned: points,
            newRank: this.getUserRank(userKey, 'global', 'allTime'),
            totalPoints: userRank.totalPoints,
            achievements: this.checkRankingAchievements(userKey, userRank)
        };
    }

    /**
     * Calculate points based on quiz performance
     */
    calculatePoints(quizResult) {
        let basePoints = Math.round(quizResult.percentage / 10); // 0-10 base points
        
        // Bonus for difficulty
        const difficultyBonus = {
            'easy': 0,
            'medium': 2,
            'hard': 5
        };
        basePoints += difficultyBonus[quizResult.difficulty] || 0;

        // Bonus for question count
        const questionBonus = Math.floor((quizResult.totalQuestions || 10) / 5);
        basePoints += questionBonus;

        // Time bonus (faster completion = more points)
        if (quizResult.timeSpent) {
            const timeBonus = Math.max(0, 5 - Math.floor(quizResult.timeSpent / 60));
            basePoints += timeBonus;
        }

        // Perfect score bonus
        if (quizResult.percentage === 100) {
            basePoints += 10;
        }

        // High score bonus
        if (quizResult.percentage >= 90) {
            basePoints += 5;
        } else if (quizResult.percentage >= 80) {
            basePoints += 3;
        }

        return Math.max(1, basePoints); // Minimum 1 point
    }

    /**
     * Update all leaderboards
     */
    updateLeaderboards() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Global leaderboards
        const allUsers = Object.values(this.userRankings);

        // All-time leaderboard
        this.leaderboards.global.allTime = allUsers
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .slice(0, 100)
            .map((user, index) => ({
                rank: index + 1,
                userId: user.userId,
                username: user.username,
                points: user.totalPoints,
                averageScore: user.averageScore,
                totalQuizzes: user.totalQuizzes,
                badge: this.getRankBadge(index + 1)
            }));

        // Weekly leaderboard (simulated based on recent activity)
        this.leaderboards.global.weekly = allUsers
            .filter(user => new Date(user.lastActive) > weekAgo)
            .sort((a, b) => {
                // Simulate weekly points
                const aWeeklyPoints = Math.round(a.totalPoints * 0.1);
                const bWeeklyPoints = Math.round(b.totalPoints * 0.1);
                return bWeeklyPoints - aWeeklyPoints;
            })
            .slice(0, 50)
            .map((user, index) => ({
                rank: index + 1,
                userId: user.userId,
                username: user.username,
                points: Math.round(user.totalPoints * 0.1),
                averageScore: user.averageScore,
                totalQuizzes: user.totalQuizzes,
                badge: this.getRankBadge(index + 1)
            }));

        // Monthly leaderboard
        this.leaderboards.global.monthly = allUsers
            .filter(user => new Date(user.lastActive) > monthAgo)
            .sort((a, b) => {
                const aMonthlyPoints = Math.round(a.totalPoints * 0.3);
                const bMonthlyPoints = Math.round(b.totalPoints * 0.3);
                return bMonthlyPoints - aMonthlyPoints;
            })
            .slice(0, 75)
            .map((user, index) => ({
                rank: index + 1,
                userId: user.userId,
                username: user.username,
                points: Math.round(user.totalPoints * 0.3),
                averageScore: user.averageScore,
                totalQuizzes: user.totalQuizzes,
                badge: this.getRankBadge(index + 1)
            }));

        // Subject-wise leaderboards
        this.updateSubjectLeaderboards();

        // Exam-wise leaderboards
        this.updateExamLeaderboards();

        this.leaderboards.lastUpdated = new Date();
    }

    /**
     * Update subject-wise leaderboards
     */
    updateSubjectLeaderboards() {
        const subjects = new Set();
        Object.values(this.userRankings).forEach(user => {
            Object.keys(user.subjects).forEach(subject => subjects.add(subject));
        });

        subjects.forEach(subject => {
            const subjectUsers = Object.values(this.userRankings)
                .filter(user => user.subjects[subject])
                .map(user => ({
                    userId: user.userId,
                    username: user.username,
                    points: user.subjects[subject].points,
                    averageScore: user.subjects[subject].averageScore,
                    totalQuizzes: user.subjects[subject].quizzes,
                    bestScore: user.subjects[subject].bestScore
                }))
                .sort((a, b) => b.points - a.points)
                .slice(0, 50);

            this.leaderboards.subjects[subject] = subjectUsers.map((user, index) => ({
                ...user,
                rank: index + 1,
                badge: this.getRankBadge(index + 1)
            }));
        });
    }

    /**
     * Update exam-wise leaderboards
     */
    updateExamLeaderboards() {
        const exams = new Set();
        Object.values(this.userRankings).forEach(user => {
            Object.keys(user.exams).forEach(exam => exams.add(exam));
        });

        exams.forEach(exam => {
            const examUsers = Object.values(this.userRankings)
                .filter(user => user.exams[exam])
                .map(user => ({
                    userId: user.userId,
                    username: user.username,
                    points: user.exams[exam].points,
                    averageScore: user.exams[exam].averageScore,
                    totalQuizzes: user.exams[exam].quizzes,
                    bestScore: user.exams[exam].bestScore
                }))
                .sort((a, b) => b.points - a.points)
                .slice(0, 50);

            this.leaderboards.exams[exam] = examUsers.map((user, index) => ({
                ...user,
                rank: index + 1,
                badge: this.getRankBadge(index + 1)
            }));
        });
    }

    /**
     * Get rank badge based on position
     */
    getRankBadge(rank) {
        if (rank === 1) return { icon: '👑', name: 'Champion', color: '#FFD700' };
        if (rank === 2) return { icon: '🥈', name: 'Runner-up', color: '#C0C0C0' };
        if (rank === 3) return { icon: '🥉', name: 'Third Place', color: '#CD7F32' };
        if (rank <= 10) return { icon: '⭐', name: 'Top 10', color: '#4CAF50' };
        if (rank <= 25) return { icon: '🔥', name: 'Top 25', color: '#FF9800' };
        if (rank <= 50) return { icon: '📈', name: 'Rising Star', color: '#2196F3' };
        return { icon: '👤', name: 'Participant', color: '#9E9E9E' };
    }

    /**
     * Get user's rank in specific leaderboard
     */
    getUserRank(userId, type = 'global', period = 'allTime') {
        let leaderboard;
        
        if (type === 'global') {
            leaderboard = this.leaderboards.global[period];
        } else if (type === 'subject') {
            leaderboard = this.leaderboards.subjects[period];
        } else if (type === 'exam') {
            leaderboard = this.leaderboards.exams[period];
        }

        if (!leaderboard) return null;

        const userEntry = leaderboard.find(entry => entry.userId === userId);
        return userEntry ? userEntry.rank : null;
    }

    /**
     * Get leaderboard data
     */
    getLeaderboard(type = 'global', category = 'allTime', limit = 50) {
        let leaderboard;

        if (type === 'global') {
            leaderboard = this.leaderboards.global[category] || [];
        } else if (type === 'subject') {
            leaderboard = this.leaderboards.subjects[category] || [];
        } else if (type === 'exam') {
            leaderboard = this.leaderboards.exams[category] || [];
        }

        return leaderboard.slice(0, limit);
    }

    /**
     * Get user's comprehensive ranking info
     */
    getUserRankingInfo(userId) {
        const userKey = userId || window.progressTracker?.userId;
        const userRank = this.userRankings[userKey];

        if (!userRank) {
            return {
                found: false,
                message: 'User not found in rankings'
            };
        }

        return {
            found: true,
            profile: userRank,
            globalRank: {
                allTime: this.getUserRank(userKey, 'global', 'allTime'),
                weekly: this.getUserRank(userKey, 'global', 'weekly'),
                monthly: this.getUserRank(userKey, 'global', 'monthly')
            },
            subjectRanks: Object.keys(userRank.subjects).reduce((acc, subject) => {
                acc[subject] = this.getUserRank(userKey, 'subject', subject);
                return acc;
            }, {}),
            examRanks: Object.keys(userRank.exams).reduce((acc, exam) => {
                acc[exam] = this.getUserRank(userKey, 'exam', exam);
                return acc;
            }, {}),
            nearbyUsers: this.getNearbyUsers(userKey),
            percentile: this.calculateUserPercentile(userKey)
        };
    }

    /**
     * Get users near the specified user's rank
     */
    getNearbyUsers(userId, range = 3) {
        const globalRank = this.getUserRank(userId, 'global', 'allTime');
        if (!globalRank) return [];

        const leaderboard = this.leaderboards.global.allTime;
        const startIndex = Math.max(0, globalRank - range - 1);
        const endIndex = Math.min(leaderboard.length, globalRank + range);

        return leaderboard.slice(startIndex, endIndex);
    }

    /**
     * Calculate user's percentile
     */
    calculateUserPercentile(userId) {
        const globalRank = this.getUserRank(userId, 'global', 'allTime');
        if (!globalRank) return 0;

        const totalUsers = Object.keys(this.userRankings).length;
        return Math.round(((totalUsers - globalRank) / totalUsers) * 100);
    }

    /**
     * Check for ranking achievements
     */
    checkRankingAchievements(userId, userRank) {
        const achievements = [];
        const globalRank = this.getUserRank(userId, 'global', 'allTime');

        // Rank-based achievements
        if (globalRank === 1) {
            achievements.push({
                id: 'GLOBAL_CHAMPION',
                name: 'Global Champion',
                description: 'Reached #1 on the global leaderboard!',
                icon: '👑',
                rarity: 'legendary'
            });
        } else if (globalRank <= 3) {
            achievements.push({
                id: 'TOP_3_GLOBAL',
                name: 'Top 3 Global',
                description: 'Reached top 3 on the global leaderboard!',
                icon: '🏆',
                rarity: 'epic'
            });
        } else if (globalRank <= 10) {
            achievements.push({
                id: 'TOP_10_GLOBAL',
                name: 'Top 10 Global',
                description: 'Reached top 10 on the global leaderboard!',
                icon: '⭐',
                rarity: 'rare'
            });
        }

        // Points-based achievements
        if (userRank.totalPoints >= 10000) {
            achievements.push({
                id: 'POINT_MASTER_10K',
                name: 'Point Master',
                description: 'Earned 10,000 points!',
                icon: '💎',
                rarity: 'epic'
            });
        } else if (userRank.totalPoints >= 5000) {
            achievements.push({
                id: 'POINT_COLLECTOR_5K',
                name: 'Point Collector',
                description: 'Earned 5,000 points!',
                icon: '💰',
                rarity: 'rare'
            });
        } else if (userRank.totalPoints >= 1000) {
            achievements.push({
                id: 'POINT_EARNER_1K',
                name: 'Point Earner',
                description: 'Earned 1,000 points!',
                icon: '🪙',
                rarity: 'common'
            });
        }

        // Subject mastery achievements
        Object.entries(userRank.subjects).forEach(([subject, data]) => {
            const subjectRank = this.getUserRank(userId, 'subject', subject);
            if (subjectRank === 1) {
                achievements.push({
                    id: `SUBJECT_MASTER_${subject.toUpperCase()}`,
                    name: `${subject} Master`,
                    description: `#1 in ${subject}!`,
                    icon: '📚',
                    rarity: 'rare'
                });
            }
        });

        return achievements.filter(achievement => 
            !userRank.achievements.some(existing => existing.id === achievement.id)
        );
    }

    /**
     * Get user name from profile or generate one
     */
    getUserName(userId) {
        if (window.progressTracker && window.progressTracker.userProfile) {
            return window.progressTracker.userProfile.username || `User${userId.slice(-4)}`;
        }
        return `User${userId.slice(-4)}`;
    }

    /**
     * Create or join a competition
     */
    createCompetition(competitionData) {
        const competition = {
            id: 'comp_' + Date.now(),
            title: competitionData.title,
            description: competitionData.description,
            type: competitionData.type || 'quiz', // quiz, speed, accuracy
            subject: competitionData.subject,
            exam: competitionData.exam,
            startDate: new Date(competitionData.startDate),
            endDate: new Date(competitionData.endDate),
            participants: [],
            prizes: competitionData.prizes || [],
            rules: competitionData.rules || [],
            status: 'upcoming',
            createdBy: competitionData.createdBy || 'system',
            maxParticipants: competitionData.maxParticipants || 1000,
            entryRequirements: competitionData.entryRequirements || {}
        };

        this.competitions.upcoming.push(competition);
        this.saveData();
        
        return competition.id;
    }

    /**
     * Join a competition
     */
    joinCompetition(competitionId, userId) {
        const competition = this.findCompetition(competitionId);
        if (!competition) return { success: false, error: 'Competition not found' };

        if (competition.status !== 'upcoming' && competition.status !== 'active') {
            return { success: false, error: 'Competition is not open for registration' };
        }

        if (competition.participants.length >= competition.maxParticipants) {
            return { success: false, error: 'Competition is full' };
        }

        if (competition.participants.some(p => p.userId === userId)) {
            return { success: false, error: 'Already registered for this competition' };
        }

        competition.participants.push({
            userId: userId,
            username: this.getUserName(userId),
            joinedAt: new Date(),
            score: 0,
            rank: 0
        });

        this.saveData();
        return { success: true, message: 'Successfully joined competition' };
    }

    /**
     * Find competition by ID
     */
    findCompetition(competitionId) {
        const allCompetitions = [
            ...this.competitions.active,
            ...this.competitions.upcoming,
            ...this.competitions.completed
        ];
        
        return allCompetitions.find(comp => comp.id === competitionId);
    }

    /**
     * Get active competitions
     */
    getActiveCompetitions() {
        return this.competitions.active.filter(comp => 
            new Date() >= comp.startDate && new Date() <= comp.endDate
        );
    }

    /**
     * Get upcoming competitions
     */
    getUpcomingCompetitions() {
        return this.competitions.upcoming.filter(comp => 
            new Date() < comp.startDate
        );
    }

    /**
     * Start auto-refresh of leaderboards
     */
    startAutoRefresh() {
        setInterval(() => {
            this.updateLeaderboards();
        }, this.refreshInterval);
    }

    /**
     * Save all data to localStorage
     */
    saveData() {
        localStorage.setItem('aicademy_leaderboards', JSON.stringify(this.leaderboards));
        localStorage.setItem('aicademy_user_rankings', JSON.stringify(this.userRankings));
        localStorage.setItem('aicademy_competitions', JSON.stringify(this.competitions));
    }

    /**
     * Reset all leaderboards (admin function)
     */
    resetLeaderboards() {
        this.leaderboards = {
            global: { allTime: [], weekly: [], monthly: [] },
            subjects: {},
            exams: {},
            lastUpdated: new Date()
        };
        this.userRankings = {};
        this.competitions = { active: [], completed: [], upcoming: [] };
        this.saveData();
    }

    /**
     * Generate leaderboard HTML for display
     */
    generateLeaderboardHTML(type = 'global', category = 'allTime', limit = 10) {
        const leaderboard = this.getLeaderboard(type, category, limit);
        const currentUserId = window.progressTracker?.userId;

        let html = `
            <div class="leaderboard-container">
                <div class="leaderboard-header">
                    <h3>${this.getLeaderboardTitle(type, category)}</h3>
                    <small class="text-muted">Last updated: ${new Date(this.leaderboards.lastUpdated).toLocaleString()}</small>
                </div>
                <div class="leaderboard-list">
        `;

        leaderboard.forEach((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            const userClass = isCurrentUser ? 'current-user' : '';

            html += `
                <div class="leaderboard-entry ${rankClass} ${userClass}">
                    <div class="rank">
                        <span class="rank-number">${entry.rank}</span>
                        <span class="rank-badge" style="color: ${entry.badge.color}">${entry.badge.icon}</span>
                    </div>
                    <div class="user-info">
                        <div class="username">${entry.username}</div>
                        <div class="user-stats">
                            <span class="points">${entry.points} pts</span>
                            <span class="average">Avg: ${entry.averageScore}%</span>
                            <span class="quizzes">${entry.totalQuizzes} quizzes</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Get appropriate leaderboard title
     */
    getLeaderboardTitle(type, category) {
        const typeNames = {
            global: 'Global',
            subject: category,
            exam: category
        };

        const periodNames = {
            allTime: 'All Time',
            weekly: 'This Week',
            monthly: 'This Month'
        };

        return `${typeNames[type]} Leaderboard - ${periodNames[category] || category}`;
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.LeaderboardSystem = LeaderboardSystem;
    window.leaderboardSystem = new LeaderboardSystem();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeaderboardSystem;
}