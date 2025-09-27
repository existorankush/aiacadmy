/**
 * Competitive Exam Knowledge Base
 * Comprehensive database for JEE, GATE, and Boards exams
 * Includes syllabus mapping, difficulty progression, and topic-wise question generation
 */

class CompetitiveExamKnowledgeBase {
   constructor() {
       this.examDatabase = this.initializeExamDatabase();
       this.syllabusMapping = this.initializeSyllabusMapping();
       this.authorBookReferences = this.initializeBookReferences();
        this.usedQuestions = new Set(); // Track used questions for uniqueness
        this.questionIdCounter = 0;
        this.difficultyWeights = { easy: 0.3, medium: 0.5, hard: 0.2 }; // Default distribution
   }

    // Generate unique question ID
    generateQuestionId(exam, subject, topic, index) {
        return `${exam}_${subject}_${topic}_${index}_${++this.questionIdCounter}`;
    }

   initializeExamDatabase() {
        return {
            // JEE Main & Advanced Database
            jee: {
                physics: {
                    mechanics: [
                        {
                            question: "A particle moves in a straight line with constant acceleration. If initial velocity is 5 m/s and acceleration is 2 m/s², what is the velocity after 3 seconds?",
                            options: ["9 m/s", "11 m/s", "13 m/s", "15 m/s"],
                            correct: 1,
                            explanation: "Using v = u + at, v = 5 + 2(3) = 11 m/s",
                            difficulty: "easy",
                            subtopic: "kinematics",
                            bookReference: "HC Verma Vol 1, Chapter 3",
                            formulaUsed: "v = u + at"
                        },
                        {
                            question: "A block of mass 2 kg is placed on a rough inclined plane of angle 30°. If coefficient of friction is 0.5, what is the acceleration down the plane?",
                            options: ["1.67 m/s²", "2.33 m/s²", "3.2 m/s²", "4.5 m/s²"],
                            correct: 1,
                            explanation: "Net force = mg sin θ - μmg cos θ = mg(sin θ - μ cos θ) = 2 × 10 × (0.5 - 0.5 × 0.866) = 2.33 m/s²",
                            difficulty: "medium",
                            subtopic: "friction",
                            bookReference: "HC Verma Vol 1, Chapter 6",
                            formulaUsed: "a = g(sin θ - μ cos θ)"
                        },
                        {
                            question: "A particle performs SHM with amplitude 0.1 m and time period 2π seconds. What is the maximum velocity?",
                            options: ["0.05 m/s", "0.1 m/s", "0.2 m/s", "0.314 m/s"],
                            correct: 1,
                            explanation: "Maximum velocity = ωA = (2π/T) × A = (2π/2π) × 0.1 = 0.1 m/s",
                            difficulty: "easy",
                            subtopic: "oscillations",
                            bookReference: "HC Verma Vol 1, Chapter 12",
                            formulaUsed: "v_max = ωA"
                        }
                    ],
                    thermodynamics: [
                        {
                            question: "An ideal gas undergoes isothermal expansion. The work done by the gas is 200 J. What is the change in internal energy?",
                            options: ["0 J", "100 J", "200 J", "-200 J"],
                            correct: 0,
                            explanation: "For isothermal process, ΔT = 0, therefore ΔU = 0 (internal energy depends only on temperature for ideal gas)",
                            difficulty: "medium",
                            subtopic: "first_law",
                            bookReference: "HC Verma Vol 2, Chapter 26",
                            formulaUsed: "ΔU = nCᵥΔT = 0 for isothermal process"
                        },
                        {
                            question: "The efficiency of a Carnot engine operating between 400K and 300K is:",
                            options: ["20%", "25%", "33%", "75%"],
                            correct: 1,
                            explanation: "Efficiency = 1 - (T₂/T₁) = 1 - (300/400) = 1 - 0.75 = 0.25 = 25%",
                            difficulty: "easy",
                            subtopic: "heat_engines",
                            bookReference: "HC Verma Vol 2, Chapter 27",
                            formulaUsed: "η = 1 - T₂/T₁"
                        }
                    ],
                    electromagnetism: [
                        {
                            question: "Two charges +2μC and -3μC are placed 10 cm apart. What is the electric field at the midpoint?",
                            options: ["9 × 10⁵ N/C", "1.8 × 10⁶ N/C", "3.6 × 10⁶ N/C", "7.2 × 10⁶ N/C"],
                            correct: 1,
                            explanation: "E = kq₁/r₁² + kq₂/r₂² = 9×10⁹[(2×10⁻⁶)/(0.05)² + (3×10⁻⁶)/(0.05)²] = 1.8×10⁶ N/C",
                            difficulty: "medium",
                            subtopic: "electric_field",
                            bookReference: "HC Verma Vol 2, Chapter 29",
                            formulaUsed: "E = kq/r²"
                        }
                    ]
                },
                chemistry: {
                    physical_chemistry: [
                        {
                            question: "The pH of 0.01 M HCl solution is:",
                            options: ["1", "2", "12", "14"],
                            correct: 1,
                            explanation: "HCl is a strong acid, [H⁺] = 0.01 M, pH = -log(0.01) = -log(10⁻²) = 2",
                            difficulty: "easy",
                            subtopic: "acids_bases",
                            bookReference: "P. Bahadur, Chapter 8",
                            formulaUsed: "pH = -log[H⁺]"
                        },
                        {
                            question: "For the reaction A → B, if the rate constant is 0.693 min⁻¹, what is the half-life?",
                            options: ["0.5 min", "1 min", "1.5 min", "2 min"],
                            correct: 1,
                            explanation: "For first-order reaction, t₁/₂ = 0.693/k = 0.693/0.693 = 1 min",
                            difficulty: "easy",
                            subtopic: "chemical_kinetics",
                            bookReference: "P. Bahadur, Chapter 4",
                            formulaUsed: "t₁/₂ = 0.693/k"
                        }
                    ],
                    organic_chemistry: [
                        {
                            question: "Which reagent is used for the oxidation of primary alcohols to aldehydes?",
                            options: ["KMnO₄", "PCC", "K₂Cr₂O₇/H₂SO₄", "LiAlH₄"],
                            correct: 1,
                            explanation: "PCC (Pyridinium chlorochromate) is used for oxidation of primary alcohols to aldehydes without over-oxidation",
                            difficulty: "medium",
                            subtopic: "alcohols",
                            bookReference: "Morrison Boyd, Chapter 17",
                            formulaUsed: "R-CH₂OH --PCC--> R-CHO"
                        }
                    ],
                    inorganic_chemistry: [
                        {
                            question: "The electronic configuration of Cr³⁺ is:",
                            options: ["[Ar] 3d⁵", "[Ar] 3d⁴", "[Ar] 3d³", "[Ar] 4s¹ 3d²"],
                            correct: 2,
                            explanation: "Cr has configuration [Ar] 4s¹ 3d⁵. Cr³⁺ loses 4s¹ and 2 electrons from 3d⁵, giving [Ar] 3d³",
                            difficulty: "medium",
                            subtopic: "transition_elements",
                            bookReference: "JD Lee, Chapter 21",
                            formulaUsed: "Electronic configuration"
                        }
                    ]
                },
                mathematics: {
                    algebra: [
                        {
                            question: "If the roots of x² - 3x + k = 0 are equal, then k equals:",
                            options: ["3/4", "9/4", "4/9", "4/3"],
                            correct: 1,
                            explanation: "For equal roots, discriminant = 0, so b² - 4ac = 0, giving 9 - 4k = 0, therefore k = 9/4",
                            difficulty: "easy",
                            subtopic: "quadratic_equations",
                            bookReference: "RD Sharma, Chapter 8",
                            formulaUsed: "b² - 4ac = 0"
                        }
                    ],
                    calculus: [
                        {
                            question: "The derivative of sin(3x) with respect to x is:",
                            options: ["cos(3x)", "3cos(3x)", "-3sin(3x)", "3sin(3x)"],
                            correct: 1,
                            explanation: "Using chain rule, d/dx[sin(3x)] = cos(3x) × d/dx(3x) = cos(3x) × 3 = 3cos(3x)",
                            difficulty: "easy",
                            subtopic: "differentiation",
                            bookReference: "RD Sharma, Chapter 11",
                            formulaUsed: "d/dx[sin(u)] = cos(u) × du/dx"
                        }
                    ]
                }
            },

            // GATE Database
            gate: {
                computer_science: {
                    programming: [
                        {
                            question: "What is the time complexity of binary search?",
                            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                            correct: 1,
                            explanation: "Binary search divides the search space by half at each step, leading to O(log n) complexity",
                            difficulty: "easy",
                            subtopic: "algorithms",
                            bookReference: "Cormen CLRS, Chapter 2"
                        }
                    ],
                    data_structures: [
                        {
                            question: "In which data structure is LIFO principle used?",
                            options: ["Queue", "Stack", "Array", "Linked List"],
                            correct: 1,
                            explanation: "Stack follows Last In First Out (LIFO) principle where the last element added is first to be removed",
                            difficulty: "easy",
                            subtopic: "basic_ds",
                            bookReference: "Cormen CLRS, Chapter 10"
                        }
                    ]
                },
                electrical: {
                    circuits: [
                        {
                            question: "For a series RC circuit, the impedance magnitude is:",
                            options: ["R + C", "R + 1/(ωC)", "√(R² + (1/ωC)²)", "√(R² + (ωC)²)"],
                            correct: 2,
                            explanation: "For RC series circuit, Z = R - j(1/ωC), so |Z| = √(R² + (1/ωC)²)",
                            difficulty: "medium",
                            subtopic: "ac_circuits",
                            bookReference: "Alexander Sadiku, Chapter 9"
                        }
                    ]
                },
                mechanical: {
                    thermodynamics: [
                        {
                            question: "For an adiabatic process in an ideal gas, which relation is correct?",
                            options: ["PV = constant", "PVᵞ = constant", "P/V = constant", "P × V² = constant"],
                            correct: 1,
                            explanation: "For adiabatic process, PVᵞ = constant, where γ is the ratio of specific heats Cp/Cv",
                            difficulty: "medium",
                            subtopic: "gas_processes",
                            bookReference: "Yunus Cengel, Chapter 7"
                        }
                    ]
                }
            },

            // Class 12 Boards Database
            boards: {
                physics: {
                    modern_physics: [
                        {
                            question: "The photoelectric effect was explained by:",
                            options: ["Newton", "Einstein", "Planck", "Bohr"],
                            correct: 1,
                            explanation: "Einstein explained the photoelectric effect in 1905, for which he received the Nobel Prize",
                            difficulty: "easy",
                            subtopic: "photoelectric_effect",
                            bookReference: "NCERT Class 12, Chapter 11"
                        }
                    ],
                    optics: [
                        {
                            question: "The focal length of a convex lens is 20 cm. What is its power?",
                            options: ["0.5 D", "2 D", "5 D", "20 D"],
                            correct: 2,
                            explanation: "Power = 1/focal length (in meters) = 1/0.20 = 5 D",
                            difficulty: "easy",
                            subtopic: "lenses",
                            bookReference: "NCERT Class 12, Chapter 9"
                        }
                    ]
                },
                chemistry: {
                    electrochemistry: [
                        {
                            question: "The SI unit of electrical conductivity is:",
                            options: ["ohm", "siemens", "ampere", "volt"],
                            correct: 1,
                            explanation: "Siemens (S) is the SI unit of electrical conductivity, which is the reciprocal of resistance",
                            difficulty: "easy",
                            subtopic: "conductivity",
                            bookReference: "NCERT Class 12, Chapter 3"
                        }
                    ]
                },
                mathematics: {
                    integration: [
                        {
                            question: "∫ 1/x dx equals:",
                            options: ["x²/2", "log|x|", "1/x²", "-1/x²"],
                            correct: 1,
                            explanation: "The integral of 1/x is log|x| + C, where C is the constant of integration",
                            difficulty: "easy",
                            subtopic: "basic_integration",
                            bookReference: "NCERT Class 12, Chapter 7"
                        }
                    ]
                }
            }
        };
    }

