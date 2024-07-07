// src/components/Catalyst.tsx
import React from 'react';
import { Catalyst } from '../types/api';

interface CatalystProps {
  catalyst: Catalyst;
  onEdit: (catalyst: Catalyst) => void;
  onDelete: (seedId: string) => void;
}

const CatalystComponent: React.FC<CatalystProps> = ({ catalyst, onEdit, onDelete }) => {
  const renderContent = () => {
    switch (catalyst.ContentType) {
      case 'text/markdown':
      case 'text/plain':
        return <div className="whitespace-pre-wrap">{catalyst.Content}</div>;
      case 'image/png':
      case 'image/jpeg':
      case 'image/gif':
        return <img src={`data:${catalyst.ContentType};base64,${catalyst.Content}`} alt={catalyst.Name} />;
      case 'video/mp4':
        return <video src={`data:${catalyst.ContentType};base64,${catalyst.Content}`} controls />;
      case 'application/pdf':
        return <embed src={`data:${catalyst.ContentType};base64,${catalyst.Content}`} type="application/pdf" width="100%" height="600px" />;
      default:
        return <a href={catalyst.Content} target="_blank" rel="noopener noreferrer">View External Resource</a>;
    }
  };

  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="text-xl font-semibold">{catalyst.Name}</h3>
      <p>{catalyst.Description}</p>
      {renderContent()}
      <div className="mt-2">
        <button onClick={() => onEdit(catalyst)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
        <button onClick={() => onDelete(catalyst.SeedID)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
      </div>
    </div>
  );
};

export default CatalystComponent;