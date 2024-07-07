// src/components/Layout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/concepts" className="hover:text-blue-200">Concepts</Link></li>
            <li><Link to="/exchange" className="hover:text-blue-200">Coherence Exchange</Link></li>
            <li><Link to="/nexus" className="hover:text-blue-200">Individual Nexus</Link></li>
            <li><Link to="/wisdom" className="hover:text-blue-200">Collective Wisdom</Link></li>
            <li><Link to="/relationships" className="hover:text-blue-200">Relationships</Link></li>
            <li><Link to="/investments" className="hover:text-blue-200">Investments</Link></li>
            <li><Link to="/community" className="hover:text-blue-200">Community</Link></li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <footer className="bg-gray-200 text-center p-4 mt-auto">
        <p>&copy; 2024 Crypto Coin Coherency Network. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;