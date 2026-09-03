import React, { useRef } from 'react';
import MediaCard from './MediaCard';

interface MediaRowProps {
  title: string;
  items: any[];
  allMedia: any[];
  onItemClick: (item: any) => void;
  onGoBack?: () => void;
  isFolderRow?: boolean;
}

export default function MediaRow({ title, items, allMedia, onItemClick, onGoBack, isFolderRow = false }: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = 320;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-1.5 h-6 rounded-full bg-primary-container"></div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">{title}</h2>
          {onGoBack && (
            <button onClick={onGoBack} className="ml-4 text-primary font-label-md text-label-md hover:underline flex items-center">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Volver
            </button>
          )}
        </div>
        <div className="flex items-center gap-space-xs">
          <button 
            aria-label="Anterior" 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button 
            aria-label="Siguiente" 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
      
      {/* Horizontal Ribbon */}
      <div 
        ref={rowRef}
        className="flex gap-space-md overflow-x-auto scroll-smooth pb-space-sm pt-space-xxs no-scrollbar"
      >
        {items.map((item) => {
          // Find cover image if it exists
          let coverImage;
          if (isFolderRow) {
            coverImage = allMedia.find(i => 
              i.mimeType !== 'application/vnd.google-apps.folder' && 
              i.name.replace(/\.[^/.]+$/, "") === item.name
            );
          } else {
            coverImage = allMedia.find(i => 
              i.mimeType?.startsWith('image/') && 
              i.name.replace(/\.[^/.]+$/, "") === item.name.replace(/\.[^/.]+$/, "")
            );
          }

          return (
            <MediaCard 
              key={item.id}
              item={item}
              coverImage={coverImage}
              onClick={onItemClick}
              isFolder={isFolderRow}
            />
          );
        })}
      </div>
    </section>
  );
}
