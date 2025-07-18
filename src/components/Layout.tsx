
import { ReactNode } from 'react';
import Navbar from './Navbar';
import AppSidebar from './AppSidebar';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  activeItem?: string;
  onSidebarItemClick?: (item: string) => void;
}

const Layout = ({ children, showSidebar = true, activeItem, onSidebarItemClick }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {showSidebar && (
          <AppSidebar activeItem={activeItem} onItemClick={onSidebarItemClick} />
        )}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
