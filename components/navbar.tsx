"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        if (section instanceof HTMLElement) {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute("id") || "";

          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "trailer", label: "Trailer" },
    { id: "about", label: "About" },
    { id: "gallery", label: "Gallery" },
    { id: "timeline", label: "Timeline" },
    { id: "features", label: "Features" },
    { id: "sponsors", label: "Sponsors" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
        isScrolled || activeSection === "home"
          ? "bg-white shadow-sm"
          : "bg-white/80 backdrop-blur-md"
      )}
    >
      <div className="container mx-auto relative z-50">
        {" "}
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center z-50">
              <div className="relative w-16 h-8">
                <Image
                  src="/gdg-logo.svg"
                  alt="GDGC ISSATSO"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative w-32 h-8">
                <Image
                  src="/logo.png"
                  alt="Choufli Hal 2.0"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Link>

          <div className="hidden md:flex space-x-1 z-50">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "text-sm hover:bg-primary/10 hover:text-primary relative",
                  activeSection === item.id && "bg-primary/10 text-primary",
                  "active:bg-primary/10 active:text-primary"
                )}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </Button>
            ))}
            <Link href="/submit">
              <Button
                variant="outline"
                className="text-primary border-primary hover:bg-primary/10 hover:text-primary ml-2"
              >
                Submit Project
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="default"
                className="bg-primary text-white hover:bg-primary/90 ml-2"
              >
                Register Now
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/20 z-40" aria-hidden="true" />
        )}
        <div
          className={cn(
            "fixed inset-0 z-50 md:hidden",
            "bg-white transition-all duration-300",
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="h-6 w-6 text-primary" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full text-left text-lg py-4",
                      activeSection === item.id && "bg-primary/10 text-primary",
                      "active:bg-primary/10 active:text-primary"
                    )}
                    onClick={() => {
                      scrollToSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Link href="/submit" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full text-primary border-primary hover:bg-primary/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Submit Project
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button
                    variant="default"
                    className="w-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
