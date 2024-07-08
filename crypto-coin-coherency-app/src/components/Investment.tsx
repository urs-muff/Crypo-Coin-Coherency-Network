// src/components/Investment.tsx
import React from 'react';
import { ConceptInvestment, SeedInvestment, Seed, Concept } from '../types/api';
import { useConceptIds } from '../hooks/useConceptIds';

interface InvestmentProps {
  investment: ConceptInvestment | SeedInvestment;
  seeds: Seed[];
  concepts: Concept[];
}

const InvestmentComponent: React.FC<InvestmentProps> = ({ investment, seeds, concepts }) => {
  const conceptIds = useConceptIds();

  const getInvestorName = () => {
    return seeds.find(node => node.SeedID === investment.InvestorID)?.Name || 'Unknown';
  };

  const getTargetName = () => {
    if (investment.ConceptID === conceptIds.CONCEPT_INVESTMENT) {
      return concepts?.find(c => c.ID === investment.TargetID)?.Name || 'Unknown Concept';
    } else {
      return seeds.find(node => node.SeedID === investment.TargetID)?.Name || 'Unknown Seed';
    }
  };

  const getTargetType = () => {
    return investment.ConceptID === conceptIds.CONCEPT_INVESTMENT ? 'concept' : 'seed';
  };

  return (
    <div className="border p-2 rounded mb-2">
      <p>
        <strong>Investor:</strong> {getInvestorName()} |{' '}
        <strong>Target:</strong> {getTargetName()} ({getTargetType()}) |{' '}
        <strong>Amount:</strong> {investment.Amount} Energy Tokens
      </p>
    </div>
  );
};

export default InvestmentComponent;