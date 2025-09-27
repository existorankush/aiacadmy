/**
 * Resource Management System
 * Comprehensive system for managing study resources with advanced filtering,
 * search, recommendations, and support for books, e-books, and notes
 */

class ResourceManager {
    constructor() {
        this.resources = [];
        this.filteredResources = [];
        this.currentFilters = {
            search: '',
            exams: [],
            subjects: [],
            resourceTypes: [],
            priceRange: { min: null, max: null },
            condition: [],
            rating: 0,
            freeOnly: false
        };
        this.currentSort = 'relevance';
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.viewMode = 'grid';
        this.userPreferences = this.loadUserPreferences();
        this.wishlist = this.loadWishlist();
        
        this.init();
    }

    init() {
        this.initializeResourceDatabase();
        this.setupEventListeners();
        this.loadInitialResources();
        this.loadPersonalRecommendations();
        
        // Hide spinner
        setTimeout(() => {
            const spinner = document.getElementById('spinner');
            if (spinner) {
                spinner.classList.remove('show');
            }
        }, 1000);
    }

    initializeResourceDatabase() {
        // Sample resource database - in a real application, this would come from an API
        this.resources = [
            {
                id: 1,
                title: "Concepts of Physics Vol 1",
                author: "H.C. Verma",
                subject: "physics",
                exams: ["jee", "boards"],
                type: "textbook",
                format: "book",
                condition: "new",
                price: 650,
                originalPrice: 750,
                rating: 4.8,
                reviewCount: 2450,
                description: "Comprehensive physics textbook covering mechanics, thermodynamics, and waves",
                isbn: "9788177091878",
                publisher: "Bharati Bhawan",
                pages: 462,
                image: "https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=HC+Verma+Vol+1",
                availability: "in_stock",
                seller: "BookHub",
                tags: ["mechanics", "thermodynamics", "waves", "jee-preparation"],
                downloadable: false,
                rentalAvailable: true,
                rentalPrice: 150
            },
            {
                id: 2,
                title: "Organic Chemistry - Morrison Boyd",
                author: "Robert Morrison, Robert Boyd",
                subject: "chemistry",
                exams: ["jee", "neet"],
                type: "reference",
                format: "book",
                condition: "like-new",
                price: 820,
                originalPrice: 950,
                rating: 4.7,
                reviewCount: 1850,
                description: "Classic organic chemistry textbook with comprehensive coverage of all topics",
                isbn: "9788131700160",
                publisher: "Dorling Kindersley",
                pages: 1283,
                image: "https://via.placeholder.com/300x400/2196F3/FFFFFF?text=Morrison+Boyd",
                availability: "in_stock",
                seller: "Academic Books",
                tags: ["organic-chemistry", "reactions", "mechanisms"],
                downloadable: false,
                rentalAvailable: true,
                rentalPrice: 200
            },
            {
                id: 3,
                title: "JEE Mathematics Notes - Complete Package",
                author: "AIcademy Team",
                subject: "mathematics",
                exams: ["jee"],
                type: "notes",
                format: "notes",
                condition: "new",
                price: 0,
                originalPrice: 0,
                rating: 4.6,
                reviewCount: 890,
                description: "Comprehensive mathematics notes covering algebra, calculus, and coordinate geometry",
                pages: 250,
                image: "https://via.placeholder.com/300x400/FF9800/FFFFFF?text=JEE+Math+Notes",
                availability: "digital",
                seller: "AIcademy",
                tags: ["algebra", "calculus", "coordinate-geometry", "free"],
                downloadable: true,
                rentalAvailable: false,
                isFree: true
            },
            {
                id: 4,
                title: "GATE Computer Science Complete Guide",
                author: "Made Easy Publications",
                subject: "computer_science",
                exams: ["gate"],
                type: "reference",
                format: "book",
                condition: "good",
                price: 450,
                originalPrice: 600,
                rating: 4.5,
                reviewCount: 1200,
                description: "Complete guide for GATE CS covering all topics with solved examples",
                isbn: "9788183556767",
                publisher: "Made Easy Publications",
                pages: 800,
                image: "https://via.placeholder.com/300x400/9C27B0/FFFFFF?text=GATE+CS",
                availability: "in_stock",
                seller: "TechBooks",
                tags: ["programming", "algorithms", "data-structures", "gate-preparation"],
                downloadable: false,
                rentalAvailable: true,
                rentalPrice: 120
            },
            {
                id: 5,
                title: "Physics Formulae & Concepts - Digital",
                author: "Physics Academy",
                subject: "physics",
                exams: ["jee", "boards", "neet"],
                type: "ebook",
                format: "ebook",
                condition: "new",
                price: 199,
                originalPrice: 299,
                rating: 4.4,
                reviewCount: 650,
                description: "Quick reference guide with all important physics formulae and concepts",
                pages: 120,
                image: "https://via.placeholder.com/300x400/3F51B5/FFFFFF?text=Physics+eBook",
                availability: "digital",
                seller: "Digital Academy",
                tags: ["formulae", "quick-reference", "concepts"],
                downloadable: true,
                rentalAvailable: false,
                fileSize: "15 MB",
                format_type: "PDF"
            },
            {
                id: 6,
                title: "RD Sharma Mathematics Class 12",
                author: "R.D. Sharma",
                subject: "mathematics",
                exams: ["boards", "jee"],
                type: "textbook",
                format: "book",
                condition: "used",
                price: 420,
                originalPrice: 650,
                rating: 4.6,
                reviewCount: 3200,
                description: "Complete mathematics textbook for class 12 with extensive problem sets",
                isbn: "9789350949446",
                publisher: "Dhanpat Rai Publications",
                pages: 1450,
                image: "https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=RD+Sharma+12",
                availability: "in_stock",
                seller: "StudyMart",
                tags: ["calculus", "algebra", "probability", "class-12"],
                downloadable: false,
                rentalAvailable: true,
                rentalPrice: 100
            },
            {
                id: 7,
                title: "NCERT Chemistry Class 11 & 12 Solutions",
                author: "Expert Team",
                subject: "chemistry",
                exams: ["boards", "neet", "jee"],
                type: "notes",
                format: "ebook",
                condition: "new",
                price: 0,
                originalPrice: 0,
                rating: 4.3,
                reviewCount: 1500,
                description: "Complete solutions to all NCERT chemistry problems with detailed explanations",
                pages: 400,
                image: "https://via.placeholder.com/300x400/F44336/FFFFFF?text=NCERT+Solutions",
                availability: "digital",
                seller: "EduFree",
                tags: ["ncert", "solutions", "chemistry", "free"],
                downloadable: true,
                rentalAvailable: false,
                isFree: true,
                fileSize: "25 MB",
                format_type: "PDF"
            },
            {
                id: 8,
                title: "Electronics and Communication Engineering Handbook",
                author: "Technical Publications",
                subject: "electrical",
                exams: ["gate"],
                type: "reference",
                format: "book",
                condition: "new",
                price: 850,
                originalPrice: 950,
                rating: 4.5,
                reviewCount: 420,
                description: "Comprehensive handbook covering all ECE topics for GATE preparation",
                isbn: "9788184314823",
                publisher: "Technical Publications",
                pages: 1200,
                image: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=ECE+Handbook",
                availability: "in_stock",
                seller: "Engineering Books",
                tags: ["electronics", "communication", "signals", "gate-ece"],
                downloadable: false,
                rentalAvailable: true,
                rentalPrice: 180
            },
            {
                id: 9,
                title: "Competitive Mathematics - Problem Solving Techniques",
                author: "Dr. A.K. Singh",
                subject: "mathematics",
                exams: ["jee", "olympiad"],
                type: "reference",
                format: "book",
                condition: "like-new",
                price: 520,
                originalPrice: 650,
                rating: 4.7,
                reviewCount: 890,
                description: "Advanced problem-solving techniques for competitive mathematics",
                isbn: "9789385750123",
                publisher: "Arihant Publications",
                pages: 650,
                image: "https://via.placeholder.com/300x400/607D8B/FFFFFF?text=Competitive+Math",
                availability: "in_stock",
                seller: "MathBooks Plus",
                tags: ["problem-solving", "olympiad", "advanced-math"],
                downloadable: false,
                rentalAvailable: true,
                rentalPrice: 130
            },
            {
                id: 10,
                title: "Biology Complete Notes - NEET Preparation",
                author: "Bio Academy",
                subject: "biology",
                exams: ["neet", "boards"],
                type: "notes",
                format: "notes",
                condition: "new",
                price: 350,
                originalPrice: 450,
                rating: 4.4,
                reviewCount: 1100,
                description: "Complete biology notes covering all NEET topics with diagrams and mnemonics",
                pages: 500,
                image: "https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Biology+Notes",
                availability: "in_stock",
                seller: "Bio Study Center",
                tags: ["biology", "neet", "botany", "zoology"],
                downloadable: false,
                rentalAvailable: false
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('resource-search').addEventListener('input', 
            this.debounce((e) => this.handleSearch(e.target.value), 300)
        );
        document.getElementById('search-btn').addEventListener('click', 
            () => this.handleSearch(document.getElementById('resource-search').value)
        );

        // Quick filters
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickFilter(e.target.dataset.filter));
        });

