'use client';

import React from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Cloud, LayoutDashboard, Zap, Rocket, BookOpen, FileText, Shield, Code } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { UserStatus } from './user-status';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function Header({ 
  isAppPage, 
}: { 
  isAppPage: boolean;
}) {
  const { isSignedIn: isAuthenticated } = useUser();
  const { openSignIn, signOut } = useClerk();

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-200",
      "border-b border-zinc-800 bg-zinc-950/80 backdrop-blur"
    )}>
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <Link href="/" className="text-lg font-bold tracking-tight">
              Elholk
            </Link>
          </div>
        </div>
        
        {!isAppPage && (
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/models" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Models</Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">About</Link>
            <Link href="/docs" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Docs</Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <button 
              onClick={() => openSignIn()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <UserStatus />
              <button 
                onClick={() => signOut(() => window.location.assign('/'))}
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Close mobile menu when pathname changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  
  const isAppPage = pathname.startsWith('/dashboard') || 
                   pathname.startsWith('/playground') || 
                   pathname.startsWith('/models') || 
                   pathname.startsWith('/docs') ||
                   pathname.startsWith('/pricing');
  const isLandingPage = pathname === '/';

  return (
    <div className="min-h-screen bg-background dot-grid">
      <Header 
        isAppPage={isAppPage} 
      />
      
      <div className="flex">
        {isAppPage && (
          <Sidebar 
            isOpen={mobileMenuOpen} 
            onClose={() => setMobileMenuOpen(false)} 
          />
        )}
        <main className={cn(
          "flex-1 transition-all duration-300 relative",
          isAppPage ? "lg:pl-72 pb-16 lg:pb-0" : ""
        )}>
          <div className="min-h-screen relative z-10">
            {children}
          </div>
        </main>
      </div>
      {isAppPage && <BottomNav onMenuClick={() => setMobileMenuOpen(true)} />}
    </div>
  );
}
