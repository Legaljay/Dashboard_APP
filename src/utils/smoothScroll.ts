export const initSmoothScroll = () => {
    // Apply smooth scrolling to all elements
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optional: Enhanced smooth scrolling with custom timing
    const smoothScrollTo = (element: Element, offset: number) => {
      const start = element.scrollTop;
      const change = offset - start;
      const duration = 500; // Duration in ms - adjust this to control speed
      let startTime = 0;
  
      const animateScroll = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
  
        // Easing function for smoother acceleration/deceleration
        const easeInOutCubic = (t: number) => 
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  
        element.scrollTop = start + change * easeInOutCubic(progress);
  
        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      };
  
      requestAnimationFrame(animateScroll);
    };
  
    // Optional: Apply smooth scrolling to specific containers
    const smoothScrollContainers = document.querySelectorAll('.smooth-scroll');
    smoothScrollContainers.forEach(container => {
      container.addEventListener('wheel', ((e: Event) => {
        const wheelEvent = e as WheelEvent;
        wheelEvent.preventDefault();
        const delta = wheelEvent.deltaY;
        const container = wheelEvent.currentTarget as Element;
        smoothScrollTo(container, container.scrollTop + delta);
      }) as EventListener, { passive: false });
    });
  };