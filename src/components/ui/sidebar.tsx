"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { cn } from "@/lib/utils";

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export interface SidebarProps {
  links: SidebarLink[];
  className?: string;
  onLinkClick?: (href: string) => void;
}

export function Sidebar({ links, className, onLinkClick }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default to open
  const [isPinned, setIsPinned] = useState(true); // Track if sidebar is pinned open
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle link click
  const handleLinkClick = (href: string) => {
    onLinkClick?.(href);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Mobile overlay
  const MobileOverlay = () => (
    <AnimatePresence>
      {isMobile && isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </AnimatePresence>
  );

  // Sidebar content
  const SidebarContent = () => (
    <motion.div
      initial={false}
      animate={{
        width: isMobile ? "280px" : isPinned || isExpanded ? "280px" : "80px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
        "flex flex-col h-full",
        isMobile && "shadow-xl",
        className
      )}
      onMouseEnter={() => !isMobile && !isPinned && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && !isPinned && setIsExpanded(false)}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <motion.div
            initial={false}
            animate={{
              opacity: isMobile || isPinned || isExpanded ? 1 : 0,
              scale: isMobile || isPinned || isExpanded ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className="font-semibold text-lg text-gray-900 dark:text-white"
          >
            Admin Panel
          </motion.div>

          {!isMobile && (isPinned || isExpanded) && (
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => {
                setIsPinned(!isPinned);
                if (isPinned) {
                  setIsExpanded(false);
                }
              }}
              className="opacity-60 hover:opacity-100"
            >
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  isPinned ? "rotate-180" : ""
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link, _index) => (
          <Button
            key={link.href}
            variant={link.isActive ? "solid" : "light"}
            color={link.isActive ? "primary" : "default"}
            className={cn(
              "w-full h-12 transition-all duration-200",
              // When collapsed, center the icon and remove active button width expansion
              !isMobile && !isPinned && !isExpanded
                ? "justify-center px-3 min-w-0"
                : "justify-start",
              // Prevent active button from expanding when collapsed
              !isMobile && !isPinned && !isExpanded && link.isActive && "!w-12"
            )}
            startContent={
              <span
                className={cn(
                  "flex-shrink-0 w-5 h-5",
                  !isMobile && !isPinned && !isExpanded && "mx-0"
                )}
              >
                {link.icon}
              </span>
            }
            onClick={() => handleLinkClick(link.href)}
          >
            <AnimatePresence mode="wait">
              {(isMobile || isPinned || isExpanded) && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 text-left flex-1"
                >
                  {link.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        ))}
      </nav>
    </motion.div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="light"
          isIconOnly
          className="md:hidden fixed top-4 left-4 z-50"
          onClick={() => setIsMobileOpen(true)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        {/* Mobile Overlay */}
        <MobileOverlay />

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden md:flex h-full">
      <SidebarContent />
    </div>
  );
}

// Export mobile menu toggle hook for external control
export function useSidebarMobile() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return {
    isMobileOpen,
    openMobile: () => setIsMobileOpen(true),
    closeMobile: () => setIsMobileOpen(false),
    toggleMobile: () => setIsMobileOpen((prev) => !prev),
  };
}
