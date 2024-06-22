// File: src/components/ConceptDetail.tsx

import React, { useState, useEffect } from 'react';
import { Concept, ConceptID, Value, GenericConcept } from '../types/ConceptTypes';
import { FlexibleConceptAgent } from '../agents/FlexibleConceptAgent';
import { GenericPropertyEditor } from './GenericPropertyEditor';

interface ConceptDetailProps {
  agent: FlexibleConceptAgent;
  conceptId: ConceptID;
  onConceptUpdated: () => void;
  onNavigateToChild: (childId: ConceptID) => void;
}

export const ConceptDetail: React.FC<ConceptDetailProps> = ({ 
  agent, conceptId, onConceptUpdated, onNavigateToChild 
}) => {
  const [concept, setConcept] = useState<Concept | null>(null);
  const [metaConcept, setMetaConcept] = useState<Concept | null>(null);
  const [children, setChildren] = useState<Concept[]>([]);

  useEffect(() => {
    const fetchConceptDetails = async () => {
      const fetchedConcept = await agent.getConcept(conceptId);
      setConcept(fetchedConcept || null);

      if (fetchedConcept && fetchedConcept.metaConceptId) {
        const fetchedMetaConcept = await agent.getConcept(fetchedConcept.metaConceptId);
        setMetaConcept(fetchedMetaConcept || null);
      }

      if (fetchedConcept && fetchedConcept.children) {
        const fetchedChildren = await Promise.all(
          Object.values(fetchedConcept.children).map(childId => agent.getConcept(childId))
        );
        setChildren(fetchedChildren.filter((child): child is Concept => child !== undefined));
      }
    };

    fetchConceptDetails();
  }, [agent, conceptId]);

  const handleUpdateConcept = async (updates: Partial<Concept>) => {
    if (concept) {
      const updatedConcept = { ...concept };
      
      (Object.keys(updates) as Array<keyof Concept>).forEach(key => {
        if (key in concept) {
          (updatedConcept as any)[key] = updates[key];
        }
      });

      await agent.updateConcept(updatedConcept);
      setConcept(updatedConcept);
      onConceptUpdated();
    }
  };

  const handleAddChild = async () => {
    if (concept) {
      const newChildId = `CHILD${Date.now()}` as ConceptID;
      const newChild: GenericConcept = {
        id: newChildId,
        type: 'Generic',
        metaConceptId: concept.metaConceptId,
        name: 'New Child',
        description: 'Description of new child concept',
        value: {},
        children: {}
      };
      await agent.createConcept(newChild);
      const updatedConcept = {
        ...concept,
        children: { ...concept.children, [newChildId]: newChildId }
      };
      await agent.updateConcept(updatedConcept);
      setConcept(updatedConcept);
      setChildren([...children, newChild]);
      onConceptUpdated();
    }
  };

  const handleRemoveChild = async (childId: ConceptID) => {
    if (concept) {
      const { [childId]: removed, ...remainingChildren } = concept.children;
      const updatedConcept = { ...concept, children: remainingChildren };
      await agent.updateConcept(updatedConcept);
      await agent.deleteConcept(childId);
      setConcept(updatedConcept);
      setChildren(children.filter(child => child.id !== childId));
      onConceptUpdated();
    }
  };

  const groupChildrenByType = (children: Concept[]) => {
    return children.reduce((groups, child) => {
      const group = groups[child.type] || [];
      return { ...groups, [child.type]: [...group, child] };
    }, {} as Record<string, Concept[]>);
  };

  if (!concept) return <div>Loading...</div>;

  const isGenericConcept = (c: Concept): c is GenericConcept => 
    'name' in c && 'description' in c;

  const groupedChildren = groupChildrenByType(children);

  return (
    <div>
      <h2>{isGenericConcept(concept) ? concept.name : concept.id}</h2>
      <p>Type: {concept.type}</p>
      <p>Meta-Concept: {metaConcept && isGenericConcept(metaConcept) ? metaConcept.name : 'N/A'}</p>
      
      <h3>Description</h3>
      <div style={{ 
        border: '1px solid #ccc', 
        padding: '10px', 
        minHeight: '100px', 
        marginBottom: '20px' 
      }}>
        {isGenericConcept(concept) ? concept.description : 'No description available'}
      </div>

      <h3>Children</h3>
      {Object.entries(groupedChildren).map(([type, conceptsOfType]) => (
        <div key={type}>
          <h4>{type}</h4>
          <ul>
            {conceptsOfType.map(child => (
              <li key={child.id}>
                <button onClick={() => onNavigateToChild(child.id)}>
                  {isGenericConcept(child) ? child.name : child.id}
                </button>
                <button onClick={() => handleRemoveChild(child.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={handleAddChild}>Add Child</button>

      <h3>Properties</h3>
      {typeof concept.value === 'object' && concept.value !== null && !Array.isArray(concept.value) && 
        Object.entries(concept.value).map(([key, value]) => (
          <GenericPropertyEditor
            key={key}
            propertyKey={key}
            propertyValue={value as Value}
            onUpdate={(updatedKey, updatedValue) => {
              const newValue = { ...concept.value as Record<string, Value>, [updatedKey]: updatedValue };
              handleUpdateConcept({ value: newValue });
            }}
            onDelete={() => {
              const { [key]: deleted, ...rest } = concept.value as Record<string, Value>;
              handleUpdateConcept({ value: rest });
            }}
          />
        ))}
      <button onClick={() => {
        const newKey = `property${Date.now()}`;
        const newValue = typeof concept.value === 'object' && concept.value !== null
          ? { ...concept.value as Record<string, Value>, [newKey]: '' }
          : { [newKey]: '' };
        handleUpdateConcept({ value: newValue });
      }}>Add Property</button>
    </div>
  );
};