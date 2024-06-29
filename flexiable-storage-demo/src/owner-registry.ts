// src/owner-registry.ts
import axios from 'axios';

interface OwnerInfo {
  id: string;
  name: string;
  endpoint: string;
}

class OwnerRegistry {
  private registryUrl: string;

  constructor(registryUrl: string) {
    this.registryUrl = registryUrl;
  }

  async registerOwner(ownerId: string, ownerName: string, endpoint: string): Promise<void> {
    await axios.post(`${this.registryUrl}/.netlify/functions/register-owner`, { id: ownerId, name: ownerName, endpoint });
  }

  async getOwnerEndpoint(ownerId: string): Promise<string> {
    const response = await axios.get(`${this.registryUrl}/.netlify/functions/get-owner?id=${ownerId}`);
    return response.data.endpoint;
  }

  async listAllOwners(): Promise<OwnerInfo[]> {
    const response = await axios.get(`${this.registryUrl}/.netlify/functions/list-owners`);
    return response.data;
  }

  async findOwnerByName(name: string): Promise<OwnerInfo | null> {
    const response = await axios.get(`${this.registryUrl}/.netlify/functions/find-owner?name=${encodeURIComponent(name)}`);
    return response.data || null;
  }
}

export default OwnerRegistry;