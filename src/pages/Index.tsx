
import React from 'react';
import { DeepSeekPlayground } from '../components/DeepSeekPlayground';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
      <div className="relative">
        <DeepSeekPlayground />
      </div>
    </div>
  );
};

export default Index;
