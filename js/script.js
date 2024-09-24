document.addEventListener('DOMContentLoaded', () => {
  // Function to show notification messages
  function showNotification(message, type = 'success') {
    const notification = document.querySelector('#notification');
    if (!notification) return;

    notification.classList.remove(
      'hidden',
      'bg-green',
      'bg-brightGreen',
      'bg-red-500'
    );

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


  // Form handling
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(
          'https://portfolio-site-gold-six.vercel.app/api/send-email',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );

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

  // Reveal elements after the page has fully loaded
  window.addEventListener('load', () => {
    if (headline) {
      headline.classList.remove('initial-hidden');
    }
    if (image) {
      image.classList.remove('initial-hidden');
    }
  });
});
