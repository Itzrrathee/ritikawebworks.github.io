// RITIKA'S PORTFOLIO - JAVASCRIPT
// Handles all interactions, animations, and lead capture

// ═══════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimation();
    initProgressBar();
    initFormHandling();
    initChatbot();
    initBackToTop();
    preventChatbotDuplicate();
});

// ═══════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════

function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.problem-card, .service-card, .portfolio-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ═══════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════

function initProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', function() {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercentage + '%';
    });
}

// ═══════════════════════════════════════
// BACK TO TOP BUTTON
// ═══════════════════════════════════════

function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
}

// ═══════════════════════════════════════
// FORM HANDLING
// ═══════════════════════════════════════

function initFormHandling() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!name || !email || !service || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show success message
        showFormMessage('Thank you! I\'ll get back to you within 24 hours.', 'success');

        // Log the data (in production, send to backend)
        console.log('Form submitted:', {
            name: name,
            email: email,
            service: service,
            message: message,
            timestamp: new Date().toISOString()
        });

        // Store in localStorage for later
        storeLeadData({
            name: name,
            email: email,
            service: service,
            message: message,
            timestamp: new Date().toISOString()
        });

        // Reset form
        form.reset();
        
        // Clear message after 3 seconds
        setTimeout(function() {
            formMessage.style.display = 'none';
        }, 3000);
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function storeLeadData(data) {
    try {
        let leads = JSON.parse(localStorage.getItem('portfolioLeads')) || [];
        leads.push(data);
        localStorage.setItem('portfolioLeads', JSON.stringify(leads));
        console.log('Lead stored successfully. Total leads:', leads.length);
    } catch (error) {
        console.error('Error storing lead:', error);
    }
}

// ═══════════════════════════════════════
// CHATBOT
// ═══════════════════════════════════════

function initChatbot() {
    // Check if chatbot is already initialized
    if (window.chatbotInitialized) return;
    window.chatbotInitialized = true;

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatInput = document.getElementById('chatInput');

    // Toggle chatbot
    chatbotToggle.addEventListener('click', function() {
        if (chatbotWindow.classList.contains('open')) {
            chatbotWindow.classList.remove('open');
            chatbotToggle.classList.remove('open');
        } else {
            chatbotWindow.classList.add('open');
            chatbotToggle.classList.add('open');
            chatInput.focus();
        }
    });

    // Handle chat input
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            handleChatInput(e);
        }
    });
}

function handleChatInput(event) {
    event.preventDefault();
    const chatInput = document.getElementById('chatInput');
    const userMessage = chatInput.value.trim();

    if (!userMessage) return;

    // Add user message to chat
    addChatMessage(userMessage, 'user');
    chatInput.value = '';

    // Get bot response
    setTimeout(() => {
        const botResponse = getChatbotResponse(userMessage);
        addChatMessage(botResponse, 'bot');
    }, 300);
}

function addChatMessage(text, sender) {
    const chatMessages = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);

    // Auto scroll to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getChatbotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Website-related responses
    if (lowerMessage.includes('website') || lowerMessage.includes('web')) {
        return "Great! I build conversion-focused websites that help businesses get more leads. We can start with a discovery call to understand your goals. What's your business about?";
    }
    
    // Design-related responses
    if (lowerMessage.includes('design') || lowerMessage.includes('graphic')) {
        return "Perfect! I create custom graphics for social media, branding, and marketing. What type of design are you looking for?";
    }
    
    // Both services
    if (lowerMessage.includes('both')) {
        return "Excellent choice! A website combined with strong visuals is powerful. Let's create a complete online presence for you. Can I get your name and email to set up a call?";
    }
    
    // Budget/price questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
        return "Pricing depends on the project scope. A landing page starts at ₹2,999, full websites from ₹5,499. Let's discuss what you need in a quick call. Ready to chat?";
    }
    
    // Timeline questions
    if (lowerMessage.includes('how long') || lowerMessage.includes('timeline') || lowerMessage.includes('when')) {
        return "Most projects take 2-4 weeks depending on complexity. Landing pages are usually 2-3 weeks, full websites 3-4 weeks. Timeline works for you?";
    }
    
    // Email/contact attempt
    if (lowerMessage.includes('email') || lowerMessage.includes('contact')) {
        return "I'd love to hear more! You can fill out the contact form below or email me at ritika@example.com. Let's schedule a quick call to discuss your project.";
    }
    
    // Yes/ready responses
    if (lowerMessage.includes('yes') || lowerMessage.includes('ready') || lowerMessage.includes('go ahead')) {
        return "Awesome! Scroll down to the contact form and fill it out. I'll reach out within 24 hours to schedule a free discovery call. Looking forward to working with you!";
    }
    
    // Default responses
    if (userMessage.length < 3) {
        return "I didn't quite understand that. Are you looking for a website or design work?";
    }
    
    return "That's great! Can you tell me more about your project? Are you interested in a website, design, or both?";
}

