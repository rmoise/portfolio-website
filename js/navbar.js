// Ensure Alpine.js is included in your HTML
// <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>

document.addEventListener('alpine:init', () => {
  Alpine.data('navbar', () => ({
    // Existing properties
    navbarOpen: false,
    dropdownOpen: false,
    categoriesOpen: false,
    nestedDropdownOpen: false,
    currentPage: '',
    lastActiveIndex: -1,
    subNavContainer: null,
    subNavLinks: [],
    lastScrollY: 0,
    scrollPosition: 0,
    mainNav: null,
    subNav: null,
    scrollThreshold: 5,
        isLinkClicked: false,  // New flag to track if a link was clicked
            isScrolling: false,    // Track if a smooth scroll is in progress


    // New properties
    headline: null,
    image: null,
    notificationMessage: '',
    notificationType: 'success',
    notificationVisible: false,
    formData: {},
    // Initialize method
    init() {
      // Existing initialization
      this.currentPage = this.getCurrentPage();
      this.dropdownOpen =
        this.shouldExpandDropdown('portfolio') || window.innerWidth < 1024;
      this.categoriesOpen = this.shouldExpandDropdown('design-systems');
      this.nestedDropdownOpen = this.shouldExpandDropdown('web-dev');
      this.subNavContainer = document.querySelector('.sub-nav-container');
      this.subNavLinks = Array.from(
        document.querySelectorAll('.sub-nav-container a')
      );


  // Attach event listeners to each link for smooth scrolling
  this.subNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href'); // Get the section ID from the href attribute
      this.handleLinkClick(event, targetId); // Call smooth scroll handler
    });
  });

      // Initialize mainNav and subNav
      this.mainNav = document.getElementById('main-nav');
      this.subNav = document.getElementById('sub-nav');
      // Initialize scrollPosition
      this.scrollPosition = window.scrollY;
      // Initialize scroll observer
      this.initializeScrollObserver();
      // Initialize scroll event listener
      window.addEventListener('scroll', this.handleScroll.bind(this));
      this.handleScroll(); // Initialize scroll effects
      // Initialize headline and image for animations
      this.headline = document.getElementById('headline');
      this.image = document.getElementById('image');
      // Page load animations
      this.initializePageLoadAnimations();
      // Initialize form data
      this.formData = {};
    },
    // Method to get current page
    getCurrentPage() {
      const path = location.pathname.split('/').pop().replace('.html', '');
      return path ? path : 'index';
    },
    // Method to check if a page is active
    isActive(page) {
      return this.currentPage === page;
    },
    // Method to determine if a dropdown should be expanded
    shouldExpandDropdown(dropdown) {
      const dropdowns = {
        portfolio: [
          'karlstorzcase',
          'kytocase',
          'smunchcase',
          'cogalleriescase',
          'organize',
          'pffcase',
          'stak',
        ],
        'design-systems': [
          'karlstorzcase',
          'kytocase',
          'smunchcase',
          'cogalleriescase',
          'organize',
          'pffcase',
          'stak',
        ],
        'web-dev': ['pokemoncase', 'meetcase', 'myflixcase', 'chatappcase'],
      };
      return (
        dropdowns[dropdown] && dropdowns[dropdown].includes(this.currentPage)
      );
    },
    // Method to toggle the navbar
    toggleNavbar() {
  this.navbarOpen = !this.navbarOpen; // Toggle the open state
  const menu = document.getElementById('main-nav'); // Target the main-nav by its ID

  if (menu) {
    if (this.navbarOpen) {
      // Lock body scroll when the nav is open
      document.body.style.overflow = 'hidden';

      // Ensure main nav stays visible and fixed
      menu.style.position = 'fixed';
      menu.style.top = '0';
      menu.style.width = '100%';
    } else {
      // Unlock body scroll when the nav is closed
      document.body.style.overflow = 'auto';

      // Reset main nav position to normal
      menu.style.position = '';
      menu.style.top = '';
      menu.style.width = '';
    }
  } else {
    console.error('Navbar element not found: #main-nav');
  }
},

    // Method to restore dropdown states
    restoreDropdownStates() {
      this.dropdownOpen =
        this.shouldExpandDropdown('portfolio') || window.innerWidth < 1024;
      this.categoriesOpen = this.shouldExpandDropdown('design-systems');
      this.nestedDropdownOpen = this.shouldExpandDropdown('web-dev');
    },
    // Method to toggle dropdown
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
      if (this.dropdownOpen) {
        this.categoriesOpen = false;
        this.nestedDropdownOpen = false;
      }
    },
    // Method to toggle categories dropdown
    toggleCategories() {
      this.categoriesOpen = !this.categoriesOpen;
      if (this.categoriesOpen) {
        this.nestedDropdownOpen = false;
      }
    },
    // Method to toggle nested dropdown
    toggleNestedDropdown() {
      this.nestedDropdownOpen = !this.nestedDropdownOpen;
      if (this.nestedDropdownOpen) {
        this.categoriesOpen = false;
      }
    },
    // Method to close the navbar
    closeNavbar(excludeDropdownClose = false) {
      setTimeout(() => {
        this.navbarOpen = false;
        // Unlock the body scroll
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';

        const menu = document.getElementById('navbar-multi-level');
        if (menu) {
          menu.classList.remove('menu-scrollable');
        }

        if (!excludeDropdownClose) {
          this.dropdownOpen = false;
          this.categoriesOpen = false;
          this.nestedDropdownOpen = false;
        }

        // Restore the body scroll
        window.scrollTo(0, this.scrollPosition);
      }, 300);
    },
    // Method for smooth scrolling to a section
