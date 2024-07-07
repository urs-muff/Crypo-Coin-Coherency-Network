// src/pages/ConceptExplorer.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { Concept } from '../types/api';

const ConceptExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newConcept, setNewConcept] = useState({ Name: '', Description: '', Type: '' });
  const queryClient = useQueryClient();

  const { data: concepts, isLoading, error } = useQuery<Concept[]>('concepts', api.getConcepts);

  const createConceptMutation = useMutation(api.addConcept, {
    onSuccess: () => {
      queryClient.invalidateQueries('concepts');
      setNewConcept({ Name: '', Description: '', Type: '' });
    },
  });

  const deleteConceptMutation = useMutation(api.deleteConcept, {
    onSuccess: () => {
      queryClient.invalidateQueries('concepts');
    },
  });

  const filteredConcepts = concepts?.filter(concept =>
    concept.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading concepts...</div>;
  if (error) return <div>Error loading concepts</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Concept Explorer</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search concepts..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Add New Concept</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-2"
          value={newConcept.Name}
          onChange={(e) => setNewConcept({ ...newConcept, Name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border rounded mb-2"
          value={newConcept.Description}
          onChange={(e) => setNewConcept({ ...newConcept, Description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type"
          className="w-full p-2 border rounded mb-2"
          value={newConcept.Type}
          onChange={(e) => setNewConcept({ ...newConcept, Type: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => createConceptMutation.mutate(newConcept)}
        >
          Add Concept
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts?.map((concept) => (
          <div key={concept.ID} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{concept.Name}</h3>
            <p className="text-gray-600">{concept.Description}</p>
            <p className="text-sm text-gray-500">Type: {concept.Type}</p>
            <p className="text-sm text-gray-500">Created: {new Date(concept.Timestamp).toLocaleString()}</p>
            <button
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
              onClick={() => deleteConceptMutation.mutate(concept.ID)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConceptExplorer;