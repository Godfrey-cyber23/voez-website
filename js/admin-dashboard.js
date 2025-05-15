
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc,deleteDoc,getDoc, setDoc, getDocs, query, where, orderBy, updateDoc, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Global variables
let currentUser = null;
let currentSection = 'dashboard';
let currentPage = 1;
const itemsPerPage = 10;

let currentEditingSongId = null;
let currentEditingCategoryId = null;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sectionContents = document.querySelectorAll('.section-content');
const sidebarLinks = document.querySelectorAll('.sidebar-menu li a');
const logoutBtn = document.getElementById('logout');


// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    onAuthStateChanged(auth, (user) => {
        if (!user) window.location.href = 'login.html';
        else {
            currentUser = user;
            loadDashboardData();
            loadSongs();
            loadCategories(); // Add this to load categories on startup
            setupEventListeners(); // Call this after DOM is loaded
        }
    });
});



loadCategories();
// Load dashboard data
async function loadDashboardData() {
    try {
        // Total songs count
        const songsSnapshot = await getDocs(collection(db, 'songs'));
        document.getElementById('total-songs').textContent = songsSnapshot.size;

        // Premium songs count
        const premiumQuery = query(collection(db, 'songs'), where('price', '>', 0));
        const premiumSnapshot = await getDocs(premiumQuery);
        document.getElementById('premium-songs').textContent = premiumSnapshot.size;

        // Total revenue (placeholder)
        document.getElementById('total-revenue').textContent = '$0.00';

        // Recent songs
        const recentQuery = query(collection(db, 'songs'), orderBy('createdAt', 'desc'), limit(3));
        const recentSnapshot = await getDocs(recentQuery);

        let html = '';
        recentSnapshot.forEach(doc => {
            const song = doc.data();
            html += `
              <tr>
                  <td>${song.title}</td>
                  <td>${song.category || 'Uncategorized'}</td>
                  <td><span class="status-badge ${song.published ? 'status-published' : 'status-draft'}">${song.published ? 'Published' : 'Draft'}</span></td>
              </tr>
          `;
        });
        document.getElementById('recent-songs').innerHTML = html;

        // Recent payments (placeholder)
        document.getElementById('recent-payments').innerHTML = `
            <tr>
                <td colspan="3" class="text-center">Payment tracking not implemented</td>
            </tr>
        `;

        initCharts();
    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}


// Load songs from Firebase
async function loadSongs() {
    const songsTableBody = document.getElementById('songs-table-body');
    songsTableBody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';

    try {
        const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        songsTableBody.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const song = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${song.coverUrl || 'https://via.placeholder.com/50'}" width="50" height="50"></td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.category || '-'}</td>
                <td>${song.price > 0 ? `$${song.price.toFixed(2)}` : 'Free'}</td>
                <td>${song.published ? 'Published' : 'Draft'}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-song" data-id="${doc.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-song" data-id="${doc.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            songsTableBody.appendChild(row);
        });

        // Add event listeners to the new buttons
        document.querySelectorAll('.edit-song').forEach(btn => {
            btn.addEventListener('click', () => editSong(btn.dataset.id));
        });

        document.querySelectorAll('.delete-song').forEach(btn => {
            btn.addEventListener('click', () => showDeleteConfirmation(btn.dataset.id));
        });
    } catch (error) {
        songsTableBody.innerHTML = '<tr><td colspan="7">Error loading songs</td></tr>';
        console.error("Firestore error:", error);
    }
}


// Initialize charts
function initCharts() {
    try {
        // Enhanced Chart.js availability check
        if (!window.Chart || typeof window.Chart.prototype === 'undefined') {
            console.error('Chart.js is not properly initialized. Please check:');
            console.error('1. Is Chart.js script loaded before this file?');
            console.error('2. Is there a network issue loading Chart.js?');
            console.error('3. Are you using the correct Chart.js version?');
            return null;
        }

        // Initialize charts only if their containers exist
        const initChartIfExists = (chartId, config) => {
            const canvas = document.getElementById(chartId);
            if (!canvas) {
                console.warn(`Chart container #${chartId} not found`);
                return null;
            }

            try {
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error(`Could not get 2D context for #${chartId}`);
                    return null;
                }
                return new Chart(ctx, config);
            } catch (error) {
                console.error(`Failed to initialize chart ${chartId}:`, error);
                return null;
            }
        };

        // Songs Chart Configuration
        const songsChart = initChartIfExists('songsChart', {
            type: 'doughnut',
            data: {
                labels: ['Worship', 'Gospel', 'Hymns', 'Instrumental'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        'rgba(94, 114, 228, 0.8)',
                        'rgba(17, 205, 239, 0.8)',
                        'rgba(45, 206, 137, 0.8)',
                        'rgba(251, 99, 64, 0.8)'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10 // Added hover effect
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        bodyFont: {
                            size: 14,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                cutout: '70%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });

        // Revenue Chart Configuration
        const revenueChart = initChartIfExists('revenueChart', {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1900, 1500, 2000, 2500, 2200],
                    backgroundColor: 'rgba(94, 114, 228, 0.1)',
                    borderColor: 'rgba(94, 114, 228, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: 'rgba(94, 114, 228, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBorderWidth: 2,
                    pointBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return `Revenue: $${context.raw.toLocaleString()}`;
                            },
                            title: function (context) {
                                return `Month: ${context[0].label}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(0,0,0,0.7)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        // Return chart instances for potential future reference
        return { songsChart, revenueChart };

    } catch (error) {
        console.error('Global chart initialization error:', error);
        return null;
    }
}

// Load categories from Firebase
async function loadCategories() {
    const categoriesTableBody = document.getElementById('categories-table-body');
    if (!categoriesTableBody) return;

    categoriesTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Loading categories...</td></tr>';

    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));

        // Clear table if there are categories
        categoriesTableBody.innerHTML = '';

        if (querySnapshot.empty) {
            categoriesTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No categories found</td></tr>';
            return;
        }

        querySnapshot.forEach(doc => {
            const category = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td><i class="${category.icon}"></i> ${category.icon}</td>
                <td>${category.songCount || 0}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-category" data-id="${doc.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-category" data-id="${doc.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            categoriesTableBody.appendChild(row);
        });

        // Populate category dropdown in song modal
        const categoryDropdown = document.getElementById('song-category');
        if (categoryDropdown) {
            categoryDropdown.innerHTML = '<option value="">Select Category</option>';
            querySnapshot.forEach(doc => {
                const category = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = category.name;
                categoryDropdown.appendChild(option);
            });
        }

        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-category').forEach(btn => {
            btn.addEventListener('click', () => editCategory(btn.dataset.id));
        });

        document.querySelectorAll('.delete-category').forEach(btn => {
            btn.addEventListener('click', () => showDeleteCategoryConfirmation(btn.dataset.id));
        });

    } catch (error) {
        console.error("Error loading categories:", error);
        categoriesTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading categories</td></tr>';
    }
}

// Load payments (placeholder)
async function loadPayments() {
    const paymentsTableBody = document.getElementById('payments-table-body');
    if (!paymentsTableBody) return;

    paymentsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading payments...</td></tr>';

    try {
        const paymentsQuery = query(collection(db, "payments"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(paymentsQuery);

        paymentsTableBody.innerHTML = '';

        if (querySnapshot.empty) {
            paymentsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No payments found</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const payment = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.transactionId || 'N/A'}</td>
                <td>${payment.songId || 'N/A'}</td>
                <td>${payment.userId || 'N/A'}</td>
                <td>$${payment.amount?.toFixed(2) || '0.00'}</td>
                <td>${payment.method || 'Unknown'}</td>
                <td>${payment.date?.toDate().toLocaleDateString() || 'N/A'}</td>
                <td>
                    <span class="badge ${payment.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                        ${payment.status || 'pending'}
                    </span>
                </td>
            `;
            paymentsTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading payments:", error);
        paymentsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Error loading payments: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Load users (placeholder)
async function loadUsers() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;

    usersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading users...</td></tr>';

    try {
        const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(usersQuery);

        usersTableBody.innerHTML = '';

        if (querySnapshot.empty) {
            usersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No users found</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username || user.email || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${user.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                <td>
                    <span class="badge ${user.isAdmin ? 'bg-primary' : 'bg-secondary'}">
                        ${user.isAdmin ? 'Admin' : 'User'}
                    </span>
                </td>
                <td>
                    <span class="badge ${user.phoneVerified ? 'bg-success' : 'bg-warning'}">
                        ${user.phoneVerified ? 'Verified' : 'Unverified'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user" data-id="${doc.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${!user.isAdmin ? `
                    <button class="btn btn-sm btn-danger delete-user" data-id="${doc.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </td>
            `;
            usersTableBody.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', () => editUser(btn.dataset.id));
        });

        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', () => showDeleteUserConfirmation(btn.dataset.id));
        });

    } catch (error) {
        console.error("Error loading users:", error);
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Error loading users: ${error.message}
                </td>
            </tr>
        `;
    }
}

async function deleteUser(userId) {
    try {
        await deleteDoc(doc(db, "users", userId));
        showAlert('success', 'User deleted successfully!');
        loadUsers();
    } catch (error) {
        console.error("Error deleting user:", error);
        showAlert('danger', 'Error deleting user: ' + error.message);
    } finally {
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirm-modal'));
        modal.hide();
    }
}

// Add new song
function addNewSong() {
    currentEditingSongId = null;
    document.getElementById('song-modal-title').textContent = 'Add New Song';
    document.getElementById('song-form').reset();
    document.getElementById('song-id').value = '';

    const modal = new bootstrap.Modal(document.getElementById('song-modal'));
    modal.show();
}

// Edit song
async function editSong(songId) {
    currentEditingSongId = songId;

    try {
        const songDoc = await getDoc(doc(db, "songs", songId));
        if (!songDoc.exists()) {
            throw new Error("Song not found");
        }

        const song = songDoc.data();
        document.getElementById('song-modal-title').textContent = 'Edit Song';
        document.getElementById('song-id').value = songId;
        document.getElementById('song-title').value = song.title;
        document.getElementById('song-artist').value = song.artist;
        document.getElementById('song-category').value = song.categoryId || '';
        document.getElementById('song-price').value = song.price || 0;
        document.getElementById('song-description').value = song.description || '';
        document.getElementById('song-status').checked = song.published !== false;

        const modal = new bootstrap.Modal(document.getElementById('song-modal'));
        modal.show();
    } catch (error) {
        console.error("Error loading song:", error);
        showAlert('danger', 'Error loading song: ' + error.message);
    }
}

// Show delete user confirmation
function showDeleteUserConfirmation(userId) {
    getDoc(doc(db, "users", userId))
        .then(doc => {
            if (!doc.exists()) {
                throw new Error("User not found");
            }

            const user = doc.data();
            document.getElementById('confirm-modal-title').textContent = 'Delete User';
            document.getElementById('confirm-modal-body').textContent =
                `Are you sure you want to delete user "${user.username || user.email}"?`;

            const confirmBtn = document.getElementById('confirm-action-btn');
            confirmBtn.onclick = () => deleteUser(userId);

            const modal = new bootstrap.Modal(document.getElementById('confirm-modal'));
            modal.show();
        })
        .catch(error => {
            console.error("Error loading user for deletion:", error);
            showAlert('danger', 'Error: ' + error.message);
        });
}

// Save song (both add and update)
document.getElementById('song-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const songId = document.getElementById('song-id').value;
    const title = document.getElementById('song-title').value;
    const coverFile = document.getElementById('song-cover').files[0];

    try {
        // Upload cover image if exists
        let coverUrl;
        if (coverFile) {
            const coverRef = storageRef(storage, `covers/${Date.now()}_${coverFile.name}`);
            await uploadBytes(coverRef, coverFile);
            coverUrl = await getDownloadURL(coverRef);
        }

        // Prepare Firestore data
        const songData = {
            title,
            artist: document.getElementById('song-artist').value,
            price: parseFloat(document.getElementById('song-price').value) || 0,
            published: document.getElementById('song-status').checked,
            updatedAt: new Date()
        };

        if (coverUrl) songData.coverUrl = coverUrl;

        // Add/update document
        if (songId) {
            await updateDoc(doc(db, "songs", songId), songData);
        } else {
            songData.createdAt = new Date();
            await setDoc(doc(collection(db, "songs")), songData);
        }

        loadSongs(); // Refresh list
        bootstrap.Modal.getInstance(document.getElementById('song-modal')).hide();
    } catch (error) {
        console.error("Upload error:", error);
        alert("Error saving song");
    }
});


// Show delete confirmation
function showDeleteConfirmation(songId) {
    collection(db, 'songs').doc(songId).get()
        .then(doc => {
            if (!doc.exists) {
                throw new Error("Song not found");
            }

            const song = doc.data();
            document.getElementById('confirm-modal-title').textContent = 'Delete Song';
            document.getElementById('confirm-modal-body').textContent = `Are you sure you want to delete "${song.title}" by ${song.artist}?`;

            const confirmBtn = document.getElementById('confirm-action-btn');
            confirmBtn.onclick = () => deleteSong(songId);

            const modal = new bootstrap.Modal(document.getElementById('confirm-modal'));
            modal.show();
        })
        .catch(error => {
            console.error("Error loading song for deletion:", error);
            showAlert('danger', 'Error: ' + error.message);
        });
}

// Delete song
async function deleteSong(songId) {
    try {
        await collection(db, 'songs').doc(songId).delete();
        showAlert('success', 'Song deleted successfully!');
        loadSongs();
    } catch (error) {
        console.error("Error deleting song:", error);
        showAlert('danger', 'Error deleting song: ' + error.message);
    } finally {
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirm-modal'));
        modal.hide();
    }
}

// Add new category
function addNewCategory() {
    currentEditingCategoryId = null;
    document.getElementById('category-modal-title').textContent = 'Add New Category';
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';

    const modal = new bootstrap.Modal(document.getElementById('category-modal'));
    modal.show();
}

// Edit category
async function editCategory(categoryId) {
    try {
        currentEditingCategoryId = categoryId;

        const categoryRef = doc(db, 'categories', categoryId);
        const docSnap = await getDoc(categoryRef);

        if (!docSnap.exists()) {
            throw new Error("Category not found");
        }

        const category = docSnap.data();

        document.getElementById('category-modal-title').textContent = 'Edit Category';
        document.getElementById('category-id').value = categoryId;
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-icon').value = category.icon;
        document.getElementById('icon-preview').className = category.icon;

        const modal = new bootstrap.Modal(document.getElementById('category-modal'));
        modal.show();
    } catch (error) {
        console.error("Error loading category:", error);
        showAlert('danger', 'Error loading category: ' + error.message);
    }
}

// Save category (both add and update)
document.getElementById('category-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const categoryId = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    const icon = document.getElementById('category-icon').value;

    const saveBtn = document.getElementById('save-category-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';

    try {
        // Category object to save
        const categoryData = {
            name: name || 'Unnamed Category',
            icon: icon || 'fas fa-question',
            updatedAt: serverTimestamp()
        };

        if (categoryId) {
            // Update existing category
            const categoryRef = doc(db, "categories", categoryId);
            await updateDoc(categoryRef, categoryData);
        } else {
            // Add new category
            categoryData.createdAt = serverTimestamp();
            await addDoc(collection(db, "categories"), categoryData);
        }

        showAlert('success', `Category ${categoryId ? 'updated' : 'added'} successfully!`);
        loadCategories();

        const modal = bootstrap.Modal.getInstance(document.getElementById('category-modal'));
        modal.hide();
    } catch (error) {
        console.error("Error saving category:", error);
        showAlert('danger', 'Error saving category: ' + error.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Category';
    }
});


// Show delete category confirmation
function showDeleteCategoryConfirmation(categoryId) {
    const categoryRef = doc(db, 'categories', categoryId);

    getDoc(categoryRef)
        .then((docSnap) => {
            if (!docSnap.exists()) {
                throw new Error("Category not found");
            }

            const category = docSnap.data();
            document.getElementById('confirm-modal-title').textContent = 'Delete Category';
            document.getElementById('confirm-modal-body').textContent = `Are you sure you want to delete the "${category.name}" category?`;

            const confirmBtn = document.getElementById('confirm-action-btn');
            confirmBtn.onclick = () => deleteCategory(categoryId);

            const modal = new bootstrap.Modal(document.getElementById('confirm-modal'));
            modal.show();
        })
        .catch(error => {
            console.error("Error loading category for deletion:", error);
            showAlert('danger', 'Error: ' + error.message);
        });
}


// Delete category
async function deleteCategory(categoryId) {
    try {
        console.log("Attempting to delete category with ID:", categoryId);

        // Check if any songs use this category
        const songsRef = collection(db, 'songs');
        const q = query(songsRef, where('categoryId', '==', categoryId));
        const songsSnapshot = await getDocs(q);

        if (!songsSnapshot.empty) {
            throw new Error("Cannot delete category - it is being used by songs");
        }

        const categoryRef = doc(db, 'categories', categoryId);
        await deleteDoc(categoryRef);

        console.log("Category deleted successfully from Firestore");

        showAlert('success', 'Category deleted successfully!');
        loadCategories();
    } catch (error) {
        console.error("Error deleting category:", error);
        showAlert('danger', 'Error deleting category: ' + error.message);
    } finally {
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirm-modal'));
        modal.hide();
    }
}

// Show alert message
function showAlert(type, message) {
    // In a real app, you might use a more sophisticated alert system
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('.main-content');
    container.prepend(alertDiv);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Set up event listeners
function setupEventListeners() {
    // Sidebar toggle for mobile
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', function () {
        sidebar.classList.remove('active');
        this.classList.remove('active');
        if (sidebarToggle) sidebarToggle.classList.remove('active');
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

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                if (sidebarToggle) sidebarToggle.classList.remove('active');
            }
        });
    });

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await signOut(auth);
            window.location.href = 'login.html';
        });
    }

    // Add song button
    const addSongBtn = document.getElementById('add-song-btn');
    if (addSongBtn) {
        addSongBtn.addEventListener('click', addNewSong);
    }

    // Add category button
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', addNewCategory);
    }

    // Category icon preview
    const categoryIconInput = document.getElementById('category-icon');
    if (categoryIconInput) {
        categoryIconInput.addEventListener('input', function () {
            const iconPreview = document.getElementById('icon-preview');
            if (iconPreview) iconPreview.className = this.value;
        });
    }

    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showAlert('success', 'Settings saved successfully');
        });
    }
}

// Show section
function showSection(section) {
    // Hide all sections
    sectionContents.forEach(sc => sc.classList.add('d-none'));

    // Show selected section
    const sectionEl = document.getElementById(`${section}-section`);
    if (sectionEl) {
        sectionEl.classList.remove('d-none');
        currentSection = section;

        // Load appropriate data when section changes
        switch (section) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'songs':
                loadSongs();
                break;
            case 'categories':
                loadCategories();
                break;
            case 'payments':
                loadPayments();
                break;
            case 'users':
                loadUsers();
                break;
        }
    }

    // Scroll to top
    window.scrollTo(0, 0);
}