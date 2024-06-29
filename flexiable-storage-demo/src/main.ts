import IPFSStorage from './ipfs-storage';
import ConceptManager from './concept-manager';
import Concept from './concept';

// Instantiate IPFSStorage
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
      if (item instanceof Concept) {
        console.log(`Concept - ID: ${item.id}, Name: ${item.name}, Description: ${item.description}`);
      } else {
        console.log(`Owner - ID: ${item.id}, Name: ${item.name}`);
      }
    });

    // Delete a concept
    if (retrievedItem instanceof Concept) {
      await conceptManager.deleteConcept(conceptId);
      console.log('Concept deleted:', conceptId);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

run();