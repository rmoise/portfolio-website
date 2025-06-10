/**
 * Ultra-Smooth Parallax Controller
 * Based on Context7 research: Locomotive Scroll + SimpleParallax + Framer Motion techniques
 * Eliminates stuttering and pauses with advanced interpolation and GPU optimization
 */

class UltraSmoothParallax {
  constructor() {
    // Core properties
    this.elements = [];
    this.isScrolling = false;
    this.ticking = false;

    // Smooth scrolling interpolation (Locomotive Scroll technique)
    this.scrollTop = 0;
    this.targetScrollTop = 0;
    this.smoothness = 0.08; // Lower = smoother, higher = more responsive
    this.previousScrollTop = 0;

    // Performance optimization
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fps = 60;

    // Advanced scroll tracking
    this.scrollDirection = 1;
    this.scrollVelocity = 0;
    this.maxVelocity = 0;

    // GPU acceleration flags
    this.hasWillChange = false;
    this.hasTransform3d = false;

    // Performance optimization caching
    this.lastUpdateScroll = 0;
    this.updateThreshold = 1; // Only update if scroll changed by more than 1px
    this.elementCache = new Map(); // Cache transform values
    this.visibleElements = new Set(); // Track currently visible elements

    this.init();
  }

  init() {
    // Clear any existing transforms on parallax-cs elements first
    this.clearFixedParallaxTransforms();

    // Collect parallax elements with data attributes (Locomotive style)
    this.collectElements();

    // Setup smooth scroll interpolation
    this.setupSmoothScrolling();

    // Bind optimized events
    this.bindEvents();

    // Enable GPU optimizations
    this.enableGPUAcceleration();

    // Start the smooth animation loop
    this.startAnimationLoop();
  }

  clearFixedParallaxTransforms() {
    // Ensure parallax-cs elements have no transforms applied
    const parallaxCsElements = document.querySelectorAll('.parallax-cs');
    parallaxCsElements.forEach(element => {
      element.style.transform = 'none';
      element.style.willChange = 'auto';
      element.style.backfaceVisibility = 'visible';

      // Also clear transforms from any child elements
      const children = element.querySelectorAll('*');
      children.forEach(child => {
        child.style.transform = 'none';
        child.style.willChange = 'auto';
      });
    });
  }

  collectElements() {
    // Detect if we're on a case study page
    const isCaseStudyPage = window.location.pathname.includes('case.html') ||
                           document.querySelector('.parallax-cs') !== null;

    // Collect elements with data-scroll attributes (Locomotive Scroll pattern)
    const scrollElements = document.querySelectorAll('[data-scroll]');

    scrollElements.forEach((element, index) => {
      const speed = parseFloat(element.dataset.scrollSpeed) || 0.5;
      const direction = element.dataset.scrollDirection || 'vertical';
      const offset = parseFloat(element.dataset.scrollOffset) || 0;
      const target = element.dataset.scrollTarget || element;

      this.elements.push({
        element,
        type: 'data-scroll',
        speed,
        direction,
        offset,
        target: typeof target === 'string' ? document.querySelector(target) : target,
        bounds: this.getElementBounds(element),
        transform: { x: 0, y: 0, z: 0 },
        isVisible: false,
        progress: 0
      });
    });

    // Skip .parallax-cs elements entirely - they use CSS background-attachment: fixed
    // No JavaScript processing needed for case study parallax

    // Legacy parallax support (homepage style)
    const legacyParallax = document.querySelectorAll('.parallax');
    legacyParallax.forEach((element) => {
      if (!element.hasAttribute('data-scroll') && !element.classList.contains('parallax-cs')) {
        this.elements.push({
          element,
          type: 'legacy-parallax',
          speed: 0.5,
          direction: 'vertical',
          offset: 0,
          target: element,
          bounds: this.getElementBounds(element),
          transform: { x: 0, y: 0, z: 0 },
          isVisible: false,
          progress: 0
        });
      }
    });

    // Custom image sections
    const customImages = document.querySelectorAll('.custom-image-section .image');
    customImages.forEach((element) => {
      if (!element.hasAttribute('data-scroll')) {
        this.elements.push({
          element,
          type: 'custom-image',
          speed: 0.3,
          direction: 'vertical',
          offset: 0,
          target: element,
          bounds: this.getElementBounds(element),
          transform: { x: 0, y: 0, z: 0 },
          isVisible: false,
          progress: 0
        });
      }
    });
  }

