import React from 'react';

const Homepage: React.FC = () => {
  // Redirect to the static homepage in public folder
  React.useEffect(() => {
    window.location.href = '/homepage/homepage.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading homepage...</p>
      </div>
    </div>
  );
};

export default Homepage;
