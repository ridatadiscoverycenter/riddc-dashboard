/*
import React from "react";

// https://github.com/scottykaye/useAccessibleBlockLink/blob/main/src/index.ts
export function useAccessibleBlockLink(/*ref: ReturnType<typeof React.useRef<HTMLAnchorElement|HTMLButtonElement>>* /) {
  const mainInteractable = React.useRef<HTMLAnchorElement|HTMLButtonElement>(null);
  const handleInteraction = React.useCallback((e: React.MouseEvent) => {
    if (mainInteractable.current) {
      e.preventDefault();
      mainInteractable.current.dispatchEvent(e);
    }
    //const a = e.currentTarget.localName
    //ref.current instanceof Element ? ref.current.hre
    return 0;
  }, [mainInteractable]);
  
  return [mainInteractable, handleInteraction] as [typeof mainInteractable, typeof handleInteraction];
}
*/
