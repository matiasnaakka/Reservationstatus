import { useEffect } from "react";

/**
 * @param {React.RefObject} ref - scrollattava elementti
 * @param {boolean} enabled - onko scrollaus päällä
 * @param {number} speed - aika millisekunteina (setInterval) tai viive scroll-askeleeseen (rAF)
 * @param {boolean} useRAF - käytetäänkö requestAnimationFrame vai setInterval (default: true)
 */
const useAutoScroll = (ref, enabled, speed = 25, useRAF = true) => {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const scrollStep = 1;
    const bottomThreshold = 2;

    let animationFrameId;
    let intervalId;

    const scroll = () => {
      if (!element) return;

      const scrolledToBottom =
        Math.ceil(element.scrollTop + element.clientHeight + bottomThreshold) >= element.scrollHeight;

      if (scrolledToBottom) {
        element.scrollTop = 0;
      } else {
        element.scrollTop += scrollStep;
      }
    };

    if (useRAF) {
      let lastTime = 0;
      const smoothScroll = (time) => {
        if (!enabled || !element) return;

        if (time - lastTime > speed) {
          scroll();
          lastTime = time;
        }

        animationFrameId = requestAnimationFrame(smoothScroll);
      };
      animationFrameId = requestAnimationFrame(smoothScroll);
    } else {
      intervalId = setInterval(() => {
        if (enabled && element) scroll();
      }, speed);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [ref, enabled, speed, useRAF]);
};

export { useAutoScroll };
