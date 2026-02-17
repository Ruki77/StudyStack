// ========================================
// Authentication & Upload State
// ========================================
let currentUser = null;
let uploadedResources = [];

// Load auth state from localStorage
function loadAuthState() {
    const authData = localStorage.getItem('authUser');
    if (authData) {
        currentUser = JSON.parse(authData);
    }
}

// Load uploaded resources from localStorage
function loadUploadedResources() {
    const uploaded = localStorage.getItem('uploadedResources');
    if (uploaded) {
        uploadedResources = JSON.parse(uploaded);
    }
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Check if current user is admin
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('authUser');
    window.location.reload();
}

// Initialize auth state
loadAuthState();
loadUploadedResources();

// ========================================
// Data: Sample Study Resources
// ========================================
const resources = [
    {
        id: 1,
        title: "Introduction to Algorithms",
        subject: "DSA",
        type: "Video",
        rating: 4.8,
        description: "Comprehensive video series covering fundamental algorithms and data structures with practical examples."
    },
    {
        id: 2,
        title: "Machine Learning Basics",
        subject: "AI",
        type: "PDF",
        rating: 4.6,
        description: "Complete guide to machine learning fundamentals, including supervised and unsupervised learning techniques."
    },
    {
        id: 3,
        title: "Operating Systems Concepts",
        subject: "Operating Systems",
        type: "Notes",
        rating: 4.7,
        description: "Detailed notes on OS concepts including process management, memory management, and file systems."
    },
    {
        id: 4,
        title: "React.js Complete Course",
        subject: "Web Dev",
        type: "Video",
        rating: 4.9,
        description: "Master React.js from basics to advanced concepts including hooks, context API, and performance optimization."
    },
    {
        id: 5,
        title: "Binary Trees Practice Problems",
        subject: "DSA",
        type: "Practice",
        rating: 4.5,
        description: "Collection of 50+ binary tree problems with solutions ranging from easy to hard difficulty levels."
    },
    {
        id: 6,
        title: "Computer Networks Fundamentals",
        subject: "CS",
        type: "PDF",
        rating: 4.4,
        description: "Essential networking concepts covering TCP/IP, OSI model, routing protocols, and network security."
    },
    {
        id: 7,
        title: "Deep Learning with Neural Networks",
        subject: "AI",
        type: "Video",
        rating: 4.8,
        description: "Advanced deep learning course covering CNNs, RNNs, and transformer architectures with TensorFlow."
    },
    {
        id: 8,
        title: "CSS Grid and Flexbox Mastery",
        subject: "Web Dev",
        type: "Practice",
        rating: 4.6,
        description: "Interactive exercises to master modern CSS layout techniques for responsive web design."
    },
    {
        id: 9,
        title: "Database Management Systems",
        subject: "CS",
        type: "Notes",
        rating: 4.5,
        description: "Comprehensive notes on DBMS covering SQL, normalization, transactions, and database design principles."
    },
    {
        id: 10,
        title: "Linux Command Line Cheat Sheet",
        subject: "Operating Systems",
        type: "PDF",
        rating: 4.3,
        description: "Quick reference guide for essential Linux commands, shell scripting, and system administration tasks."
    },
    {
        id: 11,
        title: "Dynamic Programming Patterns",
        subject: "DSA",
        type: "Notes",
        rating: 4.9,
        description: "Master dynamic programming with common patterns, optimization techniques, and real-world applications."
    },
    {
        id: 12,
        title: "JavaScript ES6+ Features",
        subject: "Web Dev",
        type: "Video",
        rating: 4.7,
        description: "Modern JavaScript features including arrow functions, destructuring, async/await, and modules."
    },
    {
        id: 13,
        title: "Natural Language Processing",
        subject: "AI",
        type: "Practice",
        rating: 4.4,
        description: "Hands-on NLP projects including sentiment analysis, text classification, and language models."
    },
    {
        id: 14,
        title: "System Design Interview Prep",
        subject: "CS",
        type: "Video",
        rating: 4.8,
        description: "Learn to design scalable systems covering load balancing, caching, databases, and microservices."
    },
    {
        id: 15,
        title: "Process Synchronization",
        subject: "Operating Systems",
        type: "Practice",
        rating: 4.2,
        description: "Practice problems on semaphores, monitors, deadlock prevention, and concurrent programming."
    }
];

