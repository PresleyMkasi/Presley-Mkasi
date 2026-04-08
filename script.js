if (document.querySelector(".typing")) {
    // Only init Typed.js if the target element exists.
    var typed = new Typed(".typing", {
        strings: ["", "AI Software Engineer"],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });
}

// Mobile nav toggle (hamburger menu)
(function() {
    const navToggler = document.querySelector('.nav-toggler');
    const aside = document.querySelector('.aside');
    if (!navToggler || !aside) return;
    const backToTop = document.querySelector('.back-to-top');

    navToggler.addEventListener('click', function() {
        navToggler.classList.toggle('open');
        aside.classList.toggle('open');
    });

    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1199) {
                navToggler.classList.remove('open');
                aside.classList.remove('open');
            }
        });
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        if (window.innerWidth > 1199) return;
        const currentY = window.scrollY;
        const scrollingDown = currentY > lastScrollY;
        if (scrollingDown) {
            navToggler.classList.add('nav-hidden');
            navToggler.classList.remove('open');
            aside.classList.remove('open');
        } else {
            navToggler.classList.remove('nav-hidden');
        }
        lastScrollY = currentY;
    }, { passive: true });

    if (backToTop) {
        const contactSection = document.getElementById('contact');
        window.addEventListener('scroll', function() {
            if (!contactSection) return;
            const rect = contactSection.getBoundingClientRect();
            const reachedBottom = rect.bottom <= window.innerHeight;
            if (reachedBottom) {
                backToTop.classList.add('is-visible');
            } else {
                backToTop.classList.remove('is-visible');
            }
        }, { passive: true });
    }
})();

// EmailJS form handling
(function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const statusEl = document.getElementById('form-status');

    function setStatus(message, type) {
        if (!statusEl) return;
        statusEl.textContent = message || "";
        statusEl.classList.remove('is-visible', 'is-success', 'is-error');
        if (!message) return;
        statusEl.classList.add('is-visible');
        statusEl.classList.add(type === 'success' ? 'is-success' : 'is-error');
    }

    const publicKey = (contactForm.dataset.emailjsPublicKey || "").trim();
    const serviceId = (contactForm.dataset.emailjsServiceId || "").trim();
    const templateId = (contactForm.dataset.emailjsTemplateId || "").trim();
    const emailTo = (contactForm.dataset.emailTo || "").trim();

    const emailjsReady = typeof window.emailjs !== 'undefined' &&
        window.emailjs &&
        typeof window.emailjs.init === 'function' &&
        typeof window.emailjs.send === 'function';

    const configured = Boolean(publicKey && serviceId && templateId);

    if (emailjsReady && configured) {
        // Initialize EmailJS once when properly configured.
        window.emailjs.init(publicKey);
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        setStatus("", "success");

        // Get form data
        const formData = new FormData(this);
        const templateParams = {
            from_name: formData.get('fullname'),
            from_email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_name: 'Presley Mkasi' // Your name
        };

        // Show loading state
        const submitBtn = contactForm.querySelector('input[type="submit"], button[type="submit"]');
        const originalText = submitBtn && 'value' in submitBtn ? submitBtn.value : (submitBtn ? submitBtn.textContent : "");
        if (submitBtn) {
            if ('value' in submitBtn) submitBtn.value = 'Sending...';
            else submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }

        function resetButton() {
            if (!submitBtn) return;
            if ('value' in submitBtn) submitBtn.value = originalText;
            else submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }

        // Primary path: EmailJS (requires config + CDN loaded)
        if (emailjsReady && configured) {
            window.emailjs.send(serviceId, templateId, templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    setStatus('Thanks, your message was sent.', 'success');
                    contactForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    setStatus('Sorry, something went wrong sending your message. Please try again.', 'error');
                })
                .finally(resetButton);
            return;
        }

        // Fallback path: open the user's email client with a prefilled draft.
        if (emailTo) {
            const subject = String(templateParams.subject || "").trim();
            const bodyLines = [
                `From: ${templateParams.from_name || ""}`,
                `Email: ${templateParams.from_email || ""}`,
                `Phone: ${templateParams.phone || ""}`,
                "",
                String(templateParams.message || "")
            ];

            const mailto = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
            window.location.href = mailto;
            setStatus('Opening your email app to send the message...', 'success');
            resetButton();
            return;
        }

        // Not configured: show a clear, actionable message.
        const missing = [];
        if (!emailjsReady) missing.push('EmailJS script not loaded');
        if (!publicKey) missing.push('data-emailjs-public-key');
        if (!serviceId) missing.push('data-emailjs-service-id');
        if (!templateId) missing.push('data-emailjs-template-id');
        if (!emailTo) missing.push('data-email-to (optional fallback)');

        setStatus(
            `Form isn't configured to send yet. Missing: ${missing.join(', ')}.`,
            'error'
        );
        resetButton();
    });
})();
