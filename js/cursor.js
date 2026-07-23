const cursor = document.getElementById('custom-cursor');
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice && cursor) {
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const loop = () => {
        // Add easing for "lag" effect
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
        requestAnimationFrame(loop);
    };
    
    loop();

    // Hover effect on links, buttons and headings
    const interactables = document.querySelectorAll('a, button, .project-card, .skill-badge, h1, h2, h3, h4, h5, h6');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
} else {
    if(cursor) {
        cursor.style.display = 'none';
    }
}
