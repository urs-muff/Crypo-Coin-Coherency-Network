// src/components/RecentActivity.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';
import { Concept } from '../types/api';

const RecentActivity: React.FC = () => {
  const { data: concepts } = useQuery<Concept[]>('concepts', api.getConcepts);

  // Sort concepts by timestamp and take the 5 most recent
  const recentConcepts = concepts
    ?.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {recentConcepts?.map((concept) => (
          <li key={concept.ID} className="text-sm">
            <span className="font-semibold">New concept created: </span>
            <span className="text-blue-600">{concept.Name}</span>
            <span className="text-gray-500 ml-2">
              {new Date(concept.Timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;