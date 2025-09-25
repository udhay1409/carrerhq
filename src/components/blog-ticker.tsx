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

  const blogItems = items || [];
  const itemsToShow = 3;
  const maxIndex = Math.max(0, blogItems.length - itemsToShow);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide functionality
  React.useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered, nextSlide]);

  return (
    <div className="relative w-full bg-gradient-to-r from-primary-500 to-primary-600">
      <div className="py-4">
        <div
          className="relative flex items-center px-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={prevSlide}
            className="flex-shrink-0 p-3 rounded-full bg-white/30 hover:bg-white/40 text-white transition-all duration-300 transform hover:scale-105 mr-6"
            aria-label="Previous blogs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: -currentIndex * (100 / itemsToShow) + "%" }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              style={{ width: `${(blogItems.length / itemsToShow) * 100}%` }}
            >
              {blogItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.link}
                  className="flex-shrink-0 block px-6 py-3 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  style={{ width: `${100 / blogItems.length}%` }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-sm font-medium truncate">
                    {item.title}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          <button
            onClick={nextSlide}
            className="flex-shrink-0 p-3 rounded-full bg-white/30 hover:bg-white/40 text-white transition-all duration-300 transform hover:scale-105 ml-6"
            aria-label="Next blogs"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

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
