import { StorageProvider } from './storage-interface.js';
import Concept from './concept.js';

export type OwnerData = { id: string; name: string };
type ConceptOrOwner = Concept | OwnerData;

class ConceptManager {
  private storage: StorageProvider;

  constructor(storage: StorageProvider) {
    this.storage = storage;
  }

  async createOwner(ownerId: string, ownerName: string): Promise<OwnerData> {
    const ownerData: OwnerData = { id: ownerId, name: ownerName };
    await this.storage.store(ownerId, JSON.stringify(ownerData));
    return ownerData;
  }

  async createConcept(concept: Concept): Promise<string> {
    await this.storage.store(concept.id, concept.toJSON());
    return concept.id;
  }

  async getConcept(id: string): Promise<ConceptOrOwner> {
    const data = await this.storage.retrieve(id);
    const parsedData = JSON.parse(data);
    if ('typeId' in parsedData) {
      return Concept.fromJSON(data);
    } else {
      return parsedData as OwnerData;
    }
  }

  async findConceptByName(name: string): Promise<Concept | null> {
    const allConcepts = await this.listAllConcepts();
    const foundConcept = allConcepts.find(item => 
      item instanceof Concept && item.name === name
    );
    return foundConcept instanceof Concept ? foundConcept : null;
  }

  async removeConcept(id: string): Promise<void> {
    const item = await this.getConcept(id);
    if (!(item instanceof Concept)) {
      throw new Error(`Item with ID ${id} is not a concept and cannot be removed.`);
    }
    await this.storage.delete(id);
    console.log(`Concept with ID ${id} has been removed.`);
  }

  async updateConcept(id: string, concept: Concept): Promise<void> {
    await this.storage.update(id, concept.toJSON());
  }

  async deleteConcept(id: string): Promise<void> {
    await this.storage.delete(id);
  }

  async listAllConcepts(): Promise<(Concept | OwnerData)[]> {
    const allIds = await this.storage.listAll();
    const items = await Promise.all(allIds.map(id => this.getConcept(id)));
    return items;
  }
}

export default ConceptManager;