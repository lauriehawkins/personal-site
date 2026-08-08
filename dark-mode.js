// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(currentTheme + '-mode');
    updateToggleButton(currentTheme === 'dark');

    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        const isDark = body.classList.contains('dark-mode');

        if (isDark) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            updateToggleButton(false);
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            updateToggleButton(true);
        }
    });

    function updateToggleButton(isDark) {
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        darkModeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
});
