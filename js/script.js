const btn = document.getElementById('menu-btn')
const nav = document.getElementById('menu')

btn.addEventListener('click', () => {
  btn.classList.toggle('open')
  nav.classList.toggle('flex')
  nav.classList.toggle('hidden')
})

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
})


const formButton = document.getElementsById('form-btn');

function resetForm() {
  document.getElementsById('form-name').value = null;
  document.getElementsById('form-email').value = null;
  document.getElementsById('form-message') = null;
}

resetForm();
formButton.addEventListener('click', () => {
  resetForm();
  alert("it works")
})
