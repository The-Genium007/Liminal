import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './AccordionSlider.module.scss';

// Extend React's CSSProperties to include CSS custom properties
declare module 'react' {
  interface CSSProperties {
    '--animation-speed'?: number;
    '--border-radius'?: string;
  }
}

export interface SlideItem {
  /** Unique identifier for the slide */
  id: string;
  /** Main title of the slide */
  title: string;
  /** Description text shown when expanded */
  description: string;
  /** Background image URL */
  backgroundImage: string;
  /** Thumbnail image URL shown when expanded */
  thumbnailImage: string;
  /** Optional click handler for the details button */
  onDetailsClick?: () => void;
}

export interface AccordionSliderProps {
  /** Array of slide items to display */
  items: SlideItem[];
  /** Optional CSS class name */
  className?: string;
  /** Number of slides to display (0 = use all items, will duplicate items if slideCount > items.length) */
  slideCount?: number;
  /** Border radius for cards in rem (e.g., 1 = 1rem) */
  borderRadius?: number;
  /** Apply grayscale filter to inactive cards */
  grayscaleInactive?: boolean;
  /** Background image blur intensity in pixels (0 = no blur) */
  backgroundBlur?: number;
  /** Global height for cards (e.g., "26rem", "400px", "auto") */
  height?: string;
  /** Global width for the slider container (e.g., "1400px", "100%", "auto") */
  width?: string;
  /** Enable automatic carousel mode */
  autoplay?: boolean;
  /** Time in milliseconds between slide transitions (default: 3000) */
  autoplayInterval?: number;
  /** Delay in milliseconds before resuming autoplay after hover ends (default: 2000) */
  autoplayResumeDelay?: number;
  /** Animation speed multiplier (0.5 = slower, 1 = normal, 2 = faster) */
  animationSpeed?: number;
  /** Callback when active slide changes */
  onSlideChange?: (index: number) => void;
}

