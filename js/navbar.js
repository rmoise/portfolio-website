document.addEventListener('alpine:init', () => {
    Alpine.data('navbar', () => ({
        navbarOpen: false,
        dropdownOpen: false,
        categoriesOpen: false,
        nestedDropdownOpen: false,
        currentPage: '',
        lastActiveIndex: -1, // Track the last active index
        subNavContainer: null, // Container for horizontal scrolling
        subNavLinks: [], // Sub-navigation links

        init() {
            this.currentPage = this.getCurrentPage();
            this.dropdownOpen = this.shouldExpandDropdown('portfolio') || window.innerWidth < 1024;
            this.categoriesOpen = this.shouldExpandDropdown('design-systems');
            this.nestedDropdownOpen = this.shouldExpandDropdown('web-dev');

            // Initialize sub-navigation container and links for horizontal scrolling
            this.subNavContainer = document.querySelector('.sub-nav-container');
            this.subNavLinks = Array.from(document.querySelectorAll('.sub-nav-container a'));

            this.initializeScrollObserver();
        },

        getCurrentPage() {
            const path = location.pathname.split('/').pop().replace('.html', '');
            return path ? path : 'index';
        },

        isActive(page) {
            return this.currentPage === page;
        },

        shouldExpandDropdown(dropdown) {
            const dropdowns = {
                'portfolio': ['kytocase', 'smunchcase', 'cogalleriescase', 'organize', 'pffcase', 'stak'],
                'design-systems': ['kytocase', 'smunchcase', 'cogalleriescase', 'organize', 'pffcase', 'stak'],
                'web-dev': ['pokemoncase', 'meetcase', 'myflixcase', 'chatcase']
            };
            return dropdowns[dropdown] && dropdowns[dropdown].includes(this.currentPage);
        },

        toggleNavbar() {
            this.navbarOpen = !this.navbarOpen;
            document.body.classList.toggle('no-scroll', this.navbarOpen);
            const menu = document.getElementById('navbar-multi-level');
            if (menu) {
                menu.classList.toggle('menu-scrollable', this.navbarOpen);
            }
        },

        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
            if (this.dropdownOpen) {
                this.categoriesOpen = false;
                this.nestedDropdownOpen = false;
            }
        },

        toggleCategories() {
            this.categoriesOpen = !this.categoriesOpen;
            if (this.categoriesOpen) {
                this.nestedDropdownOpen = false;
            }
        },

        toggleNestedDropdown() {
            this.nestedDropdownOpen = !this.nestedDropdownOpen;
            if (this.nestedDropdownOpen) {
                this.categoriesOpen = false;
            }
        },

        closeNavbar(excludeDropdownClose = false) {
            setTimeout(() => {
                this.navbarOpen = false;
                document.body.classList.remove('no-scroll');
                const menu = document.getElementById('navbar-multi-level');
                if (menu) {
                    menu.classList.remove('menu-scrollable');
                }

                if (!excludeDropdownClose) {
                    this.dropdownOpen = false;
                    this.categoriesOpen = false;
                    this.nestedDropdownOpen = false;
                }
            }, 300);
        },

        scrollToSection(section) {
            const element = document.querySelector(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                this.closeNavbar(true); // Pass true to not close dropdowns
            } else {
                console.error(`Element ${section} not found`);
            }
        },

        handleContactClick() {
            this.scrollToSection('#contact'); // Scroll to the contact section
            this.closeNavbar(true); // Pass true to prevent closing of dropdowns
        },

        scrollSubNav(activeIndex) {
            if (this.subNavLinks.length > 0 && this.subNavContainer) {
                const activeLink = this.subNavLinks[activeIndex];
                if (activeLink) {
                    const containerRect = this.subNavContainer.getBoundingClientRect();
                    const linkRect = activeLink.getBoundingClientRect();

                    // Scroll the container if the link is out of view
                    const offset = linkRect.left - containerRect.left;
                    if (offset < 0 || offset + linkRect.width > containerRect.width) {
                        this.subNavContainer.scrollLeft = offset + this.subNavContainer.scrollLeft;
                    }
                }
            }
        },

        initializeScrollObserver() {
            const navLinks = document.querySelectorAll('nav a[href^="#"]');
            const sections = Array.from(navLinks)
                .map(link => document.querySelector(link.getAttribute('href')))
                .filter(el => el); // Ensure valid elements

            const options = {
                root: null, // Use the viewport as the root
                rootMargin: '0px 0px -50% 0px', // Adjust this margin as needed
                threshold: 0.5 // Trigger when at least 50% of the section is visible
            };

            const observer = new IntersectionObserver((entries) => {
                let currentActiveIndex = this.lastActiveIndex; // Default to last active index
                let nextSectionIndex = -1;

                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = sections.indexOf(entry.target);
                        if (index !== -1) {
                            currentActiveIndex = index;
                        }
                    }
                });

                // Determine next section index
                const scrollPosition = window.scrollY + window.innerHeight / 2;
                sections.forEach((section, index) => {
                    if (section.offsetTop > scrollPosition) {
                        nextSectionIndex = index;
                        return;
                    }
                });

                // Highlight active link
                navLinks.forEach((link, index) => {
                    link.classList.remove('underline', 'font-semibold');
                });

                // Add underline to the current active link
                if (currentActiveIndex > -1) {
                    navLinks[currentActiveIndex].classList.add('underline', 'font-semibold');
                    this.scrollSubNav(currentActiveIndex); // Scroll sub-navigation to active link
                }

                // Store the current active index
                this.lastActiveIndex = currentActiveIndex;

                // Debugging logs
                console.log('Scroll Position:', scrollPosition);
                console.log('Active Index:', currentActiveIndex);
                console.log('Next Section Index:', nextSectionIndex);
            }, options);

            sections.forEach(section => {
                observer.observe(section);
            });
        }
    }));
});
