import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-space-3xl">
      <div className="w-full px-gutter-desktop py-space-2xl mx-auto flex flex-col gap-space-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-space-xl">
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface">Navegación</span>
            <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Inicio</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Películas</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Series</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Novedades Populares</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Mi Lista de Favoritos</Link>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface">Categorías</span>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Acción y Aventura</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Ciencia Ficción</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Dramas Premiados</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Documentales</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Cine Clásico e Indie</Link>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface">Soporte</span>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Centro de Ayuda</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Dispositivos Compatibles</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Control Parental</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Prueba de Velocidad</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Términos de Uso</Link>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface">Cuenta</span>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Mi Perfil</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Ajustes de Calidad</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Suscripción Premium</Link>
            <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Privacidad</Link>
          </div>
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-space-md">
            <span className="font-headline-md text-headline-md text-on-surface">Idioma / Región</span>
            <div className="inline-flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded-lg">
              <span className="material-symbols-outlined text-on-surface-variant select-none">translate</span>
              <select aria-label="Seleccionar idioma" className="bg-transparent text-on-surface font-body-md text-body-md outline-none cursor-pointer">
                <option className="bg-surface-container-high text-on-surface" value="es">Español</option>
                <option className="bg-surface-container-high text-on-surface" value="en">English</option>
                <option className="bg-surface-container-high text-on-surface" value="pt">Português</option>
              </select>
            </div>
            <div className="flex items-center gap-space-xs text-secondary font-label-badge text-label-badge tracking-widest uppercase">
              <span className="material-symbols-outlined text-secondary text-base">verified</span>
              <span>Ultra HD 4K & Atmos Habilitado</span>
            </div>
          </div>
        </div>
        <div className="pt-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs">
            <img 
              alt="CineStream Brand Logo" 
              className="h-6 w-auto object-contain opacity-70" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFVx0V1W8ztzEDXgLvrj4HXrnE9WG9LT35BW3Vf--E9b6sZke-clQKLk6WrpFLYVVKgipvm7HffdX31vR08l22OGpRyCFQhajDscukJnvU2UaHBQM-3dybV3eVWjRRnXL3_68rbMnNO8Tom_eHiZPhascTvyUoQM6Ct6Hnw_wWql2t3OJ2ruDHRJxdRk8lea0Rk6pGkWtPiaHwEsSEF9gqJhOcyiiSEVN-e3hk83uh8HHTw4V5pXnnrA"
            />
            <span className="font-body-md text-body-md text-on-surface-variant">© 2026 CineStream Entertainment Inc. Todos los derechos reservados.</span>
          </div>
          <div className="flex items-center gap-space-lg">
            <Link href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Privacidad</Link>
            <Link href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Aviso Legal</Link>
            <Link href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Preferencias de Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
