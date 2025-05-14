// Global variables
let currentUser = null;
let currentSection = 'dashboard';
let songs = [];
let categories = [];
let payments = [];
let users = [];
let currentPage = 1;
const itemsPerPage = 10;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sectionContents = document.querySelectorAll('.section-content');
const sidebarLinks = document.querySelectorAll('.sidebar-menu li a');
const logoutBtn = document.getElementById('logout');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    checkAuth();

    // Load initial data
    loadDashboardData();
    loadSongs();
    loadCategories();
    loadPayments();
    loadUsers();

    // Set up event listeners
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    // In a real app, you would check with your backend
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = 'login.html';
    } else {
        // Simulate getting user data
        currentUser = {
            id: 1,
            name: 'Admin User',
            email: 'admin@voez.com',
            role: 'admin'
        };
    }
}

// Load dashboard data
function loadDashboardData() {
    // Simulate API calls
    setTimeout(() => {
        document.getElementById('total-songs').textContent = '142';
        document.getElementById('premium-songs').textContent = '89';
        document.getElementById('total-revenue').textContent = '$1,245.50';

        // Recent songs
        const recentSongsHtml = `
                    <tr>
                        <td>Amazing Grace</td>
                        <td>General Worship</td>
                        <td><span class="status-badge status-published">Published</span></td>
                    </tr>
                    <tr>
                        <td>O Holy Night</td>
                        <td>Christmas</td>
                        <td><span class="status-badge status-published">Published</span></td>
                    </tr>
                    <tr>
                        <td>Kyrie Eleison</td>
                        <td>Kyrie & Gloria</td>
                        <td><span class="status-badge status-draft">Draft</span></td>
                    </tr>
                `;
        document.getElementById('recent-songs').innerHTML = recentSongsHtml;

        // Recent payments
        const recentPaymentsHtml = `
                    <tr>
                        <td>How Great Thou Art</td>
                        <td>$2.99</td>
                        <td>Today, 10:45 AM</td>
                    </tr>
                    <tr>
                        <td>One Bread One Body</td>
                        <td>$2.99</td>
                        <td>Yesterday, 3:22 PM</td>
                    </tr>
                    <tr>
                        <td>Gloria in Excelsis Deo</td>
                        <td>$2.99</td>
                        <td>Yesterday, 9:15 AM</td>
                    </tr>
                `;
        document.getElementById('recent-payments').innerHTML = recentPaymentsHtml;
    }, 500);
}

// Load songs
function loadSongs(page = 1) {
    // Simulate API call to get songs
    setTimeout(() => {
        // Sample data - in a real app this would come from your backend
        songs = [
            {
                id: 1,
                title: 'Amazing Grace',
                artist: 'VOEZ Worship Team',
                category: 'General Worship',
                price: 0,
                cover: 'https://i.postimg.cc/8PvQ1kzT/advent1.jpg',
                audio: 'music/amazing_grace.mp3',
                status: 'published',
                description: 'Classic hymn of grace and redemption'
            },
            {
                id: 2,
                title: 'O Holy Night',
                artist: 'VOEZ Choir',
                category: 'Christmas',
                price: 2.99,
                cover: 'https://i.postimg.cc/8PvQ1kzT/advent1.jpg',
                audio: 'music/o_holy_night.mp3',
                status: 'published',
                description: 'Beautiful Christmas carol'
            },
            {
                id: 3,
                title: 'Kyrie Eleison',
                artist: 'VOEZ Band',
                category: 'Kyrie & Gloria',
                price: 2.99,
                cover: 'https://i.postimg.cc/8PvQ1kzT/advent1.jpg',
                audio: 'music/kyrie_eleison.mp3',
                status: 'draft',
                description: 'Traditional liturgical piece'
            },
            {
                id: 4,
                title: 'One Bread One Body',
                artist: 'VOEZ Worship Team',
                category: 'Eucharist',
                price: 2.99,
                cover: 'https://i.postimg.cc/8PvQ1kzT/advent1.jpg',
                audio: 'music/one_bread_one_body.mp3',
                status: 'published',
                description: 'Eucharistic hymn'
            },
            {
                id: 5,
                title: 'We Give You Thanks',
                artist: 'VOEZ Choir',
                category: 'Offertory',
                price: 0,
                cover: 'https://i.postimg.cc/8PvQ1kzT/advent1.jpg',
                audio: 'music/we_give_thanks.mp3',
                status: 'published',
                description: 'Offertory song of thanksgiving'
            }
        ];

        renderSongsTable(page);
    }, 800);
}

