import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MangaCard from '../components/MangaCard';
import api from '../services/api';
import { IManga } from '../types/manga';
import '../styles/Home.css';

const Home: React.FC = () => {
  const [manga, setManga] = useState<IManga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchManga();
  }, []);

  const fetchManga = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/manga');
      setManga(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching manga:', err);
      setError('Failed to load your manga collection');
      setLoading(false);
    }
  };

  const handleStatusChange = async (mangaId: string, newStatus: string) => {
    try {
      const res = await api.put(`/api/manga/${mangaId}/status`, { status: newStatus });

      // Update manga in state
      setManga(manga.map(m =>
        m._id === mangaId ? res.data : m
      ));
    } catch (err) {
      console.error('Error updating manga status:', err);
      setError('Failed to update manga status');
    }
  };

  const handleOwnershipChange = async (mangaId: string, newOwnership: string) => {
    try {
      const res = await api.put(`/api/manga/${mangaId}/ownership`, { ownership: newOwnership });

      // Update manga in state
      setManga(manga.map(m =>
        m._id === mangaId ? res.data : m
      ));
    } catch (err) {
      console.error('Error updating manga ownership:', err);
      setError('Failed to update manga ownership');
    }
  };

  const handleDelete = async (mangaId: string) => {
    if (window.confirm('Are you sure you want to remove this manga from your collection?')) {
      try {
        await api.delete(`/api/manga/${mangaId}`);

        // Remove manga from state
        setManga(manga.filter(m => m._id !== mangaId));
      } catch (err) {
        console.error('Error deleting manga:', err);
        setError('Failed to delete manga');
      }
    }
  };

  // Filter manga based on user selections
  const filteredManga = manga.filter(m => {
    // Apply status filter
    if (filter !== 'all' && m.status !== filter) {
      return false;
    }

    // Apply ownership filter
    if (ownershipFilter !== 'all' && m.ownership !== ownershipFilter) {
      return false;
    }

    // Apply search filter (case insensitive)
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  if (loading) {
    return <div className="loading-container">Loading your collection...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>My Manga Collection</h1>
        <Link to="/add" className="add-button">Add New Manga</Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Reading">Reading</option>
            <option value="To Be Read">To Be Read</option>
            <option value="Read">Read</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="ownership-filter">Ownership:</label>
          <select
            id="ownership-filter"
            value={ownershipFilter}
            onChange={(e) => setOwnershipFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Owned">Owned</option>
            <option value="Not Owned">Not Owned</option>
          </select>
        </div>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Search titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="collection-stats">
        <p>Total: {manga.length} manga</p>
        <p>Filtered: {filteredManga.length} manga</p>
      </div>

      <div className="manga-list">
        {filteredManga.length > 0 ? (
          filteredManga.map(manga => (
            <MangaCard
              key={manga._id}
              manga={manga}
              onStatusChange={handleStatusChange}
              onOwnershipChange={handleOwnershipChange}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="empty-collection">
            <p>
              {manga.length > 0
                ? 'No manga match your current filters.'
                : 'Your collection is empty. Add some manga!'}
            </p>
            {manga.length === 0 && (
              <Link to="/add" className="add-button">Add Manga</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
