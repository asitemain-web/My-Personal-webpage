// Theme toggle functionality
const STORAGE_KEY = 'fa-personal-site-theme';

let updateHeaderBackgroundCallback = null;

function setUpdateHeaderBackgroundCallback(callback) {
    updateHeaderBackgroundCallback = callback;
}

function applyStoredTheme() {
    try {
        const root = document.documentElement;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        setTimeout(() => {
            if (updateHeaderBackgroundCallback) {
                updateHeaderBackgroundCallback();
            }
        }, 10);
    } catch (error) {
        // خطا در اعمال تم
    }
}

function toggleTheme() {
    try {
        const root = document.documentElement;
        const isDark = root.classList.toggle('dark');
        localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
        setTimeout(() => {
            if (updateHeaderBackgroundCallback) {
                updateHeaderBackgroundCallback();
            }
        }, 10);
    } catch (error) {
        // خطا در تغییر تم
    }
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
    }
    applyStoredTheme();
}

