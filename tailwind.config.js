/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: '#171717', // Deep charcoal
          light: '#262626',
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          foreground: "var(--secondary-foreground)",
        },
        berry: {
          DEFAULT: '#5D1924', // Noble deep berry
          light: '#7A2230',
          dark: '#3D0F16',
          foreground: "var(--berry-foreground)",
        },
        gold: {
          DEFAULT: '#C5A059', // Muted matte gold
          light: '#D4B475',
          dark: '#A38240',
        },
        surface: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'elegant': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
      }
    },
  },
  plugins: [],
}
