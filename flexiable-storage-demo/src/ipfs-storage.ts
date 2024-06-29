import { StorageProvider } from './storage-interface';
import { create as createIPFSClient, IPFSHTTPClient } from 'ipfs-http-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class IPFSStorage implements StorageProvider {
  private ipfs: IPFSHTTPClient;
  private indexFilePath: string;

  constructor() {
    this.ipfs = createIPFSClient({ host: 'localhost', port: 5001, protocol: 'http' });
    this.indexFilePath = path.join(__dirname, 'ipfs-index.json');
    this.initializeIndexFile();
  }

  private initializeIndexFile() {
    if (!fs.existsSync(this.indexFilePath)) {
      fs.writeFileSync(this.indexFilePath, JSON.stringify({}));
    }
  }

  private async updateIndexFile(id: string, cid?: string): Promise<void> {
    const index = JSON.parse(fs.readFileSync(this.indexFilePath, 'utf8'));
    if (cid) {
      index[id] = cid;
    } else {
      delete index[id];
    }
    fs.writeFileSync(this.indexFilePath, JSON.stringify(index, null, 2));
    console.log(`Index ${this.indexFilePath} updated: ${JSON.stringify(index, null, 2)}`);
  }

  private async getIndexFile(): Promise<{ [key: string]: string }> {
    console.log(`Index ${this.indexFilePath} read.`);
    return JSON.parse(fs.readFileSync(this.indexFilePath, 'utf8'));
  }

  async store(id: string, data: string): Promise<string> {
    const { cid } = await this.ipfs.add({ content: Buffer.from(data) });
    await this.updateIndexFile(id, cid.toString());
    console.log(`Stored data with ID: ${id} and CID: ${cid}`);
    return cid.toString();
  }

  async retrieve(id: string): Promise<string> {
    const index = await this.getIndexFile();
    const cid = index[id];
    if (!cid) {
      throw new Error(`No data found for id: ${id}`);
    }
    const file = await this.ipfs.cat(cid);
    const data = [];
    for await (const chunk of file) {
      data.push(chunk);
    }
    const buffer = Buffer.concat(data);
    console.log(`Retrieved data for ID: ${id} with CID: ${cid}`);
    return buffer.toString('utf8');
  }

  async update(id: string, data: string): Promise<void> {
    await this.store(id, data);
  }

  async delete(id: string): Promise<void> {
    const index = await this.getIndexFile();
    if (!index[id]) {
      throw new Error(`No data found for id: ${id}`);
    }
    await this.updateIndexFile(id);
    console.log(`Deleted data with ID: ${id}`);
  }

  async listAll(): Promise<string[]> {
    const index = await this.getIndexFile();
    console.log(`Listing all IDs: ${JSON.stringify(index, null, 2)}`);
    return Object.keys(index);
  }
}

export default IPFSStorage;
