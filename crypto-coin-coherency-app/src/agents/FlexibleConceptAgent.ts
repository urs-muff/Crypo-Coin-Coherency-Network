// File: src/agents/FlexibleConceptAgent.ts

import { ConceptInteractionAgent, ConceptData } from '../types/ConceptTypes';
import { Concept, ConceptID, ConceptProperty, PropertyID, ConceptRelation, RelationID, ConceptFeature, FeatureID } from '../types/BasicTypes';

export class FlexibleConceptAgent implements ConceptInteractionAgent {
  private getStorage(): { [key: string]: ConceptData } {
    const storageString = localStorage.getItem('conceptStorage');
    return storageString ? JSON.parse(storageString) : {};
  }

  private setStorage(storage: { [key: string]: ConceptData }): void {
    localStorage.setItem('conceptStorage', JSON.stringify(storage));
  }

  private getNextId(prefix: string): string {
    const storage = this.getStorage();
    const existingIds = Object.keys(storage)
      .filter(key => key.startsWith(prefix))
      .map(key => parseInt(key.slice(prefix.length)));
    const maxId = Math.max(0, ...existingIds);
    return `${prefix}${(maxId + 1).toString().padStart(3, '0')}`;
  }

  async getConcept(id: string): Promise<ConceptData> {
    console.log(`Getting concept with id: ${id}`);
    const storage = this.getStorage();
    const data = storage[id];
    if (!data) {
      console.log(`Concept with id ${id} not found`);
      throw new Error(`Concept with id ${id} not found`);
    }
    console.log(`Concept data retrieved:`, data);
    return JSON.parse(JSON.stringify(data)); // Return a deep copy
  }

  async updateConcept(data: ConceptData): Promise<void> {
    console.log(`Updating concept:`, data);
    const storage = this.getStorage();
    storage[data.concept.id] = JSON.parse(JSON.stringify(data)); // Store a deep copy
    this.setStorage(storage);
    console.log(`Storage after update:`, storage);
  }

  async getAllConcepts(): Promise<Concept[]> {
    console.log(`Getting all concepts`);
    const storage = this.getStorage();
    const concepts = Object.values(storage).map(data => data.concept);
    console.log(`Retrieved ${concepts.length} concepts:`, concepts);
    return concepts;
  }

  async createConcept(data: ConceptData): Promise<void> {
    console.log(`Creating new concept:`, data);
    const storage = this.getStorage();
    let conceptId: ConceptID;

    if (data.concept.id) {
      // Use the provided ID if it exists
      conceptId = data.concept.id;
      console.log(`Using provided concept ID: ${conceptId}`);
    } else {
      // Generate a new ID if none is provided
      conceptId = this.getNextId('CC') as ConceptID;
      console.log(`Generated new concept ID: ${conceptId}`);
    }

    const newData = {
      ...data,
      concept: { ...data.concept, id: conceptId }
    };

    // Check if a concept with this ID already exists
    if (storage[conceptId]) {
      console.log(`Concept with ID ${conceptId} already exists. Updating instead of creating.`);
      await this.updateConcept(newData);
    } else {
      storage[conceptId] = newData;
      this.setStorage(storage);
      console.log(`New concept created with id: ${conceptId}`);
    }

    console.log(`Storage after creation/update:`, storage);
  }

  async deleteConcept(id: string): Promise<void> {
    console.log(`Deleting concept with id: ${id}`);
    const storage = this.getStorage();
    delete storage[id];
    this.setStorage(storage);
    console.log(`Storage after deletion:`, storage);
  }

  // New methods for flexible editing

  async updateConceptField<K extends keyof Concept>(id: string, field: K, value: Concept[K]): Promise<void> {
    const data = await this.getConcept(id);
    data.concept[field] = value;
    await this.updateConcept(data);
  }

  async addProperty(conceptId: string, property: Omit<ConceptProperty, 'id' | 'conceptId'>): Promise<void> {
    const data = await this.getConcept(conceptId);
    const newId = this.getNextId('PROP') as PropertyID;
    data.properties.push({ ...property, id: newId, conceptId: conceptId as ConceptID });
    await this.updateConcept(data);
  }

  async updateProperty(conceptId: string, propertyId: string, updates: Partial<Omit<ConceptProperty, 'id' | 'conceptId'>>): Promise<void> {
    const data = await this.getConcept(conceptId);
    const index = data.properties.findIndex(p => p.id === propertyId);
    if (index !== -1) {
      data.properties[index] = { ...data.properties[index], ...updates };
      await this.updateConcept(data);
    }
  }

  async removeProperty(conceptId: string, propertyId: string): Promise<void> {
    const data = await this.getConcept(conceptId);
    data.properties = data.properties.filter(p => p.id !== propertyId);
    await this.updateConcept(data);
  }

  // Similar methods for relations, features, actions, constraints, events, development ideas, and open questions

  async addRelation(conceptId: string, relation: Omit<ConceptRelation, 'id'>): Promise<void> {
    const data = await this.getConcept(conceptId);
    const newId = this.getNextId('REL') as RelationID;
    data.relations.push({ ...relation, id: newId });
    await this.updateConcept(data);
  }

  async updateRelation(conceptId: string, relationId: string, updates: Partial<ConceptRelation>): Promise<void> {
    const data = await this.getConcept(conceptId);
    const index = data.relations.findIndex(r => r.id === relationId);
    if (index !== -1) {
      data.relations[index] = { ...data.relations[index], ...updates };
      await this.updateConcept(data);
    }
  }

  async removeRelation(conceptId: string, relationId: string): Promise<void> {
    const data = await this.getConcept(conceptId);
    data.relations = data.relations.filter(r => r.id !== relationId);
    await this.updateConcept(data);
  }

  // Implement similar methods for features, actions, constraints, events, development ideas, and open questions
  // For brevity, I'll omit those here, but you should implement them following the same pattern

  // Example for features:
  async addFeature(conceptId: string, feature: Omit<ConceptFeature, 'id'>): Promise<void> {
    const data = await this.getConcept(conceptId);
    const newId = this.getNextId('FEAT') as FeatureID;
    data.features.push({ ...feature, id: newId });
    await this.updateConcept(data);
  }

  // ... implement updateFeature and removeFeature similarly

  // Implement methods for actions, constraints, events, development ideas, and open questions following the same pattern
}