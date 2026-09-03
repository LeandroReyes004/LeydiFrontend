import React from 'react';

interface HeroProps {
  movie: any | null;
  onPlayClick?: (movie: any) => void;
  onInfoClick?: (movie: any) => void;
}

export default function Hero({ movie, onPlayClick, onInfoClick }: HeroProps) {
  if (!movie) {
    return (
      <div className="relative w-full overflow-hidden">
        <section className="relative w-full -mt-16 pt-16 min-h-[82vh] lg:min-h-[88vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-on-surface-variant">
            <span className="text-6xl">🍿</span>
            <h2 className="text-2xl font-bold text-on-surface">Explora el Catálogo</h2>
            <p>Selecciona una película para comenzar a ver</p>
          </div>
        </section>
      </div>
    );
  }

  const bgImageUrl = movie.isCoverOnly 
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/${movie.id}`
    : (movie.thumbnailLink ? movie.thumbnailLink.replace('=s220', '=s1000') : '');

  return (
    <div className="relative w-full overflow-hidden">
      {/* Bleed Hero Section under App Header */}
      <section className="relative w-full -mt-16 pt-16 min-h-[82vh] lg:min-h-[88vh] flex items-end">
        {/* Full Bleed Cinematic Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000 ease-out" 
          style={{ backgroundImage: `url('${bgImageUrl}')` }}
        ></div>
        
        {/* Vignette and Dark Scrim Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent w-full lg:w-3/4"></div>
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-surface-container-lowest/90 to-transparent"></div>
        
        {/* Hero Content Container */}
        <div className="relative z-10 w-full px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pb-space-2xl pt-space-3xl flex flex-col justify-end">
          <div className="max-w-3xl flex flex-col gap-space-md">
            
            {/* Metatags / Tech Badges */}
            <div className="flex flex-wrap items-center gap-space-xs text-on-surface">
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-badge text-label-badge uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>recommend</span>
                98% de coincidencia
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-highest/60 text-on-surface-variant font-label-badge text-label-badge">
                Ciencia Ficción
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-highest/80 text-secondary font-label-badge text-label-badge uppercase tracking-widest font-black">
                4K HDR
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-highest/80 text-secondary font-label-badge text-label-badge uppercase tracking-widest font-black">
                Dolby Atmos
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-badge text-label-badge">
                +16
              </span>
            </div>
            
            {/* Hero Headline */}
            <div className="flex flex-col gap-space-xxs">
              <span className="font-label-badge text-label-badge text-primary-container tracking-widest uppercase font-extrabold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                Destacado
              </span>
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight drop-shadow-2xl">
                {movie.name}
              </h1>
            </div>
            
            {/* Synopsis */}
            {!movie.isCoverOnly && (
              <p className="font-body-lg text-body-lg text-on-surface-variant line-clamp-3 md:line-clamp-none max-w-2xl drop-shadow">
                Una película increíble seleccionada para ti desde tu servidor privado. Disfruta de la mejor calidad sin interrupciones.
              </p>
            )}

            {/* Action Buttons */}
            {!movie.isCoverOnly && (
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <button 
                  onClick={() => onPlayClick?.(movie)}
                  className="group inline-flex items-center gap-space-xs px-space-xl py-space-sm rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm shadow-xl shadow-primary-container/25 hover:bg-primary-container/90 active:scale-95 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-2xl transition-transform group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  <span>Reproducir</span>
                </button>
                <button 
                  onClick={() => onInfoClick?.(movie)}
                  className="group inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-surface-container-highest/70 backdrop-blur-md text-on-surface font-title-sm text-title-sm hover:bg-surface-container-highest transition-all duration-200 active:scale-95 shadow-md"
                >
                  <span className="material-symbols-outlined text-xl">info</span>
                  <span>Más información</span>
                </button>
                <button aria-label="Añadir a mi lista" className="w-11 h-11 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary-container hover:bg-surface-container-highest transition-all duration-200 active:scale-90">
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
                <button aria-label="Calificar" className="w-11 h-11 rounded-full bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary hover:bg-surface-container-highest transition-all duration-200 active:scale-90">
                  <span className="material-symbols-outlined text-xl">thumb_up</span>
                </button>
              </div>
            )}
            
            {/* Audio & Subtitles Preview Strip */}
            <div className="flex items-center gap-space-md text-on-surface-variant text-label-md font-label-md pt-space-xs opacity-75">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">volume_up</span> Español (Neutro), Inglés [Original]
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">subtitles</span> Subtítulos disponibles (CC)
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
