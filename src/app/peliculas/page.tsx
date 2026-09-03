"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MediaRow from '@/components/MediaRow';

const ROOT_DRIVE_FOLDER_ID = "14cNucDHdxuThs5OuJok_jSgWbzKuS3oA";

export default function PeliculasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/backend/api/catalog/${ROOT_DRIVE_FOLDER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        // Filtrar películas (archivos de video, ignorar carpetas/imágenes/series)
        const filtered = (data || []).filter((item: any) => {
          if (item.mimeType === 'application/vnd.google-apps.folder') return false;
          if (item.mimeType?.startsWith('image/')) return false;
          if (item.name.toLowerCase().includes('portada')) return false;
          
          // Si TMDB dice que es serie, lo ocultamos de películas
          if (item.tmdbData && item.tmdbData.mediaType === 'tv') return false;
          
          return true;
        }).sort((a: any, b: any) => a.name.localeCompare(b.name));

        setItems(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando películas:", err);
        setLoading(false);
      });
  }, []);

  const handleItemClick = (item: any) => {
    window.location.href = `/?movie=${item.id}`;
  };

  return (
    <>
      <Navbar />
      <main className="w-full pt-32 pb-20 bg-surface-container-lowest min-h-screen">
        <div className="max-w-[1400px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          
          <div className="mb-12">
            <h1 className="font-headline-lg text-4xl text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-4xl text-primary">movie</span>
              Películas
            </h1>
            <p className="text-on-surface-variant font-body-lg">
              Explora todas las películas individuales en tu catálogo.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center p-20">
              <div className="w-12 h-12 border-4 border-surface-container-highest border-t-primary-container rounded-full animate-spin"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center p-20 text-on-surface-variant bg-surface-container-low rounded-xl border border-white/5 border-dashed">
              <span className="material-symbols-outlined text-5xl mb-4">movie_off</span>
              <p className="text-xl">No tienes películas sueltas en tu catálogo.</p>
              <p className="text-sm mt-2">Sube archivos de video a la raíz de tu Google Drive.</p>
            </div>
          ) : (
            <div className="mt-8">
              <MediaRow 
                title="Todas las Películas"
                items={items}
                allMedia={items}
                onItemClick={handleItemClick}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
