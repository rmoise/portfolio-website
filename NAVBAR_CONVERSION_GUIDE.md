# Global Navbar Conversion Guide

## Overview

The global navbar system has been implemented to eliminate code duplication and provide consistent navigation across all pages. The navbar automatically highlights the current page and provides a unified experience.

## What's Been Done

### 1. Created Global Components

- **`components/navbar.html`** - Contains the complete navbar HTML structure
- **`js/global-navbar.js`** - JavaScript that loads the navbar and handles page highlighting

### 2. Updated Pages

- **`index.html`** - ✅ Converted to use global navbar
- **`kytocase.html`** - ✅ Converted to use global navbar

## How to Convert Remaining Pages

### Step 1: Remove Existing Navbar

For each HTML page, remove the entire navbar structure from `<nav>` to `</nav>` and replace with:

```html
<body>
  <div class="wrapper">
    <!-- Global navbar will be injected here -->

    <!-- Your page content starts here -->
  </div>
</body>
```

### Step 2: Add Global Navbar Script

In the `<script>` section at the bottom of each page, add the global navbar script:

```html
<script src="js/global-navbar.js"></script>
```

Make sure it's loaded before other navigation-related scripts.

### Step 3: Update CSS References

If the page uses `css/main.css`, update it to `css/output.css` for consistency:

```html
<link rel="stylesheet" href="css/output.css" />
```

## Pages That Need Conversion

- [ ] `chatappcase.html`
- [ ] `cogalleriescase.html`
- [ ] `karlstorzcase.html`
- [ ] `meetcase.html`
- [ ] `myflixcase.html`
- [ ] `organize.html`
- [ ] `pffcase.html`
- [ ] `pokemoncase.html`
- [ ] `smunchcase.html`
- [ ] `stak.html`

## Features of the Global Navbar

### 1. Automatic Page Highlighting

- The current page is automatically highlighted in the dropdown menu
- Uses purple color (`#a855f7`) for active page indication
- Adds a gradient underline for visual emphasis

### 2. Section Highlighting (Home Page Only)

- On the index page, subnav links highlight based on scroll position
- Uses Intersection Observer for smooth section detection
- Indigo color (`#6366f1`) for active section indication

### 3. Responsive Design

- Mobile-friendly dropdown with touch optimization
- Auto-close functionality on mobile
- Consistent styling across all breakpoints

### 4. Homepage-Only Subnav

- Subnav only appears on the homepage (index.html)
- Other pages show only the main navbar for cleaner layout
- Dynamic theming and scroll behavior only active on homepage

## Example Conversion

### Before:

```html
<body>
  <nav id="main-nav" x-data="navbar()" class="...">
    <!-- Large navbar structure -->
    <div class="container">
      <!-- Logo, menu items, dropdowns, etc. -->
    </div>
  </nav>

  <!-- Page content -->
</body>
```

### After:

```html
<body>
  <div class="wrapper">
    <!-- Global navbar will be injected here -->

    <!-- Page content -->
  </div>

  <!-- Scripts -->
  <script src="js/global-navbar.js"></script>
</body>
```

## Benefits

1. **Maintainability** - Update navbar once, changes reflect everywhere
2. **Consistency** - Identical navigation experience across all pages
3. **Performance** - Cached navbar component loads faster
4. **Active States** - Automatic highlighting of current page
5. **Cleaner Code** - Eliminates hundreds of lines of duplicated HTML

## Testing

After conversion, test each page to ensure:

- [ ] Navbar loads correctly
- [ ] Current page is highlighted in dropdown
- [ ] All navigation links work
- [ ] Mobile menu functions properly
- [ ] Subnav only appears on homepage (index.html)
- [ ] Other pages show only main navbar
- [ ] Homepage scroll behavior works (navbar hide/show, subnav theming)

## Troubleshooting

### Navbar Not Loading

- Check that `components/navbar.html` exists
- Verify `js/global-navbar.js` is loaded
- Check browser console for fetch errors

### Page Not Highlighted

- Ensure the page filename matches the `data-page` attribute in navbar
- Check that the global navbar script is running

### Styling Issues

- Verify CSS is compiled (`npm run build:css`)
- Check that Alpine.js is loaded for dropdown functionality
