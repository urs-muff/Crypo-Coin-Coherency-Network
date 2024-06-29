// owner-communication.ts
import { Concept, Alignment } from './concept.js';
import ConceptManager from './concept-manager.js';

interface ConceptQuery {
  id: string;
  name: string;
}

interface ConceptResponse {
  id: string;
  name: string;
  description: string;
  alignmentFactor: number;
  isGuess: boolean;
  upgradeDescription?: string;
}

class OwnerCommunication {
  private conceptManager: ConceptManager;
  private ownerId: string;

  constructor(conceptManager: ConceptManager, ownerId: string) {
    this.conceptManager = conceptManager;
    this.ownerId = ownerId;
  }

  async queryConceptsFromOtherOwner(queries: ConceptQuery[]): Promise<ConceptResponse[]> {
    // In a real system, this would involve network communication.
    // For this example, we'll simulate the process locally.
    return Promise.all(queries.map(query => this.processQuery(query)));
  }

  private async processQuery(query: ConceptQuery): Promise<ConceptResponse> {
    let concept = await this.conceptManager.getConcept(query.id);
    let isGuess = false;
    let alignmentFactor = 0;
  
    if (!concept) {
      concept = await this.generateGuessConcept(query);
      isGuess = true;
    } else {
      alignmentFactor = await this.calculateAlignmentFactor(concept);
    }
  
    const response: ConceptResponse = {
      id: concept.id,
      name: concept.name,
      description: concept.description,
      alignmentFactor,
      isGuess
    };
  
    if (alignmentFactor < 0.8) {
      response.upgradeDescription = await this.generateUpgradedDescription(concept);
    }
  
    return response;
  }
  
  private async generateGuessConcept(query: ConceptQuery): Promise<Concept> {
    // This is a placeholder. In a real system, this could use AI or other methods to generate a guess.
    const description = `Generated description for ${query.name}`;
    const typeId = 'default-type-id'; // You might want to have a default type for guessed concepts
    return new Concept(query.name, description, typeId);
  }

  private async calculateAlignmentFactor(concept: Concept): Promise<number> {
    for (const alignment of concept.alignedConcepts) {
      const alignedConcept = await this.conceptManager.getConcept(alignment.conceptId);
      if (alignedConcept && this.conceptManager.isOwner(alignedConcept) && alignment.conceptId === this.ownerId) {
        return alignment.factor;
      }
    }
    
    const ownerConcept = await this.conceptManager.getConcept(this.ownerId);
    if (ownerConcept) {
      const alignment = ownerConcept.alignedConcepts.find(a => a.conceptId === concept.id);
      return alignment ? alignment.factor : 0;
    }
    
    return 0;
  }

  private async generateUpgradedDescription(concept: Concept): Promise<string> {
    // This is a placeholder. In a real system, this could use AI or other methods to generate an upgraded description.
    return `Upgraded description for ${concept.name}: ${concept.description}`;
  }
}

export default OwnerCommunication;