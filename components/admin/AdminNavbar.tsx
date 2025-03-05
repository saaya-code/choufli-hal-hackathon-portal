"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Menu,
  X,
  Users,
  Home,
  Clock,
  Send,
  Mail,
  UserCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    { id: "teams", label: "Teams", href: "/admin/teams", icon: Users },
    { id: "waitlist", label: "Waitlist", href: "/admin/waitlist", icon: Clock },
    {
      id: "submissions",
      label: "Submissions",
      href: "/admin/submissions",
      icon: Send,
    },
    {
      id: "email",
      label: "Email",
      href: "/admin/email",
      icon: Mail,
    },
    {
      id: "checkin",
      label: "Check-in",
      href: "/admin/checkin",
      icon: UserCheck,
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-[60]">
      <div className="container mx-auto relative z-50">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin/dashboard">
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
              <span className="ml-2 font-semibold text-primary">Admin</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-1 z-50">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm hover:bg-primary/10 hover:text-primary relative",
                    isActive(item.href) && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="ml-2 text-primary border-primary hover:bg-primary/10"
            >
              Log out
            </Button>
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

        {/* Mobile menu */}
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
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left text-lg py-4",
                        isActive(item.href) && "bg-primary/10 text-primary"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start text-primary border-primary hover:bg-primary/10"
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
