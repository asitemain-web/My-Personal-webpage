// Header background on scroll
function updateHeaderBackground() {
    const root = document.documentElement;
    const header = document.querySelector('.site-header, .header');
    if (!header) return;
    const isDark = root.classList.contains('dark');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.style.background = isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    }
}

function getUpdateHeaderBackground() {
    return updateHeaderBackground;
}

function initHeader() {
    // Initial call - scroll events handled in main.js
    updateHeaderBackground();
}

