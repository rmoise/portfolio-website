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
   // Toggle Navbar
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
      if (this.navbarOpen) {
        document.body.style.overflow = 'hidden'; // Lock body scroll
      } else {
        document.body.style.overflow = 'auto'; // Unlock body scroll

        // Disable scroll logic temporarily after menu close to prevent hiding
        this.scrollLockTimeout = setTimeout(() => {
          this.scrollLockTimeout = null; // Re-enable scroll logic after timeout
        }, 500);  // Adjust timeout to match menu animation
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




    // Handle smooth scrolling when clicking a link
   handleLinkClick(event, targetId) {
  event.preventDefault();
  this.isLinkClicked = true; // Prevent scroll hiding due to link click
  console.log('Link clicked:', targetId); // Log when the link is clicked

  // Always show the mainNav when a subnav link is clicked
  this.showMainNav();

  // Perform smooth scrolling to the target section
  this.smoothScrollTo(targetId);

  // Re-enable scroll behavior after link click and scroll are done
  setTimeout(() => {
    this.isLinkClicked = false;
  }, 1500); // Match this time to the smooth scroll duration
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
    this.isScrolling = true; // Prevent scroll handling while smooth scrolling

    // Ensure main nav is visible before starting the scroll
    this.showMainNav();

    setTimeout(() => {
      const headerHeight = this.mainNav ? this.mainNav.offsetHeight : 0;
      const subNavHeight = this.subNav ? this.subNav.offsetHeight : 0;
      const spaceAboveTitle = window.innerWidth >= 1024 ? -40 : 0; // Desktop or mobile offset

      const totalOffset = headerHeight + subNavHeight + spaceAboveTitle;
      const targetRect = targetElement.getBoundingClientRect();
      const targetPosition = window.scrollY + targetRect.top - totalOffset;

      // Perform smooth scroll
      window.scrollTo({
        top: Math.max(targetPosition, 0),  // Ensure it doesn't scroll to a negative position
        behavior: 'smooth',
      });

      // Allow time for the smooth scroll to complete
      setTimeout(() => {
        this.isScrolling = false; // Re-enable scroll handling after smooth scroll
      }, 1000); // Adjust this time to match smooth scroll duration
    }, 300);  // Adjust based on any animation time for the nav to become visible
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

  // Handle scroll event for hiding/showing mainNav
    handleScroll() {
  // Disable scroll behavior temporarily after unlocking the menu or link click, or while smooth scrolling
  if (this.scrollLockTimeout || this.isLinkClicked || this.isScrolling) {
    console.log("Scroll handling disabled temporarily.");
    return;
  }

  const scrollY = window.scrollY;
  const mainNavHeight = this.mainNav ? this.mainNav.offsetHeight : 0;
  const subNavExists = !!this.subNav;
  const scrollThreshold = this.scrollThreshold;

  if (scrollY > mainNavHeight) {
    if (scrollY > this.scrollPosition + scrollThreshold) {
      // Scrolling down, hide the mainNav
      this.mainNav.style.transform = `translateY(-${mainNavHeight}px)`;
      if (subNavExists) {
        this.subNav.style.transform = `translateY(-${mainNavHeight}px)`;
      }
      console.log("Scrolled down: Hiding mainNav (and subNav if exists).");
    } else if (scrollY < this.scrollPosition - scrollThreshold) {
      // Scrolling up, show the mainNav
      this.mainNav.style.transform = 'translateY(0)';
      if (subNavExists) {
        this.subNav.style.transform = 'translateY(0)';
      }
      console.log("Scrolled up: Showing mainNav (and subNav if exists).");
    }
  } else {
    // At the top of the page, reset mainNav visibility
    this.mainNav.style.transform = 'translateY(0)';
    if (subNavExists) {
      this.subNav.style.transform = 'translateY(0)';
    }
    console.log("At top of page: Showing mainNav (and subNav if exists).");
  }

  // Update scroll position for the next event
  this.scrollPosition = scrollY;
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