// Render songs table
function renderSongsTable(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSongs = songs.slice(startIndex, endIndex);

    let songsHtml = '';

    paginatedSongs.forEach(song => {
        songsHtml += `
                    <tr>
                        <td><img src="${song.cover}" alt="${song.title}" class="preview-image"></td>
                        <td>${song.title}</td>
                        <td>${song.artist}</td>
                        <td>${song.category}</td>
                        <td>${song.price > 0 ? '$' + song.price.toFixed(2) : 'Free'}</td>
                        <td><span class="status-badge ${song.status === 'published' ? 'status-published' : 'status-draft'}">${song.status === 'published' ? 'Published' : 'Draft'}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-song" data-id="${song.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-song" data-id="${song.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
    });

    document.getElementById('songs-table-body').innerHTML = songsHtml;
    renderPagination('songs-pagination', songs.length, page);

    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-song').forEach(btn => {
        btn.addEventListener('click', function () {
            const songId = parseInt(this.getAttribute('data-id'));
            editSong(songId);
        });
    });

    document.querySelectorAll('.delete-song').forEach(btn => {
        btn.addEventListener('click', function () {
            const songId = parseInt(this.getAttribute('data-id'));
            showConfirmModal(
                'Delete Song',
                `Are you sure you want to delete "${songs.find(s => s.id === songId).title}"?`,
                () => deleteSong(songId)
            );
        });
    });
}

// Load categories
function loadCategories() {
    // Simulate API call to get categories
    setTimeout(() => {
        // Sample data - in a real app this would come from your backend
        categories = [
            { id: 1, name: 'Advent', icon: 'fas fa-calendar-alt', songCount: 12 },
            { id: 2, name: 'Christmas', icon: 'fas fa-snowflake', songCount: 18 },
            { id: 3, name: 'Eucharist', icon: 'fas fa-wine-glass-alt', songCount: 15 },
            { id: 4, name: 'Offertory', icon: 'fas fa-hand-holding-usd', songCount: 8 },
            { id: 5, name: 'Kyrie & Gloria', icon: 'fas fa-pray', songCount: 10 },
            { id: 6, name: 'General Worship', icon: 'fas fa-hands-praying', songCount: 32 }
        ];

        renderCategoriesTable();

        // Populate category dropdown in song modal
        const categoryDropdown = document.getElementById('song-category');
        categoryDropdown.innerHTML = '<option value="">Select Category</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
        });
    }, 800);
}

// Render categories table
function renderCategoriesTable() {
    let categoriesHtml = '';

    categories.forEach(category => {
        categoriesHtml += `
                    <tr>
                        <td>${category.name}</td>
                        <td><i class="${category.icon}"></i> ${category.icon}</td>
                        <td>${category.songCount}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-category" data-id="${category.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-category" data-id="${category.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
    });

    document.getElementById('categories-table-body').innerHTML = categoriesHtml;

    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-category').forEach(btn => {
        btn.addEventListener('click', function () {
            const categoryId = parseInt(this.getAttribute('data-id'));
            editCategory(categoryId);
        });
    });

    document.querySelectorAll('.delete-category').forEach(btn => {
        btn.addEventListener('click', function () {
            const categoryId = parseInt(this.getAttribute('data-id'));
            showConfirmModal(
                'Delete Category',
                `Are you sure you want to delete "${categories.find(c => c.id === categoryId).name}" category?`,
                () => deleteCategory(categoryId)
            );
        });
    });
}

