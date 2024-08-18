document.addEventListener('DOMContentLoaded', () => {
  // Utility Function to Show Notifications
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'bg-red-500' : 'bg-green bg-brightGreen'}`;
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('hidden');
      setTimeout(() => {
        notification.remove();
      }, 300); // Wait for hiding animation to complete
    }, 5000); // Show notification for 5 seconds
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
          showNotification('Form submitted successfully', 'success');
        } else {
          console.error('Form submission failed');
          showNotification('Form submission failed', 'error');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Error submitting form', 'error');
      }

      // Optionally handle post-submit behavior
      setTimeout(() => {
        console.log('Form submission timeout handling');
      }, 5000);
    });
  }

  // Smooth Scroll Handling
  const contactButton = document.querySelector('nav a[href="#contact"]');
  if (contactButton) {
    contactButton.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default action

      const targetElement = document.querySelector('#contact');
      if (targetElement) {
        const headerHeight = document.querySelector('nav').offsetHeight || 0;
        const additionalOffset = 80; // Adjust this value as needed

        const scrollToPosition = targetElement.offsetTop - headerHeight - additionalOffset;

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
