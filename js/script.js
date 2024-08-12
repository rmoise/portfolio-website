// Toggle the menu visibility on button click
const btn = document.getElementById('menu-btn');
const nav = document.getElementById('menu');

btn.addEventListener('click', () => {
  btn.classList.toggle('open');
  nav.classList.toggle('flex');
  nav.classList.toggle('hidden');
});

// Update the navigation dots based on the closest section to the top
function updateList() {
  const titles = [...document.querySelectorAll('h1, h2')].sort((a, b) => {
    return Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top);
  });

  document.querySelectorAll(".selected-circle").forEach(c => c.classList.remove("selected-circle"));

  document.querySelectorAll(".nav-dot")[[...document.querySelectorAll('h1, h2')].indexOf(titles[0])].classList.add("selected-circle");
}

updateList();
window.addEventListener('scroll', () => {
  updateList();
});

// Reset the form fields
const formButton = document.getElementById('form-btn');

function resetForm() {
  document.getElementById('form-name').value = '';
  document.getElementById('form-email').value = '';
  document.getElementById('form-message').value = '';
}

formButton.addEventListener('click', (event) => {
  event.preventDefault();
  resetForm();
  alert("Form has been reset!");
});

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('https://portfolio-site-cv3j6dd6b-roderick-moises-projects.vercel.app/api/send-email', {
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

      alert('Your message has been sent!');
      form.reset();
    } catch (error) {
      console.error('Error during form submission:', error); // Log client-side error
      alert('There was an error sending your message. Please try again.');
    }
  });
});
