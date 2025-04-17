document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const form = document.getElementById('join-form');
    const howKnowSelect = document.getElementById('how-know');
    const othersSpecify = document.getElementById('others-specify');
    const isCatholicYes = document.getElementById('catholic-yes');
    const isCatholicNo = document.getElementById('catholic-no');
    const catholicDetails = document.getElementById('catholic-details');
    const successMessage = document.getElementById('success-message');
    const loader = document.querySelector('.loader'); // Use querySelector for consistency
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const backToTopButton = document.getElementById('back-to-top');
  
    // Hide the loader once the page is fully loaded
    if (loader) {
        loader.style.display = 'none'; // Use display: none to completely hide the loader
    }
  
    // Show/hide "Others (Specify)" field based on dropdown selection
    if (howKnowSelect && othersSpecify) {
        howKnowSelect.addEventListener('change', function () {
            othersSpecify.style.display = howKnowSelect.value === 'others' ? 'block' : 'none';
        });
    }
  
    // Show/hide Catholic-related questions based on radio button selection
    if (isCatholicYes && isCatholicNo && catholicDetails) {
        isCatholicYes.addEventListener('change', function () {
            catholicDetails.style.display = 'block';
        });
  
        isCatholicNo.addEventListener('change', function () {
            catholicDetails.style.display = 'none';
        });
    }
  
    // Handle form submission
    if (form && loader && successMessage) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission
  
            // Show the loader during form submission
            loader.style.display = 'flex';
  
            // Simulate form submission delay (e.g., API call or processing)
            setTimeout(function () {
                // Hide the loader after submission
                loader.style.display = 'none';
  
                // Show the success message
                successMessage.classList.remove('hidden');
  
                // Reset the form
                form.reset();
  
                // Hide the success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000); // 5 seconds
            }, 2000); // Simulate a 2-second delay for form submission
        });
    }
  
    // Hamburger menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }
  
    // Back-to-Top Button
    if (backToTopButton) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
  
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const form = document.getElementById('join-form');
    const loader = document.querySelector('.loader'); // Loader element
  
    // Hide the loader when the page loads
    if (loader) {
        loader.style.display = 'none'; // Ensure loader is hidden
    }
  
    // Handle form submission
    if (form && loader) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission
  
            // Show the loader during form submission
            loader.style.display = 'flex';
  
            // Simulate form submission delay (e.g., API call or processing)
            setTimeout(function () {
                // Hide the loader after submission
                loader.style.display = 'none';
  
                // Show the success message (if applicable)
                const successMessage = document.getElementById('success-message');
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                }
  
                // Reset the form
                form.reset();
  
                // Hide the success message after 5 seconds
                setTimeout(() => {
                    if (successMessage) {
                        successMessage.classList.add('hidden');
                    }
                }, 5000); // 5 seconds
            }, 2000); // Simulate a 2-second delay for form submission
        });
    }
  });