    initializeSyllabusMapping() {
        return {
            jee: {
                physics: {
                    class11: {
                        mechanics: ["kinematics", "laws_of_motion", "work_energy", "rotational_motion", "gravitation"],
                        thermodynamics: ["kinetic_theory", "first_law", "second_law"],
                        waves: ["wave_motion", "sound_waves"]
                    },
                    class12: {
                        electromagnetism: ["electric_field", "magnetic_field", "electromagnetic_induction"],
                        modern_physics: ["photoelectric_effect", "atomic_structure", "nuclear_physics"],
                        optics: ["ray_optics", "wave_optics"]
                    }
                },
                chemistry: {
                    physical: ["atomic_structure", "chemical_bonding", "thermodynamics", "equilibrium", "kinetics"],
                    organic: ["hydrocarbons", "alcohols", "aldehydes_ketones", "carboxylic_acids", "amines"],
                    inorganic: ["periodic_table", "s_block", "p_block", "d_block", "coordination_compounds"]
                },
                mathematics: {
                    algebra: ["complex_numbers", "quadratic_equations", "sequences_series", "permutations_combinations"],
                    calculus: ["limits", "differentiation", "integration", "differential_equations"],
                    coordinate_geometry: ["straight_lines", "circles", "conic_sections", "3d_geometry"],
                    trigonometry: ["ratios", "identities", "equations", "inverse_functions"]
                }
            },
            gate: {
                computer_science: {
                    programming: ["c_programming", "data_structures", "algorithms", "software_engineering"],
                    theory: ["automata", "compilers", "databases", "operating_systems", "computer_networks"],
                    mathematics: ["discrete_math", "linear_algebra", "probability", "calculus"]
                },
                electrical: {
                    circuits: ["network_analysis", "electronic_devices", "analog_circuits", "digital_circuits"],
                    systems: ["signals_systems", "control_systems", "communication_systems"],
                    power: ["electrical_machines", "power_systems", "power_electronics"]
                }
            },
            boards: {
                class12: {
                    physics: ["electrostatics", "current_electricity", "magnetism", "electromagnetic_induction", 
                             "alternating_current", "electromagnetic_waves", "ray_optics", "wave_optics", 
                             "dual_nature", "atoms_nuclei", "semiconductor_electronics"],
                    chemistry: ["solid_state", "solutions", "electrochemistry", "chemical_kinetics", 
                               "surface_chemistry", "p_block", "d_f_block", "coordination_compounds", 
                               "haloalkanes", "alcohols_ethers", "aldehydes_ketones", "carboxylic_acids", 
                               "amines", "biomolecules", "polymers"],
                    mathematics: ["relations_functions", "inverse_trigonometric", "matrices_determinants", 
                                 "continuity_differentiability", "applications_derivatives", "integrals", 
                                 "applications_integrals", "differential_equations", "vector_algebra", 
                                 "three_dimensional", "linear_programming", "probability"]
                }
            }
        };
    }

