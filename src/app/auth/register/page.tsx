'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2, Github, User, Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BENEFITS = ['500+ problems with full solutions', 'Real-life simulations', 'AI-powered hints', 'Free forever'];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Account created! Signing you in...');
        await signIn('credentials', { email: form.email, password: form.password, callbackUrl: '/dashboard' });
      } else {
        const data = await res.json();
        toast.error(data.error ?? 'Registration failed');
      }
    } catch { toast.error('Something went wrong'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">
        <div className="card p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow-green">
              <Code2 size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold text-white">Algo<span className="text-brand-400">Sim</span></span>
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-dark-400 text-sm mb-5">Free forever. No credit card needed.</p>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-1.5 mb-6">
            {BENEFITS.map(b => (
              <div key={b} className="flex items-center gap-1.5 text-xs text-dark-300">
                <CheckCircle2 size={12} className="text-brand-500 shrink-0" /> {b}
              </div>
            ))}
          </div>

          {/* OAuth */}
          <button onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="w-full btn-secondary gap-3 justify-center py-3 mb-4">
            <Github size={18} /> Continue with GitHub
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-dark-700" />
            <span className="text-dark-500 text-xs">or with email</span>
            <div className="flex-1 h-px bg-dark-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-1.5">Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  type="text" required placeholder="Your name" className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  type="email" required placeholder="you@example.com" className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  type={showPw ? 'text' : 'password'} required placeholder="8+ characters" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              Create Account
            </button>
          </form>

          <p className="mt-5 text-center text-dark-500 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>

          <p className="mt-4 text-center text-dark-600 text-xs">
            By signing up you agree to our{' '}
            <Link href="/terms" className="text-dark-400 hover:text-dark-200 underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-dark-400 hover:text-dark-200 underline">Privacy Policy</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
