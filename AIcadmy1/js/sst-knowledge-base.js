/**
 * SST (Social Studies) Knowledge Base - Classes 1-12
 * Comprehensive database for generating accurate SST quizzes
 */

class SSTKnowledgeBase {
    constructor() {
        this.sstDatabase = this.initializeDatabase();
    }

    initializeDatabase() {
        return {
            // CLASS 1-2 (Primary Level)
            primaryLevel: {
                'my family': [
                    {
                        question: "How many members are there in your family?",
                        options: ["2-3 members", "4-5 members", "More than 5", "It can be different for everyone"],
                        correct: 3,
                        explanation: "Families can have different numbers of members - some small, some big. Every family is special!"
                    },
                    {
                        question: "Who takes care of you at home?",
                        options: ["Parents", "Grandparents", "Elder siblings", "All family members"],
                        correct: 3,
                        explanation: "All family members love and take care of each other in different ways."
                    }
                ],
                'my school': [
                    {
                        question: "What do we do in school?",
                        options: ["Only play", "Only study", "Learn and play", "Sleep all day"],
                        correct: 2,
                        explanation: "School is where we learn new things and also play with friends!"
                    },
                    {
                        question: "Who helps us learn in school?",
                        options: ["Teachers", "Friends", "Books", "All of these"],
                        correct: 3,
                        explanation: "Teachers guide us, friends help us, and books give us knowledge - all help us learn!"
                    }
                ],
                'my neighborhood': [
                    {
                        question: "What is a neighborhood?",
                        options: ["My house only", "Houses around my house", "Only my school", "The whole world"],
                        correct: 1,
                        explanation: "A neighborhood includes all the houses and places near where we live."
                    }
                ]
            },

            // CLASS 3-5 (Elementary Level)
            elementaryLevel: {
                'maps and globes': [
                    {
                        question: "What shows the real shape of the Earth?",
                        options: ["Map", "Globe", "Picture", "Book"],
                        correct: 1,
                        explanation: "A globe shows the real round shape of the Earth, while maps are flat representations."
                    },
                    {
                        question: "What are the main directions on a map?",
                        options: ["Up and Down", "Left and Right", "North, South, East, West", "Front and Back"],
                        correct: 2,
                        explanation: "The four main directions are North, South, East, and West, shown on maps with a compass rose."
                    }
                ],
                'our country india': [
                    {
                        question: "What is the capital of India?",
                        options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
                        correct: 1,
                        explanation: "New Delhi is the capital city of India where the government offices are located."
                    },
                    {
                        question: "How many states are there in India?",
                        options: ["25", "28", "30", "32"],
                        correct: 1,
                        explanation: "India has 28 states and 8 Union Territories."
                    },
                    {
                        question: "What is the national bird of India?",
                        options: ["Parrot", "Eagle", "Peacock", "Crow"],
                        correct: 2,
                        explanation: "The Peacock is India's national bird, known for its beautiful colorful feathers."
                    }
                ],
                'means of transport': [
                    {
                        question: "Which transport is used on roads?",
                        options: ["Ship", "Airplane", "Car", "Boat"],
                        correct: 2,
                        explanation: "Cars, buses, and trucks are examples of road transport."
                    },
                    {
                        question: "What is the fastest means of transport?",
                        options: ["Train", "Ship", "Airplane", "Bicycle"],
                        correct: 2,
                        explanation: "Airplanes are the fastest means of transport for long distances."
                    }
                ]
            },

            // CLASS 6-8 (Middle School Level)
            middleLevel: {
                'the earth and its movements': [
                    {
                        question: "How long does the Earth take to complete one rotation?",
                        options: ["12 hours", "24 hours", "48 hours", "365 days"],
                        correct: 1,
                        explanation: "The Earth takes 24 hours (1 day) to complete one rotation on its axis."
                    },
                    {
                        question: "What causes seasons on Earth?",
                        options: ["Earth's rotation", "Earth's revolution", "Moon's movement", "Sun's movement"],
                        correct: 1,
                        explanation: "Earth's revolution around the Sun and its tilted axis cause different seasons."
                    }
                ],
                'major landforms': [
                    {
                        question: "What is the highest mountain peak in the world?",
                        options: ["K2", "Mount Everest", "Kanchenjunga", "Mount McKinley"],
                        correct: 1,
                        explanation: "Mount Everest in the Himalayas is the world's highest peak at 8,848 meters."
                    },
                    {
                        question: "Which is the largest desert in the world?",
                        options: ["Sahara Desert", "Thar Desert", "Antarctic Desert", "Gobi Desert"],
                        correct: 2,
                        explanation: "The Antarctic Desert is actually the largest desert in the world (cold desert)."
                    }
                ],
                'indian history': [
                    {
                        question: "Who was the first Prime Minister of India?",
                        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Dr. Rajendra Prasad"],
                        correct: 1,
                        explanation: "Jawaharlal Nehru was India's first Prime Minister from 1947 to 1964."
                    },
                    {
                        question: "When did India gain independence?",
                        options: ["August 14, 1947", "August 15, 1947", "January 26, 1950", "August 15, 1948"],
                        correct: 1,
                        explanation: "India gained independence from British rule on August 15, 1947."
                    }
                ],
                'government and democracy': [
                    {
                        question: "What type of government does India have?",
                        options: ["Monarchy", "Democracy", "Dictatorship", "Military rule"],
                        correct: 1,
                        explanation: "India is a democratic republic where people elect their representatives."
                    },
                    {
                        question: "At what age can a person vote in India?",
                        options: ["16 years", "18 years", "21 years", "25 years"],
                        correct: 1,
                        explanation: "In India, citizens can vote from the age of 18 years."
                    }
                ]
            },

            // CLASS 9-10 (Secondary Level) - Enhanced NCERT Based
            secondaryLevel: {
                'contemporary india geography': [
                    {
                        question: "Which river is known as the lifeline of India?",
                        options: ["Yamuna", "Ganga", "Brahmaputra", "Godavari"],
                        correct: 1,
                        explanation: "The Ganga river is called the lifeline of India as it supports millions of people across the Indo-Gangetic plains."
                    },
                    {
                        question: "Which is the southernmost point of India?",
                        options: ["Cape Comorin", "Indira Point", "Point Calimere", "Dhanushkodi"],
                        correct: 1,
                        explanation: "Indira Point in the Andaman and Nicobar Islands is India's southernmost point (after the 2004 tsunami)."
                    },
                    {
                        question: "The Tropic of Cancer passes through how many states in India?",
                        options: ["6", "7", "8", "9"],
                        correct: 2,
                        explanation: "The Tropic of Cancer passes through 8 states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram."
                    },
                    {
                        question: "Which plateau is known as the 'Roof of the World'?",
                        options: ["Deccan Plateau", "Tibetan Plateau", "Malwa Plateau", "Chota Nagpur Plateau"],
                        correct: 1,
                        explanation: "The Tibetan Plateau is called the 'Roof of the World' due to its high elevation (average 4,500m above sea level)."
                    }
                ],
                'democratic politics': [
                    {
                        question: "How many houses does the Indian Parliament have?",
                        options: ["One", "Two", "Three", "Four"],
                        correct: 1,
                        explanation: "The Indian Parliament has two houses: Lok Sabha (House of People) and Rajya Sabha (Council of States) - this is called bicameralism."
                    },
                    {
                        question: "Who is the constitutional head of India?",
                        options: ["Prime Minister", "President", "Chief Justice", "Governor"],
                        correct: 1,
                        explanation: "The President of India is the constitutional head and is elected by an Electoral College comprising MPs and MLAs."
                    },
                    {
                        question: "What is the minimum age to become a member of Lok Sabha?",
                        options: ["21 years", "25 years", "30 years", "35 years"],
                        correct: 1,
                        explanation: "According to Article 84 of the Constitution, minimum age for Lok Sabha membership is 25 years."
                    },
                    {
                        question: "Which article of the Constitution deals with Right to Equality?",
                        options: ["Article 12-18", "Article 14-18", "Article 19-22", "Article 23-24"],
                        correct: 1,
                        explanation: "Articles 14-18 deal with Right to Equality, including equality before law and prohibition of discrimination."
                    }
                ],
                'economics': [
                    {
                        question: "What is GDP?",
                        options: ["Government Development Plan", "Gross Domestic Product", "General Development Program", "Gross Development Plan"],
                        correct: 1,
                        explanation: "GDP (Gross Domestic Product) measures the total value of all goods and services produced within a country's borders in a year."
                    },
                    {
                        question: "Which sector employs the maximum people in India?",
                        options: ["Primary Sector", "Secondary Sector", "Tertiary Sector", "Quaternary Sector"],
                        correct: 0,
                        explanation: "Primary sector (agriculture, forestry, fishing) still employs about 50% of India's workforce despite contributing less to GDP."
                    },
                    {
                        question: "What is the poverty line based on in India?",
                        options: ["Income only", "Consumption expenditure", "Asset ownership", "Employment status"],
                        correct: 1,
                        explanation: "India's poverty line is based on consumption expenditure - minimum consumption needed to fulfill basic needs."
                    }
                ],
                'freedom struggle': [
                    {
                        question: "When was the Quit India Movement launched?",
                        options: ["1940", "1941", "1942", "1943"],
                        correct: 2,
                        explanation: "The Quit India Movement was launched on 8 August 1942 by Mahatma Gandhi with the slogan 'Do or Die'."
                    },
                    {
                        question: "Who founded the Indian National Army (INA)?",
                        options: ["Subhas Chandra Bose", "Mohan Singh", "Rash Behari Bose", "All of these"],
                        correct: 3,
                        explanation: "INA was first formed by Mohan Singh, reorganized by Rash Behari Bose, and later led by Subhas Chandra Bose."
                    }
                ]
            },

            // CLASS 11-12 (Senior Secondary Level) - NCERT Based
            seniorLevel: {
                'world geography': [
                    {
                        question: "Which line divides the Earth into Northern and Southern hemispheres?",
                        options: ["Tropic of Cancer", "Tropic of Capricorn", "Equator", "Prime Meridian"],
                        correct: 2,
                        explanation: "The Equator (0° latitude) divides the Earth into Northern and Southern hemispheres."
                    },
                    {
                        question: "What is the study of weather called?",
                        options: ["Climatology", "Meteorology", "Geology", "Oceanography"],
                        correct: 1,
                        explanation: "Meteorology is the study of weather and atmospheric conditions."
                    }
                ],
                'political science': [
                    {
                        question: "What is federalism?",
                        options: ["Single government", "Division of power between center and states", "Military rule", "Religious government"],
                        correct: 1,
                        explanation: "Federalism is a system where power is divided between the central government and state governments."
                    },
                    {
                        question: "What is the minimum age to become a member of Lok Sabha?",
                        options: ["21 years", "25 years", "30 years", "35 years"],
                        correct: 1,
                        explanation: "The minimum age to become a member of Lok Sabha is 25 years."
                    }
                ],
                'indian economy': [
                    {
                        question: "What was India's economic policy before 1991?",
                        options: ["Liberalization", "Mixed economy", "Capitalist economy", "Socialist economy"],
                        correct: 1,
                        explanation: "Before 1991, India followed a mixed economy model with significant government control."
                    },
                    {
                        question: "When did India launch its economic liberalization policy?",
                        options: ["1990", "1991", "1992", "1993"],
                        correct: 1,
                        explanation: "India launched its economic liberalization policy in 1991 under P.V. Narasimha Rao's government."
                    }
                ],
                'world history': [
                    {
                        question: "When did World War I begin?",
                        options: ["1913", "1914", "1915", "1916"],
                        correct: 1,
                        explanation: "World War I began on July 28, 1914, following the assassination of Archduke Franz Ferdinand."
                    },
                    {
                        question: "Which revolution took place in Russia in 1917?",
                        options: ["French Revolution", "Industrial Revolution", "Russian Revolution", "American Revolution"],
                        correct: 2,
                        explanation: "The Russian Revolution of 1917 led to the fall of the Tsarist regime and rise of communism."
                    }
                ]
            }
        };
    }

