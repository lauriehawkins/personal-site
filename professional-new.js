// Animated counter for impact numbers
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate counters
            const counters = entry.target.querySelectorAll('[data-target]');
            counters.forEach(counter => {
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
            });

            // Add reveal class
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe sections
document.addEventListener('DOMContentLoaded', () => {
    // Observe impact cards
    document.querySelectorAll('.impact-card').forEach(card => {
        observer.observe(card);
    });

    // Observe story cards
    document.querySelectorAll('.story-card').forEach(card => {
        observer.observe(card);
    });

    // Hover effects on capability nodes
    const capNodes = document.querySelectorAll('.capability-node');
    capNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.style.transform = node.style.transform.replace('rotate(calc(-1 * var(--angle)))', 'rotate(calc(-1 * var(--angle))) scale(1.05)');
        });
        node.addEventListener('mouseleave', () => {
            node.style.transform = node.style.transform.replace('scale(1.05)', '');
        });
    });

    // Timeline node click to expand/collapse
    document.querySelectorAll('.node-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('collapsed')) {
                card.classList.remove('collapsed');
            }
        });
    });
});
