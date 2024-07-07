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
