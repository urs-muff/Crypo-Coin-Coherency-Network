import { v4 as uuidv4 } from 'uuid';

export interface Alignment {
  conceptId: string;
  factor: number;
}

export class Concept {
  id: string;
  name: string;
  description: string;
  typeId: string;     // ID of the concept representing this concept's type
  alignedConcepts: Alignment[];
  properties: { [key: string]: string };
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, description: string, typeId: string) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.typeId = typeId;
    this.alignedConcepts = [];
    this.properties = {};
    this.createdAt = new Date();
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
      alignedConcepts: this.alignedConcepts,
      properties: this.properties,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    });
  }
  
  static fromJSON(json: string): Concept {
    const data = JSON.parse(json);
    const concept = new Concept(data.name, data.description, data.typeId);
    concept.id = data.id;
    concept.alignedConcepts = data.alignedConcepts;
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
