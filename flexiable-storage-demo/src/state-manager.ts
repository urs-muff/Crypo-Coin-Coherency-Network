import { create as createIPFSClient, IPFSHTTPClient } from 'ipfs-http-client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface State {
  ownerId: string;
  // Add other state properties as needed
}

interface StateIndex {
  [key: string]: string;
}

class StateManager {
  private ipfs: IPFSHTTPClient;
  private stateKey: string;
  private indexFilePath: string;

  constructor(stateKey: string) {
    this.ipfs = createIPFSClient({ host: 'localhost', port: 5001, protocol: 'http' });
    this.stateKey = stateKey;
    this.indexFilePath = path.join(__dirname, 'state-index.json');
    this.initializeIndexFile(); // Initialize index file during construction
  }

  private async initializeIndexFile(): Promise<void> {
    console.log('Initializing index file...');
    try {
      await this.ipfs.cat(this.indexFilePath);
      console.log(`Index file ${this.indexFilePath} exists.`);
    } catch (error) {
      console.log(`Index file ${this.indexFilePath} not found, creating a new one. Error: ${error}`);
      await this.updateIndexFile({});
    }
  }

  async saveState(state: State): Promise<void> {
    const data = JSON.stringify(state);
    console.log('Saving state:', data);
    const { cid } = await this.ipfs.add(data);
    console.log(`State saved with CID: ${cid.toString()}`);
    await this.updateIndexFile({ [this.stateKey]: cid.toString() });
  }

  private async updateIndexFile(newIndex: StateIndex): Promise<void> {
    let index: StateIndex = {};

    console.log('Starting updateIndexFile...');
    console.log('New index to be merged:', newIndex);

    try {
      const data = fs.readFileSync(this.indexFilePath, 'utf8');
      index = JSON.parse(data) as StateIndex;
    } catch (error) {
      console.log(`Index file not found, creating a new one. Error: ${error}`);
    }

    index = { ...index, ...newIndex };
    console.log('Merged index:', index);

    fs.writeFileSync(this.indexFilePath, JSON.stringify(index, null, 2));
    console.log(`Index updated and saved to ${this.indexFilePath}`);

    // Also add to IPFS
    const { cid: indexCid } = await this.ipfs.add({ content: Buffer.from(JSON.stringify(index)) });
    console.log(`Index also added to IPFS with CID: ${indexCid.toString()}`);
  }

  async loadState(): Promise<State> {
    console.log('Loading state...');
    const index = await this.getIndexFile();
    console.log('Index loaded:', index);
  
    const cid = index[this.stateKey];
    console.log('CID for state:', cid);
    if (!cid) {
      throw new Error('State not initialized. Please run the init command first.');
    }
    
    let data = '';
    for await (const chunk of this.ipfs.cat(cid)) {
      data += new TextDecoder().decode(chunk);
    }
    console.log('State data loaded:', data);
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing state data:', error);
      throw new Error('Invalid state data. Please reinitialize the system.');
    }
  }

  private async getIndexFile(): Promise<StateIndex> {
    try {
      const data = fs.readFileSync(this.indexFilePath, 'utf8');
      console.log(`Index ${this.indexFilePath} read.`);
      return JSON.parse(data) as StateIndex;
    } catch (error) {
      console.log(`Index file not found, returning empty index. Error: ${error}`);
      return {};
    }
  }

  async stateExists(): Promise<boolean> {
    try {
      await this.loadState();
      return true;
    } catch {
      return false;
    }
  }
}

export default StateManager;