function chatReply(type) {
    const messageMap = {
        'website': 'I need a website',
        'design': 'I need design work',
        'both': 'I need both website and design'
    };
    
    const message = messageMap[type];
    document.getElementById('chatInput').value = message;
    const chatInput = document.getElementById('chatInput');
    chatInput.value = message;
    
    // Simulate entering the message
    const event = new Event('keypress');
    event.key = 'Enter';
    handleChatInput(event);
}

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.getElementById('chatbotToggle');
    
    if (chatbotWindow.classList.contains('open')) {
        chatbotWindow.classList.remove('open');
        chatbotToggle.classList.remove('open');
    } else {
        chatbotWindow.classList.add('open');
        chatbotToggle.classList.add('open');
        document.getElementById('chatInput').focus();
    }
}

function closeChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.getElementById('chatbotToggle');
    chatbotWindow.classList.remove('open');
    chatbotToggle.classList.remove('open');
}

function preventChatbotDuplicate() {
    const chatbot = document.querySelector('.chatbot-container');
    if (document.querySelectorAll('.chatbot-container').length > 1) {
        const duplicates = document.querySelectorAll('.chatbot-container');
        for (let i = 1; i < duplicates.length; i++) {
            duplicates[i].remove();
        }
    }
}

// ═══════════════════════════════════════
// SMOOTH SCROLL FOR NAV LINKS
// ═══════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ═══════════════════════════════════════
// PORTFOLIO DATA STORAGE (optional backend)
// ═══════════════════════════════════════

function getAllLeads() {
    try {
        return JSON.parse(localStorage.getItem('portfolioLeads')) || [];
    } catch (error) {
        console.error('Error retrieving leads:', error);
        return [];
    }
}

function exportLeadsAsJSON() {
    const leads = getAllLeads();
    const dataStr = JSON.stringify(leads, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio_leads_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
}

// ═══════════════════════════════════════
// ANALYTICS TRACKING (optional)
// ═══════════════════════════════════════

function trackEvent(eventName, data) {
    console.log('Event tracked:', eventName, data);
    // In production, send to Google Analytics or similar
}

// Track CTA clicks
document.querySelectorAll('.cta-primary, .cta-secondary, .cta-large').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('CTA_Click', {
            buttonText: this.textContent,
            section: this.closest('section')?.className || 'unknown'
        });
    });
});

// Track form submissions
document.getElementById('contactForm')?.addEventListener('submit', function() {
    trackEvent('Form_Submit', {
        timestamp: new Date().toISOString()
    });
});

// Track chatbot interactions
window.addEventListener('chatbot_message_sent', function(e) {
    trackEvent('Chatbot_Interaction', {
        message: e.detail
    });
});

// ═══════════════════════════════════════
// HELPER FUNCTION FOR NOTES
// ═══════════════════════════════════════

console.log('%c RITIKA\'S PORTFOLIO', 'font-size: 20px; font-weight: bold; color: #00d4ff;');
console.log('Lead capture system initialized. View leads with: getAllLeads()');
console.log('Export leads as JSON with: exportLeadsAsJSON()');
