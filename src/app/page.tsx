"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import MediaRow from '@/components/MediaRow';

const ROOT_DRIVE_FOLDER_ID = "14cNucDHdxuThs5OuJok_jSgWbzKuS3oA";

export default function VideoPlayerPage() {
  const [currentFolderId, setCurrentFolderId] = useState(ROOT_DRIVE_FOLDER_ID);
  const [folderHistory, setFolderHistory] = useState<{id: string, name: string}[]>([]);
  
  const [items, setItems] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [featuredMovie, setFeaturedMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoading(true);
    if (currentFolderId !== "YOUR_GOOGLE_DRIVE_FOLDER_ID") {
      // Usamos el proxy de Next.js para evitar el bloqueo de Mixed Content
      fetch(`/backend/api/movies/${currentFolderId}`)
        .then((res) => res.json())
        .then((data) => {
          const sortedData = (data || []).sort((a: any, b: any) => {
            const aIsFolder = a.mimeType === 'application/vnd.google-apps.folder';
            const bIsFolder = b.mimeType === 'application/vnd.google-apps.folder';
            if (aIsFolder && !bIsFolder) return -1;
            if (!aIsFolder && bIsFolder) return 1;
            return a.name.localeCompare(b.name);
          });
          setItems(sortedData);
          
          const coverImage = sortedData.find((item: any) => {
            return item.mimeType !== 'application/vnd.google-apps.folder' && 
                   item.name.toLowerCase().includes('portada');
          });

          if (coverImage) {
            const currentFolderName = folderHistory.length > 0 
              ? folderHistory[folderHistory.length - 1].name 
              : "CineStream Picks";
              
            setFeaturedMovie({
              isCoverOnly: true,
              id: coverImage.id,
              name: currentFolderName,
              thumbnailLink: coverImage.thumbnailLink,
            });
          } else {
            const moviesWithThumb = sortedData.filter((item: any) => {
              const isItemImage = item.mimeType?.startsWith('image/') || 
                                  item.name.toLowerCase().endsWith('.webp') || 
                                  item.name.toLowerCase().endsWith('.jpg') || 
                                  item.name.toLowerCase().endsWith('.png');
              return item.mimeType !== 'application/vnd.google-apps.folder' && 
                     !isItemImage && 
                     item.thumbnailLink;
            });
            
            if (moviesWithThumb.length > 0) {
              const randomIndex = Math.floor(Math.random() * moviesWithThumb.length);
              setFeaturedMovie(moviesWithThumb[randomIndex]);
            } else {
              setFeaturedMovie(null);
            }
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("Error cargando items:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentFolderId]);

  const handleTimeUpdate = () => {
    if (videoRef.current && selectedMovie) {
      const currentTime = videoRef.current.currentTime;
      localStorage.setItem(`movie_progress_${selectedMovie.id}`, currentTime.toString());
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && selectedMovie) {
      const savedTime = localStorage.getItem(`movie_progress_${selectedMovie.id}`);
      if (savedTime) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
    }
  };

  const handleItemClick = (item: any) => {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      setFolderHistory([...folderHistory, { id: currentFolderId, name: item.name }]);
      setCurrentFolderId(item.id);
      setSelectedMovie(null);
    } else {
      setSelectedMovie(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoBack = () => {
    if (folderHistory.length > 0) {
      const newHistory = [...folderHistory];
      const previousFolder = newHistory.pop();
      setFolderHistory(newHistory);
      if (previousFolder) {
        setCurrentFolderId(previousFolder.id);
      }
      setSelectedMovie(null);
    }
  };

  const folders = items.filter(item => item.mimeType === 'application/vnd.google-apps.folder');
  
  const files = items.filter(item => {
    if (item.mimeType === 'application/vnd.google-apps.folder') return false;
    if (item.name.toLowerCase().includes('portada')) return false;

    const isFolderCover = folders.some(f => f.name === item.name.replace(/\.[^/.]+$/, ""));
    if (isFolderCover) return false;

    const isMovieCover = items.some(movie => 
      movie.mimeType?.startsWith('video/') && 
      movie.name.replace(/\.[^/.]+$/, "") === item.name.replace(/\.[^/.]+$/, "")
    );
    if (isMovieCover && item.mimeType?.startsWith('image/')) return false;

    return true;
  });

  return (
    <>
      <Navbar />

      <main className="w-full pt-16 bg-surface-container-lowest min-h-screen">
        <div className="flex flex-col w-full">
          {/* Hero Section / Reproductor Principal */}
          {selectedMovie ? (
            <section className="relative w-full -mt-16 pt-24 pb-8 min-h-[60vh] flex flex-col items-center justify-center bg-surface-container-lowest">
              <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,82,97,0.15)] ring-1 ring-white/10 relative z-10">
                <video 
                  ref={videoRef}
                  key={selectedMovie.id} 
                  controls 
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-contain"
                  autoPlay
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                >
                  <source src={`/backend/api/stream/${selectedMovie.id}`} type="video/mp4" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
              </div>
              <div className="max-w-5xl w-full mt-6 px-4">
                <h1 className="font-headline-xl text-headline-xl text-on-surface">{selectedMovie.name}</h1>
                <span className="inline-block mt-2 bg-primary-container/20 text-primary-container px-3 py-1 rounded-full text-sm font-bold tracking-widest uppercase">
                  Reproduciendo ahora
                </span>
                <button onClick={() => setSelectedMovie(null)} className="ml-4 text-on-surface-variant hover:text-on-surface underline text-sm">
                  Cerrar Reproductor
                </button>
              </div>
            </section>
          ) : (
            <Hero 
              movie={featuredMovie} 
              onPlayClick={handleItemClick}
              onInfoClick={() => {}}
            />
          )}

          {/* Contenido Principal (Filas al estilo Netflix) */}
          <div className="relative z-20 flex flex-col gap-space-3xl px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl">
            {currentFolderId === "YOUR_GOOGLE_DRIVE_FOLDER_ID" ? (
              <div className="text-center p-12 text-on-surface-variant">
                ⚠️ Por favor, pon el ID de tu carpeta principal en el código.
              </div>
            ) : loading ? (
              <div className="flex justify-center p-20">
                <div className="w-12 h-12 border-4 border-surface-container-highest border-t-primary-container rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center p-12 text-on-surface-variant">
                Carpeta vacía o sin resultados.
              </div>
            ) : (
              <>
                <MediaRow 
                  title={folderHistory.length > 0 ? `Carpetas en ${folderHistory[folderHistory.length - 1].name}` : "Carpetas Principales"}
                  items={folders}
                  allMedia={items}
                  onItemClick={handleItemClick}
                  onGoBack={folderHistory.length > 0 ? handleGoBack : undefined}
                  isFolderRow={true}
                />
                
                <MediaRow 
                  title="Películas y Archivos"
                  items={files}
                  allMedia={items}
                  onItemClick={handleItemClick}
                  onGoBack={folderHistory.length > 0 && folders.length === 0 ? handleGoBack : undefined}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
