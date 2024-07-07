// src/components/CoherenceScore.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';
import { Relationship } from '../types/api';

const CoherenceScore: React.FC = () => {
  const { data: relationships } = useQuery<Relationship[]>('relationships', api.getRelationships);

  const calculateCoherenceScore = (relationships: Relationship[] | undefined): number => {
    if (!relationships) return 0;
    const totalEnergyFlow = relationships.reduce((sum, r) => sum + r.EnergyFlow, 0);
    return Math.min(Math.round((totalEnergyFlow / relationships.length) * 20), 100); // Scale to 0-100
  };

  const score = calculateCoherenceScore(relationships);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Network Coherence Score</h2>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
            {score}
          </div>
        </div>
      </div>
      <p className="text-center mt-4 text-gray-600">
        {score < 30 ? "Network coherence needs improvement" :
         score < 70 ? "Network coherence is moderate" :
         "Network coherence is strong"}
      </p>
    </div>
  );
};

export default CoherenceScore;