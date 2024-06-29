// owner-communication.ts
import Concept from './concept';
import ConceptManager from './concept-manager';

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
      alignmentFactor = this.calculateAlignmentFactor(concept);
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

  private calculateAlignmentFactor(concept: Concept): number {
    const ownerStake = concept.owners.find(owner => owner.conceptId === this.ownerId);
    if (ownerStake) {
      return ownerStake.factor;
    }
    
    const alignedConcept = (this.conceptManager.getConcept(this.ownerId) as unknown as Concept)
      .alignedConcepts.find(aligned => aligned.conceptId === concept.id);
    
    return alignedConcept ? alignedConcept.factor : 0;
  }

  private async generateUpgradedDescription(concept: Concept): Promise<string> {
    // This is a placeholder. In a real system, this could use AI or other methods to generate an upgraded description.
    return `Upgraded description for ${concept.name}: ${concept.description}`;
  }
}

export default OwnerCommunication;