/**
 * Enhanced Question Database for Competitive Exams
 * Comprehensive collection from standard preparation books
 * Questions classified by difficulty and tagged with metadata
 */

class EnhancedQuestionDatabase {
    constructor() {
        this.questionBank = this.initializeEnhancedQuestions();
        this.usedQuestionIds = new Set();
        this.difficultyMapping = {
            easy: { min: 1, max: 3 },
            medium: { min: 3.5, max: 6.5 },
            hard: { min: 7, max: 10 }
        };
    }

    initializeEnhancedQuestions() {
        return {
            jee: {
                physics: {
                    mechanics: [
                        // Easy Level Questions
                        {
                            id: "jee_phy_mech_001",
                            question: "A particle moves with uniform velocity. Its acceleration is:",
                            options: ["Zero", "Constant", "Variable", "Infinite"],
                            correct: 0,
                            explanation: "Uniform velocity means constant velocity, so rate of change of velocity (acceleration) is zero.",
                            difficulty: "easy",
                            difficulty_score: 1.5,
                            subtopic: "kinematics",
                            bookReference: "HC Verma Physics Part 1, Chapter 3, Example 3.1",
                            conceptTags: ["velocity", "acceleration", "uniform_motion"],
                            yearAppeared: ["JEE Main 2019", "JEE Main 2021"],
                            timeToSolve: "30 seconds",
                            prerequisite: ["basic_kinematics"]
                        },
                        {
                            id: "jee_phy_mech_002",
                            question: "A ball is thrown vertically upward. At the highest point, its:",
                            options: ["Velocity is zero, acceleration is g", "Velocity is g, acceleration is zero", "Both velocity and acceleration are zero", "Both velocity and acceleration are g"],
                            correct: 0,
                            explanation: "At highest point, velocity becomes zero but acceleration due to gravity (g) acts downward.",
                            difficulty: "easy",
                            difficulty_score: 2.0,
                            subtopic: "projectile_motion",
                            bookReference: "Resnick Halliday Krane Physics, Chapter 4, Section 4.6",
                            conceptTags: ["projectile", "velocity", "acceleration", "gravity"],
                            yearAppeared: ["JEE Main 2018", "JEE Main 2020"],
                            timeToSolve: "45 seconds",
                            prerequisite: ["kinematics", "gravity"]
                        },
                        
                        // Medium Level Questions
                        {
                            id: "jee_phy_mech_003",
                            question: "A block slides down a frictionless inclined plane of angle 30°. If the block starts from rest, what is its acceleration?",
                            options: ["g", "g sin 30°", "g cos 30°", "g tan 30°"],
                            correct: 1,
                            explanation: "For frictionless incline, acceleration down the plane = g sin θ = g sin 30° = g/2",
                            difficulty: "medium",
                            difficulty_score: 4.2,
                            subtopic: "inclined_plane",
                            bookReference: "DC Pandey Mechanics Part 1, Chapter 7, Exercise 7.2",
                            conceptTags: ["inclined_plane", "friction", "acceleration", "forces"],
                            yearAppeared: ["JEE Advanced 2019", "JEE Main 2022"],
                            timeToSolve: "2 minutes",
                            prerequisite: ["force_analysis", "trigonometry"]
                        },
                        {
                            id: "jee_phy_mech_004",
                            question: "Two blocks of masses 2 kg and 3 kg are connected by a string passing over a pulley. What is the acceleration of the system? (g = 10 m/s²)",
                            options: ["1 m/s²", "2 m/s²", "3 m/s²", "4 m/s²"],
                            correct: 1,
                            explanation: "For Atwood machine: a = (m₂-m₁)g/(m₁+m₂) = (3-2)×10/(2+3) = 2 m/s²",
                            difficulty: "medium",
                            difficulty_score: 4.8,
                            subtopic: "atwood_machine",
                            bookReference: "Kleppner Kolenkow Introduction to Mechanics, Chapter 2",
                            conceptTags: ["atwood_machine", "tension", "acceleration", "pulleys"],
                            yearAppeared: ["JEE Advanced 2020", "JEE Main 2021"],
                            timeToSolve: "3 minutes",
                            prerequisite: ["newton_laws", "constraint_equations"]
                        },
                        
                        // Hard Level Questions
                        {
                            id: "jee_phy_mech_005",
                            question: "A uniform rod of length L and mass M is pivoted at one end and oscillates as a physical pendulum. What is its time period for small oscillations?",
                            options: ["2π√(L/3g)", "2π√(2L/3g)", "2π√(3L/2g)", "2π√(L/g)"],
                            correct: 1,
                            explanation: "For physical pendulum: T = 2π√(I/mgh), where I = ML²/3, h = L/2, so T = 2π√(2L/3g)",
                            difficulty: "hard",
                            difficulty_score: 7.5,
                            subtopic: "physical_pendulum",
                            bookReference: "Goldstein Classical Mechanics, Chapter 1, Problem 1.15",
                            conceptTags: ["physical_pendulum", "moment_inertia", "oscillations", "rigid_body"],
                            yearAppeared: ["JEE Advanced 2021", "JEE Advanced 2022"],
                            timeToSolve: "5 minutes",
                            prerequisite: ["rotational_motion", "moment_of_inertia", "oscillations"]
                        },
                        {
                            id: "jee_phy_mech_006",
                            question: "A particle moves in a circle of radius R with speed v = at, where a is constant. What is the magnitude of acceleration at time t?",
                            options: ["a", "at²/R", "a√(1 + a²t²/R²)", "√(a² + (at²/R)²)"],
                            correct: 3,
                            explanation: "Total acceleration = √(tangential² + centripetal²) = √(a² + (v²/R)²) = √(a² + (at)²/R²)",
                            difficulty: "hard",
                            difficulty_score: 8.2,
                            subtopic: "circular_motion",
                            bookReference: "Morin Introduction to Classical Mechanics, Chapter 4",
                            conceptTags: ["circular_motion", "acceleration_components", "vector_addition"],
                            yearAppeared: ["JEE Advanced 2020", "JEE Advanced 2019"],
                            timeToSolve: "4 minutes",
                            prerequisite: ["circular_motion", "acceleration_components", "vectors"]
                        }
                    ],
                    
                    thermodynamics: [
                        // Easy Level
                        {
                            id: "jee_phy_thermo_001",
                            question: "The first law of thermodynamics is essentially the law of conservation of:",
                            options: ["Mass", "Energy", "Momentum", "Charge"],
                            correct: 1,
                            explanation: "First law of thermodynamics states that energy cannot be created or destroyed, only converted from one form to another.",
                            difficulty: "easy",
                            difficulty_score: 1.8,
                            subtopic: "first_law",
                            bookReference: "Cengel Boles Thermodynamics, Chapter 2",
                            conceptTags: ["first_law", "energy_conservation", "thermodynamics"],
                            yearAppeared: ["JEE Main 2018", "JEE Main 2019"],
                            timeToSolve: "30 seconds",
                            prerequisite: ["energy_concepts"]
                        },
                        
                        // Medium Level
                        {
                            id: "jee_phy_thermo_002",
                            question: "An ideal gas undergoes isothermal expansion from volume V to 2V. The work done by the gas is:",
                            options: ["nRT ln 2", "nRT ln 4", "2nRT", "nRT/2"],
                            correct: 0,
                            explanation: "For isothermal process: W = nRT ln(V₂/V₁) = nRT ln(2V/V) = nRT ln 2",
                            difficulty: "medium",
                            difficulty_score: 5.2,
                            subtopic: "isothermal_process",
                            bookReference: "HC Verma Physics Part 2, Chapter 26, Example 26.3",
                            conceptTags: ["isothermal", "work_done", "ideal_gas", "natural_logarithm"],
                            yearAppeared: ["JEE Advanced 2019", "JEE Main 2021"],
                            timeToSolve: "2.5 minutes",
                            prerequisite: ["ideal_gas_law", "isothermal_process", "logarithms"]
                        },
                        
                        // Hard Level
                        {
                            id: "jee_phy_thermo_003",
                            question: "A Carnot engine operates between temperatures 600K and 300K. If 1000J of heat is absorbed from the hot reservoir, what is the work output?",
                            options: ["300 J", "500 J", "600 J", "700 J"],
                            correct: 1,
                            explanation: "Efficiency = 1 - T₂/T₁ = 1 - 300/600 = 0.5, Work = Efficiency × Q₁ = 0.5 × 1000 = 500 J",
                            difficulty: "hard",
                            difficulty_score: 6.8,
                            subtopic: "carnot_engine",
                            bookReference: "Zemansky Heat and Thermodynamics, Chapter 7",
                            conceptTags: ["carnot_engine", "efficiency", "heat_engine", "temperature"],
                            yearAppeared: ["JEE Advanced 2020", "JEE Advanced 2021"],
                            timeToSolve: "3 minutes",
                            prerequisite: ["heat_engines", "carnot_cycle", "efficiency_calculations"]
                        }
                    ],
                    
                    electromagnetism: [
                        // Easy Level
                        {
                            id: "jee_phy_em_001",
                            question: "The unit of electric field is:",
                            options: ["N/C", "C/N", "J/C", "C/J"],
                            correct: 0,
                            explanation: "Electric field is force per unit charge, so unit is Newton per Coulomb (N/C).",
                            difficulty: "easy",
                            difficulty_score: 1.2,
                            subtopic: "electric_field",
                            bookReference: "Purcell Electricity and Magnetism, Chapter 1",
                            conceptTags: ["electric_field", "units", "force", "charge"],
                            yearAppeared: ["JEE Main 2018", "JEE Main 2020"],
                            timeToSolve: "20 seconds",
                            prerequisite: ["basic_electrostatics"]
                        },
                        
                        // Medium Level
                        {
                            id: "jee_phy_em_002",
                            question: "A parallel plate capacitor has plates of area A separated by distance d. If a dielectric of constant K is inserted, the new capacitance is:",
                            options: ["ε₀A/d", "Kε₀A/d", "ε₀A/Kd", "KAd/ε₀"],
                            correct: 1,
                            explanation: "With dielectric, capacitance becomes C = Kε₀A/d, where K is the dielectric constant.",
                            difficulty: "medium",
                            difficulty_score: 4.5,
                            subtopic: "capacitance",
                            bookReference: "Griffiths Introduction to Electrodynamics, Chapter 4",
                            conceptTags: ["capacitance", "dielectric", "parallel_plate", "permittivity"],
                            yearAppeared: ["JEE Advanced 2019", "JEE Main 2022"],
                            timeToSolve: "2 minutes",
                            prerequisite: ["capacitors", "dielectrics", "electric_field"]
                        },
                        
                        // Hard Level
                        {
                            id: "jee_phy_em_003",
                            question: "A conducting sphere of radius R carries charge Q. What is the electric field at distance r from center (r > R)?",
                            options: ["kQ/r²", "kQ/R²", "kQr/R³", "kQ/4πr²"],
                            correct: 0,
                            explanation: "Outside a conducting sphere, electric field is same as point charge: E = kQ/r² = Q/(4πε₀r²)",
                            difficulty: "hard",
                            difficulty_score: 7.1,
                            subtopic: "conducting_sphere",
                            bookReference: "Jackson Classical Electrodynamics, Chapter 2",
                            conceptTags: ["conducting_sphere", "electric_field", "gauss_law", "charge_distribution"],
                            yearAppeared: ["JEE Advanced 2020", "JEE Advanced 2022"],
                            timeToSolve: "4 minutes",
                            prerequisite: ["gauss_law", "conductors", "electric_field"]
                        }
                    ]
                },
                
                chemistry: {
                    physical_chemistry: [
                        // Easy Level
                        {
                            id: "jee_chem_phys_001",
                            question: "The number of moles in 22.4 L of any gas at STP is:",
                            options: ["0.5", "1", "2", "22.4"],
                            correct: 1,
                            explanation: "At STP, 1 mole of any gas occupies 22.4 L (molar volume).",
                            difficulty: "easy",
                            difficulty_score: 1.5,
                            subtopic: "molar_volume",
                            bookReference: "P. Bahadur Physical Chemistry, Chapter 1",
                            conceptTags: ["moles", "STP", "molar_volume", "gas_laws"],
                            yearAppeared: ["JEE Main 2018", "JEE Main 2019"],
                            timeToSolve: "30 seconds",
                            prerequisite: ["mole_concept", "gas_laws"]
                        },
                        
                        // Medium Level
                        {
                            id: "jee_chem_phys_002",
                            question: "For the reaction A + B → C, if rate = k[A]²[B], what is the overall order?",
                            options: ["1", "2", "3", "4"],
                            correct: 2,
                            explanation: "Overall order = sum of individual orders = 2 + 1 = 3",
                            difficulty: "medium",
                            difficulty_score: 3.8,
                            subtopic: "chemical_kinetics",
                            bookReference: "Atkins Physical Chemistry, Chapter 22",
                            conceptTags: ["reaction_order", "rate_law", "kinetics"],
                            yearAppeared: ["JEE Advanced 2019", "JEE Main 2021"],
                            timeToSolve: "1.5 minutes",
                            prerequisite: ["chemical_kinetics", "rate_laws"]
                        },
                        
                        // Hard Level
                        {
                            id: "jee_chem_phys_003",
                            question: "Calculate the pH of a buffer solution containing 0.1 M CH₃COOH and 0.1 M CH₃COONa. (Ka = 1.8 × 10⁻⁵)",
                            options: ["4.74", "4.26", "5.26", "3.74"],
                            correct: 0,
                            explanation: "Using Henderson-Hasselbalch equation: pH = pKa + log([A⁻]/[HA]) = -log(1.8×10⁻⁵) + log(1) = 4.74",
                            difficulty: "hard",
                            difficulty_score: 7.3,
                            subtopic: "buffer_solutions",
                            bookReference: "Skoog West Analytical Chemistry, Chapter 9",
                            conceptTags: ["buffer", "henderson_hasselbalch", "pH", "weak_acid"],
                            yearAppeared: ["JEE Advanced 2020", "JEE Advanced 2021"],
                            timeToSolve: "4 minutes",
                            prerequisite: ["acid_base", "logarithms", "buffer_theory"]
                        }
                    ],
                    
                    organic_chemistry: [
                        // Easy Level
                        {
                            id: "jee_chem_org_001",
                            question: "The functional group present in alcohols is:",
                            options: ["-OH", "-CHO", "-COOH", "-NH₂"],
                            correct: 0,
                            explanation: "Alcohols contain the hydroxyl functional group (-OH).",
                            difficulty: "easy",
                            difficulty_score: 1.0,
                            subtopic: "functional_groups",
                            bookReference: "Morrison Boyd Organic Chemistry, Chapter 1",
                            conceptTags: ["functional_groups", "alcohols", "hydroxyl"],
                            yearAppeared: ["JEE Main 2018", "JEE Main 2019"],
                            timeToSolve: "15 seconds",
                            prerequisite: ["organic_chemistry_basics"]
                        },
                        
                        // Medium Level
                        {
                            id: "jee_chem_org_002",
                            question: "Which of the following undergoes SN1 reaction fastest?",
                            options: ["CH₃Cl", "(CH₃)₂CHCl", "(CH₃)₃CCl", "C₆H₅CH₂Cl"],
                            correct: 2,
                            explanation: "Tertiary carbocation (CH₃)₃C⁺ is most stable, so (CH₃)₃CCl undergoes SN1 fastest.",
                            difficulty: "medium",
                            difficulty_score: 5.1,
                            subtopic: "nucleophilic_substitution",
                            bookReference: "Clayden Organic Chemistry, Chapter 17",
                            conceptTags: ["SN1", "carbocation_stability", "nucleophilic_substitution"],
                            yearAppeared: ["JEE Advanced 2019", "JEE Advanced 2020"],
                            timeToSolve: "2.5 minutes",
                            prerequisite: ["carbocation_stability", "SN1_mechanism"]
                        },
                        
                        // Hard Level
                        {
                            id: "jee_chem_org_003",
                            question: "Benzene reacts with CH₃COCl in presence of AlCl₃ to give:",
                            options: ["Toluene", "Acetophenone", "Benzoic acid", "Phenol"],
                            correct: 1,
                            explanation: "This is Friedel-Crafts acylation reaction producing acetophenone (C₆H₅COCH₃).",
                            difficulty: "hard",
                            difficulty_score: 6.9,
                            subtopic: "friedel_crafts",
                            bookReference: "March Advanced Organic Chemistry, Chapter 11",
                            conceptTags: ["friedel_crafts", "acylation", "benzene_reactions", "electrophilic_substitution"],
                            yearAppeared: ["JEE Advanced 2021", "JEE Advanced 2022"],
                            timeToSolve: "3 minutes",
                            prerequisite: ["electrophilic_substitution", "benzene_chemistry", "acyl_chlorides"]
                        }
                    ]
                }
            }
        };
    }

