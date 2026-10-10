const API_URL = "http://localhost:8000/api";

export async function getPopularManga(limit = 10, page = 1) {
  try {
    const res = await fetch(`${API_URL}/manga/popular?limit=${limit}&page=${page}`, {
      next: { revalidate: 3600 }, // Cache untuk 1 jam
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch popular manga: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getPopularManga:", error);
    return { items: [], total_items: 0 };
  }
}

export async function searchManga(query: string, limit = 10) {
  try {
    const res = await fetch(`${API_URL}/manga/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Failed to search manga: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in searchManga:", error);
    return { items: [], total_items: 0 };
  }
}

export async function getMangaDetail(id: string) {
  try {
    const res = await fetch(`${API_URL}/manga/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to get manga detail: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getMangaDetail:", error);
    return null;
  }
}

export async function getMangaByCategory(categoryId: string, limit = 20, page = 1) {
  try {
    const res = await fetch(`${API_URL}/manga/categories/${categoryId}/mangas?limit=${limit}&page=${page}`);
    if (!res.ok) {
      throw new Error(`Failed to get manga by category: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getMangaByCategory:", error);
    return { items: [], total_items: 0 };
  }
}

export async function getMangaByAuthor(authorName: string, limit = 10) {
  try {
    const res = await fetch(`${API_URL}/manga/author/${encodeURIComponent(authorName)}/mangas?limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Failed to search manga by author: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getMangaByAuthor:", error);
    return { items: [], total_items: 0 };
  }
}

export async function getMangaRecommendations(id: string) {
  try {
    const res = await fetch(`${API_URL}/manga/${id}/recommendations`);
    if (!res.ok) {
      throw new Error(`Failed to get manga recommendations: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getMangaRecommendations:", error);
    return { items: [], total_items: 0 };
  }
}
