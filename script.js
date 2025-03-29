// DOM Elements
const themeSwitcher = document.getElementById('theme-switcher');
const navToggle = document.getElementById('nav-toggle');
const addDeadlineBtn = document.getElementById('add-deadline');
const deadlineModal = document.getElementById('deadline-modal');
const deadlineForm = document.getElementById('deadline-form');
const closeBtns = document.querySelectorAll('.close-btn');
const userProfileBtn = document.getElementById('user-profile-btn');
const profileModal = document.getElementById('profile-modal');
const profileForm = document.getElementById('profile-form');
const nameInput = document.getElementById('user-name');
const emailInput = document.getElementById('user-email');
const avatarInput = document.getElementById('avatar-input');
const avatarPreview = document.getElementById('avatar-preview');
const userNameDisplay = document.querySelector('.user-profile span');
const userEmailDisplay = document.querySelector('.user-email') || { textContent: '' };
const profileImage = document.querySelector('.user-profile img');
const navItems = document.querySelectorAll('.nav-links li');

// Theme Switcher
themeSwitcher.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Update button icon
    const icon = themeSwitcher.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Set active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link.getAttribute('href') === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});

// Mobile menu toggle
navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-show');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navToggle = document.querySelector('.nav-toggle'); // Ensure navToggle is defined
    if (navToggle && !navToggle.contains(e.target)) {
        document.querySelector('.nav-links').classList.remove('mobile-show');
    }
});


// Modal Functions
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals with close button
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Deadline Modal
if (addDeadlineBtn) {
    addDeadlineBtn.addEventListener('click', () => {
        openModal(deadlineModal);
    });
}

// Handle Deadline Form Submission
if (deadlineForm) {
    deadlineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('deadline-title').value;
        const course = document.getElementById('deadline-course').value;
        const date = document.getElementById('deadline-date').value;
        const time = document.getElementById('deadline-time').value;
        
        // Format date for display
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
        
        // Format time for display
        const timeDisplay = formatTime(time);
        
        // Create new deadline item
        const deadlineItem = document.createElement('div');
        deadlineItem.className = 'deadline-item';
        deadlineItem.innerHTML = `
            <div class="deadline-date" style="background-color: ${getCourseColor(course)}">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="deadline-info">
                <h4>${title}</h4>
                <p>${course}</p>
                <span class="time">Due: ${timeDisplay}</span>
            </div>
        `;
        
        // Add to deadlines list
        document.querySelector('.deadlines-list').prepend(deadlineItem);
        
        // Reset form and close modal
        deadlineForm.reset();
        closeModal(deadlineModal);
    });
}

// Get course color for deadline item
function getCourseColor(course) {
    const colors = {
        'Web Engineering': '#6C5CE7',
        'Software Engineering': '#00B894',
        'Computer Networks': '#FD79A8'
    };
    return colors[course] || '#4361ee';
}

// Format time function (24h to 12h)
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Profile Modal Functionality
if (userProfileBtn && profileModal) {
    // Open profile modal
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Populate form with current data
        nameInput.value = userNameDisplay.textContent;
        emailInput.value = userEmailDisplay.textContent || 'subhan@gmail.com';
        openModal(profileModal);
    });

    // Handle avatar upload
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
                profileImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();
        
        // Validate inputs
        if (!newName) {
            alert('Please enter your name');
            return;
        }
        
        if (!newEmail || !newEmail.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Update profile in navbar
        userNameDisplay.textContent = newName;
        if (userEmailDisplay) {
            userEmailDisplay.textContent = newEmail;
        }
        
        // Close modal
        closeModal(profileModal);
        
        // Show success message
        alert('Profile updated successfully!');
    });
}

// Navigation Active State
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Close mobile menu if open
        if (window.innerWidth <= 992) {
            document.querySelector('.nav-links').classList.remove('mobile-show');
        }
    });
});

// Responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        document.querySelector('.nav-links').classList.remove('mobile-show');
    }
});

// Enhanced Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll effect to navbar
    const topNav = document.querySelector('.top-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            topNav.classList.add('scrolled-nav');
        } else {
            topNav.classList.remove('scrolled-nav');
        }
    });

    // Enhanced dropdown functionality
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        const userDropdown = document.createElement('div');
        userDropdown.className = 'user-dropdown';
        userDropdown.innerHTML = `
            <div class="user-dropdown-item">
                <i class="fas fa-user"></i>
                <span>My Profile</span>
            </div>
            <div class="user-dropdown-item">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </div>
            <div class="user-dropdown-item">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </div>
        `;
        userProfile.appendChild(userDropdown);

        // Toggle dropdown
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.opacity = userDropdown.style.opacity === '1' ? '0' : '1';
            userDropdown.style.visibility = userDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
            userDropdown.style.transform = userDropdown.style.transform === 'translateY(0px)' ? 'translateY(10px)' : 'translateY(0)';
        });
    }

    // Notification dropdown
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        const notificationDropdown = document.createElement('div');
        notificationDropdown.className = 'notification-dropdown';
        notificationDropdown.innerHTML = `
            <div class="notification-header" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);">
                <h4 style="margin: 0;">Notifications</h4>
            </div>
            <div class="notification-item">
                <div class="notification-text">New assignment posted in Web Engineering</div>
                <div class="notification-time">2 hours ago</div>
            </div>
            <div class="notification-item">
                <div class="notification-text">Your submission was graded in Software Engineering</div>
                <div class="notification-time">1 day ago</div>
            </div>
            <div class="notification-item" style="border-bottom: none;">
                <div class="notification-text">Upcoming deadline: PBL Project due tomorrow</div>
                <div class="notification-time">2 days ago</div>
            </div>
        `;
        notificationBell.appendChild(notificationDropdown);

        // Toggle notification dropdown
        notificationBell.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.style.opacity = notificationDropdown.style.opacity === '1' ? '0' : '1';
            notificationDropdown.style.visibility = notificationDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
            notificationDropdown.style.transform = notificationDropdown.style.transform === 'translateY(0px)' ? 'translateY(10px)' : 'translateY(0)';
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        const userDropdown = document.querySelector('.user-dropdown');
        const notificationDropdown = document.querySelector('.notification-dropdown');
        
        if (userDropdown) {
            userDropdown.style.opacity = '0';
            userDropdown.style.visibility = 'hidden';
            userDropdown.style.transform = 'translateY(10px)';
        }
        
        if (notificationDropdown) {
            notificationDropdown.style.opacity = '0';
            notificationDropdown.style.visibility = 'hidden';
            notificationDropdown.style.transform = 'translateY(10px)';
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("nav-toggle");
    const navMenu = document.querySelector(".nav-links");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("show");
        });
    } else {
        console.error("Navbar toggle elements not found!");
    }
});

