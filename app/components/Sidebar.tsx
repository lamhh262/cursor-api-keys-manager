import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { Home, Terminal, FileText, Book, Github, Loader2 } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import { useState } from 'react';
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
      name: 'Invoices',
      path: '/invoices',
      icon: <FileText className="w-5 h-5" />,
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
    <div className="w-64 bg-background h-screen fixed left-0 top-0 border-r">
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
  );
}
