"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import MediaRow from '@/components/MediaRow';
import MovieDetail from '@/components/MovieDetail';
import { useSearchParams, useRouter } from 'next/navigation';

const ROOT_DRIVE_FOLDER_ID = "14cNucDHdxuThs5OuJok_jSgWbzKuS3oA";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialFolderId = searchParams.get('folder') || ROOT_DRIVE_FOLDER_ID;
  const initialMovieId = searchParams.get('movie');

  const [currentFolderId, setCurrentFolderId] = useState(initialFolderId);
  const [folderHistory, setFolderHistory] = useState<{id: string, name: string}[]>([]);
  
  const [items, setItems] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<any | null>(null);
  const [heroCandidates, setHeroCandidates] = useState<any[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Si hay un movieId en la URL, intentamos encontrarlo en los items cargados
  useEffect(() => {
    if (initialMovieId && items.length > 0 && !selectedMovie) {
      const movie = items.find(i => i.id === initialMovieId);
      if (movie) {
        setSelectedMovie(movie);
        // Limpiamos la URL para no re-trigger
        window.history.replaceState({}, '', '/');
      }
    }
  }, [items, initialMovieId, selectedMovie]);

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
            const candidates = sortedData.filter((item: any) => {
              const isItemImage = item.mimeType?.startsWith('image/') || 
                                  item.name.toLowerCase().endsWith('.webp') || 
                                  item.name.toLowerCase().endsWith('.jpg') || 
                                  item.name.toLowerCase().endsWith('.png');
              return !isItemImage; // Incluye tanto videos como carpetas
            });
            
            if (candidates.length > 0) {
              setHeroCandidates(candidates);
              const randomIndex = Math.floor(Math.random() * candidates.length);
              setCurrentHeroIndex(randomIndex);
              setFeaturedMovie(candidates[randomIndex]);
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

  // Efecto para rotar el Hero automáticamente cada 10 segundos
  useEffect(() => {
    if (heroCandidates.length > 1 && !selectedMovie && !isPlaying) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % heroCandidates.length;
          setFeaturedMovie(heroCandidates[nextIndex]);
          return nextIndex;
        });
      }, 10000); // 10 segundos
      
      return () => clearInterval(interval);
    }
  }, [heroCandidates, selectedMovie, isPlaying]);

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
      setIsPlaying(false);
    } else {
      setSelectedMovie(item);
      setIsPlaying(false);
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
          
          {/* Fullscreen Video Player */}
          {isPlaying && selectedMovie && (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
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
              <button 
                onClick={() => setIsPlaying(false)} 
                className="absolute top-4 left-4 z-[101] bg-surface-container-highest/80 backdrop-blur text-on-surface hover:bg-primary-container hover:text-on-primary px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span> Salir
              </button>
            </div>
          )}

          {/* Hero Section / Movie Detail */}
          {selectedMovie && !isPlaying ? (
            <MovieDetail 
              movie={selectedMovie} 
              onPlayClick={() => setIsPlaying(true)} 
              onClose={() => setSelectedMovie(null)} 
            />
          ) : (
            <Hero 
              movie={featuredMovie} 
              onPlayClick={(movie) => {
                if (movie.mimeType === 'application/vnd.google-apps.folder') {
                  handleItemClick(movie);
                } else {
                  setSelectedMovie(movie);
                  setIsPlaying(true);
                }
              }}
              onInfoClick={(movie) => handleItemClick(movie)}
            />
          )}

          {/* Contenido Principal (Filas al estilo Netflix) */}
          <div className={`relative z-20 flex flex-col gap-space-3xl px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl ${selectedMovie && !isPlaying ? 'hidden' : ''}`}>
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

export default function VideoPlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-surface-container-highest border-t-primary-container rounded-full animate-spin"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
