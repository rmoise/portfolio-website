document.addEventListener('DOMContentLoaded', () => {
  // Function to show notification messages
  function showNotification(message, type = 'success') {
    const notification = document.querySelector('#notification');
    if (!notification) return;

    notification.classList.remove('hidden');
    notification.classList.remove('bg-green', 'bg-brightGreen', 'bg-red-500');

    if (type === 'error') {
      notification.classList.add('bg-red-500');
    } else {
      notification.classList.add('bg-green', 'bg-brightGreen');
    }

    const messageElement = notification.querySelector('#notification-message');
    if (messageElement) {
      messageElement.textContent = message;
    }

    setTimeout(() => {
      notification.classList.add('hidden');
    }, 5000);
  }

  // Smooth Scroll Handling
  function smoothScrollTo(targetId, offset = 80) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector('nav')?.offsetHeight || 0;
      const scrollToPosition = targetElement.offsetTop - headerHeight - offset;

      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
    } else {
      console.error(`Target element ${targetId} not found.`);
    }
  }

  // Smooth scroll to section on "View my Projects" button click
  const viewProjectsButton = document.querySelector('a[href="#portfolio"]');
  if (viewProjectsButton) {
    viewProjectsButton.addEventListener('click', function (e) {
      e.preventDefault();
      smoothScrollTo('#portfolio', 60);
    });
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

  // Smooth scroll to section on button container link click
  document.querySelectorAll('.button-container a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      smoothScrollTo(targetId, 60);
    });
  });

  function scrollSubNavToActiveLink(activeLink) {
    if (activeLink) {
      const subNavContainer = document.querySelector('.subnav-wrapper');
      if (subNavContainer) {
        const containerRect = subNavContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        const linkCenter = linkRect.left + linkRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const offset = linkCenter - containerCenter;

        subNavContainer.scrollLeft += offset;
      }
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
    const containerRect = document.querySelector('.subnav-wrapper')?.getBoundingClientRect();

    if (!containerRect) {
      console.error('Subnav wrapper not found.');
      return false;
    }

    return linkRect.right <= containerRect.right && linkRect.left >= containerRect.left;
  }

  initializeScrollObserver();

  // Page Load Animation
  const headline = document.getElementById('headline');
  const image = document.getElementById('image');

  if (headline) headline.classList.add('initial-hidden');
  if (image) image.classList.add('initial-hidden');

  setTimeout(() => {
    if (headline) headline.classList.add('visible');
    if (image) image.classList.add('visible');
  }, 100); // Delay to allow page rendering

  // Ensure no unwanted scroll handling or dynamic positioning affects the button
  const subNav = document.getElementById('sub-nav');
  const buttonContainer = document.querySelector('.button-container');

  if (subNav && buttonContainer) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > subNav.offsetHeight) {
        // Remove this line to avoid fixed positioning
        buttonContainer.style.position = 'relative';
      } else {
        buttonContainer.style.position = 'relative';
      }
    });
  } else {
    console.error('Sub-nav or Button container not found.');
  }

  // Form Handling
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

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
});