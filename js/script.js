document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form'); // Ensure you use the correct form ID

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    console.log('Form Data:', data); // Debugging: Check if form data is correct

    try {
      const response = await fetch('https://portfolio-site-gold-six.vercel.app/api/send-email', { // Use the correct API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check response status
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(errorData.error || 'Network response was not ok');
      }

      // Show success notification
      alert('Your message has been sent successfully!');
      form.reset(); // Optionally reset form fields
    } catch (error) {
      console.error('Error during form submission:', error); // Log client-side error
      alert('There was an error sending your message. Please try again.');
    }
  });
});