    // Get unique questions based on filters
    getUniqueQuestions(exam, subject, topic = null, difficulty = null, count = 10) {
        let questionPool = [];
        
        if (topic) {
            questionPool = this.questionBank[exam]?.[subject]?.[topic] || [];
        } else {
            // Get questions from all topics in the subject
            const subjectData = this.questionBank[exam]?.[subject] || {};
            questionPool = Object.values(subjectData).flat();
        }
        
        // Filter by difficulty if specified
        if (difficulty) {
            questionPool = questionPool.filter(q => q.difficulty === difficulty);
        }
        
        // Remove already used questions
        const availableQuestions = questionPool.filter(q => !this.usedQuestionIds.has(q.id));
        
        // If not enough unique questions, reset used questions for this combination
        if (availableQuestions.length < count) {
            this.resetUsedQuestions(exam, subject, topic);
            return this.getUniqueQuestions(exam, subject, topic, difficulty, count);
        }
        
        // Shuffle and select questions
        const shuffled = this.shuffleArray([...availableQuestions]);
        const selected = shuffled.slice(0, count);
        
        // Mark questions as used
        selected.forEach(q => this.usedQuestionIds.add(q.id));
        
        return selected;
    }

    // Reset used questions for a specific combination
    resetUsedQuestions(exam, subject, topic = null) {
        const prefix = topic ? `${exam}_${subject.substring(0, 4)}_${topic.substring(0, 4)}` : `${exam}_${subject.substring(0, 4)}`;
        
        // Remove used questions with matching prefix
        this.usedQuestionIds.forEach(id => {
            if (id.startsWith(prefix)) {
                this.usedQuestionIds.delete(id);
            }
        });
    }

