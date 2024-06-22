// File: src/components/ConceptDetail.tsx

import React, { useState, useEffect } from 'react';
import { ConceptData, ConceptInteractionAgent } from '../types/ConceptTypes';
import { FlexibleConceptAgent } from '../agents/FlexibleConceptAgent';

interface ConceptDetailProps {
  agent: ConceptInteractionAgent;
  conceptId: string;
  onConceptUpdated: () => void;
}

export const ConceptDetail: React.FC<ConceptDetailProps> = ({ agent, conceptId, onConceptUpdated }) => {
  const [conceptData, setConceptData] = useState<ConceptData | null>(null);

  useEffect(() => {
    const fetchConcept = async () => {
      const data = await agent.getConcept(conceptId);
      setConceptData(data);
    };
    fetchConcept();
  }, [agent, conceptId]);

  const handlePropertyUpdate = async (propertyId: string, key: string, value: any) => {
    if (conceptData && agent instanceof FlexibleConceptAgent) {
      await agent.updateProperty(conceptId, propertyId, { key, value });
      const updatedData = await agent.getConcept(conceptId);
      setConceptData(updatedData);
      onConceptUpdated();
    }
  };

  // Implement similar handlers for other concept elements (relations, features, etc.)

  if (!conceptData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{conceptData.concept.name}</h2>
      <p>{conceptData.concept.description}</p>
      
      <h3>Properties</h3>
      {conceptData.properties.map((prop) => (
        <div key={prop.id}>
          <input
            value={prop.key}
            onChange={(e) => handlePropertyUpdate(prop.id, e.target.value, prop.value)}
          />
          <input
            value={JSON.stringify(prop.value)}
            onChange={(e) => handlePropertyUpdate(prop.id, prop.key, JSON.parse(e.target.value))}
          />
        </div>
      ))}
      
      {/* Implement similar editing interfaces for other concept elements */}
    </div>
  );
};