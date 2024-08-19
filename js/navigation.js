document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('main-nav');
    const subNav = document.getElementById('sub-nav');

    if (!mainNav || !subNav) {
        console.error('Element(s) not found!');
        return;
    }

    const mainNavHeight = mainNav.offsetHeight;
    let lastScrollTop = 0;
    let isScrollingDown = false;

    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > mainNavHeight) {
            isScrollingDown = scrollY > lastScrollTop;

            if (isScrollingDown) {
                mainNav.style.position = 'absolute';
                mainNav.style.top = `-${mainNavHeight}px`;
                subNav.style.position = 'fixed';
                subNav.style.top = '0';
                subNav.style.width = '100%';
            } else {
                mainNav.style.position = 'fixed';
                mainNav.style.top = '0';
                subNav.style.position = 'fixed';
                subNav.style.top = `${mainNavHeight}px`;
                subNav.style.width = '100%';
            }
        } else {
            mainNav.style.position = 'fixed';
            mainNav.style.top = '0';
            subNav.style.position = 'fixed';
            subNav.style.top = `${mainNavHeight}px`;
            subNav.style.width = '100%';
        }

        lastScrollTop = scrollY <= 0 ? 0 : scrollY;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
});