    initializeBookReferences() {
        return {
            jee: {
                physics: [
                    { title: "Concepts of Physics", author: "HC Verma", volumes: 2 },
                    { title: "Fundamentals of Physics", author: "Resnick Halliday Krane", volumes: 1 },
                    { title: "Problems in General Physics", author: "IE Irodov", volumes: 1 },
                    { title: "NCERT Physics", author: "NCERT", volumes: 2 }
                ],
                chemistry: [
                    { title: "Numerical Chemistry", author: "P. Bahadur", volumes: 1 },
                    { title: "Organic Chemistry", author: "Morrison Boyd", volumes: 1 },
                    { title: "Concise Inorganic Chemistry", author: "JD Lee", volumes: 1 },
                    { title: "Modern Approach to Chemical Calculations", author: "RC Mukherjee", volumes: 1 }
                ],
                mathematics: [
                    { title: "Mathematics for Class XI & XII", author: "RD Sharma", volumes: 2 },
                    { title: "Coordinate Geometry", author: "SL Loney", volumes: 1 },
                    { title: "Calculus", author: "IA Maron", volumes: 1 },
                    { title: "Algebra", author: "Hall & Knight", volumes: 1 }
                ]
            },
            gate: {
                computer_science: [
                    { title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", volumes: 1 },
                    { title: "Computer Networks", author: "Andrew S. Tanenbaum", volumes: 1 },
                    { title: "Operating System Concepts", author: "Abraham Silberschatz", volumes: 1 },
                    { title: "Database System Concepts", author: "Henry F. Korth", volumes: 1 }
                ],
                electrical: [
                    { title: "Fundamentals of Electric Circuits", author: "Charles Alexander", volumes: 1 },
                    { title: "Control Systems Engineering", author: "Norman Nise", volumes: 1 },
                    { title: "Signals and Systems", author: "Alan Oppenheim", volumes: 1 }
                ]
            },
            boards: {
                physics: [
                    { title: "Physics NCERT", author: "NCERT", volumes: 2 },
                    { title: "All in One Physics", author: "Arihant", volumes: 1 },
                    { title: "Pradeep's Fundamental Physics", author: "Pradeep", volumes: 2 }
                ],
                chemistry: [
                    { title: "Chemistry NCERT", author: "NCERT", volumes: 2 },
                    { title: "All in One Chemistry", author: "Arihant", volumes: 1 },
                    { title: "Pradeep's New Course Chemistry", author: "Pradeep", volumes: 2 }
                ],
                mathematics: [
                    { title: "Mathematics NCERT", author: "NCERT", volumes: 2 },
                    { title: "All in One Mathematics", author: "Arihant", volumes: 1 },
                    { title: "RD Sharma", author: "RD Sharma", volumes: 2 }
                ]
            }
        };
    }

    // Generate exam-specific quiz
    generateExamQuiz(exam, subject, topic = null, difficulty = "medium", numQuestions = 10) {
        const examLower = exam.toLowerCase();
        const subjectLower = subject.toLowerCase();
        let questions = [];

        if (this.examDatabase[examLower] && this.examDatabase[examLower][subjectLower]) {
            const subjectData = this.examDatabase[examLower][subjectLower];
            
            if (topic) {
                const topicLower = topic.toLowerCase();
                if (subjectData[topicLower]) {
                    questions = [...subjectData[topicLower]];
                } else {
                    // Search in all topics for partial matches
                    Object.entries(subjectData).forEach(([topicName, topicQuestions]) => {
                        if (topicName.includes(topicLower) || topicLower.includes(topicName)) {
                            questions.push(...topicQuestions);
                        }
                    });
                }
            } else {
                // Get questions from all topics
                Object.values(subjectData).forEach(topicQuestions => {
                    questions.push(...topicQuestions);
                });
            }
        }

        // Filter by difficulty
        if (difficulty !== "all") {
            questions = questions.filter(q => q.difficulty === difficulty);
        }

        // If not enough questions, generate template questions
        if (questions.length < numQuestions) {
            const additionalQuestions = this.generateTemplateQuestions(
                exam, subject, topic, numQuestions - questions.length
            );
            questions.push(...additionalQuestions);
        }

        // Shuffle and return requested number
        const shuffled = this.shuffleArray(questions);
        return shuffled.slice(0, numQuestions);
    }

    // Generate template questions when specific questions are not available
    generateTemplateQuestions(exam, subject, topic, numNeeded) {
        const templates = this.getExamTemplates(exam, subject);
        const questions = [];
        
        for (let i = 0; i < Math.min(numNeeded, templates.length); i++) {
            const template = templates[i];
            questions.push({
                question: template.question.replace('{topic}', topic || subject),
                options: template.options.map(opt => opt.replace('{topic}', topic || subject)),
                correct: template.correct,
                explanation: template.explanation.replace('{topic}', topic || subject),
                difficulty: "medium",
                subtopic: topic || subject,
                bookReference: this.getRandomBookReference(exam, subject),
                isTemplate: true
            });
        }
        
        return questions;
    }

    getExamTemplates(exam, subject) {
        const templates = {
            jee: {
                physics: [
                    {
                        question: "What is the fundamental principle behind {topic}?",
                        options: ["Conservation of energy", "Newton's laws", "Wave-particle duality", "All of the above"],
                        correct: 3,
                        explanation: "{topic} involves multiple fundamental principles of physics."
                    }
                ],
                chemistry: [
                    {
                        question: "Which of the following best describes {topic}?",
                        options: ["Chemical reaction", "Physical process", "Molecular interaction", "Depends on context"],
                        correct: 3,
                        explanation: "{topic} can involve various chemical and physical processes."
                    }
                ],
                mathematics: [
                    {
                        question: "In {topic}, which method is most commonly used?",
                        options: ["Algebraic method", "Geometric method", "Calculus method", "All methods are used"],
                        correct: 3,
                        explanation: "{topic} problems can be solved using various mathematical approaches."
                    }
                ]
            }
        };

        return templates[exam]?.[subject] || [
            {
                question: "What is the importance of studying {topic}?",
                options: ["Academic requirement", "Practical applications", "Competitive exam preparation", "All of the above"],
                correct: 3,
                explanation: "Studying {topic} is important for comprehensive understanding and exam preparation."
            }
        ];
    }

    // Get syllabus coverage for tracking progress
    getSyllabusCoverage(exam, subject = null) {
        const examLower = exam.toLowerCase();
        if (subject) {
            return this.syllabusMapping[examLower]?.[subject.toLowerCase()] || {};
        }
        return this.syllabusMapping[examLower] || {};
    }

    // Get recommended books for exam and subject
    getRecommendedBooks(exam, subject = null) {
        const examLower = exam.toLowerCase();
        if (subject) {
            return this.authorBookReferences[examLower]?.[subject.toLowerCase()] || [];
        }
        return this.authorBookReferences[examLower] || {};
    }

    // Search functionality across all exams
    searchQuestions(searchTerm, exam = null, subject = null) {
        const results = [];
        const searchLower = searchTerm.toLowerCase();

        const searchInDatabase = (examName, examData) => {
            Object.entries(examData).forEach(([subjectName, subjectData]) => {
                if (subject && subjectName !== subject.toLowerCase()) return;
                
                Object.entries(subjectData).forEach(([topicName, questions]) => {
                    questions.forEach(question => {
                        if (question.question.toLowerCase().includes(searchLower) ||
                            question.explanation.toLowerCase().includes(searchLower) ||
                            (question.subtopic && question.subtopic.toLowerCase().includes(searchLower))) {
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
        };

        if (exam) {
            const examData = this.examDatabase[exam.toLowerCase()];
            if (examData) {
                searchInDatabase(exam, examData);
            }
        } else {
            Object.entries(this.examDatabase).forEach(([examName, examData]) => {
                searchInDatabase(examName, examData);
            });
        }

        return results;
    }

    // Get difficulty progression for adaptive learning
    getDifficultyProgression(exam, subject, topic) {
        const questions = this.generateExamQuiz(exam, subject, topic, "all", 100);
        const progression = {
            easy: questions.filter(q => q.difficulty === "easy"),
            medium: questions.filter(q => q.difficulty === "medium"),
            hard: questions.filter(q => q.difficulty === "hard")
        };
        
        return progression;
    }

    // Analyze weak areas based on quiz performance
    analyzeWeakAreas(quizHistory, exam, subject) {
        const topicPerformance = {};
        
        quizHistory.forEach(quiz => {
            if (quiz.exam === exam && quiz.subject === subject) {
                quiz.questions.forEach((question, index) => {
                    const topic = question.subtopic || question.topic;
                    if (!topicPerformance[topic]) {
                        topicPerformance[topic] = { correct: 0, total: 0 };
                    }
                    topicPerformance[topic].total++;
                    if (quiz.userAnswers[index] === question.correct) {
                        topicPerformance[topic].correct++;
                    }
                });
            }
        });

        // Convert to percentage and find weak areas (below 60%)
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

    getRandomBookReference(exam, subject) {
        const books = this.getRecommendedBooks(exam, subject);
        if (books.length > 0) {
            const randomBook = books[Math.floor(Math.random() * books.length)];
            return `${randomBook.title} by ${randomBook.author}`;
        }
        return `${exam.toUpperCase()} ${subject} Reference Book`;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Get all available topics for an exam and subject
    getAvailableTopics(exam, subject) {
        const examData = this.examDatabase[exam.toLowerCase()];
        if (examData && examData[subject.toLowerCase()]) {
            return Object.keys(examData[subject.toLowerCase()]);
        }
        return [];
    }

    // Get question statistics
    getQuestionStats(exam = null, subject = null) {
        let totalQuestions = 0;
        let difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
        let subjectBreakdown = {};

        const countQuestions = (examData, examName) => {
            Object.entries(examData).forEach(([subjectName, subjectData]) => {
                if (subject && subjectName !== subject.toLowerCase()) return;
                
                if (!subjectBreakdown[subjectName]) {
                    subjectBreakdown[subjectName] = 0;
                }

                Object.values(subjectData).forEach(topicQuestions => {
                    topicQuestions.forEach(question => {
                        totalQuestions++;
                        subjectBreakdown[subjectName]++;
                        if (question.difficulty) {
                            difficultyBreakdown[question.difficulty]++;
                        }
                    });
                });
            });
        };

        if (exam) {
            const examData = this.examDatabase[exam.toLowerCase()];
            if (examData) {
                countQuestions(examData, exam);
            }
        } else {
            Object.entries(this.examDatabase).forEach(([examName, examData]) => {
                countQuestions(examData, examName);
            });
        }

        return {
            totalQuestions,
            difficultyBreakdown,
            subjectBreakdown
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompetitiveExamKnowledgeBase;
}

// Make available globally
window.CompetitiveExamKnowledgeBase = CompetitiveExamKnowledgeBase;