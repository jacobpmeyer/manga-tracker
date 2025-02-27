import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { IManga } from '../types/manga';
import '../styles/MangaShowPage.css';

const MangaShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manga, setManga] = useState<IManga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/manga/${id}`);
        setManga(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching manga details:', err);
        setError('Failed to load manga details');
        setLoading(false);
      }
    };

    if (id) {
      fetchMangaDetails();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!manga) return;

    try {
      const res = await api.put(`/api/manga/${manga._id}/status`, { status: newStatus });
      setManga(res.data);
    } catch (err) {
      console.error('Error updating manga status:', err);
      setError('Failed to update manga status');
    }
  };

  const handleOwnershipChange = async (newOwnership: string) => {
    if (!manga) return;

    try {
      const res = await api.put(`/api/manga/${manga._id}/ownership`, { ownership: newOwnership });
      setManga(res.data);
    } catch (err) {
      console.error('Error updating manga ownership:', err);
      setError('Failed to update manga ownership');
    }
  };

  const handleDelete = async () => {
    if (!manga) return;

    if (window.confirm('Are you sure you want to remove this manga from your collection?')) {
      try {
        await api.delete(`/api/manga/${manga._id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting manga:', err);
        setError('Failed to delete manga');
      }
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Reading':
        return '#f6e58d'; // yellow
      case 'To Be Read':
        return '#e17055'; // coral
      case 'Read':
        return '#6ab04c'; // green
      default:
        return '#dff9fb'; // light blue
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading-container">Loading manga details...</div>;
  }

  if (error) {
    return (
      <div className="manga-show-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={goBack}>Back to Collection</button>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="manga-show-container">
        <div className="error-message">Manga not found</div>
        <button className="back-button" onClick={goBack}>Back to Collection</button>
      </div>
    );
  }

  return (
    <div className="manga-show-container">
      <button className="back-button" onClick={goBack}>
        &larr; Back to Collection
      </button>

      <div
        className="manga-detail-card"
        style={{ borderColor: getStatusColor(manga.status) }}
      >
        <div className="manga-header">
          <div className="manga-cover">
            <img src={manga.coverImage} alt={manga.title} />
          </div>
          <div className="manga-info">
            <h1>{manga.title}</h1>
            <div className="manga-metadata">
              <p>Added: {formatDate(manga.addedAt)}</p>
              <p>MAL ID: {manga.malId}</p>
            </div>

            <div className="manga-controls">
              <div className="control-group">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={manga.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{ backgroundColor: getStatusColor(manga.status) }}
                >
                  <option value="To Be Read">To Be Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Read">Read</option>
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="ownership">Ownership:</label>
                <select
                  id="ownership"
                  value={manga.ownership}
                  onChange={(e) => handleOwnershipChange(e.target.value)}
                >
                  <option value="Owned">Owned</option>
                  <option value="Not Owned">Not Owned</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="manga-description">
          <h2>Description</h2>
          <p>{manga.description}</p>
        </div>

        <div className="status-history">
          <h2>Status History</h2>
          <ul>
            {manga.statusHistory.map((change, index) => (
              <li key={index}>
                <span
                  className="status-label"
                  style={{ backgroundColor: getStatusColor(change.status) }}
                >
                  {change.status}
                </span>
                <span className="status-date">{formatDate(change.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="delete-button"
          onClick={handleDelete}
        >
          Remove from Collection
        </button>
      </div>
    </div>
  );
};

export default MangaShowPage;
