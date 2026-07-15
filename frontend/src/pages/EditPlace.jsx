import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const STATES = [
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

export default function EditPlace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    location: '',
    image: '',
    description: '',
    bestTime: '',
    entryFee: '',
    rating: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const { data } = await api.get(`/places/${id}`);
        setFormData({
          name: data.name || '',
          state: data.state || '',
          city: data.city || '',
          location: data.location || '',
          image: data.image || '',
          description: data.description || '',
          bestTime: data.bestTime || '',
          entryFee: data.entryFee !== undefined ? data.entryFee : '',
          rating: data.rating !== undefined ? data.rating : '',
        });
      } catch (err) {
        setServerError('Failed to load place details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Required field';
    if (!formData.state) newErrors.state = 'Required field';
    if (!formData.location.trim()) newErrors.location = 'Required field';
    if (!formData.image.trim()) newErrors.image = 'Required field';
    if (!formData.description.trim()) newErrors.description = 'Required field';
    if (!formData.bestTime.trim()) newErrors.bestTime = 'Required field';
    if (!formData.city.trim()) newErrors.city = 'Required field';

    if (formData.entryFee === '') {
      newErrors.entryFee = 'Required field';
    } else if (Number(formData.entryFee) < 0) {
      newErrors.entryFee = 'Cannot be negative';
    }

    if (formData.rating === '') {
      newErrors.rating = 'Required field';
    } else {
      const numRating = Number(formData.rating);
      if (numRating < 0 || numRating > 5) {
        newErrors.rating = 'Must be between 0 and 5';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.put(`/places/${id}`, {
        ...formData,
        entryFee: Number(formData.entryFee),
        rating: Number(formData.rating),
      });
      navigate('/admin');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update tourist place.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main className="edit-place"><div className="edit-place__loading">Loading...</div></main>;
  }

  return (
    <main className="edit-place">
      <div className="edit-place__container">
        <Link to="/admin" className="edit-place__back">
          <ArrowLeftIcon /> Back to Dashboard
        </Link>
        <div className="edit-place__header">
          <h1 className="edit-place__title">Edit Tourist Place</h1>
          <p className="edit-place__subtitle">Update the details for this destination.</p>
        </div>

        {serverError && <div className="edit-place__server-error">{serverError}</div>}

        <div className="edit-place__card">
          <form onSubmit={handleSubmit} className="edit-place__form">
            
            {/* Section: Core Details */}
            <div className="edit-place__section">
              <h2 className="edit-place__section-title">
                <BookIcon /> Core Details
              </h2>
              
              <div className="edit-place__row edit-place__row--2col">
                <div className="edit-place__group">
                  <label>Place Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="edit-place__error">{errors.name}</span>}
                </div>
                
                <div className="edit-place__group">
                  <label>State / Region</label>
                  <div className="edit-place__select-wrapper">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                    >
                      <option value="" disabled>Select State</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {errors.state && <span className="edit-place__error">{errors.state}</span>}
                </div>
              </div>

              <div className="edit-place__row edit-place__row--2col">
                <div className="edit-place__group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="edit-place__error">{errors.city}</span>}
                </div>
                <div className="edit-place__group">
                  <label>Best Time to Visit</label>
                  <input
                    type="text"
                    name="bestTime"
                    value={formData.bestTime}
                    onChange={handleChange}
                    className={errors.bestTime ? 'error' : ''}
                  />
                  {errors.bestTime && <span className="edit-place__error">{errors.bestTime}</span>}
                </div>
              </div>

              <div className="edit-place__row edit-place__row--3col">
                <div className="edit-place__group">
                  <label>Detailed Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={errors.location ? 'error' : ''}
                  />
                  {errors.location && <span className="edit-place__error">{errors.location}</span>}
                </div>
                <div className="edit-place__group">
                  <label>Entry Fee (₹)</label>
                  <input
                    type="number"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleChange}
                    className={errors.entryFee ? 'error' : ''}
                  />
                  {errors.entryFee && <span className="edit-place__error">{errors.entryFee}</span>}
                </div>
                <div className="edit-place__group">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className={errors.rating ? 'error' : ''}
                  />
                  {errors.rating && <span className="edit-place__error">{errors.rating}</span>}
                </div>
              </div>

              <div className="edit-place__group">
                <label>Description & Highlights</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="edit-place__error">{errors.description}</span>}
              </div>
            </div>

            {/* Section: Destination Media */}
            <div className="edit-place__section edit-place__section--media">
              <h2 className="edit-place__section-title">
                <CameraIcon /> Destination Media
              </h2>
              <div className="edit-place__group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={errors.image ? 'error' : ''}
                />
                {errors.image && <span className="edit-place__error">{errors.image}</span>}
                
                {formData.image && (
                  <div className="edit-place__img-preview">
                    <img
                      src={formData.image}
                      alt="Preview"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="edit-place__actions">
              <button
                type="button"
                className="edit-place__btn edit-place__btn--cancel"
                onClick={() => navigate('/admin')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="edit-place__btn edit-place__btn--submit"
                disabled={submitting}
              >
                <SaveIcon /> {submitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
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

// ── Icons ──────────────────────────────────────────────────────────
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="16" height="16">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  );
}
function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="16" height="16">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  );
}
