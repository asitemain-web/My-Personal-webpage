// Skills rendering
// Convert hex to rgb for rgba usage
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Convert color (hex or named) to rgba string
function colorToRgba(color, opacity = 1) {
    // If it's a hex color, convert it
    if (color.startsWith('#')) {
        const rgb = hexToRgb(color);
        if (rgb) {
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        }
    }
    // For named colors, create a temporary element to get computed color
    const temp = document.createElement('div');
    temp.style.color = color;
    document.body.appendChild(temp);
    const computed = window.getComputedStyle(temp).color;
    document.body.removeChild(temp);
    
    // Extract rgb values from computed color (format: "rgb(r, g, b)" or "rgba(r, g, b, a)")
    const rgbMatch = computed.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
        return `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${opacity})`;
    }
    
    // Fallback
    return color;
}

function renderSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = skillsData.map(skill => {
        // Get color from skill data, default to green if not provided
        const color = skill.color || '#10b981';
        
        // Create second color with 0.5 opacity for gradient
        const colorWithOpacity = colorToRgba(color, 0.5);
        
        // Create progress bar background with opacity
        const barBg = colorToRgba(color, 0.15);
        
        // Create text shadow color with 0.5 opacity
        const textShadowColor = colorToRgba(color, 0.5);
        const textShadow = `0 0 3px ${textShadowColor}`;
        
        return `
        <div class="skill-card">
            <div class="skill-head">
                <img src="${skill.icon}" alt="${skill.name}" class="skill-icon">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-spacer"></span>
                <span class="skill-badge skill-badge--complete" style="color: ${color}; text-shadow: ${textShadow};">${skill.badgeText}</span>
            </div>
            <div class="skill-bar" style="background: ${barBg};">
                <span class="skill-fill" style="--percent:${skill.percent || 100}%; background: linear-gradient(90deg, ${color}, ${colorWithOpacity}); background-size: 200% 200%;"></span>
            </div>
        </div>
        `;
    }).join('');
}

function initSkills() {
    renderSkills();
}
