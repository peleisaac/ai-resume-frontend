document.addEventListener("DOMContentLoaded", function () {
    const footerContainer = document.getElementById("footer");
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <p>&copy; 2025 Axxend Corporation</p>
                </div>
            </footer>
        `;
    }
});
