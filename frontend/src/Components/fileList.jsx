import React, { useState } from 'react';

const FileList = ({ files, onSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSelect = (file) => {
    const updatedSelectedFiles = selectedFiles.includes(file)
      ? selectedFiles.filter(f => f !== file)
      : [...selectedFiles, file];
    setSelectedFiles(updatedSelectedFiles);
    onSelect(updatedSelectedFiles);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Files</h2>
      <ul className="list-disc pl-5">
        {files.map(file => (
          <li
            key={file}
            className={`cursor-pointer ${selectedFiles.includes(file) ? 'text-blue-500' : ''}`}
            onClick={() => handleSelect(file)}
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
