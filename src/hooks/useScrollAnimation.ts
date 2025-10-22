import { useEffect, useState } from 'react';

export interface UseScrollAnimationOptions {
  /**
   * Scroll threshold to trigger animation (in pixels)
   * @default 100
   */
  threshold?: number;
  /**
   * Trigger only once
   * @default true
   */
  once?: boolean;
}

export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): boolean {
  const { threshold = 100, once = true } = options;
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    // If already triggered and once is true, don't add listener
    if (once && isTriggered) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (scrollY > threshold) {
        setIsTriggered(true);
      } else if (!once) {
        setIsTriggered(false);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, once, isTriggered]);

  return isTriggered;
}
