import { useEffect, type ReactNode } from "react";

export function StoryTheme({
  theme,
  children,
}: {
  theme: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";
    root.classList.toggle("sb-story-dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
    return () => {
      root.classList.remove("sb-story-dark");
      root.style.colorScheme = "";
    };
  }, [theme]);

  return children;
}
