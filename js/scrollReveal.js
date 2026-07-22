const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-item');
    
    // Add staggered delays for items in grids (like projects)
    const grids = document.querySelectorAll('.projects-grid');
    grids.forEach(grid => {
        const children = grid.querySelectorAll('.reveal-item');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 80}ms`;
        });
    });

    revealElements.forEach(el => observer.observe(el));
});
