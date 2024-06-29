import { StorageProvider } from './storage-interface.js';
import { Concept, Alignment } from './concept.js';

class ConceptManager {
  private storage: StorageProvider;
  private ownerTypeId: string;

  constructor(storage: StorageProvider) {
    this.storage = storage;
    this.ownerTypeId = ''; // This should be initialized with the actual owner type ID
  }

  async initialize() {
    if (this.ownerTypeId != '')
      return;
    const existingOwnerType = await this.findConceptByName('Owner');
    if (existingOwnerType) {
      this.ownerTypeId = existingOwnerType.id;
    } else {
      const ownerType = new Concept('Owner', 'Represents an owner of concepts', 'type-type-id');
      this.ownerTypeId = await this.createConcept(ownerType);
    }
    console.log(`Owner type ID set to: ${this.ownerTypeId}`);
  }

  async createOwner(ownerName: string): Promise<string> {
    await this.initialize();
    const owner = new Concept(ownerName, "An owner of concepts", this.ownerTypeId);
    await this.storage.store(owner.id, owner.toJSON());
    return owner.id;
  }
  
  async registerOwner(ownerName: string, peerId: string): Promise<string> {
    await this.initialize();
    const owner = new Concept(ownerName, "An owner of concepts", this.ownerTypeId);
    owner.id = peerId;
    owner.setProperty('peerId', peerId);
    await this.storage.store(owner.id, owner.toJSON());
    return owner.id;
  }

  async createConcept(concept: Concept): Promise<string> {
    await this.storage.store(concept.id, concept.toJSON());
    return concept.id;
  }

  async getConcept(id: string): Promise<Concept | null> {
    try {
      const data = await this.storage.retrieve(id);
      return Concept.fromJSON(data);
    } catch (error) {
      console.error('Error retrieving concept:', error);
      return null;
    }
  }

  async updateConcept(id: string, concept: Concept): Promise<void> {
    await this.storage.update(id, concept.toJSON());
  }

  async isOwner(concept: Concept): Promise<boolean> {
    await this.initialize();
    return concept.typeId === this.ownerTypeId;
  }
  
  async getOwners(concept: Concept): Promise<Alignment[]> {
    const ownerAlignments = [];
    for (const alignment of concept.alignedConcepts) {
      const alignedConcept = await this.getConcept(alignment.conceptId);
      if (alignedConcept && await this.isOwner(alignedConcept)) {
        ownerAlignments.push(alignment);
      }
    }
    return ownerAlignments;
  }
  
  async addTrackedConcept(ownerId: string, conceptId: string, weight: number): Promise<void> {
    const owner = await this.getConcept(ownerId);
    if (!owner) throw new Error('Owner not found');
    owner.addAlignedConcept(conceptId, weight);
    await this.updateConcept(ownerId, owner);
  }

  async findConceptByName(name: string): Promise<Concept | null> {
    const allConcepts = await this.listAllConcepts();
    return allConcepts.find(concept => concept.name === name) || null;
  }

  async removeConcept(id: string): Promise<void> {
    const item = await this.getConcept(id);
    if (!item) {
      throw new Error(`Item with ID ${id} is not a concept and cannot be removed.`);
    }
    await this.storage.delete(id);
    console.log(`Concept with ID ${id} has been removed.`);
  }

  async listAllConcepts(): Promise<Concept[]> {
    const allIds = await this.storage.listAll();
    const items = await Promise.all(allIds.map(id => this.getConcept(id)));
    return items.filter((item): item is Concept => item !== null);
  }
}

export default ConceptManager;