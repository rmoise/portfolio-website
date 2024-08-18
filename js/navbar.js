document.addEventListener('alpine:init', () => {
    Alpine.data('navbar', () => ({
        navbarOpen: false,
        dropdownOpen: false,
        categoriesOpen: false,
        nestedDropdownOpen: false,
        currentPage: '',

        init() {
            this.currentPage = this.getCurrentPage();
            this.dropdownOpen = this.shouldExpandDropdown('portfolio');
            this.categoriesOpen = this.shouldExpandDropdown('design-systems');
            this.nestedDropdownOpen = this.shouldExpandDropdown('web-dev');

            if (this.shouldExpandDropdown('portfolio')) {
                this.dropdownOpen = true;
            }
            if (this.shouldExpandDropdown('web-dev')) {
                this.nestedDropdownOpen = true;
                this.dropdownOpen = true;
            }
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
        }
    }));
});
