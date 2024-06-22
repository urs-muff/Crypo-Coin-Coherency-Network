// File: src/agents/FlexibleConceptAgent.ts

import { ConceptID, Concept, PrimitiveValue, GenericConcept } from '../types/ConceptTypes';
import { PrimitiveConceptAgent } from './PrimitiveConceptAgent';
import { ArrayConceptAgent } from './ArrayConceptAgent';
import { DictionaryConceptAgent } from './DictionaryConceptAgent';
import { GenericConceptAgent } from './GenericConceptAgent';

export class FlexibleConceptAgent {
  private primitiveAgent: PrimitiveConceptAgent = new PrimitiveConceptAgent();
  private arrayAgent: ArrayConceptAgent = new ArrayConceptAgent();
  private dictionaryAgent: DictionaryConceptAgent = new DictionaryConceptAgent();
  private genericAgent: GenericConceptAgent = new GenericConceptAgent();

  async createConcept(concept: Concept): Promise<void> {
    switch (concept.type) {
      case 'Boolean':
      case 'Number':
      case 'String':
        this.primitiveAgent.createConcept(concept.id, concept.type, concept.value as PrimitiveValue, concept.metaConceptId);
        break;
      case 'Array':
        this.arrayAgent.createConcept(concept.id, concept.value as ConceptID[], concept.metaConceptId);
        break;
      case 'Dictionary':
        this.dictionaryAgent.createConcept(concept.id, concept.value as { [key: string]: ConceptID }, concept.metaConceptId);
        break;
      default:
        if ('name' in concept && 'description' in concept) {
          this.genericAgent.createConcept(
            concept.id,
            concept.type,
            concept.name,
            concept.description,
            concept.value,
            concept.metaConceptId
          );
        } else {
          throw new Error(`Invalid concept: ${JSON.stringify(concept)}`);
        }
    }
  }

  async getConcept(id: ConceptID): Promise<Concept | undefined> {
    return this.primitiveAgent.getConcept(id) ||
           this.arrayAgent.getConcept(id) ||
           this.dictionaryAgent.getConcept(id) ||
           this.genericAgent.getConcept(id);
  }

  async updateConcept(concept: Concept): Promise<void> {
    switch (concept.type) {
      case 'Boolean':
      case 'Number':
      case 'String':
        this.primitiveAgent.updateConcept(concept.id, concept.value as PrimitiveValue);
        break;
      case 'Array':
        this.arrayAgent.updateConcept(concept.id, concept.value as ConceptID[]);
        break;
      case 'Dictionary':
        this.dictionaryAgent.updateConcept(concept.id, concept.value as { [key: string]: ConceptID });
        break;
      default:
        if ('name' in concept && 'description' in concept) {
          this.genericAgent.updateConcept(concept.id, concept as GenericConcept);
        } else {
          throw new Error(`Invalid concept for update: ${JSON.stringify(concept)}`);
        }
    }
  }

  async deleteConcept(id: ConceptID): Promise<void> {
    this.primitiveAgent.deleteConcept(id);
    this.arrayAgent.deleteConcept(id);
    this.dictionaryAgent.deleteConcept(id);
    this.genericAgent.deleteConcept(id);
  }

  async getAllConcepts(): Promise<Concept[]> {
    const allConcepts = [
      ...this.primitiveAgent.getAllConcepts(),
      ...this.arrayAgent.getAllConcepts(),
      ...this.dictionaryAgent.getAllConcepts(),
      ...this.genericAgent.getAllConcepts()
    ];
    console.log('All concepts fetched:', allConcepts);  // Add this line for debugging
    return allConcepts;
  }
}