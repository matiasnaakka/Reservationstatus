import { useEffect } from "react";

const useAutoScroll = (ref, enabled, speed = 25) => { // Increased speed to 100
  useEffect(() => {
    if (!enabled) {
      return; // Stop if autoScroll=false
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    let animationFrameId;
    let lastTime = 0;
    const scrollStep = 1;

    const smoothScroll = (time) => {
      if (!enabled || !element) return; // Stop if disabled

      if (time - lastTime > speed) {
        if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
          element.scrollTop = 0;
        } else {
          element.scrollTop += scrollStep;
        }
        lastTime = time;
      }

      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [ref, enabled, speed]);
};

export  {useAutoScroll};
