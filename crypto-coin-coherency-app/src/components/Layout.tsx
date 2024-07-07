// src/components/Layout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
          <li><Link to="/concepts" className="hover:text-blue-200">Concepts</Link></li>
          <li><Link to="/marketplace" className="hover:text-blue-200">Marketplace</Link></li>
          <li><Link to="/profile" className="hover:text-blue-200">Profile</Link></li>
          <li><Link to="/governance" className="hover:text-blue-200">Governance</Link></li>
          <li><Link to="/relationships" className="hover:text-blue-200">Relationships</Link></li>
          <li><Link to="/investments" className="hover:text-blue-200">Investments</Link></li>
          <li><Link to="/community" className="hover:text-blue-200">Community</Link></li>
        </ul>
      </nav>

      <main className="container mx-auto mt-8 p-4">
        {children}
      </main>

      <footer className="bg-gray-200 text-center p-4 mt-8">
        <p>&copy; 2024 Crypto Coin Coherency Network. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;