document.addEventListener('DOMContentLoaded', () => {
    // Only run on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const wrapper = document.querySelector('.tilt-wrapper');
    const tiltElement = document.querySelector('.tilt-element');
    const glare = document.querySelector('.tilt-glare');

    if (!wrapper || !tiltElement) return;

    const maxTilt = 8; // Max tilt angle in degrees

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Value between -1 and 1
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        // Calculate rotation
        // Mouse on right (+percentX) -> rotateY positive
        // Mouse on bottom (+percentY) -> rotateX negative
        const rotateX = percentY * -maxTilt;
        const rotateY = percentX * maxTilt;
        
        tiltElement.classList.remove('spring-back');
        tiltElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Update glare position
        if (glare) {
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, transparent 60%)`;
        }
    });

    wrapper.addEventListener('mouseleave', () => {
        tiltElement.classList.add('spring-back');
        tiltElement.style.transform = `rotateX(0deg) rotateY(0deg)`;
        
        if (glare) {
            glare.style.opacity = '0';
        }
    });

    wrapper.addEventListener('mouseenter', () => {
        if (glare) {
            glare.style.opacity = '1';
        }
    });
});
