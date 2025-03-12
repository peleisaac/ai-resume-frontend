document.addEventListener("DOMContentLoaded", function () {
    // Load sidebar dynamically
    loadJobseekerSidebar();

    // Initialize profile form and other components
    setupProfileForm();

    // Toggle mobile sidebar
    setupSidebarToggle();

    // Initialize current page content based on URL
    initializeCurrentPageContent();

    setTimeout(highlightActiveLink, 100); // Short delay to ensure sidebar is loaded
});

function loadJobseekerSidebar() {
    // Directly insert the sidebar HTML instead of fetching it
    const sidebarHTML = `<aside class="sidebar">
    <!-- Jobseeker Profile Section -->
    <div class="jobseeker-profile">
        <div class="profile-image">
            <img src="../assets/lady.jpg" alt="Jobseeker Profile">
        </div>
        <div class="profile-info">
            <h3>Alex Smith</h3>
            <p>Jobseeker</p>
        </div>
    </div>

    <!-- Navigation Links -->
    <nav class="dashboard-nav">
        <ul>
            <li>
                <a href="/pages/jobseekers-dashboard.html" class="nav-item">
                    <span class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" />
                            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" />
                            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" />
                            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" />
                        </svg>
                    </span>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="/pages/jobseeker-my-jobs.html" class="nav-item">
                    <span class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </span>
                    <span>My Jobs</span>
                </a>
            </li>
            <li>
                <a href="/pages/jobseeker-browse-jobs.html" class="nav-item">
                    <span class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </span>
                    <span>Browse Jobs</span>
                </a>
            </li>
            <li>
                <a href="/pages/jobseeker-profile.html" class="nav-item">
                    <span class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </span>
                    <span>My Profile</span>
                </a>
            </li>
        </ul>
    </nav>
</aside>`;

    const sidebarContainer = document.getElementById("sidebar");
    if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebarHTML;
        console.log("Jobseeker sidebar manually inserted into #sidebar.");
        setupSidebarNavigation();
        highlightActiveLink();
    }
}

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll(".nav-item");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const targetPage = this.getAttribute("href");
            history.pushState({}, "", targetPage);

            loadContent(targetPage);
            updateActiveLink(this, sidebarLinks);
        });
    });
}

function loadContent(page) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            const newContent = tempDiv.querySelector(".main-content").innerHTML;
            document.querySelector(".main-content").innerHTML = newContent;

            document.title = tempDiv.querySelector("title").innerText;

            // Initialize appropriate functionality based on page
            initializeCurrentPageContent();
        })
        .catch(error => console.error("Error loading content:", error));
}

function initializeCurrentPageContent() {
    // Setup profile form if we're on the profile page
    setupProfileForm();

    // Initialize job browsing if we're on the browse jobs page
    if (window.location.pathname.includes("jobseeker-browse-jobs.html")) {
        console.log("Initializing job browsing page");
        initializeJobBrowsing();
    }

    // Initialize saved/applied jobs if we're on my jobs page
    if (window.location.pathname.includes("jobseeker-my-jobs.html")) {
        console.log("Initializing my jobs page");
        initializeMyJobs();
    }
}

function initializeJobBrowsing() {
    // Check if the necessary job-related scripts are loaded
    if (typeof window.loadJobListings === 'function') {
        // If the function already exists, call it
        window.loadJobListings();
    } else {
        // If not, dynamically load the necessary scripts
        loadJobScripts().then(() => {
            // After scripts are loaded, call the function
            if (typeof window.loadJobListings === 'function') {
                window.loadJobListings();
            } else {
                console.error("loadJobListings function not found even after loading scripts");
            }
        });
    }
}

function initializeMyJobs() {
    // Check if we need to load saved/applied jobs scripts
    loadSavedJobsScripts().then(() => {
        if (typeof window.loadSavedJobs === 'function') {
            window.loadSavedJobs();
        } else {
            console.error("loadSavedJobs function not found even after loading scripts");
        }
    });
}

function loadJobScripts() {
    return new Promise((resolve, reject) => {
        // Load job-data.js first
        const jobDataScript = document.createElement('script');
        jobDataScript.src = '../js/job-data.js';
        jobDataScript.onload = function () {
            // Then load job-listings.js
            const jobListingsScript = document.createElement('script');
            jobListingsScript.src = '../js/job-listings.js';
            jobListingsScript.onload = function () {
                // Finally load job-filters.js
                const jobFiltersScript = document.createElement('script');
                jobFiltersScript.src = '../js/job-filters.js';
                jobFiltersScript.onload = function () {
                    // Add a small delay to ensure scripts are parsed and executed
                    setTimeout(() => {
                        resolve();
                    }, 100);
                };
                jobFiltersScript.onerror = reject;
                document.head.appendChild(jobFiltersScript);
            };
            jobListingsScript.onerror = reject;
            document.head.appendChild(jobListingsScript);
        };
        jobDataScript.onerror = reject;
        document.head.appendChild(jobDataScript);
    });
}

function loadSavedJobsScripts() {
    return new Promise((resolve, reject) => {
        // Load saved-jobs.js
        const savedJobsScript = document.createElement('script');
        savedJobsScript.src = '../js/saved-jobs.js';
        savedJobsScript.onload = function () {
            // Add a small delay to ensure scripts are parsed and executed
            setTimeout(() => {
                resolve();
            }, 100);
        };
        savedJobsScript.onerror = reject;
        document.head.appendChild(savedJobsScript);
    });
}

function highlightActiveLink() {
    // Get the current path (e.g., "/pages/jobseeker-profile.html")
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll(".nav-item");

    sidebarLinks.forEach(link => {
        link.classList.remove("active");
        // Get the href value (e.g., "/pages/jobseeker-profile.html")
        const linkPath = link.getAttribute("href");

        // Check if the current path ends with or matches the link path
        if (currentPath === linkPath || currentPath.endsWith(linkPath.split('/').pop())) {
            link.classList.add("active");
        }
    });
}

function updateActiveLink(activeLink, sidebarLinks) {
    sidebarLinks.forEach(link => link.classList.remove("active"));
    activeLink.classList.add("active");
}

function setupProfileForm() {
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(profileForm);
            const profileData = {};

            for (const [key, value] of formData.entries()) {
                profileData[key] = value;
            }

            if (!profileData.fullName || !profileData.email) {
                alert("Please fill in all required fields");
                return;
            }

            console.log("Profile data:", profileData);
            alert("Profile updated successfully!");
        });
    }
}

function setupSidebarToggle() {
    document.addEventListener("click", function (event) {
        const toggleSidebarBtn = document.querySelector(".toggle-sidebar");
        const sidebar = document.querySelector(".sidebar");

        if (toggleSidebarBtn && sidebar && event.target === toggleSidebarBtn) {
            sidebar.classList.toggle("active");
        }
    });
}

window.addEventListener('popstate', function () {
    // Get the current URL path to determine which page to load
    const currentPath = window.location.pathname;

    // Only fetch if it's one of your application pages
    if (currentPath.includes('jobseeker-dashboard.html') ||
        currentPath.includes('jobseeker-my-jobs.html') ||
        currentPath.includes('jobseeker-browse-jobs.html') ||
        currentPath.includes('jobseeker-profile.html')) {

        // Load the content for the current URL
        loadContent(currentPath);

        // Update the active link in the sidebar
        highlightActiveLink();
    }
});



