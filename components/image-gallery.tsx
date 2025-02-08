"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

interface GalleryImage {
  src: string
  alt: string
  description: string
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
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-muted"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-sm text-white">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
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
  )
}

