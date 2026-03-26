'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'Problems', sub: 'Easy to Hard' },
  { value: '12', label: 'Simulations', sub: 'Real-world scenarios' },
  { value: '10+', label: 'Languages', sub: 'Including Python, Java, JS' },
  { value: '100%', label: 'Free', sub: 'Open source forever' },
];

export function StatsSection() {
  return (
    <section className="py-12 border-y border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center">
              <div className="font-display text-4xl font-extrabold gradient-text mb-1">{stat.value}</div>
              <div className="text-white font-semibold mb-0.5">{stat.label}</div>
              <div className="text-dark-500 text-sm">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