    // Generate quiz based on topic and class level
    generateSSTQuiz(topic, classLevel = 'middle', numQuestions = 5) {
        const topicLower = topic.toLowerCase();
        let selectedQuestions = [];
        
        // Determine the appropriate level based on class
        let levelKey = this.determineLevel(classLevel);
        let searchLevels = [levelKey];
        
        // Add adjacent levels for better coverage
        if (levelKey === 'primaryLevel') {
            searchLevels.push('elementaryLevel');
        } else if (levelKey === 'elementaryLevel') {
            searchLevels.push('primaryLevel', 'middleLevel');
        } else if (levelKey === 'middleLevel') {
            searchLevels.push('elementaryLevel', 'secondaryLevel');
        } else if (levelKey === 'secondaryLevel') {
            searchLevels.push('middleLevel', 'seniorLevel');
        } else if (levelKey === 'seniorLevel') {
            searchLevels.push('secondaryLevel');
        }

        // Search for matching topics across appropriate levels
        for (const level of searchLevels) {
            const levelData = this.sstDatabase[level];
            if (!levelData) continue;

            // Direct topic match
            if (levelData[topicLower]) {
                selectedQuestions.push(...levelData[topicLower]);
            }

            // Partial topic match
            Object.keys(levelData).forEach(key => {
                if (key.includes(topicLower) || topicLower.includes(key)) {
                    selectedQuestions.push(...levelData[key]);
                }
            });

            if (selectedQuestions.length >= numQuestions) break;
        }

        // If no specific match, generate contextual questions
        if (selectedQuestions.length === 0) {
            selectedQuestions = this.generateContextualQuestions(topic, classLevel);
        }

        // Shuffle and return requested number
        const shuffled = this.shuffleArray([...selectedQuestions]);
        return shuffled.slice(0, numQuestions);
    }

