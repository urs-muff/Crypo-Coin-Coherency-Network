// File: src/types/CoherencyNetworkTypes.ts

// Basic types
export type ConceptID = string;
export type MetaConceptID = string;

// Value types
export type PrimitiveValue = boolean | number | string | null;
export type ComplexValue = { [key: string]: Value };
export type ArrayValue = Value[];
export type Value = PrimitiveValue | ComplexValue | ArrayValue;

// Base concept interface
export interface BaseConcept {
  id: ConceptID;              // Unique identifier for the concept
  type: string;               // Type of the concept (e.g., "OneCoin", "SmartContract")
  metaConceptId: MetaConceptID; // ID of the meta-concept this concept is based on
  name: string;               // Human-readable name of the concept
  description: string;        // Detailed description of the concept
  value: Value;               // Specific data structure for this concept type
  children: { [key: string]: ConceptID }; // Related sub-concepts
}

// Specific concept types

/**
 * OneCoin: The primary currency of the Crypto Coin Coherency Network
 * 
 * Fields:
 * - totalSupply: The maximum number of coins that can exist
 * - circulatingSupply: The number of coins currently in circulation
 * - supportedCurrencies: List of currencies that can be used to trade One Coin
 */
export interface OneCoinConcept extends BaseConcept {
  type: 'OneCoin';
  value: {
    totalSupply: number;
    circulatingSupply: number;
    supportedCurrencies: string[];
  };
}

/**
 * SmartContract: Automated agreements and actions within the network
 * 
 * Fields:
 * - code: The actual code of the smart contract
 * - triggeredBy: List of concept IDs that can trigger this contract
 * - affects: List of concept IDs that this contract can modify
 */
export interface SmartContractConcept extends BaseConcept {
  type: 'SmartContract';
  value: {
    code: string;
    triggeredBy: ConceptID[];
    affects: ConceptID[];
  };
}

/**
 * TransactionProperties: Defines the characteristics of transactions in the network
 * 
 * Fields:
 * - sellers: Map of seller IDs to their percentage share in the transaction
 * - buyers: Map of buyer IDs to their percentage share in the transaction
 * - publicLinks: List of concept IDs that are publicly linked to this transaction
 * - privateLinks: List of concept IDs that are privately linked to this transaction
 * - sizeLimit: Optional limit on the size of the transaction
 */
export interface TransactionPropertiesConcept extends BaseConcept {
  type: 'TransactionProperties';
  value: {
    sellers: { [id: string]: number };
    buyers: { [id: string]: number };
    publicLinks: ConceptID[];
    privateLinks: ConceptID[];
    sizeLimit?: number;
  };
}

/**
 * ConceptSystem: Manages the overall structure and interaction of concepts
 * 
 * Fields:
 * - publicInterface: Description of how concepts can be interacted with
 * - interactionMethods: List of ways concepts can interact with each other
 */
export interface ConceptSystemConcept extends BaseConcept {
  type: 'ConceptSystem';
  value: {
    publicInterface: string;
    interactionMethods: string[];
  };
}

/**
 * ConceptLinks: Represents connections between different concepts
 * 
 * Fields:
 * - source: ID of the source concept
 * - target: ID of the target concept
 * - linkType: Type of relationship between the concepts
 * - timestamp: When the link was created or last updated
 */
export interface ConceptLinksConcept extends BaseConcept {
  type: 'ConceptLinks';
  value: {
    source: ConceptID;
    target: ConceptID;
    linkType: string;
    timestamp: number;
  };
}

/**
 * Marketplace: Facilitates the exchange of concepts and value in the network
 * 
 * Fields:
 * - listings: List of concept IDs representing items for sale
 * - transactions: List of concept IDs representing completed transactions
 */
export interface MarketplaceConcept extends BaseConcept {
  type: 'Marketplace';
  value: {
    listings: ConceptID[];
    transactions: ConceptID[];
  };
}

/**
 * MemberInteractions: Tracks how members interact with the network
 * 
 * Fields:
 * - memberId: Unique identifier for the member
 * - interactions: List of interactions, including type, target, and timestamp
 */
