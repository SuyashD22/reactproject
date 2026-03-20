import React, { useState, useEffect, createContext } from 'react';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import SavedPage from './pages/SavedPage';
import './App.css';

type PageType = 'home' | 'details' | 'saved';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
}

interface PhotosContextType {
  savedPhotos: Set<string>;
  setSavedPhotos: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
export const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

const App: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [savedPhotos, setSavedPhotos] = useState<Set<string>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (userName && currentPage === 'home') {
      setCurrentPage('details');
    }
  }, [userName, currentPage]);

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const getPageDisplayName = () => {
    switch (currentPage) {
      case 'home':
        return 'Home';
      case 'details':
        return 'Details';
      case 'saved':
        return 'Saved';
      default:
        return 'Home';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'details':
        return <DetailsPage />;
      case 'saved':
        return <SavedPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      <PhotosContext.Provider value={{ savedPhotos, setSavedPhotos }}>
        <div className="App">
          {userName && (
            <nav className="navbar">
              <div className="nav-header">
                <button 
                  className="hamburger-btn"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </button>
                <span className="page-title">{getPageDisplayName()}</span>
              </div>
              
              <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <button
                  onClick={() => handleNavigation('home')}
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('details')}
                  className={`nav-link ${currentPage === 'details' ? 'active' : ''}`}
                >
                  Details
                </button>
                <button
                  onClick={() => handleNavigation('saved')}
                  className={`nav-link ${currentPage === 'saved' ? 'active' : ''}`}
                >
                  Saved
                </button>
              </div>
            </nav>
          )}
          {renderPage()}
        </div>
      </PhotosContext.Provider>
    </UserContext.Provider>
  );
};

export default App;