"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    primary: {
      main: "rgb(215, 22, 22)", // Change to your desired color
      contrastText: "#FBEAEB", // Optional: Adjust text color for contrast
    },
    secondary: {
      main: "#333244",
      contrastText: "#fff",
    },
  },
});

export default theme;

/**
 *  https://webflow.com/blog/best-color-combinations
    {
      main: "#CC5500", // Change to your desired color
      contrastText: "#fff", // Optional: Adjust text color for contrast
    }
    {
      main: "#2F3C7E", // Change to your desired color
      contrastText: "#FBEAEB", // Optional: Adjust text color for contrast
    }
    {
      main: "#101820", // Change to your desired color
      contrastText: "#FEE715", // Optional: Adjust text color for contrast
    }
    {
      main: "#990011", // Change to your desired color
      contrastText: "#FCF6F5", // Optional: Adjust text color for contrast
    }
 */
