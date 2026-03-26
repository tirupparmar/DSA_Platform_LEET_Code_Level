import { Navbar } from '@/components/layout/Navbar';
import { LeaderboardClient } from '@/components/ui/LeaderboardClient';

export const metadata = { title: 'Leaderboard — AlgoSim' };

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LeaderboardClient />
      </main>
    </div>
  );
}