    determineLevel(classLevel) {
        if (typeof classLevel === 'string') {
            classLevel = classLevel.toLowerCase();
            if (classLevel.includes('1') || classLevel.includes('2') || classLevel.includes('primary')) {
                return 'primaryLevel';
            } else if (classLevel.includes('3') || classLevel.includes('4') || classLevel.includes('5') || classLevel.includes('elementary')) {
                return 'elementaryLevel';
            } else if (classLevel.includes('6') || classLevel.includes('7') || classLevel.includes('8') || classLevel.includes('middle')) {
                return 'middleLevel';
            } else if (classLevel.includes('9') || classLevel.includes('10') || classLevel.includes('secondary')) {
                return 'secondaryLevel';
            } else if (classLevel.includes('11') || classLevel.includes('12') || classLevel.includes('senior')) {
                return 'seniorLevel';
            }
        }

        if (typeof classLevel === 'number') {
            if (classLevel <= 2) return 'primaryLevel';
            if (classLevel <= 5) return 'elementaryLevel';
            if (classLevel <= 8) return 'middleLevel';
            if (classLevel <= 10) return 'secondaryLevel';
            return 'seniorLevel';
        }

        return 'middleLevel'; // default
    }

    generateContextualQuestions(topic, classLevel) {
        const level = this.determineLevel(classLevel);
        const templates = this.getQuestionTemplates(level);
        
        return templates.map(template => ({
            question: template.question.replace('{topic}', topic),
            options: template.options.map(opt => opt.replace('{topic}', topic)),
            correct: template.correct,
            explanation: template.explanation.replace('{topic}', topic)
        }));
    }

