"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
      <div className="h-16 w-full px-gutter-desktop flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-xl">
          <Link href="/" className="flex items-center gap-space-xs focus:outline-none">
            <img 
              alt="CineStream Brand Logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFVx0V1W8ztzEDXgLvrj4HXrnE9WG9LT35BW3Vf--E9b6sZke-clQKLk6WrpFLYVVKgipvm7HffdX31vR08l22OGpRyCFQhajDscukJnvU2UaHBQM-3dybV3eVWjRRnXL3_68rbMnNO8Tom_eHiZPhascTvyUoQM6Ct6Hnw_wWql2t3OJ2ruDHRJxdRk8lea0Rk6pGkWtPiaHwEsSEF9gqJhOcyiiSEVN-e3hk83uh8HHTw4V5pXnnrA"
            />
            <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-black hidden sm:inline-block">
              CINESTREAM
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-space-lg ml-space-xl">
            <Link href="/" className="font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors">Inicio</Link>
            <Link href="/peliculas" className="font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors">Películas</Link>
            <Link href="/series" className="font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors">Series</Link>
            <Link href="#" className="font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors">Novedades</Link>
            <Link href="/mi-lista" className="font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors">Mi Lista</Link>
          </nav>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="relative flex items-center">
            {/* Barra de búsqueda estilo Netflix */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant group-hover:text-on-surface transition-colors pointer-events-none">search</span>
              <input 
                type="text" 
                placeholder="Títulos, géneros..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container-high border border-transparent focus:border-white/20 focus:bg-surface-container-highest rounded-full py-1.5 pl-10 pr-4 text-sm font-body-sm text-on-surface placeholder:text-on-surface-variant/70 outline-none w-64 transition-all duration-300"
              />
            </form>
          </div>
          <button aria-label="Notificaciones" className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative" type="button">
            <span className="material-symbols-outlined select-none">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-container"></span>
          </button>
          <Link href="/admin" aria-label="Perfil de usuario" className="focus:outline-none ml-space-xxs">
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7PjUmd_kh4xImgOwF6yn7mf5zLTOIspuanc93v7ulX8UBMwLY6DrfrF6alRs6eGqvgge3KCa5Tj7-TmZSpz8COR6DYtE9T-8Yc5n2pdin7CxoWGuhvP-CiiLePwSENARVjv_Qp8pBGKa_KIM8hSyMXM9KttBf6LC9mtPrS5Ausvm4Qpu2VZWUf3z5gfb4HwJYH9ANUwg38c16b1MQ2cIVKrFS398owKYe3_gKe6LqBVHXtwmYoigWVw"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
