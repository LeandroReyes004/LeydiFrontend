"use client";

import React, { useState, useEffect, useRef } from 'react';

// Reemplaza esto con el ID real de tu CARPETA PRINCIPAL en Google Drive
const ROOT_DRIVE_FOLDER_ID = "14cNucDHdxuThs5OuJok_jSgWbzKuS3oA";

export default function VideoPlayerPage() {
  const [currentFolderId, setCurrentFolderId] = useState(ROOT_DRIVE_FOLDER_ID);
  const [folderHistory, setFolderHistory] = useState<{id: string, name: string}[]>([]);
  
  const [items, setItems] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [featuredMovie, setFeaturedMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoading(true);
    setSearchTerm(""); // Resetear búsqueda al cambiar de carpeta
    if (currentFolderId !== "YOUR_GOOGLE_DRIVE_FOLDER_ID") {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      fetch(`${apiUrl}/api/movies/${currentFolderId}`)
        .then((res) => res.json())
        .then((data) => {
          // Ordenar: primero carpetas, luego archivos
          const sortedData = (data || []).sort((a: any, b: any) => {
            const aIsFolder = a.mimeType === 'application/vnd.google-apps.folder';
            const bIsFolder = b.mimeType === 'application/vnd.google-apps.folder';
            if (aIsFolder && !bIsFolder) return -1;
            if (!aIsFolder && bIsFolder) return 1;
            return a.name.localeCompare(b.name);
          });
          setItems(sortedData);
          
          // Buscar una imagen llamada "portada" en la carpeta actual
          // Simplificamos la búsqueda: si no es carpeta y se llama portada, asumimos que es la imagen.
          const coverImage = sortedData.find((item: any) => {
            return item.mimeType !== 'application/vnd.google-apps.folder' && 
                   item.name.toLowerCase().includes('portada');
          });

          if (coverImage) {
            // Si hay portada, la usamos. El nombre será el de la carpeta actual o Cine Privado
            const currentFolderName = folderHistory.length > 0 
              ? folderHistory[folderHistory.length - 1].name 
              : "Cine Privado";
              
            setFeaturedMovie({
              isCoverOnly: true,
              id: coverImage.id, // Guardamos el ID para usar el stream original en máxima calidad
              name: currentFolderName,
              thumbnailLink: coverImage.thumbnailLink,
            });
          } else {
            // Fallback: Seleccionar película destacada para la portada
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
      // Es una carpeta, entrar en ella
      setFolderHistory([...folderHistory, { id: currentFolderId, name: item.name }]);
      setCurrentFolderId(item.id);
      setSelectedMovie(null); // Quitar peli actual al cambiar de carpeta
    } else {
      // Es un video, reproducirlo
      setSelectedMovie(item);
      // Hacer scroll hacia arriba (donde está el reproductor)
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

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const folders = filteredItems.filter(item => item.mimeType === 'application/vnd.google-apps.folder');
  
  // Filtramos los archivos para no mostrar: 
  // 1. Carpetas
  // 2. La imagen de "portada"
  // 3. Imágenes que se usan como carátula de una carpeta
  // 4. Imágenes que se usan como carátula de una película
  const files = filteredItems.filter(item => {
    if (item.mimeType === 'application/vnd.google-apps.folder') return false;
    if (item.name.toLowerCase().includes('portada')) return false;

    // ¿Es esta imagen la carátula de alguna carpeta?
    const isFolderCover = folders.some(f => f.name === item.name.replace(/\.[^/.]+$/, ""));
    if (isFolderCover) return false;

    // ¿Es esta imagen la carátula de alguna película?
    const isMovieCover = filteredItems.some(movie => 
      movie.mimeType?.startsWith('video/') && 
      movie.name.replace(/\.[^/.]+$/, "") === item.name.replace(/\.[^/.]+$/, "")
    );
    // Si es imagen y coincide con una peli, la ocultamos de la lista
    if (isMovieCover && item.mimeType?.startsWith('image/')) return false;

    return true;
  });

  return (
    <>
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo">CINE PRIVADO</div>
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </nav>

      {/* Hero Section / Reproductor Principal */}
      {selectedMovie ? (
        <div className="hero-container">
          <video 
            ref={videoRef}
            key={selectedMovie.id} 
            controls 
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="hero-video"
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/${selectedMovie.id}`} type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
          <div className="hero-info">
            <h1 className="hero-title">{selectedMovie.name}</h1>
            <span className="hero-badge">Reproduciendo ahora</span>
          </div>
        </div>
      ) : featuredMovie ? (
        <div 
          className="hero-featured"
          style={{ 
            backgroundImage: `url(${
              featuredMovie.isCoverOnly 
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/${featuredMovie.id}`
                : (featuredMovie.thumbnailLink ? featuredMovie.thumbnailLink.replace('=s220', '=s1000') : '')
            })` 
          }}
        >
          <div className="hero-featured-gradient">
            <h1 className="hero-featured-title">{featuredMovie.name}</h1>
            
            {/* Solo mostramos el botón de reproducir si es una película real, no si es solo portada */}
            {!featuredMovie.isCoverOnly && (
              <div className="hero-featured-buttons">
                <button onClick={() => handleItemClick(featuredMovie)} className="btn-play">
                  ▶ Reproducir
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hero-placeholder">
          <h1>🍿</h1>
          <h2>Explora el Catálogo</h2>
          <p>Selecciona una película para comenzar a ver</p>
        </div>
      )}

      {/* Contenido Principal (Filas al estilo Netflix) */}
      <main className="main-content">
        {currentFolderId === "YOUR_GOOGLE_DRIVE_FOLDER_ID" ? (
          <div className="empty-state">
            ⚠️ Por favor, pon el ID de tu carpeta principal en el código.
          </div>
        ) : loading ? (
          <div className="loading-spinner"></div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            Carpeta vacía o sin resultados.
          </div>
        ) : (
          <>
            {/* Fila de Carpetas */}
            {folders.length > 0 && (
              <section className="row-section">
                <div className="row-header">
                  <h3 className="row-title">
                    {folderHistory.length > 0 ? `Carpetas en ${folderHistory[folderHistory.length - 1].name}` : "Carpetas Principales"}
                  </h3>
                  {folderHistory.length > 0 && (
                    <button onClick={handleGoBack} className="back-btn">
                      ← Volver
                    </button>
                  )}
                </div>
                <div className="row-container">
                  {folders.map((folder: any) => {
                    // Buscar si hay una imagen con el mismo nombre que la carpeta
                    const folderCover = items.find(i => 
                      i.mimeType !== 'application/vnd.google-apps.folder' && 
                      i.name.replace(/\.[^/.]+$/, "") === folder.name
                    );
                    
                    return (
                      <button
                        key={folder.id}
                        onClick={() => handleItemClick(folder)}
                        className="card"
                        title={folder.name}
                      >
                        {folderCover ? (
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/${folderCover.id}`} 
                            alt={folder.name} 
                            className="card-image"
                          />
                        ) : (
                          <div className="card-icon virtual-poster">
                            <span className="virtual-title">{folder.name}</span>
                          </div>
                        )}
                        <div className="card-info">
                          <p className="card-title">{folder.name}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Fila/Grid de Películas */}
            {files.length > 0 && (
              <section className="row-section">
                <div className="row-header">
                  <h3 className="row-title">Películas</h3>
                  {/* Botón volver también aquí por si no hay carpetas */}
                  {folderHistory.length > 0 && folders.length === 0 && (
                    <button onClick={handleGoBack} className="back-btn">
                      ← Volver
                    </button>
                  )}
                </div>
                {/* Usamos flex-wrap para que las pelis caigan en múltiples líneas (estilo grid) */}
                <div className="row-container" style={{ flexWrap: 'wrap', gap: '20px' }}>
                  {files.map((file: any) => {
                    // Si este archivo es un video, buscamos si tiene una imagen con el mismo nombre
                    const movieCover = items.find(i => 
                      i.mimeType?.startsWith('image/') && 
                      i.name.replace(/\.[^/.]+$/, "") === file.name.replace(/\.[^/.]+$/, "")
                    );
                    const isSelected = selectedMovie?.id === file.id;

                    return (
                      <button
                        key={file.id}
                        onClick={() => handleItemClick(file)}
                        className={`card ${isSelected ? 'selected' : ''}`}
                        title={file.name}
                      >
                        {movieCover ? (
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/${movieCover.id}`} 
                            alt={file.name} 
                            className="card-image"
                          />
                        ) : file.thumbnailLink ? (
                          <img 
                            src={file.thumbnailLink} 
                            alt={file.name} 
                            className="card-image"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="card-icon virtual-poster">
                            <span className="virtual-title">{file.name.replace(/\.[^/.]+$/, "")}</span>
                          </div>
                        )}
                        <div className="card-info">
                          <p className="card-title">{file.name.replace(/\.[^/.]+$/, "")}</p>
                          <p className="card-subtitle">
                            {(parseInt(file.size) / (1024 * 1024 * 1024)).toFixed(2)} GB
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}
