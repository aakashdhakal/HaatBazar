/** @type {import('tailwindcss').Config} */
export const content = [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust the path according to your project structure
];
export const theme = {
    extend: {
        colors: {
            primary: '#1DA1F2',
            secondary: '#14171A',
            accent: '#657786',
            background: '#F5F8FA',
            surface: '#FFFFFF',
            error: '#E0245E',
            info: '#17BF63',
            success: '#3AA76D',
            warning: '#FFAD1F',
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
        },
    },
};
export const plugins = [];