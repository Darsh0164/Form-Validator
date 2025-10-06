// Form Validator - Email & Password
// Comprehensive client-side validation with accessibility features

class FormValidator {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.submitBtn = document.getElementById('submitBtn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        // Modal elements
        this.successModal = document.getElementById('successModal');
        this.successModalOk = document.getElementById('successModalOk');
        this.successModalClose = document.getElementById('successModalClose');
        this.lastFocusedElement = null;
        
        // Validation state
        this.validationState = {
            email: false,
            password: false,
            confirmPassword: false
        };
        
        // Email regex pattern
        this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        // Password validation rules
        this.passwordRules = {
            length: { min: 8, regex: /.{8,}/ },
            uppercase: { regex: /[A-Z]/ },
            lowercase: { regex: /[a-z]/ },
            digit: { regex: /\d/ },
            special: { regex: /[!@#$%^&*(),.?":{}|<>]/ }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSubmitButton();
    }
    
    setupEventListeners() {
        // Email validation
        this.emailInput.addEventListener('input', () => this.validateEmail());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        
        // Password validation
        this.passwordInput.addEventListener('input', () => this.validatePassword());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.passwordInput.addEventListener('focus', () => this.showPasswordRules());
        
        // Confirm password validation
        this.confirmPasswordInput.addEventListener('input', () => this.validateConfirmPassword());
        this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
        
        // Password visibility toggles
        this.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility('password'));
        this.confirmPasswordToggle.addEventListener('click', () => this.togglePasswordVisibility('confirmPassword'));
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Prevent form submission on Enter if validation fails
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isFormValid()) {
                e.preventDefault();
                this.announceErrors();
            }
        });
        
