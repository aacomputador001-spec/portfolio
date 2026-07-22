const progressBar = document.getElementById('scroll-progress-bar');

if (progressBar) {
    const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        let scrollPercentage = 0;
        if (scrollHeight > 0) {
            scrollPercentage = (scrollTop / scrollHeight) * 100;
        }
        
        progressBar.style.width = scrollPercentage + '%';
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateProgress);
    });
    
    // Initial call
    updateProgress();
}
