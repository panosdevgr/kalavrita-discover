// Email Service for Kalavrita Guide PWA
class EmailService {
    constructor() {
        this.apiEndpoint = '/api/contact';
        this.offlineQueue = [];
        this.isOnline = navigator.onLine;
        this.setupOfflineHandling();
    }
    
    // Send contact email
    async sendContactEmail(contactData) {
        const emailData = {
            to: 'hello@forcehook.com',
            from: contactData.email,
            subject: `Kalavrita Guide Contact: ${contactData.subject}`,
            html: this.generateEmailHTML(contactData),
            text: this.generateEmailText(contactData),
            replyTo: contactData.email,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        if (this.isOnline) {
            try {
                return await this.sendViaAPI(emailData);
            } catch (error) {
                console.error('API email failed, queuing for retry:', error);
                this.queueForRetry(emailData);
                throw error;
            }
        } else {
            this.queueForRetry(emailData);
            throw new Error('Offline - email queued for later');
        }
    }
    
    // Send booking inquiry
    async sendBookingInquiry(activityId, userData) {
        const activity = kalavritaData.activities.find(a => a.id === activityId);
        if (!activity) {
            throw new Error('Activity not found');
        }
        
        const emailData = {
            to: 'hello@forcehook.com',
            from: userData.email,
            subject: `Booking Inquiry: ${activity.name}`,
            html: this.generateBookingEmailHTML(activity, userData),
            text: this.generateBookingEmailText(activity, userData),
            replyTo: userData.email,
            timestamp: new Date().toISOString(),
            activityId: activityId,
            userAgent: navigator.userAgent
        };
        
        if (this.isOnline) {
            try {
                return await this.sendViaAPI(emailData);
            } catch (error) {
                console.error('API booking email failed, queuing for retry:', error);
                this.queueForRetry(emailData);
                throw error;
            }
        } else {
            this.queueForRetry(emailData);
            throw new Error('Offline - booking inquiry queued for later');
        }
    }
    
    // Send via API (simulated)
    async sendViaAPI(emailData) {
        // Simulate API call - replace with actual email service integration
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    console.log('Email sent successfully:', emailData.subject);
                    resolve({
                        success: true,
                        messageId: `msg_${Date.now()}`,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Email service temporarily unavailable'));
                }
            }, 1000);
        });
    }
    
    // Queue email for retry when online
    queueForRetry(emailData) {
        this.offlineQueue.push({
            ...emailData,
            queuedAt: new Date().toISOString(),
            retryCount: 0
        });
        
        this.saveOfflineQueue();
        console.log('Email queued for retry:', emailData.subject);
    }
    
    // Process offline queue when back online
    async processOfflineQueue() {
        if (this.offlineQueue.length === 0) return;
        
        console.log(`Processing ${this.offlineQueue.length} queued emails...`);
        
        const queue = [...this.offlineQueue];
        this.offlineQueue = [];
        
        for (const emailData of queue) {
            try {
                await this.sendViaAPI(emailData);
                console.log('Queued email sent successfully:', emailData.subject);
            } catch (error) {
                console.error('Failed to send queued email:', error);
                // Re-queue with retry count
                emailData.retryCount = (emailData.retryCount || 0) + 1;
                if (emailData.retryCount < 3) {
                    this.offlineQueue.push(emailData);
                } else {
                    console.error('Max retries exceeded for email:', emailData.subject);
                }
            }
        }
        
        this.saveOfflineQueue();
    }
    
    // Save offline queue to localStorage
    saveOfflineQueue() {
        try {
            localStorage.setItem('kalavrita_email_queue', JSON.stringify(this.offlineQueue));
        } catch (error) {
            console.error('Failed to save offline queue:', error);
        }
    }
    
    // Load offline queue from localStorage
    loadOfflineQueue() {
        try {
            const saved = localStorage.getItem('kalavrita_email_queue');
            if (saved) {
                this.offlineQueue = JSON.parse(saved);
                console.log(`Loaded ${this.offlineQueue.length} queued emails`);
            }
        } catch (error) {
            console.error('Failed to load offline queue:', error);
            this.offlineQueue = [];
        }
    }
    
    // Setup offline handling
    setupOfflineHandling() {
        this.loadOfflineQueue();
        
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processOfflineQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Process queue on page load if online
        if (this.isOnline) {
            setTimeout(() => this.processOfflineQueue(), 2000);
        }
    }
    
    // Generate HTML email content
    generateEmailHTML(contactData) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Contact Form Submission</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2c5530; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #2c5530; }
                    .value { margin-top: 5px; }
                    .footer { background-color: #1a3d1f; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Contact Form Submission</h2>
                        <p>Kalavrita Guide PWA</p>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">Name:</div>
                            <div class="value">${contactData.name}</div>
                        </div>
                        <div class="field">
                            <div class="label">Email:</div>
                            <div class="value">${contactData.email}</div>
                        </div>
                        <div class="field">
                            <div class="label">Subject:</div>
                            <div class="value">${contactData.subject}</div>
                        </div>
                        <div class="field">
                            <div class="label">Message:</div>
                            <div class="value">${contactData.message.replace(/\n/g, '<br>')}</div>
                        </div>
                        <div class="field">
                            <div class="label">Submitted:</div>
                            <div class="value">${new Date(contactData.timestamp).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This email was sent from the Kalavrita Guide PWA contact form.</p>
                        <p>Reply directly to this email to respond to the user.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    
    // Generate text email content
    generateEmailText(contactData) {
        return `
New Contact Form Submission - Kalavrita Guide PWA

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}

Message:
${contactData.message}

Submitted: ${new Date(contactData.timestamp).toLocaleString()}

---
This email was sent from the Kalavrita Guide PWA contact form.
Reply directly to this email to respond to the user.
        `.trim();
    }
    
    // Generate booking email HTML
    generateBookingEmailHTML(activity, userData) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Booking Inquiry</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2c5530; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; }
                    .activity-info { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2c5530; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #2c5530; }
                    .value { margin-top: 5px; }
                    .footer { background-color: #1a3d1f; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Booking Inquiry</h2>
                        <p>Kalavrita Guide PWA</p>
                    </div>
                    <div class="content">
                        <div class="activity-info">
                            <h3>${activity.name}</h3>
                            <p><strong>Type:</strong> ${activity.type}</p>
                            <p><strong>Duration:</strong> ${activity.duration}</p>
                            <p><strong>Difficulty:</strong> ${activity.difficulty}</p>
                            <p><strong>Price:</strong> ${activity.price}</p>
                            <p><strong>Season:</strong> ${activity.season}</p>
                        </div>
                        
                        <div class="field">
                            <div class="label">Customer Name:</div>
                            <div class="value">${userData.name}</div>
                        </div>
                        <div class="field">
                            <div class="label">Email:</div>
                            <div class="value">${userData.email}</div>
                        </div>
                        <div class="field">
                            <div class="label">Phone:</div>
                            <div class="value">${userData.phone || 'Not provided'}</div>
                        </div>
                        <div class="field">
                            <div class="label">Preferred Date:</div>
                            <div class="value">${userData.preferredDate || 'Not specified'}</div>
                        </div>
                        <div class="field">
                            <div class="label">Group Size:</div>
                            <div class="value">${userData.groupSize || 'Not specified'}</div>
                        </div>
                        <div class="field">
                            <div class="label">Special Requests:</div>
                            <div class="value">${userData.specialRequests || 'None'}</div>
                        </div>
                        <div class="field">
                            <div class="label">Submitted:</div>
                            <div class="value">${new Date().toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This booking inquiry was sent from the Kalavrita Guide PWA.</p>
                        <p>Reply directly to this email to respond to the customer.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    
    // Generate booking email text
    generateBookingEmailText(activity, userData) {
        return `
New Booking Inquiry - Kalavrita Guide PWA

Activity: ${activity.name}
Type: ${activity.type}
Duration: ${activity.duration}
Difficulty: ${activity.difficulty}
Price: ${activity.price}
Season: ${activity.season}

Customer Details:
Name: ${userData.name}
Email: ${userData.email}
Phone: ${userData.phone || 'Not provided'}
Preferred Date: ${userData.preferredDate || 'Not specified'}
Group Size: ${userData.groupSize || 'Not specified'}
Special Requests: ${userData.specialRequests || 'None'}

Submitted: ${new Date().toLocaleString()}

---
This booking inquiry was sent from the Kalavrita Guide PWA.
Reply directly to this email to respond to the customer.
        `.trim();
    }
    
    // Get queue status
    getQueueStatus() {
        return {
            isOnline: this.isOnline,
            queueLength: this.offlineQueue.length,
            queuedEmails: this.offlineQueue.map(email => ({
                subject: email.subject,
                queuedAt: email.queuedAt,
                retryCount: email.retryCount || 0
            }))
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}
