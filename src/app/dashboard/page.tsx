import { Navbar } from '@/components/layout/Navbar';
import { DashboardClient } from '@/components/ui/DashboardClient';

export const metadata = { title: 'Dashboard — AlgoSim' };

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DashboardClient />
      </main>
    </div>
  );
}
