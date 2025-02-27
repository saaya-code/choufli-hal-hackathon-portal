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
}

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "Borgi Phones",
    description:
      "Selling smartphones at the best prices on the market since 2012. We guarantee the best quality.",
    logo: "/sponsors/logo-borgi-phones.png",
    website: "https://borgiphones.com/",
  },
  {
    id: 2,
    name: "Raef Copy Center",
    description:
      "Raef Copy Center is a printing company that specializes in business cards, flyers, and banners.",
    logo: "/sponsors/logo-impremerie.png",
    website: "https://www.instagram.com/raeftraveauximpression",
  },
  {
    id: 3,
    name: "Escape Room",
    description:
      "The first and only Escape room in Sousse with the theme 'Squid Game' 🔍 Play with your friends, find the keys, solve the puzzles, and try to get out in 60 minutes! 🔒.",
    logo: "/sponsors/logo-escape-room.png",
    website: "https://escape-room-sousse.com/",
  },
  {
    id: 4,
    name: "Binary Beats Club",
    description:
      "Binary Beats Club ISIMM is a music band that plays amazing music and organizes events.",
    logo: "/sponsors/logo-music-band.png",
    website: "https://www.instagram.com/binary_beats_club_isimm",
  },
  {
    id: 5,
    name: "Saf Arts Events",
    description:
      "⚫️𝒜𝑔𝑒𝓃𝒸𝑒 𝒹𝑒 𝒹𝑒́𝒸𝑜𝓇𝒶𝓉𝒾𝑜𝓃 𝒸𝑜𝓃𝓉𝒶𝒸𝓉𝑒𝓏-𝓃𝑜𝓊𝓈 𝓈𝓊𝓇 𝓃𝓊𝓂𝑒́𝓇𝑜📞 𝟧𝟤𝟫𝟨𝟩𝟦𝟢𝟢 ▪️𝓃𝒶𝒾𝓈𝓈𝒶𝓃𝒸𝑒 👼🏻 ▪️ 𝒟𝑒𝓂𝒶𝓃𝒹𝑒 𝒹𝑒 𝓂𝒶𝓇𝒾𝒶𝑔𝑒👩‍❤️‍💋‍👨 ▪️𝒻𝒾𝒶𝓃𝒸̧𝒶𝒾𝓁𝓁𝑒𝓈💍 ▪️𝓂𝒶𝓇𝒾𝒶𝑔𝑒👰‍♀️ ▪️𝓉𝒽𝑜𝓊𝓇🧒🏻.",
    logo: "/sponsors/saf-art-events.png",
    website: "https://www.instagram.com/safart_events",
  },
];

export function SponsorsSection() {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  return (
    <section id="sponsors" className="py-32 bg-accent/5">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Our Sponsors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              onClick={() => setSelectedSponsor(sponsor)}
              className="w-40 h-40 bg-primary/40 rounded-lg shadow-md flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
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
                className="text-sm font-medium text-white"
              >
                {sponsor.name}
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
                    <div className="relative w-12 h-12 bg-primary/40 rounded-full shadow-md">
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
