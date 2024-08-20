document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('main-nav');
    const subNav = document.getElementById('sub-nav');
    const body = document.body;
    const togglerBtn = document.querySelector('.toggler-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    let isMenuOpen = false;
    let scrollPosition = 0;

    function handleScroll() {
        if (!isMenuOpen) {
            const scrollY = window.scrollY;
            const mainNavHeight = mainNav.offsetHeight;
            const scrollThreshold = 5;

            console.log('Scroll Y:', scrollY);
            console.log('Last Scroll Position:', scrollPosition);

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

        console.log('Toggling menu, isMenuOpen:', isMenuOpen);

        if (isMenuOpen) {
            // Store current scroll position
            scrollPosition = window.scrollY;
            console.log('Opening menu, stored scroll position:', scrollPosition);

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

            // Debugging information before restoring
            console.log('Closing menu, restoring scroll position:', scrollPosition);

            // Delay scroll restoration
            setTimeout(() => {
                window.scrollTo(0, scrollPosition);
                console.log('Scroll restored to:', scrollPosition);
            }, 100); // Adjust timeout if necessary

            mobileMenu.classList.remove('open');
        }
    }

    togglerBtn.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize scroll effects
});
