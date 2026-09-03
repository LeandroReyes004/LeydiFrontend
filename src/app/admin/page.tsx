"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AdminPage() {
  const [folderId, setFolderId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderId || !file) return;

    setStatus('uploading');
    setMessage('Subiendo archivo a Google Drive...');

    const formData = new FormData();
    formData.append('cover', file);

    try {
      const res = await fetch(`/backend/api/upload-cover/${folderId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Error al subir la imagen');
      }

      setStatus('success');
      setMessage('¡Portada subida exitosamente!');
      setFile(null); // Reset
      // we can optionally reset folderId, or keep it if they want to upload more
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Error desconocido');
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full pt-24 pb-16 bg-surface-container-lowest min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg bg-surface-container rounded-2xl p-8 shadow-2xl border border-surface-container-highest">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl text-primary-container">admin_panel_settings</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Panel de Administración</h1>
          </div>
          
          <p className="text-on-surface-variant font-body-md text-body-md mb-8">
            Sube una imagen de portada para una carpeta o película específica. 
            El archivo se llamará <code className="bg-surface-container-highest px-1 rounded">portada.jpg</code> (o png/webp) y CineStream lo detectará automáticamente.
          </p>

          <form onSubmit={handleUpload} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="folderId" className="font-title-sm text-title-sm text-on-surface">
                ID de la Carpeta (Google Drive)
              </label>
              <input 
                id="folderId"
                type="text" 
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                placeholder="Ej. 14cNucDHdxuThs5OuJok_jSgWbzKuS3oA"
                className="w-full bg-surface-container-highest border border-outline-variant outline-none focus:border-primary-container rounded-lg p-3 text-on-surface font-body-md transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="file" className="font-title-sm text-title-sm text-on-surface">
                Imagen de Portada
              </label>
              <input 
                id="file"
                type="file" 
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg p-3 text-on-surface font-body-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container/20 file:text-primary-container hover:file:bg-primary-container/30 transition-colors"
                required
              />
            </div>

            {status !== 'idle' && (
              <div className={`p-4 rounded-lg flex items-start gap-2 ${
                status === 'uploading' ? 'bg-secondary-container/20 text-secondary' :
                status === 'success' ? 'bg-tertiary-container/20 text-tertiary' :
                'bg-error-container/20 text-error'
              }`}>
                <span className="material-symbols-outlined mt-0.5">
                  {status === 'uploading' ? 'hourglass_empty' : status === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{message}</span>
              </div>
            )}

            <div className="flex gap-4 mt-2">
              <button 
                type="submit" 
                disabled={status === 'uploading'}
                className="flex-1 bg-primary-container hover:bg-primary-container/90 text-on-primary font-title-sm py-3 rounded-lg shadow-lg shadow-primary-container/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {status === 'uploading' ? 'Subiendo...' : 'Subir Portada'}
              </button>
              <Link href="/" className="flex-none flex items-center justify-center px-6 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm rounded-lg transition-all active:scale-95">
                Volver
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
