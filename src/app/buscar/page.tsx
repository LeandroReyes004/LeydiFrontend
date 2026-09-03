"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MediaRow from '@/components/MediaRow';

const ROOT_DRIVE_FOLDER_ID = "14cNucDHdxuThs5OuJok_jSgWbzKuS3oA";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/backend/api/catalog/${ROOT_DRIVE_FOLDER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedData = (data || []).sort((a: any, b: any) => {
          const aIsFolder = a.mimeType === 'application/vnd.google-apps.folder';
          const bIsFolder = b.mimeType === 'application/vnd.google-apps.folder';
          if (aIsFolder && !bIsFolder) return -1;
          if (!aIsFolder && bIsFolder) return 1;
          return a.name.localeCompare(b.name);
        });
        
        // Filtrar por búsqueda (nombre o géneros)
        const q = query.toLowerCase();
        const filtered = sortedData.filter((item: any) => {
          const titleMatch = item.name.toLowerCase().includes(q) || 
                             (item.tmdbData?.title && item.tmdbData.title.toLowerCase().includes(q));
          
          const genreMatch = item.tmdbData?.genres?.some((genre: any) => 
            genre.name.toLowerCase().includes(q)
          );
          
          return titleMatch || genreMatch;
        });

        setItems(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error buscando:", err);
        setLoading(false);
      });
  }, [query]);

  const handleItemClick = (item: any) => {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      window.location.href = `/?folder=${item.id}`;
    } else {
      window.location.href = `/?movie=${item.id}`;
    }
  };

  return (
    <main className="w-full pt-32 pb-20 bg-surface-container-lowest min-h-screen">
      <div className="max-w-[1400px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
        
        <div className="mb-12">
          <h1 className="font-headline-lg text-4xl text-on-surface mb-2">
            Resultados para "{query}"
          </h1>
          <p className="text-on-surface-variant font-body-lg">
            Encontramos {items.length} resultados en tu catálogo.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-12 h-12 border-4 border-surface-container-highest border-t-primary-container rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-20 text-on-surface-variant bg-surface-container-low rounded-xl border border-white/5 border-dashed">
            <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
            <p className="text-xl">No se encontraron películas o series para "{query}"</p>
          </div>
        ) : (
          <div className="mt-8">
            <MediaRow 
              title="Resultados de la búsqueda"
              items={items}
              allMedia={items}
              onItemClick={handleItemClick}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function BuscarPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-surface-container-lowest pt-32 text-center text-on-surface">Cargando buscador...</div>}>
        <SearchResultsContent />
      </Suspense>
      <Footer />
    </>
  );
}
