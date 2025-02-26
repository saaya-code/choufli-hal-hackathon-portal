import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoonIcon, StarIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-blueBackground flex flex-col items-center justify-center relative px-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
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

      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="relative w-64 h-64 mx-auto mb-8 animate-lantern-float">
          <Image
            src="/sbou3i.png"
            alt="Sbou3i character"
            fill
            className="object-contain"
          />
        </div>

        <div className="mb-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Seems like Sbou3i can&apos;t find what you&apos;re looking for.
            Let&apos;s get you back on track!
          </p>
        </div>

        <div className="relative w-40 h-40 mx-auto mb-8">
          <Image
            src="/logo.png"
            alt="Choufli Hal Bootcamp 2.0"
            fill
            className="object-contain"
          />
        </div>

        <Link href="/">
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90"
          >
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
