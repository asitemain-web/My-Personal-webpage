// Contact form and messages
const MESSAGES_KEY = 'fa-personal-site-messages';
const messagesList = document.getElementById('messagesList');
const contactForm = document.getElementById('contactForm');

// Contact cards rendering
function renderContactCards() {
    const contactCardsContainer = document.querySelector('.contact-cards');
    if (!contactCardsContainer || !contactData) return;

    contactCardsContainer.innerHTML = contactData.map(contact => {
        const isEmail = contact.link.startsWith('mailto:');
        const pointerEventsStyle = isEmail ? 'style="pointer-events: none;"' : '';
        const displayStyle = isEmail ? 'style="text-decoration: none; display: block;"' : 'style="text-decoration: none;"';
        const targetAttr = isEmail ? '' : 'target="_blank" rel="noopener"';
        
        return `
            <a class="contact-card" href="${contact.link}" ${targetAttr} ${displayStyle}>
                <div class="contact-card-header" ${pointerEventsStyle}>
                    <div class="contact-icon" ${pointerEventsStyle}>
                        <img src="${contact.icon}" alt="${contact.iconAlt}" ${pointerEventsStyle}>
                    </div>
                    <h3 ${pointerEventsStyle}>${contact.name}</h3>
                </div>
                <p ${pointerEventsStyle}>${contact.username}</p>
            </a>
        `;
    }).join('');
}

function loadMessages() {
    try {
        const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
        displayMessages(messages);
    } catch (error) {
        console.error('Error loading messages:', error);
        displayMessages([]);
    }
}

function displayMessages(messages) {
    if (!messagesList) return;
    const messagesDisplay = document.querySelector('.messages-display');
    
    if (messages.length === 0) {
        if (messagesDisplay) {
            messagesDisplay.style.display = 'none';
        }
        return;
    }
    
    if (messagesDisplay) {
        messagesDisplay.style.display = 'block';
    }
    
    const sortedMessages = messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    messagesList.innerHTML = sortedMessages.map(message => `
        <div class="message-item" data-message-id="${message.id}">
            <div class="message-header">
                <div>
                    <div class="message-name">${escapeHtml(message.fullName)}</div>
                    <a href="mailto:${escapeHtml(message.email)}" class="message-email">${escapeHtml(message.email)}</a>
                </div>
                <div class="message-header-right">
                    <div class="message-time">${formatTime(message.timestamp)}</div>
                    <div class="message-actions">
                        <button class="btn-edit" onclick="editMessage('${message.id}')" title="ویرایش پیام">
                            <img src="icon/edit.svg" alt="ویرایش">
                        </button>
                        <button class="btn-remove" onclick="removeMessage('${message.id}')" title="حذف پیام">
                            <img src="icon/cross.svg" alt="حذف">
                        </button>
                    </div>
                </div>
            </div>
            <div class="message-content">
                ${escapeHtml(message.message)}
            </div>
        </div>
    `).join('');
}

function saveMessage(messageData) {
    try {
        const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
        const existingMessageIndex = messages.findIndex(msg => msg.email === messageData.email);
        
        if (existingMessageIndex !== -1) {
            messages[existingMessageIndex] = {
                ...messageData,
                timestamp: new Date().toISOString(),
                id: messages[existingMessageIndex].id
            };
        } else {
            messages.push({
                ...messageData,
                timestamp: new Date().toISOString(),
                id: Date.now() + Math.random()
            });
        }
        
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
        return { success: true, isUpdate: existingMessageIndex !== -1 };
    } catch (error) {
        console.error('Error saving message:', error);
        return { success: false, isUpdate: false };
    }
}

