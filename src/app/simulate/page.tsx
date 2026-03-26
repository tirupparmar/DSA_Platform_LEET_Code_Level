import { Navbar } from '@/components/layout/Navbar';
import { SimulationsClient } from '@/components/simulation/SimulationsClient';

export const metadata = { title: 'Simulations — AlgoSim' };

export default function SimulatePage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className="pt-20">
        <SimulationsClient />
      </main>
    </div>
  );
}
