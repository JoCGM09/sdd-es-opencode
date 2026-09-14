/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          main: "#0D1117"
        },
        text: {
          main: "#F8FAFC"
        },
        brand: {
          primary: "#3B82F6",
          secondary: "#8B5CF6"
        },
        semantic: {
          success: "#10B981",
          error: "#EF4444"
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    },
  },
  plugins: [],
}
