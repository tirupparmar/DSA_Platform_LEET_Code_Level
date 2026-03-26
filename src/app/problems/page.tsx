import { Navbar } from '@/components/layout/Navbar';
import { ProblemsClient } from '@/components/ui/ProblemsClient';

export const metadata = { title: 'Problems — AlgoSim' };

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="pt-20">
        <ProblemsClient />
      </main>
    </div>
  );
}
