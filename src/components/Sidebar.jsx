
import {
  Home,
  Search,
  Library,
  Heart,
  Music2,
} from "lucide-react";

const links = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "library", label: "Your Library", icon: Library },
  { id: "liked", label: "Liked Songs", icon: Heart },
];

export default function Sidebar({ activeTab, onNavigate }) {
  return (
    <aside className="sidebar">
      <a
        className="brand"
        href="#home"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("home");
        }}
      >
        <span className="brand-icon">
          <Music2 size={24} />
        </span>
        <span>SoundWave</span>
      </a>

      <p className="sidebar-label">YOUR MUSIC</p>

      <nav className="sidebar-nav">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`nav-item ${
              activeTab === id ? "active" : ""
            }`}
            onClick={() => onNavigate(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <p>Made for music lovers.</p>
        <span>Discover your sound.</span>
      </div>
    </aside>
  );
}
