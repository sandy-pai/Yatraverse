import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import logoImg from '../../design/yatraverse_logo.png';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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

          {isAuthenticated ? (
            <>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
              >
                Wishlist
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                >
                  Admin
                </NavLink>
              )}
              <div className="navbar__user">
                <span className="navbar__user-name">Hi, {user?.name}</span>
                <button onClick={handleLogout} className="navbar__logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar__link navbar__link--login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}