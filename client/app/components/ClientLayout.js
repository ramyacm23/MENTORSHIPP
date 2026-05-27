'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import ThemeToggleButton from '@/app/components/ThemeToggleButton';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [userName, setUserName] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Check if current page requires authentication
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const shouldShowShell = user && !isAuthPage;

  useEffect(() => {
    // Redirect to login if not authenticated and not on auth pages
    if (!loading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [user, loading, isAuthPage, router]);

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    setUserName(name);
  }, [user]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: 'dashboard', active: pathname === '/' },
    { href: '/profile-analyzer', label: 'Profile Analyzer', icon: 'person_search', active: pathname === '/profile-analyzer' },
    { href: '/company-intelligence', label: 'Companies', icon: 'business', active: pathname === '/company-intelligence' },
    { href: '/roadmaps', label: 'Roadmap', icon: 'alt_route', active: pathname === '/roadmaps' },
    { href: '/interview', label: 'Interview Studio', icon: 'record_voice_over', active: pathname === '/interview' },
    { href: '/resume', label: 'Resume Lab', icon: 'description', active: pathname === '/resume' },
    { href: '/progress-intelligence', label: 'Progress', icon: 'analytics', active: pathname === '/progress-intelligence' },
    { href: '/mentor-chat', label: 'Mentor Chat', icon: 'chat', active: pathname === '/mentor-chat' },
    { href: '/gamification', label: 'Achievements', icon: 'trophy', active: pathname === '/gamification' },
    { href: '/profile', label: 'Profile', icon: 'person', active: pathname === '/profile' },
  ];

  return (
    <>
      {!shouldShowShell && (
        <div className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
          <ThemeToggleButton compact />
        </div>
      )}

      {/* Show navigation only if user is authenticated and not on auth pages */}
      {shouldShowShell && (
        <>
          {/* TopAppBar */}
          <header className="fixed left-0 right-0 top-0 z-50 border-b border-outline/15 bg-background/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:pl-72 lg:pr-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline/20 bg-surface-container-low text-on-surface lg:hidden"
                  aria-label="Open navigation"
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>
                <div>
                  <p className="font-headline text-base font-extrabold tracking-tight text-on-surface sm:text-lg">
                    The Cognitive Architecture
                  </p>
                  <p className="hidden text-xs text-on-surface-variant sm:block">
                    Smart Profile Analyzer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden text-right md:block">
                  <p className="text-sm font-semibold text-on-surface">Welcome back</p>
                  <p className="text-xs text-on-surface-variant">{userName}</p>
                </div>
                <ThemeToggleButton />
                <div className="flex items-center gap-2 text-on-surface-variant">
                  {['bolt', 'notifications', 'account_circle'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline/20 bg-surface-container-low transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary active:scale-95"
                      aria-label={icon}
                    >
                      <span className="material-symbols-outlined">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setMobileNavOpen(false)}
            className={`fixed inset-0 z-30 bg-[rgb(var(--overlay)/0.42)] backdrop-blur-sm transition-opacity lg:hidden ${
              mobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          />

          {/* SideNavBar */}
          <aside
            className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-outline/20 bg-background/95 px-4 py-8 shadow-2xl shadow-black/25 backdrop-blur-xl transition-transform duration-300 lg:w-64 lg:translate-x-0 ${
              mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="mb-8 mt-16 flex items-center justify-between px-4 lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-outline/20 bg-surface-container-high">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-container to-primary text-sm font-bold text-white">
                    AI
                  </div>
                </div>
                <div>
                  <p className="font-headline text-sm font-bold text-on-surface">Executive Coach</p>
                  <div className="flex items-center gap-1.5">
                    <span className="ai-pulse h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
                      AI Pulse: Active
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 bg-surface-container-low text-on-surface lg:hidden"
                aria-label="Close navigation"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out ${
                    item.active
                      ? 'border border-primary/20 bg-primary/10 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-3 border-t border-outline/20 pt-6">
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
              >
                <span className="material-symbols-outlined">settings</span>
                Settings
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500/20"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main
        className={`${shouldShowShell ? 'pt-24 lg:ml-64' : ''} min-h-screen px-4 pb-12 sm:px-6 lg:px-10`}
      >
        {children}
      </main>

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -left-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute -right-[10%] top-[40%] h-[50%] w-[50%] rounded-full bg-secondary/10 blur-[120px]"></div>
      </div>
    </>
  );
}
