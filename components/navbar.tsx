"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Adjusted scroll position calculation
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
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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
          <div className="hidden md:flex space-x-1">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "gallery", label: "Gallery" },
              { id: "timeline", label: "Timeline" },
              { id: "sponsors", label: "Sponsors" },
              { id: "features", label: "Features" },
            ].map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "text-sm hover:bg-primary/10 hover:text-primary",
                  activeSection === item.id && "bg-primary/10 text-primary"
                )}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </Button>
            ))}
            <Link href="/register">
              <Button
                variant="default"
                className="bg-primary text-white hover:bg-primary/90 ml-2"
              >
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
