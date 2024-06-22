// File: src/types/BasicTypes.ts

// Unique ID types
export type ConceptID = `CC${string}`;
export type PropertyID = `PROP${string}`;
export type RelationID = `REL${string}`;
export type FeatureID = `FEAT${string}`;
export type ActionID = `ACT${string}`;
export type ParameterID = `PARAM${string}`;
export type ConstraintID = `CONS${string}`;
export type EventID = `EVT${string}`;
export type EventPropertyID = `EVTPROP${string}`;
export type DevelopmentIdeaID = `DEV${string}`;
export type OpenQuestionID = `QST${string}`;

// Concept Types
export type ConceptType = 'Currency' | 'SmartContract' | 'Marketplace' | 'Governance' | 'User' | 'Transaction';

// Relation Types
export type RelationType = 'IntegratesWith' | 'EssentialFor' | 'DependsOn' | 'Implements' | 'Extends' | 'Governs';

// Action Parameter Types
export type ParameterType = 'String' | 'Number' | 'Boolean' | 'Object' | 'Array';

// Value Types
export type PrimitiveValue = string | number | boolean | null;
export type ComplexValue = { [key: string]: Value };
export type ArrayValue = Value[];
export type Value = PrimitiveValue | ComplexValue | ArrayValue;

// Main Concept interface
export interface Concept {
  id: ConceptID;
  type: ConceptType;
  name: string;
  summary: string;
  description: string;
}

// Properties interface
export interface ConceptProperty {
  id: PropertyID;
  conceptId: ConceptID;
  key: string;
  value: Value;
}

// Relations interface
export interface ConceptRelation {
  id: RelationID;
  sourceConceptId: ConceptID;
  targetConceptId: ConceptID;
  type: RelationType;
  label: string;
}

// Features interface
export interface ConceptFeature {
  id: FeatureID;
  conceptId: ConceptID;
  name: string;
  value: boolean;
  description: string;
}

// Simplified interfaces for other concept aspects
export interface ConceptAction {
  id: ActionID;
  conceptId: ConceptID;
  name: string;
  description: string;
}

export interface ConceptConstraint {
  id: ConstraintID;
  conceptId: ConceptID;
  condition: string;
  message: string;
}

export interface ConceptEvent {
  id: EventID;
  conceptId: ConceptID;
  type: string;
  description: string;
}

export interface DevelopmentIdea {
  id: DevelopmentIdeaID;
  conceptId: ConceptID;
  description: string;
}

export interface OpenQuestion {
  id: OpenQuestionID;
  conceptId: ConceptID;
  question: string;
}
