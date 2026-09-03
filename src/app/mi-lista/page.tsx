"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMyList, removeFromMyList } from '@/lib/listUtils';

export default function MiListaPage() {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('guardados');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved items from localStorage
    const items = getMyList();
    setSavedItems(items);
    setLoading(false);

    // Add listener for updates
    const handleUpdate = () => {
      setSavedItems(getMyList());
    };
    window.addEventListener('cinestream_list_updated', handleUpdate);
    return () => window.removeEventListener('cinestream_list_updated', handleUpdate);
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromMyList(id);
  };

  // Mock data calculations
  const movieCount = savedItems.filter(item => !item.tmdbData || item.tmdbData?.mediaType !== 'tv').length;
  const seriesCount = savedItems.length - movieCount;
  
  // Very rough estimate: 2h per movie, 10h per series
  const estimatedHours = (movieCount * 2) + (seriesCount * 10);

  return (
    <>
      <Navbar />

      <main className="w-full pt-24 pb-20 min-h-screen bg-surface-container-lowest text-on-surface">
        <div className="max-w-[1400px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-xl mb-space-2xl">
            <div className="flex flex-col gap-space-xs max-w-2xl">
              <div className="flex items-center gap-2 text-secondary font-label-badge text-label-badge uppercase tracking-widest font-bold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>video_library</span>
                <span>Colección Personal</span>
              </div>
              <h1 className="font-display-hero text-5xl md:text-6xl font-black tracking-tight mb-2">Mi Biblioteca</h1>
              <p className="text-on-surface-variant font-body-lg text-body-lg">
                Tus obras cinematográficas reservadas, maratones en curso y archivo sin conexión sincronizados en todos tus dispositivos.
              </p>
            </div>

            {/* Stats Block */}
            <div className="bg-surface-container-low border border-white/5 rounded-xl p-space-md flex items-center gap-space-lg lg:min-w-[400px]">
              <div className="w-12 h-12 bg-primary-container/20 text-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
              </div>
              <div className="flex flex-col border-r border-white/10 pr-space-lg">
                <span className="text-on-surface-variant font-label-badge text-[10px] uppercase tracking-wider font-bold">Balance Total</span>
                <span className="font-title-sm text-title-sm font-bold text-on-surface">
                  {movieCount} películas • {seriesCount} series
                </span>
              </div>
              <div className="flex flex-col pl-space-xs">
                <span className="text-secondary font-label-badge text-[10px] uppercase tracking-wider font-bold">Tiempo Estimado</span>
                <span className="font-title-sm text-title-sm font-bold text-secondary">
                  {estimatedHours}h de contenido
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-space-sm mb-space-xl pb-space-sm border-b border-surface-container border-opacity-50">
            <button 
              onClick={() => setActiveTab('guardados')}
              className={`px-space-md py-space-xs rounded-full transition-all flex items-center gap-2 font-title-sm text-sm border border-transparent ${activeTab === 'guardados' ? 'bg-primary-container/20 text-primary-container border-primary-container/50 font-bold' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
              Guardados ({savedItems.length})
            </button>
            <button 
              onClick={() => setActiveTab('historial')}
              className={`px-space-md py-space-xs rounded-full transition-all flex items-center gap-2 font-title-sm text-sm border border-transparent ${activeTab === 'historial' ? 'bg-primary-container/20 text-primary-container border-primary-container/50 font-bold' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-lg">history</span>
              Historial de visualización (42)
            </button>
            <button 
              onClick={() => setActiveTab('colecciones')}
              className={`px-space-md py-space-xs rounded-full transition-all flex items-center gap-2 font-title-sm text-sm border border-transparent ${activeTab === 'colecciones' ? 'bg-primary-container/20 text-primary-container border-primary-container/50 font-bold' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-lg">folder_special</span>
              Colecciones personalizadas (3)
            </button>
            <button 
              onClick={() => setActiveTab('descargas')}
              className={`px-space-md py-space-xs rounded-full transition-all flex items-center gap-2 font-title-sm text-sm border border-transparent ${activeTab === 'descargas' ? 'bg-primary-container/20 text-primary-container border-primary-container/50 font-bold' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-lg">download_done</span>
              Descargas (5)
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md mb-space-xl bg-surface-container-lowest/50 p-2 rounded-xl">
            <div className="flex flex-wrap items-center gap-space-sm w-full md:w-auto">
              <button className="flex items-center gap-2 text-on-surface font-title-sm text-sm px-4 py-2 hover:bg-surface-container rounded-lg transition-colors border border-white/5 bg-surface-container-low">
                <span className="material-symbols-outlined text-sm">sort</span>
                Añadido recientemente
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button className="flex items-center gap-2 text-on-surface font-title-sm text-sm px-4 py-2 hover:bg-surface-container rounded-lg transition-colors border border-white/5 bg-surface-container-low">
                <span className="material-symbols-outlined text-sm">category</span>
                Todos los géneros
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <div className="h-6 w-px bg-surface-container-high mx-2 hidden md:block"></div>
              <button className="text-on-surface-variant hover:text-on-surface font-title-sm text-sm px-3 py-1 transition-colors">
                Sin empezar
              </button>
              <button className="bg-surface-container text-on-surface font-title-sm text-sm px-3 py-1 rounded transition-colors border border-white/10">
                En progreso (6)
              </button>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input 
                  type="text" 
                  placeholder="Filtrar en tu lista..." 
                  className="w-full bg-surface-container border border-transparent hover:border-white/10 focus:border-primary-container outline-none rounded-lg py-2 pl-9 pr-4 text-sm text-on-surface placeholder-on-surface-variant/60 transition-all"
                />
              </div>
              <div className="flex bg-surface-container rounded-lg p-1 border border-white/5">
                <button className="p-1 text-on-surface bg-surface-container-high rounded shadow-sm"><span className="material-symbols-outlined text-sm block">grid_view</span></button>
                <button className="p-1 text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-sm block">view_list</span></button>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          {activeTab === 'guardados' && (
            loading ? (
              <div className="flex justify-center p-20">
                <div className="w-12 h-12 border-4 border-surface-container-highest border-t-primary-container rounded-full animate-spin"></div>
              </div>
            ) : savedItems.length === 0 ? (
              <div className="w-full h-64 flex flex-col items-center justify-center bg-surface-container-low rounded-2xl border border-white/5 border-dashed">
                <span className="material-symbols-outlined text-5xl text-surface-container-highest mb-4">bookmark_border</span>
                <h3 className="font-headline-md text-on-surface mb-2">Tu lista está vacía</h3>
                <p className="text-on-surface-variant">Explora el catálogo y añade películas para verlas más tarde.</p>
                <a href="/" className="mt-6 bg-primary-container text-on-primary px-6 py-2 rounded-lg font-bold hover:brightness-110 transition-all">
                  Explorar Catálogo
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-space-md md:gap-space-lg mb-space-3xl">
                {savedItems.map((item) => {
                  const title = item.tmdbData?.title || item.name.replace(/\.[^/.]+$/, "");
                  const posterUrl = item.tmdbData?.posterPath || item.thumbnailLink;
                  const subtitle = item.tmdbData?.genres?.[0]?.name || (item.mimeType?.startsWith('image/') ? 'Imagen' : 'Video');
                  const runtimeStr = item.tmdbData?.runtime ? ` • ${Math.floor(item.tmdbData.runtime / 60)}h ${item.tmdbData.runtime % 60}m` : '';

                  return (
                    <div key={item.id} className="group relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.03] border border-transparent hover:border-white/10">
                      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-container">
                        {posterUrl ? (
                          <img className="w-full h-full object-cover" src={posterUrl} alt={title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4 text-center">
                            <span className="font-title-sm">{title}</span>
                          </div>
                        )}
                        
                        {/* Remove Button */}
                        <button 
                          onClick={(e) => handleRemove(item.id, e)}
                          className="absolute top-2 right-2 w-8 h-8 bg-surface-container-highest/80 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface hover:bg-error-container hover:text-on-error-container transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        
                        {item.tmdbData?.mediaType === 'tv' && (
                          <span className="absolute top-2 left-2 bg-primary-container text-on-primary font-label-badge text-[9px] px-1.5 py-0.5 rounded shadow-sm font-bold tracking-wider">
                            SERIE
                          </span>
                        )}

                        <div className="absolute inset-0 bg-surface-container-lowest/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <span className="material-symbols-outlined text-primary text-5xl drop-shadow-[0_0_15px_rgba(255,82,97,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                        </div>
                      </div>
                      <div className="p-space-sm flex flex-col flex-grow justify-between border-t border-white/5">
                        <h3 className="font-title-sm text-title-sm text-on-surface font-bold line-clamp-1">{title}</h3>
                        <p className="text-on-surface-variant font-label-badge text-xs mt-1 truncate">
                          {subtitle} {runtimeStr}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* Sync & Capacity Widget */}
          <div className="w-full bg-surface-container-low border border-white/5 rounded-2xl p-space-xl mb-space-3xl flex flex-col md:flex-row items-center justify-between gap-space-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-tertiary-container"></div>
            <div className="flex flex-col z-10 max-w-xl">
              <span className="text-tertiary-container font-label-badge text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">cloud_sync</span>
                Sincronización Cloud Offline
              </span>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">Capacidad de descargas en este equipo</h3>
              <p className="text-on-surface-variant">
                {savedItems.length} títulos guardados en caché disponibles para reproducción en modo viaje o sin conexión a red.
              </p>
            </div>

            <div className="flex flex-col w-full md:w-auto md:min-w-[400px] z-10">
              <div className="flex justify-between items-end mb-2 font-label-md text-xs font-bold">
                <span className="text-on-surface">14.8 GB usados</span>
                <span className="text-on-surface-variant">64.0 GB asignados</span>
              </div>
              <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden flex mb-3">
                <div className="h-full bg-primary-container" style={{ width: '45%' }}></div>
                <div className="h-full bg-secondary-container" style={{ width: '15%' }}></div>
              </div>
              <div className="flex items-center gap-4 text-xs font-label-md text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  Películas (11.2 GB)
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  Series (3.6 GB)
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </>
  );
}
