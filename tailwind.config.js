/** @type {import('tailwindcss').Config} */

const config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: "hsl(var(--primary))",
                'primary-foreground': "hsl(var(--primary-foreground))",
                muted: "hsl(var(--muted))",
                'muted-foreground': "hsl(var(--muted-foreground))",
                accent: "hsl(var(--accent))",
                'accent-foreground': "hsl(var(--accent-foreground))",
            },
            borderRadius: {
                '2xl': '1rem',
            },
        },
    },
    plugins: [],
};

export default config;