// ========================================
// State Management
// ========================================
let bookmarks = [];
let lastSearch = '';

// Load bookmarks from localStorage
const savedBookmarks = localStorage.getItem('bookmarks');
if (savedBookmarks) {
    bookmarks = JSON.parse(savedBookmarks);
}

// Load last search from localStorage
const savedSearch = localStorage.getItem('lastSearch');
if (savedSearch) {
    lastSearch = savedSearch;
}

// Get all resources (default + uploaded)
function getAllResources() {
    return [...resources, ...uploadedResources];
}

// ========================================
// DOM Elements
// ========================================
const searchInput = document.getElementById('searchInput');
const subjectFilter = document.getElementById('subjectFilter');
const typeFilter = document.getElementById('typeFilter');
const sortFilter = document.getElementById('sortFilter');
const resourcesGrid = document.getElementById('resourcesGrid');
const bookmarksGrid = document.getElementById('bookmarksGrid');
const recommendedGrid = document.getElementById('recommendedGrid');
const emptyState = document.getElementById('emptyState');
let bookmarksSection = document.getElementById('bookmarks');

// ========================================
// Core Functions
// ========================================

/**
 * Render resources to a specific grid
 * @param {Array} data - Array of resource objects
 * @param {HTMLElement} container - Target container element
 */
function renderResources(data, container) {
    container.innerHTML = '';

    if (data.length === 0) {
        if (container === resourcesGrid) {
            emptyState.style.display = 'block';
        }
        return;
    }

    if (container === resourcesGrid) {
        emptyState.style.display = 'none';
    }

    data.forEach(resource => {
        const card = createResourceCard(resource);
        container.appendChild(card);
    });
}

/**
 * Create a resource card element
 * @param {Object} resource - Resource object
 * @returns {HTMLElement} Card element
 */
function createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = 'resource-card';

    const isBookmarked = bookmarks.includes(resource.id);
    const isUploaded = uploadedResources.some(r => r.id === resource.id);

    card.innerHTML = `
        ${isAdmin() ? `<button class="delete-btn" onclick="deleteResource(${resource.id})">🗑️ Delete</button>` : ''}
        <div class="card-header">
            <h3 class="card-title">${resource.title}</h3>
            <button 
                class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                onclick="toggleBookmark(${resource.id})"
                aria-label="Bookmark this resource"
            >
                ${isBookmarked ? '🔖' : '📌'}
            </button>
        </div>
        <div class="card-body">
            <div class="card-meta">
                <span class="card-badge badge-subject">${resource.subject}</span>
                <span class="card-badge badge-type">${resource.type}</span>
                ${isUploaded ? '<span class="card-badge" style="background: #10b981;">📤 Uploaded</span>' : ''}
            </div>
            <p class="card-description">${resource.description}</p>
            <div class="card-footer">
                <div class="card-rating">
                    <span class="rating-stars">⭐</span>
                    <span class="rating-value">${resource.rating}</span>
                </div>
                <a href="#" class="card-link">View Resource →</a>
            </div>
        </div>
    `;

    return card;
}

/**
 * Filter and sort resources based on current filter values
 * @returns {Array} Filtered and sorted resources
 */
function filterResources() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const subject = subjectFilter.value;
    const type = typeFilter.value;
    const sort = sortFilter.value;

    // Save search term to localStorage
    if (searchTerm) {
        localStorage.setItem('lastSearch', searchTerm);
        lastSearch = searchTerm;
    }

    let filtered = getAllResources().filter(resource => {
        // Search filter (title and description)
        const matchesSearch = searchTerm === '' ||
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm);

        // Subject filter
        const matchesSubject = subject === 'all' || resource.subject === subject;

        // Type filter
        const matchesType = type === 'all' || resource.type === type;

        return matchesSearch && matchesSubject && matchesType;
    });

    // Sort
    if (sort === 'high-to-low') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'low-to-high') {
        filtered.sort((a, b) => a.rating - b.rating);
    }

    return filtered;
}

