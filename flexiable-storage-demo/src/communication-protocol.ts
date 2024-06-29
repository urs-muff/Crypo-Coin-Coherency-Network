// communication-protocol.ts
import axios from 'axios';
import OwnerRegistry from './owner-registry';

class CommunicationProtocol {
  private ownerRegistry: OwnerRegistry;

  constructor(ownerRegistry: OwnerRegistry) {
    this.ownerRegistry = ownerRegistry;
  }

  async queryConcept(ownerId: string, conceptName: string): Promise<any> {
    const ownerEndpoint = await this.ownerRegistry.getOwnerEndpoint(ownerId);
    const response = await axios.post(`${ownerEndpoint}/query`, { conceptName });
    return response.data;
  }
}

export default CommunicationProtocol;