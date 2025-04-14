
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell,  // Dashboard/Training
  Users,     // Clients
  ListChecks, // Assessments
  FileText,  // Reports
  Settings,  // Settings
  LogOut,    // Logout
  Menu,      // Mobile Menu Toggle
  X,         // Close Menu
  UserRound  // Profile
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <Dumbbell className="h-5 w-5" />, 
      path: '/dashboard',
      onClick: () => navigate('/dashboard')
    },
    { 
      name: 'Clientes', 
      icon: <Users className="h-5 w-5" />, 
      path: '/clients',
      onClick: () => navigate('/clients')
    },
    { 
      name: 'Avaliações', 
      icon: <ListChecks className="h-5 w-5" />, 
      path: '/assessments',
      onClick: () => navigate('/assessments')
    },
    { 
      name: 'Relatórios', 
      icon: <FileText className="h-5 w-5" />, 
      path: '/reports',
      onClick: () => navigate('/reports')
    },
    { 
      name: 'Perfil', 
      icon: <UserRound className="h-5 w-5" />, 
      path: '/profile',
      onClick: () => navigate('/profile')
    },
    { 
      name: 'Configurações', 
      icon: <Settings className="h-5 w-5" />, 
      path: '/settings',
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile menu toggle button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-50 md:hidden",
          sidebarOpen ? "left-[240px]" : "left-4"
        )}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar/navigation */}
      <div
        className={cn(
          "glass-panel fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center py-6 mb-4">
            <h1 className="text-2xl font-bold text-gradient text-logo">FitTreiner PRO</h1>
          </div>

          {/* Menu items */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start text-base font-medium mb-1"
                onClick={item.onClick}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Button>
            ))}
          </nav>

          {/* Logout button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-base font-medium mt-auto"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        !sidebarOpen && "md:ml-0",
        sidebarOpen && "md:ml-0"
      )}>
        <main className="flex-1 p-4 md:p-6 mt-12 md:mt-0">
          {children}
        </main>
        
        {/* Overlay for mobile */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
