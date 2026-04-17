import { getAllProjects, getAllTags } from '@/lib/projects';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const projects = await getAllProjects();
  const tags = await getAllTags();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <HomeClient projects={projects} tags={tags} />
    </main>
  );
}
