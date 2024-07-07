// src/pages/Investments.tsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { useConceptIds } from '../hooks/useConceptIds';
import { Seed, ConceptInvestment, SeedInvestment, SynergyNode, Concept, Catalyst } from '../types/api';

const Investments: React.FC = () => {
  const queryClient = useQueryClient();
  const conceptIds = useConceptIds();
  const [targetType, setTargetType] = useState<'concept' | 'synergyNode'>('concept');
  const [newInvestment, setNewInvestment] = useState<Omit<ConceptInvestment | SeedInvestment, 'SeedID' | 'Timestamp' | 'ConceptID'>>({
    Name: '',
    Description: '',
    InvestorID: '',
    TargetID: '',
    Amount: 0,
  });

  const { data: seeds } = useQuery<Seed[]>('seeds', api.getSeeds);
  const { data: concepts } = useQuery<Concept[]>('concepts', api.getConcepts);

  const investments = useMemo(() => 
    seeds?.filter(seed => 
      seed.ConceptID === conceptIds.CONCEPT_INVESTMENT ||
      seed.ConceptID === conceptIds.SEED_INVESTMENT
    ) as (ConceptInvestment | SeedInvestment)[] || []
  , [seeds, conceptIds.CONCEPT_INVESTMENT, conceptIds.SEED_INVESTMENT]);

  const seedTargets = useMemo(() => 
    seeds?.filter(seed => 
      seed.ConceptID === conceptIds.SYNERGY_NODE ||
      seed.ConceptID === conceptIds.CATALYST
    ) as (SynergyNode | Catalyst)[] || []
  , [seeds, conceptIds.SYNERGY_NODE, conceptIds.CATALYST]);

  const addInvestmentMutation = useMutation(
    (data: Omit<ConceptInvestment, 'SeedID' | 'Timestamp'> | Omit<SeedInvestment, 'SeedID' | 'Timestamp'>) => 
      api.addSeed(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('seeds');
        setTargetType('concept');
        setNewInvestment({
          Name: '',
          Description: '',
          InvestorID: '',
          TargetID: '',
          Amount: 0,
        });
      },
    }
  );

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (conceptIds.CONCEPT_INVESTMENT && targetType === 'concept') {
      const investmentData: Omit<ConceptInvestment, 'SeedID' | 'Timestamp'> = {
        Name: `Investment from ${newInvestment.InvestorID} to ${newInvestment.TargetID}`,
        Description: `${newInvestment.Amount} Energy Tokens invested`,
        InvestorID: newInvestment.InvestorID,
        TargetID: newInvestment.TargetID,
        Amount: newInvestment.Amount,
        ConceptID: conceptIds.CONCEPT_INVESTMENT,
      };
      addInvestmentMutation.mutate(investmentData);
    }
    if (conceptIds.SEED_INVESTMENT && targetType !== 'concept') {
      const investmentData: Omit<SeedInvestment, 'SeedID' | 'Timestamp'> = {
        Name: `Investment from ${newInvestment.InvestorID} to ${newInvestment.TargetID}`,
        Description: `${newInvestment.Amount} Energy Tokens invested`,
        InvestorID: newInvestment.InvestorID,
        TargetID: newInvestment.TargetID,
        Amount: newInvestment.Amount,
        ConceptID: conceptIds.SEED_INVESTMENT,
      };
      addInvestmentMutation.mutate(investmentData);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Investments</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Current Investments</h2>
        <ul className="space-y-2">
          {investments.map(investment => (
            <li key={investment.SeedID} className="border p-2 rounded">
              <strong>Investor:</strong> {seedTargets.find(node => node.SeedID === investment.InvestorID)?.Name || 'Unknown'} |{' '}
              <strong>Target:</strong> {investment.ConceptID === conceptIds.CONCEPT_INVESTMENT 
                ? concepts?.find(c => c.ID === investment.TargetID)?.Name 
                : seedTargets.find(node => node.SeedID === investment.TargetID)?.Name
              } ({investment.ConceptID === conceptIds.CONCEPT_INVESTMENT ? 'concept' : 'seed'}) |{' '}
              <strong>Amount:</strong> {investment.Amount} Energy Tokens
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-2">Create New Investment</h2>
        <form onSubmit={handleAddInvestment} className="space-y-4">
          <div>
            <label className="block mb-1">Investor</label>
            <select 
              value={newInvestment.InvestorID}
              onChange={e => setNewInvestment({...newInvestment, InvestorID: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Investor</option>
              {seedTargets.map(node => (
                <option key={node.SeedID} value={node.SeedID}>{node.Name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Target Type</label>
            <select 
              value={targetType}
              onChange={e => {
                setTargetType(e.target.value as 'concept' | 'synergyNode');
                setNewInvestment({...newInvestment, TargetID: ''})}
              }
              className="w-full p-2 border rounded"
            >
              <option value="concept">Concept</option>
              <option value="synergyNode">Synergy Node</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Target</label>
            <select 
              value={newInvestment.TargetID}
              onChange={e => setNewInvestment({...newInvestment, TargetID: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Target</option>
              {targetType === 'concept' 
                ? concepts?.map(concept => (
                    <option key={concept.ID} value={concept.ID}>{concept.Name}</option>
                  ))
                : seedTargets
                    .filter(node => node.ConceptID === conceptIds.CATALYST)
                    .map(node => (
                      <option key={node.SeedID} value={node.SeedID}>{node.Name}</option>
                    ))
              }
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Amount (Energy Tokens)</label>
            <input 
              type="number"
              value={newInvestment.Amount}
              onChange={e => setNewInvestment({...newInvestment, Amount: Number(e.target.value)})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!newInvestment.InvestorID || !newInvestment.TargetID || newInvestment.Amount <= 0 || !conceptIds.CONCEPT_INVESTMENT || !conceptIds.SEED_INVESTMENT}
          >
            Create Investment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Investments;