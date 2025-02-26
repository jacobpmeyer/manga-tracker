import React from 'react';
import { IManga } from '../types/manga';
import '../styles/MangaCard.css';

interface MangaCardProps {
  manga: IManga;
  onStatusChange: (mangaId: string, newStatus: string) => void;
  onOwnershipChange: (mangaId: string, newOwnership: string) => void;
  onDelete: (mangaId: string) => void;
}

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

const MangaCard: React.FC<MangaCardProps> = ({
  manga,
  onStatusChange,
  onOwnershipChange,
  onDelete,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(manga._id, e.target.value);
  };

  const handleOwnershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onOwnershipChange(manga._id, e.target.value);
  };

  return (
    <div
      className="manga-card"
      style={{ borderColor: getStatusColor(manga.status) }}
    >
      <div className="manga-card-header">
        <div className="manga-cover">
          <img src={manga.coverImage} alt={manga.title} />
        </div>
        <div className="manga-info">
          <h3>{manga.title}</h3>
          <div className="manga-metadata">
            <p className="manga-added-date">
              Added: {formatDate(manga.addedAt)}
            </p>
            <p className="manga-id">MAL ID: {manga.malId}</p>
          </div>
        </div>
      </div>

      <div className="manga-controls">
        <div className="control-group">
          <label htmlFor={`status-${manga._id}`}>Status:</label>
          <select
            id={`status-${manga._id}`}
            value={manga.status}
            onChange={handleStatusChange}
            style={{ backgroundColor: getStatusColor(manga.status) }}
          >
            <option value="To Be Read">To Be Read</option>
            <option value="Reading">Reading</option>
            <option value="Read">Read</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor={`ownership-${manga._id}`}>Ownership:</label>
          <select
            id={`ownership-${manga._id}`}
            value={manga.ownership}
            onChange={handleOwnershipChange}
          >
            <option value="Owned">Owned</option>
            <option value="Not Owned">Not Owned</option>
          </select>
        </div>
      </div>

      <div className="manga-description-container">
        <p className="manga-description">{manga.description}</p>
      </div>

      <div className="status-history">
        <h4>Status History</h4>
        <ul>
          {manga.statusHistory.map((change, index) => (
            <li key={index}>
              <span className="status-label" style={{ backgroundColor: getStatusColor(change.status) }}>
                {change.status}
              </span>
              <span className="status-date">{formatDate(change.timestamp)}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="delete-button"
        onClick={() => onDelete(manga._id)}
      >
        Remove
      </button>
    </div>
  );
};

export default MangaCard;