    getQuestionTemplates(level) {
        const templates = {
            primaryLevel: [
                {
                    question: "What do you know about {topic}?",
                    options: ["It is important", "It is not important", "I don't know", "It is fun to learn about"],
                    correct: 0,
                    explanation: "{topic} is an important topic that helps us understand our world better."
                },
                {
                    question: "Where can we learn about {topic}?",
                    options: ["Only at home", "Only in school", "In books and school", "Nowhere"],
                    correct: 2,
                    explanation: "We can learn about {topic} from books, teachers, and by observing around us."
                }
            ],
            elementaryLevel: [
                {
                    question: "Why is it important to study {topic}?",
                    options: ["To pass exams only", "To understand our world", "It's not important", "Just for fun"],
                    correct: 1,
                    explanation: "Studying {topic} helps us understand our world and how things work around us."
                },
                {
                    question: "What is the main idea behind {topic}?",
                    options: ["It's very simple", "It helps us learn about society", "It's very difficult", "It's not useful"],
                    correct: 1,
                    explanation: "{topic} helps us understand how society and the world around us functions."
                }
            ],
            middleLevel: [
                {
                    question: "How does {topic} affect our daily life?",
                    options: ["It doesn't affect us", "It has a major impact", "Only a little impact", "Only affects adults"],
                    correct: 1,
                    explanation: "{topic} has a significant impact on our daily lives and shapes how society functions."
                },
                {
                    question: "What are the key aspects of {topic}?",
                    options: ["Only historical aspects", "Social and economic aspects", "Only political aspects", "No important aspects"],
                    correct: 1,
                    explanation: "{topic} involves multiple social, economic, and sometimes political aspects that we need to understand."
                }
            ],
            secondaryLevel: [
                {
                    question: "What is the significance of {topic} in modern India?",
                    options: ["No significance", "Historical significance only", "Contemporary relevance and importance", "Only academic importance"],
                    correct: 2,
                    explanation: "{topic} has significant contemporary relevance and plays an important role in modern India."
                },
                {
                    question: "How has {topic} evolved over time?",
                    options: ["It hasn't changed", "It has undergone major changes", "Only minor changes", "It's a new concept"],
                    correct: 1,
                    explanation: "{topic} has evolved significantly over time, adapting to changing social and political conditions."
                }
            ],
            seniorLevel: [
                {
                    question: "What are the theoretical frameworks related to {topic}?",
                    options: ["No theoretical base", "Multiple theoretical perspectives exist", "Only one theory", "Only practical applications"],
                    correct: 1,
                    explanation: "{topic} can be understood through various theoretical frameworks and perspectives in social sciences."
                },
                {
                    question: "How does {topic} relate to global trends?",
                    options: ["No global connection", "Strong global connections and trends", "Only local relevance", "Not applicable globally"],
                    correct: 1,
                    explanation: "{topic} is connected to global trends and has international dimensions that we need to understand."
                }
            ]
        };

        return templates[level] || templates.middleLevel;
    }

