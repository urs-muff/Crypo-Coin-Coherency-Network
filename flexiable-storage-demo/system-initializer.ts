// system-initializer.ts
import Concept from './concept';
import ConceptManager from './concept-manager';

async function initializeSystem(conceptManager: ConceptManager): Promise<{ typeConceptId: string, ownerTypeId: string }> {
  // Create the 'type' concept (meta-type)
  const typeTypeConcept = new Concept('Type', 'Represents the type of a concept', '');
  const typeTypeId = await conceptManager.createConcept(typeTypeConcept);
  
  // Update the 'type' concept to have itself as its type
  typeTypeConcept.typeId = typeTypeId;
  await conceptManager.updateConcept(typeTypeId, typeTypeConcept);

  // Create the 'owner' type
  const ownerTypeConcept = new Concept('Owner', 'Represents an owner of concepts', typeTypeId);
  const ownerTypeId = await conceptManager.createConcept(ownerTypeConcept);

  return { typeConceptId: typeTypeId, ownerTypeId };
}

export default initializeSystem;