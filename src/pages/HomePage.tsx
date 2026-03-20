import React, { useState, useContext } from 'react';
import { UserContext } from '../App';

const HomePage: React.FC = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('HomePage must be used within UserProvider');
  }
  
  const { userName, setUserName } = context;
  const [inputValue, setInputValue] = useState(userName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUserName(inputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="page home-page">
      <div className="home-container">
        <h1>Welcome</h1>
        <form onSubmit={handleSubmit} className="name-form">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter your name"
            className="name-input"
          />
          <button type="submit" className="submit-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;