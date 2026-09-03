import React from 'react';

interface MediaCardProps {
  item: any;
  coverImage?: any;
  onClick: (item: any) => void;
  isFolder?: boolean;
}

export default function MediaCard({ item, coverImage, onClick, isFolder = false }: MediaCardProps) {
  
  // Decide image source
  let imageUrl = '';
  if (coverImage) {
    imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/${coverImage.id}`;
  } else if (item.thumbnailLink) {
    imageUrl = item.thumbnailLink;
  }

  const title = isFolder ? item.name : item.name.replace(/\.[^/.]+$/, "");
  const subtitle = isFolder ? "Carpeta" : `${(parseInt(item.size || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB`;

  return (
    <div 
      onClick={() => onClick(item)}
      className="group relative flex-none w-64 md:w-80 rounded-lg overflow-hidden bg-surface-container-high shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-video w-full bg-surface-container">
        {imageUrl ? (
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url('${imageUrl}')` }}
          ></div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-highest flex items-center justify-center p-4 text-center">
            <span className="font-headline-md text-headline-md text-on-surface line-clamp-2">{title}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
        
        {/* Play overlay */}
        {!isFolder && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surface-container-lowest/40 backdrop-blur-xs">
            <span className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </span>
          </div>
        )}

        {/* Top badge */}
        <span className="absolute top-2 left-2 bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded text-on-surface font-label-badge text-label-badge">
          {isFolder ? 'Colección' : 'Película'}
        </span>
      </div>
      
      {/* Progress Bar (fake for now, can be hooked to localStorage later) */}
      {!isFolder && (
        <div className="w-full h-1 bg-surface-container-highest">
          <div className="h-full bg-primary-container w-[15%]"></div>
        </div>
      )}
      
      <div className="p-space-sm flex flex-col gap-1">
        <div className="flex items-center justify-between text-on-surface">
          <span className="font-title-sm text-title-sm truncate font-bold">{title}</span>
        </div>
        <p className="text-on-surface-variant font-body-md text-body-md line-clamp-1">{subtitle}</p>
      </div>
    </div>
  );
}
