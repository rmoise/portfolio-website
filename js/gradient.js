document.addEventListener('DOMContentLoaded', function() {
  const subNavWrapper = document.querySelector('.subnav-wrapper');
  const gradientLeft = document.querySelector('.gradient-left');
  const gradientRight = document.querySelector('.gradient-right');

  function checkOverflow() {
    if (!subNavWrapper || !gradientLeft || !gradientRight) return; // Prevent errors if elements are not found

    // Calculate the total width of content and container
    const isOverflowing = subNavWrapper.scrollWidth > subNavWrapper.clientWidth;
    const scrollLeft = subNavWrapper.scrollLeft;
    const scrollWidth = subNavWrapper.scrollWidth;
    const clientWidth = subNavWrapper.clientWidth;

    console.log('scrollLeft:', scrollLeft);
    console.log('scrollWidth:', scrollWidth);
    console.log('clientWidth:', clientWidth);
    console.log('isOverflowing:', isOverflowing);

    // Show gradients based on overflow
    gradientLeft.style.opacity = (scrollLeft > 0 && isOverflowing) ? 1 : 0;
    gradientRight.style.opacity = ((scrollWidth - scrollLeft > clientWidth) && isOverflowing) ? 1 : 0;
  }

  // Initial check
  checkOverflow();

  // Check on window resize
  window.addEventListener('resize', checkOverflow);

  // Check on scroll
  subNavWrapper.addEventListener('scroll', checkOverflow);
});
