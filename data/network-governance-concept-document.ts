// Network Governance (CC008) Concept Document

const networkGovernanceConcept: Concept = {
  id: "CC008",
  type: "Governance",
  name: "Network Governance",
  summary: "Decentralized decision-making system for the Crypto Coin Coherency Network",
  description: "Network Governance enables stakeholders to propose, vote on, and implement changes to the network's rules and operations."
};

const networkGovernanceProperties: ConceptProperty[] = [
  {
    id: "PROP009",
    conceptId: "CC008",
    key: "votingMechanism",
    value: "StakeWeighted"
  },
  {
    id: "PROP010",
    conceptId: "CC008",
    key: "proposalTypes",
    value: ["ProtocolUpgrade", "ParameterChange", "FundingAllocation"]
  }
];

const networkGovernanceRelations: ConceptRelation[] = [
  {
    id: "REL014",
    sourceConceptId: "CC008",
    targetConceptId: "CC001", // One Coin
    type: "Governs",
    label: "Governs One Coin monetary policy"
  },
  {
    id: "REL015",
    sourceConceptId: "CC008",
    targetConceptId: "CC002", // Smart Contracts
    type: "Governs",
    label: "Governs Smart Contract standards and upgrades"
  },
  {
    id: "REL016",
    sourceConceptId: "CC008",
    targetConceptId: "CC006", // Marketplace
    type: "Governs",
    label: "Governs Marketplace rules and fees"
  },
  {
    id: "REL017",
    sourceConceptId: "CC008",
    targetConceptId: "CC007", // User Interactions
    type: "EssentialFor",
    label: "Essential for user participation in network decisions"
  }
];

const networkGovernanceFeatures: ConceptFeature[] = [
  {
    id: "FEAT009",
    conceptId: "CC008",
    name: "Decentralization",
    value: true,
    description: "Decision-making power is distributed among stakeholders"
  },
  {
    id: "FEAT010",
    conceptId: "CC008",
    name: "Upgradability",
    value: true,
    description: "Allows for evolution of the network over time"
  }
];

// Additional arrays for actions, constraints, events, etc. would follow
