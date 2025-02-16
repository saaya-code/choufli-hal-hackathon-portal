"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface VideoTrailerProps {
  videoUrl: string // Google Drive video URL
  thumbnailUrl: string
}

export function VideoTrailer({ videoUrl, thumbnailUrl }: VideoTrailerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Function to get the file ID from the Google Drive URL
  const getGoogleDriveFileId = (url: string) => {
    const match = url.match(/[-\w]{25,}/)
    return match ? match[0] : null
  }

  const fileId = getGoogleDriveFileId(videoUrl)

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      {!isPlaying && (
        <>
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img src={thumbnailUrl || "/group_pic.png"} alt="Video thumbnail" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
            <Button variant="secondary" size="lg" className="rounded-full p-6" onClick={() => setIsPlaying(true)}>
              <Play className="h-8 w-8 text-primary" />
            </Button>
          </div>
        </>
      )}
      {isPlaying && fileId && (
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          width="100%"
          height="100%"
          allow="autoplay"
          allowFullScreen
          className="absolute inset-0"
        ></iframe>
      )}
      {isPlaying && !fileId && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <p className="text-muted-foreground">Error loading video. Please check the URL.</p>
        </div>
      )}
    </div>
  )
}

