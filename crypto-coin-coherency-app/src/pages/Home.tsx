// Home.tsx
import React from 'react';
import NetworkStats from '../components/NetworkStats';
import RecentActivity from '../components/RecentActivity';
import CoherenceScore from '../components/CoherenceScore';
import TopConcepts from '../components/TopConcepts';

const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Crypto Coin Coherency Network Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NetworkStats />
        <CoherenceScore />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity />
        <TopConcepts />
      </div>
    </div>
  );
};

export default Home;