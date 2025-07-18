
import { LayoutDashboard, FileText, Cog, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const AppSidebar = ({ activeItem = 'processing', onItemClick }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'processing', icon: Zap, label: 'Processing' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Cog, label: 'Settings' },
  ];

  return (
    <div className="w-16 bg-background border-r border-border flex flex-col items-center py-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-xl transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "hover:bg-muted"
            )}
            onClick={() => onItemClick?.(item.id)}
            title={item.label}
          >
            <Icon className="h-5 w-5" />
          </Button>
        );
      })}
    </div>
  );
};

export default AppSidebar;
