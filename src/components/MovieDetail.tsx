import React, { useState, useEffect } from 'react';
import { isInMyList, toggleMyList } from '@/lib/listUtils';

interface MovieDetailProps {
  movie: any;
  onPlayClick: () => void;
  onClose: () => void;
}

export default function MovieDetail({ movie, onPlayClick, onClose }: MovieDetailProps) {
  const [activeTab, setActiveTab] = useState<'similares' | 'trailers' | 'tecnicos'>('similares');
  const [tmdbData, setTmdbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isInMyList(movie.id));
    
    const handleListUpdate = () => {
      setIsSaved(isInMyList(movie.id));
    };
    
    window.addEventListener('cinestream_list_updated', handleListUpdate);
    return () => window.removeEventListener('cinestream_list_updated', handleListUpdate);
  }, [movie.id]);

  useEffect(() => {
    // Scroll to top when mounted
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fetch TMDB data
    setLoading(true);
    fetch(`/api/tmdb?filename=${encodeURIComponent(movie.name)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setTmdbData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching detail data:", err);
        setLoading(false);
      });
  }, [movie.name]);

  const bgImageUrl = tmdbData?.backdropPath || (movie.thumbnailLink ? movie.thumbnailLink.replace('=s220', '=s1000') : '');
  const posterUrl = tmdbData?.posterPath || movie.thumbnailLink;
  const title = tmdbData?.title || movie.name.replace(/\.[^/.]+$/, "");
  
  // Format runtime
  const runtimeHours = tmdbData?.runtime ? Math.floor(tmdbData.runtime / 60) : 0;
  const runtimeMins = tmdbData?.runtime ? tmdbData.runtime % 60 : 0;
  
  // Cast processing
  const cast = tmdbData?.credits?.cast?.slice(0, 6) || [];
  const director = tmdbData?.credits?.crew?.find((c: any) => c.job === 'Director');
  
  // Trailers processing
  const trailers = tmdbData?.videos?.results?.filter((v: any) => v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Featurette') || [];

  return (
    <div className="relative w-full min-h-screen bg-surface-container-lowest -mt-16 overflow-x-hidden pt-16 z-40">
      
      {/* Close Button Floating */}
      <button 
        onClick={onClose}
        className="fixed top-20 right-4 lg:right-10 z-50 w-12 h-12 rounded-full bg-surface-container-highest/80 backdrop-blur-md text-on-surface hover:bg-surface-bright flex items-center justify-center transition-all shadow-xl"
      >
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>

      {/* Cinematic Backdrop Image */}
      <div 
        className="absolute top-0 left-0 right-0 h-[80vh] w-full bg-cover bg-center" 
        style={{ backgroundImage: `url('${bgImageUrl}')` }}
      ></div>
      
      {/* Deep Film Scrim & Vignette Layers */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-surface-container-lowest/20"></div>
      <div className="absolute top-0 left-0 right-0 h-[80vh] bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/70 to-transparent"></div>
      
      {/* Hero Content Container */}
      <div className="relative z-10 w-full px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pt-10 lg:pt-28 pb-12">
        
        {/* Main Stage Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-start">
          
          {/* Left Column: Key Art Poster & Direct Action Console */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-md order-2 lg:order-1 mt-8 lg:mt-0">
            <div className="relative group aspect-[2/3] w-2/3 mx-auto lg:w-full lg:max-w-none rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-surface-container-high transition-transform duration-500 ease-out hover:scale-[1.02] border border-white/5">
              {posterUrl ? (
                <img className="w-full h-full object-cover" src={posterUrl} alt={title} />
              ) : (
                <div className="w-full h-full bg-surface-container flex items-center justify-center p-4 text-center">
                  <span className="font-headline-md text-on-surface">{title}</span>
                </div>
              )}
              
              {tmdbData?.voteAverage && (
                <div className="absolute top-space-sm left-space-sm flex flex-col gap-space-xxs">
                  <span className="bg-surface-container-lowest/85 backdrop-blur-md text-secondary font-label-badge text-label-badge px-space-xs py-1 rounded shadow-md uppercase tracking-wider flex items-center gap-1 border border-white/10">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {Math.round(tmdbData.voteAverage * 10)}% Match
                  </span>
                </div>
              )}
            </div>
            
            {/* Primary Control Stack */}
            <div className="flex flex-col gap-space-xs w-full max-w-sm mx-auto lg:max-w-none">
              <button 
                onClick={onPlayClick}
                className="w-full bg-primary-container text-on-primary font-headline-md text-headline-md py-space-sm px-space-md rounded-lg flex items-center justify-center gap-space-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,82,97,0.4)]"
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                <span>Reproducir película</span>
              </button>
              
              {trailers.length > 0 && (
                <a 
                  href={`https://www.youtube.com/watch?v=${trailers[0].key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-surface-container-high/90 backdrop-blur-md text-on-surface font-title-sm text-title-sm py-space-sm px-space-md rounded-lg flex items-center justify-center gap-space-xs hover:bg-surface-bright active:scale-98 transition-all border border-white/5"
                >
                  <span className="material-symbols-outlined text-lg">smart_display</span>
                  <span>Ver tráiler oficial</span>
                </a>
              )}
              
              <div className="grid grid-cols-2 gap-space-xs mt-space-xxs">
                <button 
                  onClick={() => toggleMyList(movie, tmdbData)}
                  className={`py-space-xs px-space-sm rounded-lg flex items-center justify-center gap-space-xxs transition-colors ${
                    isSaved 
                      ? 'bg-primary-container/20 text-primary-container border border-primary-container/50' 
                      : 'bg-surface-container/70 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-base" style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {isSaved ? 'bookmark_added' : 'bookmark_add'}
                  </span>
                  <span>{isSaved ? 'En Mi Lista' : 'Mi Lista'}</span>
                </button>
                <button className="bg-surface-container/70 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md py-space-xs px-space-sm rounded-lg flex items-center justify-center gap-space-xxs transition-colors">
                  <span className="material-symbols-outlined text-base">download_for_offline</span>
                  <span>Descargar</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column: Title, Metadata, Deep Synopsis & Critical Reception */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-start order-1 lg:order-2">
            
            {loading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-16 bg-surface-container-high w-3/4 rounded"></div>
                <div className="h-4 bg-surface-container-high w-1/2 rounded"></div>
                <div className="h-24 bg-surface-container-high w-full rounded mt-8"></div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-space-sm mb-space-sm">
                  {tmdbData?.voteAverage >= 8 && (
                    <div className="flex items-center gap-1 bg-secondary-container/15 text-secondary px-space-sm py-1 rounded-full text-label-badge font-label-badge border border-secondary/20">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                      <span>ACLAMADA POR LA CRÍTICA</span>
                    </div>
                  )}
                  {tmdbData?.voteAverage && (
                    <>
                      <span className="text-on-surface-variant/50 hidden sm:inline">•</span>
                      <div className="flex items-center gap-1 text-secondary font-label-badge text-label-badge">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-on-surface font-bold text-body-md">{tmdbData.voteAverage.toFixed(1)}</span>
                        <span className="text-on-surface-variant">/ 10 TMDB</span>
                      </div>
                    </>
                  )}
                </div>

                <h1 className="font-display-hero text-4xl lg:text-display-hero text-on-surface tracking-tight uppercase mb-space-xs leading-none drop-shadow-lg">
                  {title}
                </h1>
                
                {tmdbData?.tagline && (
                  <p className="text-primary font-headline-md text-headline-md italic mb-space-md opacity-90 drop-shadow">
                    «{tmdbData.tagline}»
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-space-xs text-on-surface-variant font-label-badge text-label-badge mb-space-lg">
                  {tmdbData?.releaseDate && (
                    <span className="bg-surface-container-highest text-on-surface px-space-xs py-1 rounded uppercase font-bold">
                      {tmdbData.releaseDate.substring(0, 4)}
                    </span>
                  )}
                  {runtimeHours > 0 && (
                    <span className="bg-surface-container-highest text-on-surface px-space-xs py-1 rounded uppercase font-bold">
                      {runtimeHours}h {runtimeMins}min
                    </span>
                  )}
                  <span className="bg-error-container text-on-error-container px-space-xs py-1 rounded font-bold">+16</span>
                  
                  {tmdbData?.genres?.slice(0,2).map((g: any) => (
                    <span key={g.id} className="bg-surface-container text-on-surface px-space-xs py-1 rounded font-bold">
                      {g.name}
                    </span>
                  ))}
                  
                  <div className="hidden sm:block h-4 w-px bg-surface-container-highest mx-space-xs"></div>
                  
                  <span className="bg-surface-container-low text-secondary font-bold px-space-xs py-1 rounded border border-white/5">ULTRA HD 4K</span>
                  <span className="bg-surface-container-low text-on-surface px-space-xs py-1 rounded border border-white/5">DOLBY VISION</span>
                </div>

                <div className="max-w-3xl mb-space-xl">
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-space-sm drop-shadow-sm">
                    {tmdbData?.overview || 'Detalles no disponibles. Disfruta de esta película en la más alta calidad desde tu servidor CineStream.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md p-space-md rounded-xl bg-surface-container/60 backdrop-blur-md max-w-3xl mb-space-lg border border-white/5 shadow-inner">
                  {director && (
                    <div>
                      <span className="block text-on-surface-variant/70 font-label-md text-label-md uppercase">Dirección</span>
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">{director.name}</span>
                    </div>
                  )}
                  {cast.slice(0,3).map((actor: any, idx: number) => (
                    <div key={actor.id || idx}>
                      <span className="block text-on-surface-variant/70 font-label-md text-label-md uppercase">{idx === 0 ? 'Protagonista' : 'Reparto'}</span>
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold line-clamp-1">{actor.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cast & Crew Showcase Section */}
      {cast.length > 0 && (
        <section className="relative z-10 w-full px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl bg-surface-container-lowest">
          <div className="flex items-center justify-between mb-space-lg">
            <div className="flex items-baseline gap-space-xs">
              <h2 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight">Reparto Principal</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-space-md">
            {cast.map((actor: any) => (
              <div key={actor.id} className="group bg-surface-container-low hover:bg-surface-container rounded-xl p-space-sm transition-all duration-300 flex flex-col items-center text-center border border-transparent hover:border-white/5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-space-sm shadow-lg bg-surface-container">
                  {actor.profile_path ? (
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl">person</span>
                    </div>
                  )}
                </div>
                <span className="font-title-sm text-title-sm text-on-surface font-bold line-clamp-1">{actor.name}</span>
                <span className="text-secondary font-body-md text-body-md line-clamp-1">{actor.character}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Media Navigation & Content Tabs */}
      <section className="relative z-10 w-full px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl bg-surface-container-lowest">
        <div className="flex items-center gap-space-sm overflow-x-auto pb-space-sm mb-space-xl no-scrollbar">
          <button 
            onClick={() => setActiveTab('similares')}
            className={`px-space-lg py-space-xs rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'similares' ? 'bg-primary-container text-on-primary shadow-md font-bold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface font-title-sm'}`}
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>Detalles técnicos</span>
          </button>
          <button 
            onClick={() => setActiveTab('trailers')}
            className={`px-space-lg py-space-xs rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'trailers' ? 'bg-primary-container text-on-primary shadow-md font-bold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface font-title-sm'}`}
          >
            <span className="material-symbols-outlined text-base">movie</span>
            <span>Tráilers y Extras ({trailers.length})</span>
          </button>
        </div>

        {/* TAB 1: DETALLES */}
        {activeTab === 'similares' && (
          <div className="w-full animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg bg-surface-container-low p-space-xl rounded-xl border border-white/5">
              <div className="flex flex-col gap-space-sm">
                <h4 className="font-title-sm text-title-sm text-primary uppercase font-bold">Especificaciones del Archivo</h4>
                <ul className="flex flex-col gap-space-xs text-body-md text-on-surface-variant">
                  <li className="flex justify-between py-1 border-b border-surface-container-highest/20">
                    <span>Tamaño en disco</span>
                    <span className="text-on-surface font-semibold">{(parseInt(movie.size || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-surface-container-highest/20">
                    <span>Nombre del archivo</span>
                    <span className="text-on-surface font-semibold max-w-[150px] truncate" title={movie.name}>{movie.name}</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-surface-container-highest/20">
                    <span>Formato</span>
                    <span className="text-on-surface font-semibold">{movie.mimeType}</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-space-sm">
                <h4 className="font-title-sm text-title-sm text-primary uppercase font-bold">Distribución TMDB</h4>
                <ul className="flex flex-col gap-space-xs text-body-md text-on-surface-variant">
                  <li className="flex justify-between py-1 border-b border-surface-container-highest/20">
                    <span>Fecha de estreno</span>
                    <span className="text-on-surface font-semibold">{tmdbData?.releaseDate || 'Desconocido'}</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-surface-container-highest/20">
                    <span>Idioma original</span>
                    <span className="text-on-surface font-semibold uppercase">{tmdbData?.original_language || 'ES'}</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-surface-container-highest/20">
                    <span>Puntuación Global</span>
                    <span className="text-secondary font-semibold">{tmdbData?.voteAverage ? `${(tmdbData.voteAverage * 10).toFixed(0)}% de aprobación` : 'N/A'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRAILERS */}
        {activeTab === 'trailers' && (
          <div className="w-full animate-in fade-in duration-300">
            {trailers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {trailers.map((vid: any) => (
                  <a key={vid.id} href={`https://www.youtube.com/watch?v=${vid.key}`} target="_blank" rel="noreferrer" className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-lg group cursor-pointer border border-transparent hover:border-white/10 transition-colors">
                    <div className="relative aspect-video w-full overflow-hidden bg-surface-container">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={`https://img.youtube.com/vi/${vid.key}/mqdefault.jpg`} alt={vid.name} />
                      <div className="absolute inset-0 bg-surface-container-lowest/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary-container/90 text-on-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-space-sm">
                      <h4 className="font-title-sm text-title-sm text-on-surface font-bold line-clamp-1">{vid.name}</h4>
                      <p className="text-on-surface-variant font-body-md text-body-md mt-1">{vid.type} Oficial</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-on-surface-variant bg-surface-container-low rounded-xl">
                No se encontraron tráilers para este título.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
