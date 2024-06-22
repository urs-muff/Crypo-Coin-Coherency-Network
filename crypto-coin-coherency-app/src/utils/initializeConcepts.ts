// File: src/utils/initializeConcepts.ts

import { FlexibleConceptAgent } from '../agents/FlexibleConceptAgent';
import { ConceptNetwork } from '../network/ConceptNetwork';
import { Concept, ConceptID, MetaConceptID, MetaConcept, LatentSpaceVector, ConceptType } from '../types/ConceptTypes';

const createMetaConcept = (
  id: MetaConceptID,
  name: string,
  description: string
): MetaConcept => ({
  id,
  type: 'MetaConcept',
  metaConceptId: 'META000', // Root meta-concept
  name,
  description,
  value: {},
  children: {}
});

const createBasicConcept = (
  id: ConceptID,
  type: ConceptType,
  metaConceptId: MetaConceptID,
  name: string,
  description: string,
  value: any = {}
): Concept => ({
  id,
  type,
  metaConceptId,
  name,
  description,
  value,
  children: {}
});

const createLatentVector = (dimensions: number): LatentSpaceVector => ({
  dimensions: Array.from({ length: dimensions }, () => Math.random())
});

export const initializeOneCoinConcept = async (agent: FlexibleConceptAgent, network: ConceptNetwork) => {
  console.log('Starting One Coin concept initialization');

  try {
    let existingConcepts = await agent.getAllConcepts();
    console.log('Existing concepts:', existingConcepts);

    const createConceptIfNotExists = async (concept: Concept) => {
      try {
        const existingConcept = existingConcepts.find(c => c.id === concept.id);
        if (!existingConcept) {
          console.log(`Creating concept: ${concept.id}`);
          await agent.createConcept(concept);
          network.addConcept(concept, createLatentVector(10));
          existingConcepts.push(concept);
        } else {
          console.log(`Concept ${concept.id} already exists, skipping creation`);
        }
      } catch (error) {
        console.error(`Error creating/adding concept ${concept.id}:`, error);
        // Continue with the initialization process despite the error
      }
    };

    // Create meta-concepts
    const metaConcepts = {
      root: createMetaConcept('META000', 'Root Meta-Concept', 'The root of all meta-concepts'),
      metaConcept: createMetaConcept('META001', 'Meta-Concept', 'Template for meta-concepts'),
      primitive: createMetaConcept('META002', 'Primitive Concept', 'Template for primitive concepts'),
      array: createMetaConcept('META003', 'Array Concept', 'Template for array concepts'),
      dictionary: createMetaConcept('META004', 'Dictionary Concept', 'Template for dictionary concepts'),
      generic: createMetaConcept('META005', 'Generic Concept', 'Template for generic concepts'),
      property: createMetaConcept('META006', 'Property Concept', 'Template for property concepts'),
      relation: createMetaConcept('META007', 'Relation Concept', 'Template for relation concepts'),
      feature: createMetaConcept('META008', 'Feature Concept', 'Template for feature concepts'),
      action: createMetaConcept('META009', 'Action Concept', 'Template for action concepts'),
      constraint: createMetaConcept('META010', 'Constraint Concept', 'Template for constraint concepts'),
      event: createMetaConcept('META011', 'Event Concept', 'Template for event concepts'),
      developmentIdea: createMetaConcept('META012', 'Development Idea Concept', 'Template for development idea concepts'),
      openQuestion: createMetaConcept('META013', 'Open Question Concept', 'Template for open question concepts'),
    };

    // Create meta-concepts in the agent
    for (const metaConcept of Object.values(metaConcepts)) {
      await createConceptIfNotExists(metaConcept);
    }

    existingConcepts = await agent.getAllConcepts();

    // Create actual concepts using meta-concepts
    const oneCoinConcept = createBasicConcept(
      'GEN001',
      'Generic',
      metaConcepts.generic.id,
      'One Coin',
      'One Coin is designed to facilitate transactions and value representation across the system.',
    );

    const propertiesConcept = createBasicConcept(
      'GEN002',
      'Property',
      metaConcepts.property.id,
      'Properties',
      'Properties of One Coin',
      {
        supportedCurrencies: ['USD', 'EUR', 'JPY', 'BTC', 'ETH'],
        canBeWrapped: true
      }
    );

    const relationsConcept = createBasicConcept(
      'GEN003',
      'Relation',
      metaConcepts.relation.id,
      'Relations',
      'Relations of One Coin',
      {
        IntegratesWith: 'GEN011',
        EssentialFor: 'GEN013'
      }
    );

    const featuresConcept = createBasicConcept(
      'GEN004',
      'Feature',
      metaConcepts.feature.id,
      'Features',
      'Features of One Coin',
      {
        transferable: true,
        divisible: true,
        mintable: true
      }
    );

    const actionsConcept = createBasicConcept(
      'GEN005',
      'Action',
      metaConcepts.action.id,
      'Actions',
      'Actions available for One Coin',
      {
        transfer: 'Transfer One Coin',
        mint: 'Create new One Coin',
        burn: 'Destroy One Coin'
      }
    );

    const constraintsConcept = createBasicConcept(
      'GEN006',
      'Constraint',
      metaConcepts.constraint.id,
      'Constraints',
      'Constraints for One Coin',
      {
        maxSupply: '1,000,000,000 coins',
        minTransferAmount: '0.000001 coins'
      }
    );

    // Create concepts in the agent
    await createConceptIfNotExists(oneCoinConcept);
    await createConceptIfNotExists(propertiesConcept);
    await createConceptIfNotExists(relationsConcept);
    await createConceptIfNotExists(featuresConcept);
    await createConceptIfNotExists(actionsConcept);
    await createConceptIfNotExists(constraintsConcept);

    // Establish relationships
    network.addRelation(oneCoinConcept.id, propertiesConcept.id);
    network.addRelation(oneCoinConcept.id, relationsConcept.id);
    network.addRelation(oneCoinConcept.id, featuresConcept.id);
    network.addRelation(oneCoinConcept.id, actionsConcept.id);
    network.addRelation(oneCoinConcept.id, constraintsConcept.id);

    console.log('One Coin concept initialized successfully');
  } catch (error) {
    console.error('Error during initialization:', error);
    throw error;
  }
};