  getElementBounds(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
      width: rect.width,
      height: rect.height,
      bottom: rect.top + window.pageYOffset + rect.height,
      right: rect.left + window.pageXOffset + rect.width
    };
  }

  setupSmoothScrolling() {
    // Create smooth scroll interpolation (Locomotive Scroll technique)
    this.targetScrollTop = window.pageYOffset;
    this.scrollTop = this.targetScrollTop;
  }

  enableGPUAcceleration() {
    // Apply GPU acceleration to parallax elements (SimpleParallax technique)
    this.elements.forEach(item => {
      const { element, type } = item;



      // Force GPU layer creation for moving parallax elements
      element.style.willChange = 'transform';
      element.style.backfaceVisibility = 'hidden';
      element.style.perspective = '1000px';
      element.style.transform = 'translate3d(0, 0, 0)';

      // Optimize rendering but preserve interactivity for buttons and links
      const isInteractive = element.tagName === 'A' ||
                           element.tagName === 'BUTTON' ||
                           element.querySelector('a, button') ||
                           element.closest('a, button');

      if (!isInteractive) {
        element.style.pointerEvents = 'none';
        element.style.userSelect = 'none';
      }
    });

    // Optimize container elements
    const containers = document.querySelectorAll('[data-scroll-container], .parallax-content');
    containers.forEach(container => {
      container.style.willChange = 'transform';
      container.style.backfaceVisibility = 'hidden';
      container.style.contain = 'layout style paint';
    });
  }

  bindEvents() {
    // High-performance scroll listener with throttling
    let scrollTimeout;
    let lastScrollTime = 0;

    window.addEventListener('scroll', () => {
      const now = performance.now();

      // Throttle scroll updates to prevent excessive recalculations
      if (now - lastScrollTime < 8) return; // ~120fps max
      lastScrollTime = now;

      this.targetScrollTop = window.pageYOffset;

      // Track scroll velocity for adaptive performance
      this.scrollVelocity = Math.abs(this.targetScrollTop - this.previousScrollTop);
      this.maxVelocity = Math.max(this.maxVelocity, this.scrollVelocity);

      // Adaptive smoothness and update threshold based on scroll speed
      if (this.scrollVelocity > 50) {
        this.smoothness = 0.15; // More responsive for fast scrolling
        this.updateThreshold = 3; // Higher threshold for fast scrolling
      } else if (this.scrollVelocity < 5) {
        this.smoothness = 0.05; // Ultra smooth for slow scrolling
        this.updateThreshold = 0.5; // Lower threshold for slow scrolling
      } else {
        this.smoothness = 0.08; // Default smoothness
        this.updateThreshold = 1; // Default threshold
      }

      // Clear any existing timeout
      clearTimeout(scrollTimeout);
      this.isScrolling = true;

      // Set timeout to detect scroll end
      scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
        this.maxVelocity = 0;
      }, 150);

    }, { passive: true });

    // Optimized resize handler
    window.addEventListener('resize', this.debounce(() => {
      const newHeight = window.innerHeight;
      const newWidth = window.innerWidth;

      // Only recalculate if size changed significantly (prevents mobile scroll issues)
      const heightChange = Math.abs(newHeight - this.windowHeight);
      const widthChange = Math.abs(newWidth - this.windowWidth);

      if (heightChange > 10 || widthChange > 10) {
        this.windowHeight = newHeight;
        this.windowWidth = newWidth;

        // Clear caches
        this.elementCache.clear();
        this.visibleElements.clear();

        // Recalculate element bounds
        this.elements.forEach(item => {
          item.bounds = this.getElementBounds(item.element);
        });

        // Force immediate update
        this.updateElements();
      }
    }, 150), { passive: true });

    // Visibility change optimization
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  startAnimationLoop() {
    const animate = (currentTime) => {
      // Calculate FPS for performance monitoring
      if (this.lastFrameTime) {
        const deltaTime = currentTime - this.lastFrameTime;
        this.fps = Math.round(1000 / deltaTime);
      }
      this.lastFrameTime = currentTime;

      // Smooth scroll interpolation (Locomotive Scroll technique)
      const scrollDiff = this.targetScrollTop - this.scrollTop;
      let shouldUpdate = false;

      if (Math.abs(scrollDiff) > 0.1) {
        this.scrollTop += scrollDiff * this.smoothness;
        shouldUpdate = true;
      } else if (this.isScrolling && Math.abs(this.targetScrollTop - this.scrollTop) > 0.1) {
        this.scrollTop = this.targetScrollTop;
        shouldUpdate = true;
      }

      // Only update elements if scroll position changed significantly
      if (shouldUpdate && Math.abs(this.scrollTop - this.lastUpdateScroll) > this.updateThreshold) {
      this.updateElements();
        this.lastUpdateScroll = this.scrollTop;
      }

      // Track scroll direction
      this.scrollDirection = this.scrollTop > this.previousScrollTop ? 1 : -1;
      this.previousScrollTop = this.scrollTop;

      // Continue animation loop
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  updateElements() {
    // Batch DOM reads first, then writes (Framer Motion technique)
    const updates = [];
    const buffer = 300; // Larger buffer to reduce recalculation

    this.elements.forEach((item, index) => {
      const { element, speed, direction, offset, bounds, type } = item;
      const elementId = `element_${index}`;

      // Check if element is in viewport (with buffer)
      const isInViewport = (
        bounds.bottom >= this.scrollTop - buffer &&
        bounds.top <= this.scrollTop + this.windowHeight + buffer
      );

      // Track visibility changes
      const wasVisible = this.visibleElements.has(elementId);

      if (isInViewport) {
        this.visibleElements.add(elementId);
      } else {
        this.visibleElements.delete(elementId);
      }

      // Skip elements that are not visible and weren't visible before
      if (!isInViewport && !wasVisible) return;



      // Calculate parallax values
      const parallaxValue = this.calculateParallaxValue(bounds, speed, direction, offset);

      // Check if transform actually changed (avoid unnecessary DOM updates)
      const cached = this.elementCache.get(elementId);
      const transformChanged = !cached ||
        Math.abs(cached.y - parallaxValue.y) > 0.1 ||
        Math.abs(cached.x - parallaxValue.x) > 0.1;

      if (transformChanged || (isInViewport && !wasVisible)) {
        updates.push({
          element,
          transform: parallaxValue,
          elementId
        });

        // Cache the new transform
        this.elementCache.set(elementId, parallaxValue);
      }

      item.isVisible = isInViewport;
    });

    // Apply all transforms in batch (only elements that actually changed)
    updates.forEach(({ element, transform }) => {
      this.applyTransform(element, transform);
    });
  }

  calculateElementProgress(bounds) {
    // Calculate how much of the element has scrolled through the viewport
    const elementTop = bounds.top - this.scrollTop;
    const elementHeight = bounds.height;
    const viewportHeight = this.windowHeight;

    const progress = (viewportHeight - elementTop) / (viewportHeight + elementHeight);
    return Math.max(0, Math.min(1, progress));
  }

  calculateParallaxValue(bounds, speed, direction, offset) {
    // Calculate parallax transform value
    const elementCenter = bounds.top + bounds.height / 2;
    const viewportCenter = this.scrollTop + this.windowHeight / 2;
    const distance = elementCenter - viewportCenter;

    let transform = { x: 0, y: 0, z: 0 };

    if (direction === 'vertical') {
      transform.y = (distance * speed) + offset;
    } else if (direction === 'horizontal') {
      transform.x = (distance * speed) + offset;
    }

    // Limit transform values to prevent excessive movement
    transform.y = Math.max(-500, Math.min(500, transform.y));
    transform.x = Math.max(-500, Math.min(500, transform.x));

    return transform;
  }

  applyTransform(element, transform) {
    // Apply transform with GPU acceleration (SimpleParallax technique)
    const { x, y, z } = transform;
    element.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  pause() {
    this.isScrolling = false;
  }

  resume() {
    this.targetScrollTop = window.pageYOffset;
    this.scrollTop = this.targetScrollTop;
    this.updateElements();
  }

  refresh() {
    // Clear all caches for fresh calculation
    this.elementCache.clear();
    this.visibleElements.clear();
    this.lastUpdateScroll = 0;

    // Recalculate all element bounds and update
    this.elements.forEach(item => {
      item.bounds = this.getElementBounds(item.element);
    });
    this.updateElements();
  }

  destroy() {
    // Clean up event listeners and reset styles
    this.elements.forEach(item => {
      const { element } = item;
      element.style.transform = '';
      element.style.willChange = '';
      element.style.backfaceVisibility = '';
      element.style.perspective = '';
    });

    this.elements = [];
  }

  // Performance monitoring
  getPerformanceStats() {
    return {
      fps: this.fps,
      elementCount: this.elements.length,
      scrollVelocity: this.scrollVelocity,
      maxVelocity: this.maxVelocity,
      smoothness: this.smoothness,
      isScrolling: this.isScrolling
    };
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const ultraSmoothParallax = new UltraSmoothParallax();

    // Global access for debugging
    window.ultraSmoothParallax = ultraSmoothParallax;

    // Performance monitoring in development (reduced verbosity)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      let lowFpsCount = 0;
      setInterval(() => {
        const stats = ultraSmoothParallax.getPerformanceStats();
        if (stats.fps < 30) { // More aggressive threshold
          lowFpsCount++;
          if (lowFpsCount >= 3) { // Only warn after 3 consecutive low FPS readings
            console.warn('Consistently low FPS detected:', { fps: stats.fps, elementCount: stats.elementCount });
            lowFpsCount = 0; // Reset counter
          }
        } else {
          lowFpsCount = 0; // Reset if FPS is good
        }
      }, 3000); // Check less frequently
    }
  }
});