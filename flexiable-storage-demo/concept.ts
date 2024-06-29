// concept.ts
import { v4 as uuidv4 } from 'uuid';

interface OwnershipStake {
  conceptId: string;  // ID of the owner concept
  factor: number;     // Ownership stake (0-1)
}

class Concept {
  id: string;
  name: string;
  description: string;
  typeId: string;     // ID of the concept representing this concept's type
  owners: OwnershipStake[];
  properties: { [key: string]: string };  // Additional properties
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, description: string, typeId: string) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.typeId = typeId;
    this.owners = [];
    this.properties = {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addOwner(ownerConceptId: string, factor: number): void {
    this.owners.push({ conceptId: ownerConceptId, factor });
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
      properties: this.properties,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    });
  }

  static fromJSON(json: string): Concept {
    const data = JSON.parse(json);
    const concept = new Concept(data.name, data.description, data.typeId);
    concept.id = data.id;
    concept.owners = data.owners;
    concept.properties = data.properties;
    concept.createdAt = new Date(data.createdAt);
    concept.updatedAt = new Date(data.updatedAt);
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