// Transaction Properties (CC003) Concept Document

const transactionPropertiesConcept: Concept = {
  id: "CC003",
  type: "Transaction",
  name: "Transaction Properties",
  summary: "Defines characteristics and behaviors of transactions within the network",
  description: "Transaction Properties govern how transactions are processed, validated, and recorded in the Crypto Coin Coherency Network."
};

const transactionPropertiesProperties: ConceptProperty[] = [
  {
    id: "PROP005",
    conceptId: "CC003",
    key: "transactionTypes",
    value: ["Transfer", "Exchange", "SmartContractExecution"]
  },
  {
    id: "PROP006",
    conceptId: "CC003",
    key: "maxTransactionSize",
    value: 1000000 // in bytes
  }
];

const transactionPropertiesRelations: ConceptRelation[] = [
  {
    id: "REL007",
    sourceConceptId: "CC003",
    targetConceptId: "CC001", // One Coin
    type: "DependsOn",
    label: "Depends on One Coin for value representation"
  },
  {
    id: "REL008",
    sourceConceptId: "CC003",
    targetConceptId: "CC002", // Smart Contracts
    type: "IntegratesWith",
    label: "Integrates with Smart Contracts for complex transaction logic"
  },
  {
    id: "REL009",
    sourceConceptId: "CC003",
    targetConceptId: "CC007", // User Interactions
    type: "EssentialFor",
    label: "Essential for defining user transaction capabilities"
  }
];

const transactionPropertiesFeatures: ConceptFeature[] = [
  {
    id: "FEAT005",
    conceptId: "CC003",
    name: "Atomicity",
    value: true,
    description: "Transactions are all-or-nothing operations"
  },
  {
    id: "FEAT006",
    conceptId: "CC003",
    name: "Immutability",
    value: true,
    description: "Completed transactions cannot be altered or reversed"
  }
];

// Additional arrays for actions, constraints, events, etc. would follow
