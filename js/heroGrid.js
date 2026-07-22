document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-grid-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('hero');
    const htmlEl = document.documentElement;
    
    let width, height;
    const gridSize = 40;
    let mouse = { x: -1000, y: -1000 };
    const radius = 200; // light radius
    
    function resize() {
        width = heroSection.clientWidth;
        height = heroSection.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    heroSection.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        const isDark = htmlEl.classList.contains('dark');
        
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                // center of the grid cell
                const cellX = x + gridSize / 2;
                const cellY = y + gridSize / 2;
                
                const dx = mouse.x - cellX;
                const dy = mouse.y - cellY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < radius) {
                    const intensity = 1 - (dist / radius);
                    // smoothly fade out based on distance
                    const opacity = intensity * 0.08; // max opacity
                    
                    if (isDark) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    } else {
                        // More visible in light mode
                        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 1.8})`;
                    }
                    
                    // Draw cell with 1px margin
                    ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
                }
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    requestAnimationFrame(draw);
});
