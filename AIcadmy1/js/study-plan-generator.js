/**
 * StudyPlanGenerator - Creates personalized study plans based on quiz performance and weak areas
 */
class StudyPlanGenerator {
    constructor() {
        this.planTemplates = {
            'jee': {
                'physics': {
                    timeFrames: {
                        'short': 2, // weeks
                        'medium': 4,
                        'long': 8
                    },
                    topics: [
                        'mechanics', 'thermodynamics', 'waves', 'optics', 
                        'electromagnetism', 'modern_physics', 'atomic_physics'
                    ],
                    studyHoursPerWeek: {
                        'beginner': 8,
                        'intermediate': 12,
                        'advanced': 16
                    }
                },
                'chemistry': {
                    timeFrames: {
                        'short': 2,
                        'medium': 4,
                        'long': 8
                    },
                    topics: [
                        'physical_chemistry', 'organic_chemistry', 'inorganic_chemistry',
                        'chemical_bonding', 'thermochemistry', 'electrochemistry'
                    ],
                    studyHoursPerWeek: {
                        'beginner': 8,
                        'intermediate': 12,
                        'advanced': 16
                    }
                },
                'mathematics': {
                    timeFrames: {
                        'short': 3,
                        'medium': 6,
                        'long': 12
                    },
                    topics: [
                        'algebra', 'calculus', 'coordinate_geometry', 'trigonometry',
                        'probability', 'vectors', 'differential_equations'
                    ],
                    studyHoursPerWeek: {
                        'beginner': 10,
                        'intermediate': 14,
                        'advanced': 20
                    }
                }
            },
            'gate': {
                'computer_science': {
                    timeFrames: {
                        'short': 4,
                        'medium': 8,
                        'long': 16
                    },
                    topics: [
                        'data_structures', 'algorithms', 'database_systems', 'computer_networks',
                        'operating_systems', 'compiler_design', 'theory_of_computation'
                    ],
                    studyHoursPerWeek: {
                        'beginner': 12,
                        'intermediate': 16,
                        'advanced': 20
                    }
                },
                'mechanical': {
                    timeFrames: {
                        'short': 4,
                        'medium': 8,
                        'long': 16
                    },
                    topics: [
                        'thermodynamics', 'fluid_mechanics', 'heat_transfer', 'machine_design',
                        'manufacturing', 'strength_of_materials', 'dynamics'
                    ],
                    studyHoursPerWeek: {
                        'beginner': 12,
                        'intermediate': 16,
                        'advanced': 20
                    }
                }
            },
            'boards': {
                'physics': {
                    timeFrames: {
                        'short': 1,
                        'medium': 2,
                        'long': 4
                    },
                    topics: [
                        'mechanics', 'electricity', 'magnetism', 'optics',
                        'modern_physics', 'waves', 'thermodynamics'
                    ],
                    studyHoursPerWeek: {
                        'beginner': 6,
                        'intermediate': 8,
                        'advanced': 10
                    }
                },
                'chemistry': {
                    timeFrames: {
                        'short': 1,
                        'medium': 2,
                        'long': 4
                    },
                    topics: [
                        'atomic_structure', 'chemical_bonding', 'states_of_matter',
                        'thermodynamics', 'equilibrium', 'electrochemistry'
                    ],
                    studyHoursPerWeek: {
                        'beginner': 6,
                        'intermediate': 8,
                        'advanced': 10
                    }
                },
                'mathematics': {
                    timeFrames: {
                        'short': 2,
                        'medium': 3,
                        'long': 6
                    },
                    topics: [
                        'algebra', 'calculus', 'probability', 'coordinate_geometry',
                        'trigonometry', 'vectors', 'statistics'
                    ],
                    studyHoursPerWeek: {
                        'beginner': 8,
                        'intermediate': 10,
                        'advanced': 12
                    }
                }
            }
        };

        this.milestones = {
            'week1': ['Complete basic concepts', 'Solve 50 practice questions'],
            'week2': ['Master fundamental theorems', 'Solve 100 practice questions'],
            'week3': ['Advanced problem solving', 'Mock test performance >70%'],
            'week4': ['Speed and accuracy improvement', 'Mock test performance >80%']
        };
    }

