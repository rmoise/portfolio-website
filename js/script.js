document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('[data-collapse-toggle]');
  const menu = document.getElementById('navbar-multi-level');

  if (!menuButton || !menu) {
    console.error('Menu button or menu not found');
    return;
  }

  // Function to close the menu
  function closeMenu() {
    if (menuButton.getAttribute('aria-expanded') === 'true') {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      console.log('Menu closed');
    }
  }

  // Handle menu button clicks
  menuButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click event from propagating to document
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    if (!isExpanded) {
      menuButton.setAttribute('aria-expanded', 'true');
      menu.classList.remove('hidden');
      console.log('Menu opened');
    } else {
      closeMenu();
    }
  });

  // Handle clicks outside the menu to close it
  function handleClickOutside(event) {
    if (!menuButton.contains(event.target) && !menu.contains(event.target)) {
      closeMenu();
    }
  }

  // Add event listeners for clicks and touch events to close the menu
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('touchend', handleClickOutside); // Handle touch events on mobile

  // Prevent clicks inside the menu from closing it
  menu.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  // Initial scroll into view for hash links
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // Form handling logic
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      };

      console.log('Submitting form with data:', data);

      try {
        const response = await fetch('https://portfolio-site-gold-six.vercel.app/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response from server:', errorData);
          throw new Error(errorData.error || 'Network response was not ok');
        }

        showNotification('Your message has been sent successfully!');
        form.reset();
      } catch (error) {
        console.error('Error during form submission:', error);
        showNotification('There was an error sending your message. Please try again.', 'error');
      }
    });
  }

  function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');

    if (notification && messageElement) {
      messageElement.textContent = message;
      notification.classList.remove('hidden');

      if (type === 'error') {
        notification.classList.remove('bg-brightGreen');
        notification.classList.add('bg-red-500');
      } else {
        notification.classList.remove('bg-red-500');
        notification.classList.add('bg-brightGreen');
      }

      setTimeout(() => {
        notification.classList.add('hidden');
      }, 5000);
    }
  }
});
