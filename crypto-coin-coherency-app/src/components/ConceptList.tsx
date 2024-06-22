// File: src/components/ConceptList.tsx

import React, { useState, useEffect } from 'react';
import { Concept } from '../types/BasicTypes';
import { ConceptInteractionAgent } from '../types/ConceptTypes';

interface ConceptListProps {
  agent: ConceptInteractionAgent;
  onSelectConcept: (id: string) => void;
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
        // Remove duplicates based on concept ID
        const uniqueConcepts = allConcepts.filter((concept, index, self) =>
          index === self.findIndex((t) => t.id === concept.id)
        );
        setConcepts(uniqueConcepts);
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
              <a href="#" onClick={(e) => {
                e.preventDefault();
                onSelectConcept(concept.id);
              }}>
                <strong>{concept.name}</strong> ({concept.type})
              </a>
              <p>{concept.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};