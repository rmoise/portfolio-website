document.addEventListener('DOMContentLoaded', () => {
  const subNavContainer = document.querySelector('.subnav-wrapper');
  const rightGradient = document.querySelector('.right-gradient');
  const testimonialsLink = document.querySelector('a[href="#testimonials"]');
  const recentVisualsLink = document.querySelector('a[href="#recent-visuals"]');

  // Smooth scroll to section on "Contact" button click
  const contactButton = document.querySelector('nav a[href="#contact"]');
  if (contactButton) {
    contactButton.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default action

      const targetElement = document.querySelector('#contact');
      if (targetElement) {
        const headerHeight = document.querySelector('nav').offsetHeight || 0;
        const additionalOffset = 80; // Adjust this value as needed

        // Calculate scroll position
        const scrollToPosition = targetElement.offsetTop - headerHeight - additionalOffset;

        // Smooth scrolling
        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  // Smooth scroll to section on sub-nav link click
  document.querySelectorAll('.sub-nav-container a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector('nav').offsetHeight || 0;
        const additionalOffset = 60; // Adjust this value as needed

        const scrollToPosition = targetElement.offsetTop - headerHeight - additionalOffset;

        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  function scrollSubNavToActiveLink(activeLink) {
    if (activeLink) {
      const containerRect = subNavContainer.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      const linkCenter = linkRect.left + linkRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const offset = linkCenter - containerCenter;

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

      navLinks.forEach(link => {
        link.classList.remove('active');
      });

      if (currentActiveIndex > -1) {
        const activeLink = navLinks[currentActiveIndex];
        activeLink.classList.add('active');
        scrollSubNavToActiveLink(activeLink);

        // Adjust gradient visibility based on visibility of Recent Visuals or Testimonials links
        const isRecentVisualsVisible = isLinkFullyVisible(recentVisualsLink);
        const isTestimonialsVisible = isLinkFullyVisible(testimonialsLink);

        if (isRecentVisualsVisible || isTestimonialsVisible) {
          rightGradient.style.display = 'none';
        } else {
          rightGradient.style.display = 'block';
        }
      }
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  function isLinkFullyVisible(link) {
    const linkRect = link.getBoundingClientRect();
    const containerRect = subNavContainer.getBoundingClientRect();

    return linkRect.right <= containerRect.right && linkRect.left >= containerRect.left;
  }

  initializeScrollObserver();

  // Listen for horizontal scroll in the subnav-wrapper
  subNavContainer.addEventListener('scroll', () => {
    const isRecentVisualsVisible = isLinkFullyVisible(recentVisualsLink);
    const isTestimonialsVisible = isLinkFullyVisible(testimonialsLink);

    // Check if either Recent Visuals or Testimonials links are fully visible in the container
    if (isRecentVisualsVisible || isTestimonialsVisible) {
      rightGradient.style.display = 'none';
    } else {
      rightGradient.style.display = 'block';
    }
  });
});
