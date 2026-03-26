'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X, Code2, Zap, BookOpen, Trophy, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/problems', label: 'Problems', icon: Code2 },
    { href: '/simulate', label: 'Simulate', icon: Zap },
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-dark-700/60 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-glow-green group-hover:scale-110 transition-transform">
            <Code2 size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold text-white">
            Algo<span className="text-brand-400">Sim</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800 transition-all duration-200 text-sm font-medium">
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl hover:bg-dark-800 transition-all">
                <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 text-xs font-bold">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-dark-200 text-sm font-medium">{session.user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`text-dark-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-52 card p-1.5 shadow-card-hover">
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-dark-700 text-dark-200 hover:text-white text-sm transition-colors"
                      onClick={() => setUserMenuOpen(false)}>
                      <User size={15} /> Dashboard
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-dark-700 text-dark-200 hover:text-white text-sm transition-colors"
                      onClick={() => setUserMenuOpen(false)}>
                      <Settings size={15} /> Settings
                    </Link>
                    <div className="h-px bg-dark-700 my-1" />
                    <button onClick={() => signOut()} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-dark-300 hover:text-red-400 text-sm transition-colors">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost text-sm">Sign In</Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                <Zap size={14} /> Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-dark-800 text-dark-300 hover:text-white transition-colors">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-700 bg-dark-900">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-dark-800 text-dark-300 hover:text-white transition-colors text-sm font-medium">
                  <Icon size={16} /> {label}
                </Link>
              ))}
              <div className="h-px bg-dark-700 my-2" />
              {!session && (
                <div className="flex gap-2 pt-1">
                  <Link href="/auth/login" className="flex-1 btn-secondary text-sm text-center justify-center">Sign In</Link>
                  <Link href="/auth/register" className="flex-1 btn-primary text-sm justify-center">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
