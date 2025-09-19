// Kalavrita Guide PWA - Main Application
class KalavritaGuide {
    constructor() {
        this.data = kalavritaData;
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.installPrompt = null;
        this.isOnline = navigator.onLine;
        this.emailService = new EmailService();
        
        this.init();
    }
    
    init() {
        this.registerServiceWorker();
        this.setupEventListeners();
        this.loadContent();
        this.setupInstallPrompt();
        this.setupOfflineHandling();
        this.setupNotifications();
    }
    
    // Service Worker Registration
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/js/service-worker.js');
                console.log('Service Worker registered successfully:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
    
    // Event Listeners Setup
    setupEventListeners() {
        // Hero image error handling
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.addEventListener('error', () => {
                console.log('Hero image failed to load, using fallback');
                heroImage.src = 'images/kalavrita-hero.svg';
                heroImage.alt = 'Kalavrita Mountain View (Fallback)';
            });
            
            heroImage.addEventListener('load', () => {
                console.log('Hero image loaded successfully');
            });
        }
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
                this.updateActiveNavLink(link);
            });
        });
        
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
                this.updateActiveFilterTab(e.target);
            });
        });
        
        // Search functionality
        const searchInput = document.querySelector('.search-bar');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleContactForm(e);
            });
        }
        
        // Install prompt
        const installBtn = document.getElementById('install-btn');
        const dismissBtn = document.getElementById('dismiss-btn');
        
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installApp();
            });
        }
        
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                this.dismissInstallPrompt();
            });
        }
        
        // Online/Offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showToast('Connection restored', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showToast('You are now offline', 'warning');
        });
    }
    
    // Content Loading
    loadContent() {
        this.showLoading(true);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.renderRestaurants();
            this.renderAttractions();
            this.renderActivities();
            this.showLoading(false);
        }, 1000);
    }
    
    // Restaurant Rendering
    renderRestaurants() {
        const container = document.getElementById('restaurants-grid');
        if (!container) return;
        
        const filteredRestaurants = this.getFilteredRestaurants();
        
        if (filteredRestaurants.length === 0) {
            container.innerHTML = this.getEmptyState('restaurants');
            return;
        }
        
        container.innerHTML = filteredRestaurants.map(restaurant => this.createRestaurantCard(restaurant)).join('');
    }
    
    // Attraction Rendering
    renderAttractions() {
        const container = document.getElementById('attractions-grid');
        if (!container) return;
        
        const attractions = this.data.attractions;
        
        if (attractions.length === 0) {
            container.innerHTML = this.getEmptyState('attractions');
            return;
        }
        
        container.innerHTML = attractions.map(attraction => this.createAttractionCard(attraction)).join('');
    }
    
    // Activity Rendering
    renderActivities() {
        const container = document.getElementById('activities-grid');
        if (!container) return;
        
        const activities = this.data.activities;
        
        if (activities.length === 0) {
            container.innerHTML = this.getEmptyState('activities');
            return;
        }
        
        container.innerHTML = activities.map(activity => this.createActivityCard(activity)).join('');
    }
    
    // Card Creation Methods
    createRestaurantCard(restaurant) {
        return `
            <div class="card restaurant-card" data-category="${restaurant.type.toLowerCase()}">
                <div class="card-image">
                    <span class="restaurant-icon">${restaurant.image}</span>
                </div>
                <div class="card-content">
                    <div class="card-title">
                        <span class="restaurant-name">${restaurant.name}</span>
                        <span class="restaurant-type">${restaurant.type}</span>
                    </div>
                    <div class="card-meta">
                        <div class="rating">
                            <span class="stars">${'★'.repeat(Math.floor(restaurant.rating))}</span>
                            <span class="rating-text">${restaurant.rating}/5</span>
                        </div>
                        <div class="price-range">${restaurant.priceRange}</div>
                    </div>
                    <p class="card-description">${restaurant.description}</p>
                    <div class="card-features">
                        ${restaurant.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-small" onclick="app.showRestaurantDetails(${restaurant.id})">
                            View Details
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="app.getDirections(${restaurant.coordinates.lat}, ${restaurant.coordinates.lng})">
                            Directions
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createAttractionCard(attraction) {
        return `
            <div class="card attraction-card">
                <div class="card-image">
                    <span class="attraction-icon">${attraction.image}</span>
                    <span class="attraction-type">${attraction.type}</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${attraction.name}</h3>
                    <p class="card-subtitle">${attraction.duration} • ${attraction.rating}/5</p>
                    <p class="card-description">${attraction.description}</p>
                    <div class="attraction-info">
                        <div class="info-item">
                            <span class="info-icon">🕒</span>
                            <span>${attraction.hours}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">📍</span>
                            <span>${attraction.address}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-small" onclick="app.showAttractionDetails(${attraction.id})">
                            Learn More
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="app.getDirections(${attraction.coordinates.lat}, ${attraction.coordinates.lng})">
                            Directions
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createActivityCard(activity) {
        return `
            <div class="card activity-card">
                <div class="card-image">
                    <span class="activity-icon">${activity.image}</span>
                    <span class="activity-duration">${activity.duration}</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${activity.name}</h3>
                    <p class="card-subtitle">${activity.type} • ${activity.difficulty}</p>
                    <p class="card-description">${activity.description}</p>
                    <div class="activity-details">
                        <div class="detail-item">
                            <span class="detail-icon">💰</span>
                            <span>${activity.price}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-icon">📅</span>
                            <span>${activity.season}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-small" onclick="app.showActivityDetails(${activity.id})">
                            Book Now
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="app.contactForBooking(${activity.id})">
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Filter and Search Methods
    getFilteredRestaurants() {
        let restaurants = this.data.restaurants;
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            restaurants = restaurants.filter(restaurant => 
                restaurant.type.toLowerCase() === this.currentFilter.toLowerCase()
            );
        }
        
        // Apply search filter
        if (this.searchTerm) {
            restaurants = restaurants.filter(restaurant =>
                restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                restaurant.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                restaurant.features.some(feature => 
                    feature.toLowerCase().includes(this.searchTerm.toLowerCase())
                )
            );
        }
        
        return restaurants;
    }
    
    handleFilterChange(filter) {
        this.currentFilter = filter;
        this.renderRestaurants();
    }
    
    handleSearch(term) {
        this.searchTerm = term;
        this.renderRestaurants();
    }
    
    // Navigation Methods
    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Close mobile menu
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
    
    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    updateActiveFilterTab(activeTab) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }
    
    // Detail View Methods
    showRestaurantDetails(id) {
        const restaurant = this.data.restaurants.find(r => r.id === id);
        if (restaurant) {
            this.showModal('Restaurant Details', this.createRestaurantDetailContent(restaurant));
        }
    }
    
    showAttractionDetails(id) {
        const attraction = this.data.attractions.find(a => a.id === id);
        if (attraction) {
            this.showModal('Attraction Details', this.createAttractionDetailContent(attraction));
        }
    }
    
    showActivityDetails(id) {
        const activity = this.data.activities.find(a => a.id === id);
        if (activity) {
            this.showModal('Activity Details', this.createActivityDetailContent(activity));
        }
    }
    
    // Modal Methods
    showModal(title, content) {
        const modalHtml = `
            <div class="modal-overlay show" onclick="app.closeModal(event)">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="app.closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.style.overflow = 'hidden';
    }
    
    closeModal(event) {
        if (event && event.target !== event.currentTarget) return;
        
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
    
    // Contact Form Handling
    openContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    async handleContactForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        try {
            if (this.isOnline) {
                // Send email via API
                await this.sendContactEmail(contactData);
                this.showToast('Message sent successfully!', 'success');
            } else {
                // Store for later sync
                this.storeOfflineContact(contactData);
                this.showToast('Message saved offline. Will be sent when online.', 'warning');
            }
            
            event.target.reset();
            this.openContactForm();
        } catch (error) {
            console.error('Error sending contact form:', error);
            this.showToast('Error sending message. Please try again.', 'error');
        }
    }
    
    async sendContactEmail(contactData) {
        return await this.emailService.sendContactEmail(contactData);
    }
    
    storeOfflineContact(contactData) {
        // Store in service worker for later sync
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CACHE_FORM_DATA',
                formData: contactData
            });
        }
    }
    
    // Utility Methods
    getDirections(lat, lng) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    }
    
    contactForBooking(activityId) {
        const activity = this.data.activities.find(a => a.id === activityId);
        if (activity) {
            const subject = `Booking Inquiry: ${activity.name}`;
            const body = `Hi, I'm interested in booking the "${activity.name}" activity. Please provide more information about availability and pricing.`;
            const mailtoUrl = `mailto:${this.data.support.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
        }
    }
    
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.toggle('show', show);
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${this.getToastIcon(type)}</div>
                <div class="toast-message">
                    <div class="toast-title">${this.getToastTitle(type)}</div>
                    <div class="toast-description">${message}</div>
                </div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
    
    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
    
    getToastTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        return titles[type] || titles.info;
    }
    
    getEmptyState(type) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3 class="empty-state-title">No ${type} found</h3>
                <p class="empty-state-description">
                    ${this.searchTerm ? 'Try adjusting your search terms' : 'Check back later for new listings'}
                </p>
            </div>
        `;
    }
    
    // Install Prompt Methods
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallPrompt();
        });
    }
    
    showInstallPrompt() {
        const prompt = document.getElementById('install-prompt');
        if (prompt && this.installPrompt) {
            prompt.classList.add('show');
        }
    }
    
    async installApp() {
        if (this.installPrompt) {
            this.installPrompt.prompt();
            const { outcome } = await this.installPrompt.userChoice;
            console.log(`Install prompt outcome: ${outcome}`);
            this.dismissInstallPrompt();
        }
    }
    
    dismissInstallPrompt() {
        const prompt = document.getElementById('install-prompt');
        if (prompt) {
            prompt.classList.remove('show');
        }
    }
    
    // Offline Handling
    setupOfflineHandling() {
        // Check if we're offline on load
        if (!this.isOnline) {
            this.showToast('You are currently offline. Some features may be limited.', 'warning');
        }
    }
    
    // Notification Setup
    setupNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    showUpdateNotification() {
        this.showToast('App update available! Refresh to get the latest version.', 'info');
    }
    
    // Detail Content Creation Methods
    createRestaurantDetailContent(restaurant) {
        return `
            <div class="restaurant-detail">
                <div class="detail-header">
                    <h2>${restaurant.name}</h2>
                    <div class="detail-meta">
                        <span class="rating">${'★'.repeat(Math.floor(restaurant.rating))} ${restaurant.rating}/5</span>
                        <span class="price-range">${restaurant.priceRange}</span>
                        <span class="restaurant-type">${restaurant.type}</span>
                    </div>
                </div>
                <p class="detail-description">${restaurant.description}</p>
                <div class="detail-info">
                    <div class="info-section">
                        <h4>Hours</h4>
                        <p>${restaurant.hours}</p>
                    </div>
                    <div class="info-section">
                        <h4>Contact</h4>
                        <p>Phone: <a href="tel:${restaurant.phone}">${restaurant.phone}</a></p>
                        <p>Address: ${restaurant.address}</p>
                    </div>
                    <div class="info-section">
                        <h4>Features</h4>
                        <div class="feature-tags">
                            ${restaurant.features.map(feature => `<span class="tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>Highlights</h4>
                        <ul>
                            ${restaurant.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="app.getDirections(${restaurant.coordinates.lat}, ${restaurant.coordinates.lng})">
                        Get Directions
                    </button>
                    <a href="tel:${restaurant.phone}" class="btn btn-secondary">Call Now</a>
                </div>
            </div>
        `;
    }
    
    createAttractionDetailContent(attraction) {
        return `
            <div class="attraction-detail">
                <div class="detail-header">
                    <h2>${attraction.name}</h2>
                    <div class="detail-meta">
                        <span class="rating">${'★'.repeat(Math.floor(attraction.rating))} ${attraction.rating}/5</span>
                        <span class="duration">${attraction.duration}</span>
                        <span class="attraction-type">${attraction.type}</span>
                    </div>
                </div>
                <p class="detail-description">${attraction.description}</p>
                <div class="detail-info">
                    <div class="info-section">
                        <h4>Hours</h4>
                        <p>${attraction.hours}</p>
                    </div>
                    <div class="info-section">
                        <h4>Location</h4>
                        <p>${attraction.address}</p>
                        ${attraction.phone !== 'N/A' ? `<p>Phone: <a href="tel:${attraction.phone}">${attraction.phone}</a></p>` : ''}
                    </div>
                    <div class="info-section">
                        <h4>Features</h4>
                        <div class="feature-tags">
                            ${attraction.features.map(feature => `<span class="tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>Highlights</h4>
                        <ul>
                            ${attraction.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="app.getDirections(${attraction.coordinates.lat}, ${attraction.coordinates.lng})">
                        Get Directions
                    </button>
                    ${attraction.phone !== 'N/A' ? `<a href="tel:${attraction.phone}" class="btn btn-secondary">Call</a>` : ''}
                </div>
            </div>
        `;
    }
    
    createActivityDetailContent(activity) {
        return `
            <div class="activity-detail">
                <div class="detail-header">
                    <h2>${activity.name}</h2>
                    <div class="detail-meta">
                        <span class="rating">${'★'.repeat(Math.floor(activity.rating))} ${activity.rating}/5</span>
                        <span class="duration">${activity.duration}</span>
                        <span class="difficulty">${activity.difficulty}</span>
                    </div>
                </div>
                <p class="detail-description">${activity.description}</p>
                <div class="detail-info">
                    <div class="info-section">
                        <h4>Details</h4>
                        <p><strong>Type:</strong> ${activity.type}</p>
                        <p><strong>Duration:</strong> ${activity.duration}</p>
                        <p><strong>Difficulty:</strong> ${activity.difficulty}</p>
                        <p><strong>Season:</strong> ${activity.season}</p>
                        <p><strong>Price:</strong> ${activity.price}</p>
                    </div>
                    <div class="info-section">
                        <h4>Equipment Needed</h4>
                        <p>${activity.equipment}</p>
                    </div>
                    <div class="info-section">
                        <h4>Features</h4>
                        <div class="feature-tags">
                            ${activity.features.map(feature => `<span class="tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>Highlights</h4>
                        <ul>
                            ${activity.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="app.contactForBooking(${activity.id})">
                        Book Now
                    </button>
                    <button class="btn btn-secondary" onclick="app.contactForBooking(${activity.id})">
                        Contact for Info
                    </button>
                </div>
            </div>
        `;
    }
}

// Global functions for onclick handlers
function scrollToSection(sectionId) {
    app.navigateToSection(sectionId);
}

function openContactForm() {
    app.openContactForm();
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new KalavritaGuide();
});

// Make app globally available for onclick handlers
window.app = app;
