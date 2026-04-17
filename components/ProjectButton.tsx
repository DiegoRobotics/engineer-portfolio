import Link from 'next/link';

interface ProjectButtonProps {
  slug: string;
  title: string;
  description?: string;
  showDescription?: boolean;
}

export default function ProjectButton({ 
  slug, 
  title, 
  description, 
  showDescription = false 
}: ProjectButtonProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="block group"
    >
      <div className="p-6 lg:p-8 border border-neutral-200 rounded-lg bg-neutral-50 shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md hover:border-accent">
        {/* Project Title - Serif font, prominent sizing */}
        <h3 className="text-2xl lg:text-section font-serif font-semibold text-neutral-800">
          {title}
        </h3>
        
        {/* Optional Description */}
        {showDescription && description && (
          <p className="mt-3 text-body text-neutral-600">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
