import { useState, useEffect, useCallback } from 'react';
import PlaceCard from '../components/PlaceCard';
import api from '../api';

const STATES = [
  'All',
  'Karnataka',
  'Kerala',
  'Tamil Nadu',
  'Goa',
  'Maharashtra',
  'Rajasthan',
  'Uttar Pradesh',
  'Himachal Pradesh',
  'West Bengal',
  'Gujarat',
];

const PAGE_SIZE = 6;

export default function Home() {
  // ── state ─────────────────────────────────────────────────────────
  const [searchInput, setSearchInput]   = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [places, setPlaces]             = useState([]);       // shown grid
  const [topRated, setTopRated]         = useState([]);       // top section
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [totalCount, setTotalCount]     = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFiltered, setIsFiltered]     = useState(false);    // true when search/filter active

  // ── fetch all places on mount (for Top Rated + initial grid) ──────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/places');
        const all = Array.isArray(data) ? data : [];
        // Top Rated: sort by rating desc, take top 4
        const sorted = [...all].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        setTopRated(sorted.slice(0, 4));
        setPlaces(all);
        setTotalCount(all.length);
        setIsFiltered(false);
      } catch {
        setError('Unable to load places. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Search handler ─────────────────────────────────────────────────
  const handleSearch = useCallback(async () => {
    const name  = searchInput.trim();
    const state = selectedState;

    setLoading(true);
    setError('');
    setVisibleCount(PAGE_SIZE);

    try {
      let data;

      if (name) {
        // search by name takes priority
        const res = await api.get(`/places/search?name=${encodeURIComponent(name)}`);
        data = Array.isArray(res.data) ? res.data : [];
        setIsFiltered(true);
      } else if (state !== 'All') {
        const res = await api.get(`/places/state/${encodeURIComponent(state)}`);
        data = Array.isArray(res.data) ? res.data : [];
        setIsFiltered(true);
      } else {
        const res = await api.get('/places');
        data = Array.isArray(res.data) ? res.data : [];
        setIsFiltered(false);
      }

      setPlaces(data);
      setTotalCount(data.length);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchInput, selectedState]);

  // ── Filter by state (dropdown change fires search immediately) ─────
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // Search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ── Load more ─────────────────────────────────────────────────────
  const handleLoadMore = () => {
    setVisibleCount((v) => v + PAGE_SIZE);
  };

  const visiblePlaces = places.slice(0, visibleCount);
  const hasMore       = visibleCount < places.length;

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <main className="home">

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="home__hero">
        <h1 className="home__hero-title">Discover India's Soul</h1>
        <p className="home__hero-sub">
          Explore carefully curated destinations, from ancient temples to serene
          backwaters. Find your next journey with YatraVerse.
        </p>

        {/* Search + filter row */}
        <div className="home__search-row" role="search">
          <input
            id="search-input"
            type="text"
            className="home__search-input"
            placeholder="Search by place name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search by place name"
          />

          <select
            id="state-filter"
            className="home__state-select"
            value={selectedState}
            onChange={handleStateChange}
            aria-label="Filter by state"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All States' : s}
              </option>
            ))}
          </select>

          <button
            id="search-btn"
            className="home__search-btn"
            onClick={handleSearch}
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </section>

      {/* ── Shared content wrapper ── */}
      <div className="home__content">

        {/* ══ ERROR ════════════════════════════════════════════════════ */}
        {error && (
          <div className="home__error" role="alert">{error}</div>
        )}

        {/* ══ TOP RATED — only on initial (unfiltered) view ════════════ */}
        {!isFiltered && !loading && topRated.length > 0 && (
          <section className="home__section" aria-labelledby="top-rated-heading">
            <div className="home__section-header">
              <h2 id="top-rated-heading" className="home__section-title">
                Top Rated Destinations
              </h2>
              <button
                className="home__view-all"
                onClick={() => {
                  const sorted = [...places].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                  setPlaces(sorted);
                  setIsFiltered(true);
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-label="View all top rated destinations"
              >
                View all
              </button>
            </div>

            <div className="home__featured-grid">
              {topRated.map((place) => (
                <PlaceCard key={place._id} place={place} variant="featured" />
              ))}
            </div>
          </section>
        )}

        {/* ══ EXPLORE PLACES ══════════════════════════════════════════ */}
        <section className="home__section" aria-labelledby="explore-heading">
          <div className="home__section-header">
            <h2 id="explore-heading" className="home__section-title">
              {isFiltered ? 'Search Results' : 'Explore Places'}
            </h2>
            {!loading && (
              <span className="home__count-badge" aria-live="polite">
                {totalCount} {totalCount === 1 ? 'place' : 'places'} found
              </span>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="home__grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="home__skeleton" aria-hidden="true" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && places.length === 0 && (
            <div className="home__empty" role="status">
              <span className="home__empty-icon">🔍</span>
              <p>No tourist places found.</p>
              {isFiltered && (
                <button
                  className="home__reset-btn"
                  onClick={async () => {
                    setSearchInput('');
                    setSelectedState('All');
                    setIsFiltered(false);
                    setVisibleCount(PAGE_SIZE);
                    const { data } = await api.get('/places');
                    const all = Array.isArray(data) ? data : [];
                    setPlaces(all);
                    setTotalCount(all.length);
                  }}
                >
                  Show all places
                </button>
              )}
            </div>
          )}

          {/* Cards grid */}
          {!loading && places.length > 0 && (
            <>
              <div className="home__grid">
                {visiblePlaces.map((place) => (
                  <PlaceCard key={place._id} place={place} variant="grid" />
                ))}
              </div>

              {hasMore && (
                <div className="home__load-more-wrap">
                  <button
                    className="home__load-more-btn"
                    onClick={handleLoadMore}
                  >
                    Load More Destinations
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* ══ ABOUT US ════════════════════════════════════════════════ */}
      <section id="about" className="home__info-section home__about">
        <div className="home__info-container">
          <h2 className="home__info-title">About Us</h2>
          <p className="home__info-text">
            YatraVerse is your ultimate companion to discovering the magical beauty of India. 
            We are dedicated to bringing you curated travel experiences, hidden gems, and 
            detailed insights into the country's most enchanting destinations. Whether you 
            seek adventure, peace, or historical wonders, we help you plan the perfect journey.
          </p>
        </div>
      </section>

      {/* ══ CONTACT US ══════════════════════════════════════════════ */}
      <section id="contact" className="home__info-section home__contact">
        <div className="home__info-container">
          <h2 className="home__info-title">Contact Us</h2>
          <p className="home__info-text">
            Have questions or need help planning your trip? We'd love to hear from you.
          </p>
          <div className="home__contact-cards">
            <div className="home__contact-card">
              <h3>Email</h3>
              <p>support@yatraverse.in</p>
            </div>
            <div className="home__contact-card">
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
            <div className="home__contact-card">
              <h3>Office</h3>
              <p>Bangalore, Karnataka, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="home__footer">
        <span className="home__footer-brand">YatraVerse</span>
        <span className="home__footer-copy">© 2024 YatraVerse. Exploring India's Soul.</span>
        <nav className="home__footer-links" aria-label="Footer navigation">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact Us</a>
        </nav>
      </footer>

    </main>
  );
}
