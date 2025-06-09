// Theme toggle for Tailwind CSS - Based on official Tailwind documentation
// Handles three-way theme toggling: light, dark, and system preference

// Clean up any conflicting localStorage entries on load
function cleanupOldThemeEntries() {
  try {
    // Remove old theme system entries that might conflict
    localStorage.removeItem('navbar-theme');
    localStorage.removeItem('globalTheme');
    console.log('Cleaned up old theme entries');
  } catch (e) {
    console.warn('Could not clean localStorage:', e);
  }
}

function initThemeToggle() {
  // Clean up old entries first
  cleanupOldThemeEntries();

  // Apply theme immediately on page load to prevent flash
  document.documentElement.classList.toggle(
    'dark',
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Update icon states based on current theme - try immediately and with retries
  updateThemeIcons();

  // Also try updating icons after a delay in case navbar isn't loaded yet
  setTimeout(() => updateThemeIcons(), 100);
  setTimeout(() => updateThemeIcons(), 300);
  setTimeout(() => updateThemeIcons(), 500);

  console.log('Theme initialized:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

function getCurrentTheme() {
  if (localStorage.theme === 'dark') return 'dark';
  if (localStorage.theme === 'light') return 'light';
  return 'system';
}

function setTheme(theme) {
  if (theme === 'light') {
    localStorage.theme = 'light';
    document.documentElement.classList.remove('dark');
  } else if (theme === 'dark') {
    localStorage.theme = 'dark';
    document.documentElement.classList.add('dark');
  } else {
    // System theme
    localStorage.removeItem('theme');
    document.documentElement.classList.toggle(
      'dark',
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }
  updateThemeIcons();
}

function toggleTheme() {
  const currentTheme = getCurrentTheme();
  console.log('Toggle theme called, current theme:', currentTheme);

  // Simple toggle between light and dark (ignoring system for now)
  if (currentTheme === 'dark') {
    console.log('Switching to light theme');
    setTheme('light');
  } else {
    console.log('Switching to dark theme');
    setTheme('dark');
  }

  // Log the final state
  console.log('Theme toggle complete, dark class present:', document.documentElement.classList.contains('dark'));
  console.log('localStorage.theme:', localStorage.theme);
}

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');

  // Desktop icons
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  // Mobile icons
  const mobileSunIcon = document.getElementById('mobile-sun-icon');
  const mobileMoonIcon = document.getElementById('mobile-moon-icon');

  if (isDark) {
    // Show sun icon, hide moon icon (dark mode is active)
    if (sunIcon) {
      sunIcon.classList.remove('hidden');
      sunIcon.style.display = 'block';
    }
    if (moonIcon) {
      moonIcon.classList.add('hidden');
      moonIcon.style.display = 'none';
    }
    if (mobileSunIcon) {
      mobileSunIcon.classList.remove('hidden');
      mobileSunIcon.style.display = 'block';
    }
    if (mobileMoonIcon) {
      mobileMoonIcon.classList.add('hidden');
      mobileMoonIcon.style.display = 'none';
    }
  } else {
    // Show moon icon, hide sun icon (light mode is active)
    if (sunIcon) {
      sunIcon.classList.add('hidden');
      sunIcon.style.display = 'none';
    }
    if (moonIcon) {
      moonIcon.classList.remove('hidden');
      moonIcon.style.display = 'block';
    }
    if (mobileSunIcon) {
      mobileSunIcon.classList.add('hidden');
      mobileSunIcon.style.display = 'none';
    }
    if (mobileMoonIcon) {
      mobileMoonIcon.classList.remove('hidden');
      mobileMoonIcon.style.display = 'block';
    }
  }

  // Force update tool icons
  updateToolIcons(isDark);
}

function updateToolIcons(isDark) {
  // No aggressive styling needed - let Tailwind handle it
}

// Listen for system theme changes
function handleSystemThemeChange() {
  if (!('theme' in localStorage)) {
    // Only apply system changes if no explicit theme is set
    document.documentElement.classList.toggle(
      'dark',
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    updateThemeIcons();
  }
}

// Function to attach event listeners to theme toggle buttons
function attachThemeToggleListeners() {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

  console.log('Attempting to attach theme toggle listeners...');
  console.log('Desktop theme toggle found:', !!themeToggle);
  console.log('Mobile theme toggle found:', !!mobileThemeToggle);

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    console.log('Desktop theme toggle listener attached');
  }

  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
    console.log('Mobile theme toggle listener attached');
  }

  // Update icons when listeners are attached (navbar is loaded)
  if (themeToggle || mobileThemeToggle) {
    updateThemeIcons();
    console.log('Theme icons updated after listeners attached');
  }

  return !!(themeToggle || mobileThemeToggle);
}

// Try to attach listeners with retries for dynamically loaded navbar
function attachThemeToggleListenersWithRetry() {
  let attempts = 0;
  const maxAttempts = 10;

  const tryAttach = () => {
    attempts++;
    console.log(`Attempt ${attempts} to attach theme toggle listeners`);

    if (attachThemeToggleListeners()) {
      console.log('Theme toggle listeners successfully attached!');
      return;
    }

    if (attempts < maxAttempts) {
      setTimeout(tryAttach, 500); // Wait 500ms and try again
    } else {
      console.warn('Failed to attach theme toggle listeners after', maxAttempts, 'attempts');
    }
  };

  tryAttach();
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();

  // Try to attach theme toggle listeners with retry logic
  attachThemeToggleListenersWithRetry();

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleSystemThemeChange);
});

// Run theme initialization immediately to prevent flash
initThemeToggle();

// Make functions globally available for debugging and external calling
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
window.attachThemeToggleListeners = attachThemeToggleListeners;