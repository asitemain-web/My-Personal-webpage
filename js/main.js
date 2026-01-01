// Main initialization file - Combined Site JavaScript
// Prevent browser from restoring scroll position on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll to top on load
document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
    
    // Set up callbacks between modules
    setUpdateHeaderBackgroundCallback(getUpdateHeaderBackground());
    
    // Initialize all modules
    initTheme();
    initSkills();
    initProjects();
    initNavigation();
    initMobileMenu();
    initHeader();
    initContact();
    initAnimations();
    
    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    
    // Performance optimization for scroll events
    let ticking = false;
    const setActiveLinkFn = getSetActiveLink();
    const updateHeaderBackgroundFn = getUpdateHeaderBackground();
    
    function updateOnScroll() {
        if (setActiveLinkFn) setActiveLinkFn();
        if (updateHeaderBackgroundFn) updateHeaderBackgroundFn();
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    // Use optimized scroll handler
    window.addEventListener('scroll', requestTick);
});

// Ensure scroll to top after page fully loads
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});
