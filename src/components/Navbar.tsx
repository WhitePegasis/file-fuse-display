
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">FP</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">File Processor</h1>
      </div>
      
      <Button variant="ghost" size="icon" className="rounded-full">
        <User className="h-5 w-5" />
      </Button>
    </nav>
  );
};

export default Navbar;
