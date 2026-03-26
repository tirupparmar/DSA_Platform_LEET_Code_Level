import { Navbar } from '@/components/layout/Navbar';
import { UberSimulation } from '@/components/simulation/UberSimulation';

export default function UberSimPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <UberSimulation />
      </div>
    </div>
  );
}
