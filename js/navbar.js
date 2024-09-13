document.addEventListener('alpine:init', () => {
  Alpine.data('navbar', () => ({
    navbarOpen: false,
    dropdownOpen: false,
    categoriesOpen: false,
    nestedDropdownOpen: false,
    currentPage: '',
    lastActiveIndex: -1,
    subNavContainer: null,
    subNavLinks: [],
    lastScrollY: 0,

    init() {
      this.currentPage = this.getCurrentPage()
      this.dropdownOpen =
        this.shouldExpandDropdown('portfolio') || window.innerWidth < 1024
      this.categoriesOpen = this.shouldExpandDropdown('design-systems')
      this.nestedDropdownOpen = this.shouldExpandDropdown('web-dev')
      this.subNavContainer = document.querySelector('.sub-nav-container')
      this.subNavLinks = Array.from(
        document.querySelectorAll('.sub-nav-container a'),
      )
      this.initializeScrollObserver()
    },

    getCurrentPage() {
      const path = location.pathname.split('/').pop().replace('.html', '')
      return path ? path : 'index'
    },

    isActive(page) {
      return this.currentPage === page
    },

    shouldExpandDropdown(dropdown) {
      const dropdowns = {
        portfolio: [
          'kytocase',
          'smunchcase',
          'cogalleriescase',
          'organize',
          'pffcase',
          'stak',
        ],
        'design-systems': [
          'kytocase',
          'smunchcase',
          'cogalleriescase',
          'organize',
          'pffcase',
          'stak',
        ],
        'web-dev': ['pokemoncase', 'meetcase', 'myflixcase', 'chatcase'],
      }
      return (
        dropdowns[dropdown] && dropdowns[dropdown].includes(this.currentPage)
      )
    },

    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen
      const menu = document.getElementById('navbar-multi-level')
      if (menu) {
        menu.classList.toggle('menu-scrollable', this.navbarOpen)
      }

      if (this.navbarOpen) {
        // Store current scroll position
        document.body.dataset.scrollPosition = window.scrollY

        // Lock the body scroll
        document.body.classList.add('no-scroll')

        // Restore dropdown states if needed
        this.restoreDropdownStates()
      } else {
        // Unlock the body scroll
        document.body.classList.remove('no-scroll')

        // Restore the body scroll
        const scrollPosition = document.body.dataset.scrollPosition || 0
        window.scrollTo(0, parseInt(scrollPosition, 10))
      }
    },

    restoreDropdownStates() {
      // Restore the state of dropdowns
      this.dropdownOpen =
        this.shouldExpandDropdown('portfolio') || window.innerWidth < 1024
      this.categoriesOpen = this.shouldExpandDropdown('design-systems')
      this.nestedDropdownOpen = this.shouldExpandDropdown('web-dev')
    },

    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
      if (this.dropdownOpen) {
        this.categoriesOpen = false
        this.nestedDropdownOpen = false
      }
    },

    toggleCategories() {
      this.categoriesOpen = !this.categoriesOpen
      if (this.categoriesOpen) {
        this.nestedDropdownOpen = false
      }
    },

    toggleNestedDropdown() {
      this.nestedDropdownOpen = !this.nestedDropdownOpen
      if (this.nestedDropdownOpen) {
        this.categoriesOpen = false
      }
    },

    closeNavbar(excludeDropdownClose = false) {
      setTimeout(() => {
        this.navbarOpen = false
        document.body.classList.remove('no-scroll')
        const menu = document.getElementById('navbar-multi-level')
        if (menu) {
          menu.classList.remove('menu-scrollable')
        }

        if (!excludeDropdownClose) {
          this.dropdownOpen = false
          this.categoriesOpen = false
          this.nestedDropdownOpen = false
        }
      }, 300)
    },

    scrollToSection(section) {
      const element = document.querySelector(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        this.closeNavbar(true)
      } else {
        console.error(`Element ${section} not found`)
      }
    },

    handleContactClick() {
      this.scrollToSection('#contact')
      this.closeNavbar(true)
    },

    scrollSubNav(activeIndex) {
      if (this.subNavLinks.length > 0 && this.subNavContainer) {
        const activeLink = this.subNavLinks[activeIndex]
        if (activeLink) {
          const containerRect = this.subNavContainer.getBoundingClientRect()
          const linkRect = activeLink.getBoundingClientRect()
          const offset =
            linkRect.left -
            containerRect.left -
            containerRect.width / 2 +
            linkRect.width / 2
          this.subNavContainer.scrollLeft += offset
        }
      }
    },

    initializeScrollObserver() {
      const sections = this.subNavLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter((el) => el)
      const options = {
        root: null,
        rootMargin: '0px 0px -50% 0px',
        threshold: 0.5,
      }
      const observer = new IntersectionObserver((entries) => {
        let currentActiveIndex = this.lastActiveIndex
        entries.forEach((entry) => {
          const index = sections.indexOf(entry.target)
          if (entry.isIntersecting) {
            if (index !== -1) {
              currentActiveIndex = index
            }
          }
        })

        if (window.scrollY < this.lastScrollY) {
          if (
            this.lastActiveIndex !== -1 &&
            entries[0].boundingClientRect.top > 0
          ) {
            currentActiveIndex = this.lastActiveIndex - 1
          }
        }

        this.subNavLinks.forEach((link) =>
          link.classList.remove('underline', 'font-semibold'),
        )
        if (currentActiveIndex > -1) {
          const activeLink = this.subNavLinks[currentActiveIndex]
          activeLink.classList.add('underline', 'font-semibold')
          this.scrollSubNav(currentActiveIndex)
        }

        this.lastActiveIndex = currentActiveIndex
        this.lastScrollY = window.scrollY
      }, options)

      sections.forEach((section) => observer.observe(section))
    },
  }))
})
