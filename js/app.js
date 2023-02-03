const contactForm = document.querySelector('#contact-form');
let email = document.getElementById('email');
let telephone = document.getElementById('telephone');
let message = document.getElementById('message');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let formData = {
    email: email.value,
    telephone: telephone.value,
    message: message.value,
  };
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onload = function(){
    console.log(xhr.responseText);
    if(xhr.responseText == 'success') {
        alert('Email sent');
        email.value = '';
        telephone.value = '';
        message.value = '';
    } else {
        alert('Something went wrong!')
    }
  }
  xhr.send(JSON.stringify(formData));
});
