// src/pages/Wisdom.tsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { useCurrentSteward } from '../hooks/useCurrentSteward';
import { useConceptIds } from '../hooks/useConceptIds';
import { Concept, Seed, Proposal, ProposalAction, HarmonyGuideline } from '../types/api';

const Wisdom: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: currentSteward } = useCurrentSteward();
  const conceptIds = useConceptIds();
  const { data: seeds, isLoading: isSeedsLoading } = useQuery<Seed[]>('seeds', api.getSeeds);
  const { data: concepts, isLoading: isConceptsLoading } = useQuery<Concept[]>('concepts', api.getConcepts);
  
  const [newProposal, setNewProposal] = useState<Partial<Proposal>>({
    Name: '',
    Description: '',
  });
  const [newAction, setNewAction] = useState<Partial<ProposalAction>>({
    Name: '',
    Description: '',
    TargetID: '',
    ActionType: 'UPDATE',
    ActionData: {},
  });

  const proposals = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.PROPOSAL) as Proposal[] || []
  , [seeds, conceptIds.PROPOSAL]);

  const actions = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.PROPOSAL_ACTION) as ProposalAction[] || []
  , [seeds, conceptIds.PROPOSAL_ACTION]);

  const harmonyGuidelines = useMemo(() => 
    seeds?.filter(seed => seed.ConceptID === conceptIds.HARMONY_GUIDELINE) as HarmonyGuideline[] || []
  , [seeds, conceptIds.HARMONY_GUIDELINE]);

  const createProposalMutation = useMutation(api.addSeed<Proposal>, {
    onSuccess: () => {
      queryClient.invalidateQueries('seeds');
      setNewProposal({ Name: '', Description: '' });
      setNewAction({ Name: '', Description: '', TargetID: '', ActionType: 'UPDATE', ActionData: {} });
    },
  });

  const voteOnProposalMutation = useMutation(api.updateSeed<Proposal>, {
    onSuccess: () => {
      queryClient.invalidateQueries('seeds');
    },
  });

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSteward && conceptIds.PROPOSAL && conceptIds.PROPOSAL_ACTION) {
      // First, create the action
      const actionResult = await api.addSeed({
        ...newAction,
        ConceptID: conceptIds.PROPOSAL_ACTION,
      } as ProposalAction);

      // Then, create the proposal referencing the action
      createProposalMutation.mutate({
        ...newProposal,
        ConceptID: conceptIds.PROPOSAL,
        StewardID: currentSteward.SeedID,
        ActionSeedID: actionResult.guid,
        VotesFor: 0,
        VotesAgainst: 0,
        Status: 'active',
      } as Proposal);
    }
  };

  const handleVote = (proposal: Proposal, voteType: 'for' | 'against') => {
    if (currentSteward) {
      const updatedProposal = {
        ...proposal,
        VotesFor: voteType === 'for' ? proposal.VotesFor + 1 : proposal.VotesFor,
        VotesAgainst: voteType === 'against' ? proposal.VotesAgainst + 1 : proposal.VotesAgainst,
      };
      voteOnProposalMutation.mutate(updatedProposal);
    }
  };

  if (isSeedsLoading || isConceptsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Collective Wisdom</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Active Proposals</h2>
        {proposals.filter(p => p.Status === 'active').map(proposal => {
          const action = actions.find(a => a.SeedID === proposal.ActionSeedID);
          return (
            <div key={proposal.SeedID} className="border p-4 rounded mb-4">
              <h3 className="text-xl font-semibold">{proposal.Name}</h3>
              <p className="mb-2">{proposal.Description}</p>
              <div className="mb-2">
                <strong>Proposed by:</strong> {seeds?.find(node => node.SeedID === proposal.StewardID)?.Name || 'Unknown'}
              </div>
              <div className="mb-2">
                <strong>Proposed Action:</strong> {action?.Name}
              </div>
              <div className="mb-2">
                <strong>Action Type:</strong> {action?.ActionType}
              </div>
              <div className="mb-2">
                <strong>Target Concept:</strong> {concepts?.find(concept => concept.ID === action?.TargetID)?.Name || 'Unknown'}
              </div>
              <pre className="bg-gray-100 p-2 mb-2 rounded">
                {JSON.stringify(action?.ActionData, null, 2)}
              </pre>
              <div className="flex items-center mb-2">
                <button 
                  onClick={() => handleVote(proposal, 'for')}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Vote For ({proposal.VotesFor})
                </button>
                <button 
                  onClick={() => handleVote(proposal, 'against')}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Vote Against ({proposal.VotesAgainst})
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Create New Proposal</h2>
        <form onSubmit={handleCreateProposal} className="space-y-4">
          <div>
            <label className="block mb-1">Proposal Title</label>
            <input
              type="text"
              value={newProposal.Name}
              onChange={e => setNewProposal({...newProposal, Name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Proposal Description</label>
            <textarea
              value={newProposal.Description}
              onChange={e => setNewProposal({...newProposal, Description: e.target.value})}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Action Name</label>
            <input
              type="text"
              value={newAction.Name}
              onChange={e => setNewAction({...newAction, Name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Action Description</label>
            <textarea
              value={newAction.Description}
              onChange={e => setNewAction({...newAction, Description: e.target.value})}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Target Concept</label>
            <select
              value={newAction.TargetID}
              onChange={e => setNewAction({...newAction, TargetID: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a concept</option>
              {concepts?.map(concept => (
                <option key={concept.ID} value={concept.ID}>
                  {concept.Name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Action Type</label>
            <select
              value={newAction.ActionType}
              onChange={e => setNewAction({...newAction, ActionType: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="UPDATE">Update</option>
              <option value="CREATE">Create</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Action Data (JSON format)</label>
            <textarea
              value={JSON.stringify(newAction.ActionData, null, 2)}
              onChange={e => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setNewAction({...newAction, ActionData: parsed});
                } catch (error) {
                  // Handle invalid JSON input
                  console.error("Invalid JSON input", error);
                }
              }}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Proposal
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Harmony Guidelines</h2>
        <ul className="list-disc pl-5">
          {harmonyGuidelines.map(guideline => (
            <li key={guideline.SeedID}>{guideline.Name}: {guideline.Description}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Wisdom;