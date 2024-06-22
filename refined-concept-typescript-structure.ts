// Unique ID types
type ConceptID = `CC${string}`;
type PropertyID = `PROP${string}`;
type RelationID = `REL${string}`;
type FeatureID = `FEAT${string}`;
type ActionID = `ACT${string}`;
type ParameterID = `PARAM${string}`;
type ConstraintID = `CONS${string}`;
type EventID = `EVT${string}`;
type EventPropertyID = `EVTPROP${string}`;
type DevelopmentIdeaID = `DEV${string}`;
type OpenQuestionID = `QST${string}`;

// Concept Types
type ConceptType = 'Currency' | 'SmartContract' | 'Marketplace' | 'Governance' | 'User' | 'Transaction';

// Relation Types
type RelationType = 'IntegratesWith' | 'EssentialFor' | 'DependsOn' | 'Implements' | 'Extends';

// Action Parameter Types
type ParameterType = 'String' | 'Number' | 'Boolean' | 'Object' | 'Array';

// Value Types
type PrimitiveValue = string | number | boolean | null;
type ComplexValue = { [key: string]: Value };
type ArrayValue = Value[];
type Value = PrimitiveValue | ComplexValue | ArrayValue;

// Main Concept interface
interface Concept {
  id: ConceptID;
  type: ConceptType;
  name: string;
  summary: string;
  description: string;
}

// Properties interface
interface ConceptProperty {
  id: PropertyID;
  conceptId: ConceptID;
  key: string;
  value: Value;
}

// Relations interface
interface ConceptRelation {
  id: RelationID;
  sourceConceptId: ConceptID;
  targetConceptId: ConceptID;
  type: RelationType;
  label: string;
}

// Features interface
interface ConceptFeature {
  id: FeatureID;
  conceptId: ConceptID;
  name: string;
  value: boolean;
  description: string;
}

// Actions interface
interface ConceptAction {
  id: ActionID;
  conceptId: ConceptID;
  name: string;
  description: string;
}

// Action Parameters interface
interface ActionParameter {
  id: ParameterID;
  actionId: ActionID;
  name: string;
  type: ParameterType;
  defaultValue: Value;
}

// Constraints interface
interface ConceptConstraint {
  id: ConstraintID;
  conceptId: ConceptID;
  condition: string;
  message: string;
}

// Events interface
interface ConceptEvent {
  id: EventID;
  conceptId: ConceptID;
  type: string;
  description: string;
}

// Event Properties interface
interface EventProperty {
  id: EventPropertyID;
  eventId: EventID;
  key: string;
  value: Value;
}

// Development Ideas interface
interface DevelopmentIdea {
  id: DevelopmentIdeaID;
  conceptId: ConceptID;
  description: string;
}

// Open Questions interface
interface OpenQuestion {
  id: OpenQuestionID;
  conceptId: ConceptID;
  question: string;
}

// Example usage for One Coin concept
const oneCoinConcept: Concept = {
  id: "CC001",
  type: "Currency",
  name: "One Coin",
  summary: "Primary currency of the Crypto Coin Coherency Network",
  description: "One Coin is designed to facilitate transactions and value representation across the system."
};

const oneCoinProperties: ConceptProperty[] = [
  {
    id: "PROP001",
    conceptId: "CC001",
    key: "supportedCurrencies",
    value: ["USD", "EUR", "JPY", "BTC", "ETH"]
  },
  {
    id: "PROP002",
    conceptId: "CC001",
    key: "currentValue",
    value: 1.0
  }
];

const oneCoinRelations: ConceptRelation[] = [
  {
    id: "REL001",
    sourceConceptId: "CC001",
    targetConceptId: "CC003",
    type: "IntegratesWith",
    label: "Transaction Properties"
  },
  {
    id: "REL002",
    sourceConceptId: "CC001",
    targetConceptId: "CC006",
    type: "EssentialFor",
    label: "Marketplace"
  }
];

// Function to serialize Value to string for database storage
function serializeValue(value: Value): string {
  return JSON.stringify(value);
}

// Function to deserialize string to Value when retrieving from database
function deserializeValue(value: string): Value {
  return JSON.parse(value);
}

// Type guard to check if a value is a ComplexValue
function isComplexValue(value: Value): value is ComplexValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Type guard to check if a value is an ArrayValue
function isArrayValue(value: Value): value is ArrayValue {
  return Array.isArray(value);
}