        // Filter checkboxes and inputs
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('form-check-input')) {
                this.updateFiltersFromUI();
            }
        });

        // Price range inputs
        document.getElementById('min-price').addEventListener('change', () => this.updateFiltersFromUI());
        document.getElementById('max-price').addEventListener('change', () => this.updateFiltersFromUI());
        document.getElementById('rating-filter').addEventListener('change', () => this.updateFiltersFromUI());

        // Filter action buttons
        document.getElementById('apply-filters').addEventListener('click', () => this.applyFilters());
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());

        // Sort and view options
        document.getElementById('sort-options').addEventListener('change', (e) => this.handleSort(e.target.value));
        document.getElementById('grid-view').addEventListener('click', () => this.setViewMode('grid'));
        document.getElementById('list-view').addEventListener('click', () => this.setViewMode('list'));

        // Resource interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('wishlist-btn')) {
                this.toggleWishlist(e.target.dataset.resourceId);
            }
            if (e.target.classList.contains('quick-view-btn')) {
                this.showQuickView(e.target.dataset.resourceId);
            }
            if (e.target.classList.contains('download-btn')) {
                this.handleDownload(e.target.dataset.resourceId);
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleSearch(query) {
        this.currentFilters.search = query.toLowerCase();
        this.applyFilters();
    }

    handleQuickFilter(filter) {
        // Update active button
        document.querySelectorAll('.quick-filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Reset filters and apply quick filter
        this.clearFilters();
        
        switch (filter) {
            case 'books':
                this.currentFilters.resourceTypes = ['textbook', 'reference'];
                break;
            case 'ebooks':
                this.currentFilters.resourceTypes = ['ebook'];
                break;
            case 'notes':
                this.currentFilters.resourceTypes = ['notes'];
                break;
            case 'new':
                this.currentFilters.condition = ['new'];
                break;
            case 'used':
                this.currentFilters.condition = ['used', 'like-new', 'good'];
                break;
            case 'rental':
                // Filter resources that have rental available
                break;
            case 'free':
                this.currentFilters.freeOnly = true;
                break;
            case 'all':
            default:
                // No specific filters
                break;
        }
        
        this.applyFilters();
    }

    updateFiltersFromUI() {
        // Exam filters
        this.currentFilters.exams = Array.from(document.querySelectorAll('input[id$="-filter"]:checked'))
            .map(input => input.value)
            .filter(value => ['jee', 'gate', 'boards', 'neet'].includes(value));

        // Subject filters
        this.currentFilters.subjects = Array.from(document.querySelectorAll('input[id*="subject"]:checked, input[id*="physics"]:checked, input[id*="chemistry"]:checked, input[id*="mathematics"]:checked, input[id*="biology"]:checked'))
            .map(input => input.value)
            .filter(value => ['physics', 'chemistry', 'mathematics', 'biology', 'computer_science', 'electrical'].includes(value));

        // Resource type filters
        this.currentFilters.resourceTypes = Array.from(document.querySelectorAll('input[id*="textbook"]:checked, input[id*="reference"]:checked, input[id*="ebook"]:checked, input[id*="notes"]:checked'))
            .map(input => input.value);

        // Price range
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;
        this.currentFilters.priceRange = {
            min: minPrice ? parseInt(minPrice) : null,
            max: maxPrice ? parseInt(maxPrice) : null
        };

        // Condition filters
        this.currentFilters.condition = Array.from(document.querySelectorAll('input[id*="condition"]:checked'))
            .map(input => input.value);

        // Rating filter
        this.currentFilters.rating = parseInt(document.getElementById('rating-filter').value) || 0;

        // Free only filter
        this.currentFilters.freeOnly = document.getElementById('free-filter').checked;
    }

    applyFilters() {
        this.updateFiltersFromUI();
        
        this.filteredResources = this.resources.filter(resource => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerms = this.currentFilters.search.split(' ');
                const searchableText = `${resource.title} ${resource.author} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase();
                if (!searchTerms.every(term => searchableText.includes(term))) {
                    return false;
                }
            }

            // Exam filter
            if (this.currentFilters.exams.length > 0) {
                if (!resource.exams.some(exam => this.currentFilters.exams.includes(exam))) {
                    return false;
                }
            }

            // Subject filter
            if (this.currentFilters.subjects.length > 0) {
                if (!this.currentFilters.subjects.includes(resource.subject)) {
                    return false;
                }
            }

            // Resource type filter
            if (this.currentFilters.resourceTypes.length > 0) {
                if (!this.currentFilters.resourceTypes.includes(resource.type)) {
                    return false;
                }
            }

            // Price range filter
            if (this.currentFilters.priceRange.min !== null && resource.price < this.currentFilters.priceRange.min) {
                return false;
            }
            if (this.currentFilters.priceRange.max !== null && resource.price > this.currentFilters.priceRange.max) {
                return false;
            }

            // Condition filter
            if (this.currentFilters.condition.length > 0) {
                if (!this.currentFilters.condition.includes(resource.condition)) {
                    return false;
                }
            }

            // Rating filter
            if (this.currentFilters.rating > 0 && resource.rating < this.currentFilters.rating) {
                return false;
            }

            // Free only filter
            if (this.currentFilters.freeOnly && resource.price > 0) {
                return false;
            }

            return true;
        });

        this.sortResources();
        this.updateResultsCount();
        this.renderResources();
        this.renderPagination();
    }

    sortResources() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredResources.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredResources.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredResources.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredResources.sort((a, b) => b.id - a.id);
                break;
            case 'popular':
                this.filteredResources.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            case 'relevance':
            default:
                // Relevance sorting based on search query and user preferences
                if (this.currentFilters.search) {
                    this.filteredResources.sort((a, b) => {
                        const aRelevance = this.calculateRelevance(a, this.currentFilters.search);
                        const bRelevance = this.calculateRelevance(b, this.currentFilters.search);
                        return bRelevance - aRelevance;
                    });
                }
                break;
        }
    }

    calculateRelevance(resource, searchQuery) {
        let score = 0;
        const query = searchQuery.toLowerCase();
        
        // Title match (highest weight)
        if (resource.title.toLowerCase().includes(query)) score += 10;
        
        // Author match
        if (resource.author.toLowerCase().includes(query)) score += 8;
        
        // Subject match
        if (resource.subject.toLowerCase().includes(query)) score += 6;
        
        // Tags match
        resource.tags.forEach(tag => {
            if (tag.toLowerCase().includes(query)) score += 4;
        });
        
        // Description match
        if (resource.description.toLowerCase().includes(query)) score += 2;
        
        // Boost popular items
        score += (resource.rating * resource.reviewCount) / 1000;
        
        return score;
    }

    handleSort(sortOption) {
        this.currentSort = sortOption;
        this.sortResources();
        this.renderResources();
    }

    setViewMode(mode) {
        this.viewMode = mode;
        
        // Update view buttons
        document.getElementById('grid-view').classList.toggle('active', mode === 'grid');
        document.getElementById('list-view').classList.toggle('active', mode === 'list');
        
        this.renderResources();
    }

    clearFilters() {
        // Reset filter object
        this.currentFilters = {
            search: '',
            exams: [],
            subjects: [],
            resourceTypes: [],
            priceRange: { min: null, max: null },
            condition: [],
            rating: 0,
            freeOnly: false
        };

        // Clear UI elements
        document.getElementById('resource-search').value = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        document.getElementById('rating-filter').value = '0';

        // Reset to all resources
        this.filteredResources = [...this.resources];
        this.renderResources();
        this.updateResultsCount();
    }

    updateResultsCount() {
        const total = this.filteredResources.length;
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, total);
        
        document.getElementById('results-count').textContent = 
            `Showing ${start}-${end} of ${total} results`;
    }

    renderResources() {
        const container = document.getElementById('resource-container');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageResources = this.filteredResources.slice(startIndex, endIndex);

        if (pageResources.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No resources found</h4>
                    <p class="text-muted">Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        if (this.viewMode === 'grid') {
            container.className = 'row';
            container.innerHTML = pageResources.map(resource => this.renderResourceCard(resource)).join('');
        } else {
            container.className = '';
            container.innerHTML = pageResources.map(resource => this.renderResourceListItem(resource)).join('');
        }
    }

    renderResourceCard(resource) {
        const isInWishlist = this.wishlist.includes(resource.id);
        const discountPercent = resource.originalPrice > resource.price ? 
            Math.round(((resource.originalPrice - resource.price) / resource.originalPrice) * 100) : 0;

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card resource-card h-100 ${resource.isRecommended ? 'border-primary' : ''}">
                    <div class="position-relative">
                        <img src="${resource.image}" class="card-img-top" alt="${resource.title}" style="height: 250px; object-fit: cover;">
                        
                        <!-- Wishlist Button -->
                        <button class="wishlist-btn ${isInWishlist ? 'text-danger' : ''}" data-resource-id="${resource.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                        
                        <!-- Recommendation Badge -->
                        ${resource.isRecommended ? `
                            <span class="badge bg-primary position-absolute" style="top: 10px; left: 10px; z-index: 5;">
                                <i class="fas fa-star me-1"></i>Recommended
                            </span>
                        ` : ''}
                        
                        <!-- Resource Type Badge -->
                        <span class="badge resource-type-badge ${this.getTypeBadgeClass(resource.format)}">
                            ${this.getTypeIcon(resource.format)} ${this.formatType(resource.format)}
                        </span>
                        
                        ${discountPercent > 0 ? `<span class="badge bg-danger position-absolute" style="top: 50px; right: 10px;">${discountPercent}% OFF</span>` : ''}
                        ${resource.isFree ? `<span class="badge bg-success position-absolute" style="top: ${resource.isRecommended ? '70px' : '10px'}; left: 50px;">FREE</span>` : ''}
                    </div>
                    
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title">${resource.title}</h6>
                        <p class="text-muted small mb-2">by ${resource.author}</p>
                        
                        <!-- Rating -->
                        <div class="mb-2">
                            ${this.renderStars(resource.rating)}
                            <small class="text-muted">(${resource.reviewCount})</small>
                        </div>
                        
                        <!-- Tags -->
                        <div class="mb-2">
                            ${resource.tags.slice(0, 3).map(tag => 
                                `<span class="badge bg-light text-dark me-1">${tag}</span>`
                            ).join('')}
                        </div>
                        
                        <!-- Price -->
                        <div class="mb-3">
                            ${resource.price === 0 ? 
                                '<span class="price-tag">FREE</span>' :
                                `<span class="price-tag">₹${resource.price}</span>
                                 ${resource.originalPrice > resource.price ? 
                                    `<small class="text-muted text-decoration-line-through ms-2">₹${resource.originalPrice}</small>` : ''}`
                            }
                            ${resource.rentalAvailable ? 
                                `<br><small class="text-info">Rent: ₹${resource.rentalPrice}/month</small>` : ''
                            }
                        </div>
                        
                        <!-- Condition -->
                        <span class="badge condition-badge ${this.getConditionBadgeClass(resource.condition)} mb-2">
                            ${this.formatCondition(resource.condition)}
                        </span>
                        
                        <p class="card-text small text-muted flex-grow-1">${resource.description.substring(0, 100)}...</p>
                        
                        <!-- Recommendation Reason -->
                        ${resource.isRecommended ? `
                            <div class="alert alert-primary py-2 px-3 mb-2" style="font-size: 0.8rem;">
                                <i class="fas fa-lightbulb me-1"></i>
                                <strong>Why recommended:</strong> ${resource.recommendationReason}
                            </div>
                        ` : ''}
                        
                        <!-- Actions -->
                        <div class="resource-actions mt-auto">
                            <div class="d-grid gap-2">
                                ${resource.downloadable ?
                                    `<button class="btn btn-success btn-sm download-btn" data-resource-id="${resource.id}">
                                        <i class="fas fa-download me-2"></i>Download
                                     </button>` :
                                    `<button class="btn btn-primary btn-sm">
                                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                     </button>`
                                }
                                <button class="btn btn-outline-primary btn-sm quick-view-btn" data-resource-id="${resource.id}">
                                    <i class="fas fa-eye me-2"></i>Quick View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderResourceListItem(resource) {
        const isInWishlist = this.wishlist.includes(resource.id);
        const discountPercent = resource.originalPrice > resource.price ? 
            Math.round(((resource.originalPrice - resource.price) / resource.originalPrice) * 100) : 0;

        return `
            <div class="card resource-card mb-3">
                <div class="row g-0">
                    <div class="col-md-3">
                        <div class="position-relative">
                            <img src="${resource.image}" class="img-fluid h-100 w-100" alt="${resource.title}" style="object-fit: cover;">
                            <button class="wishlist-btn ${isInWishlist ? 'text-danger' : ''}" data-resource-id="${resource.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h5 class="card-title">${resource.title}</h5>
                                    <p class="text-muted mb-2">by ${resource.author}</p>
                                    
                                    <div class="mb-2">
                                        ${this.renderStars(resource.rating)}
                                        <small class="text-muted">(${resource.reviewCount})</small>
                                    </div>
                                    
                                    <p class="card-text">${resource.description}</p>
                                    
                                    <div class="mb-2">
                                        ${resource.tags.slice(0, 5).map(tag => 
                                            `<span class="badge bg-light text-dark me-1">${tag}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                                
                                <div class="col-md-4 text-end">
                                    <div class="mb-3">
                                        ${resource.price === 0 ? 
                                            '<span class="price-tag">FREE</span>' :
                                            `<div class="price-tag">₹${resource.price}</div>
                                             ${resource.originalPrice > resource.price ? 
                                                `<small class="text-muted text-decoration-line-through">₹${resource.originalPrice}</small>` : ''}`
                                        }
                                    </div>
                                    
                                    <span class="badge condition-badge ${this.getConditionBadgeClass(resource.condition)} mb-3">
                                        ${this.formatCondition(resource.condition)}
                                    </span>
                                    
                                    <div class="d-grid gap-2">
                                        ${resource.downloadable ?
                                            `<button class="btn btn-success btn-sm download-btn" data-resource-id="${resource.id}">
                                                <i class="fas fa-download me-2"></i>Download
                                             </button>` :
                                            `<button class="btn btn-primary btn-sm">
                                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                             </button>`
                                        }
                                        <button class="btn btn-outline-primary btn-sm quick-view-btn" data-resource-id="${resource.id}">
                                            <i class="fas fa-eye me-2"></i>Quick View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star rating-stars"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt rating-stars"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star rating-stars"></i>';
        }
        
        return `<span class="me-1">${stars}</span><span class="small">${rating}</span>`;
    }

    getTypeBadgeClass(format) {
        const classes = {
            'book': 'bg-success',
            'ebook': 'bg-info',
            'notes': 'bg-warning'
        };
        return classes[format] || 'bg-secondary';
    }

    getTypeIcon(format) {
        const icons = {
            'book': '📚',
            'ebook': '💻',
            'notes': '📝'
        };
        return icons[format] || '📄';
    }

    formatType(format) {
        const types = {
            'book': 'Book',
            'ebook': 'E-Book',
            'notes': 'Notes'
        };
        return types[format] || format;
    }

    getConditionBadgeClass(condition) {
        const classes = {
            'new': 'bg-success',
            'like-new': 'bg-info',
            'good': 'bg-warning',
            'fair': 'bg-secondary'
        };
        return classes[condition] || 'bg-secondary';
    }

    formatCondition(condition) {
        const conditions = {
            'new': 'New',
            'like-new': 'Like New',
            'good': 'Good',
            'fair': 'Fair'
        };
        return conditions[condition] || condition;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredResources.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="resourceManager.goToPage(${this.currentPage - 1})">Previous</a>
            </li>
        `;
        
        // Page numbers
        for (let i = 1; i <= Math.min(totalPages, 10); i++) {
            paginationHTML += `
                <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="resourceManager.goToPage(${i})">${i}</a>
                </li>
            `;
        }
        
        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="resourceManager.goToPage(${this.currentPage + 1})">Next</a>
            </li>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredResources.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderResources();
            this.renderPagination();
            this.updateResultsCount();
            
            // Scroll to top
            document.getElementById('resource-container').scrollIntoView({ behavior: 'smooth' });
        }
    }

    loadInitialResources() {
        this.filteredResources = [...this.resources];
        this.renderResources();
        this.updateResultsCount();
        this.renderPagination();
        this.updateResourceStats();
    }

    updateResourceStats() {
        const stats = {
            total: this.resources.length,
            books: this.resources.filter(r => r.format === 'book').length,
            ebooks: this.resources.filter(r => r.format === 'ebook').length,
            notes: this.resources.filter(r => r.format === 'notes').length
        };

        document.getElementById('total-resources').textContent = `${stats.total}+`;
        document.getElementById('books-count').textContent = stats.books;
        document.getElementById('ebooks-count').textContent = stats.ebooks;
        document.getElementById('notes-count').textContent = stats.notes;
    }

    loadPersonalRecommendations() {
        // Load recommendations using the integrated book recommendation engine
        if (window.bookRecommendationEngine) {
            const quizHistory = this.loadQuizHistory();
            const container = document.getElementById('personal-recommendations');
            
            if (quizHistory.length === 0) {
                container.innerHTML = `
                    <p class="small mb-0">Take some quizzes to get personalized book recommendations!</p>
                    <button class="btn btn-sm btn-light mt-2" onclick="window.location.href='competitive-quiz.html'">
                        <i class="fas fa-play me-1"></i>Start Quiz
                    </button>
                `;
                return;
            }

            // Use the book recommendation engine
            const userProfile = window.bookRecommendationEngine.createUserProfile(quizHistory);
            const weakAreas = window.bookRecommendationEngine.weaknessAnalyzer.analyze(quizHistory);
            const recommendations = window.bookRecommendationEngine.generateRecommendations(
                userProfile, quizHistory, weakAreas
            );

            if (recommendations.length === 0) {
                container.innerHTML = `
                    <p class="small mb-0">No specific recommendations yet. Take more quizzes for better suggestions!</p>
                `;
                return;
            }

            container.innerHTML = `
                <div class="mb-3">
                    <small class="text-muted">Based on ${quizHistory.length} quiz(es) in ${userProfile.currentSubject}</small>
                </div>
                ${recommendations.slice(0, 3).map(rec => `
                    <div class="recommendation-item mb-3 p-2 border rounded" style="cursor: pointer;" onclick="resourceManager.showRecommendationDetails('${rec.id}')">
                        <div class="d-flex align-items-center">
                            <img src="${rec.image}" alt="${rec.title}" class="me-2" style="width: 50px; height: 60px; object-fit: cover; border-radius: 5px;">
                            <div class="flex-grow-1">
                                <div class="small fw-bold">${rec.title}</div>
                                <div class="text-xs text-muted">${rec.author}</div>
                                <div class="mt-1">
                                    <span class="badge ${rec.urgency === 'high' ? 'bg-danger' : rec.urgency === 'medium' ? 'bg-warning' : 'bg-info'} text-white" style="font-size: 0.7rem;">
                                        ${rec.urgency.toUpperCase()}
                                    </span>
                                </div>
                                <div class="text-xs mt-1" style="font-size: 0.7rem;">
                                    ${rec.recommendationReason}
                                </div>
                            </div>
                            <div class="text-end">
                                <div class="small fw-bold text-primary">₹${rec.price}</div>
                                ${rec.rentalPrice ? `<div class="text-xs text-muted">Rent: ₹${rec.rentalPrice}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
                <button class="btn btn-sm btn-primary w-100 mt-2" onclick="resourceManager.showAllRecommendations()">
                    <i class="fas fa-eye me-1"></i>View All Recommendations
                </button>
            `;
        } else {
            // Fallback to original implementation
            const quizHistory = this.loadQuizHistory();
            const recommendations = this.generateRecommendations(quizHistory);
            
            const container = document.getElementById('personal-recommendations');
            if (recommendations.length === 0) {
                container.innerHTML = `
                    <p class="small mb-0">Take some quizzes to get personalized book recommendations!</p>
                `;
                return;
            }

            container.innerHTML = recommendations.slice(0, 3).map(resource => `
                <div class="recommendation-item mb-2">
                    <div class="d-flex align-items-center">
                        <img src="${resource.image}" alt="${resource.title}" class="me-2" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">
                        <div class="flex-grow-1">
                            <div class="small fw-bold">${resource.title}</div>
                            <div class="text-xs">${resource.author}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    generateRecommendations(quizHistory) {
        // Simple recommendation algorithm based on quiz subjects and performance
        const subjectFrequency = {};
        const weakSubjects = [];

        quizHistory.forEach(quiz => {
            subjectFrequency[quiz.subject] = (subjectFrequency[quiz.subject] || 0) + 1;
            if (quiz.percentage < 70) {
                weakSubjects.push(quiz.subject);
            }
        });

        // Recommend resources for weak subjects first, then frequently attempted subjects
        const recommendationSubjects = [...new Set([...weakSubjects, ...Object.keys(subjectFrequency)])];
        
        return this.resources.filter(resource => 
            recommendationSubjects.includes(resource.subject) && resource.rating > 4.0
        ).sort((a, b) => b.rating - a.rating);
    }

    loadQuizHistory() {
        try {
            return JSON.parse(localStorage.getItem('competitiveQuizHistory')) || [];
        } catch {
            return [];
        }
    }

    toggleWishlist(resourceId) {
        const id = parseInt(resourceId);
        const index = this.wishlist.indexOf(id);
        
        if (index > -1) {
            this.wishlist.splice(index, 1);
        } else {
            this.wishlist.push(id);
        }
        
        this.saveWishlist();
        this.renderResources(); // Re-render to update wishlist buttons
    }

    showQuickView(resourceId) {
        const resource = this.resources.find(r => r.id === parseInt(resourceId));
        if (!resource) return;

        // Create modal content (this would typically use Bootstrap modal)
        const modalContent = `
            <div class="modal fade" id="quickViewModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${resource.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${resource.image}" class="img-fluid" alt="${resource.title}">
                                </div>
                                <div class="col-md-8">
                                    <h6>by ${resource.author}</h6>
                                    <div class="mb-3">
                                        ${this.renderStars(resource.rating)}
                                        <small class="text-muted">(${resource.reviewCount} reviews)</small>
                                    </div>
                                    <p>${resource.description}</p>
                                    <p><strong>Subject:</strong> ${resource.subject}</p>
                                    <p><strong>Exams:</strong> ${resource.exams.join(', ').toUpperCase()}</p>
                                    <p><strong>Pages:</strong> ${resource.pages}</p>
                                    ${resource.isbn ? `<p><strong>ISBN:</strong> ${resource.isbn}</p>` : ''}
                                    <div class="mb-3">
                                        ${resource.tags.map(tag => 
                                            `<span class="badge bg-light text-dark me-1">${tag}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            ${resource.downloadable ?
                                `<button class="btn btn-success download-btn" data-resource-id="${resource.id}">
                                    <i class="fas fa-download me-2"></i>Download
                                 </button>` :
                                `<button class="btn btn-primary">
                                    <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                 </button>`
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal and add new one
        const existingModal = document.getElementById('quickViewModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // Show modal (requires Bootstrap JS)
        const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
        modal.show();
    }

    handleDownload(resourceId) {
        const resource = this.resources.find(r => r.id === parseInt(resourceId));
        if (!resource || !resource.downloadable) return;

        // Simulate download process
        alert(`Downloading ${resource.title}...\nFile Size: ${resource.fileSize || 'Unknown'}\nFormat: ${resource.format_type || 'PDF'}`);
        
        // In a real application, this would trigger an actual download
        console.log('Download initiated for:', resource.title);
    }

    loadUserPreferences() {
        try {
            return JSON.parse(localStorage.getItem('resourcePreferences')) || {
                preferredSubjects: [],
                preferredExams: [],
                priceRange: { max: 1000 }
            };
        } catch {
            return {
                preferredSubjects: [],
                preferredExams: [],
                priceRange: { max: 1000 }
            };
        }
    }

    saveUserPreferences() {
        localStorage.setItem('resourcePreferences', JSON.stringify(this.userPreferences));
    }

    loadWishlist() {
        try {
            return JSON.parse(localStorage.getItem('resourceWishlist')) || [];
        } catch {
            return [];
        }
    }

    saveWishlist() {
        localStorage.setItem('resourceWishlist', JSON.stringify(this.wishlist));
    }

    // New methods for enhanced book recommendation integration
    showRecommendationDetails(bookId) {
        const recommendation = window.bookRecommendationEngine ? 
            window.bookRecommendationEngine.bookDatabase.jee?.physics?.find(book => book.id === bookId) ||
            window.bookRecommendationEngine.bookDatabase.jee?.chemistry?.find(book => book.id === bookId) ||
            window.bookRecommendationEngine.bookDatabase.jee?.mathematics?.find(book => book.id === bookId) ||
            window.bookRecommendationEngine.bookDatabase.gate?.computer_science?.find(book => book.id === bookId) ||
            window.bookRecommendationEngine.bookDatabase.boards?.physics?.find(book => book.id === bookId)
            : null;

        if (!recommendation) return;

        const modalContent = `
            <div class="modal fade" id="recommendationModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="fas fa-star me-2"></i>Recommended Book: ${recommendation.title}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${recommendation.image}" class="img-fluid rounded" alt="${recommendation.title}">
                                </div>
                                <div class="col-md-8">
                                    <h6 class="fw-bold">by ${recommendation.author}</h6>
                                    <div class="mb-3">
                                        ${this.renderStars(recommendation.rating)}
                                    </div>
                                    
                                    <div class="mb-3">
                                        <span class="badge ${recommendation.urgency === 'high' ? 'bg-danger' : recommendation.urgency === 'medium' ? 'bg-warning' : 'bg-info'}">
                                            ${recommendation.urgency.toUpperCase()} Priority
                                        </span>
                                        <span class="badge bg-secondary ms-2">
                                            ${recommendation.difficulty.toUpperCase()} Level
                                        </span>
                                    </div>
                                    
                                    <p><strong>Why recommended:</strong> ${recommendation.recommendationReason}</p>
                                    <p><strong>Description:</strong> ${recommendation.description}</p>
                                    
                                    <div class="row mb-3">
                                        <div class="col-sm-6">
                                            <strong>Topics Covered:</strong>
                                            <ul class="list-unstyled mt-1">
                                                ${recommendation.topics.map(topic => `<li>• ${this.formatTopicName(topic)}</li>`).join('')}
                                            </ul>
                                        </div>
                                        <div class="col-sm-6">
                                            <strong>Strengths:</strong>
                                            <ul class="list-unstyled mt-1">
                                                ${recommendation.strengths.map(strength => `<li>• ${this.formatTopicName(strength)}</li>`).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div class="price-section">
                                        <div class="h4 text-primary">₹${recommendation.price}</div>
                                        ${recommendation.rentalPrice ? `<div class="text-muted">Rental: ₹${recommendation.rentalPrice}/month</div>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-outline-primary" onclick="resourceManager.addToWishlist('${bookId}')">
                                <i class="fas fa-heart me-2"></i>Add to Wishlist
                            </button>
                            <button type="button" class="btn btn-primary">
                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal and add new one
        const existingModal = document.getElementById('recommendationModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('recommendationModal'));
        modal.show();
    }

    showAllRecommendations() {
        if (!window.bookRecommendationEngine) return;

        const quizHistory = this.loadQuizHistory();
        if (quizHistory.length === 0) {
            alert('Please take some quizzes first to get personalized recommendations!');
            return;
        }

        const userProfile = window.bookRecommendationEngine.createUserProfile(quizHistory);
        const weakAreas = window.bookRecommendationEngine.weaknessAnalyzer.analyze(quizHistory);
        const recommendations = window.bookRecommendationEngine.generateRecommendations(
            userProfile, quizHistory, weakAreas
        );

        const modalContent = `
            <div class="modal fade" id="allRecommendationsModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                            <h5 class="modal-title">
                                <i class="fas fa-magic me-2"></i>Your Personalized Study Plan
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card border-0 bg-light">
                                        <div class="card-body text-center">
                                            <h6><i class="fas fa-chart-line text-primary me-2"></i>Your Performance</h6>
                                            <div class="h4 text-primary">${Math.round(userProfile.averageScore)}%</div>
                                            <small class="text-muted">Average Score (${userProfile.totalQuizzes} quizzes)</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card border-0 bg-light">
                                        <div class="card-body text-center">
                                            <h6><i class="fas fa-bullseye text-warning me-2"></i>Focus Areas</h6>
                                            <div class="h4 text-warning">${weakAreas.length}</div>
                                            <small class="text-muted">Topics need improvement</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <h6 class="mb-3"><i class="fas fa-star text-warning me-2"></i>Recommended Books for You</h6>
                            
                            <div class="row">
                                ${recommendations.slice(0, 6).map(rec => `
                                    <div class="col-md-6 col-lg-4 mb-3">
                                        <div class="card h-100 border-${rec.urgency === 'high' ? 'danger' : rec.urgency === 'medium' ? 'warning' : 'info'}">
                                            <div class="card-body">
                                                <div class="d-flex align-items-start">
                                                    <img src="${rec.image}" alt="${rec.title}" style="width: 60px; height: 80px; object-fit: cover;" class="rounded me-3">
                                                    <div class="flex-grow-1">
                                                        <h6 class="card-title" style="font-size: 0.9rem;">${rec.title}</h6>
                                                        <p class="card-text text-muted small">${rec.author}</p>
                                                        <div class="mb-2">
                                                            <span class="badge ${rec.urgency === 'high' ? 'bg-danger' : rec.urgency === 'medium' ? 'bg-warning' : 'bg-info'} text-white" style="font-size: 0.7rem;">
                                                                ${rec.urgency.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <p class="small mb-2">${rec.recommendationReason}</p>
                                                        <div class="d-flex justify-content-between align-items-end">
                                                            <div>
                                                                <div class="fw-bold text-primary">₹${rec.price}</div>
                                                                ${rec.rentalPrice ? `<div class="small text-muted">Rent: ₹${rec.rentalPrice}</div>` : ''}
                                                            </div>
                                                            <button class="btn btn-sm btn-outline-primary" onclick="resourceManager.showRecommendationDetails('${rec.id}')">
                                                                <i class="fas fa-eye"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            ${weakAreas.length > 0 ? `
                                <div class="mt-4">
                                    <h6><i class="fas fa-exclamation-triangle text-warning me-2"></i>Areas to Focus On</h6>
                                    <div class="row">
                                        ${weakAreas.slice(0, 4).map(area => `
                                            <div class="col-md-6 col-lg-3 mb-2">
                                                <div class="card border-warning">
                                                    <div class="card-body text-center py-2">
                                                        <h6 class="card-title" style="font-size: 0.9rem;">${this.formatTopicName(area.topic)}</h6>
                                                        <div class="h5 text-warning">${Math.round(area.percentage)}%</div>
                                                        <small class="text-muted">${area.questionsAttempted} questions</small>
                                                    </div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="window.location.href='competitive-quiz.html'">
                                <i class="fas fa-play me-2"></i>Take More Quizzes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal and add new one
        const existingModal = document.getElementById('allRecommendationsModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('allRecommendationsModal'));
        modal.show();
    }

    formatTopicName(topic) {
        return topic.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    addToWishlist(resourceId) {
        // Find resource in recommendations database
        if (window.bookRecommendationEngine) {
            const allBooks = [
                ...(window.bookRecommendationEngine.bookDatabase.jee?.physics || []),
                ...(window.bookRecommendationEngine.bookDatabase.jee?.chemistry || []),
                ...(window.bookRecommendationEngine.bookDatabase.jee?.mathematics || []),
                ...(window.bookRecommendationEngine.bookDatabase.gate?.computer_science || []),
                ...(window.bookRecommendationEngine.bookDatabase.boards?.physics || [])
            ];
            
            const book = allBooks.find(b => b.id === resourceId);
            if (book) {
                // Convert to resource format and add to resources if not already there
                const existingResource = this.resources.find(r => r.title === book.title);
                if (!existingResource) {
                    const newResource = {
                        id: this.resources.length + 1,
                        title: book.title,
                        author: book.author,
                        subject: book.topics[0] || 'general',
                        exams: ['jee'], // Default, should be determined based on book database location
                        type: 'textbook',
                        format: 'book',
                        condition: 'new',
                        price: book.price,
                        originalPrice: book.price,
                        rating: book.rating,
                        reviewCount: Math.floor(book.rating * 1000),
                        description: book.description,
                        image: book.image,
                        availability: 'in_stock',
                        seller: 'BookHub',
                        tags: book.topics,
                        downloadable: false,
                        rentalAvailable: !!book.rentalPrice,
                        rentalPrice: book.rentalPrice || 0
                    };
                    this.resources.push(newResource);
                    this.toggleWishlist(newResource.id);
                } else {
                    this.toggleWishlist(existingResource.id);
                }
                
                alert(`${book.title} has been added to your wishlist!`);
            }
        }
    }

    // Enhanced initialization with book recommendation integration
    init() {
        this.initializeResourceDatabase();
        this.setupEventListeners();
        this.loadInitialResources();
        
        // Wait for book recommendation engine to load, then integrate
        setTimeout(() => {
            if (window.bookRecommendationEngine) {
                window.bookRecommendationEngine.integrateWithResourceSystem(this);
            }
            this.loadPersonalRecommendations();
        }, 500);
        
        // Hide spinner
        setTimeout(() => {
            const spinner = document.getElementById('spinner');
            if (spinner) {
                spinner.classList.remove('show');
            }
        }, 1000);
    }
}

// Initialize the resource manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.resourceManager = new ResourceManager();
});

// Global function for pagination (called from onclick handlers)
window.resourceManager = null;