scrollToSection(section) {
  const targetElement = document.querySelector(section);

  // Check if the section was found and log it
  if (!targetElement) {
    console.error(`Element ${section} not found.`);
    return;
  }

  const headerHeight = this.mainNav ? this.mainNav.offsetHeight : 0;
  const subNavHeight = this.subNav ? this.subNav.offsetHeight : 0;



  // The space you want above the title (e.g., 50px)
  const spaceAboveTitle = 50;  // This will push the section stop higher than the title

  // Calculate the total offset (header + subNav + padding + space above the title)
  const totalOffset = headerHeight + subNavHeight + spaceAboveTitle;

  // Get the bounding rectangle of the section to calculate its position relative to the viewport
  const targetRect = targetElement.getBoundingClientRect();

  // Calculate the target's position relative to the document (scrollY + top)
  const targetOffsetTop = window.scrollY + targetRect.top;

  // Logging for debugging
  console.log({
    headerHeight,
    subNavHeight,
    sectionPadding,
    spaceAboveTitle,
    totalOffset,
    targetRectTop: targetRect.top,
    targetOffsetTop,
  });

  // Perform smooth scrolling to the calculated position, pushing stop slightly above the title
  window.scrollTo({
    top: Math.max(targetOffsetTop - totalOffset, 0),  // Ensure it doesn't scroll to a negative position
    behavior: 'smooth',
  });
},



    // Method to handle contact link click
