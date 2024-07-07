// src/components/TopConcepts.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';
import { Concept, Relationship } from '../types/api';

const TopConcepts: React.FC = () => {
  const { data: concepts } = useQuery<Concept[]>('concepts', api.getConcepts);
  const { data: relationships } = useQuery<Relationship[]>('relationships', api.getRelationships);

  const topConcepts = concepts
    ?.map(concept => ({
      ...concept,
      interactions: relationships?.filter(r => r.SourceID === concept.ID || r.TargetID === concept.ID).length || 0
    }))
    .sort((a, b) => b.interactions - a.interactions)
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Top Concepts</h2>
      <ul className="space-y-3">
        {topConcepts?.map((concept) => (
          <li key={concept.ID} className="flex justify-between items-center">
            <span className="text-blue-600">{concept.Name}</span>
            <span className="text-gray-500">{concept.interactions} interactions</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopConcepts;