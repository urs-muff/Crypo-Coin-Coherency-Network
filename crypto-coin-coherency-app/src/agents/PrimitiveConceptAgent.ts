// File: src/agents/PrimitiveConceptAgent.ts

import { ConceptID, PrimitiveConcept, PrimitiveValue, MetaConceptID } from '../types/ConceptTypes';

export class PrimitiveConceptAgent {
  private concepts: Map<ConceptID, PrimitiveConcept> = new Map();

  createConcept(id: ConceptID, type: 'Boolean' | 'Number' | 'String', value: PrimitiveValue, metaConceptId: MetaConceptID): void {
    if (this.concepts.has(id)) {
      throw new Error(`Concept with id ${id} already exists`);
    }
    const concept: PrimitiveConcept = {
      id,
      type,
      value,
      metaConceptId,
      children: {}
    };
    this.concepts.set(id, concept);
  }

  getConcept(id: ConceptID): PrimitiveConcept | undefined {
    return this.concepts.get(id);
  }

  updateConcept(id: ConceptID, value: PrimitiveValue): void {
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

  getAllConcepts(): PrimitiveConcept[] {
    return Array.from(this.concepts.values());
  }
}