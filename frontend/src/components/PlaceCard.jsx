import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

/**
 * PlaceCard — reusable card for a tourist place.
 *
 * Props:
 *   place   {object}  — the place document from the API
 *   variant {"grid" | "featured"}
 *             "grid"     → Explore Places card (default)
 *             "featured" → Top Rated wide card with overlay rating badge
 */
export default function PlaceCard({ place, variant = 'grid' }) {
  const navigate = useNavigate();

  if (!place) return null;

  const {
    _id,
    name,
    state,
    image,
    averageRating,
    bestTime,
    description,
  } = place;

  const { isAuthenticated, user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (user?.wishlist?.includes(_id)) {
      setIsWishlisted(true);
    }
  }, [user, _id]);

  const handleClick = () => navigate(`/places/${_id}`);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${_id}`);
        setIsWishlisted(false);
      } else {
        await api.post(`/wishlist/${_id}`);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Render star rating ──────────────────────────────────────────
  const renderStars = (value) => {
    const full  = Math.floor(value);
    const half  = value - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span className="placecard__stars" aria-label={`Rating: ${value} out of 5`}>
        {'★'.repeat(full)}
        {half && <span className="placecard__star--half">★</span>}
        {'☆'.repeat(empty)}
      </span>
    );
  };

  // ── FEATURED variant (Top Rated horizontal card) ─────────────────
  if (variant === 'featured') {
    return (
      <article
        className="placecard placecard--featured"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label={`View details for ${name}`}
      >
        {/* Image with overlay rating badge */}
        <div className="placecard__img-wrap placecard__img-wrap--featured">
          <img
            src={image}
            alt={name}
            className="placecard__img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80';
            }}
          />
          {/* Rating pill overlay — top-left */}
          <span className="placecard__rating-overlay">
            <span className="placecard__star-icon">★</span>
            {Number(averageRating).toFixed(1)}
          </span>
          {isAuthenticated && (
            <button 
              className="placecard__wishlist-btn" 
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: isWishlisted ? '#ef4444' : '#64748b'
              }}
            >
              <HeartIcon filled={isWishlisted} />
            </button>
          )}
        </div>

        {/* Card body */}
        <div className="placecard__body placecard__body--featured">
          <div className="placecard__row placecard__row--between">
            <h3 className="placecard__name">{name}</h3>
            <span className="placecard__state-inline">{state}</span>
          </div>

          {description && (
            <p className="placecard__desc">{description}</p>
          )}

          <div className="placecard__footer">
            <span className="placecard__best-time">
              <CalendarIcon />
              Best time: {bestTime}
            </span>
          </div>
        </div>
      </article>
    );
  }

  // ── GRID variant (Explore Places card — default) ─────────────────
  return (
    <article
      className="placecard placecard--grid"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View details for ${name}`}
    >
      {/* Full-bleed image */}
      <div className="placecard__img-wrap">
        <img
          src={image}
          alt={name}
          className="placecard__img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80';
          }}
        />
        {isAuthenticated && (
          <button 
            className="placecard__wishlist-btn" 
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              color: isWishlisted ? '#ef4444' : '#64748b'
            }}
          >
            <HeartIcon filled={isWishlisted} />
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="placecard__body">
        {/* Name row + rating (right-aligned) */}
        <div className="placecard__row placecard__row--between">
          <h3 className="placecard__name">{name}</h3>
          <span className="placecard__rating">
            <span className="placecard__star-icon">★</span>
            {Number(averageRating).toFixed(1)}
          </span>
        </div>

        {/* State badge */}
        <span className="placecard__state-badge">{state}</span>

        {/* Footer: best time + arrow */}
        <div className="placecard__footer">
          <span className="placecard__best-time">
            <CalendarIcon />
            Best time: {bestTime}
          </span>
          <span className="placecard__arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </article>
  );
}

/* ── Inline SVG icon (calendar/clock) ───────────────────────────── */
function CalendarIcon() {
  return (
    <svg
      className="placecard__icon"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1 7h14" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
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
      width="18" 
      height="18"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
