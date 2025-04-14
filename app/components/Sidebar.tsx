import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  isExternal?: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems: SidebarItem[] = [
    {
      name: 'Overview',
      path: '/dashboards',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'API Playground',
      path: '/playground',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Use Cases',
      path: '/use-cases',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: 'My Account',
      path: '/account',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: 'Documentation',
      path: '/docs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      isExternal: true
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboards" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Tavily Logo"
            width={120}
            height={32}
            className="dark:invert"
          />
        </Link>
      </div>

      {/* Personal/Team Switch */}
      <div className="px-3 mb-6">
        <div className="relative">
          <button className="w-full bg-gray-50 dark:bg-gray-800 text-left px-4 py-2 rounded-lg flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
              L
            </div>
            <span className="flex-1 text-sm font-medium">Personal</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg mb-1 text-sm ${
                isActive
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className={isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            L
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">Lam Ho</div>
            <Link href="/settings" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              View Profile
            </Link>
          </div>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