export interface MemberInteractionsConcept extends BaseConcept {
  type: 'MemberInteractions';
  value: {
    memberId: string;
    interactions: {
      type: string;
      targetId: ConceptID;
      timestamp: number;
    }[];
  };
}

/**
 * NetworkGovernance: Manages the rules and decision-making processes of the network
 * 
 * Fields:
 * - rules: List of governance rules
 * - approvedHandlers: List of entities approved to execute certain network functions
 * - votingMechanisms: List of methods used for collective decision-making
 */
export interface NetworkGovernanceConcept extends BaseConcept {
  type: 'NetworkGovernance';
  value: {
    rules: string[];
    approvedHandlers: string[];
    votingMechanisms: string[];
  };
}

/**
 * UnityConsciousness: Represents the core principle of interconnectedness
 * 
 * Fields:
 * - principles: List of key principles of unity consciousness
 * - implementationGuidelines: Guidelines for applying unity consciousness in the network
 */
export interface UnityConsciousnessConcept extends BaseConcept {
  type: 'UnityConsciousness';
  value: {
    principles: string[];
    implementationGuidelines: string[];
  };
}

/**
 * FlowStateCollaboration: Facilitates optimal collaborative experiences
 * 
 * Fields:
 * - collaborationFramework: Description of how flow state collaboration is structured
 * - skillMatchingCriteria: Criteria used to match collaborators
 * - productivityMetrics: Metrics used to measure flow state productivity
 */
export interface FlowStateCollaborationConcept extends BaseConcept {
  type: 'FlowStateCollaboration';
  value: {
    collaborationFramework: string;
    skillMatchingCriteria: string[];
    productivityMetrics: string[];
  };
}

/**
 * CoherenceRewards: System for incentivizing actions that increase network coherence
 * 
 * Fields:
 * - rewardMetrics: Metrics used to calculate rewards
 * - assessmentMechanism: Method for assessing coherence of actions
 * - distributionRules: Rules for distributing rewards
 */
export interface CoherenceRewardsConcept extends BaseConcept {
  type: 'CoherenceRewards';
  value: {
    rewardMetrics: string[];
    assessmentMechanism: string;
    distributionRules: string;
  };
}

/**
 * AlternativeGovernanceStructures: Explores new forms of organization and decision-making
 * 
 * Fields:
 * - modelName: Name of the governance model
 * - principles: Core principles of the governance model
 * - implementationSteps: Steps for implementing the governance model
 */
export interface AlternativeGovernanceStructuresConcept extends BaseConcept {
  type: 'AlternativeGovernanceStructures';
  value: {
    modelName: string;
    principles: string[];
    implementationSteps: string[];
  };
}

/**
 * HolisticHealthcare: Integrated approach to health and wellbeing
 * 
 * Fields:
 * - approaches: Different holistic healthcare methods
 * - integrationMethods: Ways to integrate various health approaches
 * - outcomeMeasures: Metrics for measuring health outcomes
 */
export interface HolisticHealthcareConcept extends BaseConcept {
  type: 'HolisticHealthcare';
  value: {
    approaches: string[];
    integrationMethods: string[];
    outcomeMeasures: string[];
  };
}

/**
 * CoherenceVisualization: Tools for visualizing network coherence
 * 
 * Fields:
 * - visualizationTechnique: Method used for visualization
 * - dataPoints: Types of data included in the visualization
 * - interactionMethods: Ways users can interact with the visualization
 */
export interface CoherenceVisualizationConcept extends BaseConcept {
  type: 'CoherenceVisualization';
  value: {
    visualizationTechnique: string;
    dataPoints: string[];
    interactionMethods: string[];
  };
}

/**
 * MultidimensionalImpactAssessment: System for evaluating the holistic impact of actions
 * 
 * Fields:
 * - dimensions: Different aspects considered in the assessment
 * - measurementTechniques: Methods for measuring impact in each dimension
 * - weightings: Relative importance of each dimension
 */
