// Global Navbar System
class GlobalNavbar {
  constructor() {
    this.currentPage = this.getCurrentPageName();
    this.init();
  }

  getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.split('/').pop();

    // Remove .html extension and handle index page
    if (page === '' || page === 'index.html') {
      return 'index';
    }
    return page.replace('.html', '');
  }

  async loadNavbar() {
    try {
      console.log('Loading navbar...');
      const response = await fetch('components/navbar.html');
      const navbarHTML = await response.text();
      console.log('Navbar HTML loaded, length:', navbarHTML.length);

      // Insert navbar at the beginning of body
      document.body.insertAdjacentHTML('afterbegin', navbarHTML);
      console.log('Navbar HTML inserted into DOM');

      // Add logo hover functionality immediately after navbar is inserted
      setTimeout(() => {
        const logoLink = document.getElementById('logo-link');
        if (logoLink) {
          console.log('Found logo link, adding hover listeners');
          logoLink.addEventListener('mouseenter', function () {
            this.style.removeProperty('color');
            this.style.setProperty('color', '#00FEB0', 'important');
            console.log('Logo hover: Applied green color');
          });
          logoLink.addEventListener('mouseleave', function () {
            this.style.removeProperty('color');
            console.log('Logo hover: Removed color');
          });
        } else {
          console.log('Logo link not found');
        }
      }, 100);

      // Initialize Alpine.js components for the navbar
      await this.initializeAlpine();

      return true;
    } catch (error) {
      console.error('Failed to load navbar:', error);
      return false;
    }
  }

  async initializeAlpine() {
    // Wait for Alpine.js to be available
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds total (50 * 100ms)

    while (!window.Alpine && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

        if (window.Alpine) {
      const navElement = document.getElementById('main-nav');
      if (navElement) {
        // Ensure the nav element has the x-data attribute
        if (!navElement.hasAttribute('x-data')) {
          navElement.setAttribute('x-data', '{ navbarOpen: false }');
          console.log('Added x-data attribute to main-nav');
        }

        // Initialize Alpine.js on the navbar element
        if (typeof window.Alpine.initTree === 'function') {
          window.Alpine.initTree(navElement);
          console.log('Initialized Alpine.js on navbar with initTree');
        } else if (typeof window.Alpine.start === 'function') {
          // Alternative for different Alpine.js versions
          window.Alpine.start();
          console.log('Started Alpine.js globally');
        }

        // Additional fallback: manually reinitialize Alpine directives
        setTimeout(() => {
          if (window.Alpine && window.Alpine.data) {
            // Force re-scan of new elements
            const alpineElements = navElement.querySelectorAll('[x-data]');
            console.log('Found Alpine elements:', alpineElements.length);
            alpineElements.forEach(element => {
              if (!element._x_dataStack) {
                window.Alpine.initTree(element);
              }
            });
          }
        }, 100);
      }
    } else {
      console.warn('Alpine.js not found. Mobile menu functionality may not work.');
      // Fallback: add vanilla JavaScript for mobile menu
      this.addVanillaMenuFunctionality();
    }
  }

          addVanillaMenuFunctionality() {
    // Simple vanilla JavaScript mobile menu based on working navbar.js approach
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('#main-nav [x-show="navbarOpen"]');

        console.log('Vanilla menu setup - menuToggle:', menuToggle);
    console.log('Vanilla menu setup - mobileMenu:', mobileMenu);
    console.log('Vanilla menu setup - main-nav exists:', document.getElementById('main-nav'));

    if (menuToggle && mobileMenu) {
      console.log('Adding vanilla JS mobile menu functionality');

      // Simple toggle function like the working navbar.js
      const toggleNavbar = () => {
        const isCurrentlyOpen = !mobileMenu.classList.contains('hidden');
        const mainNav = document.getElementById('main-nav');

        console.log('Toggle function called, isCurrentlyOpen:', isCurrentlyOpen);

                                                if (!isCurrentlyOpen) {
          // Open the mobile menu - position below navbar
          mobileMenu.style.display = 'block';
          mobileMenu.style.position = 'fixed';
          mobileMenu.style.top = '72px'; // Start below navbar
          mobileMenu.style.left = '0';
          mobileMenu.style.right = '0';
          mobileMenu.style.bottom = '0';
          mobileMenu.style.width = '100vw';
          mobileMenu.style.height = 'calc(100vh - 72px)'; // Take remaining height
          mobileMenu.style.background = '#000';
          mobileMenu.style.zIndex = '9998';
          mobileMenu.style.overflow = 'auto';
          mobileMenu.style.overflowX = 'hidden'; // Prevent horizontal scroll

          // Remove conflicting CSS classes
          mobileMenu.classList.remove('hidden', 'z-40');
          mobileMenu.classList.add('z-[9998]');

          // Lock body scroll and prevent scroll issues
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';

          // Store current scroll position
          const scrollY = window.scrollY;
          document.body.style.top = `-${scrollY}px`;
          mobileMenu.setAttribute('data-scroll-y', scrollY);

          // Ensure main navbar stays visible
          if (mainNav) {
            mainNav.style.zIndex = '9999';
            console.log('Set main navbar z-index to 9999');
          } else {
            console.log('Main navbar element not found!');
          }

          console.log('Mobile menu opened below navbar');
                } else {
          // Close the mobile menu
          mobileMenu.style.display = 'none';
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('z-[9998]');

          // Restore body scroll and position
          const scrollY = mobileMenu.getAttribute('data-scroll-y') || 0;
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          window.scrollTo(0, parseInt(scrollY));

          // Restore main navbar z-index when mobile menu is closed
          if (mainNav) {
            mainNav.style.zIndex = '50';
          }

          console.log('Mobile menu closed');
        }

        console.log('Mobile menu toggled, new state open:', !mobileMenu.classList.contains('hidden'));
      };

            // Check if already initialized - but force re-attach since navbar might load multiple times
      if (menuToggle.hasAttribute('data-mobile-initialized')) {
        console.log('Mobile menu already initialized, but re-attaching event listener to be safe...');
        // Remove old event listeners first
        menuToggle.removeAttribute('data-mobile-initialized');
        // Continue execution to re-attach event listeners - don't return
      }

      // Mark as initialized
      menuToggle.setAttribute('data-mobile-initialized', 'true');

      // Attach click handler
      menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Menu toggle clicked');
        console.log('Before toggle - Mobile menu display:', mobileMenu.style.display);
        console.log('Before toggle - Mobile menu classes:', mobileMenu.className);
        toggleNavbar();
        console.log('After toggle - Mobile menu display:', mobileMenu.style.display);
        console.log('After toggle - Mobile menu z-index:', mobileMenu.style.zIndex);
      });

            // Close menu when clicking on any link (simple approach)
      const mobileNavLinks = mobileMenu.querySelectorAll('a');
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          const mainNav = document.getElementById('main-nav');

          // Force close the mobile menu
          mobileMenu.style.display = 'none';
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('z-[9998]');
          document.body.style.overflow = 'auto';

          // Restore main navbar z-index when mobile menu is closed
          if (mainNav) {
            mainNav.style.zIndex = '50';
          }

          console.log('Mobile nav link clicked, menu closed');
        });
      });

    } else {
      console.log('Menu toggle or mobile menu not found');
    }
  }

    updateMenuIcon(isOpen) {
    const menuToggle = document.getElementById('menu-toggle');
    if (!menuToggle) return;

    const hamburgerIcon = menuToggle.querySelector('svg:not([x-cloak])');
    const closeIcon = menuToggle.querySelector('svg[x-cloak]');

    console.log('Updating menu icon, isOpen:', isOpen);
    console.log('Hamburger icon found:', !!hamburgerIcon);
    console.log('Close icon found:', !!closeIcon);

    if (hamburgerIcon && closeIcon) {
      if (isOpen) {
        hamburgerIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        closeIcon.removeAttribute('x-cloak');
      } else {
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        closeIcon.setAttribute('x-cloak', '');
      }
    }
  }

  highlightCurrentPage() {
    // Debug logging
    console.log('Current page detected:', this.currentPage);

        // Remove any existing active classes
    document.querySelectorAll('.nav-link.active, .subnav-link.active').forEach(link => {
      link.classList.remove('active');

      // Restore original href if it was removed
      if (link.hasAttribute('data-original-href')) {
        link.setAttribute('href', link.getAttribute('data-original-href'));
        link.removeAttribute('data-original-href');
      }

      // Remove active underline element
      const underline = link.querySelector('.active-underline');
      if (underline) {
        underline.remove();
      }
    });

    // Highlight current page in main navigation
    const currentNavLinks = document.querySelectorAll(`[data-page="${this.currentPage}"]`);
    console.log('Found nav links for current page:', currentNavLinks.length);

        currentNavLinks.forEach(link => {
      link.classList.add('active');

      // Remove href to make it completely non-functional
      if (link.hasAttribute('href')) {
        link.setAttribute('data-original-href', link.getAttribute('href'));
        link.removeAttribute('href');
      }

      // Create permanent underline by adding a pseudo-element effect with inline styles
      if (!link.querySelector('.active-underline')) {
        const underline = document.createElement('span');
        underline.className = 'active-underline';
        // Check if mobile viewport
        const isMobile = window.innerWidth <= 768;
        const bottomPosition = isMobile ? '-4px' : '0';

        underline.style.cssText = `
          position: absolute;
          bottom: ${bottomPosition};
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
          pointer-events: none;
        `;
        link.appendChild(underline);
      }

      console.log('Applied active styling to:', link.textContent.trim());
    });

    // Highlight home page sections in subnav if on index page
    if (this.currentPage === 'index') {
      this.handleSubnavForHomePage();
    } else {
      // For other pages, hide subnav or modify as needed
      this.handleSubnavForOtherPages();
    }
  }

    handleSubnavForHomePage() {
    // Handle section highlighting on scroll - subnav visibility controlled by scroll behavior
    const subNav = document.getElementById('sub-nav');
    if (subNav) {
      subNav.classList.remove('homepage-only');

      // Let the scroll behavior control visibility - don't set display block here
      // Add scroll listener for section highlighting
      this.initSectionHighlighting();

      // Add scroll listener for navbar visibility (only on homepage)
      this.initNavbarScrollBehavior();
    }
  }

  handleSubnavForOtherPages() {
    // Hide subnav on other pages
    const subNav = document.getElementById('sub-nav');
    if (subNav) {
      subNav.style.display = 'none';
    }
  }

  initSectionHighlighting() {
    const sections = ['about', 'expertise', 'tools', 'portfolio', 'recent-visuals', 'testimonials'];
    const subnavLinks = document.querySelectorAll('.subnav-link');
    let currentActiveSection = null;

    // Simplified intersection observer for backup detection
    const observer = new IntersectionObserver((entries) => {
      // Let the manual scroll handler do the main work
      // This is just for backup detection
    }, {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px'
    });

    // Observe all sections
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
        console.log(`Observing section: ${sectionId}`); // Debug log
      } else {
        console.warn(`Section not found: ${sectionId}`); // Debug log
      }
    });

                        // Accurate section detection system
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const offset = 120; // Navbar height + buffer

      let activeSection = null;

      // Method 1: Find which section we're currently in
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = scrollPos + rect.top;
          const sectionBottom = sectionTop + section.offsetHeight;

          // Check if the offset point is within this section
          if ((scrollPos + offset) >= sectionTop && (scrollPos + offset) < sectionBottom) {
            activeSection = sectionId;
          }
        }
      });

      // Method 2: If no section contains our offset point, find the closest one
      if (!activeSection) {
        let closestSection = null;
        let minDistance = Infinity;

        sections.forEach(sectionId => {
          const section = document.getElementById(sectionId);
          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionTop = scrollPos + rect.top;

            // Distance from our detection point to section top
            const distance = Math.abs((scrollPos + offset) - sectionTop);

            if (distance < minDistance) {
              minDistance = distance;
              closestSection = sectionId;
            }
          }
        });

        activeSection = closestSection;
      }

      // Method 3: Special handling for very top and bottom
      if (scrollPos < 50) {
        activeSection = 'about'; // Always show About at very top
      }

      // Update highlighting
      if (activeSection && activeSection !== currentActiveSection) {
        currentActiveSection = activeSection;

        // Clear all active states
        subnavLinks.forEach(link => {
          link.classList.remove('active');
          link.style.color = '';
          link.style.fontWeight = '';
          link.style.textDecoration = '';
        });

        // Set new active state
        const activeLink = document.querySelector(`[data-section="${activeSection}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          activeLink.style.color = '#000000';
          activeLink.style.fontWeight = '600';
          activeLink.style.textDecoration = 'underline';
        }
      }
    };

                    // Initialize and add scroll listener
    setTimeout(() => {
      const mainNav = document.querySelector('#main-nav');
      const scrollPos = window.scrollY;

            // Set proper initial state based on scroll position
      if (mainNav) {
        const subNav = document.querySelector('#sub-nav');

        // Theme is now handled by theme-toggle.js

        if (scrollPos <= 50) {
          // At top - show navbar immediately, hide subnav
          mainNav.classList.add('nav-visible');
          mainNav.classList.remove('nav-hidden');
          if (subNav) {
            subNav.classList.remove('nav-visible', 'subnav-fixed');
          }
        } else {
          // Not at top - let scroll behavior decide
          handleScroll();
        }
      }

      // Set initial section highlighting
      handleScroll();
    }, 200);

    // Optimized scroll detection
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

      initNavbarScrollBehavior() {
    // Only initialize scroll behavior on homepage
    if (this.currentPage !== 'index') {
      // For non-homepage pages, ensure main nav is always visible
      const mainNav = document.querySelector('#main-nav');
      if (mainNav) {
        mainNav.style.transform = 'translateY(0)';
        mainNav.style.position = 'fixed';
        mainNav.style.top = '0';
      }
      return;
    }

    let lastScrollTop = 0;
    const mainNav = document.querySelector('#main-nav');
    const subNav = document.querySelector('#sub-nav');
    const scrollThreshold = 100;
    let ticking = false;
    let isAnimating = false;
    const scrollSensitivity = 3; // Reduced sensitivity for smoother behavior

                    // Force proper initial transform state with slower, more visible sliding
    mainNav.style.setProperty('transition', 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)', 'important');
    mainNav.style.setProperty('transform', 'translateY(0)', 'important');

    // Initialize subnav positioning with slower, more visible sliding
    if (subNav) {
      subNav.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
      subNav.style.position = 'fixed';
      subNav.style.top = '72px';
      // Don't set initial transform here - let the scroll position logic handle it
    }

    // Set initial state based on current scroll position
    const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // FORCE subnav to be hidden initially regardless of scroll position
    if (subNav) {
      subNav.style.setProperty('transform', 'translateY(-100%)', 'important');
      subNav.style.setProperty('opacity', '0', 'important');
      subNav.style.setProperty('top', '72px', 'important');
      subNav.classList.remove('subnav-fixed', 'nav-visible');
    }

    if (initialScrollTop <= 50) {
      // At top - show main nav only, hide subnav
      mainNav.style.setProperty('transform', 'translateY(0)', 'important');
    } else {
      // Scrolled down - show main nav, subnav should be visible below it initially
      mainNav.style.setProperty('transform', 'translateY(0)', 'important');
      if (subNav) {
        subNav.style.transform = 'translateY(0)';
        subNav.style.top = '72px';
        subNav.classList.remove('subnav-fixed');
      }
    }

            const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollingDown = scrollTop > lastScrollTop;
      const scrollingUp = scrollTop < lastScrollTop;

      // Transparency is now handled by initTransparentNavbar()
      // Subnav theming is now handled by manual theme toggle only

      if (scrollTop <= 50) {
        // At top of page - show main navbar only, hide subnav (hero section)
        mainNav.style.setProperty('transform', 'translateY(0)', 'important');
        if (subNav) {
          subNav.style.setProperty('transform', 'translateY(-100%)', 'important');
          subNav.style.setProperty('opacity', '0', 'important');
          subNav.style.setProperty('top', '72px', 'important');
          subNav.classList.remove('subnav-fixed', 'nav-visible');
        }
      } else if (scrollTop > scrollThreshold) {
        if (scrollingDown && scrollTop > lastScrollTop + scrollSensitivity && !isAnimating) {
                              // Scrolling down - hide navbar, smoothly move subnav to top
          isAnimating = true;
          const mainNavHeight = mainNav.offsetHeight;

          // Slide the main navbar up (hide it)
          mainNav.style.setProperty('transform', `translateY(-${mainNavHeight}px)`, 'important');
          mainNav.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)', 'important');

          if (subNav) {
            // Smoothly animate subnav from its current position to top
            subNav.style.setProperty('transition', 'top 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)', 'important');
            subNav.style.setProperty('top', '0', 'important');
            subNav.style.setProperty('transform', 'translateY(0)', 'important');
            subNav.style.setProperty('opacity', '1', 'important');
            subNav.classList.add('subnav-fixed');
          }

          // Reset animation state
          setTimeout(() => {
            isAnimating = false;
          }, 400);
        } else if (scrollingUp && scrollTop < lastScrollTop - scrollSensitivity && !isAnimating) {
                    // Scrolling up - smooth single animation to show both elements
          isAnimating = true;

          // Show main navbar
          mainNav.style.setProperty('transform', 'translateY(0)', 'important');
          mainNav.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)', 'important');

          if (subNav) {
            // Smoothly animate subnav back to position below navbar
            subNav.classList.remove('subnav-fixed');
            subNav.style.setProperty('transition', 'top 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)', 'important');
            subNav.style.setProperty('top', '72px', 'important');
            subNav.style.setProperty('transform', 'translateY(0)', 'important');
            subNav.style.setProperty('opacity', '1', 'important');
          }

          setTimeout(() => {
            isAnimating = false;
          }, 400);
        }
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    });
  }

  initTransparentNavbar() {
    // Only initialize transparent navbar on homepage
    if (this.currentPage !== 'index') return;

    const mainNav = document.querySelector('#main-nav');
    if (!mainNav) return;

    // Set initial transparent state if at top of page
    if (window.pageYOffset <= 10) {
      mainNav.classList.add('transparent');
    }

    let ticking = false;

    const handleTransparency = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Handle navbar transparency based on scroll position
      if (scrollTop <= 10) {
        // At very top - make navbar transparent
        mainNav.classList.add('transparent');
      } else {
        // Scrolled - make navbar solid
        mainNav.classList.remove('transparent');
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(handleTransparency);
        ticking = true;
      }
    });
  }

  initNavbarThemeSwitching() {
    // Theme switching is now handled by theme-toggle.js
    // This function only handles tab text color forcing

    // Tab colors now handled by Tailwind classes
  }

  initManualThemeToggle(mainNav) {
    // Theme toggle functionality is now handled by theme-toggle.js
    // This method is disabled to prevent conflicts
  }

  updateThemeToggleIcons(theme) {
    // Desktop icons
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Mobile icons
    const mobileSunIcon = document.getElementById('mobile-sun-icon');
    const mobileMoonIcon = document.getElementById('mobile-moon-icon');

    if (theme === 'light') {
      // Show moon icon (to switch to dark)
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
      if (mobileSunIcon) mobileSunIcon.classList.add('hidden');
      if (mobileMoonIcon) mobileMoonIcon.classList.remove('hidden');
    } else {
      // Show sun icon (to switch to light)
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
      if (mobileSunIcon) mobileSunIcon.classList.remove('hidden');
      if (mobileMoonIcon) mobileMoonIcon.classList.add('hidden');
    }
  }

  setNavbarTheme(mainNav, theme) {
    // Apply theme to navbar
    if (theme === 'light') {
      mainNav.setAttribute('data-navbar-theme', 'light');
      mainNav.classList.remove('bg-black', 'text-white');
      mainNav.classList.add('bg-white', 'text-gray-800');
    } else {
      mainNav.setAttribute('data-navbar-theme', 'dark');
      mainNav.classList.remove('bg-white', 'text-gray-800');
      mainNav.classList.add('bg-black', 'text-white');
    }

    // Apply theme to entire site
    this.setGlobalTheme(theme);
  }

    setGlobalTheme(theme) {
    // Global theme setting is now handled by theme-toggle.js
    // This method is disabled to prevent conflicts with Tailwind dark mode

    // Tab colors now handled by Tailwind classes
  }

    applyThemeImmediately() {
    // Theme application is now handled by theme-toggle.js
    // This method is disabled to prevent conflicts
  }

  // Tab color forcing removed - now handled by Tailwind classes

  addCustomCSS() {
    // Theme application is now handled by theme-toggle.js
    // this.applyThemeImmediately(); // Disabled to prevent conflicts

    // Add custom CSS for active states
    const style = document.createElement('style');
    style.textContent = `
      .nav-link.active {
        color: #6366f1 !important;
        font-weight: 600 !important;
        background-color: transparent !important;
        border-radius: 6px !important;
        position: relative;
      }

      .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: #6366f1;
        border-radius: 1px;
      }

      .subnav-link.active {
        color: #000000 !important;
        font-weight: 600 !important;
        text-decoration: underline !important;
      }

      /* Ensure consistent navbar positioning across all pages */
      #main-nav {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 50 !important;
      }

      /* Default padding for pages without subnav */
      body {
        padding-top: 80px; /* Just navbar height */
      }

      /* Homepage with subnav gets different padding */
      body.home-page {
        padding-top: 0; /* Custom spacing for parallax hero */
      }

      /* Non-homepage pages handled by JavaScript */

      /* Ensure consistent container spacing */
      #main-nav .container {
        max-width: 100% !important;
        margin: 0 auto !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }

      /* Force consistent layout structure */
      #main-nav > div {
        padding: 1rem 1rem !important;
      }

      /* Desktop spacing override */
      @media (min-width: 768px) {
        #main-nav .container {
          padding-left: 6rem !important;
          padding-right: 6rem !important;
        }

        #main-nav > div {
          padding: 1rem 6rem !important;
        }
      }

      /* Ensure logo and nav items alignment */
      #main-nav .flex.items-center.justify-between {
        width: 100% !important;
        max-width: none !important;
      }

      /* Hide subnav by default, show only on homepage */
      .homepage-only {
        display: none !important;
      }

      /* Navbar scroll behavior handled by JavaScript */
      #main-nav {
        transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
      }

      /* Remove conflicting transform classes - direct JS control */

      /* Subnav positioning and transitions */
      #sub-nav {
        position: fixed;
        top: 72px;
        left: 0;
        right: 0;
        z-index: 49;
        transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
        margin: 0;
        border-top: none;
        background-color: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* Subnav when main nav is hidden (moves to top) */
      #sub-nav.subnav-fixed {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
      }

      /* Dark theme for subnav */
      .dark #sub-nav {
        background-color: rgba(0, 0, 0, 0.85) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        box-shadow: 0 1px 3px rgba(255, 255, 255, 0.1) !important;
      }

      .dark #sub-nav .subnav-link {
        color: #ffffff !important;
      }

            /* Let Tailwind handle all theming - tab colors now use Tailwind classes */

      /* Latest Work Section Theming */
      #recent-visuals {
        background-color: var(--bg-primary) !important;
      }

      #recent-visuals .secondary-title {
        color: var(--text-primary) !important;
      }

      #recent-visuals .grid > div {
        background-color: transparent !important;
      }

      #recent-visuals img {
        border: 1px solid var(--border-color) !important;
        border-radius: 0.5rem !important;
      }

      #recent-visuals .overflow-hidden:hover {
        background-color: transparent !important;
      }

      /* Portfolio Projects Hover Theming */
      #portfolio .panel .rounded-md.border.border-gray-200 {
        background-color: var(--bg-primary) !important;
        border-color: var(--border-color) !important;
      }

      #portfolio .flex.flex-col.gap-x-5.p-2.transition.bg-white {
        background-color: var(--bg-primary) !important;
      }

      #portfolio .flex.flex-col.gap-x-5.p-2.transition.bg-white:hover {
        background-color: var(--bg-secondary) !important;
      }

      /* Portfolio project text theming */
      #portfolio h4,
      #portfolio p,
      #portfolio .text-sm,
      #portfolio .text-lg {
        color: var(--text-primary) !important;
      }

      /* #portfolio .text-black override removed - let Tailwind handle tab colors */

      #portfolio a.underline {
        color: var(--text-primary) !important;
      }

      #portfolio a.underline:hover {
        color: #01f3ab !important;
      }

      /* Dropdown theming */
      .dark-theme [data-navbar-theme="dark"] .dropdown-menu,
      .dark-theme [data-navbar-theme="dark"] [x-show] {
        background-color: #000000 !important;
        border-color: rgba(99, 102, 241, 0.3) !important;
      }

      .light-theme [data-navbar-theme="light"] .dropdown-menu,
      .light-theme [data-navbar-theme="light"] [x-show] {
        background-color: #ffffff !important;
        border-color: rgba(0, 0, 0, 0.1) !important;
      }
        color: white !important;
      }

      #sub-nav.dark-theme .subnav-link:hover {
        color: #ffffff !important;
      }

      /* Enhanced dropdown link hover effects */
      .nav-link {
        position: relative;
        border: none !important;
      }

      .nav-link:hover:not(.active) {
        color: #c7d2fe !important;
        background-color: transparent !important;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
        transition: width 0.3s ease-in-out;
      }

      /* Mobile spacing for underline */
      @media (max-width: 768px) {
        .nav-link::after {
          bottom: -4px;
        }
      }

      .nav-link:hover:not(.active)::after {
        width: 100%;
      }

      /* Active link styles - disable all interactions */
      .nav-link.active {
        pointer-events: none !important;
        cursor: default !important;
        color: #c7d2fe !important;
      }

      .nav-link.active:hover {
        color: #c7d2fe !important;
        background-color: transparent !important;
      }

      .nav-link.active::after {
        display: none !important;
      }

      #sub-nav.dark-theme .subnav-link.active {
        color: #ffffff !important;
        text-decoration: underline !important;
      }

      #sub-nav.dark-theme .gradient-left,
      #sub-nav.dark-theme .gradient-right {
        background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.85), transparent) !important;
      }

            /* Mobile menu fallback styles */
      .mobile-menu-hidden {
        display: none !important;
      }

      .mobile-menu-visible {
        display: block !important;
      }

                        /* Mobile menu positioned below navbar */
      #main-nav [x-show="navbarOpen"] {
        display: none !important;
        position: fixed !important;
        top: 72px !important;
        left: 0 !important;
        width: 100vw !important;
        height: calc(100vh - 72px) !important;
        background: #000 !important;
        z-index: 9998 !important;
        overflow-y: auto !important;
      }

      /* Override any Tailwind z-index classes */
      #main-nav [x-show="navbarOpen"].z-\[99999\] {
        z-index: 99999 !important;
      }

      /* When mobile menu is visible, force it to the top */
      #main-nav [x-show="navbarOpen"]:not(.hidden) {
        display: block !important;
        z-index: 99999 !important;
      }

      /* Ensure main navbar has lower z-index */
      #main-nav {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 50 !important;
      }

      /* Force navbar container to have lower z-index */
      #main-nav > div:first-child {
        z-index: 1 !important;
        position: relative !important;
      }

      /* Ensure navbar content container is visible */
      #main-nav > div:first-child {
        display: block !important;
        position: relative !important;
        z-index: 1 !important;
      }

      /* Style the mobile menu toggle button */
      #menu-toggle {
        transition: all 0.3s ease;
      }

      #menu-toggle:hover {
        background-color: rgba(99, 102, 241, 0.1);
      }

      /* Smooth transitions for mobile dropdown */
      [x-show="mobileDropdownOpen"] {
        transition: all 0.3s ease;
      }

      /* Navbar Theme Styles - Responsive to .dark class */
      #main-nav {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
      }

      /* Light mode navbar (default) */
      #main-nav {
        background-color: white !important;
        color: #1f2937 !important;
        border-bottom: 1px solid #e5e7eb !important;
      }

      /* Transparent navbar at top of page */
      #main-nav.transparent {
        background-color: transparent !important;
        border-bottom: 1px solid transparent !important;
        backdrop-filter: none !important;
      }

      /* Transparent navbar text colors */
      #main-nav.transparent a {
        color: #1f2937 !important;
      }

      #main-nav.transparent button {
        color: #1f2937 !important;
      }

      #main-nav.transparent #menu-toggle svg {
        color: #1f2937 !important;
      }

      #main-nav a {
        color: #1f2937 !important;
      }

      #main-nav a:hover {
        color: #6366f1 !important;
      }

      #main-nav button {
        color: #1f2937 !important;
        border-color: #6366f1 !important;
      }

      #main-nav button:hover {
        background-color: rgba(99, 102, 241, 0.1) !important;
      }

      /* Dark mode navbar */
      .dark #main-nav {
        background-color: black !important;
        color: white !important;
        border-bottom: 1px solid #374151 !important;
      }

      /* Dark mode transparent navbar */
      .dark #main-nav.transparent {
        background-color: transparent !important;
        border-bottom: 1px solid transparent !important;
      }

      /* Dark mode transparent navbar text colors */
      .dark #main-nav.transparent a {
        color: white !important;
      }

      .dark #main-nav.transparent button {
        color: white !important;
      }

      .dark #main-nav.transparent #menu-toggle svg {
        color: white !important;
      }

      .dark #main-nav a {
        color: white !important;
      }

      .dark #main-nav a:hover {
        color: #a78bfa !important;
      }

      .dark #main-nav button {
        color: white !important;
        border-color: #6366f1 !important;
      }

      .dark #main-nav button:hover {
        background-color: rgba(99, 102, 241, 0.2) !important;
      }

      /* Light mode dropdown - desktop */
      #main-nav [x-show="dropdownOpen"] {
        background-color: white !important;
        border-color: #e5e7eb !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
      }

      /* Dropdowns should always have solid background, even when navbar is transparent */
      #main-nav.transparent [x-show="dropdownOpen"] {
        background-color: white !important;
        border-color: #e5e7eb !important;
      }

      #main-nav [x-show="dropdownOpen"] a {
        color: #1f2937 !important;
      }

      #main-nav [x-show="dropdownOpen"] a:hover {
        background-color: transparent !important;
        color: #6366f1 !important;
      }

      #main-nav [x-show="dropdownOpen"] .text-indigo-300 {
        color: #6b7280 !important;
      }

      #main-nav [x-show="dropdownOpen"] .bg-indigo-500\\/50 {
        background-color: #e5e7eb !important;
      }

      #main-nav [x-show="dropdownOpen"] .hover\\:bg-indigo-600\\/20:hover {
        background-color: transparent !important;
      }

      /* Dark mode dropdown - desktop */
      .dark #main-nav [x-show="dropdownOpen"] {
        background-color: black !important;
        border-color: #374151 !important;
        box-shadow: 0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05) !important;
      }

      /* Dark mode dropdowns should always have solid background, even when navbar is transparent */
      .dark #main-nav.transparent [x-show="dropdownOpen"] {
        background-color: black !important;
        border-color: #374151 !important;
      }

      .dark #main-nav [x-show="dropdownOpen"] a {
        color: white !important;
      }

      .dark #main-nav [x-show="dropdownOpen"] a:hover {
        background-color: transparent !important;
        color: #a78bfa !important;
      }

      /* Light mode mobile menu */
      #main-nav [x-show="navbarOpen"] {
        background: white !important;
        color: #1f2937 !important;
      }

      #main-nav [x-show="navbarOpen"] a {
        color: #1f2937 !important;
      }

      #main-nav [x-show="navbarOpen"] a:hover {
        color: #6366f1 !important;
      }

      /* Light mode mobile dropdown */
      #main-nav [x-show="navbarOpen"] [x-show="mobileDropdownOpen"] a {
        color: #1f2937 !important;
      }

      #main-nav [x-show="navbarOpen"] [x-show="mobileDropdownOpen"] a:hover {
        color: #6366f1 !important;
      }

      #main-nav [x-show="navbarOpen"] .text-indigo-300 {
        color: #6b7280 !important;
      }

      #main-nav [x-show="navbarOpen"] .border-indigo-500\\/50 {
        border-color: #e5e7eb !important;
      }

      /* Light mode mobile dropdown button */
      #main-nav [x-show="navbarOpen"] button {
        color: #1f2937 !important;
      }

      #main-nav [x-show="navbarOpen"] button:hover {
        color: #6366f1 !important;
      }

      #main-nav [x-show="navbarOpen"] button svg {
        color: #1f2937 !important;
      }

      /* Hamburger menu icon for light mode */
      #main-nav #menu-toggle svg {
        color: #1f2937 !important;
      }

      #main-nav #menu-toggle:hover {
        background-color: rgba(99, 102, 241, 0.1) !important;
      }

      /* Light mode CTA button */
      #main-nav a[href="#contact"] {
        color: #1f2937 !important;
        border-color: #6366f1 !important;
      }

      #main-nav a[href="#contact"]:hover {
        background-color: rgba(99, 102, 241, 0.1) !important;
        color: #6366f1 !important;
      }

      /* Dark mode mobile menu */
      .dark #main-nav [x-show="navbarOpen"] {
        background: black !important;
        color: white !important;
      }

      .dark #main-nav [x-show="navbarOpen"] a {
        color: white !important;
      }

      .dark #main-nav [x-show="navbarOpen"] a:hover {
        color: #a78bfa !important;
      }

      /* Dark mode mobile dropdown */
      .dark #main-nav [x-show="navbarOpen"] [x-show="mobileDropdownOpen"] a {
        color: white !important;
      }

      .dark #main-nav [x-show="navbarOpen"] [x-show="mobileDropdownOpen"] a:hover {
        color: #a78bfa !important;
      }

      /* Dark mode mobile dropdown button */
      .dark #main-nav [x-show="navbarOpen"] button {
        color: white !important;
      }

      .dark #main-nav [x-show="navbarOpen"] button:hover {
        color: #a78bfa !important;
      }

      .dark #main-nav [x-show="navbarOpen"] button svg {
        color: white !important;
      }

      /* Hamburger menu icon for dark mode */
      .dark #main-nav #menu-toggle svg {
        color: white !important;
      }

      .dark #main-nav #menu-toggle:hover {
        background-color: rgba(99, 102, 241, 0.2) !important;
      }

      /* Dark mode CTA button */
      .dark #main-nav a[href="#contact"] {
        color: white !important;
        border-color: #6366f1 !important;
      }

      .dark #main-nav a[href="#contact"]:hover {
        background-color: rgba(99, 102, 241, 0.2) !important;
        color: #a78bfa !important;
      }
    `;
    document.head.appendChild(style);
  }

  async init() {
    // Load navbar first
    const loaded = await this.loadNavbar();

    if (loaded) {
      // Add custom CSS
      this.addCustomCSS();

      // Add body class for current page
      document.body.classList.add(`page-${this.currentPage}`);

      // Add home-page class for index
      if (this.currentPage === 'index') {
        document.body.classList.add('home-page');
      } else {
        // For non-homepage pages, ensure navbar is visible immediately
        setTimeout(() => {
          const mainNav = document.getElementById('main-nav');
          if (mainNav) {
            mainNav.classList.add('nav-visible');
            mainNav.classList.remove('nav-hidden');
          }
        }, 50);
      }

      // Initialize navbar theme switching
      this.initNavbarThemeSwitching();

      // Initialize transparent navbar behavior
      this.initTransparentNavbar();

      // Immediately hide mobile menu to prevent it from showing
      this.hideMobileMenuImmediately();

      // Wait a bit longer to ensure Alpine.js has initialized
      setTimeout(() => {
        this.highlightCurrentPage();
        // Verify mobile menu functionality
        this.verifyMobileMenu();

        // Attach theme toggle listeners after navbar is loaded
        if (window.attachThemeToggleListeners) {
          console.log('Calling theme toggle listener attachment from global-navbar');
          window.attachThemeToggleListeners();
        }
      }, 300);
    }
    }

  hideMobileMenuImmediately() {
    // Immediately hide mobile menu on page load
    const mobileMenu = document.querySelector('#main-nav [x-show="navbarOpen"]');
    if (mobileMenu) {
      mobileMenu.style.display = 'none';
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('mobile-menu-visible');
      console.log('Mobile menu hidden immediately on page load');
    }
  }

    verifyMobileMenu() {
    // Simple approach: just add vanilla functionality and test
    console.log('Setting up mobile menu...');

    // Always use vanilla JS for better reliability
    this.addVanillaMenuFunctionality();

    // Test the menu functionality after a short delay
    setTimeout(() => {
      this.testMobileMenuFunctionality();
    }, 200);
  }

      testMobileMenuFunctionality() {
    const mobileMenu = document.querySelector('#main-nav [x-show="navbarOpen"]');

    if (mobileMenu) {
      // Simply ensure mobile menu is hidden initially
      mobileMenu.style.display = 'none';
      mobileMenu.classList.add('hidden');
      console.log('Mobile menu initialized as hidden');
    }
  }
}

// Smooth scroll function for "Let's Talk" button
function smoothScrollToContact(event) {
  event.preventDefault();

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    // If no contact section on current page, navigate to homepage with hash
    window.location.href = 'index.html#contact';
  }
}

// Initialize when DOM is loaded - prevent duplicate initialization
let globalNavbarInstance = null;

function initializeGlobalNavbar() {
  if (!globalNavbarInstance) {
    console.log('Initializing GlobalNavbar...');
    globalNavbarInstance = new GlobalNavbar();
  } else {
    console.log('GlobalNavbar already initialized, skipping...');
  }
}

// Handle both cases but prevent duplicate initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGlobalNavbar);
} else {
  initializeGlobalNavbar();
}/* Cache bust: Sun Jun  8 19:21:53 CEST 2025 */
