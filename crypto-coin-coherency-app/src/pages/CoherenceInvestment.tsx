// src/pages/Investments.tsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { useConceptIds } from '../hooks/useConceptIds';
import { Seed, Investment, SynergyNode, Concept } from '../types/api';

const Investments: React.FC = () => {
  const queryClient = useQueryClient();
  const conceptIds = useConceptIds();
  const [newInvestment, setNewInvestment] = useState<Omit<Investment, 'SeedID' | 'Timestamp' | 'ConceptID'>>({
    Name: '',
    Description: '',
    InvestorID: '',
    TargetID: '',
    TargetType: 'concept',
    Amount: 0,
  });

  const { data: seeds } = useQuery<Seed[]>('seeds', api.getSeeds);
  const { data: concepts } = useQuery<Concept[]>('concepts', api.getConcepts);

  const investments = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.INVESTMENT) as Investment[] || []
  , [seeds, conceptIds.INVESTMENT]);

  const synergyNodes = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.SYNERGY_NODE) as SynergyNode[] || []
  , [seeds, conceptIds.SYNERGY_NODE]);

  const addInvestmentMutation = useMutation(
    (data: { investment: Omit<Investment, 'SeedID' | 'Timestamp' | 'ConceptID'>, conceptId: string }) => 
      api.addInvestment(data.investment, data.conceptId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('seeds');
        setNewInvestment({
          Name: '',
          Description: '',
          InvestorID: '',
          TargetID: '',
          TargetType: 'concept',
          Amount: 0,
        });
      },
    }
  );

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (conceptIds.INVESTMENT) {
      const investmentData: Omit<Investment, 'SeedID' | 'Timestamp' | 'ConceptID'> = {
        Name: `Investment from ${newInvestment.InvestorID} to ${newInvestment.TargetID}`,
        Description: `${newInvestment.Amount} Energy Tokens invested in ${newInvestment.TargetType}`,
        InvestorID: newInvestment.InvestorID,
        TargetID: newInvestment.TargetID,
        TargetType: newInvestment.TargetType,
        Amount: newInvestment.Amount
      };
      addInvestmentMutation.mutate({ investment: investmentData, conceptId: conceptIds.INVESTMENT });
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
              <strong>Investor:</strong> {synergyNodes.find(node => node.SeedID === investment.InvestorID)?.Name || 'Unknown'} |{' '}
              <strong>Target:</strong> {investment.TargetType === 'concept' 
                ? concepts?.find(c => c.ID === investment.TargetID)?.Name 
                : synergyNodes.find(node => node.SeedID === investment.TargetID)?.Name
              } ({investment.TargetType}) |{' '}
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
              {synergyNodes.map(node => (
                <option key={node.SeedID} value={node.SeedID}>{node.Name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Target Type</label>
            <select 
              value={newInvestment.TargetType}
              onChange={e => setNewInvestment({...newInvestment, TargetType: e.target.value as 'concept' | 'synergyNode', TargetID: ''})}
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
              {newInvestment.TargetType === 'concept' 
                ? concepts?.map(concept => (
                    <option key={concept.ID} value={concept.ID}>{concept.Name}</option>
                  ))
                : synergyNodes
                    .filter(node => node.SeedID !== newInvestment.InvestorID)
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
            disabled={!newInvestment.InvestorID || !newInvestment.TargetID || newInvestment.Amount <= 0 || !conceptIds.INVESTMENT}
          >
            Create Investment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Investments;