handleContactClick() {
  // Close the navbar first
  this.closeNavbar(true); // Pass 'true' to exclude closing the dropdown, if needed

  // Use a slight delay to ensure that the navbar closes before scrolling
  setTimeout(() => {
    this.scrollToSection('#contact'); // Scroll to the contact section
  }, 300); // Adjust delay if necessary
},



 // Method to handle link clicks for smooth scrolling
    handleLinkClick(event, targetId) {
  event.preventDefault();

  console.log('Link clicked:', targetId); // Log when the link is clicked

  // Set flag to indicate that the scroll is triggered by a link click
  this.isLinkClicked = true;

  // Immediately show the mainNav when a link is clicked
  this.showMainNav();

  // Temporarily disable scroll event behavior during smooth scroll
  this.isScrolling = true;

  // Perform smooth scroll
  this.smoothScrollTo(targetId);

  // Highlight the clicked link
  this.highlightLink(targetId);

  // Close the navbar if open
  if (this.navbarOpen) {
    this.closeNavbar(true);
  }

  // Reset the scrolling state after smooth scroll is done
  setTimeout(() => {
    this.isLinkClicked = false;
    this.isScrolling = false;  // Re-enable scroll event behavior
  }, 1000); // Adjust the delay if needed to match the duration of smooth scroll
},


  // Method to show the mainNav and position subNav under it
    showMainNav() {
      if (this.mainNav && this.subNav) {
        // Make both mainNav and subNav slide into view together
        this.mainNav.style.transform = 'translateY(0)';
        this.subNav.style.transform = 'translateY(0)';

        // Calculate the mainNav height dynamically and set subNav position
        const mainNavHeight = this.mainNav.getBoundingClientRect().height;
        this.subNav.style.top = `${mainNavHeight}px`;
        this.subNav.style.position = 'fixed';  // Keep subNav fixed below mainNav
      }
    },
   smoothScrollTo(targetId) {
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    // Get dynamic height of mainNav and subNav
    const headerHeight = this.mainNav ? this.mainNav.offsetHeight : 0;
    const subNavHeight = this.subNav ? this.subNav.offsetHeight : 0;

    // Set spaceAboveTitle for desktop and mobile
    let spaceAboveTitle;
    if (window.innerWidth >= 1024) {
      // Desktop (screen width 1024px and above)
      spaceAboveTitle = -40;  // Customize this value for desktop
    } else {
      // Mobile (screen width below 1024px)
      spaceAboveTitle = 0;  // Customize this value for mobile
    }

    // Calculate the total offset (header + subNav + spaceAboveTitle)
    const totalOffset = headerHeight + subNavHeight + spaceAboveTitle;

    // Calculate the target's position
    const targetRect = targetElement.getBoundingClientRect();
    const targetPosition = window.scrollY + targetRect.top - totalOffset;

    // Logging for debugging
    console.log({
      targetId,
      headerHeight,
      subNavHeight,
      spaceAboveTitle,
      totalOffset,
      targetPosition,
    });

    // Scroll smoothly to the calculated position
    window.scrollTo({
      top: Math.max(targetPosition, 0),  // Ensure it doesn't scroll to a negative position
      behavior: 'smooth',
    });
  } else {
    console.error(`Target element ${targetId} not found.`);
  }
},




  // Highlight the corresponding link
    highlightLink(targetId) {
      const navLinks = this.subNavLinks;
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
          link.classList.add('active');
        }
      });
    },



