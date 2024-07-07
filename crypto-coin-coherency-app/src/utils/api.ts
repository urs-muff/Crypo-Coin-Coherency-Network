import axios, { AxiosResponse } from 'axios';

import { Concept, Seed, Relationship, Investment } from '../types/api';

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
  getConcepts: () => apiCall<Concept[]>('/concepts'),
  getConcept: (guid: string) => apiCall<Concept>(`/concept/${guid}`),
  updateConcept: (concept: Concept) => apiCall<Concept>(`/concept/${concept.ID}`, 'PUT', concept),
  addConcept: (concept: Omit<Concept, 'ID' | 'Timestamp'>) => apiCall<{ guid: string; cid: string }>('/concept', 'POST', concept),
  deleteConcept: (guid: string) => apiCall(`/concept/${guid}`, 'DELETE'),

  getRelationships: () => apiCall<Relationship[]>('/relationships'),
  getRelationship: (id: string) => apiCall<Relationship>(`/relationship/${id}`),
  addRelationship: (relationship: Omit<Relationship, 'ID' | 'Timestamp'>) => apiCall<Relationship>('/relationship', 'POST', relationship),
  deepenRelationship: (id: string) => apiCall<Relationship>(`/relationship/${id}/deepen`, 'PUT'),

  getSeeds: () => apiCall<Seed[]>('/seeds'),
  getSeed: (guid: string) => apiCall<Seed>(`/seed/${guid}`),
  addSeed: <T extends Seed>(seed: Omit<T, 'SeedID' | 'Timestamp'>) => apiCall<{ guid: string; cid: string }>('/seed', 'POST', seed),
  deleteSeed: (guid: string) => apiCall(`/seed/${guid}`, 'DELETE'),

  addInvestment: (investment: Omit<Investment, 'SeedID' | 'Timestamp' | 'ConceptID'>, conceptId: string) => {
    console.log(`addInvestment: ${JSON.stringify(investment)}, conceptId=${conceptId}`);
    return api.addSeed<Investment>({
      ...investment,
      ConceptID: conceptId})},
};