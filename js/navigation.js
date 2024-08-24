document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('main-nav');
    const subNav = document.getElementById('sub-nav');
    const body = document.body;
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuButton = document.querySelector('.menu-button'); // Make sure to have a button to open the menu
    let isMenuOpen = false;
    let scrollPosition = 0;

    function handleScroll() {
        if (!isMenuOpen) {
            const scrollY = window.scrollY;
            const mainNavHeight = mainNav.offsetHeight;
            const scrollThreshold = 5;

            if (scrollY > mainNavHeight) {
                if (scrollY > scrollPosition + scrollThreshold) {
                    mainNav.style.transform = `translateY(-${mainNavHeight}px)`;
                    subNav.style.transform = `translateY(-${mainNavHeight}px)`;
                } else if (scrollY < scrollPosition - scrollThreshold) {
                    mainNav.style.transform = 'translateY(0)';
                    subNav.style.transform = 'translateY(0)';
                }
            } else {
                mainNav.style.transform = 'translateY(0)';
                subNav.style.transform = 'translateY(0)';
            }

            scrollPosition = scrollY;
        }
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            // Store current scroll position
            scrollPosition = window.scrollY;

            // Lock the body scroll
            body.style.overflow = 'hidden';
            body.style.position = 'fixed';
            body.style.top = `-${scrollPosition}px`;
            body.style.left = '0';
            body.style.width = '100%';
            body.style.height = '100vh';

            mobileMenu.classList.add('open');
            mainNav.style.transform = 'translateY(0)'; // Ensure main nav is visible
        } else {
            // Unlock the body scroll and restore scroll position
            body.style.overflow = '';
            body.style.position = '';
            body.style.top = '';
            body.style.left = '';
            body.style.width = '';
            body.style.height = '';

            mobileMenu.classList.remove('open');

            // Restore scroll position
            window.scrollTo(0, scrollPosition);
        }
    }

    // Event listener for menu button to toggle the mobile menu
    if (menuButton) {
        menuButton.addEventListener('click', toggleMobileMenu);
    }

    // Add an event listener for clicks on mobile menu links
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default behavior if the menu is open
            if (isMenuOpen) {
                e.preventDefault();
                toggleMobileMenu();
                setTimeout(() => {
                    // Scroll to the section after closing the menu
                    window.location.href = this.href;
                }, 300); // Delay to allow menu transition
            }
        });
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize scroll effects
});