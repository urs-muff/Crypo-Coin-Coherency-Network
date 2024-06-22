// File: src/agents/LocalStorageAgent.ts

import { ConceptInteractionAgent, ConceptData } from '../types/ConceptTypes';
import { Concept, ConceptID } from '../types/BasicTypes';

export class LocalStorageAgent implements ConceptInteractionAgent {
  private getNextId(prefix: string): string {
    const keys = Object.keys(localStorage);
    const existingIds = keys
      .filter(key => key.startsWith(`concept_${prefix}`))
      .map(key => parseInt(key.split('_')[2]));
    const maxId = Math.max(0, ...existingIds);
    return `${prefix}${(maxId + 1).toString().padStart(3, '0')}`;
  }

  async getConcept(id: string): Promise<ConceptData> {
    console.log(`Getting concept with id: ${id}`);
    const data = localStorage.getItem(`concept_${id}`);
    if (!data) {
      console.log(`Concept with id ${id} not found`);
      throw new Error(`Concept with id ${id} not found`);
    }
    console.log(`Concept data retrieved: ${data}`);
    return JSON.parse(data) as ConceptData;
  }

  async updateConcept(data: ConceptData): Promise<void> {
    console.log(`Updating concept: ${JSON.stringify(data)}`);
    localStorage.setItem(`concept_${data.concept.id}`, JSON.stringify(data));
    console.log('Concept updated successfully');
  }

  async getAllConcepts(): Promise<Concept[]> {
    console.log('Getting all concepts');
    const concepts: Concept[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('concept_')) {
        const data = JSON.parse(localStorage.getItem(key) || '');
        concepts.push(data.concept);
      }
    }
    console.log(`Retrieved ${concepts.length} concepts`);
    return concepts;
  }

  async createConcept(data: ConceptData): Promise<void> {
    console.log(`Creating new concept: ${JSON.stringify(data)}`);
    const newId = this.getNextId('CC') as ConceptID;
    const newData = {
      ...data,
      concept: {
        ...data.concept,
        id: newId
      }
    };
    localStorage.setItem(`concept_${newId}`, JSON.stringify(newData));
    console.log(`New concept created with id: ${newId}`);
  }

  async deleteConcept(id: string): Promise<void> {
    console.log(`Deleting concept with id: ${id}`);
    localStorage.removeItem(`concept_${id}`);
    console.log('Concept deleted successfully');
  }
}