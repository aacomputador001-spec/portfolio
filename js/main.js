// Initialize general functionality
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Initialization done

    const flipCard = document.getElementById('about-flip-card');
    const flipCardContainer = document.querySelector('.flip-card-container');

    if (flipCard && flipCardContainer) {
        // Toggle Flip
        const wrapper = document.querySelector('.tilt-wrapper');
        if (wrapper) {
            wrapper.addEventListener('click', () => {
                flipCard.classList.toggle('is-flipped');
            });
        }
    }
});
