window.initInteractiveTitle = function() {
    const titleEl = document.getElementById('interactive-title');

    if (!titleEl) return;

    // Remove old letters if already initialized (to prevent nesting)
    if (titleEl.querySelector('.draggable-letter')) {
        // Just extract text and elements back, or rely on i18n replacing the whole innerHTML beforehand
        // Note: i18n.js will replace innerHTML with pure text/html before calling this.
    }

    const wrapLetters = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === ' ' || char === '\n' || char === '\t') {
                    fragment.appendChild(document.createTextNode(char));
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'draggable-letter';
                    fragment.appendChild(span);
                }
            }
            return fragment;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const clone = node.cloneNode(false);
            Array.from(node.childNodes).forEach(child => {
                clone.appendChild(wrapLetters(child));
            });
            return clone;
        } else {
            return node.cloneNode(true);
        }
    };

    const newContent = document.createDocumentFragment();
    Array.from(titleEl.childNodes).forEach(child => {
        newContent.appendChild(wrapLetters(child));
    });

    titleEl.innerHTML = '';
    titleEl.appendChild(newContent);

    const letters = titleEl.querySelectorAll('.draggable-letter');
    
    letters.forEach(letter => {
        let isDragging = false;
        let startX, startY;
        let translateX = 0, translateY = 0;
        
        const onDown = (e) => {
            isDragging = true;
            letter.classList.remove('spring-back');
            letter.classList.add('is-dragging');
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            startX = clientX - translateX;
            startY = clientY - translateY;
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onUp);
            document.addEventListener('touchend', onUp);
        };
        
        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault(); 
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            translateX = clientX - startX;
            translateY = clientY - startY;
            
            letter.style.transform = `translate(${translateX}px, ${translateY}px)`;
        };
        
        const onUp = () => {
            if (!isDragging) return;
            isDragging = false;
            letter.classList.remove('is-dragging');
            letter.classList.add('spring-back');
            
            translateX = 0;
            translateY = 0;
            letter.style.transform = `translate(0px, 0px)`;
            
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchend', onUp);
            
            setTimeout(() => {
                if (!isDragging) {
                    letter.classList.remove('spring-back');
                }
            }, 400);
        };
        
        letter.addEventListener('mousedown', onDown);
        letter.addEventListener('touchstart', onDown, { passive: false });
    });
};

// Initial call
document.addEventListener('DOMContentLoaded', window.initInteractiveTitle);
