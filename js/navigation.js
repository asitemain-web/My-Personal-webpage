// Navigation: smooth scrolling and active links
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

function setActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.site-header, .header');
    const headerHeight = header ? header.offsetHeight : 0;
    const scrollPosition = window.scrollY + headerHeight + 50;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            allNavLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"], .nav-link[data-scroll="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

function getSetActiveLink() {
    return setActiveLink;
}

function initNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"], a[data-scroll]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href')?.substring(1) || this.getAttribute('data-scroll')?.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const header = document.querySelector('.site-header, .header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                smoothScrollTo(targetPosition, 1000);
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.style.display === 'block') {
                    mobileMenu.style.display = 'none';
                }
            }
        });
    });
    
    setActiveLink();
}