// Load payments
function loadPayments(page = 1) {
    // Simulate API call to get payments
    setTimeout(() => {
        // Sample data - in a real app this would come from your backend
        payments = [
            {
                id: 1,
                transactionId: 'TXN-2023-001',
                song: 'How Great Thou Art',
                user: 'John Doe (john@example.com)',
                amount: 2.99,
                method: 'mobile_money',
                date: '2023-06-15 10:45 AM',
                status: 'completed'
            },
            {
                id: 2,
                transactionId: 'TXN-2023-002',
                song: 'One Bread One Body',
                user: 'Mary Smith (mary@example.com)',
                amount: 2.99,
                method: 'card',
                date: '2023-06-14 3:22 PM',
                status: 'completed'
            },
            {
                id: 3,
                transactionId: 'TXN-2023-003',
                song: 'Gloria in Excelsis Deo',
                user: 'James Brown (james@example.com)',
                amount: 2.99,
                method: 'paypal',
                date: '2023-06-14 9:15 AM',
                status: 'completed'
            },
            {
                id: 4,
                transactionId: 'TXN-2023-004',
                song: 'Come Thou Long Expected Jesus',
                user: 'Sarah Johnson (sarah@example.com)',
                amount: 2.99,
                method: 'mobile_money',
                date: '2023-06-13 5:30 PM',
                status: 'pending'
            }
        ];

        renderPaymentsTable(page);
    }, 800);
}

// Render payments table
function renderPaymentsTable(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPayments = payments.slice(startIndex, endIndex);

    let paymentsHtml = '';

    paginatedPayments.forEach(payment => {
        paymentsHtml += `
                    <tr>
                        <td>${payment.transactionId}</td>
                        <td>${payment.song}</td>
                        <td>${payment.user}</td>
                        <td>$${payment.amount.toFixed(2)}</td>
                        <td>${payment.method === 'mobile_money' ? 'Mobile Money' :
                payment.method === 'card' ? 'Card' : 'PayPal'}</td>
                        <td>${payment.date}</td>
                        <td><span class="status-badge ${payment.status === 'completed' ? 'status-published' : 'status-draft'}">${payment.status === 'completed' ? 'Completed' : 'Pending'}</span></td>
                    </tr>
                `;
    });

    document.getElementById('payments-table-body').innerHTML = paymentsHtml;
    renderPagination('payments-pagination', payments.length, page);
}

// Load users
function loadUsers(page = 1) {
    // Simulate API call to get users
    setTimeout(() => {
        // Sample data - in a real app this would come from your backend
        users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '0966123456',
                purchases: 5,
                joined: '2023-05-10',
                status: 'active'
            },
            {
                id: 2,
                name: 'Mary Smith',
                email: 'mary@example.com',
                phone: '0977123456',
                purchases: 3,
                joined: '2023-05-15',
                status: 'active'
            },
            {
                id: 3,
                name: 'James Brown',
                email: 'james@example.com',
                phone: '0955123456',
                purchases: 7,
                joined: '2023-04-22',
                status: 'active'
            },
            {
                id: 4,
                name: 'Sarah Johnson',
                email: 'sarah@example.com',
                phone: '0966123457',
                purchases: 2,
                joined: '2023-06-01',
                status: 'inactive'
            }
        ];

        renderUsersTable(page);
    }, 800);
}

