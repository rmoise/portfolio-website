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
                    mainNav.classList.remove('show');
                    mainNav.style.top = `-${mainNavHeight}px`;
                    subNav.classList.add('sub-nav-fixed');
                    subNav.style.top = '0';
                    subNav.style.opacity = '1';
                } else if (isScrollingUp) {
                    mainNav.classList.add('show');
                    mainNav.style.top = '0';
                    subNav.classList.add('sub-nav-fixed');
                    subNav.style.top = `${mainNavHeight}px`;
                    subNav.style.opacity = '1';
                }
            } else {
                mainNav.classList.add('show');
                mainNav.style.top = '0';
                subNav.classList.remove('sub-nav-fixed');
                subNav.style.top = `${mainNavHeight}px`;
                subNav.style.opacity = '1';
            }
        }
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            body.classList.add('body-scroll-lock');
            mainNav.classList.add('main-nav-scroll-lock');
            mobileMenu.classList.add('open');
            mainNav.style.position = 'fixed';
            mainNav.style.top = '0';
            mainNav.style.width = '100%';
            mainNav.style.zIndex = '1000';
            body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        } else {
            body.classList.remove('body-scroll-lock');
            mainNav.classList.remove('main-nav-scroll-lock');
            mobileMenu.classList.remove('open');
            mainNav.style.position = '';
            mainNav.style.top = '';
            mainNav.style.width = '';
            mainNav.style.zIndex = '';
            body.style.overflow = '';
        }
    }

    togglerBtn.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);
    handleScroll();  // Initialize scroll effects
});
