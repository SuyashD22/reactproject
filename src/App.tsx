import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu } from 'lucide-react';
import './App.css';

// Type Definitions
interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

type PageType = 'home' | 'details' | 'saved';

// Main App Component with routing
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [userName, setUserName] = useState<string>('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [currentPhotoPage, setCurrentPhotoPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Fetch photos from API
  useEffect(() => {
    if (currentPage === 'details') {
      fetchPhotos();
    }
  }, [currentPage, currentPhotoPage]);

  const fetchPhotos = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${currentPhotoPage}&limit=12`
      );
      const data: Photo[] = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
    setLoading(false);
  };

  const handlePhotoToggle = (photoId: string): void => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleNext = (): void => {
    if (userName.trim()) {
      setCurrentPage('details');
    }
  };

  const navigateTo = (page: PageType): void => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* Desktop Navigation - Horizontal Buttons */}
      <nav className="navbar navbar-desktop">
        <ul className="nav-menu nav-menu-horizontal">
          <li className="nav-item">
            <button
              className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Home
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-button ${currentPage === 'details' ? 'active' : ''}`}
              onClick={() => navigateTo('details')}
            >
              Details
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-button ${currentPage === 'saved' ? 'active' : ''}`}
              onClick={() => navigateTo('saved')}
            >
              Saved
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation - Hamburger Menu */}
      <nav className="navbar navbar-mobile">
        <button
          className="hamburger-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>
        <span className="current-page-title">
          {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
        </span>
      </nav>

      {/* Dropdown Menu - Mobile Only */}
      {sidebarOpen && (
        <>
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
          <div className="dropdown-menu">
            <button
              className={`menu-item ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Home
            </button>
            <button
              className={`menu-item ${currentPage === 'details' ? 'active' : ''}`}
              onClick={() => navigateTo('details')}
            >
              Details
            </button>
            <button
              className={`menu-item ${currentPage === 'saved' ? 'active' : ''}`}
              onClick={() => navigateTo('saved')}
            >
              Saved
            </button>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'home' && (
          <HomePage
            userName={userName}
            setUserName={setUserName}
            handleNext={handleNext}
          />
        )}
        {currentPage === 'details' && (
          <DetailsPage
            userName={userName}
            photos={photos}
            selectedPhotos={selectedPhotos}
            handlePhotoToggle={handlePhotoToggle}
            currentPhotoPage={currentPhotoPage}
            setCurrentPhotoPage={setCurrentPhotoPage}
            loading={loading}
          />
        )}
        {currentPage === 'saved' && (
          <SavedPage
            userName={userName}
            photos={photos}
            selectedPhotos={selectedPhotos}
          />
        )}
      </main>
    </div>
  );
};

// Home Page Component
interface HomePageProps {
  userName: string;
  setUserName: (name: string) => void;
  handleNext: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ userName, setUserName, handleNext }) => (
  <div className="home-page">
    <div className="home-header">
      <h1 className="home-title">Welcome to Gallery</h1>
      <p className="home-subtitle">Start your photo journey</p>
    </div>
    <div className="input-group">
      <input
        type="text"
        className="text-input"
        placeholder="Enter your name..."
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleNext()}
      />
      <button
        className="next-button"
        onClick={handleNext}
        disabled={!userName.trim()}
      >
        Next <ChevronRight size={20} />
      </button>
    </div>
  </div>
);

// Details Page Component
interface DetailsPageProps {
  userName: string;
  photos: Photo[];
  selectedPhotos: Set<string>;
  handlePhotoToggle: (photoId: string) => void;
  currentPhotoPage: number;
  setCurrentPhotoPage: (page: number) => void;
  loading: boolean;
}

const DetailsPage: React.FC<DetailsPageProps> = ({
  userName,
  photos,
  selectedPhotos,
  handlePhotoToggle,
  currentPhotoPage,
  setCurrentPhotoPage,
  loading
}) => (
  <div className="details-page">
    <div className="page-header">
      <h2 className="welcome-text">Welcome {userName}!</h2>
      <p className="instruction-text">
        Only you can see this checkbox and on click it should be saved
      </p>
    </div>

    {loading ? (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    ) : (
      <>
        <div className="photo-grid">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`photo-card ${selectedPhotos.has(photo.id) ? 'selected' : ''}`}
            >
              <img
                src={`${photo.download_url}?w=400&h=300`}
                alt={photo.author}
                className="photo-image"
              />
              <div className="photo-info">
                <span className="photo-title">{photo.author}</span>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    className="photo-checkbox"
                    checked={selectedPhotos.has(photo.id)}
                    onChange={() => handlePhotoToggle(photo.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            className="page-button"
            onClick={() => setCurrentPhotoPage(currentPhotoPage - 1)}
            disabled={currentPhotoPage === 1}
          >
            Previous
          </button>
          <span className="page-info">Page {currentPhotoPage}</span>
          <button
            className="page-button"
            onClick={() => setCurrentPhotoPage(currentPhotoPage + 1)}
          >
            Next
          </button>
        </div>
      </>
    )}
  </div>
);

// Saved Page Component
interface SavedPageProps {
  userName: string;
  photos: Photo[];
  selectedPhotos: Set<string>;
}

const SavedPage: React.FC<SavedPageProps> = ({ userName, photos, selectedPhotos }) => {
  const savedPhotos = photos.filter((photo) => selectedPhotos.has(photo.id));

  return (
    <div className="saved-page">
      <div className="page-header">
        <h2 className="welcome-text">Hey {userName}!</h2>
        {savedPhotos.length > 0 && (
          <span className="saved-count">
            You saved {savedPhotos.length} {savedPhotos.length === 1 ? 'image' : 'images'}
          </span>
        )}
      </div>

      {savedPhotos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📷</div>
          <h3 className="empty-state-title">No images saved yet</h3>
          <p className="empty-state-text">
            Go to Details page and select some photos to save them here
          </p>
        </div>
      ) : (
        <div className="photo-grid">
          {savedPhotos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <img
                src={`${photo.download_url}?w=400&h=300`}
                alt={photo.author}
                className="photo-image"
              />
              <div className="photo-info">
                <span className="photo-title">{photo.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;