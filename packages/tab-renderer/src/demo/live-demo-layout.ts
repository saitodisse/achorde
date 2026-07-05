import { useEffect, useState } from "react";

const SPLIT_LAYOUT_QUERY = "(min-width: 1100px)";

export function useLiveDemoSplitLayout(): boolean {
  const [isSplit, setIsSplit] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(SPLIT_LAYOUT_QUERY).matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(SPLIT_LAYOUT_QUERY);
    const syncLayout = () => setIsSplit(mediaQuery.matches);
    syncLayout();
    mediaQuery.addEventListener("change", syncLayout);
    return () => mediaQuery.removeEventListener("change", syncLayout);
  }, []);

  return isSplit;
}
