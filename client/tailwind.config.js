// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Include paths to all of your template files
    './public/index.html',         // Include other necessary paths
  ],
  theme: {
    extend: {},                    // Extend the default Tailwind theme
  },
  plugins: [],                     // Add any required plugins here
};