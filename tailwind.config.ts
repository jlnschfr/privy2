import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  darkMode: "class",
  theme: {
    fontFamily: {
      body: ["Nunito", "sans-serif"],
    },
    screens: {
      md: "1024px",
      lg: "1280px",
    },
    extend: {
      colors: {
        neutral: {
          600: "#FFFFFF",
          500: "#F5F5F5",
          400: "#D7D7D7",
          300: "#B4B4B4",
          200: "#4A4A4A",
          100: "#303030",
          50: "#212121",
        },
        primary: {
          600: "#4977B8",
          500: "#285799",
        },
        secondary: {
          600: "#C77A47",
          500: "#AF6331",
        },
      },
      spacing: {
        px: "1px",
        0: "0",
        "0_5": "0.25rem",
        1: "0.5rem",
        2: "1rem",
        3: "1.5rem",
        4: "2rem",
        5: "2.5rem",
        6: "3rem",
        7: "3.5rem",
        8: "4rem",
        "1vw": "1vw",
        "2vw": "2vw",
        "3vw": "3vw",
        "4vw": "4vw",
        "5vw": "5vw",
        "6vw": "6vw",
        app: "calc(18rem + 4vw)",
      },
      inset: {
        "1vw": "1vw",
        "2vw": "2vw",
        "3vw": "3vw",
        "4vw": "4vw",
        50: "50%",
        app: "calc(50% + 6rem + 2vw)",
      },
      minHeight: {
        detail: "calc(100vh - 8vw - 57px)",
      },
      maxHeight: {
        drawerNav: "calc(100vh - 24rem)",
      },
      minWidth: {
        snackbar: "13.5rem",
      },
      maxWidth: {
        drawer: "18rem",
        tags: "14rem;",
      },
      transitionProperty: {
        bgColor: "background-color",
        borderColor: "border-color",
        borderAndBgColor: "border-color, background-color",
      },
    },
  },
};
