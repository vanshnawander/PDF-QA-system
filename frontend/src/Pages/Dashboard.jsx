import React, { useState } from 'react';
import RecommendationList from '../Components/RecommendationsList';
import InteractionList from '../Components/PreviousInteractions';
import FileList from '../Components/fileList';


const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [interactions, setInteractions] = useState([]);

  const files = ['File1', 'File2', 'File3'];
  const recommendations = ['Recommendation1', 'Recommendation2', 'Recommendation3'];

  const handleFileSelect = (files) => {
    setSelectedFiles(files);
    updateInteractions('Files', files);
  };

  const handleRecommendationSelect = (recommendations) => {
    setSelectedRecommendations(recommendations);
    updateInteractions('Recommendations', recommendations);
  };

  const updateInteractions = (type, items) => {
    const newInteraction = `${type}: ${items.join(', ')}`;
    setInteractions(prevInteractions => [...prevInteractions, newInteraction]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded">
          <FileList files={files} onSelect={handleFileSelect} />
        </div>
        <div className="bg-white shadow rounded">
          <RecommendationList recommendations={recommendations} onSelect={handleRecommendationSelect} />
        </div>
        <div className="bg-white shadow rounded">
          <InteractionList interactions={interactions} />
        </div>
      </div>
    </div>
  );
};

export default App;
