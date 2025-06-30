"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface LightboxProps {
  images: { src: string; alt: string }[]
  startIndex?: number
  onClose: () => void
}

export default function Lightbox({ images, startIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, goToPrevious, goToNext])

  if (!images || images.length === 0) {
    return null
  }

  const currentImage = images[currentIndex]

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center p-4 animate-fade-in-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galería de imágenes"
    >
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white bg-black/50 rounded-full hover:bg-black/80 transition-colors"
          aria-label="Cerrar galería"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Botón Anterior */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 p-2 text-white bg-black/50 rounded-full hover:bg-black/80 transition-colors"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Imagen y Descripción */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Image
              key={currentImage.src}
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              width={1920}
              height={1080}
              className="w-auto h-auto object-contain rounded-lg"
              style={{ maxHeight: "80vh", maxWidth: "90vw" }}
              priority
            />
          </div>
          <div className="text-center text-white bg-black/50 py-2 px-4 rounded-lg">
            <p className="text-sm">{currentImage.alt}</p>
            {images.length > 1 && (
              <p className="text-xs text-brand-gray-text mt-1">
                {currentIndex + 1} / {images.length}
              </p>
            )}
          </div>
        </div>

        {/* Botón Siguiente */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 p-2 text-white bg-black/50 rounded-full hover:bg-black/80 transition-colors"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  )
}
