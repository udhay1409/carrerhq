"use client";

import React from "react";
import Link from "next/link";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";

export const MainNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    {
      name: "Study Abroad",
      link: "/study-abroad",
      dropdown: [
        { name: "United States", link: "/study-abroad/usa" },
        { name: "United Kingdom", link: "/study-abroad/uk" },
        { name: "Canada", link: "/study-abroad/canada" },
        { name: "Australia", link: "/study-abroad/australia" },
        { name: "Germany", link: "/study-abroad/germany" },
        { name: "Ireland", link: "/study-abroad/ireland" },
        { name: "France", link: "/study-abroad/france" },
        { name: "New Zealand", link: "/study-abroad/new-zealand" },
      ],
    },
    { name: "Blog", link: "/blog" },
    { name: "Begin Test", link: "/career-test" },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 w-full">
      <Navbar
        className={cn(
          "transition-all duration-300 ease-in-out",
          isScrolled &&
            "bg-white/80 backdrop-blur-md shadow-sm dark:bg-neutral-950/80"
        )}
      >
        {/* Desktop Navigation */}
        <NavBody className="transition-all duration-500">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
              <span className="text-white font-bold text-lg">CH</span>
            </div>
            <p className="font-bold text-inherit text-lg">
              Career<span className="text-primary">HQ</span>
            </p>
          </Link>

          <NavItems items={navItems} />

          <div className="flex items-center gap-4">
            <NavbarButton
              as={Link}
              href="/career-test"
              variant="primary"
              className="font-medium"
            >
              Begin Test
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav className="transition-all duration-500">
          <MobileNavHeader>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
                <span className="text-white font-bold text-lg">CH</span>
              </div>
              <p className="font-bold text-inherit text-lg">
                Career<span className="text-primary">HQ</span>
              </p>
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300 w-full px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4 p-4">
              <NavbarButton
                as={Link}
                href="/career-test"
                variant="primary"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Begin Test
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};
