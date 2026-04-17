import { getAllProjects } from '@/lib/projects';
import ProjectButton from '@/components/ProjectButton';

export const metadata = {
  title: 'Projects | Diego Morales',
  description: 'Browse all engineering projects by Diego Morales',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  
  // Sort projects alphabetically by title
  const sortedProjects = [...projects].sort((a, b) => 
    a.title.localeCompare(b.title)
  );

  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 lg:py-12">
      <h1 className="text-page-title font-serif font-bold text-neutral-800 mb-8">
        All Projects
      </h1>
      
      {sortedProjects.length === 0 ? (
        <p className="text-body text-neutral-600">No projects found</p>
      ) : (
        <div className="flex flex-col gap-4 max-w-4xl">
          {sortedProjects.map((project) => (
            <ProjectButton
              key={project.slug}
              slug={project.slug}
              title={project.title}
              description={project.description}
              showDescription={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
