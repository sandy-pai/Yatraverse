import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function AddPlace() {
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

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
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

    // Entry Fee validation (must not be empty, must be >= 0)
    if (formData.entryFee === '') {
      newErrors.entryFee = 'Required field';
    } else if (Number(formData.entryFee) < 0) {
      newErrors.entryFee = 'Cannot be negative';
    }

    // Rating validation (must not be empty, must be 0-5)
    if (formData.rating === '') {
      newErrors.rating = 'Required field';
    } else {
      const numRating = Number(formData.rating);
      if (numRating < 0 || numRating > 5) {
        newErrors.rating = 'Must be between 0 and 5';
      }
    }

    // City is optional per spec, but let's make it optional. Wait, spec says:
    // "Do not allow - Empty Place Name - Empty Description - Empty State - Empty Image URL - Empty Best Time - Negative Entry Fee - Rating greater than 5 - Rating less than 0". City/Location not strictly forbidden empty in validation list, but location has required error in mockup. I'll require location, but keep city optional or required based on the mockup. In mockup city has required error? Actually, looking at the mockup, City has "Required field" in red underneath it. So I'll require city too.
    if (!formData.city.trim()) newErrors.city = 'Required field';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/places', {
        ...formData,
        entryFee: Number(formData.entryFee),
        rating: Number(formData.rating),
      });
      navigate('/admin');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to add tourist place.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="add-place">
      <div className="add-place__container">
        <div className="add-place__header">
          <h1 className="add-place__title">Add Tourist Place</h1>
          <p className="add-place__subtitle">
            Expand our horizons by contributing a new destination. Provide
            accurate details to help travelers discover the beauty of India.
          </p>
        </div>

        {serverError && <div className="add-place__server-error">{serverError}</div>}

        <div className="add-place__card">
          <form onSubmit={handleSubmit} className="add-place__form">
            
            {/* Row 1: Place Name */}
            <div className="add-place__form-group">
              <label>Place Name</label>
              <div className={`add-place__input-wrapper ${errors.name ? 'add-place__input-wrapper--error' : ''}`}>
                <span className="add-place__input-icon"><MountainIcon /></span>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Taj Mahal"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <div className="add-place__error-text"><ErrorIcon /> {errors.name}</div>}
            </div>

            {/* Row 2: State and City */}
            <div className="add-place__form-row add-place__form-row--2col">
              <div className="add-place__form-group">
                <label>State</label>
                <div className={`add-place__input-wrapper ${errors.state ? 'add-place__input-wrapper--error' : ''}`}>
                  <span className="add-place__input-icon"><MapFoldIcon /></span>
                  <select name="state" value={formData.state} onChange={handleChange}>
                    <option value="" disabled>Select State</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {errors.state && <div className="add-place__error-text"><ErrorIcon /> {errors.state}</div>}
              </div>

              <div className="add-place__form-group">
                <label>City</label>
                <div className={`add-place__input-wrapper ${errors.city ? 'add-place__input-wrapper--error' : ''}`}>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g., Agra"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                {errors.city && <div className="add-place__error-text"><ErrorIcon /> {errors.city}</div>}
              </div>
            </div>

            {/* Row 3: Detailed Location */}
            <div className="add-place__form-group">
              <label>Detailed Location</label>
              <div className={`add-place__input-wrapper ${errors.location ? 'add-place__input-wrapper--error' : ''}`}>
                <span className="add-place__input-icon"><PinMapIcon /></span>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Dharmapuri, Forest Colony, Tajganj"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              {errors.location && <div className="add-place__error-text"><ErrorIcon /> {errors.location}</div>}
            </div>

            {/* Row 4: Featured Image URL */}
            <div className="add-place__form-group">
              <label>Featured Image URL</label>
              <div className={`add-place__input-wrapper ${errors.image ? 'add-place__input-wrapper--error' : ''}`}>
                <span className="add-place__input-icon"><ImageIcon /></span>
                <input
                  type="text"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
              {errors.image && <div className="add-place__error-text"><ErrorIcon /> {errors.image}</div>}
            </div>

            {/* Row 5: Description */}
            <div className="add-place__form-group">
              <label>Description</label>
              <div className={`add-place__input-wrapper add-place__textarea-wrapper ${errors.description ? 'add-place__input-wrapper--error' : ''}`}>
                <textarea
                  name="description"
                  placeholder="Describe the atmosphere, historical significance, or key attractions..."
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              {errors.description && <div className="add-place__error-text"><ErrorIcon /> {errors.description}</div>}
            </div>

            {/* Row 6: Best Time, Entry Fee, Rating */}
            <div className="add-place__form-row add-place__form-row--3col">
              <div className="add-place__form-group">
                <label>Best Time to Visit</label>
                <div className={`add-place__input-wrapper ${errors.bestTime ? 'add-place__input-wrapper--error' : ''}`}>
                  <input
                    type="text"
                    name="bestTime"
                    placeholder="e.g., Oct-Mar"
                    value={formData.bestTime}
                    onChange={handleChange}
                  />
                </div>
                {errors.bestTime && <div className="add-place__error-text"><ErrorIcon /> {errors.bestTime}</div>}
              </div>

              <div className="add-place__form-group">
                <label>Entry Fee (₹)</label>
                <div className={`add-place__input-wrapper ${errors.entryFee ? 'add-place__input-wrapper--error' : ''}`}>
                  <input
                    type="number"
                    name="entryFee"
                    placeholder="0"
                    value={formData.entryFee}
                    onChange={handleChange}
                  />
                </div>
                {errors.entryFee && <div className="add-place__error-text"><ErrorIcon /> {errors.entryFee}</div>}
              </div>

              <div className="add-place__form-group">
                <label>Rating (0 - 5)</label>
                <div className={`add-place__input-wrapper ${errors.rating ? 'add-place__input-wrapper--error' : ''}`}>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    placeholder="4.5"
                    value={formData.rating}
                    onChange={handleChange}
                  />
                </div>
                {errors.rating && <div className="add-place__error-text"><ErrorIcon /> {errors.rating}</div>}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="add-place__actions">
              <button
                type="button"
                className="add-place__btn add-place__btn--cancel"
                onClick={() => navigate('/admin')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="add-place__btn add-place__btn--submit"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Place ➔'}
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

function MountainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function MapFoldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
      <line x1="8" y1="2" x2="8" y2="18"></line>
      <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
  );
}

function PinMapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: '12px', height: '12px', verticalAlign: 'middle', marginTop: '-2px' }}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}
