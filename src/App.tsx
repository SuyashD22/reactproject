import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import DetailsPage from './pages/DetailsPage.tsx';
import SavedPage from './pages/SavedPage.tsx';
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

const AppContent: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [savedPhotos, setSavedPhotos] = useState<Set<string>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userName && location.pathname === '/') {
      navigate('/details');
    }
  }, [userName, location.pathname, navigate]);

  // Redirect to home if no userName on protected pages
  useEffect(() => {
    if (!userName && location.pathname !== '/') {
      navigate('/');
    }
  }, [userName, location.pathname, navigate]);

  const handleNavigation = (page: PageType) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    setIsMenuOpen(false);
  };

  const getPageDisplayName = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/details':
        return 'Details';
      case '/saved':
        return 'Saved';
      default:
        return 'Home';
    }
  };

  const isCurrentPage = (page: PageType) => {
    if (page === 'home') return location.pathname === '/';
    return location.pathname === `/${page}`;
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
                  className={`nav-link ${isCurrentPage('home') ? 'active' : ''}`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('details')}
                  className={`nav-link ${isCurrentPage('details') ? 'active' : ''}`}
                >
                  Details
                </button>
                <button
                  onClick={() => handleNavigation('saved')}
                  className={`nav-link ${isCurrentPage('saved') ? 'active' : ''}`}
                >
                  Saved
                </button>
              </div>
            </nav>
          )}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/details" element={<DetailsPage />} />
            <Route path="/saved" element={<SavedPage />} />
          </Routes>
        </div>
      </PhotosContext.Provider>
    </UserContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;