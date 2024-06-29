import IPFSStorage from './ipfs-storage.js';

interface OwnerInfo {
  id: string;
  name: string;
  endpoint: string;
}

class OwnerRegistry {
  private registryUrl: string;
  private storage: IPFSStorage;

  constructor(registryUrl: string) {
    this.registryUrl = registryUrl;
    this.storage = new IPFSStorage();
  }

  async registerOwner(ownerId: string, ownerName: string, endpoint: string): Promise<void> {
    const ownerInfo: OwnerInfo = { id: ownerId, name: ownerName, endpoint };
    const data = JSON.stringify(ownerInfo);
    await this.storage.store(ownerId, data);
  }

  async getOwnerEndpoint(ownerId: string): Promise<string> {
    const data = await this.storage.retrieve(ownerId);
    const owner = JSON.parse(data);
    return owner.endpoint;
  }

  async listAllOwners(): Promise<OwnerInfo[]> {
    const allIds = await this.storage.listAll();
    const owners = await Promise.all(allIds.map(id => this.getOwnerInfo(id)));
    return owners;
  }

  async findOwnerByName(name: string): Promise<OwnerInfo | null> {
    const allOwners = await this.listAllOwners();
    return allOwners.find(owner => owner.name === name) || null;
  }

  private async getOwnerInfo(id: string): Promise<OwnerInfo> {
    const data = await this.storage.retrieve(id);
    const jsonString = Buffer.from(data, 'utf8').toString(); // Ensure correct conversion to string
    console.log(`Data retrieved for ID ${id}: ${jsonString}`);
    return JSON.parse(jsonString);
  }
}

export default OwnerRegistry;
