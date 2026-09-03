// Helper para limpiar el nombre del archivo y extraer el título
export function cleanMovieTitle(filename: string): string {
  // Eliminar extensiones
  let title = filename.replace(/\.[^/.]+$/, "");
  
  // Eliminar resoluciones, codecs y tags comunes (1080p, 720p, bluray, x264, latino, etc)
  const tagsToRemove = [
    /1080p/i, /720p/i, /480p/i, /4k/i, /2160p/i,
    /bluray/i, /blu-ray/i, /brrip/i, /bdrip/i,
    /web-dl/i, /webdl/i, /webrip/i, /hdtv/i,
    /x264/i, /h264/i, /x265/i, /hevc/i,
    /latino/i, /castellano/i, /dual/i, /audio/i,
    /espanol/i, /español/i, /subtitulado/i, /vose/i,
    /remastered/i, /extended/i, /uncut/i, /director.?s.?cut/i
  ];
  
  tagsToRemove.forEach(regex => {
    title = title.replace(regex, "");
  });

  // Intentar extraer el año (ej. 2021) para usarlo en la búsqueda si es necesario, 
  // pero por ahora simplemente lo eliminamos para limpiar el título principal.
  title = title.replace(/\b(19\d{2}|20\d{2})\b/g, "");

  // Reemplazar puntos, guiones o guiones bajos por espacios
  title = title.replace(/[._-]/g, " ");

  // Quitar cosas entre corchetes o paréntesis que queden
  title = title.replace(/\[.*?\]/g, "");
  title = title.replace(/\(.*?\)/g, "");

  // Eliminar espacios extra
  return title.trim();
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMovieData(filename: string) {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'AQUI_TU_API_KEY') {
    return null; // Si no hay API key, devolvemos null y usará lo que tenga de Google Drive
  }

  const cleanTitle = cleanMovieTitle(filename);
  if (!cleanTitle) return null;

  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=es-ES&page=1`
    );
    
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      // Tomar el primer resultado que sea película o serie de TV
      const bestMatch = data.results.find((item: any) => item.media_type === 'movie' || item.media_type === 'tv') || data.results[0];
      
      // Obtener el ID para buscar más detalles si quisiéramos, pero la búsqueda ya devuelve lo principal
      return {
        id: bestMatch.id,
        title: bestMatch.title || bestMatch.name,
        overview: bestMatch.overview,
        posterPath: bestMatch.poster_path ? `https://image.tmdb.org/t/p/w500${bestMatch.poster_path}` : null,
        backdropPath: bestMatch.backdrop_path ? `https://image.tmdb.org/t/p/original${bestMatch.backdrop_path}` : null,
        voteAverage: bestMatch.vote_average,
        releaseDate: bestMatch.release_date || bestMatch.first_air_date,
        mediaType: bestMatch.media_type || 'movie'
      };
    }
  } catch (error) {
    console.error("TMDB error:", error);
  }
  
  return null;
}
