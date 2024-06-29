import { program } from 'commander';
import ConceptManager from './concept-manager.js';
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
      await stateManager.saveState({ ownerId: owner.id });
      const endpoint = `https://your-domain.com/owner/${ownerId}`; // This should be dynamically generated in a real system
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
  .command('list-concepts')
  .description('List all concepts')
  .action(async () => {
    try {
      const concepts = await conceptManager.listAllConcepts();
      console.log('All concepts:');
      concepts.forEach(concept => {
        console.log(`ID: ${concept.id}, Name: ${concept.name}, Description: ${concept.description}, Owners: ${concept.owners.map(owner => owner.conceptId).join(', ')}`);
      });
    } catch (error) {
      console.error('Error listing concepts:', error);
    }
  });

program.parse(process.argv);
