// Gallery Module
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
      images: [
        { src: 'images/475303073_122236074788071248_2846064961964655974_n.jpg', alt: 'Choir performance', category: 'performance' },
        { src: 'images/image1.jpg', alt: 'Choir rehearsal', category: 'rehearsal' },
        { src: 'images/image3.jpg', alt: 'Community outreach', category: 'outreach' },
        { src: 'images/image10.jpg', alt: 'Recording session', category: 'recording' },

        { src: 'images/473611145_122231804882071248_4685746320694649629_n.jpg', alt: 'Choir performance', category: 'performance' },
        { src: 'images/image11.jpg', alt: 'Choir rehearsal', category: 'rehearsal' },
        { src: 'images/image17.jpg', alt: 'Community outreach', category: 'outreach' },
        { src: 'images/image18.jpg', alt: 'Recording session', category: 'recording' },
        { src: 'images/474514437_122234285102071248_8421769373482960238_n.jpg', alt: 'Choir performance', category: 'performance' },
        { src: 'images/image13.jpg', alt: 'Choir rehearsal', category: 'rehearsal' },
        { src: 'images/image14.jpg', alt: 'Community outreach', category: 'outreach' },
        { src: 'images/image15.jpg', alt: 'Recording session', category: 'recording' },
        { src: 'images/474516955_122234285138071248_3265399510076629322_n.jpg', alt: 'Choir performance', category: 'performance' },
        { src: 'images/image9.jpg', alt: 'Choir rehearsal', category: 'rehearsal' },
        { src: 'images/image11.jpg', alt: 'Community outreach', category: 'outreach' },
        { src: 'images/image12.jpg', alt: 'Recording session', category: 'recording' },
        { src: 'images/474518834_122234285096071248_2866490850819322362_n.jpg', alt: 'Choir performance', category: 'performance' },
        { src: 'images/image6.jpg', alt: 'Choir rehearsal', category: 'rehearsal' },
        { src: 'images/image7.jpg', alt: 'Community outreach', category: 'outreach' },
        { src: 'images/image8.jpg', alt: 'Recording session', category: 'recording' },
        { src: 'images/474524186_122234286980071248_3068999831950408324_n.jpg', alt: 'Choir performance', category: 'performance' },
        { src: 'images/image2.jpg', alt: 'Choir rehearsal', category: 'rehearsal' },
        { src: 'images/image4.jpg', alt: 'Community outreach', category: 'outreach' },
        { src: 'images/image5.jpg', alt: 'Recording session', category: 'recording' },
        // Additional images can be loaded dynamically
      ],
      itemsPerLoad: 4,
      animationDuration: 400,
      lightboxBgOpacity: 0.95
    };
  
    // DOM Elements
    const gallerySection = document.getElementById('gallery');
    const galleryGrid = gallerySection.querySelector('.gallery-grid');
    const viewMoreBtn = gallerySection.querySelector('.btn-primary');
    let loadedImages = 0;
  
    // Initialize Lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.transition = `opacity ${config.animationDuration}ms ease`;
    lightbox.innerHTML = `
      <span class="close-lightbox" aria-label="Close lightbox">&times;</span>
      <div class="lightbox-content"></div>
      <div class="lightbox-caption"></div>
      <button class="lightbox-nav prev" aria-label="Previous image">&#10094;</button>
      <button class="lightbox-nav next" aria-label="Next image">&#10095;</button>
    `;
    document.body.appendChild(lightbox);
  
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeLightbox = lightbox.querySelector('.close-lightbox');
    const prevButton = lightbox.querySelector('.prev');
    const nextButton = lightbox.querySelector('.next');
  
    // State Management
    let currentImageIndex = 0;
    let isLightboxOpen = false;
    let touchStartX = 0;
    let touchEndX = 0;
  
    // Initialize Gallery
    function initGallery() {
      // Clear existing content (if any)
      galleryGrid.innerHTML = '';
      loadedImages = 0;
      
      // Load initial set of images
      loadMoreImages();
      
      // Set up event listeners
      setupEventListeners();
    }
  
    // Load More Images
    function loadMoreImages() {
      const fragment = document.createDocumentFragment();
      const endIndex = Math.min(loadedImages + config.itemsPerLoad, config.images.length);
      
      for (let i = loadedImages; i < endIndex; i++) {
        const imgData = config.images[i];
        const imgElement = createGalleryImage(imgData, i);
        fragment.appendChild(imgElement);
      }
      
      galleryGrid.appendChild(fragment);
      loadedImages = endIndex;
      
      // Hide "View More" button if all images are loaded
      if (loadedImages >= config.images.length) {
        viewMoreBtn.style.display = 'none';
      }
    }
  
    // Create Gallery Image Element
    function createGalleryImage(imgData, index) {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'gallery-item';
      imgContainer.setAttribute('data-index', index);
      imgContainer.setAttribute('role', 'button');
      imgContainer.setAttribute('tabindex', '0');
      imgContainer.setAttribute('aria-label', `View image: ${imgData.alt}`);
      
      const imgElement = document.createElement('img');
      imgElement.src = imgData.src;
      imgElement.alt = imgData.alt;
      imgElement.loading = 'lazy';
      imgElement.decoding = 'async';
      
      imgContainer.appendChild(imgElement);
      return imgContainer;
    }
  
    // Setup Event Listeners
    function setupEventListeners() {
      // Gallery item clicks
      galleryGrid.addEventListener('click', function(e) {
        const item = e.target.closest('.gallery-item');
        if (item) {
          openLightbox(parseInt(item.getAttribute('data-index')));
        }
      });
  
      // Keyboard navigation for gallery items
      galleryGrid.addEventListener('keydown', function(e) {
        const item = e.target.closest('.gallery-item');
        if (item && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          openLightbox(parseInt(item.getAttribute('data-index')));
        }
      });
  
      // View More button
      viewMoreBtn.addEventListener('click', function() {
        loadMoreImages();
        
        // Smooth scroll to newly loaded items
        const newItems = galleryGrid.querySelectorAll(`.gallery-item:nth-child(n+${loadedImages - config.itemsPerLoad + 1})`);
        if (newItems.length > 0) {
          newItems[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
  
      // Lightbox controls
      closeLightbox.addEventListener('click', closeLightboxHandler);
      prevButton.addEventListener('click', showPrevImage);
      nextButton.addEventListener('click', showNextImage);
      
      // Keyboard navigation in lightbox
      lightbox.addEventListener('keydown', function(e) {
        if (!isLightboxOpen) return;
        
        switch (e.key) {
          case 'Escape':
            closeLightboxHandler();
            break;
          case 'ArrowLeft':
            showPrevImage();
            break;
          case 'ArrowRight':
            showNextImage();
            break;
        }
      });
      
      // Touch events for mobile swipe
      lightboxContent.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      lightboxContent.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }
  
    // Lightbox Functions
    function openLightbox(index) {
      currentImageIndex = index;
      updateLightboxContent();
      
      lightbox.style.opacity = '0';
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Trigger reflow
      void lightbox.offsetHeight;
      
      lightbox.style.opacity = '1';
      isLightboxOpen = true;
      
      // Focus the close button for keyboard users
      closeLightbox.focus();
    }
  
    function closeLightboxHandler() {
      lightbox.style.opacity = '0';
      
      setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        isLightboxOpen = false;
      }, config.animationDuration);
    }
  
    function updateLightboxContent() {
      const imgData = config.images[currentImageIndex];
      
      lightboxContent.innerHTML = `
        <img src="${imgData.src}" alt="${imgData.alt}" loading="eager">
      `;
      lightboxCaption.textContent = imgData.alt;
      
      // Update nav button states
      prevButton.style.visibility = currentImageIndex > 0 ? 'visible' : 'hidden';
      nextButton.style.visibility = currentImageIndex < config.images.length - 1 ? 'visible' : 'hidden';
    }
  
    function showPrevImage() {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxContent();
      }
    }
  
    function showNextImage() {
      if (currentImageIndex < config.images.length - 1) {
        currentImageIndex++;
        updateLightboxContent();
      }
    }
  
    function handleSwipe() {
      const swipeThreshold = 50;
      const difference = touchStartX - touchEndX;
      
      if (difference > swipeThreshold) {
        showNextImage();
      } else if (difference < -swipeThreshold) {
        showPrevImage();
      }
    }
  
    // Initialize the gallery
    initGallery();
  
    // For demo purposes - in a real app, you might load images from an API
    console.log('Gallery initialized with', config.images.length, 'images');
  });

