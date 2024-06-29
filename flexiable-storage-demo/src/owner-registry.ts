// owner-registry.ts
import axios from 'axios';

class OwnerRegistry {
  private registryUrl: string;

  constructor(registryUrl: string) {
    this.registryUrl = registryUrl;
  }

  async registerOwner(ownerId: string, endpoint: string): Promise<void> {
    await axios.post(`${this.registryUrl}/register`, { ownerId, endpoint });
  }

  async getOwnerEndpoint(ownerId: string): Promise<string> {
    const response = await axios.get(`${this.registryUrl}/owner/${ownerId}`);
    return response.data.endpoint;
  }
}

export default OwnerRegistry;