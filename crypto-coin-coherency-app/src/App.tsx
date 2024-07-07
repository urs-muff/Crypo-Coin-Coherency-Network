// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import ConceptExplorer from './pages/ConceptExplorer';
import { Marketplace } from './pages/Marketplace';
import { Profile } from './pages/Profile';
import { Governance } from './pages/Governance';
import RelationshipVisualizer from './pages/RelationshipVisualizer';
import { CoherenceInvestment } from './pages/CoherenceInvestment';
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
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/governance" element={<Governance />} />
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