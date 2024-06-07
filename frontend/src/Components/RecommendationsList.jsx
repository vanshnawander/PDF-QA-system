import React, { useState } from 'react';

const RecommendationList = ({ recommendations, onSelect }) => {
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);

  const handleSelect = (recommendation) => {
    const updatedSelectedRecommendations = selectedRecommendations.includes(recommendation)
      ? selectedRecommendations.filter(r => r !== recommendation)
      : [...selectedRecommendations, recommendation];
    setSelectedRecommendations(updatedSelectedRecommendations);
    onSelect(updatedSelectedRecommendations);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recommendations</h2>
      <ul className="list-disc pl-5">
        {recommendations.map(recommendation => (
          <li
            key={recommendation}
            className={`cursor-pointer ${selectedRecommendations.includes(recommendation) ? 'text-blue-500' : ''}`}
            onClick={() => handleSelect(recommendation)}
          >
            {recommendation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationList;
