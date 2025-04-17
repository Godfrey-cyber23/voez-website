document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('joinForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const howKnowSelect = document.getElementById('howKnow');
    const otherSourceGroup = document.getElementById('otherSourceGroup');
    const isCatholicYes = document.getElementById('catholicYes');
    const isCatholicNo = document.getElementById('catholicNo');
    const catholicDetails = document.getElementById('catholicDetails');
    const successMessage = document.querySelector('.success-message');
    const loader = document.querySelector('.loader');
    
    let currentStep = 0;

    // Initialize form
    showStep(currentStep);
    updateProgressBar();

    // Conditional field handling
    if (howKnowSelect && otherSourceGroup) {
        howKnowSelect.addEventListener('change', function() {
            otherSourceGroup.style.display = howKnowSelect.value === 'other' ? 'block' : 'none';
            if (howKnowSelect.value !== 'other') {
                document.getElementById('otherSource').value = '';
            }
        });
    }

    if (isCatholicYes && isCatholicNo && catholicDetails) {
        isCatholicYes.addEventListener('change', function() {
            catholicDetails.style.display = 'block';
        });
        isCatholicNo.addEventListener('change', function() {
            catholicDetails.style.display = 'none';
            // Clear Catholic-specific fields when No is selected
            document.getElementById('parish').value = '';
            document.querySelectorAll('input[name="isBaptized"]').forEach(r => r.checked = false);
            document.querySelectorAll('input[name="isConfirmed"]').forEach(r => r.checked = false);
        });
    }

    // Form navigation
    function showStep(step) {
        steps.forEach((stepElement, index) => {
            stepElement.style.display = index === step ? 'block' : 'none';
        });
    }

    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= currentStep);
        });
    }

    // Enhanced validation
    function validateStep(step) {
        let isValid = true;
        const currentStepElement = steps[step];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        // Validate regular fields
        requiredFields.forEach(field => {
            if (field.type !== 'radio' && !field.value.trim()) {
                isValid = false;
                showError(field, `${field.labels?.[0]?.textContent?.replace('*', '') || 'This field'} is required`);
            }
        });

        // Validate radio groups
        const requiredRadios = currentStepElement.querySelectorAll('input[type="radio"][required]');
        const radioGroups = new Set(Array.from(requiredRadios).map(r => r.name));
        
        radioGroups.forEach(groupName => {
            const isChecked = document.querySelector(`input[name="${groupName}"]:checked`);
            if (!isChecked) {
                isValid = false;
                const firstRadio = document.querySelector(`input[name="${groupName}"]`);
                const container = firstRadio.closest('.radio-group') || firstRadio.closest('.form-group');
                showError(container, 'Please make a selection');
            }
        });

        // Special validation for Step 2 (Contact Information)
        if (step === 1) {
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (phone && !/^[\d\s\-+()]{10,}$/.test(phone)) {
                isValid = false;
                showError(document.getElementById('phone'), 'Please enter a valid phone number');
            }
            
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                isValid = false;
                showError(document.getElementById('email'), 'Please enter a valid email');
            }
            
            if (howKnowSelect.value === 'other' && !document.getElementById('otherSource').value.trim()) {
                isValid = false;
                showError(document.getElementById('otherSource'), 'Please specify how you heard about us');
            }
        }

        // Special validation for Step 3 (Faith Background)
        if (step === 2 && document.getElementById('catholicYes').checked) {
            const parish = document.getElementById('parish').value.trim();
            const isBaptized = document.querySelector('input[name="isBaptized"]:checked');
            const isConfirmed = document.querySelector('input[name="isConfirmed"]:checked');
            
            if (!parish) {
                isValid = false;
                showError(document.getElementById('parish'), 'Parish name is required');
            }
            if (!isBaptized) {
                isValid = false;
                showError(document.querySelector('input[name="isBaptized"]').closest('.form-group'), 
                          'Please select baptism status');
            }
            if (!isConfirmed) {
                isValid = false;
                showError(document.querySelector('input[name="isConfirmed"]').closest('.form-group'), 
                          'Please select confirmation status');
            }
        }

        return isValid;
    }

    function showError(element, message) {
        clearError(element);
        element.classList.add('error');
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        element.parentNode.insertBefore(errorMsg, element.nextSibling);
    }

    function clearError(element) {
        element.classList.remove('error');
        const errorMsg = element.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
    }

    // Navigation handlers
    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                currentStep = Math.min(currentStep + 1, steps.length - 1);
                showStep(currentStep);
                updateProgressBar();
                
                if (currentStep === steps.length - 1) {
                    updateReviewSections();
                }
                
                // Scroll to top of form
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            currentStep = Math.max(currentStep - 1, 0);
            showStep(currentStep);
            updateProgressBar();
        });
    });

    // Update review sections
    function updateReviewSections() {
        // Personal Information
        document.getElementById('reviewPersonal').innerHTML = `
            <p><strong>Name:</strong> ${document.getElementById('firstName').value} ${document.getElementById('middleName').value} ${document.getElementById('lastName').value}</p>
            <p><strong>Location:</strong> ${document.getElementById('location').value}</p>
            <p><strong>Occupation:</strong> ${document.getElementById('occupation').value}</p>
            <p><strong>Reason for Joining:</strong> ${document.getElementById('reason').value}</p>
        `;

        // Contact Information
        document.getElementById('reviewContact').innerHTML = `
            <p><strong>Phone:</strong> ${document.getElementById('phone').value}</p>
            <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
            <p><strong>How you heard about us:</strong> ${howKnowSelect.options[howKnowSelect.selectedIndex].text} 
            ${howKnowSelect.value === 'other' ? `(${document.getElementById('otherSource').value})` : ''}</p>
        `;

        // Faith Background
        const isCatholic = document.querySelector('input[name="isCatholic"]:checked');
        let faithData = `<p><strong>Catholic:</strong> ${isCatholic ? isCatholic.value === 'yes' ? 'Yes' : 'No' : 'Not specified'}</p>`;
        
        if (isCatholic && isCatholic.value === 'yes') {
            faithData += `
                <p><strong>Parish:</strong> ${document.getElementById('parish').value || 'Not specified'}</p>
                <p><strong>Baptized:</strong> ${document.querySelector('input[name="isBaptized"]:checked')?.value === 'yes' ? 'Yes' : 'No'}</p>
                <p><strong>Confirmed:</strong> ${document.querySelector('input[name="isConfirmed"]:checked')?.value === 'yes' ? 'Yes' : 'No'}</p>
            `;
        }
        document.getElementById('reviewFaith').innerHTML = faithData;
    }

    // Form submission with success popup
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                if (loader) loader.style.display = 'flex';
                
                // Simulate form submission
                setTimeout(() => {
                    if (loader) loader.style.display = 'none';
                    if (successMessage) {
                        // Hide the form
                        form.style.display = 'none';
                        
                        // Show the success popup
                        successMessage.style.display = 'block';
                        
                        // Scroll to the success message
                        successMessage.scrollIntoView({ behavior: 'smooth' });
                        
                        // Add click handler for the home button
                        const homeBtn = document.querySelector('.home-btn');
                        if (homeBtn) {
                            homeBtn.addEventListener('click', function() {
                                window.location.href = 'index.html';
                            });
                        }
                    }
                }, 2000);
            } else {
                // If on review page but validation fails, go to first invalid step
                if (currentStep === steps.length - 1) {
                    for (let i = 0; i < steps.length - 1; i++) {
                        if (!validateStep(i)) {
                            currentStep = i;
                            showStep(currentStep);
                            updateProgressBar();
                            break;
                        }
                    }
                }
            }
        });
    }

    // Hide loader when page loads
    if (loader) {
        loader.style.display = 'none';
    }
});

// ===== Hamburger Menu =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('nav ul');
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    
    // Toggle icon
    const icon = hamburger.querySelector('i');
    if (hamburger.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
}

function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset icon
    const icon = hamburger.querySelector('i');
    icon.classList.replace('fa-times', 'fa-bars');
}

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            e.target !== hamburger) {
            closeMenu();
        }
    });

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!link.getAttribute('href').startsWith('#')) {
                closeMenu();
            }
        });
    });
};