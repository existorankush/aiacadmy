/**
 * Book Recommendation Engine
 * Integrates quiz performance with book recommendations for personalized learning
 */

class BookRecommendationEngine {
    constructor() {
        this.quizHistory = this.loadQuizHistory();
        this.userPerformance = this.loadUserPerformance();
        this.bookDatabase = this.initializeBookDatabase();
        this.weaknessAnalyzer = new WeaknessAnalyzer();
        this.learningPathGenerator = new LearningPathGenerator();
    }

    initializeBookDatabase() {
        return {
            jee: {
                physics: [
                    {
                        id: 'hc_verma_1',
                        title: 'Concepts of Physics Volume 1',
                        author: 'H.C. Verma',
                        topics: ['mechanics', 'thermodynamics', 'waves', 'oscillations'],
                        difficulty: 'medium',
                        rating: 4.8,
                        price: 650,
                        rentalPrice: 150,
                        weaknessType: ['conceptual', 'problem_solving'],
                        recommendedFor: {
                            beginners: true,
                            intermediate: true,
                            advanced: false
                        },
                        strengths: ['clear_concepts', 'good_problems', 'step_by_step'],
                        description: 'Best book for building strong physics concepts with excellent problem sets',
                        image: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=HC+Verma+Vol+1'
                    },
                    {
                        id: 'hc_verma_2',
                        title: 'Concepts of Physics Volume 2',
                        author: 'H.C. Verma',
                        topics: ['electromagnetism', 'optics', 'modern_physics'],
                        difficulty: 'medium',
                        rating: 4.8,
                        price: 680,
                        rentalPrice: 160,
                        weaknessType: ['conceptual', 'advanced_problems'],
                        recommendedFor: {
                            beginners: false,
                            intermediate: true,
                            advanced: true
                        },
                        strengths: ['advanced_concepts', 'jee_advanced_prep'],
                        description: 'Advanced physics concepts for JEE Advanced preparation',
                        image: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=HC+Verma+Vol+2'
                    },
                    {
                        id: 'resnick_halliday',
                        title: 'Fundamentals of Physics',
                        author: 'Resnick, Halliday & Krane',
                        topics: ['mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'modern_physics'],
                        difficulty: 'hard',
                        rating: 4.9,
                        price: 1200,
                        rentalPrice: 300,
                        weaknessType: ['deep_understanding', 'theoretical_concepts'],
                        recommendedFor: {
                            beginners: false,
                            intermediate: true,
                            advanced: true
                        },
                        strengths: ['comprehensive', 'theoretical_depth', 'problem_variety'],
                        description: 'Comprehensive physics textbook with deep theoretical understanding',
                        image: 'https://via.placeholder.com/300x400/2196F3/FFFFFF?text=Resnick+Halliday'
                    },
                    {
                        id: 'dc_pandey_mechanics',
                        title: 'DC Pandey Mechanics',
                        author: 'DC Pandey',
                        topics: ['mechanics', 'rotational_motion', 'simple_harmonic_motion'],
                        difficulty: 'medium',
                        rating: 4.6,
                        price: 450,
                        rentalPrice: 120,
                        weaknessType: ['problem_solving', 'speed_accuracy'],
                        recommendedFor: {
                            beginners: true,
                            intermediate: true,
                            advanced: false
                        },
                        strengths: ['problem_practice', 'quick_solving', 'exam_pattern'],
                        description: 'Excellent for mechanics problem practice and exam preparation',
                        image: 'https://via.placeholder.com/300x400/FF9800/FFFFFF?text=DC+Pandey+Mech'
                    }
                ],
                chemistry: [
                    {
                        id: 'p_bahadur',
                        title: 'Numerical Chemistry',
                        author: 'P. Bahadur',
                        topics: ['physical_chemistry', 'chemical_kinetics', 'thermodynamics', 'equilibrium'],
                        difficulty: 'hard',
                        rating: 4.7,
                        price: 550,
                        rentalPrice: 140,
                        weaknessType: ['numerical_problems', 'calculation_speed'],
                        recommendedFor: {
                            beginners: false,
                            intermediate: true,
                            advanced: true
                        },
                        strengths: ['numerical_practice', 'problem_variety', 'detailed_solutions'],
                        description: 'Best book for physical chemistry numerical problems',
                        image: 'https://via.placeholder.com/300x400/E91E63/FFFFFF?text=P+Bahadur'
                    },
                    {
                        id: 'morrison_boyd',
                        title: 'Organic Chemistry',
                        author: 'Morrison & Boyd',
                        topics: ['organic_chemistry', 'reaction_mechanisms', 'stereochemistry'],
                        difficulty: 'hard',
                        rating: 4.8,
                        price: 820,
                        rentalPrice: 200,
                        weaknessType: ['organic_mechanisms', 'conceptual_clarity'],
                        recommendedFor: {
                            beginners: false,
                            intermediate: true,
                            advanced: true
                        },
                        strengths: ['mechanism_clarity', 'comprehensive_coverage', 'theory_depth'],
                        description: 'Comprehensive organic chemistry with detailed mechanisms',
                        image: 'https://via.placeholder.com/300x400/9C27B0/FFFFFF?text=Morrison+Boyd'
                    },
                    {
                        id: 'jd_lee',
                        title: 'Concise Inorganic Chemistry',
                        author: 'J.D. Lee',
                        topics: ['inorganic_chemistry', 'periodic_properties', 'coordination_compounds'],
                        difficulty: 'medium',
                        rating: 4.6,
                        price: 480,
                        rentalPrice: 130,
                        weaknessType: ['inorganic_facts', 'periodic_trends'],
                        recommendedFor: {
                            beginners: true,
                            intermediate: true,
                            advanced: false
                        },
                        strengths: ['fact_compilation', 'easy_language', 'exam_focused'],
                        description: 'Best for inorganic chemistry facts and periodic trends',
                        image: 'https://via.placeholder.com/300x400/607D8B/FFFFFF?text=JD+Lee'
                    }
                ],
                mathematics: [
                    {
                        id: 'rd_sharma_11',
                        title: 'Mathematics Class 11',
                        author: 'R.D. Sharma',
                        topics: ['trigonometry', 'complex_numbers', 'permutations', 'limits'],
                        difficulty: 'medium',
                        rating: 4.5,
                        price: 520,
                        rentalPrice: 130,
                        weaknessType: ['basic_concepts', 'formula_application'],
                        recommendedFor: {
                            beginners: true,
                            intermediate: true,
                            advanced: false
                        },
                        strengths: ['step_by_step', 'plenty_examples', 'concept_building'],
                        description: 'Excellent for building mathematics foundation',
                        image: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=RD+Sharma+11'
                    },
                    {
                        id: 'rd_sharma_12',
                        title: 'Mathematics Class 12',
                        author: 'R.D. Sharma',
                        topics: ['calculus', 'integration', 'differential_equations', 'vectors'],
                        difficulty: 'medium',
                        rating: 4.6,
                        price: 580,
                        rentalPrice: 150,
                        weaknessType: ['calculus_concepts', 'integration_techniques'],
                        recommendedFor: {
                            beginners: true,
                            intermediate: true,
                            advanced: false
                        },
                        strengths: ['calculus_clarity', 'problem_variety', 'exam_preparation'],
                        description: 'Perfect for Class 12 mathematics and JEE preparation',
                        image: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=RD+Sharma+12'
                    },
                    {
                        id: 'sl_loney',
                        title: 'Coordinate Geometry',
                        author: 'S.L. Loney',
                        topics: ['coordinate_geometry', 'straight_lines', 'circles', 'conic_sections'],
                        difficulty: 'hard',
                        rating: 4.7,
                        price: 350,
                        rentalPrice: 90,
                        weaknessType: ['geometric_visualization', 'coordinate_problems'],
                        recommendedFor: {
                            beginners: false,
                            intermediate: true,
                            advanced: true
                        },
                        strengths: ['problem_difficulty', 'concept_depth', 'jee_advanced'],
                        description: 'Classic book for coordinate geometry mastery',
                        image: 'https://via.placeholder.com/300x400/FF5722/FFFFFF?text=SL+Loney'
                    }
                ]
            },
            gate: {
                computer_science: [
                    {
                        id: 'cormen_clrs',
                        title: 'Introduction to Algorithms',
                        author: 'Cormen, Leiserson, Rivest, Stein',
                        topics: ['algorithms', 'data_structures', 'graph_theory', 'dynamic_programming'],
                        difficulty: 'hard',
                        rating: 4.9,
                        price: 950,
                        rentalPrice: 250,
                        weaknessType: ['algorithmic_thinking', 'problem_complexity'],
                        recommendedFor: {
                            beginners: false,
                            intermediate: true,
                            advanced: true
                        },
                        strengths: ['comprehensive', 'theoretical_depth', 'industry_standard'],
                        description: 'The definitive guide to algorithms and data structures',
                        image: 'https://via.placeholder.com/300x400/3F51B5/FFFFFF?text=CLRS'
                    },
                    {
                        id: 'tanenbaum_networks',
                        title: 'Computer Networks',
                        author: 'Andrew S. Tanenbaum',
                        topics: ['networking', 'protocols', 'osi_model', 'network_security'],
                        difficulty: 'medium',
                        rating: 4.7,
                        price: 720,
                        rentalPrice: 180,
                        weaknessType: ['networking_concepts', 'protocol_understanding'],
                        recommendedFor: {
                            beginners: true,
                            intermediate: true,
                            advanced: false
                        },
                        strengths: ['clear_concepts', 'practical_examples', 'comprehensive'],
                        description: 'Best book for understanding computer networking concepts',
                        image: 'https://via.placeholder.com/300x400/009688/FFFFFF?text=Tanenbaum+Networks'
                    }
                ]
            },
            boards: {
                physics: [
                    {
                        id: 'ncert_physics_11',
                        title: 'NCERT Physics Class 11',
                        author: 'NCERT',
                        topics: ['mechanics', 'thermodynamics', 'waves'],
                        difficulty: 'easy',
                        rating: 4.4,
                        price: 120,
                        rentalPrice: 30,
                        weaknessType: ['basic_concepts', 'board_exam_prep'],
                        recommendedFor: {
                            beginners: true,
                            intermediate: false,
                            advanced: false
                        },
                        strengths: ['board_syllabus', 'basic_concepts', 'affordable'],
                        description: 'Official NCERT textbook for Class 11 Physics',
                        image: 'https://via.placeholder.com/300x400/795548/FFFFFF?text=NCERT+Phy+11'
                    },
                    {
                        id: 'ncert_physics_12',
                        title: 'NCERT Physics Class 12',
                        author: 'NCERT',
                        topics: ['electromagnetism', 'optics', 'modern_physics'],
                        difficulty: 'easy',
                        rating: 4.5,
                        price: 135,
                        rentalPrice: 35,
                        weaknessType: ['basic_concepts', 'board_exam_prep'],
                        recommendedFor: {
                            beginners: true,
                            intermediate: false,
                            advanced: false
                        },
                        strengths: ['board_syllabus', 'exam_pattern', 'government_approved'],
                        description: 'Official NCERT textbook for Class 12 Physics',
                        image: 'https://via.placeholder.com/300x400/795548/FFFFFF?text=NCERT+Phy+12'
                    }
                ]
            }
        };
    }

    // Main recommendation method
    generateRecommendations(userProfile, quizResults, weakAreas) {
        const recommendations = [];
        const exam = userProfile.currentExam || 'jee';
        const subject = userProfile.currentSubject || 'physics';

        // Analyze user performance level
        const performanceLevel = this.determinePerformanceLevel(quizResults);
        
        // Get books for the exam and subject
        const availableBooks = this.bookDatabase[exam]?.[subject] || [];

        // Weakness-based recommendations
        const weaknessRecommendations = this.getWeaknessBasedRecommendations(
            weakAreas, availableBooks, performanceLevel
        );

        // Performance-level based recommendations
        const levelRecommendations = this.getLevelBasedRecommendations(
            availableBooks, performanceLevel
        );

        // Topic-specific recommendations
        const topicRecommendations = this.getTopicBasedRecommendations(
            quizResults, availableBooks
        );

        // Combine and rank recommendations
        const allRecommendations = [
            ...weaknessRecommendations,
            ...levelRecommendations,
            ...topicRecommendations
        ];

        // Remove duplicates and rank by relevance
        const uniqueRecommendations = this.removeDuplicatesAndRank(allRecommendations);

        return uniqueRecommendations.slice(0, 10); // Return top 10
    }

    determinePerformanceLevel(quizResults) {
        const averageScore = quizResults.reduce((sum, result) => sum + result.percentage, 0) / quizResults.length;
        
        if (averageScore >= 80) return 'advanced';
        if (averageScore >= 60) return 'intermediate';
        return 'beginner';
    }

    getWeaknessBasedRecommendations(weakAreas, books, performanceLevel) {
        const recommendations = [];

        weakAreas.forEach(weakness => {
            const suitableBooks = books.filter(book => {
                // Check if book addresses the weakness type
                const addressesWeakness = book.weaknessType.some(type => 
                    this.matchesWeaknessPattern(type, weakness)
                );

                // Check if book is suitable for performance level
                const levelMatch = book.recommendedFor[performanceLevel + 's'] || 
                                 book.recommendedFor[performanceLevel];

                return addressesWeakness && levelMatch;
            });

            suitableBooks.forEach(book => {
                recommendations.push({
                    ...book,
                    recommendationReason: `Recommended for improving ${weakness.topic}`,
                    recommendationType: 'weakness_based',
                    relevanceScore: this.calculateWeaknessRelevance(book, weakness),
                    urgency: weakness.percentage < 40 ? 'high' : 'medium'
                });
            });
        });

        return recommendations;
    }

    getLevelBasedRecommendations(books, performanceLevel) {
        return books
            .filter(book => book.recommendedFor[performanceLevel + 's'] || book.recommendedFor[performanceLevel])
            .map(book => ({
                ...book,
                recommendationReason: `Perfect for your current ${performanceLevel} level`,
                recommendationType: 'level_based',
                relevanceScore: book.rating * 10,
                urgency: 'medium'
            }));
    }

    getTopicBasedRecommendations(quizResults, books) {
        const topicFrequency = {};
        
        // Count frequency of topics in quiz history
        quizResults.forEach(quiz => {
            if (quiz.topicBreakdown) {
                Object.keys(quiz.topicBreakdown).forEach(topic => {
                    topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
                });
            }
        });

        const recommendations = [];
        const frequentTopics = Object.keys(topicFrequency)
            .sort((a, b) => topicFrequency[b] - topicFrequency[a])
            .slice(0, 5);

        frequentTopics.forEach(topic => {
            const relevantBooks = books.filter(book => 
                book.topics.some(bookTopic => 
                    bookTopic.toLowerCase().includes(topic.toLowerCase()) ||
                    topic.toLowerCase().includes(bookTopic.toLowerCase())
                )
            );

            relevantBooks.forEach(book => {
                recommendations.push({
                    ...book,
                    recommendationReason: `Covers ${topic} which you've been practicing`,
                    recommendationType: 'topic_based',
                    relevanceScore: book.rating * topicFrequency[topic],
                    urgency: 'low'
                });
            });
        });

        return recommendations;
    }

    matchesWeaknessPattern(weaknessType, weaknessArea) {
        const patterns = {
            'conceptual': ['concept', 'theory', 'understanding', 'basic'],
            'problem_solving': ['problem', 'numerical', 'calculation', 'application'],
            'speed_accuracy': ['speed', 'time', 'accuracy', 'quick'],
            'advanced_problems': ['advanced', 'difficult', 'complex', 'challenging'],
            'formula_application': ['formula', 'equation', 'application', 'method']
        };

        const weaknessLower = weaknessArea.topic.toLowerCase();
        const relatedPatterns = patterns[weaknessType] || [];

        return relatedPatterns.some(pattern => weaknessLower.includes(pattern));
    }

    calculateWeaknessRelevance(book, weakness) {
        let score = book.rating * 10;

        // Boost score for books that specifically target the weakness
        if (book.weaknessType.includes('conceptual') && weakness.percentage < 50) {
            score += 20;
        }

        // Boost for books with good problem variety if user struggles with problems
        if (book.strengths.includes('problem_variety') && weakness.percentage < 60) {
            score += 15;
        }

        return score;
    }

    removeDuplicatesAndRank(recommendations) {
        const unique = recommendations.reduce((acc, current) => {
            const existing = acc.find(item => item.id === current.id);
            if (!existing) {
                acc.push(current);
            } else if (current.relevanceScore > existing.relevanceScore) {
                const index = acc.indexOf(existing);
                acc[index] = current;
            }
            return acc;
        }, []);

        return unique.sort((a, b) => {
            // Sort by urgency first, then relevance score
            const urgencyWeight = { high: 3, medium: 2, low: 1 };
            const urgencyDiff = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
            
            if (urgencyDiff !== 0) return urgencyDiff;
            return b.relevanceScore - a.relevanceScore;
        });
    }

    // Generate personalized study plan with book recommendations
    generateStudyPlan(userProfile, quizResults, targetExamDate) {
        const weakAreas = this.weaknessAnalyzer.analyze(quizResults);
        const recommendations = this.generateRecommendations(userProfile, quizResults, weakAreas);
        
        const studyPlan = {
            phase1: {
                duration: '4 weeks',
                focus: 'Strengthen weak areas',
                books: recommendations.filter(r => r.urgency === 'high').slice(0, 3),
                topics: weakAreas.slice(0, 5)
            },
            phase2: {
                duration: '6 weeks',
                focus: 'Comprehensive coverage',
                books: recommendations.filter(r => r.recommendationType === 'level_based').slice(0, 4),
                topics: userProfile.syllabus || []
            },
            phase3: {
                duration: '2 weeks',
                focus: 'Revision and practice',
                books: recommendations.filter(r => r.strengths.includes('problem_practice')).slice(0, 2),
                topics: ['revision', 'mock_tests', 'previous_years']
            }
        };

        return studyPlan;
    }

    // Integration with resource system
    integrateWithResourceSystem(resourceManager) {
        this.resourceManager = resourceManager;
        
        // Add recommendation data to resources
        this.enhanceResourcesWithRecommendations();
    }

    enhanceResourcesWithRecommendations() {
        if (!this.resourceManager) return;

        const userQuizData = this.loadQuizHistory();
        if (userQuizData.length === 0) return;

        const userProfile = this.createUserProfile(userQuizData);
        const weakAreas = this.weaknessAnalyzer.analyze(userQuizData);
        const recommendations = this.generateRecommendations(userProfile, userQuizData, weakAreas);

        // Enhance resources with recommendation flags
        this.resourceManager.resources.forEach(resource => {
            const recommendation = recommendations.find(r => r.title === resource.title);
            if (recommendation) {
                resource.isRecommended = true;
                resource.recommendationReason = recommendation.recommendationReason;
                resource.urgency = recommendation.urgency;
                resource.relevanceScore = recommendation.relevanceScore;
            }
        });

        // Re-render resources to show recommendations
        this.resourceManager.renderResources();
    }

    createUserProfile(quizHistory) {
        const subjects = {};
        const exams = {};

        quizHistory.forEach(quiz => {
            subjects[quiz.subject] = (subjects[quiz.subject] || 0) + 1;
            exams[quiz.exam] = (exams[quiz.exam] || 0) + 1;
        });

        return {
            currentExam: Object.keys(exams).reduce((a, b) => exams[a] > exams[b] ? a : b),
            currentSubject: Object.keys(subjects).reduce((a, b) => subjects[a] > subjects[b] ? a : b),
            averageScore: quizHistory.reduce((sum, q) => sum + q.percentage, 0) / quizHistory.length,
            totalQuizzes: quizHistory.length
        };
    }

    loadQuizHistory() {
        try {
            const sstHistory = JSON.parse(localStorage.getItem('sstQuizHistory')) || [];
            const competitiveHistory = JSON.parse(localStorage.getItem('competitiveQuizHistory')) || [];
            return [...sstHistory, ...competitiveHistory];
        } catch {
            return [];
        }
    }

    loadUserPerformance() {
        try {
            return JSON.parse(localStorage.getItem('userPerformanceData')) || {};
        } catch {
            return {};
        }
    }
}

// Weakness Analysis Helper Class
class WeaknessAnalyzer {
    analyze(quizHistory) {
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

        // Convert to weakness areas (below 60% performance)
        const weakAreas = Object.entries(topicPerformance)
            .map(([topic, performance]) => ({
                topic,
                percentage: (performance.correct / performance.total) * 100,
                questionsAttempted: performance.total
            }))
            .filter(area => area.percentage < 60)
            .sort((a, b) => a.percentage - b.percentage);

        return weakAreas;
    }
}

// Learning Path Generator
class LearningPathGenerator {
    generate(weakAreas, userProfile, targetDate) {
        const weeksAvailable = this.calculateWeeksUntilTarget(targetDate);
        const path = {
            totalWeeks: weeksAvailable,
            phases: []
        };

        if (weeksAvailable > 12) {
            // Long-term preparation
            path.phases = [
                { name: 'Foundation', weeks: 4, focus: 'Basic concepts and weak areas' },
                { name: 'Building', weeks: 6, focus: 'Comprehensive coverage' },
                { name: 'Advanced', weeks: 3, focus: 'Advanced problems and applications' },
                { name: 'Revision', weeks: 2, focus: 'Revision and mock tests' }
            ];
        } else if (weeksAvailable > 6) {
            // Medium-term preparation
            path.phases = [
                { name: 'Intensive', weeks: Math.ceil(weeksAvailable * 0.6), focus: 'Key topics and weak areas' },
                { name: 'Practice', weeks: Math.floor(weeksAvailable * 0.4), focus: 'Problem solving and revision' }
            ];
        } else {
            // Short-term preparation
            path.phases = [
                { name: 'Focused', weeks: weeksAvailable, focus: 'High-priority topics and quick revision' }
            ];
        }

        return path;
    }

    calculateWeeksUntilTarget(targetDate) {
        if (!targetDate) return 12; // Default 12 weeks
        
        const now = new Date();
        const target = new Date(targetDate);
        const diffTime = target - now;
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        
        return Math.max(1, diffWeeks);
    }
}

// Export for global use
window.BookRecommendationEngine = BookRecommendationEngine;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookRecommendationEngine = new BookRecommendationEngine();
});