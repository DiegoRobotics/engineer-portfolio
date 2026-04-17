import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';
import ImageGallery from '@/components/ImageGallery';
import MdxContent from '@/components/MdxContent';

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Projects
      </Link>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

      {/* Metadata section */}
      <div className="mb-6 space-y-2">
        {/* Description */}
        <p className="text-lg text-gray-700">{project.description}</p>

        {/* Date and Status */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>
            <strong>Date:</strong> {new Date(project.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>
            <strong>Status:</strong> {project.status}
          </span>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      {project.links.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Links</h2>
          <ul className="space-y-2">
            {project.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Documents */}
      {project.documents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Documents</h2>
          <ul className="space-y-2">
            {project.documents.map((doc, index) => (
              <li key={index}>
                <a
                  href={doc.file}
                  download
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {doc.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Image Gallery */}
      {project.images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          <ImageGallery images={project.images} alt={project.title} />
        </div>
      )}

      {/* MDX Body Content */}
      {project.body && (
        <div className="mt-8">
          <MdxContent source={project.body} />
        </div>
      )}
    </div>
  );
}
