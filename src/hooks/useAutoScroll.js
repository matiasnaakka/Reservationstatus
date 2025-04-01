import { useEffect } from "react";

const useAutoScroll = (ref, enabled, speed = 25) => {
  useEffect(() => {
    let animationFrameId;

    const startAutoScroll = () => {
      const element = ref.current;
      if (!element || !enabled) return;

      const hasOverflow = element.scrollHeight > element.clientHeight;
      if (!hasOverflow) return;

      let lastTime = 0;
      const scrollStep = 1;

      const smoothScroll = (time) => {
        if (!enabled || !element) return;

        if (time - lastTime > speed) {
          const bottomThreshold = 2;
          const scrolledToBottom =
            Math.ceil(element.scrollTop + element.clientHeight + bottomThreshold) >= element.scrollHeight;

          if (scrolledToBottom) {
            element.scrollTop = 0;
          } else {
            element.scrollTop += scrollStep;
          }
          lastTime = time;
        }

        animationFrameId = requestAnimationFrame(smoothScroll);
      };

      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(startAutoScroll);
    }, 50);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [ref, enabled, speed]);
};

export { useAutoScroll };
