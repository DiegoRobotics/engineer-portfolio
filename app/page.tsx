import { getAllProjects } from '@/lib/projects';
import FeaturedProjectCard from '@/components/FeaturedProjectCard';
import Image from 'next/image';

export default async function Home() {
  const projects = await getAllProjects();
  
  // Get 3-6 featured projects (most recent)
  const featuredProjects = projects.slice(0, 6);

  return (
    <main className="container mx-auto px-6 lg:px-12">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <Image
              src="/images/profile.PNG"
              alt="Diego Morales"
              width={200}
              height={200}
              className="rounded-full object-cover shadow-lg"
              priority
            />
          </div>
          
          {/* Title */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold font-serif text-neutral-800">
              Diego Morales&apos; Engineering Projects
            </h1>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="pb-12">
        {featuredProjects.length === 0 ? (
          <p className="text-center text-neutral-600 py-8">
            No projects available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <div
                key={project.slug}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'backwards'
                }}
              >
                <FeaturedProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
