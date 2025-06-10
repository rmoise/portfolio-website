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

      // Add mobile section link handlers as a fallback
      setTimeout(() => {
        this.addMobileSectionLinkHandlers();
      }, 200);

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

          // Add mobile section link handlers after Alpine is initialized
          this.addMobileSectionLinkHandlers();
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
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = menuToggle?.querySelector('.hamburger-icon');
    const closeIcon = menuToggle?.querySelector('.close-icon');

        console.log('Vanilla menu setup - menuToggle:', menuToggle);
    console.log('Vanilla menu setup - mobileMenu:', mobileMenu);

    // Add global prevention for any Alpine.js clicks that might cause page jumps
    document.addEventListener('click', (e) => {
      // Check if the clicked element or its parents have Alpine.js attributes that might cause issues
      const element = e.target.closest('[\\@click], [x-on\\:click]');
      if (element && element.closest('#mobile-menu, #main-nav')) {
        const clickHandler = element.getAttribute('@click') || element.getAttribute('x-on:click');
        if (clickHandler && clickHandler.includes('navbarOpen')) {
          console.log('Preventing Alpine.js navbarOpen click that could cause page jump');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      }
    }, { capture: true });

    // Also disable Alpine.js on the mobile menu container completely
    const mobileMenuContainer = document.getElementById('mobile-menu');
    if (mobileMenuContainer) {
      mobileMenuContainer.setAttribute('x-ignore', '');
      console.log('Disabled Alpine.js on mobile menu container');
    }
    console.log('Vanilla menu setup - main-nav exists:', document.getElementById('main-nav'));

    if (menuToggle && mobileMenu) {
      console.log('Adding vanilla JS mobile menu functionality');

                  // Ultra-simple toggle function - remove all complex logic temporarily
      const toggleNavbar = (event) => {
        console.log('TOGGLE CALLED - scroll position BEFORE:', window.scrollY);

        // Prevent page jumping to top
        if (event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }

        const isCurrentlyOpen = !mobileMenu.classList.contains('hidden');
        const mainNav = document.getElementById('main-nav');

        console.log('Toggle function called, isCurrentlyOpen:', isCurrentlyOpen);

                                if (!isCurrentlyOpen) {
          // Open the mobile menu with SAFE scroll locking
          console.log('OPENING menu - scroll position:', window.scrollY);
          mobileMenu.classList.remove('hidden');
          mobileMenu.style.display = 'block';

          // Remove transparent class to make navbar solid when menu opens
          if (mainNav.classList.contains('transparent')) {
            mainNav.classList.remove('transparent');
            mainNav.setAttribute('data-was-transparent', 'true');
            console.log('Removed transparent class for solid menu background');
          }

          // Change background to white when toggled on homepage in light mode
          const currentPage = window.location.pathname.split('/').pop() || 'index.html';
          const isHomepage = currentPage === 'index.html' || currentPage === '';
          const isDarkMode = document.documentElement.classList.contains('dark');

          if (isHomepage && !isDarkMode) {
            // Homepage + Light mode: Change to white when menu opens
            mobileMenu.style.setProperty('background', 'white', 'important');
            mobileMenu.style.setProperty('background-color', 'white', 'important');
            console.log('Set mobile menu to white for homepage light mode');
          }

          // Safe scroll lock - prevent background scrolling but keep menu scrollable
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden'; // For some browsers

          // Ensure mobile menu itself remains scrollable
          mobileMenu.style.overflow = 'auto';
          mobileMenu.style.overflowY = 'auto';

          // Toggle icons
          if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
          }

          console.log('Mobile menu opened - scroll position AFTER:', window.scrollY);
        } else {
          // Close the mobile menu and restore scrolling
          console.log('CLOSING menu - scroll position:', window.scrollY);
          mobileMenu.classList.add('hidden');
          mobileMenu.style.display = 'none';

          // Restore transparent class if it was previously transparent
          if (mainNav.getAttribute('data-was-transparent') === 'true') {
            mainNav.classList.add('transparent');
            mainNav.removeAttribute('data-was-transparent');
            console.log('Restored transparent class after closing menu');
          }

          // Restore scroll ability
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';

          // Toggle icons
          if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }

          console.log('Mobile menu closed - scroll position AFTER:', window.scrollY);
        }

        console.log('Mobile menu toggled, new state open:', !mobileMenu.classList.contains('hidden'));
      };

      // Add mobile section link handlers
      this.addMobileSectionLinkHandlers();

            // Check if already initialized - but force re-attach since navbar might load multiple times
      if (menuToggle.hasAttribute('data-mobile-initialized')) {
        console.log('Mobile menu already initialized, but re-attaching event listener to be safe...');
        // Remove old event listeners first
        menuToggle.removeAttribute('data-mobile-initialized');
        // Continue execution to re-attach event listeners - don't return
      }

      // Mark as initialized
      menuToggle.setAttribute('data-mobile-initialized', 'true');

      // Add mobile section link functionality
      this.addMobileSectionLinkHandlers();

            // MINIMAL click handler - testing for page jump
      menuToggle.addEventListener('click', (e) => {
        console.log('=== CLICK HANDLER START ===');
        console.log('Scroll position at start:', window.scrollY);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Call toggle
        toggleNavbar(e);

        console.log('Scroll position at end:', window.scrollY);
        console.log('=== CLICK HANDLER END ===');
      });

            // Close menu when clicking on any link (simple approach)
      const mobileNavLinks = mobileMenu.querySelectorAll('a');
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // Prevent page jumping for regular nav links
          if (link.getAttribute('href') === '#' || link.classList.contains('mobile-section-link')) {
            e.preventDefault();
            e.stopPropagation();
          }
          const mainNav = document.getElementById('main-nav');

                    // Force close the mobile menu
          mobileMenu.classList.add('hidden');
          mobileMenu.style.display = 'none';

          // Restore transparent class if it was previously transparent
          if (mainNav && mainNav.getAttribute('data-was-transparent') === 'true') {
            mainNav.classList.add('transparent');
            mainNav.removeAttribute('data-was-transparent');
            console.log('Restored transparent class after link click');
          }

          // Reset icons
          if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }

          // Restore scrolling
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';

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

  addMobileSectionLinkHandlers() {
    console.log('Adding mobile section link handlers...');

    // Handle mobile section links
    const mobileSectionLinks = document.querySelectorAll('.mobile-section-link');
    const mobileContactBtn = document.querySelector('.mobile-contact-btn');

    console.log('Found mobile section links:', mobileSectionLinks.length);
    console.log('Found mobile contact button:', !!mobileContactBtn);

    // Handle section links
    mobileSectionLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();

        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        console.log('Mobile section link clicked:', targetId);

        if (targetElement) {
          // Close mobile menu first
          this.closeMobileMenu();

          // Smooth scroll to section with offset
          setTimeout(() => {
            const offset = 80; // Account for fixed navbar
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 100); // Small delay to ensure menu is closed
        }
      });
    });

    // Handle contact button
    if (mobileContactBtn) {
      mobileContactBtn.addEventListener('click', (event) => {
        console.log('=== CONTACT BUTTON CLICKED ===');
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const targetElement = document.querySelector('#contact');
        console.log('Target contact element found:', !!targetElement);

        if (targetElement) {
          // Close mobile menu and handle Alpine.js state
          const mobileMenu = document.getElementById('mobile-menu');
          const mainNav = document.getElementById('main-nav');
          const menuToggle = document.getElementById('menu-toggle');
          const hamburgerIcon = menuToggle?.querySelector('.hamburger-icon');
          const closeIcon = menuToggle?.querySelector('.close-icon');

          if (mobileMenu) {
            // Close the mobile menu (visual)
            mobileMenu.classList.add('hidden');
            mobileMenu.style.display = 'none';

            // Handle Alpine.js navbarOpen state if Alpine is available
            if (window.Alpine && mainNav._x_dataStack) {
              const alpineData = mainNav._x_dataStack[0];
              if (alpineData && 'navbarOpen' in alpineData) {
                alpineData.navbarOpen = false;
                console.log('Updated Alpine.js navbarOpen to false');
              }
            }

            // Restore transparent class if it was previously transparent
            if (mainNav && mainNav.getAttribute('data-was-transparent') === 'true') {
              mainNav.classList.add('transparent');
              mainNav.removeAttribute('data-was-transparent');
              console.log('Restored transparent class after contact button click');
            }

            // Reset icons
            if (hamburgerIcon && closeIcon) {
              hamburgerIcon.classList.remove('hidden');
              closeIcon.classList.add('hidden');
            }

            // Restore scrolling
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';

            console.log('Mobile menu closed via contact button');
          }

          // Force scroll to contact section
          const performScroll = () => {
            const offset = 80; // Account for fixed navbar
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            console.log('Performing scroll - element position:', elementPosition, 'offset position:', offsetPosition);

            // Try both methods
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Backup: Instant scroll if smooth doesn't work
            setTimeout(() => {
              if (Math.abs(window.pageYOffset - offsetPosition) > 100) {
                console.log('Smooth scroll failed, using instant scroll');
                window.scrollTo(0, offsetPosition);
              }
            }, 500);
          };

          // Try immediate scroll first
          performScroll();

          // Also try with delay
          setTimeout(performScroll, 200);
        } else {
          console.log('Contact element not found!');
        }
      });
    } else {
      console.log('Mobile contact button not found!');
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    const menuToggle = document.getElementById('menu-toggle');
    const hamburgerIcon = menuToggle?.querySelector('.hamburger-icon');
    const closeIcon = menuToggle?.querySelector('.close-icon');

    if (mobileMenu) {
      // Close the mobile menu
      mobileMenu.classList.add('hidden');
      mobileMenu.style.display = 'none';

      // Restore transparent class if it was previously transparent
      if (mainNav && mainNav.getAttribute('data-was-transparent') === 'true') {
        mainNav.classList.add('transparent');
        mainNav.removeAttribute('data-was-transparent');
        console.log('Restored transparent class in closeMobileMenu');
      }

      // Reset icons
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }

      // Restore scrolling - simple approach
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      // Restore main navbar z-index
      if (mainNav) {
        mainNav.style.zIndex = '50';
      }

      console.log('Mobile menu closed via section link');
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

    // Method to scroll sub-nav to active link (from original navbar.js)
  scrollSubNavToActiveLink(activeLink) {
    const subNavContainer = document.querySelector('.sub-nav-container');
    if (activeLink && subNavContainer) {
      // Check if this link is already centered (prevent redundant scrolling)
      const containerRect = subNavContainer.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const linkCenter = linkRect.left + linkRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const offset = linkCenter - containerCenter;

      // Only scroll if the link is significantly off-center (>50px)
      if (Math.abs(offset) > 50) {
        // Smooth scroll the subnav to center the active link
        subNavContainer.scrollTo({
          left: subNavContainer.scrollLeft + offset,
          behavior: 'smooth'
        });

        // Update gradient visibility after scrolling
        setTimeout(() => {
          this.updateGradientVisibility();
        }, 300);

        // console.log(`Auto-scrolled subnav to show active link: ${activeLink.textContent}`); // Disabled for performance
      }
    }
  }

    // Method to update gradient visibility based on scroll position
  updateGradientVisibility() {
    const subNavContainer = document.querySelector('.sub-nav-container');
    const leftGradient = document.querySelector('.gradient-left');
    const rightGradient = document.querySelector('.gradient-right');
    const subNav = document.querySelector('#sub-nav');

    if (subNavContainer && leftGradient && rightGradient && subNav) {
      const scrollLeft = subNavContainer.scrollLeft;
      const maxScroll = subNavContainer.scrollWidth - subNavContainer.clientWidth;
      const isFixed = subNav.classList.contains('subnav-fixed');
      const isMobile = window.innerWidth <= 768;

      // Determine the correct gradient colors based on subnav state and theme
      const isDarkMode = document.documentElement.classList.contains('dark');
      let gradientColor, gradientColorFade;

      if (isDarkMode) {
        // Dark mode colors
        if (isMobile) {
          // Mobile uses solid dark background
          gradientColor = '#1f2937';
          gradientColorFade = 'rgba(31, 41, 55, 0.8)';
        } else if (isFixed) {
          // Fixed state uses more opaque dark background
          gradientColor = 'rgba(31, 41, 55, 0.95)';
          gradientColorFade = 'rgba(31, 41, 55, 0.7)';
        } else {
          // Normal state uses semi-transparent dark background
          gradientColor = 'rgba(31, 41, 55, 0.85)';
          gradientColorFade = 'rgba(31, 41, 55, 0.6)';
        }
      } else {
        // Light mode colors (original)
        if (isMobile) {
          // Mobile uses solid background
          gradientColor = '#f9fafb';
          gradientColorFade = 'rgba(249, 250, 251, 0.8)';
        } else if (isFixed) {
          // Fixed state uses more opaque background
          gradientColor = 'rgba(248, 250, 252, 0.95)';
          gradientColorFade = 'rgba(248, 250, 252, 0.7)';
        } else {
          // Normal state uses semi-transparent background
          gradientColor = 'rgba(248, 250, 252, 0.85)';
          gradientColorFade = 'rgba(248, 250, 252, 0.6)';
        }
      }

      // Update gradient backgrounds with !important to override CSS
      leftGradient.style.setProperty('background', `linear-gradient(to right, ${gradientColor}, ${gradientColorFade}, transparent)`, 'important');
      rightGradient.style.setProperty('background', `linear-gradient(to left, ${gradientColor}, ${gradientColorFade}, transparent)`, 'important');

      // Show/hide left gradient
      if (scrollLeft > 10) {
        leftGradient.style.opacity = '1';
      } else {
        leftGradient.style.opacity = '0';
      }

      // Show/hide right gradient
      if (scrollLeft < maxScroll - 10) {
        rightGradient.style.opacity = '1';
      } else {
        rightGradient.style.opacity = '0';
      }
    }
  }

  initSectionHighlighting() {
    const sections = ['about', 'tools', 'portfolio', 'recent-visuals', 'testimonials'];
    const subnavLinks = document.querySelectorAll('.subnav-link');
    let currentActiveSection = null;

    // Store reference to the class instance for use in nested functions
    const globalNavbar = this;

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

    // Method to update mobile menu background based on current section (optimized)
    let lastMobileMenuState = null;
    const updateMobileMenuBackground = (sectionId) => {
      const mobileMenu = document.getElementById('mobile-menu');

      if (mobileMenu) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isHomepage = currentPage === 'index.html' || currentPage === '';
        const isDarkMode = document.documentElement.classList.contains('dark');

        if (isDarkMode) {
          // Dark mode: always use black background
          mobileMenu.style.setProperty('background', 'black', 'important');
        } else if (isHomepage) {
          // Homepage in light mode: always use white background (no hero off-white)
          mobileMenu.style.setProperty('background', 'white', 'important');
        } else {
          // Other pages in light mode: use white background
          mobileMenu.style.setProperty('background', 'white', 'important');
        }
      }
    };

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

          // Auto-scroll subnav to show active link (mobile functionality)
          globalNavbar.scrollSubNavToActiveLink(activeLink);
        }

        // Update mobile menu background based on current section
        updateMobileMenuBackground(activeSection);
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

      // Set initial mobile menu background
      if (window.scrollY < 600) {
        updateMobileMenuBackground('about');
      } else {
        updateMobileMenuBackground('other');
      }

      // Initialize gradient visibility and add scroll listener to subnav
      const subNavContainer = document.querySelector('.sub-nav-container');
      if (subNavContainer) {
        globalNavbar.updateGradientVisibility();
        subNavContainer.addEventListener('scroll', () => {
          globalNavbar.updateGradientVisibility();
        });

        // Update gradients on window resize
        window.addEventListener('resize', () => {
          globalNavbar.updateGradientVisibility();
        });

        // Update gradients when subnav state changes (observe class changes)
        const subNav = document.querySelector('#sub-nav');
        if (subNav) {
          const observer = new MutationObserver(() => {
            globalNavbar.updateGradientVisibility();
          });
          observer.observe(subNav, { attributes: true, attributeFilter: ['class'] });
        }
      }
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

  initMobileMenuBackgroundChange() {
    // Only add scroll detection for homepage, set theme-appropriate background for all other pages
    if (this.currentPage !== 'index') {
      // For non-homepage pages: set theme-appropriate background and return
      setTimeout(() => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          const isDarkMode = document.documentElement.classList.contains('dark');

          if (isDarkMode) {
            // Dark mode: use black background
            mobileMenu.style.setProperty('background-color', 'black', 'important');
            console.log('Set dark background for non-homepage page:', this.currentPage);
          } else {
            // Light mode: always use white background (no auto-change)
            mobileMenu.style.setProperty('background-color', 'white', 'important');
            console.log('Set white background for non-homepage page:', this.currentPage);
          }
        }
      }, 500);
      return;
    }

    // Homepage-only: scroll-based background change (optimized)
    let lastScrollState = null;
    const updateMobileMenuBackground = () => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        const scrollY = window.scrollY;
        const isAtTop = scrollY < 200;

        // Only update if state actually changed
        if (lastScrollState !== isAtTop) {
          if (isAtTop) {
            // Homepage at top - add hero-bg class for off-white background
            mobileMenu.classList.add('hero-bg');
            // console.log('Added hero-bg class for homepage top (scroll < 200px)'); // Disabled excessive logging
          } else {
            // Homepage scrolled down - remove hero-bg class for white background
            mobileMenu.classList.remove('hero-bg');
            // console.log('Removed hero-bg class for homepage scrolled (scroll >= 200px)'); // Disabled excessive logging
          }
          lastScrollState = isAtTop;
          // console.log('Mobile menu classes:', mobileMenu.className); // Disabled excessive logging
        }
      }
    };

    // Set initial background for homepage
    setTimeout(() => {
      updateMobileMenuBackground();
    }, 500);

    // Add optimized scroll listener for homepage only
    let ticking = false;
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      // Only process if scroll crossed the threshold (200px) or changed significantly
      if (Math.abs(currentScrollY - lastScrollY) > 15 ||
          (lastScrollY < 200 && currentScrollY >= 200) ||
          (lastScrollY >= 200 && currentScrollY < 200)) {

        if (!ticking) {
          requestAnimationFrame(() => {
            updateMobileMenuBackground();
            ticking = false;
          });
          ticking = true;
        }
        lastScrollY = currentScrollY;
      }
    }, { passive: true });

    console.log('Mobile menu background change initialized for homepage only');
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
        box-shadow: none !important;
      }

      /* Subnav when main nav is hidden (moves to top) */
      #sub-nav.subnav-fixed {
        background-color: rgba(255, 255, 255, 0.85) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        box-shadow: none !important;
      }

      /* Dark theme for subnav */
      .dark #sub-nav {
        background-color: rgba(0, 0, 0, 0.85) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        box-shadow: none !important;
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
        background: #F2F2F4 !important;
        z-index: 9998 !important;
        overflow-y: auto !important;
      }

      /* Mobile menu text colors for light background */
      #main-nav [x-show="navbarOpen"] a,
      #main-nav [x-show="navbarOpen"] .text-white {
        color: #1f2937 !important;
      }

      #main-nav [x-show="navbarOpen"] .text-gray-500 {
        color: #6b7280 !important;
      }

      #main-nav [x-show="navbarOpen"] span {
        color: #1f2937 !important;
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

      /* Transparent navbar at top of page - but not the mobile menu */
      #main-nav.transparent:not([x-show="navbarOpen"]) {
        /* background-color: transparent !important; */
        border-bottom: 1px solid transparent !important;
        backdrop-filter: none !important;
      }

      /* Ensure navbar background is transparent when collapsed (not mobile menu) */
      #main-nav.transparent {
        background-color: transparent !important;
        border-bottom: 1px solid transparent !important;
        backdrop-filter: none !important;
      }

      /* Override: Mobile menu should never be transparent */
      #main-nav.transparent [x-show="navbarOpen"] {
        background-color: white !important;
        border-bottom: 1px solid #e5e7eb !important;
        backdrop-filter: blur(10px) !important;
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

      /* Dark mode: Override Mobile menu should never be transparent */
      .dark #main-nav.transparent [x-show="navbarOpen"] {
        background-color: black !important;
        border-bottom: 1px solid #374151 !important;
        backdrop-filter: blur(10px) !important;
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

      /* Mobile menu should always have solid background, even when navbar is transparent */
      #main-nav.transparent [x-show="navbarOpen"] {
        background-color: white !important;
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

      /* Dark mode mobile menu should always have solid background, even when navbar is transparent */
      .dark #main-nav.transparent [x-show="navbarOpen"] {
        background-color: black !important;
      }

      .dark #main-nav [x-show="dropdownOpen"] a {
        color: white !important;
      }

      .dark #main-nav [x-show="dropdownOpen"] a:hover {
        background-color: transparent !important;
        color: #a78bfa !important;
      }

      /* Light mode mobile menu - default white for all pages */
      #main-nav [x-show="navbarOpen"] {
        background: white !important;
        color: #1f2937 !important;
      }

      /* Off-white background only for homepage at top */
      body.home-page #main-nav [x-show="navbarOpen"].hero-bg {
        background: #F2F2F4 !important;
      }

      /* Light mode mobile menu - white background for other sections */
      #main-nav [x-show="navbarOpen"].mobile-menu-white {
        background: white !important;
      }

      /* Force white background with higher specificity */
      #main-nav div[x-show="navbarOpen"].mobile-menu-white {
        background: white !important;
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

      /* Mobile menu scrollability - ensure it's always scrollable */
      #mobile-menu {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important; /* Smooth scrolling on iOS */
        max-height: calc(100vh - 72px) !important;
      }

      /* Ensure content inside mobile menu can scroll */
      #mobile-menu > div {
        min-height: 100% !important;
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

      // Initialize mobile menu background changes for all pages
      this.initMobileMenuBackgroundChange();

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
    const mobileMenu = document.getElementById('mobile-menu');
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
    const mobileMenu = document.getElementById('mobile-menu');

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
    // Make instance available globally for theme updates
    window.globalNavbarInstance = globalNavbarInstance;
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

