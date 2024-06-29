// src/state-manager.ts
import fs from 'fs/promises';

interface State {
  ownerId: string;
  // Add other state properties as needed
}

class StateManager {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async saveState(state: State): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(state), 'utf-8');
  }

  async loadState(): Promise<State> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error('State not initialized. Please run the init command first.');
      }
      throw error;
    }
  }

  async stateExists(): Promise<boolean> {
    try {
      await fs.access(this.filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export default StateManager;