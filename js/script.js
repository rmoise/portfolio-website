document.addEventListener('DOMContentLoaded', () => {
  function scrollSubNavToActiveLink(activeLink) {
    if (activeLink) {
      const subNavContainer = document.querySelector('.subnav-wrapper');
      const containerRect = subNavContainer.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      // Calculate the offset to center the active link within the container
      const linkCenter = linkRect.left + linkRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Determine the offset to center the active link
      const offset = linkCenter - containerCenter;

      // Adjust the scroll position to center the link
      subNavContainer.scrollLeft += offset;
    }
  }

  function initializeScrollObserver() {
    const navLinks = document.querySelectorAll('.sub-nav-container a');
    const sections = Array.from(navLinks)
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(el => el);

    const options = {
      root: null,
      rootMargin: '0px 0px -50% 0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      let currentActiveIndex = -1;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = sections.indexOf(entry.target);
          if (index !== -1) {
            currentActiveIndex = index;
          }
        }
      });

      navLinks.forEach((link, index) => {
        link.classList.remove('active');
      });

      if (currentActiveIndex > -1) {
        const activeLink = navLinks[currentActiveIndex];
        activeLink.classList.add('active');
        scrollSubNavToActiveLink(activeLink);
      }
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  initializeScrollObserver();
});