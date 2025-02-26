import axios from 'axios';

const API_BASE_URL = 'https://api.jikan.moe/v4';

// Search manga by title
export const searchMangaByTitle = async (title: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manga`, {
      params: { q: title, limit: 10 }
    });

    return response.data.data.map((manga: any) => ({
      id: manga.mal_id,
      title: manga.title,
      description: manga.synopsis || 'No description available',
      coverImage: manga.images.jpg.image_url,
      publishedFrom: manga.published.from,
      score: manga.score,
    }));
  } catch (error) {
    console.error('Error searching manga:', error);
    throw new Error('Failed to search manga');
  }
};

// Get manga by MAL ID
export const getMangaById = async (mangaId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manga/${mangaId}`);
    const manga = response.data.data;

    return {
      id: manga.mal_id,
      title: manga.title,
      description: manga.synopsis || 'No description available',
      coverImage: manga.images.jpg.image_url,
      publishedFrom: manga.published.from,
      score: manga.score,
    };
  } catch (error) {
    console.error('Error fetching manga by ID:', error);
    throw new Error('Failed to fetch manga details');
  }
};
