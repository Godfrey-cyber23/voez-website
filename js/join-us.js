document.addEventListener('DOMContentLoaded', function () {
  // Get references to DOM elements
  const form = document.getElementById('join-form');
  const howKnowSelect = document.getElementById('how-know');
  const othersSpecify = document.getElementById('others-specify');
  const isCatholicYes = document.getElementById('catholic-yes');
  const isCatholicNo = document.getElementById('catholic-no');
  const catholicDetails = document.getElementById('catholic-details');
  const successMessage = document.getElementById('success-message');
  const loader = document.getElementById('loader');

  // Hide the loader once the page is fully loaded
  if (loader) {
      loader.style.display = 'none';
  }

  // Show/hide "Others (Specify)" field based on dropdown selection
  howKnowSelect.addEventListener('change', function () {
      if (howKnowSelect.value === 'others') {
          othersSpecify.style.display = 'block';
      } else {
          othersSpecify.style.display = 'none';
      }
  });

  // Show/hide Catholic-related questions based on radio button selection
  isCatholicYes.addEventListener('change', function () {
      catholicDetails.style.display = 'block';
  });

  isCatholicNo.addEventListener('change', function () {
      catholicDetails.style.display = 'none';
  });

  // Handle form submission
  form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission

      // Show the loader during form submission
      if (loader) {
          loader.style.display = 'block';
      }

      // Simulate form submission delay (e.g., API call or processing)
      setTimeout(function () {
          // Hide the loader after submission
          if (loader) {
              loader.style.display = 'none';
          }

          // Hide the form and show the success message
          form.style.display = 'none';
          successMessage.style.display = 'block';
      }, 2000); // Adjust the timeout as needed (2 seconds in this case)
  });
});