    /**
     * Generate a comprehensive study plan based on user performance
     */
    generateStudyPlan(userProfile, quizHistory, weakAreas, timeFrame = 'medium') {
        const exam = userProfile.primaryExam.toLowerCase();
        const subject = userProfile.focusSubjects[0]?.toLowerCase();
        
        if (!this.planTemplates[exam] || !this.planTemplates[exam][subject]) {
            return this.generateGenericPlan(weakAreas, timeFrame);
        }

        const template = this.planTemplates[exam][subject];
        const studyLevel = this.determineStudyLevel(userProfile.averageScore);
        const duration = template.timeFrames[timeFrame];
        const weeklyHours = template.studyHoursPerWeek[studyLevel];
        
        const plan = {
            id: this.generatePlanId(),
            title: `${exam.toUpperCase()} ${subject.charAt(0).toUpperCase() + subject.slice(1)} Study Plan`,
            exam: exam,
            subject: subject,
            duration: duration,
            timeFrame: timeFrame,
            weeklyHours: weeklyHours,
            totalHours: duration * weeklyHours,
            studyLevel: studyLevel,
            createdAt: new Date(),
            weakAreas: weakAreas,
            
            // Weekly breakdown
            weeks: this.generateWeeklyPlan(template, duration, weakAreas, studyLevel),
            
            // Daily schedule template
            dailySchedule: this.generateDailySchedule(weeklyHours),
            
            // Books and resources
            recommendedBooks: this.getRecommendedBooksForPlan(exam, subject, weakAreas),
            
            // Practice targets
            practiceTargets: this.generatePracticeTargets(duration, studyLevel),
            
            // Assessment schedule
            assessments: this.generateAssessmentSchedule(duration),
            
            // Progress tracking
            progressTracking: {
                completedWeeks: 0,
                topicsCompleted: [],
                practiceQuestionsSolved: 0,
                mockTestsAttempted: 0,
                currentWeekProgress: 0
            }
        };

        return plan;
    }

    /**
     * Determine study level based on average quiz performance
     */
    determineStudyLevel(averageScore) {
        if (averageScore < 40) return 'beginner';
        if (averageScore < 70) return 'intermediate';
        return 'advanced';
    }

    /**
     * Generate weekly study plan breakdown
     */
    generateWeeklyPlan(template, duration, weakAreas, studyLevel) {
        const weeks = [];
        const topicsPerWeek = Math.ceil(template.topics.length / duration);
        
        for (let week = 1; week <= duration; week++) {
            const startTopicIndex = (week - 1) * topicsPerWeek;
            const weekTopics = template.topics.slice(startTopicIndex, startTopicIndex + topicsPerWeek);
            
            // Prioritize weak areas in early weeks
            const prioritizedTopics = this.prioritizeTopics(weekTopics, weakAreas, week <= 2);
            
            weeks.push({
                week: week,
                title: `Week ${week}: ${this.getWeekTitle(prioritizedTopics)}`,
                topics: prioritizedTopics,
                goals: this.generateWeeklyGoals(prioritizedTopics, studyLevel, week),
                dailyTasks: this.generateDailyTasks(prioritizedTopics, studyLevel),
                resources: this.getWeeklyResources(prioritizedTopics),
                assessments: week % 2 === 0 ? ['Mock Test', 'Topic Quiz'] : ['Practice Questions'],
                milestones: this.getWeeklyMilestones(week, studyLevel)
            });
        }
        
        return weeks;
    }

    /**
     * Generate daily study schedule template
     */
    generateDailySchedule(weeklyHours) {
        const dailyHours = Math.ceil(weeklyHours / 7);
        const sessions = [];
        
        if (dailyHours <= 2) {
            sessions.push({
                time: '2:00 PM - 4:00 PM',
                duration: 120,
                activity: 'Theory + Practice',
                type: 'focused'
            });
        } else if (dailyHours <= 4) {
            sessions.push(
                {
                    time: '9:00 AM - 11:00 AM',
                    duration: 120,
                    activity: 'Concept Learning',
                    type: 'theory'
                },
                {
                    time: '3:00 PM - 5:00 PM',
                    duration: 120,
                    activity: 'Problem Solving',
                    type: 'practice'
                }
            );
        } else {
            sessions.push(
                {
                    time: '8:00 AM - 10:00 AM',
                    duration: 120,
                    activity: 'Theory & Concepts',
                    type: 'theory'
                },
                {
                    time: '2:00 PM - 4:00 PM',
                    duration: 120,
                    activity: 'Problem Practice',
                    type: 'practice'
                },
                {
                    time: '7:00 PM - 8:00 PM',
                    duration: 60,
                    activity: 'Review & Revision',
                    type: 'revision'
                }
            );
        }
        
        return {
            totalDailyHours: dailyHours,
            sessions: sessions,
            breaks: this.generateBreakSchedule(sessions),
            tips: [
                'Take 10-minute breaks every hour',
                'Review previous day concepts for 15 minutes',
                'Practice previous year questions daily',
                'Maintain a doubt diary'
            ]
        };
    }

