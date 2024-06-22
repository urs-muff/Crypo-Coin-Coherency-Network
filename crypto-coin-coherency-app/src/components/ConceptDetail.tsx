// File: src/components/ConceptDetail.tsx

import React, { useState, useEffect } from 'react';
import { Concept, ConceptID, Value, ComplexValue } from '../types/ConceptTypes';
import { FlexibleConceptAgent } from '../agents/FlexibleConceptAgent';
import { GenericPropertyEditor } from './GenericPropertyEditor';

interface ConceptDetailProps {
  agent: FlexibleConceptAgent;
  conceptId: ConceptID;
  onConceptUpdated: () => void;
}

export const ConceptDetail: React.FC<ConceptDetailProps> = ({ agent, conceptId, onConceptUpdated }) => {
  const [conceptData, setConceptData] = useState<Concept | undefined>(undefined);
  const [childConcepts, setChildConcepts] = useState<Record<string, Concept | null>>({});

  useEffect(() => {
    const fetchConcept = async () => {
      const data = await agent.getConcept(conceptId);
      setConceptData(data);
    };
    fetchConcept();
  }, [agent, conceptId]);

  useEffect(() => {
    const fetchChildConcepts = async () => {
      if (conceptData) {
        const childConceptsData: Record<string, Concept | null> = {};
        for (const [section, childId] of Object.entries(conceptData.children)) {
          const childConcept = await agent.getConcept(childId);
          childConceptsData[section] = childConcept || null;
        }
        setChildConcepts(childConceptsData);
      }
    };
    fetchChildConcepts();
  }, [conceptData, agent]);

  const handlePropertyUpdate = async (section: keyof Concept['children'], key: string, value: Value) => {
    if (conceptData && childConcepts[section]) {
      const childConcept = childConcepts[section] as Concept;
      if (typeof childConcept.value === 'object' && childConcept.value !== null) {
        const updatedChildConcept = {
          ...childConcept,
          value: {
            ...(childConcept.value as Record<string, Value>),
            [key]: value
          }
        };
        await agent.updateConcept(updatedChildConcept);
        setConceptData(await agent.getConcept(conceptId));
        onConceptUpdated();
      }
    }
  };

  const handlePropertyAdd = async (section: keyof Concept['children']) => {
    if (conceptData && childConcepts[section]) {
      const childConcept = childConcepts[section] as Concept;
      if (typeof childConcept.value === 'object' && childConcept.value !== null) {
        const updatedChildConcept = {
          ...childConcept,
          value: {
            ...(childConcept.value as Record<string, Value>),
            [`new_property_${Date.now()}`]: ''
          }
        };
        await agent.updateConcept(updatedChildConcept);
        setConceptData(await agent.getConcept(conceptId));
        onConceptUpdated();
      }
    }
  };

  const handlePropertyDelete = async (section: keyof Concept['children'], key: string) => {
    if (conceptData && childConcepts[section]) {
      const childConcept = childConcepts[section] as Concept;
      if (typeof childConcept.value === 'object' && childConcept.value !== null) {
        const updatedValue = { ...(childConcept.value as Record<string, Value>) };
        delete updatedValue[key];
        const updatedChildConcept = {
          ...childConcept,
          value: updatedValue
        };
        await agent.updateConcept(updatedChildConcept);
        setConceptData(await agent.getConcept(conceptId));
        onConceptUpdated();
      }
    }
  };

  const renderPropertySection = (section: keyof Concept['children'], title: string) => {
    if (!conceptData || !childConcepts[section]) return null;

    const childConcept = childConcepts[section] as Concept;
    const value = childConcept.value as ComplexValue;

    return (
      <div>
        <h3>{title}</h3>
        {Object.entries(value || {}).map(([key, propValue]) => (
          <GenericPropertyEditor
            key={key}
            propertyKey={key}
            propertyValue={propValue}
            onUpdate={(updatedKey, updatedValue) => handlePropertyUpdate(section, updatedKey, updatedValue)}
            onDelete={() => handlePropertyDelete(section, key)}
          />
        ))}
        <button onClick={() => handlePropertyAdd(section)}>Add {title}</button>
      </div>
    );
  };

  if (!conceptData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{('name' in conceptData) ? conceptData.name : 'Unnamed Concept'}</h2>
      <p>{('description' in conceptData) ? conceptData.description : 'No description available'}</p>

      {renderPropertySection('properties', 'Properties')}
      {renderPropertySection('relations', 'Relations')}
      {renderPropertySection('features', 'Features')}
      {renderPropertySection('actions', 'Actions')}
      {renderPropertySection('constraints', 'Constraints')}
      {renderPropertySection('events', 'Events')}
      {renderPropertySection('developmentIdeas', 'Development Ideas')}
      {renderPropertySection('openQuestions', 'Open Questions')}
    </div>
  );
};