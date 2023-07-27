"use client";

import { STORAGE_KEY, SYSTEM_THEME, THEMES } from "@/lib/constants";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeLoading = {
  isLoading: true;
  theme: undefined;
  isDark: undefined;
};
type ThemeLoaded = {
  isLoading: false;
  theme: string;
  isDark: boolean;
};

type ThemeContextType = (ThemeLoading | ThemeLoaded) & {
  setTheme: (value: string) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export type ThemeProviderProps = {
  defaultTheme?: string;
  children: React.ReactNode;
};

export default function ThemeProvider({
  defaultTheme = SYSTEM_THEME,
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPrefersColorSchemeDark, setIsPrefersColorSchemeDark] =
    useState(false);
  const [isDark, setIsDark] = useState(false);

  const onPrefersColorSchemeChange = useCallback(() => {
    setIsPrefersColorSchemeDark(
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }, []);

  const handleThemeChange = useCallback((value: string) => {
    if (typeof window === "undefined") {
      return;
    }
    if (THEMES.has(value)) {
      setTheme(value);
      localStorage.setItem(STORAGE_KEY, value);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const theme = localStorage.getItem("theme");
    if (theme && THEMES.has(theme)) {
      setTheme(theme);
      console.log("Theme Changed");
    } else {
      setTheme(defaultTheme);
    }
    onPrefersColorSchemeChange();
    setIsLoaded(true);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", onPrefersColorSchemeChange);
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", onPrefersColorSchemeChange);
    };
  }, [defaultTheme, onPrefersColorSchemeChange]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (theme === SYSTEM_THEME) {
      setIsDark(isPrefersColorSchemeDark);
    } else {
      setIsDark(theme === "dark");
    }
  }, [isPrefersColorSchemeDark, isLoaded, theme]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark, isLoaded]);

  return (
    <ThemeContext.Provider
      value={{
        setTheme: handleThemeChange,
        ...(isLoaded
          ? { isLoading: false, theme, isDark }
          : { isLoading: true, theme: undefined, isDark: undefined }),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw "useTheme must use inside ThemeProvider";
  }
  return context;
};
