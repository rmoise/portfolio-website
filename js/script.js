document.addEventListener('DOMContentLoaded', () => {
  // Notification Handling
  const notification = document.querySelector('.notification'); // Ensure this element exists in your HTML

  function showNotification(message, type = 'success') {
    if (!notification) return; // Exit if no notification element

    notification.classList.remove('hidden');

    // Clear previous background classes
    notification.classList.remove('bg-green', 'bg-brightGreen', 'bg-red-500');

    if (type === 'error') {
      notification.classList.add('bg-red-500');
    } else {
      notification.classList.add('bg-green', 'bg-brightGreen');
    }

    notification.textContent = message; // Set notification message

    setTimeout(() => {
      notification.classList.add('hidden');
    }, 5000); // Hide after 5 seconds
  }

  // Menu Button Handling
  const menuButton = document.querySelector('[data-collapse-toggle]');
  const menu = document.getElementById('navbar-multi-level');

  if (menuButton && menu) {
    function closeMenu() {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      console.log('Menu closed');
    }

    menuButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent click event from propagating to document
      // Let Flowbite handle the menu toggling
    });

    function handleClickOutside(event) {
      if (!menuButton.contains(event.target) && !menu.contains(event.target)) {
        closeMenu();
      }
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside); // Handle touch events on mobile

    menu.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  // Initial scroll into view for hash links
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // Form Handling
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('https://portfolio-site-gold-six.vercel.app/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          console.log('Form submitted successfully');
          form.reset();
          showNotification('Form submitted successfully!', 'success');
        } else {
          console.error('Form submission failed');
          showNotification('Form submission failed. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('An error occurred. Please try again later.', 'error');
      }
    });
  }

  // Smooth Scroll Handling
  function smoothScrollTo(targetId, offset = 80) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector('nav').offsetHeight || 0;
      const scrollToPosition = targetElement.offsetTop - headerHeight - offset;

      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
    }
  }

  // Smooth scroll to section on "Contact" button click
  const contactButton = document.querySelector('nav a[href="#contact"]');
  if (contactButton) {
    contactButton.addEventListener('click', function (e) {
      e.preventDefault();
      smoothScrollTo('#contact', 80);
    });
  }

  // Smooth scroll to section on sub-nav link click
  document.querySelectorAll('.sub-nav-container a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      smoothScrollTo(targetId, 60);
    });
  });

  function scrollSubNavToActiveLink(activeLink) {
    if (activeLink) {
      const subNavContainer = document.querySelector('.subnav-wrapper');
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
        const rightGradient = document.querySelector('.right-gradient');
        const testimonialsLink = document.querySelector('a[href="#testimonials"]');
        const recentVisualsLink = document.querySelector('a[href="#recent-visuals"]');

        if (rightGradient && testimonialsLink && recentVisualsLink) {
          const isRecentVisualsVisible = isLinkFullyVisible(recentVisualsLink);
          const isTestimonialsVisible = isLinkFullyVisible(testimonialsLink);

          if (isRecentVisualsVisible || isTestimonialsVisible) {
            rightGradient.style.display = 'none';
          } else {
            rightGradient.style.display = 'block';
          }
        }
      }
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  function isLinkFullyVisible(link) {
    const linkRect = link.getBoundingClientRect();
    const containerRect = document.querySelector('.subnav-wrapper').getBoundingClientRect();

    return linkRect.right <= containerRect.right && linkRect.left >= containerRect.left;
  }

  initializeScrollObserver();

  // Listen for horizontal scroll in the subnav-wrapper
  const subNavContainer = document.querySelector('.subnav-wrapper');
  const rightGradient = document.querySelector('.right-gradient');
  const testimonialsLink = document.querySelector('a[href="#testimonials"]');
  const recentVisualsLink = document.querySelector('a[href="#recent-visuals"]');

  if (subNavContainer && rightGradient && testimonialsLink && recentVisualsLink) {
    subNavContainer.addEventListener('scroll', () => {
      const isRecentVisualsVisible = isLinkFullyVisible(recentVisualsLink);
      const isTestimonialsVisible = isLinkFullyVisible(testimonialsLink);

      if (isRecentVisualsVisible || isTestimonialsVisible) {
        rightGradient.style.display = 'none';
      } else {
        rightGradient.style.display = 'block';
      }
    });
  }
});
