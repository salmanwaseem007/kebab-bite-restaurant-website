import { useState, useCallback, useEffect } from 'react';
import { useGetMenuPhotos, useGetContactInfo } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';

export default function MenuPage() {
  const { data: photos, isLoading, error } = useGetMenuPhotos();
  const { data: contactInfo } = useGetContactInfo();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Main carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    skipSnaps: false,
  });

  // Thumbnail carousel
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  // Lightbox carousel
  const [emblaLightboxRef, emblaLightboxApi] = useEmblaCarousel({
    loop: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return;
    const selected = emblaApi.selectedScrollSnap();
    setCurrentIndex(selected);
    emblaThumbsApi.scrollTo(selected);
  }, [emblaApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setTimeout(() => {
      if (emblaLightboxApi) {
        emblaLightboxApi.scrollTo(index);
      }
    }, 50);
  }, [emblaLightboxApi]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const scrollLightboxPrev = useCallback(() => {
    if (emblaLightboxApi) emblaLightboxApi.scrollPrev();
  }, [emblaLightboxApi]);

  const scrollLightboxNext = useCallback(() => {
    if (emblaLightboxApi) emblaLightboxApi.scrollNext();
  }, [emblaLightboxApi]);

  useEffect(() => {
    if (!emblaLightboxApi) return;
    const onLightboxSelect = () => {
      setLightboxIndex(emblaLightboxApi.selectedScrollSnap());
    };
    emblaLightboxApi.on('select', onLightboxSelect);
    return () => {
      emblaLightboxApi.off('select', onLightboxSelect);
    };
  }, [emblaLightboxApi]);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') scrollLightboxPrev();
      if (e.key === 'ArrowRight') scrollLightboxNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, scrollLightboxPrev, scrollLightboxNext]);

  const whatsappNumber = contactInfo?.whatsapp?.replace(/\s+/g, '') || '';
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#';

  return (
    <>
      <main className="container mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">{t('menu.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('menu.subtitle')}
          </p>
        </div>

        {/* WhatsApp Order Button */}
        {whatsappNumber && (
          <div className="mb-8 flex justify-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition-all hover:bg-[#20BA5A] hover:shadow-lg"
            >
              <SiWhatsapp className="h-5 w-5" />
              {t('menu.orderWhatsapp')}
            </a>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="aspect-[16/10] w-full rounded-lg" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t('menu.error')}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && photos && photos.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">{t('menu.comingSoon')}</p>
          </div>
        )}

        {!isLoading && !error && photos && photos.length > 0 && (
          <div className="space-y-6">
            {/* Main Carousel */}
            <div className="relative">
              <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                <div className="flex" style={{ touchAction: 'pan-y pinch-zoom' }}>
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="min-w-0 flex-[0_0_100%]"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <div 
                        className="relative aspect-[16/10] cursor-pointer overflow-hidden rounded-lg bg-muted"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.name || `Menu photo ${index + 1}`}
                          loading="lazy"
                          className="h-full w-full object-contain transition-opacity duration-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={scrollPrev}
                    aria-label={t('menu.previous')}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={scrollNext}
                    aria-label={t('menu.next')}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="overflow-hidden" ref={emblaThumbsRef}>
                <div className="flex gap-2">
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      className={`relative min-w-0 flex-[0_0_80px] overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentIndex
                          ? 'border-primary shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      onClick={() => onThumbClick(index)}
                      aria-label={`${t('menu.goToImage')} ${index + 1}`}
                    >
                      <div className="aspect-square">
                        <img
                          src={photo.url}
                          alt={`Thumbnail ${index + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightboxOpen && photos && photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
            onClick={closeLightbox}
            aria-label={t('menu.closeLightbox')}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Lightbox Carousel */}
          <div className="h-full w-full overflow-hidden" ref={emblaLightboxRef}>
            <div className="flex h-full" style={{ touchAction: 'pan-y pinch-zoom' }}>
              {photos.map((photo, index) => (
                <div key={photo.id} className="relative min-w-0 flex-[0_0_100%]">
                  <LightboxImage src={photo.url} alt={photo.name || `Menu photo ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={scrollLightboxPrev}
                aria-label={t('menu.previous')}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={scrollLightboxNext}
                aria-label={t('menu.next')}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}

// Lightbox Image Component with Pinch-to-Zoom
function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    let initialDistance = 0;
    let initialScale = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialScale = scale;
      } else if (e.touches.length === 1 && scale > 1) {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const newScale = Math.max(1, Math.min(4, initialScale * (currentDistance / initialDistance)));
        setScale(newScale);
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
      } else if (e.touches.length === 1 && isDragging && scale > 1) {
        e.preventDefault();
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      initialDistance = 0;
    };

    node.addEventListener('touchstart', handleTouchStart, { passive: false });
    node.addEventListener('touchmove', handleTouchMove, { passive: false });
    node.addEventListener('touchend', handleTouchEnd);

    return () => {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, position, isDragging, dragStart]);

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center"
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          cursor: scale > 1 ? 'grab' : 'zoom-in',
        }}
        draggable={false}
      />
    </div>
  );
}

