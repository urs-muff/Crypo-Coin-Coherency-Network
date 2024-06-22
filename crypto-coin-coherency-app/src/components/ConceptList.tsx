// File: src/components/ConceptList.tsx

import React, { useState, useEffect } from 'react';
import { ConceptID, Concept } from '../types/ConceptTypes';
import { FlexibleConceptAgent } from '../agents/FlexibleConceptAgent';

interface ConceptListProps {
  agent: FlexibleConceptAgent;
  onSelectConcept: (id: ConceptID) => void;
}

export const ConceptList: React.FC<ConceptListProps> = ({ agent, onSelectConcept }) => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        setIsLoading(true);
        const allConcepts = await agent.getAllConcepts();
        console.log('Fetched concepts:', allConcepts);  // Add this line for debugging
        setConcepts(allConcepts);
        setError(null);
      } catch (err) {
        setError('Failed to fetch concepts. Please try again later.');
        console.error('Error fetching concepts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcepts();
  }, [agent]);

  if (isLoading) {
    return <div>Loading concepts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Concepts</h2>
      {concepts.length === 0 ? (
        <p>No concepts found.</p>
      ) : (
        <ul>
          {concepts.map((concept) => (
            <li key={concept.id}>
              <button onClick={() => onSelectConcept(concept.id)}>
                <strong>{concept.type}: {('name' in concept) ? concept.name : concept.id}</strong>
              </button>
              {('description' in concept) && <p>{concept.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};