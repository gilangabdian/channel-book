const API_URL = "http://localhost:8000/api";

export async function getPopularManga(limit = 10) {
  try {
    const res = await fetch(`${API_URL}/manga/popular?limit=${limit}`, {
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
