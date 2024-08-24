window.addEventListener('scroll', function() {
    const logo = document.querySelector('.logo');
    const scrollY = window.scrollY;

    if (scrollY > 150) {
        logo.style.transform = 'translate(-50%, -50%) scale(0.8)';
    } else {
        logo.style.transform = 'translate(-50%, -50%) scale(1)';
    }
});
