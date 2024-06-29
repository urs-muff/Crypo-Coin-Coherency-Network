import { program } from 'commander';
import ConceptManager, { OwnerData } from './concept-manager.js';
import IPFSStorage from './ipfs-storage.js';
import StateManager from './state-manager.js';
import OwnerRegistry from './owner-registry.js';
import CommunicationProtocol from './communication-protocol.js';
import Concept from './concept.js';
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
  .description('Initialize a new owner')
  .action(async (ownerName) => {
    try {
      const ownerId = await getPeerId();
      const owner = await conceptManager.createOwner(ownerId, ownerName);
      console.log('Created owner:', owner);
      await stateManager.saveState({ ownerId: owner.id });
      const endpoint = `https://your-domain.com/owner/${ownerId}`;
      await ownerRegistry.registerOwner(ownerId, ownerName, endpoint);
      console.log(`Owner initialized and registered: ${owner.id}`);
    } catch (error) {
      console.error('Error initializing owner:', error);
    }
  });

program
  .command('create-concept <name> <description>')
  .description('Create a new concept')
  .action(async (name, description) => {
    try {
      const state = await stateManager.loadState();
      const { ownerId } = state;

      // Check if a concept with this name already exists
      const existingConcept = await conceptManager.findConceptByName(name);
      if (existingConcept) {
        console.log(`A concept with the name "${name}" already exists. Its ID is: ${existingConcept.id}`);
        return;
      }

      const concept = new Concept(name, description, 'default-type-id');
      concept.addOwner(ownerId, 1);  // Linking the concept to the owner
      const createdConcept = await conceptManager.createConcept(concept);
      console.log(`Concept created: ${createdConcept}`);
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
      items.forEach(item => {
        if (item instanceof Concept) {
          console.log(`Concept - ID: ${item.id}, Name: ${item.name}, Description: ${item.description}, Type: ${item.typeId}, Owners: ${item.owners.map(owner => owner.conceptId).join(', ')}`);
        } else {
          console.log(`Owner - ID: ${item.id}, Name: ${item.name}`);
        }
      });
    } catch (error) {
      console.error('Error listing concepts and owners:', error);
    }
  });

program.parse(process.argv);
