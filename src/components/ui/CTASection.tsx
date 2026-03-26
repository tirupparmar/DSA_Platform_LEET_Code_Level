'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Twitter, Code2 } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-5">
            Ready to actually understand algorithms?
          </h2>
          <p className="text-dark-300 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of developers who ditched rote memorization for real intuition. Free, open source, no credit card needed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5 gap-2.5 group">
              Start for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://github.com/yourusername/algosim" target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-base px-8 py-3.5 gap-2.5">
              <Github size={18} /> Star on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const links = {
    Product: ['Problems', 'Simulations', 'Leaderboard', 'Roadmap'],
    Learn: ['Arrays', 'Graphs', 'Trees', 'Dynamic Programming'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  };

  return (
    <footer className="border-t border-dark-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">Algo<span className="text-brand-400">Sim</span></span>
            </div>
            <p className="text-dark-500 text-sm leading-relaxed mb-4">
              Master DSA with real-world simulations.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com" className="text-dark-500 hover:text-white transition-colors"><Github size={18} /></a>
              <a href="https://twitter.com" className="text-dark-500 hover:text-white transition-colors"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-dark-300 font-semibold text-sm mb-3">{section}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <Link href="#" className="text-dark-500 hover:text-dark-200 text-sm transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-500">
          <span>© {new Date().getFullYear()} AlgoSim. Open source under MIT License.</span>
          <span className="flex items-center gap-1.5">Built with Next.js, deployed on Vercel</span>
        </div>
      </div>
    </footer>
  );
}
