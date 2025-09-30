"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogSliderItem {
  id: string;
  title: string;
  link: string;
  isActive?: boolean;
}

interface BlogSliderProps {
  items?: BlogSliderItem[];
}

export function BlogSlider({ items }: BlogSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [itemsToShow, setItemsToShow] = React.useState(3);

  const blogItems = items || [];
  const maxIndex = Math.max(0, blogItems.length - itemsToShow);

  // Dynamic items-to-show calculation based on screen size
  const getItemsToShow = React.useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet
      return 3; // desktop
    }
    return 3;
  }, []);

  // Update items to show on mount and window resize
  React.useEffect(() => {
    const updateItemsToShow = () => {
      const newItemsToShow = getItemsToShow();
      setItemsToShow(newItemsToShow);
      // Reset current index if it's beyond the new max
      const newMaxIndex = Math.max(0, blogItems.length - newItemsToShow);
      setCurrentIndex((prev) => Math.min(prev, newMaxIndex));
    };

    updateItemsToShow();

    const handleResize = () => {
      updateItemsToShow();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getItemsToShow, blogItems.length]);

  const nextSlide = React.useCallback(() => {
    // Only slide if there are more items than can be displayed
    if (blogItems.length > itemsToShow) {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }
  }, [maxIndex, blogItems.length, itemsToShow]);

  const prevSlide = React.useCallback(() => {
    // Only slide if there are more items than can be displayed
    if (blogItems.length > itemsToShow) {
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  }, [maxIndex, blogItems.length, itemsToShow]);

  // Auto-slide functionality - only when there are more items than can be displayed
  React.useEffect(() => {
    if (!isHovered && blogItems.length > itemsToShow) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered, nextSlide, blogItems.length, itemsToShow]);

  return (
    <div className="relative w-full bg-gradient-to-r from-primary-500 to-primary-600">
      <div className="py-3 sm:py-4">
        <div
          className="relative flex items-center px-2 sm:px-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {blogItems.length > itemsToShow && (
            <button
              onClick={prevSlide}
              className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-white/30 hover:bg-white/40 text-white transition-all duration-300 transform hover:scale-105 mr-3 sm:mr-6"
              aria-label="Previous blogs"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex gap-2 sm:gap-4 md:gap-8"
              animate={{ x: -currentIndex * (100 / itemsToShow) + "%" }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              style={{ width: `${(blogItems.length / itemsToShow) * 100}%` }}
            >
              {blogItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.link}
                  className="flex-shrink-0 block px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  style={{ width: `${100 / blogItems.length}%` }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-xs sm:text-sm font-medium truncate">
                    {item.title}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {blogItems.length > itemsToShow && (
            <button
              onClick={nextSlide}
              className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-white/30 hover:bg-white/40 text-white transition-all duration-300 transform hover:scale-105 ml-3 sm:ml-6"
              aria-label="Next blogs"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* <div className="flex-shrink-0 flex space-x-2 ml-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  currentIndex === index ? "bg-white scale-110" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
