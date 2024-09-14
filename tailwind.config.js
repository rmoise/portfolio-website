/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, // Add this line to enable !important globally

  content: [
    './index.html',
    './src/**/*.{html,js}',
    'node_modules/flowbite/**/*.js',
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        green: '#00FEB0',
        brightGreen: '#a2f4db',
        brightRed: 'hsl(12, 88%, 59%)',
        brightRedLight: 'hsl(12, 88%, 69%)',
        brightRedSupLight: 'hsl(12, 88%, 95%)',
        darkBlue: 'hsl(228, 39%, 23%)',
        darkGrayishBlue: 'hsl(227, 12%, 61%)',
        veryDarkBlue: 'hsl(223, 12%, 13%)',
        darkPaleBlue: 'hsl(13, 100%, 96%)',
        veryLightGray: 'hsl(0, 0%, 98%)',
        input: '#2A2A35',
        inputBorder: '#565666',
        selectedText: '#A3A3FF',
        nav: '#404053',
        secondary: '#9191A4',
        linkHover: '#001eff',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        '3xl': ['2rem', '2.5rem'], // 32px font size with 40px line height
        base: ['1rem', '1.75rem'], // 16px font size with 28px line height
        lg: ['1.125rem', '2rem'], // 18px font size with 32px line height
        sm: ['0.875rem', '1.5rem'], // 14px font size with 24px line height
        '5xl': ['3rem', '3.5rem'], // 48px font size with 56px line height
        '6xl': ['4rem', '4.5rem'], // 64px font size with 72px line height
        '7xl': ['4.5rem', '5rem'], // 72px font size with 80px line height
      },
    },
  },
  plugins: [require('preline/plugin'), require('flowbite/plugin')],
}
