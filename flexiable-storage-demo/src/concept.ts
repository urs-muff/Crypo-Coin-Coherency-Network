import { v4 as uuidv4 } from 'uuid';

interface Stake {
  conceptId: string;  // ID of the related concept
  factor: number;     // Stake or alignment factor (0-1)
}

class Concept {
  id: string;
  name: string;
  description: string;
  typeId: string;     // ID of the concept representing this concept's type
  owners: Stake[];
  alignedConcepts: Stake[];  // New property for aligned concepts
  properties: { [key: string]: string };  // Additional properties
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, description: string, typeId: string) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.typeId = typeId;
    this.owners = [];
    this.alignedConcepts = [];  // Initialize aligned concepts
    this.properties = {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addOwner(ownerConceptId: string, factor: number): void {
    this.owners.push({ conceptId: ownerConceptId, factor });
    this.updatedAt = new Date();
  }

  addAlignedConcept(conceptId: string, factor: number): void {
    this.alignedConcepts.push({ conceptId, factor });
    this.updatedAt = new Date();
  }

  setProperty(key: string, value: string): void {
    this.properties[key] = value;
    this.updatedAt = new Date();
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      description: this.description,
      typeId: this.typeId,
      owners: this.owners,
      alignedConcepts: this.alignedConcepts,
      properties: this.properties,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    });
  }

  static fromJSON(json: string): Concept {
    const data = JSON.parse(json);
    const concept = new Concept(data.name, data.description, data.typeId);
    console.log(`Concept data: ${data.name}, CreatedAt: ${data.createdAt}, UpdatedAt: ${data.updatedAt}`);
    concept.id = data.id;
    concept.owners = data.owners;
    concept.alignedConcepts = data.alignedConcepts;
    concept.properties = data.properties;
    concept.createdAt = new Date(data.createdAt);
    concept.updatedAt = new Date(data.updatedAt);

    // Logging to debug invalid date issues
    console.log(`Concept loaded: ${concept.name}, CreatedAt: ${concept.createdAt}, UpdatedAt: ${concept.updatedAt}`);

    if (isNaN(concept.createdAt.getTime()) || isNaN(concept.updatedAt.getTime())) {
      throw new Error(`Invalid date value in concept data: ${json}`);
    }

    return concept;
  }

  compare(otherConcept: Concept): number {
    const nameComparison = this.name.localeCompare(otherConcept.name);
    if (nameComparison !== 0) return nameComparison;

    const typeComparison = this.typeId.localeCompare(otherConcept.typeId);
    if (typeComparison !== 0) return typeComparison;

    const descriptionComparison = this.description.localeCompare(otherConcept.description);
    if (descriptionComparison !== 0) return descriptionComparison;

    const createdAtComparison = this.createdAt.getTime() - otherConcept.createdAt.getTime();
    if (createdAtComparison !== 0) return createdAtComparison;

    return this.id.localeCompare(otherConcept.id);
  }

  update(name?: string, description?: string, typeId?: string) {
    if (name) this.name = name;
    if (description) this.description = description;
    if (typeId) this.typeId = typeId;
    this.updatedAt = new Date();
  }
}

export default Concept;
