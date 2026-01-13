import React, { ReactNode } from 'react';
import { Layers } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans selection:bg-white/20">
      <header className="fixed top-0 left-0 right-0 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-3 select-none">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">PageBurner</span>
          </div>
        </div>
      </header>
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
};