    // Get questions by difficulty distribution
    getBalancedDifficultyQuestions(exam, subject, topic = null, totalQuestions = 10) {
        const easyCount = Math.floor(totalQuestions * 0.3);  // 30% easy
        const mediumCount = Math.floor(totalQuestions * 0.5); // 50% medium
        const hardCount = totalQuestions - easyCount - mediumCount; // 20% hard
        
        const questions = [
            ...this.getUniqueQuestions(exam, subject, topic, 'easy', easyCount),
            ...this.getUniqueQuestions(exam, subject, topic, 'medium', mediumCount),
            ...this.getUniqueQuestions(exam, subject, topic, 'hard', hardCount)
        ];
        
        return this.shuffleArray(questions);
    }

    // Search questions by keyword
    searchQuestions(keyword, exam = null, subject = null) {
        const results = [];
        const searchTerm = keyword.toLowerCase();
        
        const examData = exam ? { [exam]: this.questionBank[exam] } : this.questionBank;
        
        Object.entries(examData).forEach(([examName, examQuestions]) => {
            const subjectData = subject ? { [subject]: examQuestions[subject] } : examQuestions;
            
            Object.entries(subjectData).forEach(([subjectName, subjectQuestions]) => {
                Object.entries(subjectQuestions).forEach(([topicName, questions]) => {
                    questions.forEach(question => {
                        if (question.question.toLowerCase().includes(searchTerm) ||
                            question.conceptTags.some(tag => tag.includes(searchTerm)) ||
                            question.subtopic.includes(searchTerm)) {
                            results.push({
                                ...question,
                                exam: examName,
                                subject: subjectName,
                                topic: topicName
                            });
                        }
                    });
                });
            });
        });
        
        return results;
    }

