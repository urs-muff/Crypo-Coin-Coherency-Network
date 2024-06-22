// One Coin (CC001) Concept Document

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
    targetConceptId: "CC003", // Transaction Properties
    type: "IntegratesWith",
    label: "Integrates with Transaction Properties"
  },
  {
    id: "REL002",
    sourceConceptId: "CC001",
    targetConceptId: "CC006", // Marketplace
    type: "EssentialFor",
    label: "Essential for Marketplace operations"
  },
  {
    id: "REL003",
    sourceConceptId: "CC001",
    targetConceptId: "CC002", // Smart Contracts
    type: "DependsOn",
    label: "Depends on Smart Contracts for advanced operations"
  }
];

const oneCoinFeatures: ConceptFeature[] = [
  {
    id: "FEAT001",
    conceptId: "CC001",
    name: "Divisibility",
    value: true,
    description: "One Coin can be divided into smaller units"
  },
  {
    id: "FEAT002",
    conceptId: "CC001",
    name: "Transferability",
    value: true,
    description: "One Coin can be transferred between users"
  }
];

// Additional arrays for actions, constraints, events, etc. would follow
