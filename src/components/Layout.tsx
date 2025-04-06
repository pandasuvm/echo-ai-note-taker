
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <div 
        className={`${
          isMobile 
            ? sidebarOpen 
              ? 'fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out' 
              : 'fixed inset-y-0 left-0 z-40 w-72 transform -translate-x-full transition-transform duration-300 ease-in-out'
            : 'w-72'
        }`}
      >
        <Sidebar onClose={() => isMobile && setSidebarOpen(false)} />
      </div>

      {/* Click away overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${isMobile ? 'w-full' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
