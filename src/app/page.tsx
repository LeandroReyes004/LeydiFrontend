"use client";

import React, { useState, useEffect, useRef } from 'react';

// Reemplaza esto con el ID real de tu CARPETA PRINCIPAL en Google Drive
const ROOT_DRIVE_FOLDER_ID = "14cNucDHdxuThs5OuJok_jSgWbzKuS3oA";

export default function VideoPlayerPage() {
  const [currentFolderId, setCurrentFolderId] = useState(ROOT_DRIVE_FOLDER_ID);
  const [folderHistory, setFolderHistory] = useState<{id: string, name: string}[]>([]);
  
  const [items, setItems] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
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
      // En celular, hacer scroll hacia arriba (donde está el reproductor)
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

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center p-4 sm:p-8 text-white font-sans selection:bg-blue-500">
      <div className="w-full max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
          🎬 Cine Privado
        </h1>
        {folderHistory.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-400 bg-gray-900 p-2 px-4 rounded-full border border-gray-800">
            <span>Explorando:</span>
            <span className="font-semibold text-blue-400">
              {folderHistory[folderHistory.length - 1].name}
            </span>
          </div>
        )}
      </div>
      
      {currentFolderId === "YOUR_GOOGLE_DRIVE_FOLDER_ID" ? (
        <p className="text-red-400 mb-8 bg-red-900/20 p-4 rounded-lg text-center">
          ⚠️ Por favor, pon el ID de tu carpeta principal en el código.
        </p>
      ) : (
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Navegador Lateral (Buscador y Lista) */}
          <div className="w-full lg:w-1/3 xl:w-1/4 order-2 lg:order-1 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden h-[75vh] lg:h-[80vh]">
            <div className="p-4 border-b border-gray-800 bg-gray-900 z-10 flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-semibold">Archivos</h2>
                {folderHistory.length > 0 && (
                  <button 
                    onClick={handleGoBack}
                    tabIndex={0}
                    className="text-sm bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium"
                  >
                    ⬅️ Volver
                  </button>
                )}
              </div>
              <input 
                type="text" 
                placeholder="Buscar..." 
                tabIndex={0}
                className="w-full bg-black text-white border border-gray-700 rounded-xl p-3 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 pt-2 scroll-smooth">
              {loading ? (
                <div className="flex justify-center mt-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-gray-500 text-center mt-8 px-4">
                  <span className="text-4xl block mb-2">📁</span>
                  <p>Carpeta vacía o sin resultados.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredItems.map((item) => {
                    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
                    const isSelected = selectedMovie?.id === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        tabIndex={0}
                        className={`text-left rounded-xl transition-all flex items-center overflow-hidden border-2 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 ${
                          isSelected 
                            ? 'bg-blue-900/40 border-blue-500/50 shadow-lg' 
                            : 'bg-black border-transparent hover:bg-gray-800 hover:border-gray-700'
                        }`}
                      >
                        {/* Ícono o Miniatura */}
                        {isFolder ? (
                          <div className="w-20 h-20 sm:w-16 sm:h-16 bg-gray-900 flex items-center justify-center flex-shrink-0 text-3xl sm:text-2xl border-r border-gray-800">
                            📁
                          </div>
                        ) : item.thumbnailLink ? (
                          <img 
                            src={item.thumbnailLink} 
                            alt="Poster" 
                            className="w-20 h-24 sm:w-16 sm:h-20 object-cover flex-shrink-0 border-r border-gray-800"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-20 h-24 sm:w-16 sm:h-20 bg-gray-900 flex items-center justify-center flex-shrink-0 text-3xl sm:text-2xl border-r border-gray-800">
                            🎥
                          </div>
                        )}
                        
                        {/* Info del archivo */}
                        <div className="p-3 sm:p-4 flex-1 min-w-0">
                          <p className={`font-medium sm:font-semibold truncate text-lg sm:text-base ${isSelected ? 'text-blue-300' : 'text-gray-100'}`} title={item.name}>
                            {item.name}
                          </p>
                          {!isFolder && (
                            <p className={`text-sm sm:text-xs mt-1 ${isSelected ? 'text-blue-200/70' : 'text-gray-500'}`}>
                              {(parseInt(item.size) / (1024 * 1024 * 1024)).toFixed(2)} GB
                            </p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Reproductor Principal */}
          <div className={`w-full lg:w-2/3 xl:w-3/4 order-1 lg:order-2 flex-col items-center ${selectedMovie ? 'flex' : 'hidden lg:flex'}`}>
            {selectedMovie ? (
              <div className="w-full bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                <video 
                  ref={videoRef}
                  key={selectedMovie.id} 
                  controls 
                  tabIndex={0}
                  className="w-full h-auto max-h-[75vh] object-contain aspect-video bg-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-500"
                  autoPlay
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                >
                  <source src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/${selectedMovie.id}`} type="video/mp4" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
                <div className="p-5 sm:p-6 bg-gray-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-bold text-xl sm:text-2xl text-white">{selectedMovie.name}</h3>
                  <span className="text-sm font-medium text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20 whitespace-nowrap">
                    Progreso Guardado
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-gray-500 bg-gray-900/30 p-8 text-center min-h-[300px]">
                <span className="text-6xl sm:text-7xl mb-6">🍿</span>
                <p className="text-xl sm:text-2xl font-medium text-gray-400">Selecciona una película</p>
                <p className="text-base sm:text-lg mt-3 opacity-60">Navega por las carpetas en el menú para empezar</p>
              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}
