
import React from 'react';
import { DeepSeekPlayground } from '../components/DeepSeekPlayground';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
      <div className="relative">
        <DeepSeekPlayground />
        
        {/* Footer */}
        <footer className="py-8 text-center mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-gray-400 text-sm font-mono">
              © 2025 VIKI Neural Systems™. All rights reserved. | Advanced AI Technology Platform
            </p>
            <p className="text-cyan-400/60 text-xs font-mono mt-2">
              Powered by DeepSeek-R1 • Built with Neural Excellence
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