scrollToSection(section) {
  const targetElement = document.querySelector(section);
  if (targetElement) {
    const headerHeight = this.mainNav ? this.mainNav.offsetHeight : 0;
    const subNavHeight = this.subNav ? this.subNav.offsetHeight : 0;
    const offset = headerHeight + subNavHeight + 20; // Adjust as needed
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

    // Perform smooth scrolling
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  } else {
    console.error(`Element ${section} not found.`);
  }
},


    // Method to scroll sub-nav to active link
    scrollSubNavToActiveLink(activeLink) {
      if (activeLink && this.subNavContainer) {
        const containerRect = this.subNavContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const linkCenter = linkRect.left + linkRect.width / 2;
        const containerCenter =
          containerRect.left + containerRect.width / 2;
        const offset = linkCenter - containerCenter;
        this.subNavContainer.scrollLeft += offset;
      }
    },
    // Initialize Intersection Observer for active links
   initializeScrollObserver() {
  const navLinks = this.subNavLinks;
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter((el) => el);

  let currentActiveIndex = -1;

  const onScroll = () => {
    let newActiveIndex = -1;
    const headerHeight = this.mainNav ? this.mainNav.offsetHeight : 0;
    const subNavHeight = this.subNav ? this.subNav.offsetHeight : 0;

    // Use the same fine-tuned offset as smoothScrollTo()
    const totalOffset = headerHeight + subNavHeight + 5;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top - totalOffset;
      const sectionBottom = rect.bottom - totalOffset;



      // Check if the section is in view (with adjusted offset)
      if (sectionTop <= 0 && sectionBottom > 0) {
        newActiveIndex = i;
        break;
      }
    }

    if (newActiveIndex !== currentActiveIndex) {
      // Remove 'active' class from all links
      navLinks.forEach((link) => {
        link.classList.remove('active');
      });

      if (newActiveIndex > -1) {
        const activeLink = navLinks[newActiveIndex];
        activeLink.classList.add('active');
        this.scrollSubNavToActiveLink(activeLink);
      }

      currentActiveIndex = newActiveIndex;
    }

    // Adjust gradient visibility (if needed)
    this.adjustGradientVisibility();
  };

  window.addEventListener('scroll', onScroll);
  onScroll(); // Initial call to set the active link
},


    // Method to check if a link is fully visible
    isLinkFullyVisible(link) {
      const linkRect = link.getBoundingClientRect();
      const containerRect =
        this.subNavContainer?.getBoundingClientRect();

      if (!containerRect) {
        console.error('Subnav container not found.');
        return false;
      }

      return (
        linkRect.right <= containerRect.right &&
        linkRect.left >= containerRect.left
      );
    },
    // Method to adjust gradient visibility
    adjustGradientVisibility() {
      const rightGradient = document.querySelector('.right-gradient');
      const testimonialsLink = document.querySelector(
        'a[href="#testimonials"]'
      );
      const recentVisualsLink = document.querySelector(
        'a[href="#recent-visuals"]'
      );

      if (rightGradient && testimonialsLink && recentVisualsLink) {
        const isRecentVisualsVisible = this.isLinkFullyVisible(
          recentVisualsLink
        );
        const isTestimonialsVisible = this.isLinkFullyVisible(
          testimonialsLink
        );

        rightGradient.style.display =
          isRecentVisualsVisible || isTestimonialsVisible
            ? 'none'
            : 'block';
      }
    },

    // Handle scroll event and dynamically manage mainNav and subNav behavior
    handleScroll() {
      if (!this.navbarOpen && !this.isLinkClicked && !this.isScrolling) {
        const scrollY = window.scrollY;
        const mainNavHeight = this.mainNav ? this.mainNav.offsetHeight : 0;
        const scrollThreshold = this.scrollThreshold;

        // Show or hide the mainNav based on manual scrolling
        if (scrollY > mainNavHeight) {
          if (scrollY > this.scrollPosition + scrollThreshold) {
            // Scroll down, slide up both mainNav and subNav together (connected)
            this.mainNav.style.transform = `translateY(-${mainNavHeight}px)`;
            this.subNav.style.transform = `translateY(-${mainNavHeight}px)`;  // Move subNav with mainNav
          } else if (scrollY < this.scrollPosition - scrollThreshold) {
            // Scroll up, slide down both mainNav and subNav together (connected)
            this.mainNav.style.transform = 'translateY(0)';
            this.subNav.style.transform = 'translateY(0)';  // Keep subNav right below mainNav
          }
        } else {
          // If we're at the top of the page, reset both mainNav and subNav
          this.mainNav.style.transform = 'translateY(0)';
          this.subNav.style.transform = 'translateY(0)'; // Move subNav below mainNav
          this.subNav.style.position = 'fixed'; // Keep subNav fixed below mainNav
        }

        // Track scroll position to determine direction of next scroll
        this.scrollPosition = scrollY;
      }
    },


    // Method to initialize page load animations
    initializePageLoadAnimations() {
      if (this.headline) {
        this.headline.classList.add('initial-hidden');
        setTimeout(() => this.headline.classList.add('headline-animate'), 100);
      }
      if (this.image) {
        this.image.classList.add('initial-hidden');
        setTimeout(() => this.image.classList.add('image-animate'), 100);
      }
      // Reveal elements after the page has fully loaded
      window.addEventListener('load', () => {
        if (this.headline) {
          this.headline.classList.remove('initial-hidden');
        }
        if (this.image) {
          this.image.classList.remove('initial-hidden');
        }
      });
    },
  }));
});
