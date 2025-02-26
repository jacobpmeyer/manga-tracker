import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/AddManga.css';

interface SearchResult {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  score: number;
}

const AddManga: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [malId, setMalId] = useState('');
  const [initialStatus, setInitialStatus] = useState('To Be Read');
  const [ownership, setOwnership] = useState('Owned');

  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (searchQuery.trim()) {
        const res = await api.get(`/api/manga/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to search for manga. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMalIdSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!malId || isNaN(Number(malId))) {
      setError('Please enter a valid MAL ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.get(`/api/manga/mal/${malId}`);
      setSearchResults([res.data]);
    } catch (err) {
      setError('Failed to find manga with that ID. Please check and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addManga = async (manga: SearchResult) => {
    try {
      await api.post('/api/manga', {
        malId: manga.id,
        status: initialStatus,
        ownership: ownership
      });

      navigate('/');
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Failed to add manga');
      } else {
        setError('Failed to add manga to your collection');
      }
    }
  };

  return (
    <div className="add-manga-container">
      <h1>Add Manga to Your Collection</h1>

      <div className="search-options">
        <div className="search-by-title">
          <h2>Search by Title</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Enter manga title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        <div className="search-by-id">
          <h2>Search by MAL ID</h2>
          <form onSubmit={handleMalIdSearch} className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Enter MAL ID..."
              value={malId}
              onChange={(e) => setMalId(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      <div className="manga-options">
        <div className="option-group">
          <label htmlFor="status">Initial Status:</label>
          <select
            id="status"
            value={initialStatus}
            onChange={(e) => setInitialStatus(e.target.value)}
          >
            <option value="To Be Read">To Be Read</option>
            <option value="Reading">Reading</option>
            <option value="Read">Read</option>
          </select>
        </div>

        <div className="option-group">
          <label htmlFor="ownership">Ownership:</label>
          <select
            id="ownership"
            value={ownership}
            onChange={(e) => setOwnership(e.target.value)}
          >
            <option value="Owned">Owned</option>
            <option value="Not Owned">Not Owned</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-results">
        {searchResults.length > 0 ? (
          <>
            <h2>Search Results</h2>
            <div className="results-list">
              {searchResults.map((manga) => (
                <div key={manga.id} className="result-card">
                  <div className="result-image">
                    <img src={manga.coverImage} alt={manga.title} />
                  </div>
                  <div className="result-info">
                    <h3>{manga.title}</h3>
                    <p className="result-id">MAL ID: {manga.id}</p>
                    {manga.score && <p className="result-score">Score: {manga.score}/10</p>}
                    <p className="result-description">{manga.description}</p>
                  </div>
                  <button
                    className="add-button"
                    onClick={() => addManga(manga)}
                  >
                    Add to Collection
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : !loading && searchQuery && (
          <p className="no-results">No results found. Try a different search term.</p>
        )}
      </div>
    </div>
  );
};

export default AddManga;
