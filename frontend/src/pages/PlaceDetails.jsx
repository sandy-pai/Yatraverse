import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function PlaceDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [place,   setPlace]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error,   setError]   = useState('');
  
  const { isAuthenticated, user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (user?.wishlist?.includes(id)) {
      setIsWishlisted(true);
    }
  }, [user, id]);

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
      } else {
        await api.post(`/wishlist/${id}`);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError('');
        setNotFound(false);
        const { data } = await api.get(`/places/${id}`);
        setPlace(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Something went wrong. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="pd">
        <div className="pd__hero-skeleton" aria-hidden="true" />
        <div className="pd__body">
          <div className="pd__skeleton-line pd__skeleton-line--title" />
          <div className="pd__skeleton-line pd__skeleton-line--sub" />
          <div className="pd__skeleton-line pd__skeleton-line--text" />
          <div className="pd__skeleton-line pd__skeleton-line--text" />
        </div>
      </main>
    );
  }

  // ── 404 / Not Found ──────────────────────────────────────────────
  if (notFound) {
    return (
      <main className="pd pd--error-page">
        <div className="pd__not-found">
          <span className="pd__not-found-icon">🗺️</span>
          <h1>Tourist Place Not Found</h1>
          <p>The place you're looking for doesn't exist or has been removed.</p>
          <button className="pd__back-link" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  // ── Generic error ────────────────────────────────────────────────
  if (error) {
    return (
      <main className="pd pd--error-page">
        <div className="pd__not-found">
          <span className="pd__not-found-icon">⚠️</span>
          <h1>Oops!</h1>
          <p>{error}</p>
          <button className="pd__back-link" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  if (!place) return null;

  const {
    name,
    state,
    city,
    image,
    averageRating = 0,
    ratings = [],
    bestTime,
    entryFee,
    description,
    location,
  } = place;

  const mapsQuery = encodeURIComponent(location || `${city}, ${state}`);
  const mapsUrl   = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <main className="pd">

      {/* ══ HERO IMAGE ══════════════════════════════════════════════ */}
      <div className="pd__hero">
        <img
          src={image}
          alt={name}
          className="pd__hero-img"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80';
          }}
        />

        {/* Back button — floating over image */}
        <button
          className="pd__fab pd__fab--back"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeftIcon />
        </button>

        {/* Share button — floating over image */}
        <div className="pd__fab-group">
          <button
            className="pd__fab"
            aria-label="Share"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            <ShareIcon />
          </button>
          
          {isAuthenticated && (
            <button
              className="pd__fab"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={toggleWishlist}
              style={{ color: isWishlisted ? '#ef4444' : 'currentColor' }}
            >
              <HeartIcon filled={isWishlisted} />
            </button>
          )}
        </div>
      </div>

      {/* ══ MAIN CONTENT ════════════════════════════════════════════ */}
      <div className="pd__body">

        {/* ── Left column ── */}
        <div className="pd__left">

          {/* Name card — overlaps image */}
          <div className="pd__name-card">
            <div className="pd__name-row">
              <h1 className="pd__title">{name}</h1>
            </div>

            <div className="pd__meta-row">
              <span className="pd__location-pin">
                <PinIcon />
                {state}{city ? `, ${city}` : ''}
              </span>
              <div className="pd__badges">
                {state && (
                  <span className="pd__tag">{state}</span>
                )}
                <span className="pd__rating">
                  <span className="pd__star">★</span>
                  {Number(averageRating).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* About section */}
          <section className="pd__about" aria-labelledby="about-heading">
            <h2 id="about-heading" className="pd__about-title">About this place</h2>
            <p className="pd__description">{description}</p>
          </section>

          {/* All details — spec required fields */}
          <section className="pd__details-list" aria-label="Place details">
            <DetailRow icon={<CityIcon />}     label="City"           value={city} />
            <DetailRow icon={<StateIcon />}    label="State"          value={state} />
            <DetailRow icon={<LocationIcon />} label="Location"       value={location} />
            <DetailRow icon={<TimeIcon />}     label="Best Time"      value={bestTime} />
            <DetailRow icon={<TicketIcon />}   label="Entry Fee"      value={`₹${entryFee}`} />
            <DetailRow icon={<StarIcon />}     label="Rating"         value={`${Number(averageRating).toFixed(1)} ⭐`} />
          </section>

          {/* Interactive Rating for Logged-in Users */}
          {isAuthenticated && (
            <section className="pd__rate-section" aria-labelledby="rate-heading" style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 id="rate-heading" className="pd__about-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Rate this place</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Click a star to submit your rating.</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(val => {
                  // user._id or user.id depending on what backend returns for session user, default to user._id
                  const userId = user?._id || user?.id;
                  const currentVal = ratings?.find(r => r.user === userId)?.value || 0;
                  return (
                    <button
                      key={val}
                      onClick={async () => {
                        try {
                          await api.post(`/places/${id}/rate`, { value: val });
                          const { data } = await api.get(`/places/${id}`);
                          setPlace(data);
                        } catch (err) {
                          console.error(err);
                          alert('Failed to submit rating');
                        }
                      }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem',
                        color: currentVal >= val ? '#fbbf24' : '#cbd5e1',
                        transition: 'transform 0.2s', padding: 0,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      aria-label={`Rate ${val} stars`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="pd__right">

          {/* Info tiles */}
          <div className="pd__info-tiles">
            <div className="pd__tile">
              <span className="pd__tile-icon"><SunIcon /></span>
              <span className="pd__tile-label">Best Time to Visit</span>
              <span className="pd__tile-value">{bestTime}</span>
            </div>
            <div className="pd__tile">
              <span className="pd__tile-icon"><TicketIconSm /></span>
              <span className="pd__tile-label">Entry Fee</span>
              <span className="pd__tile-value">₹{entryFee}<small>/person</small></span>
            </div>
          </div>

          {/* Map thumbnail */}
          <div className="pd__map-card">
            <div className="pd__map-thumb" aria-label="Map preview">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${mapsQuery}&zoom=12&size=300x140&scale=2&style=feature:all|element:labels.icon|visibility:off&key=`}
                alt="Map"
                className="pd__map-img"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="pd__map-overlay">
                <MapPinIcon />
                <span>Location Map</span>
              </div>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pd__map-link"
            >
              View in Maps ↗
            </a>
          </div>

          {/* CTA */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pd__cta-btn"
            aria-label="Plan your visit"
          >
            Plan Your Visit
          </a>
        </div>
      </div>

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

/* ── Small helper ──────────────────────────────────────────────── */
function DetailRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="pd__detail-row">
      <span className="pd__detail-icon">{icon}</span>
      <span className="pd__detail-label">{label}</span>
      <span className="pd__detail-value">{value}</span>
    </div>
  );
}

/* ── Inline SVG icons ──────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="14" height="14">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}
function TicketIconSm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9v6a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
      <path d="M9 9v6M15 9v6"/>
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}
function CityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="10" height="15"/><rect x="12" y="3" width="10" height="19"/>
      <path d="M6 11v.01M6 15v.01M16 7v.01M16 11v.01M16 15v.01"/>
    </svg>
  );
}
function StateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}
function TimeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9v6a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
      <path d="M9 9v6M15 9v6"/>
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round" 
      width="20" 
      height="20"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