// Render users table
function renderUsersTable(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = users.slice(startIndex, endIndex);

    let usersHtml = '';

    paginatedUsers.forEach(user => {
        usersHtml += `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${user.purchases}</td>
                        <td>${user.joined}</td>
                        <td><span class="status-badge ${user.status === 'active' ? 'status-published' : 'status-draft'}">${user.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
    });

    document.getElementById('users-table-body').innerHTML = usersHtml;
    renderPagination('users-pagination', users.length, page);
}

// Render pagination
function renderPagination(elementId, totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationElement = document.getElementById(elementId);

    let paginationHtml = '';

    if (totalPages > 1) {
        paginationHtml += `
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                    </li>
                `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `
                        <li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                        </li>
                    `;
        }

        paginationHtml += `
                    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                    </li>
                `;
    }

    paginationElement.innerHTML = paginationHtml;

    // Add event listeners to pagination links
    paginationElement.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));

            if (elementId === 'songs-pagination') {
                loadSongs(page);
            } else if (elementId === 'payments-pagination') {
                loadPayments(page);
            } else if (elementId === 'users-pagination') {
                loadUsers(page);
            }

            // Scroll to top
            window.scrollTo(0, 0);
        });
    });
}

// Add new song
function addNewSong() {
    const modal = new bootstrap.Modal(document.getElementById('song-modal'));
    document.getElementById('song-modal-title').textContent = 'Add New Song';
    document.getElementById('song-form').reset();
    document.getElementById('song-id').value = '';
    modal.show();
}

// Edit song
function editSong(songId) {
    const song = songs.find(s => s.id === songId);
    if (!song) return;

    const modal = new bootstrap.Modal(document.getElementById('song-modal'));
    document.getElementById('song-modal-title').textContent = 'Edit Song';

    // Fill form with song data
    document.getElementById('song-id').value = song.id;
    document.getElementById('song-title').value = song.title;
    document.getElementById('song-artist').value = song.artist;
    document.getElementById('song-category').value = categories.find(c => c.name === song.category)?.id || '';
    document.getElementById('song-price').value = song.price;
    document.getElementById('song-description').value = song.description;
    document.getElementById('song-status').checked = song.status === 'published';

    modal.show();
}

// Delete song
function deleteSong(songId) {
    // In a real app, you would make an API call to delete the song
    songs = songs.filter(s => s.id !== songId);

    // Show success message
    showAlert('success', 'Song deleted successfully');

    // Reload songs
    loadSongs(currentPage);

    // Close confirmation modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirm-modal'));
    modal.hide();
}

// Add new category
function addNewCategory() {
    const modal = new bootstrap.Modal(document.getElementById('category-modal'));
    document.getElementById('category-modal-title').textContent = 'Add New Category';
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    modal.show();
}

// Edit category
function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const modal = new bootstrap.Modal(document.getElementById('category-modal'));
    document.getElementById('category-modal-title').textContent = 'Edit Category';

    // Fill form with category data
    document.getElementById('category-id').value = category.id;
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-icon').value = category.icon;
    document.getElementById('icon-preview').className = category.icon;

    modal.show();
}

// Delete category
function deleteCategory(categoryId) {
    // In a real app, you would make an API call to delete the category
    categories = categories.filter(c => c.id !== categoryId);

    // Show success message
    showAlert('success', 'Category deleted successfully');

    // Reload categories
    loadCategories();

    // Close confirmation modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirm-modal'));
    modal.hide();
}

// Show confirmation modal
function showConfirmModal(title, message, confirmCallback) {
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-body').textContent = message;

    const confirmBtn = document.getElementById('confirm-action-btn');

    // Remove previous event listeners
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));

    // Add new event listener
    document.getElementById('confirm-action-btn').addEventListener('click', confirmCallback);

    const modal = new bootstrap.Modal(document.getElementById('confirm-modal'));
    modal.show();
}

// Show alert message
function showAlert(type, message) {
    // In a real app, you might use a more sophisticated alert system
    alert(`${type.toUpperCase()}: ${message}`);
}

// Set up event listeners
function setupEventListeners() {
    // Sidebar toggle for mobile
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('active');
    });

    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Update active link
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Show corresponding section
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Logout
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // In a real app, you would make an API call to logout
        localStorage.removeItem('admin_token');
        window.location.href = 'login.html';
    });

    // Add song button
    document.getElementById('add-song-btn').addEventListener('click', addNewSong);

    // Save song form
    document.getElementById('song-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const songId = document.getElementById('song-id').value;
        const isEdit = !!songId;

        // In a real app, you would make an API call to save the song
        const newSong = {
            id: isEdit ? parseInt(songId) : songs.length + 1,
            title: document.getElementById('song-title').value,
            artist: document.getElementById('song-artist').value,
            category: categories.find(c => c.id === parseInt(document.getElementById('song-category').value))?.name || '',
            price: parseFloat(document.getElementById('song-price').value) || 0,
            description: document.getElementById('song-description').value,
            status: document.getElementById('song-status').checked ? 'published' : 'draft',
            cover: 'https://i.postimg.cc/8PvQ1kzT/advent1.jpg', // In a real app, you would upload the image
            audio: 'music/sample.mp3' // In a real app, you would upload the audio file
        };

        if (isEdit) {
            // Update existing song
            const index = songs.findIndex(s => s.id === parseInt(songId));
            if (index !== -1) {
                songs[index] = newSong;
            }
        } else {
            // Add new song
            songs.unshift(newSong);
        }

        // Show success message
        showAlert('success', `Song ${isEdit ? 'updated' : 'added'} successfully`);

        // Reload songs
        loadSongs(isEdit ? currentPage : 1);

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('song-modal'));
        modal.hide();
    });

    // Add category button
    document.getElementById('add-category-btn').addEventListener('click', addNewCategory);

    // Save category form
    document.getElementById('category-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const categoryId = document.getElementById('category-id').value;
        const isEdit = !!categoryId;

        // In a real app, you would make an API call to save the category
        const newCategory = {
            id: isEdit ? parseInt(categoryId) : categories.length + 1,
            name: document.getElementById('category-name').value,
            icon: document.getElementById('category-icon').value,
            songCount: 0
        };

        if (isEdit) {
            // Update existing category
            const index = categories.findIndex(c => c.id === parseInt(categoryId));
            if (index !== -1) {
                categories[index] = newCategory;
            }
        } else {
            // Add new category
            categories.unshift(newCategory);
        }

        // Show success message
        showAlert('success', `Category ${isEdit ? 'updated' : 'added'} successfully`);

        // Reload categories
        loadCategories();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('category-modal'));
        modal.hide();
    });

    // Category icon preview
    document.getElementById('category-icon').addEventListener('input', function () {
        document.getElementById('icon-preview').className = this.value;
    });

    // Settings form
    document.getElementById('settings-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // In a real app, you would make an API call to save settings
        showAlert('success', 'Settings saved successfully');
    });
}

// Show section
function showSection(section) {
    // Hide all sections
    sectionContents.forEach(sc => sc.classList.add('d-none'));

    // Show selected section
    document.getElementById(`${section}-section`).classList.remove('d-none');
    currentSection = section;

    // Scroll to top
    window.scrollTo(0, 0);
}

// Song functions
async function getSongs(category = null) {
  try {
    let q;
    if (category) {
      q = firebaseServices.query(
        firebaseServices.collection(firebaseServices.db, "songs"),
        firebaseServices.where("category", "==", category)
      );
    } else {
      q = firebaseServices.collection(firebaseServices.db, "songs");
    }
    
    const querySnapshot = await firebaseServices.getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting songs:", error);
    throw error;
  }
}

async function addSong(songData, coverFile, audioFile) {
  try {
    // Upload cover image
    const coverRef = firebaseServices.ref(firebaseServices.storage, `covers/${Date.now()}-${coverFile.name}`);
    await firebaseServices.uploadBytes(coverRef, coverFile);
    const coverUrl = await firebaseServices.getDownloadURL(coverRef);
    
    // Upload audio file
    const audioRef = firebaseServices.ref(firebaseServices.storage, `audio/${Date.now()}-${audioFile.name}`);
    await firebaseServices.uploadBytes(audioRef, audioFile);
    const audioUrl = await firebaseServices.getDownloadURL(audioRef);
    
    // Add song to Firestore
    const docRef = await firebaseServices.addDoc(
      firebaseServices.collection(firebaseServices.db, "songs"),
      {
        ...songData,
        coverUrl,
        audioUrl,
        createdAt: new Date()
      }
    );
    
    return { id: docRef.id, ...songData, coverUrl, audioUrl };
  } catch (error) {
    console.error("Error adding song:", error);
    throw error;
  }
}