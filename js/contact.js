/**
 * Contact Form with EmailJS Integration
 * Includes comprehensive validation, error handling, and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS
  const isEmailJSReady = initializeEmailJS();
  
  // Set up form submission if EmailJS initialized successfully
  if (isEmailJSReady) {
    setupContactForm();
  } else {
    showServiceError();
  }

  // Set up back-to-top button
  setupBackToTopButton();
});

// Initialize EmailJS with error handling
function initializeEmailJS() {
  try {
    emailjs.init('KBr4yJBL_daNLGEYG');
    console.log('EmailJS initialized successfully');
    return true;
  } catch (error) {
    console.error('EmailJS initialization failed:', error);
    return false;
  }
}

// Display service error message
function showServiceError() {
  const form = document.querySelector('.contact form');
  if (form) {
    form.insertAdjacentHTML('beforeend', 
      '<div class="error-message visible">Email service not available. Please contact us directly.</div>');
  }
}

// Set up contact form with all event handlers
function setupContactForm() {
  const form = document.querySelector('.contact form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Form elements
    const elements = getFormElements(form);
    
    // Clear previous errors
    clearErrors(form);

    // Validate form
    if (!validateForm(elements)) return;

    // Prepare submission
    setLoadingState(elements, true);

    try {
      const response = await submitForm(elements);
      handleSuccess(form, elements);
    } catch (error) {
      console.error('Submission Error:', error);
      handleError(form, error);
    } finally {
      setLoadingState(elements, false);
    }
  });
}

// Get all form elements
function getFormElements(form) {
  return {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    message: form.querySelector('#message'),
    spinner: form.querySelector('#loading-spinner'),
    successMsg: form.querySelector('#success-message'),
    submitBtn: form.querySelector('button[type="submit"]')
  };
}

// Validate form inputs
function validateForm({ name, email, message }) {
  let isValid = true;
  
  // Name validation
  if (!name.value.trim()) {
    showError(name, 'Please enter your name');
    isValid = false;
  }
  
  // Email validation
  const emailVal = email.value.trim();
  if (!emailVal) {
    showError(email, 'Please enter your email');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    showError(email, 'Please enter a valid email');
    isValid = false;
  }
  
  // Message validation
  const messageVal = message.value.trim();
  if (!messageVal) {
    showError(message, 'Please enter your message');
    isValid = false;
  } else if (messageVal.length < 10) {
    showError(message, 'Message should be at least 10 characters');
    isValid = false;
  }
  
  return isValid;
}

// Clear previous errors
function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => el.remove());
  form.querySelectorAll('.error-border').forEach(el => 
    el.classList.remove('error-border'));
}

// Show error message for a specific input
function showError(input, message) {
  if (input) {
    input.classList.add('error-border');
    input.insertAdjacentHTML('afterend', 
      `<div class="error">${message}</div>`);
    animateShake(input);
  } else {
    const form = document.querySelector('.contact form');
    form.insertAdjacentHTML('afterbegin',
      `<div class="error-message visible">${message}</div>`);
  }
}

// Animate element with shake effect
function animateShake(element) {
  element.style.animation = 'shake 0.5s ease';
  setTimeout(() => element.style.animation = '', 500);
}

// Set loading state
function setLoadingState(elements, isLoading) {
  if (isLoading) {
    elements.spinner.classList.add('visible');
    elements.submitBtn.disabled = true;
  } else {
    elements.spinner.classList.remove('visible');
    elements.submitBtn.disabled = false;
  }
}

// Submit form via EmailJS
async function submitForm({ name, email, message }) {
  return await emailjs.send(
    'service_jz5gxtt', // Your service ID
    'template_ieb8urp', // Your template ID
    {
      from_name: name.value.trim(),
      from_email: email.value.trim(),
      message: message.value.trim()
    }
  );
}

// Handle successful submission
function handleSuccess(form, { successMsg }) {
  form.reset();
  successMsg.classList.add('visible');
  setTimeout(() => successMsg.classList.remove('visible'), 5000);
}

// Handle submission errors
function handleError(form, error) {
  let errorMsg = 'Failed to send message. Please try again later.';
  
  if (error.status === 0) {
    errorMsg = 'Network error. Please check your connection.';
  } else if (error.text) {
    errorMsg = error.text;
  }
  
  showError(null, errorMsg);
  animateShake(form);
}

// Back to Top Button functionality
function setupBackToTopButton() {
  const backToTopButton = document.getElementById('back-to-top');
  if (!backToTopButton) return;

  window.addEventListener('scroll', function() {
    backToTopButton.classList.toggle('visible', window.scrollY > 300);
  });

  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}