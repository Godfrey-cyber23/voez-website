
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded!');

  // ===== Hamburger Menu Toggle =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('nav ul');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  // Toggle menu function
  function toggleMenu() {
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }

  // Close menu function
  function closeMenu() {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent event from bubbling to document
    toggleMenu();
  });

  // Close when clicking anywhere outside the menu
  document.addEventListener('click', function(e) {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        e.target !== hamburger) {
      closeMenu();
    }
  });

  // Close when clicking on nav links
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
      // Only close if it's not an anchor link
      if (!link.getAttribute('href').startsWith('#')) {
        closeMenu();
      }
    });
  });

  // Read More Functionality
  const readMoreBtn = document.getElementById('read-more-btn');
  const moreContent = document.getElementById('more-content');

  if (readMoreBtn && moreContent) {
    readMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const isHidden = moreContent.classList.contains('hidden');
      moreContent.classList.toggle('hidden', !isHidden);
      readMoreBtn.textContent = isHidden ? 'Read Less' : 'Read More';
    });
  }

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = link.getAttribute('href');
      
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          // Close menu if mobile
          if (window.innerWidth <= 768) {
            closeMenu();
          }
          
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update active link
          document.querySelectorAll('nav a').forEach(navLink => {
            navLink.classList.remove('active');
          });
          link.classList.add('active');
        }
      }
    });
  });

  // Highlight Active Section on Scroll
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Debounce scroll event for performance
  let isScrolling;
  window.addEventListener('scroll', function() {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(highlightActiveSection, 100);
  });

  // Initialize
  highlightActiveSection();
});

// Example of dynamic content loading
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    fetch(`content/${targetId}.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('main-content').innerHTML = data;
      });
  });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

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


document.addEventListener('DOMContentLoaded', function () {
  const galleryTrack = document.querySelector('.gallery-track');

  // Person data with more realistic examples
  const personData = {
    'photo1.jpg': {
      name: 'Alex Johnson',
      description: 'Award-winning portrait photographer with exhibitions in 12 countries.',
      social: [
        { platform: 'instagram', url: 'https://instagram.com/alexphoto' },
        { platform: 'twitter', url: 'https://twitter.com/alexphoto' }
      ]
    },
    'photo2.jpg': {
      name: 'Maria Garcia',
      description: 'Wildlife photographer and conservationist specializing in African ecosystems.',
      social: [
        { platform: 'facebook', url: 'https://facebook.com/mariawildlife' },
        { platform: 'instagram', url: 'https://instagram.com/mariawildlife' }
      ]
    },
    'photo3.jpg': {
      name: 'James Wilson',
      description: 'Urban landscape photographer capturing city life around the world.',
      social: [
        { platform: 'instagram', url: 'https://instagram.com/jamesurban' },
        { platform: 'pinterest', url: 'https://pinterest.com/jamesurban' }
      ]
    }
    // Add more as needed
  };

  // Improved hover card creation
  const createHoverCard = (imageName) => {
    const data = personData[imageName] || {
      name: 'Featured Artist',
      description: 'Talented professional creating stunning visual experiences.',
      social: []
    };

    const card = document.createElement('div');
    card.className = 'image-hover-card';

    // Create social links with accessibility attributes
    const socialLinks = data.social.map(social => 
      `<a href="${social.url}" target="_blank" rel="noopener noreferrer" aria-label="${social.platform}">
        <i class="fab fa-${social.platform}"></i>
      </a>`
    ).join('');

    card.innerHTML = `
      <h3>${data.name}</h3>
      ${socialLinks ? `<div class="social-links">${socialLinks}</div>` : ''}
      <p>${data.description}</p>
      <button class="read-more-btn" aria-label="Learn more about ${data.name}">Read More</button>
    `;

    // Enhanced button handling
    const btn = card.querySelector('.read-more-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // In a real implementation, this would show more details
      showPersonDetails(data);
    });

    return card;
  };

  // Mock function for showing details (replace with your actual implementation)
  function showPersonDetails(person) {
    console.log('Showing details for:', person.name);
    // This would typically open a modal or navigate to a detail page
    alert(`Detailed view for ${person.name}\n\n${person.description}`);
  }

  // Improved image element creation
  const createImageElement = (src) => {
    const container = document.createElement('div');
    container.className = 'image-container';
    
    const img = document.createElement('img');
    img.src = `images/${src}`;
    img.alt = `Photography by ${personData[src]?.name || 'our team member'}`;
    img.loading = 'lazy'; // Add lazy loading

    const hoverCard = createHoverCard(src);
    
    container.append(img, hoverCard);
    return container;
  };

  // Enhanced image fetching with error handling
  const fetchImages = async () => {
    try {
      const response = await fetch('images/');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const text = await response.text();
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(text, 'text/html');

      return Array.from(htmlDocument.querySelectorAll('a'))
        .map(link => link.href.split('/').pop())
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    } catch (error) {
      console.error('Error fetching images:', error);
      // Fallback to known images if available
      return Object.keys(personData).length > 0 ? 
        Object.keys(personData) : 
        ['default1.jpg', 'default2.jpg'];
    }
  };

  // Initialize gallery with performance optimizations
  const initGallery = async () => {
    const images = await fetchImages();
    
    if (!images.length) {
      galleryTrack.innerHTML = '<p>No images available at this time.</p>';
      return;
    }

    // Create image elements in batches for better performance
    const fragment = document.createDocumentFragment();
    [...images, ...images].forEach(image => {
      fragment.appendChild(createImageElement(image));
    });
    galleryTrack.appendChild(fragment);

    // Calculate animation duration
    const itemWidth = 300 + 20; // width + margin-right
    const totalWidth = images.length * 2 * itemWidth;
    galleryTrack.style.animationDuration = `${totalWidth / 1000}s`;
  };

  initGallery();
});

// Welcome Message
const welcomeText = "WELCOME TO VOICE OF ECCLEZIA ZAMBIA"; // Welcome message
const welcomeElement = document.getElementById("welcome-text");
let welcomeIndex = 0;

// Main Text
const mainText = "EᐯᗩᑎGEᒪIZᗩTIOᑎ TᕼᖇOᑌGᕼ ᑕᗩTᕼOᒪIᑕ ᗰᑌSIᑕ"; // Main text
const typingText = document.getElementById("typing-text");
let mainIndex = 0;
let isDeleting = false;

// Cursor Element
const cursor = document.querySelector(".cursor");

// Function to type the welcome message
function typeWelcome() {
  if (welcomeIndex < welcomeText.length) {
    welcomeElement.textContent += welcomeText.charAt(welcomeIndex); // Add one character at a time
    welcomeIndex++;
    setTimeout(typeWelcome, 100); // Typing speed (100ms per character)
  } else {
    // Move the cursor to the main text
    moveCursor(typingText);
    // Start typing the main text after the welcome message is complete
    setTimeout(typeMain, 2000); // Pause before starting the main text
  }
}

// Function to type the main text
function typeMain() {
  const currentText = mainText.substring(0, mainIndex); // Get the current text to display

  typingText.textContent = currentText; // Update the text content

  if (!isDeleting) {
    // Typing phase
    mainIndex++;
    if (mainIndex > mainText.length) {
      isDeleting = true; // Switch to deleting phase
      setTimeout(typeMain, 1000); // Pause before deleting
    } else {
      setTimeout(typeMain, 60); // Typing speed (100ms per character)
    }
  } else {
    // Deleting phase
    mainIndex--;
    if (mainIndex === 0) {
      isDeleting = false; // Switch back to typing phase
      setTimeout(typeMain, 50); // Pause before typing again
    } else {
      setTimeout(typeMain, 50); // Deleting speed (50ms per character)
    }
  }
}

// Function to move the cursor
function moveCursor(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  cursor.style.top = `${rect.top + window.scrollY}px`; // Position the cursor vertically
  cursor.style.left = `${rect.right + window.scrollX}px`; // Position the cursor horizontally
}

// Start the typing effects
typeWelcome();


/** Loader for music**/
function fetchMusicData() {
  const musicGrid = document.querySelector('.music-grid');
  const loader = document.querySelector('.music .loader');

  // Show loader
  loader.style.display = 'block';

  // Simulate data fetching
  setTimeout(() => {
    // Hide loader after data is fetched
    loader.style.display = 'none';

    // Insert fetched data into the music grid
    musicGrid.innerHTML = `
      <div class="music-card fade-in">
        <img src="images/album1.jpg" alt="Album 1">
        <h3>Album 1</h3>
        <p>Experience the soulful melodies of our first album.</p>
        <a href="music.html" class="cta-button">Listen Now</a>
      </div>
      <div class="music-card fade-in">
        <img src="images/album2.jpg" alt="Album 2">
        <h3>Album 2</h3>
        <p>Discover the uplifting rhythms of our second album.</p>
        <a href="music.html" class="cta-button">Listen Now</a>
      </div>
    `;
  }, 2000); // Simulate a 2-second delay for fetching data
}

// Call the function to fetch music data
fetchMusicData();


// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('nav ul');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Change icon
      const icon = this.querySelector('i');
      if (this.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
});