import { Navbar } from '@/components/layout/Navbar';
import { ProblemWorkspace } from '@/components/editor/ProblemWorkspace';

export default function ProblemPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <ProblemWorkspace slug={params.slug} />
      </div>
    </div>
  );
}
