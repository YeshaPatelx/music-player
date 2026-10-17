
import { Heart, Play } from "lucide-react";

export default function SongCard({
  song,
  isLiked,
  onToggleLike,
  onPlay,
}) {
  const artwork = song.artworkUrl100?.replace(
    "100x100bb",
    "400x400bb"
  );

  return (
    <article className="song-card">
      <div className="artwork-wrap">
        <img
          className="song-artwork"
          src={artwork || song.artworkUrl100}
          alt={`${song.trackName} artwork`}
          loading="lazy"
        />

        <button
          className="play-overlay"
          type="button"
          aria-label={`Play preview of ${song.trackName}`}
          onClick={() => onPlay(song)}
        >
          <Play size={22} fill="currentColor" />
        </button>

        <button
          className={`like-button ${isLiked ? "liked" : ""}`}
          type="button"
          aria-label={
            isLiked ? "Remove from liked songs" : "Like song"
          }
          onClick={() => onToggleLike(song)}
        >
          <Heart
            size={19}
            fill={isLiked ? "currentColor" : "none"}
          />
        </button>
      </div>

      <h3 title={song.trackName}>{song.trackName}</h3>
      <p>{song.artistName}</p>
    </article>
  );
}
