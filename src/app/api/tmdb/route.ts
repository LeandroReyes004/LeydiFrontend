import { NextResponse } from 'next/server';
import { cleanMovieTitle } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  if (!TMDB_API_KEY || TMDB_API_KEY === 'AQUI_TU_API_KEY') {
    return NextResponse.json({ error: 'No TMDB API key configured' }, { status: 404 });
  }

  const cleanTitle = cleanMovieTitle(filename);
  if (!cleanTitle) {
    return NextResponse.json({ error: 'Could not clean title' }, { status: 400 });
  }

  try {
    const isV4Token = TMDB_API_KEY.includes('.');
    const url = isV4Token 
      ? `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(cleanTitle)}&language=es-ES&page=1`
      : `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=es-ES&page=1`;

    const headers = new Headers();
    headers.append('accept', 'application/json');
    if (isV4Token) {
      headers.append('Authorization', `Bearer ${TMDB_API_KEY}`);
    }

    const res = await fetch(url, { headers });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: res.status });
    }
    
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const bestMatch = data.results.find((item: any) => item.media_type === 'movie' || item.media_type === 'tv') || data.results[0];
      const mediaType = bestMatch.media_type || 'movie';
      const id = bestMatch.id;

      // 2nd Request: Fetch full details including cast and videos
      const detailsUrl = isV4Token
        ? `${TMDB_BASE_URL}/${mediaType}/${id}?language=es-ES&append_to_response=credits,videos`
        : `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos`;
        
      try {
        const detailsRes = await fetch(detailsUrl, { headers });
        if (detailsRes.ok) {
          const detailsData = await detailsRes.json();
          
          return NextResponse.json({
            id: id,
            title: detailsData.title || detailsData.name,
            overview: detailsData.overview,
            posterPath: detailsData.poster_path ? `https://image.tmdb.org/t/p/w500${detailsData.poster_path}` : null,
            backdropPath: detailsData.backdrop_path ? `https://image.tmdb.org/t/p/original${detailsData.backdrop_path}` : null,
            voteAverage: detailsData.vote_average,
            releaseDate: detailsData.release_date || detailsData.first_air_date,
            mediaType: mediaType,
            runtime: detailsData.runtime || (detailsData.episode_run_time && detailsData.episode_run_time[0]),
            genres: detailsData.genres,
            credits: detailsData.credits,
            videos: detailsData.videos
          });
        }
      } catch (e) {
        console.error("Failed to fetch TMDB details, falling back to basic data", e);
      }
      
      // Fallback to basic search data if details fetch fails
      return NextResponse.json({
        id: bestMatch.id,
        title: bestMatch.title || bestMatch.name,
        overview: bestMatch.overview,
        posterPath: bestMatch.poster_path ? `https://image.tmdb.org/t/p/w500${bestMatch.poster_path}` : null,
        backdropPath: bestMatch.backdrop_path ? `https://image.tmdb.org/t/p/original${bestMatch.backdrop_path}` : null,
        voteAverage: bestMatch.vote_average,
        releaseDate: bestMatch.release_date || bestMatch.first_air_date,
        mediaType: mediaType
      });
    } else {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }
  } catch (error) {
    console.error("TMDB proxy error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
