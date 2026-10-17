
const BASE_URL = "https://itunes.apple.com/search";

export async function searchSongs(searchTerm) {
  const params = new URLSearchParams({
    term: searchTerm || "popular music",
    entity: "song",
    limit: "24",
    country: "US",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Unable to fetch music.");
  }

  const data = await response.json();

  return data.results.filter(
    (song) => song.trackId && song.artworkUrl100
  );
}
