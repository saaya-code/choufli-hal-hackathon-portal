import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-blueBackground">
      <div className="container max-w-4xl">
        <div className="text-center mb-12 relative">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Choufli Hal Bootcamp 2.0"
                fill
                className="object-contain"
              />
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            Connect with the Choufli Hal 2.0 team on social media
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Follow Us</h2>
              <p className="text-muted-foreground">
                Stay updated with the latest news, announcements, and
                behind-the-scenes content from Choufli Hal 2.0.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://www.facebook.com/gdgoc.issatso"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Facebook size={24} />
                </Link>
                <Link
                  href="https://www.instagram.com/gdgc.issatso/"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Instagram size={24} />
                </Link>
                <Link
                  href="https://x.com/gdgc_issatso"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <X size={24} />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/gdsc-issatso"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Linkedin size={24} />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">
                Get in Touch
              </h2>
              <p className="text-muted-foreground">
                Have questions about Choufli Hal 2.0? Reach out to us on any of
                our social media platforms or send us an email or reach out on
                our Discord Server.
              </p>
              <p className="font-medium">
                Email:{" "}
                <a
                  href="mailto:dscissatso@gmail.com"
                  className="text-primary hover:underline"
                >
                  dscissatso@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Choufli Hal Bootcamp 2.0. All
            rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
