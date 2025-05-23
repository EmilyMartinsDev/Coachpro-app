"use client"

import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"

interface FeedbackPhotosCarouselProps {
  photos: Array<{
    id: string
    url: string
  }>
}

export function FeedbackPhotosCarousel({ photos }: FeedbackPhotosCarouselProps) {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="space-y-4">
      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          {photos.map((photo) => (
            <CarouselItem key={photo.id}>
              <Card className="border-0 shadow-none">
                <CardContent className="flex aspect-square items-center justify-center p-0 relative">
                  <Image
                    src={photo.url}
                    alt="Foto de feedback"
                    width={800}
                    height={800}
                    className={`object-contain w-full h-full rounded-md transition-transform duration-300`}
                    style={{ transform: `scale(${zoom})` }}
                    quality={100}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {photos.length > 1 && (
          <>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </>
        )}
      </Carousel>
      
      <div className="flex justify-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4 mr-2" />
          Zoom Out
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
          disabled={zoom >= 3}
        >
          <ZoomIn className="h-4 w-4 mr-2" />
          Zoom In
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setZoom(1)}
          disabled={zoom === 1}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}