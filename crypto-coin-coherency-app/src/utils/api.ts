import axios, { AxiosResponse } from 'axios';

import { Concept, Seed, Relationship, SynergyNode, Catalyst } from '../types/api';

const API_BASE_URL = 'http://localhost:9090';

async function apiCall<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

export const api = {
  getConcepts:    ()                  => apiCall<Concept[]>('/concepts'),
  getConcept:     (guid: string)      => apiCall<Concept>(`/concept/${guid}`),
  getConceptName: (conceptId: string) => apiCall<{ name: string }>(`/concept/${conceptId}/name`),
  updateConcept:  (concept: Concept)  => apiCall<Concept>(`/concept/${concept.ID}`, 'PUT', concept),
  addConcept:     (concept: Omit<Concept, 'ID' | 'Timestamp'>) => apiCall<{ guid: string; cid: string }>('/concept', 'POST', concept),
  deleteConcept:  (guid: string)      => apiCall(`/concept/${guid}`, 'DELETE'),

  getRelationships: () => apiCall<Relationship[]>('/relationships'),
  getRelationship: (id: string) => apiCall<Relationship>(`/relationship/${id}`),
  addRelationship: (relationship: Omit<Relationship, 'ID' | 'Timestamp'>) => apiCall<Relationship>('/relationship', 'POST', relationship),
  deepenRelationship: (id: string) => apiCall<Relationship>(`/relationship/${id}/deepen`, 'PUT'),

  getSeeds: () => apiCall<Seed[]>('/seeds'),
  getSeed: (guid: string) => apiCall<Seed>(`/seed/${guid}`),
  addSeed: <T extends Seed>(seed: Omit<T, 'SeedID' | 'Timestamp'>) => apiCall<{ guid: string; cid: string }>('/seed', 'POST', seed),
  deleteSeed: (guid: string) => apiCall(`/seed/${guid}`, 'DELETE'),

  getSteward: () => apiCall<SynergyNode>('/steward'),
  updateSteward: (steward: Partial<SynergyNode>) => apiCall<SynergyNode>('/steward', 'PUT', steward),

  addSeedWithConcept: <T extends Seed>(seed: T, conceptId: string) =>
    api.addSeed<T>({
      ...seed,
      ConceptID: conceptId}),

  addCatalyst: (catalyst: Omit<Catalyst, 'SeedID' | 'Timestamp'>) => 
    apiCall<{ guid: string; cid: string }>('/seed', 'POST', catalyst),
  updateCatalyst: (catalyst: Partial<Catalyst>) => 
    apiCall<Catalyst>(`/seed/${catalyst.SeedID}`, 'PUT', catalyst),
  deleteCatalyst: (seedId: string) => apiCall(`/seed/${seedId}`, 'DELETE'),
};