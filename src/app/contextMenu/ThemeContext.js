"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  // Check if theme is saved in localStorage on the client-side
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setMode(savedTheme);
    }
  }, []);

  // Store the theme in localStorage (client-side)
  useEffect(() => {
    if (mode) {
      localStorage.setItem("theme", mode);
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