    // Enhanced topic matching for SST subjects
    matchSSTTopic(inputTopic) {
        const sstKeywords = {
            geography: ['map', 'globe', 'earth', 'continent', 'country', 'mountain', 'river', 'ocean', 'climate', 'weather', 'landform', 'plateau', 'desert', 'forest'],
            history: ['ancient', 'medieval', 'modern', 'independence', 'freedom', 'struggle', 'movement', 'war', 'empire', 'dynasty', 'civilization', 'culture', 'heritage', 'revolution'],
            civics: ['government', 'democracy', 'constitution', 'rights', 'duties', 'parliament', 'election', 'vote', 'citizen', 'law', 'justice', 'court', 'police'],
            economics: ['economy', 'money', 'bank', 'trade', 'business', 'industry', 'agriculture', 'employment', 'poverty', 'development', 'gdp', 'income', 'market'],
            sociology: ['society', 'community', 'family', 'culture', 'tradition', 'festival', 'religion', 'caste', 'gender', 'social', 'custom', 'lifestyle']
        };

        const topicLower = inputTopic.toLowerCase();
        let matchedSubject = 'general';
        let maxMatches = 0;

        Object.entries(sstKeywords).forEach(([subject, keywords]) => {
            const matches = keywords.filter(keyword => 
                topicLower.includes(keyword) || keyword.includes(topicLower)
            ).length;
            
            if (matches > maxMatches) {
                maxMatches = matches;
                matchedSubject = subject;
            }
        });

        return matchedSubject;
    }

    // Get all topics for a specific class level
    getTopicsForClass(classLevel) {
        const level = this.determineLevel(classLevel);
        const levelData = this.sstDatabase[level];
        return levelData ? Object.keys(levelData) : [];
    }

    // Search functionality
    searchTopics(searchTerm) {
        const results = [];
        const searchLower = searchTerm.toLowerCase();

        Object.entries(this.sstDatabase).forEach(([level, topics]) => {
            Object.keys(topics).forEach(topic => {
                if (topic.includes(searchLower) || searchLower.includes(topic)) {
                    results.push({
                        topic: topic,
                        level: level,
                        questionsCount: topics[topic].length
                    });
                }
            });
        });

        return results;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SSTKnowledgeBase;
}

// Make available globally
window.SSTKnowledgeBase = SSTKnowledgeBase;
