import { handleApiResponse } from "./handleApiResponse.js";

document.addEventListener("DOMContentLoaded", function () {
    // Get user role from the body tag
    const userRole = document.body.getAttribute("data-role") || "jobseeker";

    // Function to load the sign-in form
    function loadSignInForm(type) {
        const pageTitle = type === "employer" ? "EMPLOYERS SIGN IN" : "JOBSEEKERS SIGN IN";
        const switchText = type === "employer" ? "Are you a Jobseeker?" : "Are you an Employer?";
        const switchPath = type === "employer" ? "jobseekers-signin.html" : "employers-signin.html";
        const signUpPath = type === "employer" ? "employers-signup.html" : "jobseekers-signup.html";
        const profilePath = type === "employer" ? "employers-profile.html" : "jobseekers-profile.html";

        return `
            <form id="signin-form">
                <div>
                    <h2 class="title">${pageTitle}</h2>
                    <p class="subtitle">Access Your Account</p>
                </div>

                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter Email" required>

                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter Password" required>

                <button type="submit" class="signin-btn">SIGN IN</button>
                <p id="error-message" class="error-message"></p>
            </form>

            <div class="auth-box">
                <p>Don't have an account?</p>
                <button onclick="location.href='${signUpPath}'" class="secondary-btn">SIGN UP HERE</button>
                <p>${switchText}</p>
                <button onclick="location.href='${switchPath}'" class="secondary-btn">SIGN IN HERE</button>
            </div>
        `;
    }

    // Inject the form into the page
    const authContainer = document.getElementById("auth-container");
    if (authContainer) {
        authContainer.innerHTML = loadSignInForm(userRole);

        // Attach event listener for form submission
        const form = document.getElementById("signin-form");
        if (form) {
            form.addEventListener("submit", handleSignIn);
        }
    }

    // Sign-in form submission handler
    function handleSignIn(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorMessage = document.getElementById("error-message");

        errorMessage.textContent = "";

        if (!email || !password) {
            errorMessage.textContent = "All fields are required.";
            return;
        }

        const data = {
            email: email,
            password: password,
        };

        fetch("https://ai-resume-backend.axxendcorp.com/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
            mode: "cors"
        })
            .then(response => response.json())
            .then(responseData => {
              const result = handleApiResponse(responseData.status_code, responseData.data);

        if (result.success) {
            localStorage.setItem("user", JSON.stringify(result.data));
            alert(result.message);
            window.location.href = userRole === "employer" ? "employers-profile.html" : "jobseekers-profile.html";
        } else {
            errorMessage.textContent = result.message;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        errorMessage.textContent = "An error occurred. Please try again.";
    });
    }
});