// src/pages/ConceptExplorer.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { Concept, Relationship } from '../types/api';

const ConceptExplorer: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newConcept, setNewConcept] = useState({ Name: '', Description: '', Type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showNewConceptForm, setShowNewConceptForm] = useState(false);

  const { data: concepts, isLoading: conceptsLoading } = useQuery<Concept[]>('concepts', api.getConcepts);
  const { data: relationships, isLoading: relationshipsLoading } = useQuery<Relationship[]>('relationships', api.getRelationships);

  const addConceptMutation = useMutation(api.addConcept, {
    onSuccess: () => {
      queryClient.invalidateQueries('concepts');
      setNewConcept({ Name: '', Description: '', Type: '' });
    },
  });

  const updateConceptMutation = useMutation(api.updateConcept, {
    onSuccess: () => {
      queryClient.invalidateQueries('concepts');
      setEditMode(false);
    },
  });

  const deleteConceptMutation = useMutation(api.deleteConcept, {
    onSuccess: () => {
      queryClient.invalidateQueries('concepts');
      setSelectedConcept(null);
    },
  });

  const handleConceptSelect = useCallback((concept: Concept) => {
    setSelectedConcept(concept);
    setEditMode(false);
  }, []);

  const handleEditToggle = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode]);

  const handleConceptUpdate = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (selectedConcept) {
      updateConceptMutation.mutate(selectedConcept);
    }
  }, [selectedConcept, updateConceptMutation]);

  const handleConceptDelete = useCallback(() => {
    if (selectedConcept && window.confirm('Are you sure you want to delete this concept?')) {
      deleteConceptMutation.mutate(selectedConcept.ID);
    }
  }, [selectedConcept, deleteConceptMutation]);

  const handleNewConceptSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    addConceptMutation.mutate(newConcept);
  }, [newConcept, addConceptMutation]);

  const handleNewConceptToggle = useCallback(() => {
    setShowNewConceptForm(!showNewConceptForm);
    setSelectedConcept(null);
    setEditMode(false);
  }, [showNewConceptForm]);

  const relatedConcepts = useCallback((conceptId: string) => {
    return relationships
      ?.filter(r => r.SourceID === conceptId || r.TargetID === conceptId)
      .map(r => {
        const relatedConceptId = r.SourceID === conceptId ? r.TargetID : r.SourceID;
        const relatedConcept = concepts?.find(c => c.ID === relatedConceptId);
        return { 
          concept: relatedConcept, 
          relationshipType: concepts?.find(c => c.ID === r.Type)?.Name || 'Unknown',
          direction: r.SourceID === conceptId ? 'outgoing' : 'incoming'
        };
      });
  }, [relationships, concepts]);

  const filteredAndSortedConcepts = useMemo(() => {
    let result = concepts || [];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(c => 
        c.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.Description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType) {
      result = result.filter(c => c.Type === filterType);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.Name.localeCompare(b.Name)
          : b.Name.localeCompare(a.Name);
      } else {
        return sortOrder === 'asc'
          ? a.Type.localeCompare(b.Type)
          : b.Type.localeCompare(a.Type);
      }
    });
    
    return result;
  }, [concepts, searchTerm, filterType, sortBy, sortOrder]);

  const uniqueTypes = useMemo(() => {
    if (!concepts) return [];
    const typesSet = new Set<string>();
    concepts.forEach(c => typesSet.add(c.Type));
    return Array.from(typesSet);
  }, [concepts]);

  if (conceptsLoading || relationshipsLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Concept Explorer</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'type')}
            className="p-2 border rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border rounded bg-blue-500 text-white"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 flex flex-col">
          <div className="overflow-y-auto flex-1 border-r">
            <ul className="divide-y">
              {filteredAndSortedConcepts.map(concept => (
                <li 
                  key={concept.ID} 
                  className={`cursor-pointer p-2 hover:bg-gray-100 ${selectedConcept?.ID === concept.ID ? 'bg-blue-100' : ''}`}
                  onClick={() => handleConceptSelect(concept)}
                >
                  <span className="font-semibold">{concept.Name}</span>
                  <span className="text-gray-500 ml-2">({concept.Type})</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleNewConceptToggle}
            className="bg-green-500 text-white px-4 py-2 m-2 rounded"
          >
            {showNewConceptForm ? 'Cancel New Concept' : 'Add New Concept'}
          </button>
        </div>
        <div className="w-2/3 p-4 overflow-y-auto">
          {showNewConceptForm ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add New Concept</h2>
              <form onSubmit={handleNewConceptSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newConcept.Name}
                  onChange={e => setNewConcept({...newConcept, Name: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  value={newConcept.Description}
                  onChange={e => setNewConcept({...newConcept, Description: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                  rows={4}
                />
                <select
                  value={newConcept.Type}
                  onChange={e => setNewConcept({...newConcept, Type: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="">Select Type</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Concept</button>
              </form>
            </div>
          ) : selectedConcept ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {editMode ? 'Edit Concept' : selectedConcept.Name}
              </h2>
              {editMode ? (
                <form onSubmit={handleConceptUpdate}>
                  <input
                    type="text"
                    value={selectedConcept.Name}
                    onChange={e => setSelectedConcept({...selectedConcept, Name: e.target.value})}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <textarea
                    value={selectedConcept.Description}
                    onChange={e => setSelectedConcept({...selectedConcept, Description: e.target.value})}
                    className="w-full p-2 mb-2 border rounded"
                    rows={4}
                  />
                  <select
                    value={selectedConcept.Type}
                    onChange={e => setSelectedConcept({...selectedConcept, Type: e.target.value})}
                    className="w-full p-2 mb-2 border rounded"
                  >
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                  <button type="button" onClick={handleEditToggle} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </form>
              ) : (
                <div>
                  <p className="mb-2"><strong>Description:</strong> {selectedConcept.Description}</p>
                  <p className="mb-4"><strong>Type:</strong> {selectedConcept.Type}</p>
                  <h3 className="text-xl font-bold mt-4 mb-2">Related Concepts</h3>
                  <ul className="list-disc pl-5">
                    {relatedConcepts(selectedConcept.ID)?.map((related, index) => (
                      <li key={index} className="mb-1">
                        <span className="font-semibold">{related.concept?.Name}</span>
                        <span className="text-gray-500 ml-2">({related.relationshipType}, {related.direction})</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <button onClick={handleEditToggle} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                    <button onClick={handleConceptDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              Select a concept or add a new one to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConceptExplorer;