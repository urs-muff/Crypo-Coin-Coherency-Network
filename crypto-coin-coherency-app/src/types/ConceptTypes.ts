// File: src/types/ConceptTypes.ts

export type ConceptID = string;
export type MetaConceptID = string;
export type ConceptType = string;

export type PrimitiveValue = boolean | number | string | null;
export type ComplexValue = { [key: string]: Value };
export type ArrayValue = Value[];
export type Value = PrimitiveValue | ComplexValue | ArrayValue;

export interface BaseConcept {
  id: ConceptID;
  type: ConceptType;
  metaConceptId: MetaConceptID;
  value: Value;
  children: { [key: string]: ConceptID };
}

export interface PrimitiveConcept extends BaseConcept {
  type: 'Boolean' | 'Number' | 'String';
}

export interface ArrayConcept extends BaseConcept {
  type: 'Array';
}

export interface DictionaryConcept extends BaseConcept {
  type: 'Dictionary';
}

export interface GenericConcept extends BaseConcept {
  name: string;
  description: string;
}

export interface PropertyConcept extends GenericConcept {
  type: 'Property';
  key: string;
}

export interface RelationConcept extends GenericConcept {
  type: 'Relation';
  sourceConceptId: ConceptID;
  targetConceptId: ConceptID;
  relationType: string;
}

export interface FeatureConcept extends GenericConcept {
  type: 'Feature';
}

export interface ActionConcept extends GenericConcept {
  type: 'Action';
}

export interface ConstraintConcept extends GenericConcept {
  type: 'Constraint';
  condition: string;
  message: string;
}

export interface EventConcept extends GenericConcept {
  type: 'Event';
  eventType: string;
}

export interface DevelopmentIdeaConcept extends GenericConcept {
  type: 'DevelopmentIdea';
}

export interface OpenQuestionConcept extends GenericConcept {
  type: 'OpenQuestion';
  question: string;
}

// Meta-concept interfaces
export interface MetaConcept extends BaseConcept {
  type: 'MetaConcept';
  name: string;
  description: string;
}

export type Concept = 
  | PrimitiveConcept
  | ArrayConcept
  | DictionaryConcept
  | GenericConcept
  | PropertyConcept
  | RelationConcept
  | FeatureConcept
  | ActionConcept
  | ConstraintConcept
  | EventConcept
  | DevelopmentIdeaConcept
  | OpenQuestionConcept
  | MetaConcept;

export interface LatentSpaceVector {
  dimensions: number[];
}