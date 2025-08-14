import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import carousel1 from "../../assets/carousel1.jpeg";
import carousel2 from "../../assets/carousel2.jpeg";
import carousel3 from "../../assets/carousel3.jpeg";
import carousel4 from "../../assets/carousel4.jpeg";
import nature from "../../assets/nature.jpeg";

interface CarouselContextType {
  currentIndex: number;
  isTransitioning: boolean;
  goToSlide: (index: number) => void;
  carouselImages: string[];
  carouselCards: Array<{
    src: string;
    title: string;
    bgColor: string;
  }>;
  timeRemaining: number;
  resetTimer: () => void;
}

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined
);

export const carouselImages = [
  nature,
  carousel1,
  carousel2,
  carousel3,
  carousel4,
];

export const carouselCards = [
  {
    src: nature,
    title: "Nature",
    bgColor: "from-orange-400 to-[#FFA75D]",
  },
  {
    src: carousel1,
    title: "History",
    bgColor: "from-green-400 to-green-600",
  },
  {
    src: carousel2,
    title: "Discovery",
    bgColor: "from-blue-400 to-blue-600",
  },
  {
    src: carousel3,
    title: "Scenery",
    bgColor: "from-amber-400 to-amber-600",
  },
  {
    src: carousel4,
    title: "Adventure",
    bgColor: "from-sky-400 to-sky-600",
  },
];

const TRANSITION_INTERVAL = 5000;

export const CarouselProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TRANSITION_INTERVAL);

  const resetTimer = useCallback(() => {
    setTimeRemaining(TRANSITION_INTERVAL);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      resetTimer();

      // Reset transition state after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [currentIndex, resetTimer]
  );

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselImages.length;
      goToSlide(nextIndex);
    }, TRANSITION_INTERVAL);

    return () => clearInterval(interval);
  }, [currentIndex, goToSlide]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          return TRANSITION_INTERVAL;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const value = {
    currentIndex,
    isTransitioning,
    goToSlide,
    carouselImages,
    carouselCards,
    timeRemaining,
    resetTimer,
  };

  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (context === undefined) {
    throw new Error("useCarousel must be used within a CarouselProvider");
  }
  return context;
};
