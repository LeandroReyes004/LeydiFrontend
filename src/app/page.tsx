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
    } else {
      // Es un video, reproducirlo
      setSelectedMovie(item);
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
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-8 text-white font-sans">
      <div className="w-full max-w-7xl flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-wide">
          🎬 Cine Privado
        </h1>
        {folderHistory.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Explorando:</span>
            <span className="font-semibold text-blue-400">
              {folderHistory[folderHistory.length - 1].name}
            </span>
          </div>
        )}
      </div>
      
      {currentFolderId === "YOUR_GOOGLE_DRIVE_FOLDER_ID" ? (
        <p className="text-red-400 mb-8 bg-red-900/20 p-4 rounded-lg">
          ⚠️ Por favor, pon el ID de tu carpeta principal en el código (línea 6).
        </p>
      ) : (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navegador Lateral */}
          <div className="lg:col-span-1 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 h-fit max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-800 z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Archivos</h2>
                {folderHistory.length > 0 && (
                  <button 
                    onClick={handleGoBack}
                    className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    ⬅️ Volver
                  </button>
                )}
              </div>
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 pt-2">
              {loading ? (
                <p className="text-gray-400 text-sm mt-4 text-center animate-pulse">Cargando...</p>
              ) : filteredItems.length === 0 ? (
                <p className="text-gray-400 text-sm mt-4 text-center">Carpeta vacía o sin resultados.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredItems.map((item) => {
                    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
                    const isSelected = selectedMovie?.id === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`text-left rounded-xl transition-all flex items-center overflow-hidden border ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-500 shadow-md' 
                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {/* Ícono o Miniatura */}
                        {isFolder ? (
                          <div className="w-16 h-16 bg-gray-900 flex items-center justify-center flex-shrink-0 text-3xl">
                            📁
                          </div>
                        ) : item.thumbnailLink ? (
                          <img 
                            src={item.thumbnailLink} 
                            alt="Poster" 
                            className="w-16 h-16 object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-900 flex items-center justify-center flex-shrink-0 text-2xl">
                            🎥
                          </div>
                        )}
                        
                        {/* Info del archivo */}
                        <div className="p-3 flex-1 min-w-0">
                          <p className={`font-medium truncate ${isSelected ? 'text-white' : 'text-gray-200'}`} title={item.name}>
                            {item.name}
                          </p>
                          {!isFolder && (
                            <p className={`text-xs mt-1 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
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
          <div className="lg:col-span-3 flex flex-col items-center">
            {selectedMovie ? (
              <div className="w-full bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800 p-2">
                <video 
                  ref={videoRef}
                  key={selectedMovie.id} 
                  controls 
                  className="w-full h-auto rounded-xl aspect-video bg-gray-900"
                  autoPlay
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                >
                  <source src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/${selectedMovie.id}`} type="video/mp4" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
                <div className="p-4 bg-gray-900 mt-2 rounded-lg flex justify-between items-center">
                  <h3 className="font-semibold text-xl text-white">{selectedMovie.name}</h3>
                  <span className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                    Progreso Guardado
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-500 bg-gray-900/50">
                <span className="text-5xl mb-4">🍿</span>
                <p className="text-lg">Selecciona una película para empezar a ver</p>
                <p className="text-sm mt-2 opacity-75">O navega por las carpetas en el menú de la izquierda</p>
              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}