function removeMessage(messageId) {
    const modal = document.createElement('div');
    modal.className = 'remove-modal-overlay';
    modal.innerHTML = `
        <div class="remove-modal">
            <h3>تأیید حذف</h3>
            <p>آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟</p>
            <div class="modal-actions">
                <button class="btn-cancel" onclick="closeRemoveModal()">انصراف</button>
                <button class="btn-confirm-remove" onclick="confirmRemove('${messageId}')">بله، حذف کن</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    window.pendingRemoveId = messageId;
}

function closeRemoveModal() {
    const modal = document.querySelector('.remove-modal-overlay');
    if (modal) modal.remove();
    window.pendingRemoveId = null;
}

function confirmRemove(messageId) {
    try {
        const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
        const updatedMessages = messages.filter(msg => msg.id != messageId);
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
        loadMessages();
        closeRemoveModal();
    } catch (error) {
        console.error('Error removing message:', error);
    }
}

function editMessage(messageId) {
    try {
        const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
        const message = messages.find(msg => msg.id == messageId);
        
        if (message) {
            const messageItem = document.querySelector(`[data-message-id="${messageId}"]`);
            const messageContent = messageItem.querySelector('.message-content');
            
            messageContent.innerHTML = `
                <div class="edit-message-container">
                    <textarea class="edit-message-input" rows="4" placeholder="پیام خود را ویرایش کنید...">${escapeHtml(message.message)}</textarea>
                    <button class="btn-save-edit" onclick="saveEdit('${messageId}')" title="ذخیره تغییرات">
                        <img src="icon/tick.svg" alt="ذخیره">
                    </button>
                </div>
            `;
            
            const textarea = messageContent.querySelector('.edit-message-input');
            textarea.focus();
            textarea.select();
        }
    } catch (error) {
        console.error('Error editing message:', error);
    }
}

function saveEdit(messageId) {
    try {
        const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
        const messageIndex = messages.findIndex(msg => msg.id == messageId);
        
        if (messageIndex !== -1) {
            const messageItem = document.querySelector(`[data-message-id="${messageId}"]`);
            const textarea = messageItem.querySelector('.edit-message-input');
            const newMessage = textarea.value.trim();
            
            if (newMessage.length < 10) {
                showNotification('پیام باید حداقل ۱۰ کاراکتر باشد', 'warning');
                return;
            }
            
            messages[messageIndex].message = newMessage;
            messages[messageIndex].timestamp = new Date().toISOString();
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
            loadMessages();
        }
    } catch (error) {
        console.error('Error saving edit:', error);
    }
}

function showNotification(message, type = 'warning') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    const warningIcon = `<img src="icon/what.svg" alt="هشدار" />`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${warningIcon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="closeNotification()"><img src="icon/cross.svg" alt="بستن"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => closeNotification(), 5000);
}

function closeNotification() {
    const notification = document.querySelector('.notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }
}

// Expose functions to global scope for onclick handlers
window.removeMessage = removeMessage;
window.editMessage = editMessage;
window.saveEdit = saveEdit;
window.closeRemoveModal = closeRemoveModal;
window.confirmRemove = confirmRemove;
window.showNotification = showNotification;
window.closeNotification = closeNotification;

function initContact() {
    renderContactCards();
    loadMessages();
    
    if (!contactForm) return;
    
    const validationRules = {
        fullName: {
            required: true,
            minLength: 2,
            pattern: /^[\u0600-\u06FF\s]+$/,
            message: 'لطفا یک نام معتبر وارد کنید (فقط حروف فارسی و فاصله)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'لطفا یک ایمیل معتبر وارد کنید'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'لطفا یک پیام وارد کنید (حداقل ۱۰ کاراکتر)'
        }
    };
    
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = field?.closest('.form-group');
        
        if (!field || !errorElement || !formGroup) return true;
        
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        errorElement.textContent = '';
        
        if (rules.required && (!value || value.trim() === '')) {
            showFieldError(fieldName, 'این فیلد اجباری است');
            return false;
        }
        
        if (!value || value.trim() === '') return true;
        
        if (rules.minLength && value.trim().length < rules.minLength) {
            showFieldError(fieldName, 'پیام باید حداقل 10 کاراکتر باشد');
            return false;
        }
        
        if (rules.pattern && !rules.pattern.test(value.trim())) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        return true;
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = field?.closest('.form-group');
        
        if (formGroup) formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value);
            });
            
            field.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                const errorElement = document.getElementById(fieldName + 'Error');
                if (formGroup) formGroup.classList.remove('error');
                if (errorElement) errorElement.classList.remove('show');
            });
        }
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        let isValid = true;
        Object.keys(validationRules).forEach(fieldName => {
            if (!validateField(fieldName, data[fieldName])) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            const firstError = this.querySelector('.form-group.error input, .form-group.error textarea');
            if (firstError) firstError.focus();
            return;
        }
        
        submitForm(data);
    });
    
    function submitForm(data) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        
        const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
        const existingMessage = messages.find(msg => msg.email === data.email);
        
        if (existingMessage) {
            showNotification('یک پیام با این آدرس ایمیل قبلاً ثبت شده است. لطفاً از ایمیل دیگری استفاده کنید یا پیام قبلی را ویرایش کنید.', 'warning');
            return;
        }
        
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        setTimeout(() => {
            const result = saveMessage(data);
            
            if (result.success) {
                loadMessages();
                
                const subject = `تماس از پورتفولیو - ${data.fullName}`;
                const body = `نام: ${data.fullName}\nایمیل: ${data.email}\n\nپیام:\n${data.message}`;
                const mailtoLink = `mailto:a.site.main@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                window.location.href = mailtoLink;
                
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('success');
                    if (btnText) btnText.textContent = 'پیام ارسال شد!';
                }
                
                contactForm.reset();
                
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.classList.remove('success');
                        submitBtn.disabled = false;
                        if (btnText) btnText.textContent = 'ارسال پیام';
                    }
                }, 3000);
            } else {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
                showNotification('خطا در ثبت پیام. لطفا دوباره تلاش کنید.', 'warning');
            }
        }, 2000);
    }
}

