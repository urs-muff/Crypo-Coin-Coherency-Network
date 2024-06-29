import { program } from 'commander';
import ConceptManager from './concept-manager.js';
import IPFSStorage from './ipfs-storage.js';
import StateManager from './state-manager.js';
import OwnerRegistry from './owner-registry.js';
import CommunicationProtocol from './communication-protocol.js';
import { Concept } from './concept.js';
import { create as createIPFSClient } from 'ipfs-http-client';

const storage = new IPFSStorage();
const conceptManager = new ConceptManager(storage);
const stateManager = new StateManager('state-key');
const ownerRegistry = new OwnerRegistry('https://coherency-coin-network-project.netlify.app');
const communicationProtocol = new CommunicationProtocol(ownerRegistry);
const ipfs = createIPFSClient({ host: 'localhost', port: 5001, protocol: 'http' });

async function getPeerId() {
  const id = await ipfs.id();
  return id.id.toString(); // Ensure Peer ID is a string
}

program
  .version('1.0.0')
  .description('Crypto Coin Coherency Network CLI');

program
  .command('init <ownerName>')
  .description('Initialize the system with a new owner')
  .action(async (ownerName) => {
    try {
      const peerId = await getPeerId();
      const ownerId = await conceptManager.registerOwner(ownerName, peerId);
      await stateManager.saveState({ ownerId, peerId });
      console.log(`System initialized with owner: ${ownerName} (ID: ${ownerId}, Peer ID: ${peerId})`);
    } catch (error) {
      console.error('Error initializing system:', error);
    }
  });

program
  .command('create-owner <ownerName>')
  .description('Create a new owner')
  .action(async (ownerName) => {
    try {
      const ownerId = await conceptManager.createOwner(ownerName);
      console.log(`New owner created with ID: ${ownerId}`);
    } catch (error) {
      console.error('Error creating owner:', error);
    }
  });

program
  .command('track-concept <ownerId> <conceptId> <weight>')
  .description('Add a tracked concept to an owner')
  .action(async (ownerId, conceptId, weight) => {
    try {
      await conceptManager.addTrackedConcept(ownerId, conceptId, parseFloat(weight));
      console.log(`Concept ${conceptId} added to owner ${ownerId} with weight ${weight}`);
    } catch (error) {
      console.error('Error adding tracked concept:', error);
    }
  });

program
  .command('list-aligned-concepts <id>')
  .description('List all aligned concepts for a concept or tracked concepts for an owner')
  .action(async (id) => {
    try {
      const item = await conceptManager.getConcept(id);
      if (!item) {
        console.log(`No item found with ID ${id}`);
        return;
      }
      
      const isOwner = conceptManager.isOwner(item);
      console.log(`${isOwner ? 'Tracked' : 'Aligned'} concepts for ${isOwner ? 'owner' : 'concept'} ${item.name} (ID: ${item.id}):`);
      
      for (const alignment of item.alignedConcepts) {
        const concept = await conceptManager.getConcept(alignment.conceptId);
        if (concept) {
          console.log(`- ${concept.name} (ID: ${concept.id}), Factor: ${alignment.factor}, Type: ${concept.typeId}`);
        }
      }

      if (!isOwner) {
        console.log("\nOwners of this concept:");
        const owners = await conceptManager.getOwners(item);
        for (const owner of owners) {
          const ownerConcept = await conceptManager.getConcept(owner.conceptId);
          if (ownerConcept) {
            console.log(`- ${ownerConcept.name} (ID: ${ownerConcept.id}), Factor: ${owner.factor}`);
          }
        }
      }
    } catch (error) {
      console.error('Error listing aligned concepts:', error);
    }
  });

