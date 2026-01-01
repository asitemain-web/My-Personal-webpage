// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.project-card, .contact-card, .skill-card');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}