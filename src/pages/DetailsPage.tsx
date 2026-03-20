import React, { useState, useEffect, useCallback, useContext } from 'react';
import { UserContext, PhotosContext } from '../App';

interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

const DetailsPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const photosContext = useContext(PhotosContext);
  
  if (!userContext || !photosContext) {
    throw new Error('DetailsPage must be used within Context Providers');
  }
  
  const { userName } = userContext;
  const { savedPhotos, setSavedPhotos } = photosContext;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 12;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://picsum.photos/v2/list?page=3&limit=30');
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        const data = await response.json();
        setPhotos(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const toggleSavePhoto = useCallback((photoId: string) => {
    setSavedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  }, [setSavedPhotos]);

  // Pagination calculations
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  const totalPages = Math.ceil(photos.length / photosPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading photos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <h1>Hello, {userName}!</h1>
        <p>Explore and save your favorite photos</p>
      </div>
      <div className="gallery">
        {currentPhotos.map(photo => (
          <div key={photo.id} className="photo-card">
            <img
              src={`${photo.download_url}?w=400&h=300`}
              alt={`Photo by ${photo.author}`}
              className="photo-img"
            />
            <div className="photo-info">
              <p className="photo-author">{photo.author}</p>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={savedPhotos.has(photo.id)}
                  onChange={() => toggleSavePhoto(photo.id)}
                  className="photo-checkbox"
                />
                <span className="checkbox-label">Save</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;