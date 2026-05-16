export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // Indigo 500
        primaryHover: "#4F46E5", // Indigo 600
        secondary: "#10B981", // Emerald 500
        dark: "#1E293B", // Slate 800
        light: "#F8FAFC", // Slate 50
        surface: "#FFFFFF",
        danger: "#EF4444", // Red 500
        dangerHover: "#DC2626", // Red 600
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}
