document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  let navbarOpen = false;
  let scrollPosition = 0;

  // Lock scroll function (preserving the scroll position)
  function lockScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';

    console.log("Locking scroll at position:", scrollPosition);
  }

  // Unlock scroll function and ensure mainNav visibility
  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition); // Restore scroll position

    console.log("Unlocking scroll. Scroll back to position:", scrollPosition);
  }

  // Toggle the menu and lock/unlock scroll
  menuToggle.addEventListener('click', function (event) {
    event.preventDefault();
    navbarOpen = !navbarOpen;
    if (navbarOpen) {
      lockScroll(); // Lock scroll when the nav is open
    } else {
      unlockScroll(); // Unlock scroll when the nav is closed
    }

    console.log("Navbar toggled. Navbar Open:", navbarOpen);
  });

  // Close the menu and unlock scroll on link click (for mobile and desktop)
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault(); // Prevent default anchor behavior

        // Smooth scroll to the section
        const offset = 50; // Adjust this offset as needed based on header height
        const position = targetElement.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: position,
          behavior: 'smooth',
        });

        console.log("Scrolling to target:", targetId, "Position:", position);

        // Close the mobile menu and unlock scroll
        if (navbarOpen) {
          navbarOpen = false;
          unlockScroll(); // Unlock scroll after clicking the link
        }
      }
    });
  });
});
