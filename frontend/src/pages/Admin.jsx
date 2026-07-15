import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Admin() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/places');
      setPlaces(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load places.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/places/${id}`);
        setPlaces(places.filter(place => place._id !== id));
      } catch (err) {
        alert('Failed to delete tourist place.');
      }
    }
  };

  return (
    <main className="admin">
      <div className="admin__container">
        <div className="admin__header">
          <div className="admin__header-text">
            <h1 className="admin__title">Admin Dashboard</h1>
            <p className="admin__subtitle">Manage your travel destinations and experiences.</p>
          </div>
          <Link to="/admin/add" className="admin__add-btn">
            + Add Tourist Place
          </Link>
        </div>

        {error && <div className="admin__error">{error}</div>}

        <div className="admin__card">
          {loading ? (
            <div className="admin__loading">Loading places...</div>
          ) : (
            <div className="admin__table-wrapper">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>DESTINATION NAME</th>
                    <th>STATE</th>
                    <th>RATING</th>
                    <th className="admin__actions-head">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {places.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="admin__empty">No places found.</td>
                    </tr>
                  ) : (
                    places.map((place) => (
                      <tr key={place._id}>
                        <td>
                          <div className="admin__dest">
                            <img
                              src={place.image}
                              alt={place.name}
                              className="admin__dest-img"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=100&q=80';
                              }}
                            />
                            <span className="admin__dest-name">{place.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="admin__state">{place.state}</span>
                        </td>
                        <td>
                          <span className="admin__rating">
                            <span className="admin__star">★</span> {Number(place.rating).toFixed(1)}
                          </span>
                        </td>
                        <td>
                          <div className="admin__actions">
                            <button
                              onClick={() => navigate(`/admin/edit/${place._id}`)}
                              className="admin__action-btn admin__action-btn--edit"
                              aria-label="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(place._id, place.name)}
                              className="admin__action-btn admin__action-btn--delete"
                              aria-label="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Shared footer */}
      <footer className="home__footer admin__footer">
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
