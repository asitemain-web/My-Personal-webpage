// Projects rendering and modal
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projectsData.map(project => `
        <div class="project-card" data-preview="${project.preview}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.imageAlt}" class="project-img" loading="lazy" decoding="async">
                <div class="project-overlay">
                    <button class="project-action project-action-share" data-project-link="${project.link}" data-project-title="${project.title}">
                        <img src="icon/share.svg" alt="اشتراک‌گذاری">
                        <span>اشتراک‌گذاری</span>
                    </button>
                    <a href="${project.link}" class="project-action project-action-link" target="_blank" rel="noopener">
                        <img src="icon/link.svg" alt="مشاهده سایت">
                        <span>مشاهده سایت</span>
                    </a>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">
                    ${project.description}
                </p>
                <div class="project-tech">
                    ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function setActiveDevice(device) {
    const deviceStage = document.getElementById('deviceStage');
    const deviceButtons = document.querySelectorAll('.device-btn');
    
    if (!deviceStage) return;
    deviceStage.classList.remove('mobile', 'tablet', 'desktop');
    deviceStage.classList.add(device);
    deviceButtons.forEach(btn => {
        const isMatch = btn.getAttribute('data-device') === device;
        btn.classList.toggle('active', isMatch);
    });
}

function initProjects() {
    renderProjects();
    
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('projectModal');
    const projectModalClose = document.getElementById('projectModalClose');
    const deviceButtons = document.querySelectorAll('.device-btn');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        const shareBtn = card.querySelector('.project-action-share');
        if (shareBtn) {
            shareBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                const projectLink = this.getAttribute('data-project-link');
                const projectTitle = this.getAttribute('data-project-title');
                const shareData = {
                    title: projectTitle || 'پروژه',
                    text: `این پروژه را ببینید: ${projectTitle}`,
                    url: projectLink
                };
                
                const showCopyFeedback = () => {
                    const originalText = this.querySelector('span').textContent;
                    this.querySelector('span').textContent = 'کپی شد!';
                    setTimeout(() => {
                        this.querySelector('span').textContent = originalText;
                    }, 2000);
                };
                
                try {
                    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                        await navigator.share(shareData);
                    } else {
                        await navigator.clipboard.writeText(projectLink);
                        showCopyFeedback();
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        try {
                            await navigator.clipboard.writeText(projectLink);
                            showCopyFeedback();
                        } catch (clipboardErr) {
                            console.error('Failed to copy:', clipboardErr);
                        }
                    }
                }
            });
        }
    });
    
    if (projectModal && projectModalClose) {
        projectModalClose.addEventListener('click', () => {
            projectModal.classList.remove('show');
            projectModal.setAttribute('aria-hidden', 'true');
        });
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('show');
                projectModal.setAttribute('aria-hidden', 'true');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                projectModal.classList.remove('show');
                projectModal.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    deviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.style.display === 'none') return;
            const device = btn.getAttribute('data-device');
            setActiveDevice(device);
        });
    });
}

