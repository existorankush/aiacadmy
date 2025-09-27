/**
 * StudyMaterials - Topic-based study notes and Amazon book integration
 * Provides curated study materials and notes for specific topics
 */
class StudyMaterials {
    constructor() {
        this.materials = this.initializeMaterials();
        this.amazonAffiliateTag = 'aicademy-20'; // Replace with actual affiliate ID
        this.notesCache = {};
    }

    /**
     * Initialize study materials database
     */
    initializeMaterials() {
        return {
            physics: {
                mechanics: {
                    notes: [
                        {
                            title: "Newton's Laws of Motion",
                            type: "concept",
                            content: "Comprehensive guide to understanding Newton's three laws with real-world applications and problem-solving techniques.",
                            difficulty: "medium",
                            estimatedTime: "30 mins",
                            topics: ["force", "acceleration", "inertia"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        },
                        {
                            title: "Kinematics Equations",
                            type: "formula_sheet",
                            content: "All essential kinematics equations with derivations and when to use each equation.",
                            difficulty: "easy",
                            estimatedTime: "15 mins",
                            topics: ["velocity", "acceleration", "displacement"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        },
                        {
                            title: "Work-Energy Theorem",
                            type: "solved_problems",
                            content: "Step-by-step solutions to 20+ problems on work, energy, and power.",
                            difficulty: "hard",
                            estimatedTime: "45 mins",
                            topics: ["work", "energy", "power"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        }
                    ],
                    books: [
                        {
                            title: "Concepts of Physics by H.C. Verma",
                            author: "H.C. Verma",
                            amazonId: "8177091875",
                            price: "₹595",
                            rating: 4.5,
                            reviewCount: 2847,
                            image: "https://m.media-amazon.com/images/I/51J8P8W0NFL._SX374_BO1,204,203,200_.jpg",
                            description: "The most comprehensive physics textbook for JEE preparation",
                            level: "advanced"
                        },
                        {
                            title: "Fundamentals of Physics by Halliday, Resnick & Walker",
                            author: "Halliday, Resnick & Walker",
                            amazonId: "8126556927",
                            price: "₹899",
                            rating: 4.3,
                            reviewCount: 1523,
                            image: "https://m.media-amazon.com/images/I/51vB8PqBnfL._SX402_BO1,204,203,200_.jpg",
                            description: "International standard physics textbook with excellent explanations",
                            level: "intermediate"
                        }
                    ],
                    videos: [
                        {
                            title: "Physics Wallah - Mechanics Complete",
                            instructor: "Alakh Pandey",
                            duration: "25 hours",
                            url: "https://youtube.com/playlist?list=PLF_7kfnwLFCGbL_vBb2z4shjQRY-0OT1F",
                            topics: ["mechanics", "kinematics", "dynamics"]
                        }
                    ]
                },
                thermodynamics: {
                    notes: [
                        {
                            title: "First Law of Thermodynamics",
                            type: "concept",
                            content: "Energy conservation in thermodynamic processes with detailed examples.",
                            difficulty: "medium",
                            estimatedTime: "25 mins",
                            topics: ["energy", "heat", "work"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        },
                        {
                            title: "Carnot Engine Analysis",
                            type: "solved_problems",
                            content: "Complete analysis of Carnot cycle with efficiency calculations.",
                            difficulty: "hard",
                            estimatedTime: "40 mins",
                            topics: ["carnot", "efficiency", "entropy"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        }
                    ],
                    books: [
                        {
                            title: "Thermodynamics: An Engineering Approach",
                            author: "Yunus Cengel",
                            amazonId: "0073398179",
                            price: "₹1,299",
                            rating: 4.4,
                            reviewCount: 892,
                            image: "https://m.media-amazon.com/images/I/51YHrU5sOUL._SX404_BO1,204,203,200_.jpg",
                            description: "Comprehensive thermodynamics textbook for engineering students",
                            level: "advanced"
                        }
                    ],
                    videos: []
                }
            },
            mathematics: {
                calculus: {
                    notes: [
                        {
                            title: "Differentiation Rules and Techniques",
                            type: "formula_sheet",
                            content: "All differentiation rules with examples and applications.",
                            difficulty: "medium",
                            estimatedTime: "20 mins",
                            topics: ["derivatives", "chain_rule", "product_rule"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        },
                        {
                            title: "Integration Methods",
                            type: "concept",
                            content: "Complete guide to integration techniques including substitution and parts.",
                            difficulty: "hard",
                            estimatedTime: "35 mins",
                            topics: ["integration", "substitution", "by_parts"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        }
                    ],
                    books: [
                        {
                            title: "Calculus by James Stewart",
                            author: "James Stewart",
                            amazonId: "1285057090",
                            price: "₹1,599",
                            rating: 4.6,
                            reviewCount: 1247,
                            image: "https://m.media-amazon.com/images/I/51+YRZ7YHEL._SX402_BO1,204,203,200_.jpg",
                            description: "The gold standard textbook for calculus learning",
                            level: "intermediate"
                        }
                    ],
                    videos: []
                },
                algebra: {
                    notes: [
                        {
                            title: "Quadratic Equations Masterclass",
                            type: "solved_problems",
                            content: "50+ solved problems on quadratic equations with different methods.",
                            difficulty: "medium",
                            estimatedTime: "30 mins",
                            topics: ["quadratic", "discriminant", "roots"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        }
                    ],
                    books: [
                        {
                            title: "Algebra by I.A. Maron",
                            author: "I.A. Maron",
                            amazonId: "8123919264",
                            price: "₹425",
                            rating: 4.2,
                            reviewCount: 673,
                            image: "https://m.media-amazon.com/images/I/41M4XgF4jfL._SX347_BO1,204,203,200_.jpg",
                            description: "Comprehensive algebra textbook with numerous examples",
                            level: "intermediate"
                        }
                    ],
                    videos: []
                }
            },
            chemistry: {
                organic_chemistry: {
                    notes: [
                        {
                            title: "Organic Reactions Mechanism",
                            type: "concept",
                            content: "Detailed mechanisms for common organic reactions with electron movement.",
                            difficulty: "hard",
                            estimatedTime: "40 mins",
                            topics: ["mechanisms", "electrons", "reactions"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        }
                    ],
                    books: [
                        {
                            title: "Organic Chemistry by Morrison & Boyd",
                            author: "Morrison & Boyd",
                            amazonId: "8131704181",
                            price: "₹799",
                            rating: 4.3,
                            reviewCount: 956,
                            image: "https://m.media-amazon.com/images/I/51H5X8YBGXL._SX373_BO1,204,203,200_.jpg",
                            description: "Classic organic chemistry textbook trusted by generations",
                            level: "advanced"
                        }
                    ],
                    videos: []
                }
            },
            computer_science: {
                data_structures: {
                    notes: [
                        {
                            title: "Array and Linked List Comparison",
                            type: "concept",
                            content: "Comprehensive comparison with time complexity analysis.",
                            difficulty: "medium",
                            estimatedTime: "25 mins",
                            topics: ["arrays", "linked_lists", "complexity"],
                            downloadUrl: "#",
                            viewUrl: "#"
                        }
                    ],
                    books: [
                        {
                            title: "Data Structures and Algorithms in Java",
                            author: "Robert Lafore",
                            amazonId: "0672324539",
                            price: "₹699",
                            rating: 4.4,
                            reviewCount: 1124,
                            image: "https://m.media-amazon.com/images/I/51J8P8W0NFL._SX374_BO1,204,203,200_.jpg",
                            description: "Practical approach to data structures with Java implementations",
                            level: "intermediate"
                        }
                    ],
                    videos: []
                }
            }
        };
    }

    /**
     * Get study materials for a specific topic
     */
    getTopicMaterials(subject, topic) {
        const subjectMaterials = this.materials[subject?.toLowerCase()];
        if (!subjectMaterials) return null;

        const topicMaterials = subjectMaterials[topic?.toLowerCase()];
        if (!topicMaterials) {
            // Return general materials for the subject
            return this.getSubjectOverview(subject);
        }

        return topicMaterials;
    }

    /**
     * Get subject overview when specific topic not found
     */
    getSubjectOverview(subject) {
        const subjectMaterials = this.materials[subject?.toLowerCase()];
        if (!subjectMaterials) return null;

        const allNotes = [];
        const allBooks = [];
        const allVideos = [];

        Object.values(subjectMaterials).forEach(topicData => {
            if (topicData.notes) allNotes.push(...topicData.notes);
            if (topicData.books) allBooks.push(...topicData.books);
            if (topicData.videos) allVideos.push(...topicData.videos);
        });

        return {
            notes: allNotes.slice(0, 5), // Limit to 5 most relevant
            books: allBooks.slice(0, 3),
            videos: allVideos.slice(0, 3)
        };
    }

    /**
     * Generate Amazon book URL with affiliate link
     */
    generateAmazonUrl(amazonId) {
        return `https://www.amazon.in/dp/${amazonId}?tag=${this.amazonAffiliateTag}&linkCode=osi&th=1&psc=1`;
    }

    /**
     * Search materials across all subjects
     */
    searchMaterials(query) {
        const results = {
            notes: [],
            books: [],
            videos: []
        };

        const searchQuery = query.toLowerCase();

        Object.entries(this.materials).forEach(([subject, topics]) => {
            Object.entries(topics).forEach(([topic, materials]) => {
                // Search notes
                materials.notes?.forEach(note => {
                    if (note.title.toLowerCase().includes(searchQuery) ||
                        note.content.toLowerCase().includes(searchQuery) ||
                        note.topics.some(t => t.includes(searchQuery))) {
                        results.notes.push({
                            ...note,
                            subject,
                            topic
                        });
                    }
                });

                // Search books
                materials.books?.forEach(book => {
                    if (book.title.toLowerCase().includes(searchQuery) ||
                        book.author.toLowerCase().includes(searchQuery) ||
                        book.description.toLowerCase().includes(searchQuery)) {
                        results.books.push({
                            ...book,
                            subject,
                            topic
                        });
                    }
                });

                // Search videos
                materials.videos?.forEach(video => {
                    if (video.title.toLowerCase().includes(searchQuery) ||
                        video.instructor.toLowerCase().includes(searchQuery) ||
                        video.topics.some(t => t.includes(searchQuery))) {
                        results.videos.push({
                            ...video,
                            subject,
                            topic
                        });
                    }
                });
            });
        });

        return results;
    }

    /**
     * Get recommended materials based on weak topics
     */
    getRecommendedMaterials(weakTopics, limit = 10) {
        const recommendations = [];

        weakTopics.forEach(weakTopic => {
            const materials = this.searchMaterials(weakTopic.topic);
            
            // Add notes with priority
            materials.notes.forEach(note => {
                recommendations.push({
                    ...note,
                    type: 'note',
                    relevanceScore: this.calculateRelevance(note, weakTopic),
                    weakTopic: weakTopic.topic
                });
            });

            // Add books
            materials.books.forEach(book => {
                recommendations.push({
                    ...book,
                    type: 'book',
                    relevanceScore: this.calculateRelevance(book, weakTopic),
                    weakTopic: weakTopic.topic
                });
            });
        });

        // Sort by relevance and return top items
        return recommendations
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, limit);
    }

    /**
     * Calculate relevance score for recommendations
     */
    calculateRelevance(material, weakTopic) {
        let score = 0;
        
        // Base relevance
        if (material.subject === weakTopic.subject) score += 10;
        if (material.topic === weakTopic.topic) score += 20;
        
        // Difficulty matching
        const topicAccuracy = weakTopic.accuracy;
        if (topicAccuracy < 40 && material.difficulty === 'easy') score += 15;
        else if (topicAccuracy < 70 && material.difficulty === 'medium') score += 15;
        else if (topicAccuracy >= 70 && material.difficulty === 'hard') score += 15;
        
        // Type preference
        if (material.type === 'solved_problems') score += 5;
        if (material.type === 'concept') score += 3;
        
        return score;
    }

    /**
     * Generate topic materials HTML
     */
    generateTopicMaterialsHTML(subject, topic) {
        const materials = this.getTopicMaterials(subject, topic);
        if (!materials) {
            return '<div class="alert alert-info">No specific materials found for this topic. Try a general subject search.</div>';
        }

        let html = '<div class="topic-materials">';

        // Notes section
        if (materials.notes && materials.notes.length > 0) {
            html += `
                <div class="materials-section mb-4">
                    <h6 class="text-primary"><i class="fas fa-sticky-note me-2"></i>Study Notes</h6>
                    <div class="row">
            `;

            materials.notes.forEach(note => {
                const difficultyColor = note.difficulty === 'easy' ? 'success' : 
                                      note.difficulty === 'medium' ? 'warning' : 'danger';
                
                html += `
                    <div class="col-md-6 mb-3">
                        <div class="card border-left-${difficultyColor} h-100">
                            <div class="card-body p-3">
                                <h6 class="card-title">${note.title}</h6>
                                <p class="card-text small text-muted">${note.content}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span class="badge bg-${difficultyColor} text-white me-1">${note.difficulty}</span>
                                        <span class="badge bg-light text-dark">${note.estimatedTime}</span>
                                    </div>
                                    <div>
                                        <button class="btn btn-sm btn-outline-primary me-1" onclick="viewNote('${note.title}')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-primary" onclick="downloadNote('${note.title}')">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div></div>';
        }

        // Books section
        if (materials.books && materials.books.length > 0) {
            html += `
                <div class="materials-section mb-4">
                    <h6 class="text-success"><i class="fas fa-book me-2"></i>Recommended Books</h6>
                    <div class="row">
            `;

            materials.books.forEach(book => {
                const amazonUrl = this.generateAmazonUrl(book.amazonId);
                
                html += `
                    <div class="col-md-6 mb-3">
                        <div class="card h-100">
                            <div class="row g-0 h-100">
                                <div class="col-4">
                                    <img src="${book.image}" class="img-fluid rounded-start h-100" 
                                         style="object-fit: cover;" alt="${book.title}">
                                </div>
                                <div class="col-8">
                                    <div class="card-body p-3">
                                        <h6 class="card-title">${book.title}</h6>
                                        <p class="card-text small text-muted">by ${book.author}</p>
                                        <p class="card-text small">${book.description}</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span class="fw-bold text-success">${book.price}</span>
                                                <div class="small">
                                                    ${'★'.repeat(Math.floor(book.rating))} ${book.rating} (${book.reviewCount})
                                                </div>
                                            </div>
                                            <a href="${amazonUrl}" target="_blank" class="btn btn-sm btn-warning">
                                                <i class="fab fa-amazon me-1"></i>Buy
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div></div>';
        }

        // Videos section
        if (materials.videos && materials.videos.length > 0) {
            html += `
                <div class="materials-section mb-4">
                    <h6 class="text-danger"><i class="fas fa-play me-2"></i>Video Lectures</h6>
                    <div class="row">
            `;

            materials.videos.forEach(video => {
                html += `
                    <div class="col-md-6 mb-3">
                        <div class="card border-left-danger h-100">
                            <div class="card-body p-3">
                                <h6 class="card-title">${video.title}</h6>
                                <p class="card-text small text-muted">by ${video.instructor}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="badge bg-light text-dark">${video.duration}</span>
                                    <a href="${video.url}" target="_blank" class="btn btn-sm btn-danger">
                                        <i class="fab fa-youtube me-1"></i>Watch
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div></div>';
        }

        html += '</div>';
        return html;
    }
}

// Global functions for note handling
function viewNote(title) {
    alert(`Viewing note: ${title}\nThis would open the note in a viewer modal.`);
}

function downloadNote(title) {
    alert(`Downloading: ${title}\nThis would trigger the note download.`);
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.StudyMaterials = StudyMaterials;
    window.studyMaterials = new StudyMaterials();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudyMaterials;
}