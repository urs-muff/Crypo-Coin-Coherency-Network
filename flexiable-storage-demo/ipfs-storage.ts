// ipfs-storage.ts
import { StorageProvider } from './storage-interface';

class MockIPFSStorage implements StorageProvider {
  private storage: { [key: string]: string } = {};

  async store(id: string, data: string): Promise<void> {
    this.storage[id] = data;
  }

  async retrieve(id: string): Promise<string> {
    const data = this.storage[id];
    if (!data) {
      throw new Error(`No data found for id: ${id}`);
    }
    return data;
  }

  async update(id: string, data: string): Promise<void> {
    this.storage[id] = data;
  }

  async delete(id: string): Promise<void> {
    delete this.storage[id];
  }

  async listAll(): Promise<string[]> {
    return Object.keys(this.storage);
  }
}

export default MockIPFSStorage;