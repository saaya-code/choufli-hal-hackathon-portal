import { Navbar } from "@/components/navbar";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Button } from "@/components/ui/button";
import { MoonIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ImageGallery } from "@/components/image-gallery";
import { SponsorsSection } from "@/components/sponsors-section";
import { TimelineSection } from "@/components/timeline-section";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <Navbar />

      {/* Hero Section with enhanced decorative elements */}
      <section id="home" className="relative pt-40 pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 animate-lantern-float">
            <StarIcon className="h-6 w-6 text-secondary" />
          </div>
          <div
            className="absolute top-20 right-20 animate-lantern-float"
            style={{ animationDelay: "1s" }}
          >
            <MoonIcon className="h-8 w-8 text-secondary" />
          </div>
          <div
            className="absolute bottom-10 left-1/4 animate-lantern-float"
            style={{ animationDelay: "1.5s" }}
          >
            <Image
              src="/fenjen.png"
              alt="Coffee cup"
              width={40}
              height={40}
              className="opacity-30"
            />
          </div>
          <div
            className="absolute top-1/3 right-1/4 animate-lantern-float"
            style={{ animationDelay: "2s" }}
          >
            <Image
              src="/carta.png"
              alt="Playing cards"
              width={40}
              height={40}
              className="opacity-30"
            />
          </div>
        </div>

        <div className="container relative z-10">
          <div className="text-center space-y-8">
            <div className="relative w-full max-w-2xl mx-auto h-40 mb-8">
              <Image
                src="/logo.png"
                alt="Choufli Hal Bootcamp 2.0"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Join us this Ramadan for an unforgettable hackathon experience
              inspired by Tunisia&apos;s beloved sitcom
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Register Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-primary hover:bg-primary/10 hover:text-primary"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-32 bg-accent/5 relative overflow-hidden"
      >
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <Image
                src="/sbou3i.png"
                alt="Sbou3i character"
                fill
                className="object-contain animate-lantern-float"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                The Spirit of Choufli Hal
              </h2>
              <p className="text-lg text-muted-foreground">
                Embrace the nostalgic charm of Tunisia&apos;s beloved sitcom
                while innovating for the future. Join us for a unique blend of
                tradition and technology.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
          <Image
            src="/fenjen.png"
            alt="Coffee cup"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Memories from Choufli Hal 1.0
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Relive the magical moments from our previous hackathon
            </p>
          </div>
          <ImageGallery />
        </div>
      </section>

      <TimelineSection />

      <SponsorsSection />

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 bg-accent/5">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            What Makes Us Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 text-center relative group">
              <div className="absolute inset-0 bg-secondary/5 rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative">
                <div className="h-16 w-16 mx-auto mb-4">
                  <Image
                    src="/fenjen.png"
                    alt="Coffee cup"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ramadan Nights</h3>
                <p className="text-muted-foreground">
                  Code and create during the blessed nights of Ramadan
                </p>
              </div>
            </div>
            <div className="p-6 text-center relative group">
              <div className="absolute inset-0 bg-secondary/5 rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative">
                <div className="h-16 w-16 mx-auto mb-4">
                  <Image
                    src="/carta.png"
                    alt="Playing cards"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Fortune Favors the Bold
                </h3>
                <p className="text-muted-foreground">
                  Take your chance at winning amazing prizes
                </p>
              </div>
            </div>
            <div className="p-6 text-center relative group">
              <div className="absolute inset-0 bg-secondary/5 rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <StarIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Cultural Innovation
                </h3>
                <p className="text-muted-foreground">
                  Blend tradition with modern technology
                </p>
              </div>
            </div>
            <div className="p-6 text-center relative group">
              <div className="absolute inset-0 bg-secondary/5 rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative">
                <div className="h-16 w-16 mx-auto mb-4">
                  <Image
                    src="/sbou3i.png"
                    alt="Mentorship"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Expert Mentorship
                </h3>
                <p className="text-muted-foreground">
                  Get guidance from industry experts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Ready to Join the Adventure?
            </h2>
            <p className="text-lg text-muted-foreground">
              Don&apos;t miss out on this unique opportunity to be part of
              Choufli Hal 2.0
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
