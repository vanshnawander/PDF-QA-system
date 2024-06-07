import React from 'react';

const InteractionList = ({ interactions }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Previous Interactions</h2>
      <ul className="list-disc pl-5">
        {interactions.map((interaction, index) => (
          <li key={index}>
            {interaction}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InteractionList;
