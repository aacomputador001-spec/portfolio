const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        
        // Validate Name
        if (!nameInput.value.trim()) {
            showError(nameInput);
            isValid = false;
        } else {
            removeError(nameInput);
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput);
            isValid = false;
        } else {
            removeError(emailInput);
        }

        // Validate Message
        if (!messageInput.value.trim()) {
            showError(messageInput);
            isValid = false;
        } else {
            removeError(messageInput);
        }

        if (isValid) {
            submitBtn.classList.add('loading');
            
            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('success');
                    contactForm.reset();
                    
                    // Reset success state after 3 seconds
                    setTimeout(() => {
                        submitBtn.classList.remove('success');
                    }, 3000);
                } else {
                    const data = await response.json();
                    let errorMessage = "Ocorreu um erro ao enviar sua mensagem.";
                    if (data.hasOwnProperty('errors')) {
                        errorMessage = data.errors.map(error => error.message).join(", ");
                    }
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error("Formspree Error:", error);
                submitBtn.classList.remove('loading');
                alert(error.message || "Ocorreu um erro ao enviar a mensagem. Verifique sua conexão e tente novamente.");
            }
        }
    });

    function showError(inputElement) {
        inputElement.closest('.form-group').classList.add('has-error');
    }

    function removeError(inputElement) {
        inputElement.closest('.form-group').classList.remove('has-error');
    }

    // Remove error styling on input
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => removeError(input));
    });
}
