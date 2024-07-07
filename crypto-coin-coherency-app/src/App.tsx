// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import ConceptExplorer from './pages/ConceptExplorer';
import CoherenceExchange from './pages/CoherenceExchange';
import { IndividualNexus } from './pages/IndividualNexus';
import { CollectiveWisdom } from './pages/CollectiveWisdom';
import RelationshipVisualizer from './pages/RelationshipVisualizer';
import CoherenceInvestment from './pages/CoherenceInvestment';
import { CommunityHub } from './pages/CommunityHub';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/concepts" element={<ConceptExplorer />} />
            <Route path="/exchange" element={<CoherenceExchange />} />
            <Route path="/nexus" element={<IndividualNexus />} />
            <Route path="/wisdom" element={<CollectiveWisdom />} />
            <Route path="/relationships" element={<RelationshipVisualizer />} />
            <Route path="/investments" element={<CoherenceInvestment />} />
            <Route path="/community" element={<CommunityHub />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;