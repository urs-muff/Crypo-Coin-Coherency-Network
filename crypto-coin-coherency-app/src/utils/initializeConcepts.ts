// File: src/utils/initializeConcepts.ts

import { FlexibleConceptAgent } from '../agents/FlexibleConceptAgent';
import { ConceptData } from '../types/ConceptTypes';
import { 
  ConceptID, 
  PropertyID, 
  RelationID, 
  FeatureID, 
  ActionID, 
  ConstraintID, 
  EventID, 
  DevelopmentIdeaID, 
  OpenQuestionID 
} from '../types/BasicTypes';

export const initializeOneCoinConcept = async (agent: FlexibleConceptAgent) => {
  console.log('Starting One Coin concept initialization');

  try {
    // Check if One Coin concept already exists
    const existingConcepts = await agent.getAllConcepts();
    console.log('Existing concepts:', existingConcepts);
    const existingOneCoin = existingConcepts.find(concept => concept.id === 'CC001');

    if (existingOneCoin)
      return;

    const oneCoinConceptData: ConceptData = {
      concept: {
        id: 'CC001' as ConceptID,
        type: 'Currency',
        name: 'One Coin',
        summary: 'Primary currency of the Crypto Coin Coherency Network',
        description: 'One Coin is designed to facilitate transactions and value representation across the system.'
      },
      properties: [
        {
          id: 'PROP001' as PropertyID,
          conceptId: 'CC001' as ConceptID,
          key: 'supportedCurrencies',
          value: ['USD', 'EUR', 'JPY', 'BTC', 'ETH']
        },
        {
          id: 'PROP002' as PropertyID,
          conceptId: 'CC001' as ConceptID,
          key: 'canBeWrapped',
          value: true
        }
      ],
      relations: [
        {
          id: 'REL001' as RelationID,
          sourceConceptId: 'CC001' as ConceptID,
          targetConceptId: 'CC003' as ConceptID,
          type: 'IntegratesWith',
          label: 'Integrates with Transaction Properties'
        },
        {
          id: 'REL002' as RelationID,
          sourceConceptId: 'CC001' as ConceptID,
          targetConceptId: 'CC006' as ConceptID,
          type: 'EssentialFor',
          label: 'Essential for Marketplace operations'
        }
      ],
      features: [
        {
          id: 'FEAT001' as FeatureID,
          conceptId: 'CC001' as ConceptID,
          name: 'Multi-currency Display',
          value: true,
          description: 'One Coin\'s value can be viewed in any supported currency'
        },
        {
          id: 'FEAT002' as FeatureID,
          conceptId: 'CC001' as ConceptID,
          name: 'Transaction Marking',
          value: true,
          description: 'All supported currency rates are marked when a transaction occurs'
        },
        {
          id: 'FEAT003' as FeatureID,
          conceptId: 'CC001' as ConceptID,
          name: 'Wrapping Capability',
          value: true,
          description: 'Allows for interoperability with other blockchain networks'
        }
      ],
      actions: [
        {
          id: 'ACT001' as ActionID,
          conceptId: 'CC001' as ConceptID,
          name: 'Convert Currency',
          description: 'Convert One Coin value to another supported currency'
        },
        {
          id: 'ACT002' as ActionID,
          conceptId: 'CC001' as ConceptID,
          name: 'Wrap Coin',
          description: 'Wrap One Coin for use on another blockchain'
        }
      ],
      constraints: [
        {
          id: 'CONS001' as ConstraintID,
          conceptId: 'CC001' as ConceptID,
          condition: 'totalSupply <= maxSupply',
          message: 'Total supply of One Coin must not exceed the maximum supply'
        }
      ],
      events: [
        {
          id: 'EVT001' as EventID,
          conceptId: 'CC001' as ConceptID,
          type: 'PriceChanged',
          description: 'The price of One Coin has changed'
        }
      ],
      developmentIdeas: [
        {
          id: 'DEV001' as DevelopmentIdeaID,
          conceptId: 'CC001' as ConceptID,
          description: 'Integration with major cryptocurrency exchanges for easy conversion'
        },
        {
          id: 'DEV002' as DevelopmentIdeaID,
          conceptId: 'CC001' as ConceptID,
          description: 'Development of stable coin pegging mechanisms to reduce volatility'
        },
        {
          id: 'DEV003' as DevelopmentIdeaID,
          conceptId: 'CC001' as ConceptID,
          description: 'Creation of One Coin derivatives for specialized network functions'
        }
      ],
      openQuestions: [
        {
          id: 'QST001' as OpenQuestionID,
          conceptId: 'CC001' as ConceptID,
          question: 'How will the initial distribution and pricing of One Coin be handled?'
        },
        {
          id: 'QST002' as OpenQuestionID,
          conceptId: 'CC001' as ConceptID,
          question: 'What measures will be in place to manage inflation/deflation of One Coin?'
        },
        {
          id: 'QST003' as OpenQuestionID,
          conceptId: 'CC001' as ConceptID,
          question: 'How will One Coin interact with traditional fiat currencies outside the network?'
        }
      ]
    };

    await agent.createConcept(oneCoinConceptData);
  } catch (error) {
    console.error('Error during One Coin concept initialization:', error);
  }
};