// Kalavrita Guide PWA - Main Application
class KalavritaGuide {
    constructor() {
        this.data = kalavritaData;
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.installPrompt = null;
        this.isOnline = navigator.onLine;
        this.emailService = new EmailService();
        this.languageManager = new LanguageManager();
        this.consentGiven = this.getStoredConsent();
        
        this.init();
    }
    
    init() {
        this.registerServiceWorker();
        this.setupEventListeners();
        this.loadContent();
        this.setupInstallPrompt();
        this.setupOfflineHandling();
        this.setupNotifications();
        this.setupLanguageObserver();
        this.setupConsentManagement();
    }
    
    // Consent Management
    setupConsentManagement() {
        // Show consent banner if no consent has been given
        if (!this.consentGiven) {
            this.showConsentBanner();
        } else {
            this.updateConsentSettings(this.consentGiven);
        }
    }
    
    getStoredConsent() {
        try {
            const stored = localStorage.getItem('kalavrita-consent');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading consent preferences:', error);
            return null;
        }
    }
    
    storeConsent(consent) {
        try {
            localStorage.setItem('kalavrita-consent', JSON.stringify(consent));
            this.consentGiven = consent;
        } catch (error) {
            console.error('Error storing consent preferences:', error);
        }
    }
    
    showConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'consent-banner';
        banner.className = 'consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <div class="consent-text">
                    <h3>${this.languageManager.t('consent.title', 'Cookie & Privacy Settings')}</h3>
                    <p>${this.languageManager.t('consent.description', 'We use cookies to improve your experience and analyze site usage. You can customize your preferences below.')}</p>
                </div>
                <div class="consent-actions">
                    <button class="btn btn-secondary" onclick="app.showConsentModal()">${this.languageManager.t('consent.customize', 'Customize')}</button>
                    <button class="btn btn-primary" onclick="app.acceptAllConsent()">${this.languageManager.t('consent.acceptAll', 'Accept All')}</button>
                    <button class="btn btn-secondary" onclick="app.rejectAllConsent()">${this.languageManager.t('consent.rejectAll', 'Reject All')}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                border-top: 1px solid #e9ecef;
                box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                padding: 1rem;
            }
            
            .consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .consent-text {
                flex: 1;
                min-width: 300px;
            }
            
            .consent-text h3 {
                margin: 0 0 0.5rem 0;
                color: #2c5530;
                font-size: 1.1rem;
            }
            
            .consent-text p {
                margin: 0;
                color: #666;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .consent-actions {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .consent-actions .btn {
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                white-space: nowrap;
            }
            
            @media (max-width: 768px) {
                .consent-content {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .consent-actions {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    showConsentModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">${this.languageManager.t('consent.modalTitle', 'Privacy & Cookie Settings')}</h3>
                    <button class="modal-close" onclick="app.closeConsentModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${this.languageManager.t('consent.modalDescription', 'Choose which cookies and data you want to allow. You can change these settings at any time.')}</p>
                    
                    <div class="consent-options">
                        <div class="consent-option">
                            <label class="consent-toggle">
                                <input type="checkbox" id="analytics-storage" checked>
                                <span class="toggle-slider"></span>
                                <div class="toggle-content">
                                    <strong>${this.languageManager.t('consent.analytics', 'Analytics')}</strong>
                                    <small>${this.languageManager.t('consent.analyticsDesc', 'Help us understand how visitors interact with our website')}</small>
                                </div>
                            </label>
                        </div>
                        
                        <div class="consent-option">
                            <label class="consent-toggle">
                                <input type="checkbox" id="functionality-storage" checked>
                                <span class="toggle-slider"></span>
                                <div class="toggle-content">
                                    <strong>${this.languageManager.t('consent.functionality', 'Functionality')}</strong>
                                    <small>${this.languageManager.t('consent.functionalityDesc', 'Remember your preferences and settings')}</small>
                                </div>
                            </label>
                        </div>
                        
                        <div class="consent-option">
                            <label class="consent-toggle">
                                <input type="checkbox" id="personalization-storage">
                                <span class="toggle-slider"></span>
                                <div class="toggle-content">
                                    <strong>${this.languageManager.t('consent.personalization', 'Personalization')}</strong>
                                    <small>${this.languageManager.t('consent.personalizationDesc', 'Provide personalized content and recommendations')}</small>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="app.closeConsentModal()">${this.languageManager.t('consent.cancel', 'Cancel')}</button>
                    <button class="btn btn-primary" onclick="app.saveConsentSettings()">${this.languageManager.t('consent.save', 'Save Settings')}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .consent-options {
                margin: 1rem 0;
            }
            
            .consent-option {
                margin-bottom: 1rem;
                padding: 1rem;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                background: #f8f9fa;
            }
            
            .consent-toggle {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                cursor: pointer;
            }
            
            .consent-toggle input[type="checkbox"] {
                display: none;
            }
            
            .toggle-slider {
                width: 50px;
                height: 24px;
                background: #ddd;
                border-radius: 12px;
                position: relative;
                transition: background 0.3s;
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .toggle-slider::before {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                top: 2px;
                left: 2px;
                transition: transform 0.3s;
            }
            
            .consent-toggle input:checked + .toggle-slider {
                background: #2c5530;
            }
            
            .consent-toggle input:checked + .toggle-slider::before {
                transform: translateX(26px);
            }
            
            .toggle-content {
                flex: 1;
            }
            
            .toggle-content strong {
                display: block;
                color: #2c5530;
                margin-bottom: 0.25rem;
            }
            
            .toggle-content small {
                color: #666;
                font-size: 0.85rem;
                line-height: 1.3;
            }
        `;
        document.head.appendChild(style);
    }
    
    closeConsentModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
    
    acceptAllConsent() {
        const consent = {
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            personalization_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        };
        
        this.storeConsent(consent);
        this.updateConsentSettings(consent);
        this.hideConsentBanner();
    }
    
    rejectAllConsent() {
        const consent = {
            analytics_storage: 'denied',
            functionality_storage: 'denied',
            personalization_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        };
        
        this.storeConsent(consent);
        this.updateConsentSettings(consent);
        this.hideConsentBanner();
    }
    
    saveConsentSettings() {
        const consent = {
            analytics_storage: document.getElementById('analytics-storage').checked ? 'granted' : 'denied',
            functionality_storage: document.getElementById('functionality-storage').checked ? 'granted' : 'denied',
            personalization_storage: document.getElementById('personalization-storage').checked ? 'granted' : 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        };
        
        this.storeConsent(consent);
        this.updateConsentSettings(consent);
        this.hideConsentBanner();
        this.closeConsentModal();
    }
    
    updateConsentSettings(consent) {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', consent);
        }
    }
    
    hideConsentBanner() {
        const banner = document.getElementById('consent-banner');
        if (banner) {
            banner.remove();
        }
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
        
        const currentLang = this.languageManager.getCurrentLanguage();
        const attractions = kalavritaDataTranslations.attractions[currentLang] || this.data.attractions;
        
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
        
        const currentLang = this.languageManager.getCurrentLanguage();
        const activities = kalavritaDataTranslations.activities[currentLang] || this.data.activities;
        
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
                            ${this.languageManager.t('restaurants.viewDetails')}
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="app.getDirections(${restaurant.coordinates.lat}, ${restaurant.coordinates.lng})">
                            ${this.languageManager.t('restaurants.directions')}
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
                            ${this.languageManager.t('attractions.learnMore')}
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="app.getDirections(${attraction.coordinates.lat}, ${attraction.coordinates.lng})">
                            ${this.languageManager.t('restaurants.directions')}
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
                            ${this.languageManager.t('activities.bookNow')}
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="app.contactForBooking(${activity.id})">
                            ${this.languageManager.t('activities.contact')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Filter and Search Methods
    getFilteredRestaurants() {
        const currentLang = this.languageManager.getCurrentLanguage();
        let restaurants = kalavritaDataTranslations.restaurants[currentLang] || this.data.restaurants;
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            const filterMapping = this.getFilterMapping(currentLang);
            const targetType = filterMapping[this.currentFilter];
            console.log('Filtering by:', this.currentFilter, 'Target type:', targetType);
            console.log('Available types:', restaurants.map(r => r.type));
            
            restaurants = restaurants.filter(restaurant => {
                const matches = restaurant.type === targetType;
                console.log(`Restaurant "${restaurant.name}" type "${restaurant.type}" matches "${targetType}":`, matches);
                return matches;
            });
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
    
    // Get filter mapping for current language
    getFilterMapping(language) {
        const mappings = {
            'en': {
                'traditional': 'Traditional',
                'modern': 'Modern',
                'cafe': 'Cafe'
            },
            'el': {
                'traditional': 'Παραδοσιακό',
                'modern': 'Σύγχρονο',
                'cafe': 'Καφετέρια'
            }
        };
        return mappings[language] || mappings['en'];
    }
    
    handleFilterChange(filter) {
        console.log('Filter changed to:', filter);
        console.log('Current language:', this.languageManager.getCurrentLanguage());
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
        const currentLang = this.languageManager.getCurrentLanguage();
        const restaurants = kalavritaDataTranslations.restaurants[currentLang] || this.data.restaurants;
        const restaurant = restaurants.find(r => r.id === id);
        if (restaurant) {
            this.showModal(this.languageManager.t('restaurants.title'), this.createRestaurantDetailContent(restaurant));
        }
    }
    
    showAttractionDetails(id) {
        const currentLang = this.languageManager.getCurrentLanguage();
        const attractions = kalavritaDataTranslations.attractions[currentLang] || this.data.attractions;
        const attraction = attractions.find(a => a.id === id);
        if (attraction) {
            this.showModal(this.languageManager.t('attractions.title'), this.createAttractionDetailContent(attraction));
        }
    }
    
    showActivityDetails(id) {
        const currentLang = this.languageManager.getCurrentLanguage();
        const activities = kalavritaDataTranslations.activities[currentLang] || this.data.activities;
        const activity = activities.find(a => a.id === id);
        if (activity) {
            this.showModal(this.languageManager.t('activities.title'), this.createActivityDetailContent(activity));
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
    
    // Email Support Handling
    openEmailSupport() {
        const email = 'hello@forcehook.com';
        const subject = 'Kalavrita Guide - Support Request';
        const body = 'Hello,\n\nI need assistance with the Kalavrita Guide app.\n\nPlease provide details about your inquiry:\n\n';
        
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
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
    
    // Language Observer Setup
    setupLanguageObserver() {
        this.languageManager.addObserver((language) => {
            console.log('Language changed to:', language);
            this.loadContent();
        });
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
                        <h4>${this.languageManager.t('restaurants.hours')}</h4>
                        <p>${restaurant.hours}</p>
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('common.contact')}</h4>
                        <p>${this.languageManager.t('restaurants.phone')}: <a href="tel:${restaurant.phone}">${restaurant.phone}</a></p>
                        <p>${this.languageManager.t('restaurants.address')}: ${restaurant.address}</p>
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('restaurants.features')}</h4>
                        <div class="feature-tags">
                            ${restaurant.features.map(feature => `<span class="tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('restaurants.highlights')}</h4>
                        <ul>
                            ${restaurant.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="app.getDirections(${restaurant.coordinates.lat}, ${restaurant.coordinates.lng})">
                        ${this.languageManager.t('restaurants.directions')}
                    </button>
                    <a href="tel:${restaurant.phone}" class="btn btn-secondary">${this.languageManager.t('common.call')}</a>
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
                        <h4>${this.languageManager.t('restaurants.hours')}</h4>
                        <p>${attraction.hours}</p>
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('common.location')}</h4>
                        <p>${attraction.address}</p>
                        ${attraction.phone !== 'N/A' ? `<p>${this.languageManager.t('restaurants.phone')}: <a href="tel:${attraction.phone}">${attraction.phone}</a></p>` : ''}
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('restaurants.features')}</h4>
                        <div class="feature-tags">
                            ${attraction.features.map(feature => `<span class="tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('restaurants.highlights')}</h4>
                        <ul>
                            ${attraction.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="app.getDirections(${attraction.coordinates.lat}, ${attraction.coordinates.lng})">
                        ${this.languageManager.t('restaurants.directions')}
                    </button>
                    ${attraction.phone !== 'N/A' ? `<a href="tel:${attraction.phone}" class="btn btn-secondary">${this.languageManager.t('common.call')}</a>` : ''}
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
                        <h4>${this.languageManager.t('common.details')}</h4>
                        <p><strong>${this.languageManager.t('activities.type')}:</strong> ${activity.type}</p>
                        <p><strong>${this.languageManager.t('activities.duration')}:</strong> ${activity.duration}</p>
                        <p><strong>${this.languageManager.t('activities.difficulty')}:</strong> ${activity.difficulty}</p>
                        <p><strong>${this.languageManager.t('activities.season')}:</strong> ${activity.season}</p>
                        <p><strong>${this.languageManager.t('common.price')}:</strong> ${activity.price}</p>
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('activities.equipment')}</h4>
                        <p>${activity.equipment}</p>
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('restaurants.features')}</h4>
                        <div class="feature-tags">
                            ${activity.features.map(feature => `<span class="tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>${this.languageManager.t('restaurants.highlights')}</h4>
                        <ul>
                            ${activity.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="app.contactForBooking(${activity.id})">
                        ${this.languageManager.t('activities.bookNow')}
                    </button>
                    <button class="btn btn-secondary" onclick="app.contactForBooking(${activity.id})">
                        ${this.languageManager.t('activities.contact')}
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