        // Hide password rules when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.passwordInput.contains(e.target) && 
                !document.getElementById('password-rules').contains(e.target)) {
                this.hidePasswordRules();
            }
        });

        // Modal events
        if (this.successModal) {
            // OK and Close buttons
            this.successModalOk?.addEventListener('click', () => this.closeSuccessModal());
            this.successModalClose?.addEventListener('click', () => this.closeSuccessModal());
            // Overlay click to close (when clicking outside the dialog)
            this.successModal.addEventListener('click', (evt) => {
                if (evt.target === this.successModal) this.closeSuccessModal();
            });
            // ESC key to close
            document.addEventListener('keydown', (evt) => {
                if (evt.key === 'Escape' && this.isModalOpen()) {
                    this.closeSuccessModal();
                }
            });
        }
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        const fieldGroup = this.emailInput.closest('.field-group');
        
        // Clear previous states
        this.clearFieldState(fieldGroup);
        
        if (email === '') {
            this.showError(errorElement, fieldGroup, 'Email address is required');
            this.validationState.email = false;
        } else if (!this.emailRegex.test(email)) {
            this.showError(errorElement, fieldGroup, 'Please enter a valid email address');
            this.validationState.email = false;
        } else {
            this.showSuccess(fieldGroup);
            this.validationState.email = true;
        }
        
        this.updateSubmitButton();
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        const errorElement = document.getElementById('password-error');
        const fieldGroup = this.passwordInput.closest('.field-group');
        const passwordRulesEl = document.getElementById('password-rules');
        const successEl = document.getElementById('password-success');
        
        // Clear previous states
        this.clearFieldState(fieldGroup);
        
        let isValid = true;
        let failedRules = [];
        
        // Check each password rule
        Object.keys(this.passwordRules).forEach(rule => {
            const ruleElement = document.querySelector(`[data-rule="${rule}"]`);
            const ruleConfig = this.passwordRules[rule];
            let isRuleValid = false;
            
            if (rule === 'length') {
                isRuleValid = password.length >= ruleConfig.min;
            } else {
                isRuleValid = ruleConfig.regex.test(password);
            }
            
            // Update rule visual state
            if (isRuleValid) {
                ruleElement.classList.add('valid');
                ruleElement.classList.remove('invalid');
                ruleElement.querySelector('.rule-icon').textContent = '✅';
            } else {
                ruleElement.classList.add('invalid');
                ruleElement.classList.remove('valid');
                ruleElement.querySelector('.rule-icon').textContent = '❌';
                failedRules.push(rule);
                isValid = false;
            }
        });
        
        if (password === '') {
            this.showError(errorElement, fieldGroup, 'Password is required');
            this.validationState.password = false;
            // Hide rules and success when empty
            passwordRulesEl.classList.remove('show');
            if (successEl) { successEl.textContent = ''; successEl.classList.remove('show'); }
        } else if (!isValid) {
            // Show rules while user is typing and requirements are not met
            passwordRulesEl.classList.add('show');
            // Clear any previous success message
            if (successEl) { successEl.textContent = ''; successEl.classList.remove('show'); }
            // Don't show error message, let the visual rules handle the feedback
            this.validationState.password = false;
        } else {
            this.showSuccess(fieldGroup);
            this.validationState.password = true;
            // Hide the rules immediately and show a green success message
            passwordRulesEl.classList.remove('show');
            if (successEl) {
                successEl.textContent = 'Password requirements satisfied';
                successEl.classList.add('show');
            }
        }
        
        // Re-validate confirm password if password changed
        if (this.confirmPasswordInput.value) {
            this.validateConfirmPassword();
        }
        
        this.updateSubmitButton();
    }
    
    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const errorElement = document.getElementById('confirm-password-error');
        const fieldGroup = this.confirmPasswordInput.closest('.field-group');
        
        // Clear previous states
        this.clearFieldState(fieldGroup);
        
        if (confirmPassword === '') {
            this.showError(errorElement, fieldGroup, 'Please confirm your password');
            this.validationState.confirmPassword = false;
        } else if (password !== confirmPassword) {
            this.showError(errorElement, fieldGroup, 'Passwords do not match');
            this.validationState.confirmPassword = false;
        } else {
            this.showSuccess(fieldGroup);
            this.validationState.confirmPassword = true;
        }
        
        this.updateSubmitButton();
    }
    
    togglePasswordVisibility(fieldType) {
        const input = fieldType === 'password' ? this.passwordInput : this.confirmPasswordInput;
        const toggle = fieldType === 'password' ? this.passwordToggle : this.confirmPasswordToggle;
        
        if (input.type === 'password') {
            input.type = 'text';
            toggle.textContent = '🙈';
            toggle.setAttribute('aria-label', 'Hide password');
        } else {
            input.type = 'password';
            toggle.textContent = '👁️';
            toggle.setAttribute('aria-label', 'Show password');
        }
    }
    
    showPasswordRules() {
        const passwordRules = document.getElementById('password-rules');
        passwordRules.classList.add('show');
    }
    
    hidePasswordRules() {
        const passwordRules = document.getElementById('password-rules');
        passwordRules.classList.remove('show');
    }
    
    showPasswordSuccessMessage() {
        const passwordRules = document.getElementById('password-rules');
        const h3 = passwordRules.querySelector('h3');
        const originalText = h3.textContent;
        
        // Change the header text to success message
        h3.textContent = '✅ Password Requirements Satisfied!';
        h3.style.color = '#38a169';
        h3.style.fontWeight = '800';
        h3.style.textShadow = '0 2px 4px rgba(56, 161, 105, 0.3)';
        
        // Hide all the individual rules
        const rules = passwordRules.querySelectorAll('.rule');
        rules.forEach(rule => {
            rule.style.display = 'none';
        });
        
        // Restore original state after hiding
        setTimeout(() => {
            h3.textContent = originalText;
            h3.style.color = '';
            h3.style.fontWeight = '';
            h3.style.textShadow = '';
            rules.forEach(rule => {
                rule.style.display = '';
            });
        }, 1500);
    }
    
    showError(errorElement, fieldGroup, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        fieldGroup.classList.add('error');
        fieldGroup.classList.remove('valid');
    }
    
    showSuccess(fieldGroup) {
        fieldGroup.classList.add('valid');
        fieldGroup.classList.remove('error');
        const errorElement = fieldGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    clearFieldState(fieldGroup) {
        fieldGroup.classList.remove('valid', 'error');
        const errorElement = fieldGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    updateSubmitButton() {
        const isValid = this.isFormValid();
        this.submitBtn.disabled = !isValid;
        
        if (isValid) {
            this.submitBtn.setAttribute('aria-label', 'Submit form - all fields are valid');
        } else {
            this.submitBtn.setAttribute('aria-label', 'Submit form - please fix validation errors first');
        }
    }
    
    isFormValid() {
        return Object.values(this.validationState).every(state => state === true);
    }
    
    announceErrors() {
        const errors = [];
        
        if (!this.validationState.email) {
            const emailError = document.getElementById('email-error');
            if (emailError.textContent) {
                errors.push(`Email: ${emailError.textContent}`);
            }
        }
        
        if (!this.validationState.password) {
            const passwordError = document.getElementById('password-error');
            if (passwordError.textContent) {
                errors.push(`Password: ${passwordError.textContent}`);
            }
        }
        
        if (!this.validationState.confirmPassword) {
            const confirmError = document.getElementById('confirm-password-error');
            if (confirmError.textContent) {
                errors.push(`Confirm Password: ${confirmError.textContent}`);
            }
        }
        
        if (errors.length > 0) {
            // Create or update aria-live region for error announcements
            let liveRegion = document.getElementById('error-announcements');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.id = 'error-announcements';
                liveRegion.setAttribute('aria-live', 'assertive');
                liveRegion.setAttribute('aria-atomic', 'true');
                liveRegion.className = 'sr-only';
                document.body.appendChild(liveRegion);
            }
            
            liveRegion.textContent = `Form validation errors: ${errors.join(', ')}`;
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.isFormValid()) {
            this.announceErrors();
            return;
        }
        
        // Form is valid - simulate submission
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Registering...';
        
        // Simulate API call
        setTimeout(() => {
            // Show success modal instead of alert
            this.openSuccessModal();

            // Reset form
            this.form.reset();
            this.validationState = {
                email: false,
                password: false,
                confirmPassword: false
            };
            this.updateSubmitButton();
            this.submitBtn.textContent = 'Register';
            
            // Reset password rules visual state
            document.querySelectorAll('[data-rule]').forEach(rule => {
                rule.classList.remove('valid', 'invalid');
                rule.querySelector('.rule-icon').textContent = '❌';
            });
            
            // Hide password rules
            this.hidePasswordRules();
            
            // Reset password visibility
            this.passwordInput.type = 'password';
            this.confirmPasswordInput.type = 'password';
            this.passwordToggle.textContent = '👁️';
            this.confirmPasswordToggle.textContent = '👁️';
            
        }, 2000);
    }

    // Modal helpers
    openSuccessModal() {
        if (!this.successModal) return;
        // Save last focused element
        this.lastFocusedElement = document.activeElement;
        this.successModal.classList.add('show');
        this.successModal.setAttribute('aria-hidden', 'false');
        // Move focus to the primary action
        this.successModalOk?.focus();
        // Basic focus trap within modal
        const focusable = this.successModal.querySelectorAll('button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const trap = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        this._trapHandler = trap;
        this.successModal.addEventListener('keydown', trap);
    }

    closeSuccessModal() {
        if (!this.successModal) return;
        this.successModal.classList.remove('show');
        this.successModal.setAttribute('aria-hidden', 'true');
        if (this._trapHandler) {
            this.successModal.removeEventListener('keydown', this._trapHandler);
            this._trapHandler = null;
        }
        // Restore focus to the last focused element (typically the Submit button)
        this.lastFocusedElement?.focus();
    }

    isModalOpen() {
        return this.successModal && this.successModal.classList.contains('show');
    }
}

// Initialize the form validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
});

// Additional accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation support for password toggles
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
    
    // Add focus management for better UX
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.field-group').classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.closest('.field-group').classList.remove('focused');
        });
    });
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
