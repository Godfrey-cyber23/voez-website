// Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyBpPeaZRJvlOR-UDDrREE0Y-1osmyPP6yo",
      authDomain: "voice-of-ecclezia-zambia.firebaseapp.com",
      projectId: "voice-of-ecclezia-zambia",
      storageBucket: "voice-of-ecclezia-zambia.appspot.com",
      messagingSenderId: "865692602825",
      appId: "1:865692602825:web:96dddc980456517dd39818",
      measurementId: "G-2EJ2NDH2V4"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();

    document.addEventListener('DOMContentLoaded', function() {
      // Check authentication state
      auth.onAuthStateChanged(user => {
        if (user) {
          // User is signed in
          document.querySelector('.login-icon').className = 'fas fa-user-circle';
          document.querySelector('a[href="login.html"]').textContent = 'My Account';
        } else {
          // User is signed out
          document.querySelector('.login-icon').className = 'fas fa-sign-in-alt';
          document.querySelector('a[href="login.html"]').textContent = 'Login';
        }
      });

      // Mobile menu toggle
      const hamburger = document.querySelector('.hamburger');
      const nav = document.querySelector('nav ul');
      
      hamburger.addEventListener('click', function() {
        nav.classList.toggle('show');
      });

      // Dropdown menu functionality
      const hasDropdown = document.querySelector('.has-dropdown');
      const dropdownMenu = document.querySelector('.dropdown-menu');
      
      // Desktop hover functionality
      hasDropdown.addEventListener('mouseenter', function() {
        if (window.innerWidth > 768) {
          dropdownMenu.style.display = 'block';
        }
      });
      
      hasDropdown.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) {
          dropdownMenu.style.display = 'none';
        }
      });
      
      // Mobile click functionality
      hasDropdown.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdownMenu.classList.toggle('show');
        }
      });

      // Load announcements from Firestore
      const announcementsContainer = document.querySelector('.announcements-container');
      
      function loadAnnouncements(category = 'All') {
        announcementsContainer.innerHTML = '<div class="loading">Loading announcements...</div>';
        
        let query = db.collection('announcements')
                      .orderBy('date', 'desc')
                      .limit(6);
        
        if (category !== 'All') {
          query = query.where('category', '==', category);
        }
        
        query.get().then((querySnapshot) => {
          announcementsContainer.innerHTML = '';
          
          if (querySnapshot.empty) {
            announcementsContainer.innerHTML = '<div class="no-results">No announcements found</div>';
            return;
          }
          
          querySnapshot.forEach((doc) => {
            const announcement = doc.data();
            const announcementDate = announcement.date.toDate();
            const formattedDate = announcementDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            const announcementCard = document.createElement('div');
            announcementCard.className = 'announcement-card';
            announcementCard.innerHTML = `
              <div class="announcement-image-container">
                <img src="${announcement.imageUrl || 'https://i.postimg.cc/8z7vZ9Tz/choir-practice.jpg'}" alt="${announcement.title}" class="announcement-image">
              </div>
              <div class="announcement-content">
                <div class="announcement-date">
                  <i class="far fa-calendar-alt"></i> ${formattedDate}
                </div>
                <h3 class="announcement-title">${announcement.title}</h3>
                <p class="announcement-excerpt">${announcement.excerpt}</p>
                <a href="announcement-detail.html?id=${doc.id}" class="read-more">
                  Read more <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            `;
            
            announcementsContainer.appendChild(announcementCard);
          });
        }).catch((error) => {
          console.error("Error getting announcements: ", error);
          announcementsContainer.innerHTML = '<div class="error">Error loading announcements. Please try again later.</div>';
        });
      }

      // Category filter functionality
      const categoryBtns = document.querySelectorAll('.category-btn');
      
      categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          // Remove active class from all buttons
          categoryBtns.forEach(b => b.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // Load announcements for selected category
          loadAnnouncements(this.textContent.trim());
        });
      });

      // Pagination functionality
      const pageBtns = document.querySelectorAll('.page-btn');
      
      pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          // Remove active class from all buttons
          pageBtns.forEach(b => b.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // In a real implementation, you would load the appropriate page of announcements
          // For now, we'll just log which page was clicked
          console.log('Loading page', this.textContent);
        });
      });

      // Newsletter subscription form
      const subscribeForm = document.querySelector('.subscribe-form');
      
      subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('.subscribe-input');
        const email = emailInput.value.trim();
        
        if (email && validateEmail(email)) {
          // Add to Firestore subscriptions collection
          db.collection('subscriptions').add({
            email: email,
            subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
            active: true
          }).then(() => {
            alert(`Thank you for subscribing with ${email}! You'll receive our announcements.`);
            emailInput.value = '';
          }).catch((error) => {
            console.error("Error adding subscription: ", error);
            alert('There was an error processing your subscription. Please try again later.');
          });
        } else {
          alert('Please enter a valid email address');
        }
      });

      // Email validation helper
      function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      }

      // Back to top button
      const backToTopBtn = document.getElementById('back-to-top');
      
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTopBtn.style.display = 'block';
        } else {
          backToTopBtn.style.display = 'none';
        }
      });
      
      backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      // Load initial announcements
      loadAnnouncements();
    });