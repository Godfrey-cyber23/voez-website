// Add interactivity here
document.addEventListener('DOMContentLoaded', function () {
    console.log('Website loaded!');
  
    
    // ===== Hamburger Menu Toggle =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('nav ul');
    const overlay = document.createElement('div'); // Create overlay dynamically
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : ''; // Prevent scrolling when menu is open
    });

    // Close menu when clicking overlay or links
    overlay.addEventListener('click', () => {
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    document.querySelectorAll('nav ul li a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
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

  // Function to fetch all images from the images folder
  const fetchImages = async () => {
    try {
      // Fetch the list of files in the images folder
      const response = await fetch('images/');
      const text = await response.text();
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(text, 'text/html');

      // Extract image file names
      const imageFiles = Array.from(htmlDocument.querySelectorAll('a'))
        .map((link) => link.href.split('/').pop())
        .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file)); // Filter only image files

      return imageFiles;
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };

  // Function to create image elements
  const createImageElement = (src) => {
    const img = document.createElement('img');
    img.src = `images/${src}`;
    img.alt = `Gallery Image`;
    return img;
  };

  // Load images and initialize the gallery
  fetchImages().then((images) => {
    if (images.length === 0) {
      console.warn('No images found in the images folder.');
      return;
    }

    // Duplicate the images to create an infinite loop effect
    const duplicatedImages = [...images, ...images];

    // Append images to the gallery track
    duplicatedImages.forEach((image) => {
      galleryTrack.appendChild(createImageElement(image));
    });

    // Adjust the animation duration based on the number of images
    const totalImages = duplicatedImages.length;
    const imageWidth = 300; // Width of each image (matches CSS)
    const gap = 20; // Gap between images (matches CSS)
    const totalWidth = totalImages * (imageWidth + gap); // Total width of the track

    // Adjust the divisor to control the speed (smaller divisor = faster)
    const speedMultiplier = 1000; // Increase this value to slow down, decrease to speed up
    const animationDuration = totalWidth / speedMultiplier; // Adjust speed (pixels per second)

    // Apply the animation duration dynamically
    galleryTrack.style.animationDuration = `${animationDuration}s`;
  });
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
    setTimeout(typeWelcome, 200); // Typing speed (100ms per character)
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
      setTimeout(typeMain, 2000); // Pause before deleting
    } else {
      setTimeout(typeMain, 200); // Typing speed (100ms per character)
    }
  } else {
    // Deleting phase
    mainIndex--;
    if (mainIndex === 0) {
      isDeleting = false; // Switch back to typing phase
      setTimeout(typeMain, 500); // Pause before typing again
    } else {
      setTimeout(typeMain, 150); // Deleting speed (50ms per character)
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

// Hamburger menu functionality
document.querySelector('.hamburger').addEventListener('click', function() {
  document.querySelector('nav ul').classList.toggle('active');
});

// Close menu when clicking on a link (for mobile)
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('nav ul').classList.remove('active');
  });
});