// Update the form submission script
document.querySelector('.contact form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill out all fields.');
    return;
  }

  if (!email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }

  // Show loading spinner
  document.getElementById('loading-spinner').classList.add('visible');

  // Simulate form submission delay
  setTimeout(() => {
    document.getElementById('loading-spinner').classList.remove('visible');
    document.getElementById('success-message').classList.add('visible');
    document.querySelector('.contact form').reset();

    // Hide success message after 3 seconds
    setTimeout(() => {
      document.getElementById('success-message').classList.remove('visible');
    }, 3000);
  }, 2000);
});

// Add this to your JavaScript file or <script> tag
window.addEventListener('scroll', function () {
  const backToTopButton = document.getElementById('back-to-top');
  if (window.scrollY > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

document.getElementById('back-to-top').addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});