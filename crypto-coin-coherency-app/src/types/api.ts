// src/types/api.ts
export interface Concept {
  ID: string;
  Name: string;
  Description: string;
  Type: string;
  Timestamp: string;
}

export interface Relationship {
  ID: string;
  SourceID: string;
  TargetID: string;
  Type: string;
  EnergyFlow: number;
  FrequencySpec: number[];
  Amplitude: number;
  Volume: number;
  Depth: number;
  Interactions: number;
  LastInteraction: string;
  Timestamp: string;
}

export interface Seed {
  SeedID: string;
  ConceptID: string;
  Name: string;
  Description: string;
  Timestamp: string;
}

export interface EnergyToken extends Seed {
  Value: number;
}

export interface Catalyst extends Seed {
  Steward: string;
}

export interface SynergyNode extends Seed {
  EnergyBalance: number;
}

export interface FlowEvent extends Seed {
  From: string;
  To: string;
  Amount: number;
}

export interface HarmonyAgreement extends Seed {
  Parties: string[];
  Terms: string;
  Status: 'active' | 'completed' | 'terminated';
}

export interface Investment extends Seed {
  InvestorID: string;
  TargetID: string;
  TargetType: 'concept' | 'synergyNode';
  Amount: number;
}
