// usage-example.ts
import MockIPFSStorage from './ipfs-storage';
import ConceptManager from './concept-manager';
import Concept from './concept';
import initializeSystem from './system-initializer';

async function main() {
  const mockStorage = new MockIPFSStorage();
  const conceptManager = new ConceptManager(mockStorage);

  // Initialize the system
  const { typeConceptId, ownerTypeId } = await initializeSystem(conceptManager);

  // Create owner concepts
  const owner1 = new Concept("Alice", "An owner in the system", ownerTypeId);
  const owner2 = new Concept("Bob", "Another owner in the system", ownerTypeId);
  const owner1Id = await conceptManager.createConcept(owner1);
  const owner2Id = await conceptManager.createConcept(owner2);

  // Create a custom type for our concepts
  const customTypeConcept = new Concept("CustomType", "A custom type for our concepts", typeConceptId);
  const customTypeId = await conceptManager.createConcept(customTypeConcept);

  // Create multiple concepts
  const concept1 = new Concept("Unity Consciousness", "The fundamental interconnectedness of all things", customTypeId);
  concept1.addOwner(owner1Id, 0.7);
  concept1.addOwner(owner2Id, 0.3);
  
  const concept2 = new Concept("Flow State Collaboration", "Optimal state of collective creativity and productivity", customTypeId);
  concept2.addOwner(owner2Id, 1);

  const id1 = await conceptManager.createConcept(concept1);
  const id2 = await conceptManager.createConcept(concept2);

  // Add aligned concepts to owners
  owner1.addAlignedConcept(id1, 0.9);  // Alice strongly aligns with Unity Consciousness
  owner2.addAlignedConcept(id2, 0.8);  // Bob strongly aligns with Flow State Collaboration
  owner2.addAlignedConcept(id1, 0.4);  // Bob moderately aligns with Unity Consciousness

  await conceptManager.updateConcept(owner1Id, owner1);
  await conceptManager.updateConcept(owner2Id, owner2);

  console.log(`Created concepts with IDs: ${id1}, ${id2}`);

  // List all concepts
  let allConcepts = await conceptManager.listAllConcepts();
  console.log("All concepts:", JSON.stringify(allConcepts, null, 2));

  // Update a concept
  const retrievedConcept = await conceptManager.getConcept(id1);
  retrievedConcept.update(undefined, retrievedConcept.description + " in the universe.");
  await conceptManager.updateConcept(id1, retrievedConcept);

  // Compare concepts
  const comparisonResult = concept1.compare(concept2);
  console.log("Comparison result:", comparisonResult);

  // Delete a concept
  await conceptManager.deleteConcept(id2);

  // List all concepts again
  allConcepts = await conceptManager.listAllConcepts();
  console.log("Remaining concepts after update and deletion:", JSON.stringify(allConcepts, null, 2));
}

main().catch(console.error);