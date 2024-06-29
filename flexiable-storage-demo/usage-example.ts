// usage-example.ts
import IPFSStorage from './src/ipfs-storage';
import ConceptManager from './src/concept-manager';
import Concept from './src/concept';
import initializeSystem from './src/system-initializer';
import OwnerCommunication from './src/owner-communication';

async function main() {
  const mockStorage = new IPFSStorage();
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

  // Simulate communication between owners
  const aliceCommunication = new OwnerCommunication(conceptManager, owner1Id);
  const bobCommunication = new OwnerCommunication(conceptManager, owner2Id);

  const aliceQueries = [
    { id: id1, name: "Unity Consciousness" },
    { id: id2, name: "Flow State Collaboration" },
    { id: "non-existent-id", name: "Quantum Entanglement" }
  ];

  const bobResponses = await bobCommunication.queryConceptsFromOtherOwner(aliceQueries);

  console.log("Bob's responses to Alice's queries:", JSON.stringify(bobResponses, null, 2));

  // Alice can now process Bob's responses and update her own concepts if needed
}

main().catch(console.error);