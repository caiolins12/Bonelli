document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.botoes-acoes');
    
    // Toggle menu function
    function toggleMenu(event) {
        event.stopPropagation();
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a menu item
    const menuItems = document.querySelectorAll('.botoes-acoes a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});