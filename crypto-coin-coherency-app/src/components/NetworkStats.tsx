import React from 'react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';

const NetworkStats: React.FC = () => {
  const { data: concepts } = useQuery('concepts', api.getConcepts);
  const { data: seeds } = useQuery('seeds', api.getSeeds);
  const { data: relationships } = useQuery('relationships', api.getRelationships);

  const stats = {
    'Total Concepts': concepts?.length || 0,
    'Total Seeds': seeds?.length || 0,
    'Total Relationships': relationships?.length || 0,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Network Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="text-center">
            <p className="text-gray-600">{key}</p>
            <p className="text-2xl font-bold text-blue-600">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkStats;