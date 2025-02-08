"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

interface Sponsor {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
  tier: "gold" | "silver" | "bronze";
}

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "GoMyCode",
    description:
      "Leading tech education platform in Africa and the Middle East, providing innovative learning experiences.",
    logo: "/sponsors/gomycode.svg",
    website: "https://gomycode.com",
    tier: "gold",
  },
  {
    id: 2,
    name: "Focus Corporation",
    description:
      "Technology solutions provider specializing in software development and digital transformation.",
    logo: "/sponsors/focus.svg",
    website: "https://focus.tech",
    tier: "gold",
  },
  {
    id: 3,
    name: "Think-it",
    description:
      "Global technology company building high-performing engineering teams.",
    logo: "/sponsors/think-it.svg",
    website: "https://think-it.io",
    tier: "silver",
  },
  {
    id: 4,
    name: "InstaDeep",
    description:
      "Leader in AI-powered decision-making systems for the Enterprise.",
    logo: "/sponsors/instadeep.svg",
    website: "https://instadeep.com",
    tier: "silver",
  },
];

export function SponsorsSection() {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  return (
    <section id="sponsors" className="py-32">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Our Sponsors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              onClick={() => setSelectedSponsor(sponsor)}
              className="w-40 h-40 bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="relative w-full h-24 mb-2">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  sponsor.tier === "gold"
                    ? "text-yellow-600"
                    : sponsor.tier === "silver"
                    ? "text-gray-500"
                    : "text-orange-700"
                }`}
              >
                {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}{" "}
                Sponsor
              </span>
            </div>
          ))}
        </div>

        <Dialog
          open={!!selectedSponsor}
          onOpenChange={() => setSelectedSponsor(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                {selectedSponsor && (
                  <>
                    <div className="relative w-12 h-12">
                      <Image
                        src={selectedSponsor.logo}
                        alt={selectedSponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{selectedSponsor.name}</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedSponsor && (
              <div className="space-y-4">
                <DialogDescription>
                  {selectedSponsor.description}
                </DialogDescription>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(selectedSponsor.website, "_blank")
                    }
                    className="text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    Visit Website
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