/**
 * Toggle bookmark status for a resource
 * @param {number} id - Resource ID
 */
function toggleBookmark(id) {
    const index = bookmarks.indexOf(id);

    if (index > -1) {
        // Remove bookmark
        bookmarks.splice(index, 1);
    } else {
        // Add bookmark
        bookmarks.push(id);
    }

    // Save to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Re-render all sections
    updateAllSections();
}

/**
 * Delete a resource (Admin only)
 * @param {number} id - Resource ID
 */
function deleteResource(id) {
    if (!isAdmin()) {
        alert('❌ Only admins can delete resources!');
        return;
    }

    if (!confirm('Are you sure you want to delete this resource?')) {
        return;
    }

    // Remove from uploaded resources if it's there
    const uploadedIndex = uploadedResources.findIndex(r => r.id === id);
    if (uploadedIndex > -1) {
        uploadedResources.splice(uploadedIndex, 1);
        localStorage.setItem('uploadedResources', JSON.stringify(uploadedResources));
    }

    // Remove from bookmarks if bookmarked
    const bookmarkIndex = bookmarks.indexOf(id);
    if (bookmarkIndex > -1) {
        bookmarks.splice(bookmarkIndex, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    // Re-render
    updateAllSections();
    updateAdminPanel();
}

/**
 * Handle upload form submission
 */
function handleUpload(e) {
    e.preventDefault();

    if (!isLoggedIn()) {
        alert('❌ Please login to upload resources!');
        window.location.href = 'login.html';
        return;
    }

    // Get form values
    const title = document.getElementById('uploadTitle').value;
    const subject = document.getElementById('uploadSubject').value;
    const type = document.getElementById('uploadType').value;
    const rating = parseFloat(document.getElementById('uploadRating').value);
    const description = document.getElementById('uploadDescription').value;
    const file = document.getElementById('uploadFile').files[0];

    // Create new resource
    const newResource = {
        id: Date.now(), // Simple ID generation
        title: title,
        subject: subject,
        type: type,
        rating: rating,
        description: description,
        uploadedBy: currentUser.username,
        uploadDate: new Date().toISOString().split('T')[0]
    };

    // Add to uploaded resources
    uploadedResources.push(newResource);
    localStorage.setItem('uploadedResources', JSON.stringify(uploadedResources));

    // Close modal and reset form
    closeUploadModal();
    document.getElementById('uploadForm').reset();

    // Show success message
    alert('✅ Resource uploaded successfully!');

    // Re-render
    updateAllSections();
    updateAdminPanel();
}

/**
 * Open upload modal
 */
function openUploadModal() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('uploadModal').classList.add('active');
}

/**
 * Close upload modal
 */
function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
}

/**
 * Update admin panel statistics
 */
function updateAdminPanel() {
    if (!isAdmin()) return;

    document.getElementById('totalResourcesCount').textContent = getAllResources().length;
    document.getElementById('uploadedResourcesCount').textContent = uploadedResources.length;
    document.getElementById('totalBookmarksCount').textContent = bookmarks.length;
}

/**
 * Update UI based on auth state
 */
function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const adminPanel = document.getElementById('adminPanel');

    if (isLoggedIn()) {
        // Update auth button to show logout
        authBtn.textContent = `👤 ${currentUser.username} (Logout)`;
        authBtn.onclick = logout;

        // Show upload button for logged-in users
        if (uploadBtn) {
            uploadBtn.style.display = 'block';
        }

        // Show admin panel for admin users
        if (isAdmin() && adminPanel) {
            adminPanel.style.display = 'block';
            updateAdminPanel();
        }
    } else {
        // Show login button
        authBtn.textContent = '🔐 Login';
        authBtn.onclick = () => window.location.href = 'login.html';

        // Hide upload button
        if (uploadBtn) {
            uploadBtn.style.display = 'none';
        }

        // Hide admin panel
        if (adminPanel) {
            adminPanel.style.display = 'none';
        }
    }
}

