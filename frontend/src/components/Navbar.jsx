import { NavLink, Link } from 'react-router-dom';
import logoImg from '../../design/yatraverse_logo.png';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">

        {/* ── Left: Logo + Brand name ── */}
        <Link to="/" className="navbar__brand" aria-label="YatraVerse home">
          <img
            src={logoImg}
            alt="YatraVerse logo"
            className="navbar__logo-img"
          />
          <span className="navbar__title">YatraVerse</span>
        </Link>

        {/* ── Center: Nav links ── */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Home
          </NavLink>

          <a href="/#about" className="navbar__link">
            About Us
          </a>

          <a href="/#contact" className="navbar__link">
            Contact Us
          </a>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Admin
          </NavLink>
        </nav>

      </div>
    </header>
  );
}
