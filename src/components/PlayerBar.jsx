
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

export default function PlayerBar({
  song,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
}) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !song?.previewUrl) return;

    audio.load();
    setProgress(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch(() => {
        // Playback may be blocked or unavailable.
      });
    }
  }, [song?.previewUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && song?.previewUrl) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, song?.previewUrl]);

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  function seek(event) {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const nextTime = Number(event.target.value);

    audio.currentTime = nextTime;
    setProgress(nextTime);
  }

  return (
    <footer className="player-bar">
      <div className="player-song">
        {song ? (
          <>
            <img
              src={song.artworkUrl100}
              alt=""
            />
            <div className="player-song-info">
              <strong>{song.trackName}</strong>
              <span>{song.artistName}</span>
            </div>
          </>
        ) : (
          <div className="player-song-info">
            <strong>Select a song</strong>
            <span>Your next favourite is waiting.</span>
          </div>
        )}
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button
            type="button"
            aria-label="Previous song"
            onClick={onPrevious}
          >
            <SkipBack size={20} />
          </button>

          <button
            className="main-play-button"
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={!song?.previewUrl}
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            aria-label="Next song"
            onClick={onNext}
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="progress-row">
          <span>{formatTime(progress)}</span>

          <input
            aria-label="Song progress"
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(progress, duration || 0)}
            onChange={seek}
          />

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="volume-control">
        <Volume2 size={19} />
        <span>Preview</span>
      </div>

      <audio
        ref={audioRef}
        src={song?.previewUrl || undefined}
        onTimeUpdate={(event) =>
          setProgress(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration || 0)
        }
        onEnded={onNext}
      />
    </footer>
  );
}
