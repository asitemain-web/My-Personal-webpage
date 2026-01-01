// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return `${diffInMinutes} دقیقه قبل`;
    } else if (diffInHours < 24) {
        const diffInHoursFloor = Math.floor(diffInHours);
        return `${diffInHoursFloor} ساعت قبل`;
    } else {
        return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'});
    }
}

