document.addEventListener('DOMContentLoaded', function () {
  const subNavContainer = document.querySelector('.sub-nav-container');
  const gradientLeft = document.querySelector('.gradient-left');
  const gradientRight = document.querySelector('.gradient-right');

  function updateGradients() {
    const scrollLeft = subNavContainer.scrollLeft;
    const maxScrollLeft = subNavContainer.scrollWidth - subNavContainer.clientWidth;

    const activeNavItem = subNavContainer.querySelector('li.active');
    const lastNavItem = subNavContainer.querySelector('li:last-child');

    // Directly check if the last item is active or very close to the end
    if (activeNavItem === lastNavItem || scrollLeft >= maxScrollLeft - 1) {
      gradientRight.classList.remove('visible');
    } else {
      gradientRight.classList.add('visible');
    }

    // Show or hide the left gradient based on the scroll position
    if (scrollLeft > 0) {
      gradientLeft.classList.add('visible');
    } else {
      gradientLeft.classList.remove('visible');
    }
  }

  // Initial check
  updateGradients();

  // Update gradients on scroll
  subNavContainer.addEventListener('scroll', updateGradients);

  // Update gradients on window resize
  window.addEventListener('resize', updateGradients);

  // Update gradients when active state changes
  const observer = new MutationObserver(updateGradients);
  observer.observe(subNavContainer, { childList: true, subtree: true, attributes: true });

  // Force update when the last item becomes active
  document.querySelectorAll('.sub-nav-container li').forEach(item => {
    item.addEventListener('click', () => {
      setTimeout(updateGradients, 100); // Slight delay to ensure scroll position settles
    });
  });
});
