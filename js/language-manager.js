// Language Manager for Kalavrita Guide PWA
class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || this.getBrowserLanguage() || 'en';
        this.translations = translations;
        this.observers = [];
        
        this.init();
    }
    
    init() {
        this.setLanguage(this.currentLanguage);
        this.setupLanguageSwitcher();
        this.updateContent();
    }
    
    // Get stored language from localStorage
    getStoredLanguage() {
        try {
            return localStorage.getItem('kalavrita-language') || null;
        } catch (error) {
            console.error('Error getting stored language:', error);
            return null;
        }
    }
    
    // Get browser language preference
    getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('el')) {
            return 'el';
        }
        return 'en';
    }
    
    // Set language and store preference
    setLanguage(language) {
        if (!this.translations[language]) {
            console.warn(`Language ${language} not supported, falling back to English`);
            language = 'en';
        }
        
        this.currentLanguage = language;
        
        try {
            localStorage.setItem('kalavrita-language', language);
        } catch (error) {
            console.error('Error storing language preference:', error);
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Notify observers
        this.notifyObservers();
    }
    
    // Get translation for a key
    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                console.warn(`Translation missing for key: ${key}`);
                return key;
            }
        }
        
        // Replace parameters in translation
        if (typeof translation === 'string') {
            return this.replaceParams(translation, params);
        }
        
        return translation;
    }
    
    // Replace parameters in translation string
    replaceParams(str, params) {
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] || match;
        });
    }
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
    
    // Setup language switcher UI
    setupLanguageSwitcher() {
        // Create language switcher if it doesn't exist
        let switcher = document.getElementById('language-switcher');
        if (!switcher) {
            switcher = this.createLanguageSwitcher();
            this.insertLanguageSwitcher(switcher);
        }
        
        this.updateLanguageSwitcher();
    }
    
    // Create language switcher element
    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.id = 'language-switcher';
        switcher.className = 'language-switcher';
        
        const button = document.createElement('button');
        button.className = 'language-button';
        button.innerHTML = `
            <span class="language-flag">${this.getLanguageFlag(this.currentLanguage)}</span>
            <span class="language-name">${this.getLanguageName(this.currentLanguage)}</span>
            <span class="language-arrow">▼</span>
        `;
        
        const dropdown = document.createElement('div');
        dropdown.className = 'language-dropdown';
        
        const languages = this.getAvailableLanguages();
        languages.forEach(lang => {
            const option = document.createElement('div');
            option.className = 'language-option';
            if (lang === this.currentLanguage) {
                option.classList.add('active');
            }
            option.dataset.language = lang;
            option.innerHTML = `
                <span class="language-flag">${this.getLanguageFlag(lang)}</span>
                <span class="language-name">${this.getLanguageName(lang)}</span>
            `;
            
            option.addEventListener('click', () => {
                this.setLanguage(lang);
                this.updateContent();
                this.closeDropdown();
            });
            
            dropdown.appendChild(option);
        });
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        switcher.appendChild(button);
        switcher.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeDropdown();
        });
        
        return switcher;
    }
    
    // Insert language switcher into header
    insertLanguageSwitcher(switcher) {
        const header = document.querySelector('.header-content');
        if (header) {
            header.appendChild(switcher);
        }
        
        // Add mobile-specific positioning
        this.handleMobilePositioning();
    }
    
    // Handle mobile positioning for language switcher
    handleMobilePositioning() {
        const updatePosition = () => {
            const switcher = document.getElementById('language-switcher');
            if (!switcher) return;
            
            if (window.innerWidth <= 768) {
                // On mobile, position it fixed in top-right
                switcher.style.position = 'fixed';
                switcher.style.top = '20px';
                switcher.style.right = '20px';
                switcher.style.zIndex = '1001';
                switcher.style.marginLeft = '0';
            } else {
                // On desktop, reset to normal positioning
                switcher.style.position = '';
                switcher.style.top = '';
                switcher.style.right = '';
                switcher.style.zIndex = '';
                switcher.style.marginLeft = '1rem';
            }
        };
        
        // Update on load and resize
        updatePosition();
        window.addEventListener('resize', updatePosition);
    }
    
    // Get language flag emoji
    getLanguageFlag(language) {
        const flags = {
            'en': '🇺🇸',
            'el': '🇬🇷'
        };
        return flags[language] || '🌐';
    }
    
    // Get language name
    getLanguageName(language) {
        const names = {
            'en': 'English',
            'el': 'Ελληνικά'
        };
        return names[language] || language;
    }
    
    // Update language switcher display
    updateLanguageSwitcher() {
        const button = document.querySelector('.language-button');
        if (button) {
            button.innerHTML = `
                <span class="language-flag">${this.getLanguageFlag(this.currentLanguage)}</span>
                <span class="language-name">${this.getLanguageName(this.currentLanguage)}</span>
                <span class="language-arrow">▼</span>
            `;
        }
        
        // Update active state in dropdown
        const options = document.querySelectorAll('.language-option');
        options.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.language === this.currentLanguage) {
                option.classList.add('active');
            }
        });
    }
    
    // Toggle language dropdown
    toggleDropdown() {
        const dropdown = document.querySelector('.language-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }
    
    // Close language dropdown
    closeDropdown() {
        const dropdown = document.querySelector('.language-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
    
    // Update all content with translations
    updateContent() {
        // Update navigation
        this.updateNavigation();
        
        // Update hero section
        this.updateHeroSection();
        
        // Update sections
        this.updateSections();
        
        // Update footer
        this.updateFooter();
        
        // Update forms
        this.updateForms();
        
        // Update contact section
        this.updateContactSection();
        
        // Update buttons and common elements
        this.updateCommonElements();
    }
    
    // Update navigation
    updateNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const key = href.substring(1); // Remove #
                const translation = this.t(`nav.${key}`);
                if (translation) {
                    link.textContent = translation;
                }
            }
        });
    }
    
    // Update hero section
    updateHeroSection() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = this.t('hero.title');
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = this.t('hero.subtitle');
        }
        
        const exploreBtn = document.querySelector('.hero-actions .btn:first-child');
        if (exploreBtn) {
            exploreBtn.textContent = this.t('hero.exploreRestaurants');
        }
        
        const seeBtn = document.querySelector('.hero-actions .btn:last-child');
        if (seeBtn) {
            seeBtn.textContent = this.t('hero.seeAttractions');
        }
    }
    
    // Update sections
    updateSections() {
        // Restaurants section
        this.updateSection('restaurants');
        
        // Attractions section
        this.updateSection('attractions');
        
        // Activities section
        this.updateSection('activities');
        
        // Contact section
        this.updateSection('contact');
    }
    
    // Update specific section
    updateSection(sectionName) {
        const sectionTitle = document.querySelector(`#${sectionName} .section-title`);
        if (sectionTitle) {
            sectionTitle.textContent = this.t(`${sectionName}.title`);
        }
        
        const sectionSubtitle = document.querySelector(`#${sectionName} .section-subtitle`);
        if (sectionSubtitle) {
            sectionSubtitle.textContent = this.t(`${sectionName}.subtitle`);
        }
        
        // Update filter tabs for restaurants
        if (sectionName === 'restaurants') {
            this.updateFilterTabs();
        }
    }
    
    // Update filter tabs
    updateFilterTabs() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            const filter = tab.dataset.filter;
            if (filter) {
                const translation = this.t(`restaurants.${filter}`);
                if (translation) {
                    tab.textContent = translation;
                }
            }
        });
    }
    
    // Update footer
    updateFooter() {
        const footerTitle = document.querySelector('.footer-section h3');
        if (footerTitle) {
            footerTitle.textContent = this.t('footer.title');
        }
        
        const footerDesc = document.querySelector('.footer-section p');
        if (footerDesc) {
            footerDesc.textContent = this.t('footer.description');
        }
        
        const quickLinks = document.querySelector('.footer-section:nth-child(2) h4');
        if (quickLinks) {
            quickLinks.textContent = this.t('footer.quickLinks');
        }
        
        const connect = document.querySelector('.footer-section:nth-child(3) h4');
        if (connect) {
            connect.textContent = this.t('footer.connect');
        }
        
        const followUs = document.querySelector('.footer-section:nth-child(3) p');
        if (followUs) {
            followUs.textContent = this.t('footer.followUs');
        }
    }
    
    // Update forms
    updateForms() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            // Update form labels
            const nameLabel = contactForm.querySelector('label[for="name"]');
            if (nameLabel) {
                nameLabel.textContent = this.t('contact.name');
            }
            
            const emailLabel = contactForm.querySelector('label[for="email"]');
            if (emailLabel) {
                emailLabel.textContent = this.t('contact.email');
            }
            
            const subjectLabel = contactForm.querySelector('label[for="subject"]');
            if (subjectLabel) {
                subjectLabel.textContent = this.t('contact.subject');
            }
            
            const messageLabel = contactForm.querySelector('label[for="message"]');
            if (messageLabel) {
                messageLabel.textContent = this.t('contact.message');
            }
            
            // Update placeholders
            const nameInput = contactForm.querySelector('input[name="name"]');
            if (nameInput) {
                nameInput.placeholder = this.t('contact.namePlaceholder');
            }
            
            const emailInput = contactForm.querySelector('input[name="email"]');
            if (emailInput) {
                emailInput.placeholder = this.t('contact.emailPlaceholder');
            }
            
            const subjectInput = contactForm.querySelector('input[name="subject"]');
            if (subjectInput) {
                subjectInput.placeholder = this.t('contact.subjectPlaceholder');
            }
            
            const messageTextarea = contactForm.querySelector('textarea[name="message"]');
            if (messageTextarea) {
                messageTextarea.placeholder = this.t('contact.messagePlaceholder');
            }
            
            // Update submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = this.t('contact.sendMessage');
            }
        }
    }
    
    // Update contact section
    updateContactSection() {
        // Update contact section title and subtitle
        const contactTitle = document.querySelector('#contact .section-title');
        if (contactTitle) {
            contactTitle.textContent = this.t('contact.title');
        }
        
        const contactSubtitle = document.querySelector('#contact .section-subtitle');
        if (contactSubtitle) {
            contactSubtitle.textContent = this.t('contact.subtitle');
        }
        
        // Update email support section
        const emailTitle = document.querySelector('.contact-email-title');
        if (emailTitle) {
            emailTitle.textContent = this.t('contact.emailSupport');
        }
        
        const emailDescription = document.querySelector('.contact-email-description');
        if (emailDescription) {
            emailDescription.textContent = this.t('contact.emailDescription');
        }
        
        const emailButton = document.querySelector('.contact-email-button');
        if (emailButton) {
            emailButton.textContent = this.t('contact.emailButton');
        }
        
        // Update quick contact section
        const quickTitle = document.querySelector('.contact-quick-title');
        if (quickTitle) {
            quickTitle.textContent = this.t('contact.quickContact');
        }
        
        const quickDescription = document.querySelector('.contact-quick-description');
        if (quickDescription) {
            quickDescription.textContent = this.t('contact.quickDescription');
        }
        
        const quickButton = document.querySelector('.contact-item .btn-primary');
        if (quickButton) {
            quickButton.textContent = this.t('contact.sendMessage');
        }
    }
    
    // Update common elements
    updateCommonElements() {
        // Update loading text
        const loading = document.getElementById('loading');
        if (loading) {
            const loadingText = loading.querySelector('p');
            if (loadingText) {
                loadingText.textContent = this.t('common.loading');
            }
        }
        
        // Update install prompt
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            const installTitle = installPrompt.querySelector('h3');
            if (installTitle) {
                installTitle.textContent = this.t('common.install');
            }
        }
    }
    
    // Add observer for language changes
    addObserver(callback) {
        this.observers.push(callback);
    }
    
    // Remove observer
    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    // Notify observers
    notifyObservers() {
        this.observers.forEach(callback => {
            try {
                callback(this.currentLanguage);
            } catch (error) {
                console.error('Error in language observer:', error);
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
