
import { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";

import Sidebar from "./components/Sidebar";
import SongCard from "./components/SongCard";
import PlayerBar from "./components/PlayerBar";
import { searchSongs } from "./services/musicApi";

import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("soundwave-likes")) || [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState("home");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadSongs("popular music");
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "soundwave-likes",
      JSON.stringify(likedSongs)
    );
  }, [likedSongs]);

  async function loadSongs(term) {
    setLoading(true);
    setError("");

    try {
      const results = await searchSongs(term);
      setSongs(results);

      if (results.length === 0) {
        setError("No songs found. Try another search.");
      }
    } catch (err) {
      setError("Could not load music. Check your connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();

    const term = searchInput.trim();
    if (!term) return;

    setActiveTab("search");
    loadSongs(term);
  }

  function toggleLike(song) {
    setLikedSongs((previous) => {
      const alreadyLiked = previous.some(
        (item) => item.trackId === song.trackId
      );

      if (alreadyLiked) {
        return previous.filter(
          (item) => item.trackId !== song.trackId
        );
      }

      return [...previous, song];
    });
  }

  function playSong(song) {
    setCurrentSong(song);
    setIsPlaying(Boolean(song.previewUrl));
  }

  const visibleSongs =
    activeTab === "liked" ? likedSongs : songs;

  function playAdjacentSong(direction) {
    if (!visibleSongs.length) return;

    const currentIndex = visibleSongs.findIndex(
      (song) => song.trackId === currentSong?.trackId
    );

    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + visibleSongs.length) %
          visibleSongs.length;

    playSong(visibleSongs[nextIndex]);
  }

  const sectionTitle = {
    home: "Trending songs",
    search: "Search results",
    library: "Your music library",
    liked: "Liked songs",
  }[activeTab];

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      <main className="main-area">
        <header className="top-header">
          <form className="search-form" onSubmit={handleSearch}>
            <Search size={19} />

            <input
              type="search"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search songs, artists..."
              aria-label="Search songs and artists"
            />

            <button type="submit">Search</button>
          </form>

          <button
            className="icon-button notification-button"
            type="button"
            aria-label="Notifications"
            title="Notifications are not configured"
          >
            <Bell size={20} />
          </button>
        </header>

        {activeTab === "home" && (
          <section className="hero-banner">
            <div className="hero-content">
              <span className="eyebrow">YOUR DAILY SOUNDTRACK</span>
              <h1>Discover your next favourite song.</h1>
              <p>
                Explore music, find new artists, and follow
                the sound that moves you.
              </p>

              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  setActiveTab("search");
                  document.querySelector(".search-form input")?.focus();
                }}
              >
                Explore music <span>→</span>
              </button>
            </div>
          </section>
        )}

        <section className="music-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                {activeTab === "liked"
                  ? "YOUR COLLECTION"
                  : "MADE FOR YOU"}
              </span>
              <h2>{sectionTitle}</h2>
            </div>

            <span className="song-count">
              {visibleSongs.length} songs
            </span>
          </div>

          {loading && activeTab !== "liked" && (
            <p className="status-message">Loading your music...</p>
          )}

          {!loading && error && activeTab !== "liked" && (
            <div className="status-message error-message">
              <p>{error}</p>
              <button
                className="secondary-button"
                onClick={() => loadSongs("popular music")}
                type="button"
              >
                Try again
              </button>
            </div>
          )}

          {activeTab === "liked" && likedSongs.length === 0 && (
            <p className="status-message">
              You haven't liked any songs yet. Press the heart on a song
              to save it here.
            </p>
          )}

          {!loading &&
            !(error && activeTab !== "liked") &&
            visibleSongs.length > 0 && (
              <div className="song-grid">
                {visibleSongs.map((song) => (
                  <SongCard
                    key={song.trackId}
                    song={song}
                    isLiked={likedSongs.some(
                      (item) => item.trackId === song.trackId
                    )}
                    onToggleLike={toggleLike}
                    onPlay={playSong}
                  />
                ))}
              </div>
            )}
        </section>

        <footer className="app-footer">
          Music discovery powered by the iTunes Search API.
        </footer>
      </main>

      <PlayerBar
        song={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((playing) => !playing)}
        onNext={() => playAdjacentSong(1)}
        onPrevious={() => playAdjacentSong(-1)}
      />
    </div>
  );
}

export default App;
