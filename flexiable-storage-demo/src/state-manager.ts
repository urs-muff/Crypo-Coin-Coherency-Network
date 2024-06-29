import { create as createIPFSClient, IPFSHTTPClient } from 'ipfs-http-client';

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
  private indexFileCid: string | null;

  constructor(stateKey: string) {
    this.ipfs = createIPFSClient({ host: 'localhost', port: 5001, protocol: 'http' });
    this.stateKey = stateKey;
    this.indexFileCid = null;
  }

  async saveState(state: State): Promise<void> {
    const data = JSON.stringify(state);
    const { cid } = await this.ipfs.add({ content: Buffer.from(data) });
    console.log(`State saved with CID: ${cid.toString()}`);
    await this.updateIndexFile(cid.toString());
  }

  private async updateIndexFile(cid: string): Promise<void> {
    let index: StateIndex = {};
    try {
      if (this.indexFileCid) {
        const indexFile = await this.ipfs.cat(this.indexFileCid);
        let data = '';
        for await (const chunk of indexFile) {
          data += chunk.toString();
        }
        index = JSON.parse(data) as StateIndex;
      } else {
        console.log(`Index file not found, creating a new one.`);
      }
    } catch (error) {
      console.log(`Error reading index file: ${error}`);
    }
    index[this.stateKey] = cid;
    const { cid: indexCid } = await this.ipfs.add({ content: Buffer.from(JSON.stringify(index)) });
    this.indexFileCid = indexCid.toString();
    console.log(`Index updated with CID: ${indexCid.toString()}`);
  }

  async loadState(): Promise<State> {
    const index = await this.getIndexFile();
    const cid = index[this.stateKey];
    if (!cid) {
      throw new Error('State not initialized. Please run the init command first.');
    }
    const file = await this.ipfs.cat(cid);
    let data = '';
    for await (const chunk of file) {
      data += chunk.toString();
    }
    return JSON.parse(data);
  }

  private async getIndexFile(): Promise<StateIndex> {
    try {
      if (this.indexFileCid) {
        const indexFile = await this.ipfs.cat(this.indexFileCid);
        let data = '';
        for await (const chunk of indexFile) {
          data += chunk.toString();
        }
        return JSON.parse(data) as StateIndex;
      }
      return {};
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
