/** @type {import('tailwindcss').Config} */

export default {
 
}

const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
//    require('daisyui'),
require("tailgrids/plugin"),
  ],
});