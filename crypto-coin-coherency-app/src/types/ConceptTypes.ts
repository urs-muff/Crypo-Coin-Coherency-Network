// File: src/types/ConceptTypes.ts

import { 
  Concept, 
  ConceptProperty, 
  ConceptRelation, 
  ConceptFeature, 
  ConceptAction, 
  ConceptConstraint, 
  ConceptEvent, 
  DevelopmentIdea, 
  OpenQuestion 
} from './BasicTypes';

export interface ConceptData {
  concept: Concept;
  properties: ConceptProperty[];
  relations: ConceptRelation[];
  features: ConceptFeature[];
  actions: ConceptAction[];
  constraints: ConceptConstraint[];
  events: ConceptEvent[];
  developmentIdeas: DevelopmentIdea[];
  openQuestions: OpenQuestion[];
}

export interface ConceptInteractionAgent {
  getConcept: (id: string) => Promise<ConceptData>;
  updateConcept: (data: ConceptData) => Promise<void>;
  getAllConcepts: () => Promise<Concept[]>;
  createConcept: (data: ConceptData) => Promise<void>;
  deleteConcept: (id: string) => Promise<void>;
}