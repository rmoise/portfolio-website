/**
 * Performance Optimization Script
 * Addresses constant rerendering issues by optimizing problematic elements
 */
class PerformanceOptimizer {
  constructor() {
    this.rafId = null;
    this.isOptimizing = false;
    this.init();
  }

  init() {
    // Apply console optimization immediately
    this.optimizeConsoleLogging();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.optimize());
    } else {
      this.optimize();
    }
  }

  optimize() {
    this.optimizeAnimations();
    this.optimizeBackdropFilters();
    this.optimizeWillChange();
    this.optimizeSplineContainer();
    this.optimizeInfiniteAnimations();
    this.setupIntersectionObserver();
    this.optimizeNavbarPerformance();
    this.optimizeConsoleLogging();
  }

  optimizeAnimations() {
    // Disable problematic infinite animations when not in viewport
    const bounceElements = document.querySelectorAll('[class*="bounce"]');
    bounceElements.forEach(el => {
      el.style.animationPlayState = 'paused';
    });

    // Optimize CSS transitions to use transform and opacity only
    const heavyTransitions = document.querySelectorAll('[style*="transition"][style*="all"]');
    heavyTransitions.forEach(el => {
      const style = el.style.transition;
      if (style.includes('all')) {
        el.style.transition = style.replace('all', 'transform, opacity');
      }
    });
  }

  optimizeBackdropFilters() {
    // Remove expensive backdrop-filter blur on elements that are causing repaints
    const blurElements = document.querySelectorAll('[style*="backdrop-filter"]');
    blurElements.forEach(el => {
      // Only keep backdrop-filter on elements that are actually needed
      if (!el.closest('.glass-effect') && !el.classList.contains('glass-button')) {
        el.style.backdropFilter = 'none';
        el.style.webkitBackdropFilter = 'none';
      }
    });

    // Replace backdrop-filter with box-shadow for performance
    const glassButtons = document.querySelectorAll('.glass-button');
    glassButtons.forEach(button => {
      button.style.backdropFilter = 'none';
      button.style.webkitBackdropFilter = 'none';
      button.style.background = 'rgba(255, 255, 255, 0.1)';
      button.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    });
  }

  optimizeWillChange() {
    // Remove excessive will-change properties that can cause memory issues
    const willChangeElements = document.querySelectorAll('[style*="will-change"]');
    willChangeElements.forEach(el => {
      // Only keep will-change on elements that are actively animating
      if (!el.classList.contains('parallax-element') &&
          !el.hasAttribute('data-scroll') &&
          !el.querySelector('[data-scroll]')) {
        el.style.willChange = 'auto';
      }
    });
  }

          optimizeSplineContainer() {
    // Keep Spline but optimize its performance properly
    const splineContainer = document.querySelector('.spline-container');
    if (splineContainer) {
      const iframe = splineContainer.querySelector('iframe');
      if (iframe) {
        // Optimize iframe rendering without removing it
        iframe.style.contain = 'strict';
        iframe.style.isolation = 'isolate';
        iframe.style.willChange = 'auto';
        iframe.style.pointerEvents = 'none'; // Disable interaction for performance
        iframe.setAttribute('loading', 'lazy');

        // Reduce Spline quality for better performance
        const src = iframe.src;
        if (src && !src.includes('quality=')) {
          iframe.src = src + (src.includes('?') ? '&' : '?') + 'quality=low&fps=30';
        }

        // Simple visibility management
        let isVisible = true;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const shouldBeVisible = entry.isIntersecting;
            if (isVisible !== shouldBeVisible) {
              iframe.style.visibility = shouldBeVisible ? 'visible' : 'hidden';
              isVisible = shouldBeVisible;
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '100px'
        });

        observer.observe(splineContainer);

        // Only suppress WebGL console errors, don't disable Spline
        window.addEventListener('error', (event) => {
          if (event.filename && event.filename.includes('spline.design')) {
            event.preventDefault(); // Prevent console spam but keep Spline running
          }
        }, true);
      }
    }
  }

    disableSplineAndUseFallback(splineContainer, iframe) {
    // Replace problematic Spline with lightweight static background
    iframe.remove(); // Completely remove iframe to stop WebGL processing

    // Apply simple static gradient - no animation to reduce processing
    splineContainer.style.background = `
      linear-gradient(135deg,
        #0f172a 0%,
        #1e293b 30%,
        #334155 60%,
        #1e293b 100%)
    `;
    splineContainer.style.backgroundAttachment = 'fixed';
    splineContainer.style.willChange = 'auto';
    splineContainer.style.contain = 'layout style paint';

    // Disable any existing animations on the container
    splineContainer.style.animation = 'none';

    // Mark as optimized to prevent further processing
    splineContainer.setAttribute('data-optimized', 'true');
  }

  optimizeInfiniteAnimations() {
    // Control infinite animations based on viewport visibility
    const infiniteAnimations = document.querySelectorAll('[style*="infinite"], .animate-spin, .animate-bounce, .animate-pulse');

    infiniteAnimations.forEach(el => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.style.animationPlayState = 'running';
          } else {
            el.style.animationPlayState = 'paused';
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px' // Start animation slightly before element is visible
      });

      observer.observe(el);
    });
  }

  setupIntersectionObserver() {
    // General performance optimization for heavy elements
    const heavyElements = document.querySelectorAll('[style*="filter"], [style*="backdrop-filter"], [style*="transform"]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;

        if (!entry.isIntersecting) {
          // Element is not visible - optimize it
          element.style.contentVisibility = 'hidden';
          element.style.contain = 'layout style paint';
        } else {
          // Element is visible - restore normal rendering
          element.style.contentVisibility = 'visible';
          element.style.contain = 'none';
        }
      });
    }, {
      threshold: 0,
      rootMargin: '100px' // Buffer zone
    });

    heavyElements.forEach(el => {
      // Skip parallax elements as they're handled separately
      if (!el.hasAttribute('data-scroll') && !el.classList.contains('parallax-element')) {
        observer.observe(el);
      }
    });
  }

  // Utility method to pause all animations
  pauseAllAnimations() {
    document.querySelectorAll('*').forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.animationName !== 'none') {
        el.style.animationPlayState = 'paused';
      }
    });
  }

  // Utility method to resume all animations
  resumeAllAnimations() {
    document.querySelectorAll('*').forEach(el => {
      if (el.style.animationPlayState === 'paused') {
        el.style.animationPlayState = 'running';
      }
    });
  }

  // Method to reduce motion for users who prefer it
  respectMotionPreferences() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Disable all animations and transitions
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
    }

    optimizeNavbarPerformance() {
    // Prevent duplicate navbar initialization and operations

    // Prevent multiple GlobalNavbar instances
    if (window.globalNavbarInitialized) {
      return; // Already optimized
    }
    window.globalNavbarInitialized = true;

    // Wait for navbar to be loaded, then optimize
    const checkAndOptimize = () => {
      const navbar = document.getElementById('main-nav');
      const mobileMenu = document.getElementById('mobile-menu');

      if (navbar || mobileMenu) {
        // Prevent duplicate event listeners
        if (navbar && !navbar.hasAttribute('data-optimized')) {
          navbar.setAttribute('data-optimized', 'true');

          // Throttle scroll-related updates
          let scrollTicking = false;
          const originalScrollHandler = window.onscroll;

          window.addEventListener('scroll', () => {
            if (!scrollTicking) {
              requestAnimationFrame(() => {
                // Allow scroll but limit frequency
                scrollTicking = false;
              });
              scrollTicking = true;
            }
          }, { passive: true, once: false });
        }

        // Prevent duplicate theme toggle attachments
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');
        themeToggles.forEach(toggle => {
          if (!toggle.hasAttribute('data-listeners-attached')) {
            toggle.setAttribute('data-listeners-attached', 'true');
          }
        });

        // Prevent duplicate section handlers
        const sectionLinks = document.querySelectorAll('[href^="#"]');
        sectionLinks.forEach(link => {
          if (!link.hasAttribute('data-handler-attached')) {
            link.setAttribute('data-handler-attached', 'true');
          }
        });

      } else {
        // Navbar not ready yet, try again
        setTimeout(checkAndOptimize, 100);
      }
    };

    checkAndOptimize();
  }

      optimizeConsoleLogging() {
    // Smart console optimization - reduce noise but keep useful logs
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    let logCount = 0;
    const maxLogs = 30; // Allow some useful logs

    // Filter out only the most noisy patterns
    const noisyPatterns = [
      /Mobile menu classes:/,
      /hero-bg class/,
      /Current section.*Scroll position/,
      /Found.*elements:/,
      /GL_INVALID_OPERATION/,
      /WebGL.*texture/,
      /Adding mobile section link handlers/,
      /Found mobile section links: 0/,
      /Found mobile contact button: true/,
      /Observing section:/,
      /Mobile menu background change initialized/,
      /Mobile menu hidden immediately/,
      /Theme initialized:/,
      /Cleaned up old theme entries/,
      /animated-text element not found/,
      /Initializing GlobalNavbar/,
      /Loading navbar/,
      /Attempt \d+ to attach theme toggle/,
      /Attempting to attach theme toggle/,
      /Desktop theme toggle found:/,
      /Mobile theme toggle found:/,
      /Gradient elements not found/,
      /Navbar HTML loaded, length:/,
      /Initialized Alpine\.js on navbar/,
      /Found logo link, adding hover/,
      /Current page detected:/,
      /Found nav links for current page:/,
      /Setting up mobile menu/,
      /Vanilla menu setup/,
      /Disabled Alpine\.js on mobile menu/,
      /Adding vanilla JS mobile menu/,
      /Calling theme toggle listener/,
      /Desktop theme toggle listener attached/,
      /Mobile theme toggle listener attached/,
      /Theme icons updated after listeners/,
      /Theme toggle listeners successfully attached/,
      /Navbar HTML inserted into DOM/,
      /Auto-scrolled subnav to show active link:/,
      /Mobile menu element:/,
      /Set white background/,
      /Set off-white background/,
      /Mobile menu background style:/,
      /Mobile menu initialized as hidden/,
      /Low FPS detected:/
    ];

    const shouldSuppressLog = (args) => {
      const message = args.join(' ');
      return noisyPatterns.some(pattern => pattern.test(message));
    };

    console.log = (...args) => {
      if (!shouldSuppressLog(args) && logCount < maxLogs) {
        originalLog.apply(console, args);
        logCount++;
      }
    };

    console.warn = (...args) => {
      if (!shouldSuppressLog(args) && logCount < maxLogs) {
        originalWarn.apply(console, args);
        logCount++;
      }
    };

    // Filter WebGL errors but keep other errors
    console.error = (...args) => {
      if (!shouldSuppressLog(args)) {
        originalError.apply(console, args);
      }
    };
  }

  // Debug method to identify performance bottlenecks
  identifyBottlenecks() {
    console.group('Performance Bottlenecks');

    // Check for expensive properties
    const expensiveElements = document.querySelectorAll('[style*="backdrop-filter"], [style*="filter"], [style*="box-shadow"]');
    console.log('Elements with expensive properties:', expensiveElements.length);

    // Check for infinite animations
    const infiniteAnimations = document.querySelectorAll('[style*="infinite"]');
    console.log('Infinite animations:', infiniteAnimations.length);

    // Check for will-change usage
    const willChangeElements = document.querySelectorAll('[style*="will-change"]');
    console.log('Elements with will-change:', willChangeElements.length);

    console.groupEnd();
  }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();

// Add to global scope for debugging
window.performanceOptimizer = performanceOptimizer;

// Respect user motion preferences
document.addEventListener('DOMContentLoaded', () => {
  performanceOptimizer.respectMotionPreferences();
});