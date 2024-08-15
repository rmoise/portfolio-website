// Smooth scrolling functionality
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Adjust the timeout duration if necessary
  }

  // Existing form handling logic
  const form = document.querySelector('form');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      };

      console.log('Submitting form with data:', data); // Debugging output

      try {
        const response = await fetch('https://portfolio-site-gold-six.vercel.app/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          // Read the error response from the server
          const errorData = await response.json();
          console.error('Error response from server:', errorData); // Log server response error
          throw new Error(errorData.error || 'Network response was not ok');
        }

        // Show success notification
        showNotification('Your message has been sent successfully!');
        form.reset();
      } catch (error) {
        console.error('Error during form submission:', error); // Log client-side error
        showNotification('There was an error sending your message. Please try again.', 'error');
      }
    });
  }
});

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
    }, 5000); // Hide after 5 seconds
  }
}
