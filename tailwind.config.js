/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', 'node_modules/preline/dist/*.js',],

  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    extend: {
      colors: {
        green: '#00FEB0', // Define the custom color
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
        linkHover: '#001eff'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      },
      padding: {
        '1/3': '33.33333%',
        '2/3': '66.66667%'
      },
      opacity: {
        '15': '0.15', // Add custom opacity value
        '25': '0.25',
        '50': '0.5',
        '75': '0.75',
        '100': '1',
      },
    }
  },
  plugins: [ require('preline/plugin'),],
}
