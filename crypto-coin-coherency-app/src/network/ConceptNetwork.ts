// File: src/network/ConceptNetwork.ts

import { ConceptID, Concept, LatentSpaceVector } from '../types/ConceptTypes';

class ConceptNode {
  constructor(
    public concept: Concept,
    public latentVector: LatentSpaceVector,
    public parents: Set<ConceptID> = new Set(),
    public children: Set<ConceptID> = new Set()
  ) {}
}

export class ConceptNetwork {
  private nodes: Map<ConceptID, ConceptNode> = new Map();

  addConcept(concept: Concept, latentVector: LatentSpaceVector): void {
    if (this.nodes.has(concept.id)) {
      console.log(`Concept with id ${concept.id} already exists in the network. Updating.`);
      const existingNode = this.nodes.get(concept.id)!;
      existingNode.concept = concept;
      existingNode.latentVector = latentVector;
    } else {
      this.nodes.set(concept.id, new ConceptNode(concept, latentVector));
    }
  }

  addRelation(parentId: ConceptID, childId: ConceptID): void {
    const parentNode = this.nodes.get(parentId);
    const childNode = this.nodes.get(childId);

    if (!parentNode || !childNode) {
      throw new Error('Both parent and child concepts must exist in the network');
    }

    parentNode.children.add(childId);
    childNode.parents.add(parentId);
  }

  removeRelation(parentId: ConceptID, childId: ConceptID): void {
    const parent = this.nodes.get(parentId);
    const child = this.nodes.get(childId);

    if (!parent || !child) {
      throw new Error('Both parent and child concepts must exist in the network');
    }

    parent.children.delete(childId);
    child.parents.delete(parentId);
  }

  getConcept(id: ConceptID): Concept | undefined {
    return this.nodes.get(id)?.concept;
  }

  getParents(id: ConceptID): Concept[] {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Concept with id ${id} does not exist in the network`);
    }
    return Array.from(node.parents).map(parentId => this.getConcept(parentId)!).filter(Boolean);
  }

  getChildren(id: ConceptID): Concept[] {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Concept with id ${id} does not exist in the network`);
    }
    return Array.from(node.children).map(childId => this.getConcept(childId)!).filter(Boolean);
  }

  getAllConcepts(): Concept[] {
    return Array.from(this.nodes.values()).map(node => node.concept);
  }

  computeSimilarity(id1: ConceptID, id2: ConceptID): number {
    const node1 = this.nodes.get(id1);
    const node2 = this.nodes.get(id2);

    if (!node1 || !node2) {
      throw new Error('Both concepts must exist in the network');
    }

    // Compute cosine similarity between latent vectors
    const dotProduct = node1.latentVector.dimensions.reduce((sum, val, i) => sum + val * node2.latentVector.dimensions[i], 0);
    const magnitude1 = Math.sqrt(node1.latentVector.dimensions.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(node2.latentVector.dimensions.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2);
  }
}