export interface MultidimensionalImpactAssessmentConcept extends BaseConcept {
  type: 'MultidimensionalImpactAssessment';
  value: {
    dimensions: string[];
    measurementTechniques: { [dimension: string]: string };
    weightings: { [dimension: string]: number };
  };
}

/**
 * EvolutionaryLearningPathways: Adaptive learning system for network participants
 * 
 * Fields:
 * - learningModules: List of available learning modules
 * - adaptationMechanisms: Methods for adapting the learning path
 * - progressMetrics: Ways to measure learning progress
 */
export interface EvolutionaryLearningPathwaysConcept extends BaseConcept {
  type: 'EvolutionaryLearningPathways';
  value: {
    learningModules: ConceptID[];
    adaptationMechanisms: string[];
    progressMetrics: string[];
  };
}

/**
 * CoherenceDrivenConsensus: Decision-making process based on network coherence
 * 
 * Fields:
 * - decisionStages: Stages in the consensus-building process
 * - consensusMechanisms: Methods for reaching consensus
 * - coherenceMetrics: Measures of coherence used in decision-making
 */
export interface CoherenceDrivenConsensusConcept extends BaseConcept {
  type: 'CoherenceDrivenConsensus';
  value: {
    decisionStages: string[];
    consensusMechanisms: string[];
    coherenceMetrics: string[];
  };
}

/**
 * RegenerativeValueCirculation: System for continuous value generation and circulation
 * 
 * Fields:
 * - circulationMechanisms: Methods for circulating value in the network
 * - regenerationPrinciples: Principles for regenerating value
 * - valueMeasures: Ways to measure and track value in the system
 */
export interface RegenerativeValueCirculationConcept extends BaseConcept {
  type: 'RegenerativeValueCirculation';
  value: {
    circulationMechanisms: string[];
    regenerationPrinciples: string[];
    valueMeasures: string[];
  };
}

// Union type for all concepts
export type Concept =
  | OneCoinConcept
  | SmartContractConcept
  | TransactionPropertiesConcept
  | ConceptSystemConcept
  | ConceptLinksConcept
  | MarketplaceConcept
  | MemberInteractionsConcept
  | NetworkGovernanceConcept
  | UnityConsciousnessConcept
  | FlowStateCollaborationConcept
  | CoherenceRewardsConcept
  | AlternativeGovernanceStructuresConcept
  | HolisticHealthcareConcept
  | CoherenceVisualizationConcept
  | MultidimensionalImpactAssessmentConcept
  | EvolutionaryLearningPathwaysConcept
  | CoherenceDrivenConsensusConcept
  | RegenerativeValueCirculationConcept;

/**
 * ConceptRelation: Represents a relationship between two concepts
 * 
 * Fields:
 * - source: ID of the source concept
 * - target: ID of the target concept
 * - relationType: Type of relationship (e.g., "implements", "contains", "influences")
 */
export interface ConceptRelation {
  source: ConceptID;
  target: ConceptID;
  relationType: string;
}

/**
 * CoherencyNetwork: Represents the entire network of concepts and their relations
 * 
 * Fields:
 * - concepts: Map of all concepts in the network, keyed by their IDs
 * - relations: List of all relationships between concepts
 */
export interface CoherencyNetwork {
  concepts: { [id: ConceptID]: Concept };
  relations: ConceptRelation[];
}

// Example usage:
const exampleNetwork: CoherencyNetwork = {
  concepts: {
    "CC001": {
      id: "CC001",
      type: "OneCoin",
      metaConceptId: "META001",
      name: "One Coin",
      description: "The primary currency of the Crypto Coin Coherency Network",
      value: {
        totalSupply: 1000000000,
        circulatingSupply: 500000000,
        supportedCurrencies: ["USD", "EUR", "BTC"]
      },
      children: {}
    },
    // ... other concepts ...
  },
  relations: [
    {
      source: "CC001",
      target: "COH003",
      relationType: "implements"
    },
    // ... other relations ...
  ]
};