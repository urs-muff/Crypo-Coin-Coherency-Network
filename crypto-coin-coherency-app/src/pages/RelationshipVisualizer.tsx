// src/pages/RelationshipVisualizer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ForceGraph2D from 'react-force-graph-2d';
import { api } from '../utils/api';
import { Concept, Relationship } from '../types/api';

interface NodeObject {
  id: string;
  name: string;
  x?: number;
  y?: number;
  __bckgDimensions?: [number, number];
}

interface LinkObject {
  source: string | NodeObject;
  target: string | NodeObject;
  id: string;
  type: string;
}

interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

const RelationshipVisualizer: React.FC = () => {
  const queryClient = useQueryClient();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [newRelationship, setNewRelationship] = useState({
    SourceID: '',
    TargetID: '',
    Type: '',
  });
  const graphRef = useRef<any>();

  const { data: concepts } = useQuery<Concept[]>('concepts', api.getConcepts);
  const { data: relationships } = useQuery<Relationship[]>('relationships', api.getRelationships);

  const addRelationshipMutation = useMutation(api.addRelationship, {
    onSuccess: () => {
      queryClient.invalidateQueries('relationships');
      setNewRelationship({ SourceID: '', TargetID: '', Type: '' });
    },
  });

  const deepenRelationshipMutation = useMutation(api.deepenRelationship, {
    onSuccess: () => {
      queryClient.invalidateQueries('relationships');
    },
  });

  useEffect(() => {
    if (concepts && relationships) {
      const nodes: NodeObject[] = concepts.filter(c => c.Type !== "RelationshipType").map(concept => ({
        id: concept.ID,
        name: concept.Name,
      }));

      const links: LinkObject[] = relationships.map(relationship => ({
        source: relationship.SourceID,
        target: relationship.TargetID,
        id: relationship.ID,
        type: concepts.find(c => c.ID === relationship.Type)?.Name || 'Unknown',
      }));

      setGraphData({ nodes, links });
    }
  }, [concepts, relationships]);

  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0) {
      setTimeout(() => {
        graphRef.current.zoomToFit(400);
      }, 500);
    }
  }, [graphData]);

  const handleLinkClick = useCallback((link: LinkObject) => {
    const clickedRelationship = relationships?.find(r => r.ID === link.id);
    setSelectedRelationship(clickedRelationship || null);
  }, [relationships]);

  const relationshipTypes = concepts?.filter(c => c.Type === "RelationshipType") || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRelationship(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRelationship.SourceID && newRelationship.TargetID && newRelationship.Type) {
      addRelationshipMutation.mutate({
        ...newRelationship,
        EnergyFlow: 1,
        FrequencySpec: [1],
        Amplitude: 1,
        Volume: 1,
        Depth: 1,
        Interactions: 0,
        LastInteraction: new Date().toISOString(),
      });
    } else {
      alert("Please fill all fields");
    }
  };

  const nodeCanvasObject = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12/globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions: [number, number] = [textWidth, fontSize].map(n => n + fontSize * 0.2) as [number, number];

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    if (typeof node.x === 'number' && typeof node.y === 'number') {
      ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1E40AF';
      ctx.fillText(label, node.x, node.y);
    }

    node.__bckgDimensions = bckgDimensions;
  }, []);

  const linkCanvasObject = useCallback((link: LinkObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const start = link.source as NodeObject;
    const end = link.target as NodeObject;

    if (typeof start.x === 'number' && typeof start.y === 'number' &&
        typeof end.x === 'number' && typeof end.y === 'number') {
      // Draw the line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();

      // Draw the label
      const label = link.type;
      const fontSize = 10/globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions: [number, number] = [textWidth, fontSize].map(n => n + fontSize * 0.2) as [number, number];

      // Calculate the position for the label (midpoint of the link)
      const midX = start.x + (end.x - start.x) / 2;
      const midY = start.y + (end.y - start.y) / 2;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(midX - bckgDimensions[0] / 2, midY - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#4B5563';
      ctx.fillText(label, midX, midY);
    }
  }, []);

  return (
    <div className="h-screen flex">
      <div className="w-3/4 h-full relative">
      <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={() => "#1E40AF"}
          linkColor={() => "#60A5FA"}
          linkWidth={2}
          onLinkClick={handleLinkClick}
          width={window.innerWidth * 0.75}
          height={window.innerHeight}
          nodeCanvasObject={nodeCanvasObject}
          nodePointerAreaPaint={(node: NodeObject, color, ctx) => {
            ctx.fillStyle = color;
            const bckgDimensions = node.__bckgDimensions;
            if (bckgDimensions && typeof node.x === 'number' && typeof node.y === 'number') {
              ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
            }
          }}
          linkCanvasObject={linkCanvasObject}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
        />
      </div>
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Relationship Details</h2>
        {selectedRelationship ? (
          <div>
            <p><strong>Type:</strong> {concepts?.find(c => c.ID === selectedRelationship.Type)?.Name}</p>
            <p><strong>Energy Flow:</strong> {selectedRelationship.EnergyFlow}</p>
            <p><strong>Depth:</strong> {selectedRelationship.Depth}</p>
            <p><strong>Interactions:</strong> {selectedRelationship.Interactions}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => deepenRelationshipMutation.mutate(selectedRelationship.ID)}
            >
              Deepen Relationship
            </button>
          </div>
        ) : (
          <p>Select a relationship to view details</p>
        )}

        <h2 className="text-2xl font-bold mt-8 mb-4">Add New Relationship</h2>
        <form onSubmit={handleSubmit}>
          <select 
            name="SourceID" 
            value={newRelationship.SourceID}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Source Concept</option>
            {concepts?.filter(c => c.Type !== "RelationshipType").map(concept => (
              <option key={concept.ID} value={concept.ID}>{concept.Name}</option>
            ))}
          </select>
          <select 
            name="TargetID"
            value={newRelationship.TargetID}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Target Concept</option>
            {concepts?.filter(c => c.Type !== "RelationshipType").map(concept => (
              <option key={concept.ID} value={concept.ID}>{concept.Name}</option>
            ))}
          </select>
          <select
            name="Type"
            value={newRelationship.Type}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Relationship Type</option>
            {relationshipTypes.map(type => (
              <option key={type.ID} value={type.ID}>{type.Name}</option>
            ))}
          </select>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Relationship
          </button>
        </form>
      </div>
    </div>
  );
};

export default RelationshipVisualizer;