// src/pages/CoherenceExchange.tsx
import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';
import { useConceptIds } from '../hooks/useConceptIds';
import { Seed, Concept, EnergyToken, Catalyst, SynergyNode, FlowEvent, HarmonyAgreement, ConceptInvestment, SeedInvestment } from '../types/api';
import InvestmentComponent from '../components/Investment';

const CoherenceExchange: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'catalysts' | 'nodes' | 'flows' | 'agreements' | 'investments'>('tokens');
  const conceptIds = useConceptIds();

  const { data: seeds } = useQuery<Seed[]>('seeds', api.getSeeds);
  const { data: concepts } = useQuery<Concept[]>('concepts', api.getConcepts);

  const energyTokens = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.ENERGY_TOKEN) as EnergyToken[] || []
  , [seeds, conceptIds.ENERGY_TOKEN]);

  const catalysts = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.CATALYST) as Catalyst[] || []
  , [seeds, conceptIds.CATALYST]);

  const synergyNodes = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.SYNERGY_NODE) as SynergyNode[] || []
  , [seeds, conceptIds.SYNERGY_NODE]);

  const flowEvents = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.FLOW_EVENT) as FlowEvent[] || []
  , [seeds, conceptIds.FLOW_EVENT]);

  const harmonyAgreements = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.HARMONY_AGREEMENT) as HarmonyAgreement[] || []
  , [seeds, conceptIds.HARMONY_AGREEMENT]);

  const allInvestments = useMemo(() => 
    seeds?.filter(seed => 
      seed.ConceptID === conceptIds.CONCEPT_INVESTMENT ||
      seed.ConceptID === conceptIds.SEED_INVESTMENT
    ) as (ConceptInvestment | SeedInvestment)[] || []
  , [seeds, conceptIds.CONCEPT_INVESTMENT, conceptIds.SEED_INVESTMENT]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Coherence Exchange</h1>
      <div className="mb-4">
      <button 
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'tokens' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('tokens')}
        >
          Energy Tokens
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'catalysts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('catalysts')}
        >
          Catalysts
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'nodes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('nodes')}
        >
          Synergy Nodes
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'flows' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('flows')}
        >
          Flow Events
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'agreements' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('agreements')}
        >
          Harmony Agreements
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'investments' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('investments')}
        >
          Investments
        </button>
      </div>
      <div>
        {activeTab === 'tokens' && (
          <ul>
            {energyTokens.map(token => (
              <li key={token.SeedID}>Energy Token: {token.Value}</li>
            ))}
          </ul>
        )}
        {activeTab === 'catalysts' && (
          <ul>
            {catalysts.map(catalyst => (
              <li key={catalyst.SeedID}>{catalyst.Name}: {catalyst.Description}</li>
            ))}
          </ul>
        )}
        {activeTab === 'nodes' && (
          <ul>
            {synergyNodes.map(node => (
              <li key={node.SeedID}>{node.Name}: {node.EnergyBalance} energy</li>
            ))}
          </ul>
        )}
        {activeTab === 'flows' && (
          <ul>
            {flowEvents.map(event => (
              <li key={event.SeedID}>
                {event.From} -&gt; {event.To}: {event.Amount} energy ({new Date(event.Timestamp).toLocaleString()})
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'agreements' && (
          <ul>
            {harmonyAgreements.map(agreement => (
              <li key={agreement.SeedID}>
                Parties: {agreement.Parties.join(', ')} | Status: {agreement.Status}
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'investments' && (
          <ul>
            {allInvestments.map(investment => (
              <InvestmentComponent key={investment.SeedID} investment={investment}
                seeds={seeds || []} concepts={concepts || []} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CoherenceExchange;