    /**
     * Generate practice targets based on study level and duration
     */
    generatePracticeTargets(duration, studyLevel) {
        const baseQuestions = studyLevel === 'beginner' ? 20 : studyLevel === 'intermediate' ? 35 : 50;
        const weeklyQuestions = baseQuestions * duration;
        
        return {
            weeklyQuestions: baseQuestions,
            totalQuestions: weeklyQuestions,
            mockTests: Math.ceil(duration / 2),
            topicWiseTests: duration * 2,
            previousYearQuestions: Math.ceil(weeklyQuestions * 0.3),
            accuracyTarget: studyLevel === 'beginner' ? 60 : studyLevel === 'intermediate' ? 75 : 85,
            speedTarget: {
                questionsPerHour: studyLevel === 'beginner' ? 15 : studyLevel === 'intermediate' ? 25 : 35
            }
        };
    }

    /**
     * Generate assessment schedule
     */
    generateAssessmentSchedule(duration) {
        const assessments = [];
        
        for (let week = 1; week <= duration; week++) {
            if (week % 2 === 0) {
                assessments.push({
                    week: week,
                    type: 'Mock Test',
                    duration: 180, // 3 hours
                    syllabus: 'Cumulative',
                    target: 'Speed + Accuracy'
                });
            }
            
            assessments.push({
                week: week,
                type: 'Topic Quiz',
                duration: 60, // 1 hour
                syllabus: 'Current week topics',
                target: 'Concept clarity'
            });
        }
        
        return assessments;
    }

    /**
     * Get recommended books for the study plan
     */
    getRecommendedBooksForPlan(exam, subject, weakAreas) {
        // This would typically integrate with the BookRecommendationEngine
        if (window.bookRecommendationEngine) {
            const userProfile = { primaryExam: exam, focusSubjects: [subject] };
            const recommendations = window.bookRecommendationEngine.generateRecommendations(
                userProfile, [], weakAreas
            );
            return recommendations.slice(0, 5);
        }
        
        return [];
    }

    /**
     * Prioritize topics based on weak areas
     */
    prioritizeTopics(topics, weakAreas, prioritizeWeak = true) {
        if (!prioritizeWeak || !weakAreas.length) return topics;
        
        const weakTopics = topics.filter(topic => 
            weakAreas.some(weak => weak.topic.toLowerCase().includes(topic.toLowerCase()))
        );
        const strongTopics = topics.filter(topic => 
            !weakAreas.some(weak => weak.topic.toLowerCase().includes(topic.toLowerCase()))
        );
        
        return [...weakTopics, ...strongTopics];
    }

    /**
     * Generate weekly goals based on topics and study level
     */
    generateWeeklyGoals(topics, studyLevel, weekNumber) {
        const baseGoals = [
            `Complete theory for: ${topics.join(', ')}`,
            `Solve ${studyLevel === 'beginner' ? 20 : studyLevel === 'intermediate' ? 35 : 50} practice questions`,
            'Review previous week concepts'
        ];
        
        if (weekNumber > 2) {
            baseGoals.push('Attempt mock test and analyze performance');
        }
        
        return baseGoals;
    }

    /**
     * Generate daily tasks for the week
     */
    generateDailyTasks(topics, studyLevel) {
        const tasks = [];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        days.forEach((day, index) => {
            const topicIndex = index % topics.length;
            const currentTopic = topics[topicIndex];
            
            tasks.push({
                day: day,
                tasks: [
                    `Study ${currentTopic} theory (1-2 hours)`,
                    `Solve ${studyLevel === 'beginner' ? 5 : studyLevel === 'intermediate' ? 8 : 12} ${currentTopic} questions`,
                    day === 'Sunday' ? 'Weekly revision and mock test' : 'Review previous day concepts (15 mins)'
                ]
            });
        });
        
        return tasks;
    }

