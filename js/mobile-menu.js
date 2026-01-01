// Mobile menu functionality
function initMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    function toggleMobileMenu() {
        if (mobileMenu) {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
        }
    }
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }
    
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.style.display = 'none';
            }
        });
    });
    
    document.addEventListener('click', (event) => {
        if (mobileMenu && mobileMenu.style.display === 'block') {
            if (hamburgerMenu && !hamburgerMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.style.display = 'none';
            }
        }
    });
}

