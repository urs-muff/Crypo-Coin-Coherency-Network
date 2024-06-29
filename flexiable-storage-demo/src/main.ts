import IPFSStorage from './ipfs-storage';
import ConceptManager from './concept-manager';
import Concept from './concept';

// Instantiate MockIPFSStorage
const storage = new IPFSStorage();

// Pass the storage instance to ConceptManager
const conceptManager = new ConceptManager(storage);

// Example usage
async function run() {
  try {
    // Create an owner
    const owner = await conceptManager.createOwner('owner1', 'Alice');
    console.log('Owner created:', owner);

    // Create a concept
    const concept = new Concept('Concept1', 'A test concept', 'type1');
    const conceptId = await conceptManager.createConcept(concept);
    console.log('Concept created:', conceptId);

    // Retrieve a concept
    const retrievedConcept = await conceptManager.getConcept(conceptId);
    console.log('Retrieved concept:', retrievedConcept);

    // Update a concept
    retrievedConcept.description = 'An updated test concept';
    await conceptManager.updateConcept(conceptId, retrievedConcept);
    console.log('Concept updated:', retrievedConcept);

    // List all concepts
    const allConcepts = await conceptManager.listAllConcepts();
    console.log('All concepts:', allConcepts);

    // Delete a concept
    await conceptManager.deleteConcept(conceptId);
    console.log('Concept deleted:', conceptId);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