/**
 * Get recommended resources based on last search or highest rated
 * @returns {Array} Top 3 recommended resources
 */
function getRecommendations() {
    let recommended = [];

    if (lastSearch) {
        // Filter by last search keyword
        recommended = getAllResources().filter(resource =>
            resource.title.toLowerCase().includes(lastSearch.toLowerCase()) ||
            resource.description.toLowerCase().includes(lastSearch.toLowerCase())
        );
    }

    // If no search or no matches, show highest rated
    if (recommended.length === 0) {
        recommended = [...getAllResources()];
    }

    // Sort by rating and return top 3
    recommended.sort((a, b) => b.rating - a.rating);
    return recommended.slice(0, 3);
}

/**
 * Update all sections (resources, bookmarks, recommendations)
 */
function updateAllSections() {
    // Update main resources grid
    const filtered = filterResources();
    renderResources(filtered, resourcesGrid);

    // Update bookmarks section
    const bookmarkedResources = getAllResources().filter(r => bookmarks.includes(r.id));
    if (bookmarkedResources.length > 0) {
        bookmarksSection.style.display = 'block';
        renderResources(bookmarkedResources, bookmarksGrid);
    } else {
        bookmarksSection.style.display = 'none';
    }

    // Update recommendations
    const recommendations = getRecommendations();
    renderResources(recommendations, recommendedGrid);
}

/**
 * Initialize the application
 */
function init() {
    // Search button click handler (instead of real-time input)
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            updateAllSections();
            // Scroll to resources section after search
            const resourcesSection = document.getElementById('resources');
            if (resourcesSection) {
                setTimeout(() => {
                    resourcesSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });
    } else {
        console.error('Search button not found!');
    }

    // Allow Enter key in search input
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                updateAllSections();
                // Scroll to resources section after search
                const resourcesSection = document.getElementById('resources');
                if (resourcesSection) {
                    setTimeout(() => {
                        resourcesSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            }
        });
    } else {
        console.error('Search input not found!');
    }

    // Filter panel toggle
    const filtersToggle = document.getElementById('filtersToggle');
    const filterPanel = document.getElementById('filterPanel');

    filtersToggle.addEventListener('click', () => {
        filterPanel.classList.toggle('active');
        filtersToggle.classList.toggle('active');
    });

    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFilters');
    applyFiltersBtn.addEventListener('click', () => {
        updateAllSections();
        // Close filter panel after applying
        filterPanel.classList.remove('active');
        filtersToggle.classList.remove('active');
        // Scroll to resources section
        const resourcesSection = document.getElementById('resources');
        if (resourcesSection) {
            setTimeout(() => {
                resourcesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    });

    // Filter dropdowns change handlers (for immediate feedback when panel is open)
    subjectFilter.addEventListener('change', updateAllSections);
    typeFilter.addEventListener('change', updateAllSections);
    sortFilter.addEventListener('change', updateAllSections);

    // Upload button click
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', openUploadModal);
    }

    // Upload modal close
    const closeUploadBtn = document.getElementById('closeUploadModal');
    if (closeUploadBtn) {
        closeUploadBtn.addEventListener('click', closeUploadModal);
    }

    // Upload form submit
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }

    // Close modal on outside click
    const uploadModal = document.getElementById('uploadModal');
    if (uploadModal) {
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                closeUploadModal();
            }
        });
    }
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Update bookmarks section ID reference
    const bookmarksSection = document.getElementById('bookmarks');
    if (bookmarksSection) {
        window.bookmarksSection = bookmarksSection;
    }

    // Initial render
    updateAllSections();

    // Update UI based on auth state
    updateAuthUI();

    console.log('📚 StudyStack initialized successfully!');
    console.log(`📊 Total resources: ${getAllResources().length}`);
    console.log(`🔖 Bookmarked resources: ${bookmarks.length}`);
    if (isLoggedIn()) {
        console.log(`👤 Logged in as: ${currentUser.username} (${currentUser.role})`);
    }
}

// ========================================
// Initialize App on DOM Load
// ========================================
document.addEventListener('DOMContentLoaded', init);
