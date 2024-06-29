import IPFSStorage from './ipfs-storage';
import ConceptManager from './concept-manager';
import { Concept } from './concept.js';

// Instantiate IPFSStorage
const storage = new IPFSStorage();

// Pass the storage instance to ConceptManager
const conceptManager = new ConceptManager(storage);

// Example usage
async function run() {
  try {
    // Create an owner
    await conceptManager.initialize();
    const owner = await conceptManager.createOwner('Alice');
    console.log('Owner created:', owner);

    // Create a concept
    const concept = new Concept('Concept1', 'A test concept', 'type1');
    const conceptId = await conceptManager.createConcept(concept);
    console.log('Concept created:', conceptId);

    // Retrieve a concept
    const retrievedItem = await conceptManager.getConcept(conceptId);
    console.log('Retrieved item:', retrievedItem);

    if (retrievedItem instanceof Concept) {
      // Update the concept
      retrievedItem.description = 'An updated test concept';
      await conceptManager.updateConcept(conceptId, retrievedItem);
      console.log('Concept updated:', retrievedItem);
    } else {
      console.log('Retrieved item is not a Concept, cannot update');
    }

    // List all concepts and owners
    const allItems = await conceptManager.listAllConcepts();
    console.log('All items:');
    allItems.forEach(item => {
      console.log(`Concept - ID: ${item.id}, Name: ${item.name}, Description: ${item.description}`);
    });


    // Delete a concept
    if (retrievedItem instanceof Concept) {
      await conceptManager.removeConcept(conceptId);
      console.log('Concept deleted:', conceptId);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

run();