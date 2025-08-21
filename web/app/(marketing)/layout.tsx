"use client";

import React, { useState, useEffect } from "react";
import {
  Asterisk,
  Menu,
  X,
} from "lucide-react"
import { motion } from "framer-motion";

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    const handleResize = () => {
      // Close mobile menu on window resize
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const navItems = [
    { name: "Home", id: "hero" },
    { name: "Solutions", id: "solutions" },
    { name: "Features", id: "features" },
    { name: "How It Works", id: "how-it-works" },
    { name: "Why Us", id: "why-adcentra" },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 mx-4 sm:mx-8 lg:mx-20 mt-4 border-0 border-amber-100/10 rounded-full ${
          scrolled
            ? "bg-[#3f2d45]/65 border-[0.5px] backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-lg sm:text-2xl font-bold text-[#F5F5F5] hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <Asterisk className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3.5} />
                  <span className="mb-0 sm:mb-1">adCentra.ai</span>
                </span>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-[#F5F5F5] hover:cursor-pointer hover:font-bold hover:text-fuchsia-200 transition-all duration-200 text-md font-semibold"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Right side - CTA Button and Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* CTA Button */}
              <button
                onClick={() => scrollToSection("cta")}
                className="bg-white text-black px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
              >
                <span className="sm:inline">Get Started →</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#F5F5F5] hover:text-white transition-colors mobile-menu-container"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-4 right-4 z-40 lg:hidden"
        >
          <div className="bg-[#3f2d45]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl mobile-menu-container">
            <div className="py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full px-6 py-3 text-left text-[#F5F5F5] hover:text-fuchsia-200 hover:bg-white/5 transition-all duration-200 text-lg font-semibold"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#09080b] min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
