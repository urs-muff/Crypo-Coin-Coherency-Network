// File: src/agents/DictionaryConceptAgent.ts

import { ConceptID, DictionaryConcept, MetaConceptID } from '../types/ConceptTypes';

export class DictionaryConceptAgent {
  private concepts: Map<ConceptID, DictionaryConcept> = new Map();

  createConcept(id: ConceptID, value: { [key: string]: ConceptID } = {}, metaConceptId: MetaConceptID): void {
    if (this.concepts.has(id)) {
      throw new Error(`Concept with id ${id} already exists`);
    }
    const concept: DictionaryConcept = {
      id,
      type: 'Dictionary',
      value,
      metaConceptId,
      children: {}
    };
    this.concepts.set(id, concept);
  }
  getConcept(id: ConceptID): DictionaryConcept | undefined {
    return this.concepts.get(id);
  }

  updateConcept(id: ConceptID, value: { [key: string]: ConceptID }): void {
    const concept = this.concepts.get(id);
    if (!concept) {
      throw new Error(`Concept with id ${id} does not exist`);
    }
    concept.value = value;
  }

  deleteConcept(id: ConceptID): void {
    if (!this.concepts.has(id)) {
      throw new Error(`Concept with id ${id} does not exist`);
    }
    this.concepts.delete(id);
  }

  getAllConcepts(): DictionaryConcept[] {
    return Array.from(this.concepts.values());
  }

  addKeyValueToConcept(id: ConceptID, key: string, valueId: ConceptID): void {
    const concept = this.concepts.get(id);
    if (!concept) {
      throw new Error(`Concept with id ${id} does not exist`);
    }
    if (typeof concept.value === 'object' && concept.value !== null && !Array.isArray(concept.value)) {
      (concept.value as Record<string, ConceptID>)[key] = valueId;
    } else {
      throw new Error(`Concept with id ${id} is not a dictionary`);
    }
  }

  removeKeyFromConcept(id: ConceptID, key: string): void {
    const concept = this.concepts.get(id);
    if (!concept) {
      throw new Error(`Concept with id ${id} does not exist`);
    }
    if (typeof concept.value === 'object' && concept.value !== null && !Array.isArray(concept.value)) {
      delete (concept.value as Record<string, ConceptID>)[key];
    } else {
      throw new Error(`Concept with id ${id} is not a dictionary`);
    }
  }
}