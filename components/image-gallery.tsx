"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryImage {
  src: string;
  alt: string;
  description: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "/opening_ceremony.png",
    alt: "Opening Ceremony",
    description: "The grand opening of Breaking Code",
  },
  {
    src: "/breaking_fast.png",
    alt: "Breaking Fast",
    description: "Participants sharing a meal and breaking fast together",
  },
  {
    src: "/pitching.png",
    alt: "Pitching",
    description: "Teams presenting their ideas with enthusiasm",
  },
  {
    src: "/awards.png",
    alt: "Award Ceremony",
    description: "Recognizing and celebrating the winners",
  },
  {
    src: "/group_pic.png",
    alt: "Group Picture",
    description: "A memorable group photo of all participants",
  },
];

export function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="basis-full">
                <div
                  className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-muted"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-full items-center justify-center p-4">
                      <p className="text-center text-sm text-white">
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            className="
              -left-4 md:-left-12 
              bg-white/80 
              hover:bg-primary/10 
              hover:text-primary 
              text-primary
              border-primary/20
              w-10 
              h-10
            "
          />
          <CarouselNext
            variant="outline"
            className="
              -right-4 md:-right-12 
              bg-white/80 
              hover:bg-primary/10 
              hover:text-primary 
              text-primary
              border-primary/20
              w-10 
              h-10
            "
          />
        </Carousel>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogTitle>
            <div className="flex items-center space-x-2 justify-center text-primary">
              <h2 className="text-xl font-bold">{selectedImage?.alt}</h2>
            </div>
          </DialogTitle>
          {selectedImage && (
            <div className="relative aspect-video border-radius-lg">
              <Image
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
