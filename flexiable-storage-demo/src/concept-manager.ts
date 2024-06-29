// src/concept-manager.ts
import simpleGit, { SimpleGit } from 'simple-git';
import { StorageProvider } from './storage-interface.js';
import Concept from './concept.js';
import IPFSStorage from './ipfs-storage';

class ConceptManager {
  private storage: StorageProvider;
  private git: SimpleGit;

  constructor(storage: StorageProvider) {
    this.storage = storage;
    this.git = simpleGit();
  }

  async createOwner(ownerId: string, ownerName: string): Promise<Concept> {
    const ownerConcept = new Concept(ownerName, `Owner: ${ownerName}`, 'owner-type-id');
    ownerConcept.id = ownerId;
    await this.storage.store(ownerConcept.id, ownerConcept.toJSON());
    await this.commitChange(ownerConcept.id, `Created owner: ${ownerName}`);
    return ownerConcept;
  }

  async createConcept(concept: Concept): Promise<string> {
    await this.storage.store(concept.id, concept.toJSON());
    await this.commitChange(concept.id, `Created concept: ${concept.name}`);
    return concept.id;
  }

  async getConcept(id: string): Promise<Concept> {
    const data = await this.storage.retrieve(id);
    return Concept.fromJSON(data);
  }

  async updateConcept(id: string, concept: Concept): Promise<void> {
    await this.storage.update(id, concept.toJSON());
    await this.commitChange(concept.id, `Updated concept: ${concept.name}`);
  }

  async deleteConcept(id: string): Promise<void> {
    await this.storage.delete(id);
    await this.commitChange(id, `Deleted concept with ID: ${id}`);
  }

  async listAllConcepts(): Promise<Concept[]> {
    const allIds = await this.storage.listAll();
    const concepts = await Promise.all(allIds.map(id => this.getConcept(id)));
    return concepts;
  }

  private async commitChange(conceptId: string, message: string): Promise<void> {
    await this.git.add('.');
    await this.git.commit(`${message} (Concept ID: ${conceptId})`);
  }
}

export default ConceptManager;
