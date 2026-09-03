import { NextResponse } from 'next/server';
import { cleanMovieTitle } from '@/lib/tmdb';

const ROOT_DRIVE_FOLDER_ID = "14cNucDHdxuThs5OuJok_jSgWbzKuS3oA";
// Revalidar este endpoint cada hora (3600 segundos) en Vercel
export const revalidate = 3600;

export async function GET() {
  try {
    // 1. Fetch files from DigitalOcean Backend
    const driveRes = await fetch(`http://134.209.74.99:3000/api/movies/${ROOT_DRIVE_FOLDER_ID}`, {
      next: { revalidate: 3600 }
    });
    
    if (!driveRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Drive Backend' }, { status: 500 });
    }
    
    const driveFiles = await driveRes.json();
    const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const isV4Token = TMDB_API_KEY?.includes('.');
    
    const headers = new Headers();
    headers.append('accept', 'application/json');
    if (isV4Token && TMDB_API_KEY) {
      headers.append('Authorization', `Bearer ${TMDB_API_KEY}`);
    }

    // 2. Fetch TMDB data for each valid file
    const catalogPromises = driveFiles.map(async (item: any) => {
      // Ignorar portadas y otras basuras
      if (item.name.toLowerCase().includes('portada')) return null;
      if (item.mimeType?.startsWith('image/')) return null;

      const cleanTitle = cleanMovieTitle(item.name);
      if (!cleanTitle || !TMDB_API_KEY || TMDB_API_KEY === 'AQUI_TU_API_KEY') {
        return { ...item, tmdbData: null };
      }

      try {
        const searchUrl = isV4Token 
          ? `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(cleanTitle)}&language=es-ES&page=1`
          : `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=es-ES&page=1`;

        const searchRes = await fetch(searchUrl, { headers });
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.results && searchData.results.length > 0) {
            const bestMatch = searchData.results.find((i: any) => i.media_type === 'movie' || i.media_type === 'tv') || searchData.results[0];
            const mediaType = bestMatch.media_type || 'movie';
            
            // Fetch full details to get genres
            const detailsUrl = isV4Token
              ? `${TMDB_BASE_URL}/${mediaType}/${bestMatch.id}?language=es-ES`
              : `${TMDB_BASE_URL}/${mediaType}/${bestMatch.id}?api_key=${TMDB_API_KEY}&language=es-ES`;
              
            const detailsRes = await fetch(detailsUrl, { headers });
            if (detailsRes.ok) {
              const detailsData = await detailsRes.json();
              return {
                ...item,
                tmdbData: {
                  id: bestMatch.id,
                  title: detailsData.title || detailsData.name,
                  mediaType: mediaType,
                  genres: detailsData.genres || [],
                  posterPath: detailsData.poster_path ? `https://image.tmdb.org/t/p/w500${detailsData.poster_path}` : null,
                  backdropPath: detailsData.backdrop_path ? `https://image.tmdb.org/t/p/original${detailsData.backdrop_path}` : null,
                }
              };
            }
          }
        }
      } catch (e) {
        console.error(`Error fetching TMDB for ${item.name}:`, e);
      }
      
      // Fallback si falla TMDB
      return { ...item, tmdbData: null };
    });

    const catalogResults = await Promise.all(catalogPromises);
    const finalCatalog = catalogResults.filter(Boolean); // Eliminar los nulls (portadas)

    return NextResponse.json(finalCatalog);
    
  } catch (error) {
    console.error("Catalog proxy error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