    /**
     * Get weekly resources for topics
     */
    getWeeklyResources(topics) {
        return {
            videoLectures: topics.map(topic => `${topic} video series`),
            practiceSheets: topics.map(topic => `${topic} practice questions`),
            referenceBooks: ['NCERT', 'Standard reference books'],
            onlineResources: ['Khan Academy', 'Coursera', 'YouTube channels']
        };
    }

    /**
     * Get weekly milestones
     */
    getWeeklyMilestones(week, studyLevel) {
        const baseMilestones = [
            'Complete all assigned theory',
            `Maintain ${studyLevel === 'beginner' ? 60 : studyLevel === 'intermediate' ? 70 : 80}% accuracy in practice`
        ];
        
        if (week % 2 === 0) {
            baseMilestones.push('Score above 70% in mock test');
        }
        
        return baseMilestones;
    }

    /**
     * Generate break schedule
     */
    generateBreakSchedule(sessions) {
        return {
            shortBreaks: '10 minutes every hour',
            longBreak: '30 minutes between major sessions',
            weeklyOff: 'Sunday evening (complete rest)',
            tips: [
                'Use breaks for light physical activity',
                'Avoid screens during breaks',
                'Stay hydrated',
                'Practice meditation for 5 minutes'
            ]
        };
    }

    /**
     * Generate generic study plan for unsupported exam/subject combinations
     */
    generateGenericPlan(weakAreas, timeFrame) {
        return {
            id: this.generatePlanId(),
            title: 'Customized Study Plan',
            type: 'generic',
            duration: timeFrame === 'short' ? 2 : timeFrame === 'medium' ? 4 : 8,
            weakAreas: weakAreas,
            recommendations: [
                'Focus on identified weak areas',
                'Create a consistent study schedule',
                'Practice regularly and track progress',
                'Take periodic assessments'
            ],
            createdAt: new Date()
        };
    }

    /**
     * Get week title based on topics
     */
    getWeekTitle(topics) {
        if (topics.length === 1) return topics[0].replace('_', ' ').toUpperCase();
        if (topics.length === 2) return `${topics[0].replace('_', ' ')} & ${topics[1].replace('_', ' ')}`.toUpperCase();
        return `${topics[0].replace('_', ' ')} + ${topics.length - 1} more`.toUpperCase();
    }

    /**
     * Generate unique plan ID
     */
    generatePlanId() {
        return 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Save study plan to local storage
     */
    saveStudyPlan(plan) {
        const existingPlans = this.getStoredPlans();
        existingPlans[plan.id] = plan;
        localStorage.setItem('study_plans', JSON.stringify(existingPlans));
        return plan.id;
    }

    /**
     * Get all stored study plans
     */
    getStoredPlans() {
        const stored = localStorage.getItem('study_plans');
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Get specific study plan
     */
    getStudyPlan(planId) {
        const plans = this.getStoredPlans();
        return plans[planId] || null;
    }

    /**
     * Update plan progress
     */
    updatePlanProgress(planId, progressUpdate) {
        const plans = this.getStoredPlans();
        if (plans[planId]) {
            plans[planId].progressTracking = { ...plans[planId].progressTracking, ...progressUpdate };
            plans[planId].lastUpdated = new Date();
            localStorage.setItem('study_plans', JSON.stringify(plans));
            return true;
        }
        return false;
    }

    /**
     * Get active study plans for user
     */
    getActivePlans() {
        const plans = this.getStoredPlans();
        const now = new Date();
        
        return Object.values(plans).filter(plan => {
            if (!plan.createdAt) return false;
            
            const planStart = new Date(plan.createdAt);
            const planEnd = new Date(planStart.getTime() + (plan.duration * 7 * 24 * 60 * 60 * 1000));
            
            return now >= planStart && now <= planEnd;
        });
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.StudyPlanGenerator = StudyPlanGenerator;
    window.studyPlanGenerator = new StudyPlanGenerator();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudyPlanGenerator;
}