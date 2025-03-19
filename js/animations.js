// Add animation triggers here
document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('.fade-in, .slide-in');
    elements.forEach(element => {
      element.style.opacity = '0';
    });
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
  
    elements.forEach(element => {
      observer.observe(element);
    });
  });

  