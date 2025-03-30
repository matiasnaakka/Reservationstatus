import { useEffect, useRef } from "react";

const useKinectScroll = (scrollContainerRef, { throttleTime = 1 } = {}) => {
  const wsRef = useRef(null);
  const lastScrollY = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:8080");

      wsRef.current.onopen = () => console.log("✅ Connected to Kinect WebSocket");

      wsRef.current.onmessage = (event) => {
        try {
          const { rightHand } = JSON.parse(event.data);
          console.log(`📡 Received WebSocket Data:`, event.data);

          if (!scrollContainerRef.current) return;

          const scrollAmount = 10; // Reduced step size for smoother movement
          let targetScrollY = lastScrollY.current;

          if (rightHand <= 2.4) {
            console.log("⬇️ Scrolling Down");
            targetScrollY += scrollAmount;
          } else if (rightHand >= 4.0) {
            console.log("⬆️ Scrolling Up");
            targetScrollY -= scrollAmount;
          }

          // Use requestAnimationFrame for smoother scrolling
          if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(() => {
              scrollContainerRef.current.scrollBy({ top: targetScrollY - lastScrollY.current, behavior: "smooth" });
              lastScrollY.current = targetScrollY;
              animationFrameRef.current = null;
            });
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket data:", error);
        }
      };

      wsRef.current.onerror = (error) => console.error("❌ WebSocket error:", error);

      wsRef.current.onclose = () => {
        console.log("❌ WebSocket closed, attempting reconnect...");
        setTimeout(() => {
          if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
            connectWebSocket(); // Reconnect WebSocket
          }
        }, 3000);
      };
    };

    connectWebSocket(); // Initial WebSocket connection

    return () => {
      wsRef.current?.close();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scrollContainerRef, throttleTime]);

  return null;
};

export default useKinectScroll;
