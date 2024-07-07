// src/hooks/useConceptIds.ts
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';

export const useConceptIds = () => {
  const [conceptIds, setConceptIds] = useState<Record<string, string>>({});
  const { data: concepts } = useQuery('concepts', api.getConcepts);

  useEffect(() => {
    if (concepts) {
      const ids: Record<string, string> = {};
      concepts.forEach(concept => {
        switch (concept.Name) {
          case 'Coin':
            ids.ENERGY_TOKEN = concept.ID;
            break;
          case 'Asset':
            ids.CATALYST = concept.ID;
            break;
          case 'Steward':
            ids.SYNERGY_NODE = concept.ID;
            break;
          case 'Transaction':
            ids.FLOW_EVENT = concept.ID;
            break;
          case 'Smart Contract':
            ids.HARMONY_AGREEMENT = concept.ID;
            break;
          case 'Concept Investment':
            ids.CONCEPT_INVESTMENT = concept.ID;
            break;
          case 'Seed Investment':
            ids.SEED_INVESTMENT = concept.ID;
            break;
        }
      });
      // console.log(`Concept IDs: ${JSON.stringify(ids)}`);
      setConceptIds(ids);
    }
  }, [concepts]);

  return conceptIds;
};