//   Events Section

document.addEventListener('DOMContentLoaded', function() {
    // Event details modal functionality
    const detailButtons = document.querySelectorAll('.event-card .btn-secondary');
    
    detailButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const eventCard = this.closest('.event-card');
        const eventTitle = eventCard.querySelector('h3').textContent;
        const eventLocation = eventCard.querySelector('p').textContent;
        const eventDate = `${eventCard.querySelector('.month').textContent} ${eventCard.querySelector('.day').textContent}`;
        
        // In a real implementation, you would show a modal with event details
        // Here's a simple alert as an example:
        alert(`Event Details:\n\n${eventTitle}\nDate: ${eventDate}\nLocation: ${eventLocation}`);
        
        // For a real implementation, you might use:
        // showEventModal(eventTitle, eventDate, eventLocation, eventDescription);
      });
    });
    
    // Example of how you might implement a modal function
    function showEventModal(title, date, location, description) {
      // You would create and show a modal here
      console.log(`Showing modal for: ${title}`);
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatContainer = document.querySelector('.chat-container');
    
    // Toggle chat visibility
    chatToggle.addEventListener('click', function() {
      chatContainer.classList.toggle('hidden');
      this.setAttribute('aria-expanded', chatContainer.classList.contains('hidden') ? 'false' : 'true');
    });
    
    // Close chat when clicking the close button
    const closeChat = document.querySelector('.close-chat');
    closeChat.addEventListener('click', function(e) {
      e.stopPropagation();
      chatContainer.classList.add('hidden');
      chatToggle.setAttribute('aria-expanded', 'false');
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!chatContainer.contains(e.target) && e.target !== chatToggle) {
        chatContainer.classList.add('hidden');
        chatToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });