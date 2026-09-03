export const getMyList = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('cinestream_my_list');
  return stored ? JSON.parse(stored) : [];
};

export const isInMyList = (movieId: string) => {
  const list = getMyList();
  return list.some((item: any) => item.id === movieId);
};

export const addToMyList = (movie: any, tmdbData?: any) => {
  const list = getMyList();
  if (!list.some((item: any) => item.id === movie.id)) {
    list.unshift({
      id: movie.id,
      name: movie.name,
      thumbnailLink: movie.thumbnailLink,
      mimeType: movie.mimeType,
      tmdbData: tmdbData || null,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('cinestream_my_list', JSON.stringify(list));
    
    // Disparar evento personalizado para que otros componentes se actualicen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cinestream_list_updated'));
    }
  }
};

export const removeFromMyList = (movieId: string) => {
  const list = getMyList();
  const newList = list.filter((item: any) => item.id !== movieId);
  localStorage.setItem('cinestream_my_list', JSON.stringify(newList));
  
  // Disparar evento personalizado
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cinestream_list_updated'));
  }
};

export const toggleMyList = (movie: any, tmdbData?: any) => {
  if (isInMyList(movie.id)) {
    removeFromMyList(movie.id);
    return false;
  } else {
    addToMyList(movie, tmdbData);
    return true;
  }
};
