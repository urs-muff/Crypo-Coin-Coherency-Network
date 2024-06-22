// File: src/types/ConceptTypes.ts

export type ConceptID = string;
export type MetaConceptID = string;
export type ConceptType = string;  // Allow any string as concept type

export type PrimitiveValue = boolean | number | string | null;
export type ComplexValue = { [key: string]: Value };
export type ArrayValue = Value[];
export type Value = PrimitiveValue | ComplexValue | ArrayValue;

interface BaseConcept {
  id: ConceptID;
  type: ConceptType;
  metaConceptId: MetaConceptID;
  children: { [key: string]: ConceptID };
}

export interface PrimitiveConcept extends BaseConcept {
  value: PrimitiveValue;
}

export interface ArrayConcept extends BaseConcept {
  value: ArrayValue;
}

export interface DictionaryConcept extends BaseConcept {
  value: ComplexValue;
}

export interface GenericConcept extends BaseConcept {
  name: string;
  description: string;
  value: Value;
}

export interface MetaConcept extends GenericConcept {
}

export interface PropertyConcept extends GenericConcept {
  key: string;
}

export interface RelationConcept extends GenericConcept {
  sourceConceptId: ConceptID;
  targetConceptId: ConceptID;
  relationType: string;
}

export interface FeatureConcept extends GenericConcept {}

export interface ActionConcept extends GenericConcept {}

export interface ConstraintConcept extends GenericConcept {
  condition: string;
  message: string;
}

export interface EventConcept extends GenericConcept {
  eventType: string;
}

export interface DevelopmentIdeaConcept extends GenericConcept {}

export interface OpenQuestionConcept extends GenericConcept {
  question: string;
}

export type Concept = 
  | PrimitiveConcept 
  | ArrayConcept 
  | DictionaryConcept 
  | GenericConcept
  | MetaConcept
  | PropertyConcept
  | RelationConcept
  | FeatureConcept
  | ActionConcept
  | ConstraintConcept
  | EventConcept
  | DevelopmentIdeaConcept
  | OpenQuestionConcept;

export interface LatentSpaceVector {
  dimensions: number[];
}