import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const usePaste = (callback) => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleKeyPressed = useCallback((event: ClipboardEvent) => {
    if (event.clipboardData.files.length) {
      callbackRef.current(event);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("paste", handleKeyPressed);
    return () => {
      window.removeEventListener("paste", handleKeyPressed);
    };
  }, [handleKeyPressed]);
};

export default usePaste;
