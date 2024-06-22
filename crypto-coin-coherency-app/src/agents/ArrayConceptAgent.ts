// File: src/agents/ArrayConceptAgent.ts

import { ConceptID, ArrayConcept, MetaConceptID } from '../types/ConceptTypes';

export class ArrayConceptAgent {
  private concepts: Map<ConceptID, ArrayConcept> = new Map();

  createConcept(id: ConceptID, value: ConceptID[] = [], metaConceptId: MetaConceptID): void {
    if (this.concepts.has(id)) {
      throw new Error(`Concept with id ${id} already exists`);
    }
    const concept: ArrayConcept = {
      id,
      type: 'Array',
      value,
      metaConceptId,
      children: {}
    };
    this.concepts.set(id, concept);
  }

  getConcept(id: ConceptID): ArrayConcept | undefined {
    return this.concepts.get(id);
  }

  updateConcept(id: ConceptID, value: ConceptID[]): void {
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

  getAllConcepts(): ArrayConcept[] {
    return Array.from(this.concepts.values());
  }

  addElementToConcept(id: ConceptID, elementId: ConceptID): void {
    const concept = this.concepts.get(id);
    if (!concept) {
      throw new Error(`Concept with id ${id} does not exist`);
    }
    if (Array.isArray(concept.value)) {
      concept.value.push(elementId);
    } else {
      throw new Error(`Concept with id ${id} is not an array`);
    }
  }

  removeElementFromConcept(id: ConceptID, elementId: ConceptID): void {
    const concept = this.concepts.get(id);
    if (!concept) {
      throw new Error(`Concept with id ${id} does not exist`);
    }
    if (Array.isArray(concept.value)) {
      concept.value = concept.value.filter(id => id !== elementId);
    } else {
      throw new Error(`Concept with id ${id} is not an array`);
    }
  }
}