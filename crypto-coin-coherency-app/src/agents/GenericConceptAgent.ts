// File: src/agents/GenericConceptAgent.ts

import { ConceptID, GenericConcept, ConceptType, Value, MetaConceptID } from '../types/ConceptTypes';

export class GenericConceptAgent {
  private concepts: Map<ConceptID, GenericConcept> = new Map();

  createConcept(id: ConceptID, type: ConceptType, name: string, description: string, value: Value, metaConceptId: MetaConceptID): void {
    if (this.concepts.has(id)) {
      console.log(`Concept with id ${id} already exists. Skipping creation.`);
      return;
    }
    const concept: GenericConcept = { id, type, name, description, value, metaConceptId, children: {} };
    this.concepts.set(id, concept);
  }

  getConcept(id: ConceptID): GenericConcept | undefined {
    return this.concepts.get(id);
  }

  updateConcept(id: ConceptID, updates: Partial<GenericConcept>): void {
    const concept = this.concepts.get(id);
    if (!concept) {
      throw new Error(`Concept with id ${id} does not exist`);
    }
    Object.assign(concept, updates);
  }

  deleteConcept(id: ConceptID): void {
    this.concepts.delete(id);
  }

  getAllConcepts(): GenericConcept[] {
    return Array.from(this.concepts.values());
  }
}