program
  .command('create-concept <name> <description>')
  .description('Create a new concept')
  .action(async (name, description) => {
    try {
      let state;
      try {
        state = await stateManager.loadState();
      } catch (error) {
        console.log('State not initialized. Please run the init command first.');
        console.log('Usage: npm run start -- init <ownerName>');
        return;
      }

      const { ownerId, peerId } = state;
      
      // Check if a concept with this name already exists
      const existingConcept = await conceptManager.findConceptByName(name);
      if (existingConcept) {
        console.log(`A concept with the name "${name}" already exists. Its ID is: ${existingConcept.id}`);
        return;
      }

      const concept = new Concept(name, description, 'default-type-id');
      concept.addAlignedConcept(ownerId, 1);  // Linking the concept to the owner
      concept.setProperty('creatorPeerId', peerId);  // Store the creator's Peer ID
      const createdConceptId = await conceptManager.createConcept(concept);
      console.log(`Concept created: ${createdConceptId} (Creator Peer ID: ${peerId})`);
    } catch (error) {
      console.error('Error creating concept:', error);
      if ((error as Error).message.includes('State not initialized')) {
        console.log('Please run the init command first: npm run start -- init <ownerName>');
      }
    }
  });

program
  .command('list-owners')
  .description('List all registered owners')
  .action(async () => {
    try {
      const owners = await ownerRegistry.listAllOwners();
      console.log('Registered owners:');
      owners.forEach(owner => {
        console.log(`ID: ${owner.id}, Name: ${owner.name}, Endpoint: ${owner.endpoint}`);
      });
    } catch (error) {
      console.error('Error listing owners:', error);
    }
  });

program
  .command('find-owner <name>')
  .description('Find an owner by name')
  .action(async (name) => {
    try {
      const owner = await ownerRegistry.findOwnerByName(name);
      if (owner) {
        console.log(`Owner found: ID: ${owner.id}, Name: ${owner.name}, Endpoint: ${owner.endpoint}`);
      } else {
        console.log(`No owner found with name: ${name}`);
      }
    } catch (error) {
      console.error('Error finding owner:', error);
    }
  });

program
  .command('query <ownerId> <conceptName>')
  .description('Query another owner about a concept')
  .action(async (ownerId, conceptName) => {
    try {
      const response = await communicationProtocol.queryConcept(ownerId, conceptName);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error querying concept:', error);
    }
  });

program
  .command('find-concept <name>')
  .description('Find concepts by name')
  .action(async (name) => {
    try {
      const items = await conceptManager.listAllConcepts();
      const matchingConcepts = items.filter(item => 
        item instanceof Concept && item.name.toLowerCase() === name.toLowerCase()
      );
      
      if (matchingConcepts.length === 0) {
        console.log(`No concepts found with the name "${name}".`);
      } else {
        console.log(`Found ${matchingConcepts.length} concept(s) with the name "${name}":`);
        matchingConcepts.forEach(concept => {
          if (concept instanceof Concept) {
            console.log(`ID: ${concept.id}, Description: ${concept.description}`);
          }
        });
      }
    } catch (error) {
      console.error('Error finding concepts:', error);
    }
  });

program
  .command('remove-concept <id>')
  .description('Remove a concept by its ID')
  .action(async (id) => {
    try {
      await conceptManager.removeConcept(id);
      console.log(`Concept with ID ${id} has been removed.`);
    } catch (error) {
      console.error('Error removing concept:', error);
    }
  });

program
  .command('list-concepts')
  .description('List all concepts and owners')
  .action(async () => {
    try {
      const items = await conceptManager.listAllConcepts();
      console.log('All concepts and owners:');
      for (const item of items) {
        if (conceptManager.isOwner(item)) {
          console.log(`Owner - ID: ${item.id}, Name: ${item.name}`);
        } else {
          console.log(`Concept - ID: ${item.id}, Name: ${item.name}, Description: ${item.description}, Type: ${item.typeId}`);
          const owners = await conceptManager.getOwners(item);
          for (const owner of owners) {
            const ownerConcept = await conceptManager.getConcept(owner.conceptId);
            if (ownerConcept) {
              console.log(`- ${ownerConcept.name} (ID: ${ownerConcept.id}), Factor: ${owner.factor}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error listing concepts and owners:', error);
    }
  });
program.parse(process.argv);
