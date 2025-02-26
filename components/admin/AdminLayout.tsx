"use client";

import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-accent/5">
        <AdminNavbar />
        <div className="pt-20 px-4 md:px-6 pb-10">
          <div className="container mx-auto">{children}</div>
        </div>
      </div>
    );
  }

  return null;
}
