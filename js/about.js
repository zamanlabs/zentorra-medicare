document.addEventListener('DOMContentLoaded', function() {
    // Fade in elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        setTimeout(() => {
            element.classList.add('show');
        }, 100);
    });

    // Animation for stats counters
    const statsElements = document.querySelectorAll('.stats-counter');
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // ms
        const step = Math.ceil(target / (duration / 16)); // 60fps
        let current = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(counter);
            } else {
                element.textContent = current.toLocaleString();
            }
        }, 16);
    };

    // Observe elements and trigger animation when they come into view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // If it's a stats counter, animate it
                    if (entry.target.classList.contains('stats-counter')) {
                        animateCounter(entry.target);
                    }
                    
                    // Add animation classes
                    entry.target.classList.add('show');
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        // Observe all stats counters and fade-in elements
        statsElements.forEach(element => observer.observe(element));
        fadeElements.forEach(element => observer.observe(element));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        statsElements.forEach(element => animateCounter(element));
        fadeElements.forEach(element => element.classList.add('show'));
    }

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    if ('IntersectionObserver' in window) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });

        timelineItems.forEach(item => timelineObserver.observe(item));
    } else {
        timelineItems.forEach(item => item.classList.add('animate-fade-in'));
    }

    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.querySelector('h4').classList.add('text-blue-500');
        });
        member.addEventListener('mouseleave', function() {
            this.querySelector('h4').classList.remove('text-blue-500');
        });
    });

    // Optional: Make company tagline typing effect
    const tagline = document.querySelector('.zentorra-tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        setTimeout(typeWriter, 1000);
    }
}); 