export const AccordionSlider: React.FC<AccordionSliderProps> = ({
  items,
  className = '',
  slideCount = 5,
  borderRadius = 0,
  grayscaleInactive = false,
  backgroundBlur = 0,
  height = 'auto',
  width = 'auto',
  autoplay = false,
  autoplayInterval = 3000,
  autoplayResumeDelay = 2000,
  animationSpeed = 1,
  onSlideChange,
}) => {
  // Generate slides by duplicating items if slideCount > items.length
  // If slideCount is 0, use all items
  const slides = React.useMemo(() => {
    if (slideCount === 0) {
      return items;
    }

    if (slideCount <= items.length) {
      return items.slice(0, slideCount);
    }

    // Duplicate items to reach slideCount
    const duplicatedSlides: SlideItem[] = [];
    for (let i = 0; i < slideCount; i++) {
      const item = items[i % items.length];
      duplicatedSlides.push({
        ...item,
        id: `${item.id}-${i}`, // Unique ID for each duplicate
      });
    }
    return duplicatedSlides;
  }, [items, slideCount]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [autoplayDirection, setAutoplayDirection] = useState<1 | -1>(1);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Refs for stable callbacks
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isMobileRef = useRef(isMobile);
  const currentSlideRef = useRef(currentSlide);

  // Keep refs in sync with state
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Check if viewport is mobile with debounced resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', debouncedCheck);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheck);
    };
  }, []);

  // Handle image loading errors
  const handleImageError = useCallback((id: string, type: 'bg' | 'thumb') => {
    setImageErrors((prev) => {
      const newSet = new Set(prev);
      newSet.add(`${id}-${type}`);
      return newSet;
    });
  }, []);

  // Center the active slide - stable callback with no dependencies
  const centerSlide = useCallback((index: number) => {
    if (!trackRef.current || !wrapRef.current) return;

    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    const card = cards[index];
    if (!card) return;

    const mobile = isMobileRef.current;
    const axis = mobile ? 'top' : 'left';
    const size = mobile ? 'clientHeight' : 'clientWidth';
    const start = mobile ? card.offsetTop : card.offsetLeft;

    wrapRef.current.scrollTo({
      [axis]: start - (wrapRef.current[size] / 2 - card[size] / 2),
      behavior: 'smooth',
    });
  }, []);

  // Activate a slide - stable callback
  const activateSlide = useCallback(
    (index: number, shouldScroll = false) => {
      if (index === currentSlideRef.current) return;

      setCurrentSlide(index);
      onSlideChange?.(index);

      if (shouldScroll) {
        centerSlide(index);
      }
    },
    [onSlideChange, centerSlide]
  );

  // Navigate slides
  const navigate = useCallback(
    (step: number) => {
      const newIndex = Math.min(Math.max(currentSlideRef.current + step, 0), slides.length - 1);
      activateSlide(newIndex, true);
    },
    [slides.length, activateSlide]
  );

  // Center on current slide when orientation changes
  useEffect(() => {
    centerSlide(currentSlide);
  }, [isMobile, centerSlide, currentSlide]);

  // Initialize slider - center first slide on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!trackRef.current || !wrapRef.current) return;

      const cards = Array.from(trackRef.current.children) as HTMLElement[];
      const card = cards[0];
      if (!card) return;

      const mobile = isMobileRef.current;
      const axis = mobile ? 'top' : 'left';
      const size = mobile ? 'clientHeight' : 'clientWidth';
      const start = mobile ? card.offsetTop : card.offsetLeft;

      wrapRef.current.scrollTo({
        [axis]: start - (wrapRef.current[size] / 2 - card[size] / 2),
        behavior: 'smooth',
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Consolidated autoplay logic - single effect to prevent race conditions
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;

    let autoplayTimer: NodeJS.Timeout | null = null;
    let resumeTimer: NodeJS.Timeout | null = null;

    const clearTimers = () => {
      if (autoplayTimer) clearTimeout(autoplayTimer);
      if (resumeTimer) clearTimeout(resumeTimer);
      autoplayTimer = null;
      resumeTimer = null;
    };

    const startAutoplay = () => {
      clearTimers();

      autoplayTimer = setTimeout(() => {
        let nextIndex = currentSlide + autoplayDirection;

        // Handle edge cases for ping-pong behavior
        if (nextIndex >= slides.length) {
          nextIndex = Math.max(0, slides.length - 2);
          setAutoplayDirection(-1);
        } else if (nextIndex < 0) {
          nextIndex = Math.min(1, slides.length - 1);
          setAutoplayDirection(1);
        }

        // Additional safety check
        nextIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));
        activateSlide(nextIndex, true);
      }, autoplayInterval);
    };

    if (isHovered) {
      clearTimers();
    } else {
      resumeTimer = setTimeout(() => {
        startAutoplay();
      }, autoplayResumeDelay);
    }

    return clearTimers;
  }, [
    autoplay,
    currentSlide,
    isHovered,
    slides.length,
    autoplayDirection,
    autoplayInterval,
    autoplayResumeDelay,
    activateSlide,
  ]);

  // Keyboard navigation - only when component is focused
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeydown = (e: KeyboardEvent) => {
      // Only handle if this component or its children are focused
      if (!container.contains(document.activeElement)) return;

      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        navigate(1);
      }
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        navigate(-1);
      }
    };

    container.addEventListener('keydown', handleKeydown);
    return () => container.removeEventListener('keydown', handleKeydown);
  }, [navigate]);

  // Touch handling with improved gesture detection
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const threshold = 60;

      // Determine if gesture is more horizontal or vertical
      const isHorizontalSwipe = Math.abs(dx) > Math.abs(dy);
      const isVerticalSwipe = Math.abs(dy) > Math.abs(dx);

      // Only navigate if the swipe matches the current orientation
      if (isMobileRef.current && isVerticalSwipe && Math.abs(dy) > threshold) {
        navigate(dy > 0 ? -1 : 1);
      } else if (!isMobileRef.current && isHorizontalSwipe && Math.abs(dx) > threshold) {
        navigate(dx > 0 ? -1 : 1);
      }
    };

    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      track.removeEventListener('touchstart', handleTouchStart);
      track.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate]);

  // Get current slide for announcement
  const currentSlideItem = slides[currentSlide];

  return (
    <section
      ref={containerRef}
      className={`${styles.container} ${className}`}
      role="region"
      aria-label="Image carousel with accordion-style slides"
      aria-roledescription="carousel"
      tabIndex={0}
      style={{
        '--animation-speed': animationSpeed,
      }}
    >
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {currentSlideItem &&
          `Slide ${currentSlide + 1} of ${slides.length}: ${currentSlideItem.title}. ${currentSlideItem.description}`}
      </div>

      <div
        className={styles.slider}
        ref={wrapRef}
        style={width !== 'auto' ? { maxWidth: width } : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.track} ref={trackRef} role="list">
          {slides.map((item, index) => {
            const isActive = currentSlide === index;
            const shouldGrayscale = grayscaleInactive && !isActive;
            const hasBackgroundError = imageErrors.has(`${item.id}-bg`);
            const hasThumbnailError = imageErrors.has(`${item.id}-thumb`);

            return (
              <article
                key={item.id}
                className={styles.projectCard}
                role="listitem"
                tabIndex={isActive ? 0 : -1}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${item.title}. ${item.description}`}
                style={{
                  '--border-radius': `${borderRadius}rem`,
                  ...(height !== 'auto' && { height }),
                }}
                data-active={isActive || undefined}
                data-grayscale={shouldGrayscale || undefined}
                onMouseEnter={() => {
                  if (window.matchMedia('(hover: hover)').matches) {
                    activateSlide(index, true);
                  }
                }}
                onClick={() => activateSlide(index, true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateSlide(index, true);
                  }
                }}
              >
                {!hasBackgroundError && (
                  <img
                    className={styles.projectCardBg}
                    src={item.backgroundImage}
                    alt=""
                    loading="lazy"
                    onError={() => handleImageError(item.id, 'bg')}
                    style={
                      backgroundBlur > 0 && isActive
                        ? { filter: `blur(${backgroundBlur}px)` }
                        : undefined
                    }
                  />
                )}
                {hasBackgroundError && (
                  <div className={styles.imagePlaceholder} aria-label="Image unavailable" />
                )}
                <div className={styles.projectCardContent}>
                  {!hasThumbnailError && (
                    <img
                      className={styles.projectCardThumb}
                      src={item.thumbnailImage}
                      alt={item.title}
                      loading="lazy"
                      onError={() => handleImageError(item.id, 'thumb')}
                    />
                  )}
                  {hasThumbnailError && (
                    <div className={styles.thumbnailPlaceholder} aria-label="Thumbnail unavailable" />
                  )}
                  <div>
                    <h3 className={styles.projectCardTitle}>{item.title}</h3>
                    <p className={styles.projectCardDesc}>{item.description}</p>
                  </div>
                  <svg
                    className={styles.projectCardIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                  </svg>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
