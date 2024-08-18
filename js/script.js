document.addEventListener('DOMContentLoaded', () => {
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
          method: 'POST', // Ensure this is POST
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
