document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('main-nav');
    const subNav = document.getElementById('sub-nav');
    const body = document.body;
    const togglerBtn = document.querySelector('.toggler-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    let isMenuOpen = false;
    let lastScrollTop = 0;
    const scrollThreshold = 5; // Minimum scroll distance to trigger effects

    function handleScroll() {
        if (!isMenuOpen) {
            const scrollY = window.scrollY;
            const mainNavHeight = mainNav.offsetHeight;
            let isScrollingDown = scrollY > lastScrollTop + scrollThreshold;
            let isScrollingUp = scrollY < lastScrollTop - scrollThreshold;
            lastScrollTop = scrollY <= 0 ? 0 : scrollY;

            if (scrollY > mainNavHeight) {
                if (isScrollingDown) {
                    mainNav.style.transform = `translateY(-${mainNavHeight}px)`;
                    subNav.style.transform = `translateY(-${mainNavHeight}px)`;
                } else if (isScrollingUp) {
                    mainNav.style.transform = 'translateY(0)';
                    subNav.style.transform = 'translateY(0)';
                }
            } else {
                mainNav.style.transform = 'translateY(0)';
                subNav.style.transform = 'translateY(0)';
            }
        }
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            body.classList.add('body-scroll-lock');
            mainNav.classList.add('main-nav-scroll-lock');
            mobileMenu.classList.add('open');
            mainNav.style.transform = 'translateY(0)';
        } else {
            body.classList.remove('body-scroll-lock');
            mainNav.classList.remove('main-nav-scroll-lock');
            mobileMenu.classList.remove('open');
            mainNav.style.transform = '';
        }
    }

    togglerBtn.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize scroll effects
});
