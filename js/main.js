// Add interactivity here
document.addEventListener('DOMContentLoaded', function () {
    console.log('Website loaded!');
  
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  
    // Read More Functionality
    const readMoreBtn = document.getElementById('read-more-btn');
    const moreContent = document.getElementById('more-content');
  
    if (readMoreBtn && moreContent) {
      readMoreBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default behavior (if it's a link)
        if (moreContent.classList.contains('hidden')) {
          moreContent.classList.remove('hidden');
          readMoreBtn.textContent = 'Read Less';
        } else {
          moreContent.classList.add('hidden');
          readMoreBtn.textContent = 'Read More';
        }
      });
    }
  
    // // CTA Button Redirect (Optional)
    // const ctaButtons = document.querySelectorAll('.cta-button');
    // ctaButtons.forEach(button => {
    //   button.addEventListener('click', (e) => {
    //     e.preventDefault(); // Prevent default behavior (if it's a link)
    //     // Example: Redirect to the Join Us page
    //     window.location.href = 'join.html';
    //   });
    // });
  
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
  
        // Get the target section ID from the href attribute
        const targetId = link.getAttribute('href').substring(1); // Remove the #
        const targetSection = document.getElementById(targetId);
  
        if (targetSection) {
          // Scroll to the target section smoothly
          targetSection.scrollIntoView({ behavior: 'smooth' });
  
          // Update active link
          document.querySelectorAll('.nav-links a').forEach(navLink => {
            navLink.classList.remove('active');
          });
          link.classList.add('active');
        }
      });
    });
  
    // Highlight Active Section on Scroll
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-links a');
  
      let currentSection = '';
  
      // Find the section currently in view
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute('id');
        }
      });
  
      // Highlight the corresponding navigation link
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
          link.classList.add('active');
        }
      });
    });
  });