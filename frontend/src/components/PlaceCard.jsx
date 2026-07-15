import { useNavigate } from 'react-router-dom';

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
    rating,
    bestTime,
    description,
  } = place;

  const handleClick = () => navigate(`/places/${_id}`);

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
            {Number(rating).toFixed(1)}
          </span>
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
      </div>

      {/* Card body */}
      <div className="placecard__body">
        {/* Name row + rating (right-aligned) */}
        <div className="placecard__row placecard__row--between">
          <h3 className="placecard__name">{name}</h3>
          <span className="placecard__rating">
            <span className="placecard__star-icon">★</span>
            {Number(rating).toFixed(1)}
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
