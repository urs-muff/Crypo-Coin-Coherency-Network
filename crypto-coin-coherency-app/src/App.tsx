// File: src/App.tsx

import React, { useState, useEffect } from 'react';
import { ConceptList } from './components/ConceptList';
import { ConceptDetail } from './components/ConceptDetail';
import { FlexibleConceptAgent } from './agents/FlexibleConceptAgent';
import { initializeOneCoinConcept } from './utils/initializeConcepts';
import { ConceptID } from './types/ConceptTypes';
import { ConceptNetwork } from './network/ConceptNetwork';

import './App.css';

const globalAgent = new FlexibleConceptAgent();
const globalNetwork = new ConceptNetwork();

const App: React.FC = () => {
  const [agent] = useState(() => globalAgent);
  const [network] = useState(() => globalNetwork);
  const [selectedConceptId, setSelectedConceptId] = useState<ConceptID | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const initializeConcepts = async () => {
      if (isInitialized) return;

      try {
        setDebugInfo(prev => prev + 'Initializing concepts...\n');
        let concepts = await agent.getAllConcepts();
        setDebugInfo(prev => prev + `Initial concepts count: ${concepts.length}\n`);

        await initializeOneCoinConcept(agent, network);

        concepts = await agent.getAllConcepts();
        setDebugInfo(prev => prev + `Concepts after initialization: ${concepts.length}\n`);

        setIsInitialized(true);
      } catch (error) {
        setDebugInfo(prev => prev + `Error during initialization: ${error}\n`);
        console.error('Error during initialization:', error);
      }
    };

    initializeConcepts();
  }, [agent, network, isInitialized]);

  const handleConceptSelect = (id: ConceptID) => {
    setSelectedConceptId(id);
  };

  const handleConceptUpdated = () => {
    // Trigger a re-render of the ConceptList
    setIsInitialized(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto Coin Coherency Network Concepts</h1>
      </header>
      <main className="App-main">
        <div className="concept-list-container">
          <ConceptList agent={agent} onSelectConcept={handleConceptSelect} />
        </div>
        <div className="concept-detail-container">
          {selectedConceptId ? (
            <ConceptDetail
              agent={agent}
              conceptId={selectedConceptId}
              onConceptUpdated={handleConceptUpdated}
            />
          ) : (
            <p>Select a concept to view details</p>
          )}
        </div>
      </main>
      <pre className="debug-info">{debugInfo}</pre>
    </div>
  );
};

export default App;