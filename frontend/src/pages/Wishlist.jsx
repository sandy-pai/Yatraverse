import { useState, useEffect } from 'react';
import api from '../api';
import PlaceCard from '../components/PlaceCard';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get('/wishlist');
        setPlaces(data);
      } catch (error) {
        console.error('Failed to fetch wishlist', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <main className="home">
        <section className="home__section">
          <div className="home__section-header">
            <h2 className="home__section-title">My Wishlist</h2>
          </div>
          <div className="home__grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="placecard placecard--skeleton" aria-hidden="true">
                <div className="placecard__img-wrap" />
                <div className="placecard__body">
                  <div className="placecard__skeleton-line" />
                  <div className="placecard__skeleton-line placecard__skeleton-line--short" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="home">
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">My Wishlist</h2>
          <p className="home__section-subtitle">Places you want to visit</p>
        </div>

        {places.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: '1rem' }}>Your wishlist is empty</h3>
            <p style={{ color: '#94a3b8' }}>Start exploring places and save them for later!</p>
          </div>
        ) : (
          <div className="home__grid">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
