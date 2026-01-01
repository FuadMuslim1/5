import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GoBackButton.css';

const GoBackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="wrapper" onClick={handleGoBack}>
      <div className="button">
        <i className="fas fa-arrow-left"></i>
      </div>
    </div>
  );
};

export default GoBackButton;
