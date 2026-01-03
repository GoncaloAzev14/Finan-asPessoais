/* eslint-disable no-unused-vars */
import { useState, useRef, useCallback } from 'react';

export default function useLongPress(callback, ms = 600) {
  const [startLongPress, setStartLongPress] = useState(false);
  const timerRef = useRef();

  const start = useCallback(() => {
    setStartLongPress(true);
    timerRef.current = setTimeout(() => {
      callback();
    }, ms);
  }, [callback, ms]);

  const stop = useCallback(() => {
    setStartLongPress(false);
    clearTimeout(timerRef.current);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}