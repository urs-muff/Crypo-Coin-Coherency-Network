// src/pages/Nexus.tsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { useConceptIds } from '../hooks/useConceptIds';
import { useCurrentSteward } from '../hooks/useCurrentSteward';
import { Seed, ConceptInvestment, Catalyst, SynergyNode } from '../types/api';
import CatalystComponent from '../components/Catalyst';

const Nexus: React.FC = () => {
  const queryClient = useQueryClient();
  const conceptIds = useConceptIds();
  const { data: currentSteward, isLoading: isStewardLoading } = useCurrentSteward();
  const { data: seeds } = useQuery<Seed[]>('seeds', api.getSeeds);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSteward, setEditedSteward] = useState<SynergyNode | null>(null);
  const [newCatalyst, setNewCatalyst] = useState<Partial<Catalyst>>({
    Name: '',
    Description: '',
    ContentType: '',
    Content: '',
  });

  const stewardAssets = useMemo(() => 
    seeds?.filter(seed => 
      seed.ConceptID === conceptIds.CATALYST && 
      (seed as Catalyst).StewardID === currentSteward?.SeedID
    ) as Catalyst[] || []
  , [seeds, conceptIds.CATALYST, currentSteward]);

  const stewardConceptInvestments = useMemo(() => 
    seeds?.filter(seed => 
      seed.ConceptID === conceptIds.CONCEPT_INVESTMENT && 
      (seed as ConceptInvestment).InvestorID === currentSteward?.SeedID
    ) as ConceptInvestment[] || []
  , [seeds, conceptIds.CONCEPT_INVESTMENT, currentSteward]);

  const updateStewardMutation = useMutation(api.updateSteward, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentSteward');
      setIsEditing(false);
    },
  });

  const addCatalystMutation = useMutation(api.addCatalyst, {
    onSuccess: () => {
      queryClient.invalidateQueries('seeds');
      setNewCatalyst({ Name: '', Description: '', ContentType: '', Content: '' });
    },
  });

  const updateCatalystMutation = useMutation(api.updateCatalyst, {
    onSuccess: () => {
      queryClient.invalidateQueries('seeds');
    },
  });

  const deleteCatalystMutation = useMutation(api.deleteCatalyst, {
    onSuccess: () => {
      queryClient.invalidateQueries('seeds');
    },
  });

  const handleStewardUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedSteward) {
      updateStewardMutation.mutate(editedSteward);
    }
  };

  const handleAddCatalyst = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSteward && newCatalyst.Name && newCatalyst.Description) {
      addCatalystMutation.mutate({
        ...newCatalyst,
        ConceptID: conceptIds.CATALYST,
        StewardID: currentSteward.SeedID,
      } as Catalyst);
    }
  };

  const handleEditCatalyst = (catalyst: Catalyst) => {
    updateCatalystMutation.mutate(catalyst);
  };

  const handleDeleteCatalyst = (seedId: string) => {
    deleteCatalystMutation.mutate(seedId);
  };

  if (isStewardLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Individual Nexus</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Steward Information</h2>
        {isEditing ? (
          <form onSubmit={handleStewardUpdate}>
            <input
              type="text"
              value={editedSteward?.Name || ''}
              onChange={e => setEditedSteward(prev => prev ? {...prev, Name: e.target.value} : null)}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              value={editedSteward?.Description || ''}
              onChange={e => setEditedSteward(prev => prev ? {...prev, Description: e.target.value} : null)}
              className="w-full p-2 mb-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </form>
        ) : (
          <>
            <p><strong>Name:</strong> {currentSteward?.Name}</p>
            <p><strong>Description:</strong> {currentSteward?.Description}</p>
            <button onClick={() => {
              setEditedSteward(currentSteward || null);
              setIsEditing(true);
            }} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Edit</button>
          </>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Balance</h2>
        <p>{currentSteward?.EnergyBalance} Energy Tokens</p>
        {/* Add transfer buttons/form here */}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Assets (Catalysts)</h2>
        {stewardAssets.map(asset => (
          <CatalystComponent 
            key={asset.SeedID} 
            catalyst={asset} 
            onEdit={handleEditCatalyst} 
            onDelete={handleDeleteCatalyst} 
          />
        ))}
        <form onSubmit={handleAddCatalyst} className="mt-4">
          <input
            type="text"
            placeholder="Name"
            value={newCatalyst.Name}
            onChange={e => setNewCatalyst({...newCatalyst, Name: e.target.value})}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newCatalyst.Description}
            onChange={e => setNewCatalyst({...newCatalyst, Description: e.target.value})}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Content Type"
            value={newCatalyst.ContentType}
            onChange={e => setNewCatalyst({...newCatalyst, ContentType: e.target.value})}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Content"
            value={newCatalyst.Content}
            onChange={e => setNewCatalyst({...newCatalyst, Content: e.target.value})}
            className="w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Catalyst</button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Investments</h2>
        <ul className="list-disc pl-5">
          {stewardConceptInvestments.map(conceptInvestment => (
            <li key={conceptInvestment.SeedID}>
              {conceptInvestment.Amount} Energy Tokens invested in ({conceptInvestment.TargetID})
              {/* We need to implement a way to resolve TargetID to its name */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Nexus;