import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { Home, Terminal, FileText, Book, Github, Loader2, Menu, X } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from 'react';
import Toast from '@/app/components/Toast';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  isExternal?: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      if (sidebar && !sidebar.contains(event.target as Node) &&
          mobileMenuButton && !mobileMenuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems: SidebarItem[] = [
    {
      name: 'Overview',
      path: '/dashboards',
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: 'API Playground',
      path: '/playground',
      icon: <Terminal className="w-5 h-5" />,
    },
    {
      name: 'Documentation',
      path: '/docs',
      icon: <Book className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowToast(true);

      // Small delay to show the loading state and toast
      await new Promise(resolve => setTimeout(resolve, 1000));

      await signOut({
        callbackUrl: '/'
      });
    } catch (error) {
      console.error('Logout error:', error);
      setShowToast(false);
      setIsLoggingOut(false);
    }
  };

  // Get user initials for the avatar
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        id="mobile-menu-button"
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={cn(
          "fixed top-0 left-0 h-screen bg-background border-r transition-transform duration-200 ease-in-out z-40",
          "w-64 transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {showToast && (
          <Toast
            message="Signing out..."
            isVisible={showToast}
            onClose={() => setShowToast(false)}
            type="warning"
          />
        )}

        {/* Logo */}
        <div className="p-6">
          <Link href="/dashboards" className="flex items-center gap-2">
            <Github className="w-8 h-8" />
            <span className="text-xl font-semibold">Analyzer</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {item.isExternal && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button variant="ghost" className="w-full justify-start px-2 hover:bg-accent">
            <div className="flex items-center space-x-3 w-full">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {session?.user?.name ? getInitials(session.user.name) : '?'}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{session?.user?.name || 'Guest'}</div>
                <div className="text-xs text-muted-foreground">{session?.user?.email || 'No email'}</div>
              </div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing out...
              </>
            ) : (
              'Logout'
            )}
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