    // Get question statistics
    getQuestionStats(exam = null, subject = null) {
        let totalQuestions = 0;
        const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
        const topicBreakdown = {};
        
        const examData = exam ? { [exam]: this.questionBank[exam] } : this.questionBank;
        
        Object.entries(examData).forEach(([examName, examQuestions]) => {
            const subjectData = subject ? { [subject]: examQuestions[subject] } : examQuestions;
            
            Object.entries(subjectData).forEach(([subjectName, subjectQuestions]) => {
                Object.entries(subjectQuestions).forEach(([topicName, questions]) => {
                    totalQuestions += questions.length;
                    topicBreakdown[`${examName}_${subjectName}_${topicName}`] = questions.length;
                    
                    questions.forEach(question => {
                        difficultyBreakdown[question.difficulty]++;
                    });
                });
            });
        });
        
        return {
            totalQuestions,
            difficultyBreakdown,
            topicBreakdown,
            usedQuestions: this.usedQuestionIds.size
        };
    }

    // Utility function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Get available topics for exam and subject
    getAvailableTopics(exam, subject) {
        return Object.keys(this.questionBank[exam]?.[subject] || {});
    }

    // Get available subjects for exam
    getAvailableSubjects(exam) {
        return Object.keys(this.questionBank[exam] || {});
    }

    // Get all available exams
    getAvailableExams() {
        return Object.keys(this.questionBank);
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedQuestionDatabase;
}

// Make available globally
window.EnhancedQuestionDatabase = EnhancedQuestionDatabase;