import Link from 'next/link';
import { ProjectMeta } from '@/lib/projects';

interface FeaturedProjectCardProps {
  project: ProjectMeta;
}

export default function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const { slug, title, description, date, status, thumbnail } = project;

  return (
    <Link
      href={`/projects/${slug}`}
      className="block group"
    >
      <article className="h-full p-6 border border-neutral-200 rounded-lg bg-neutral-50 shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md">
        {/* Optional Thumbnail */}
        {thumbnail && (
          <div className="mb-4 aspect-video w-full overflow-hidden rounded-md bg-neutral-100">
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}

        {/* Project Title - Serif font */}
        <h3 className="text-2xl lg:text-section font-serif font-semibold text-neutral-800 mb-3">
          {title}
        </h3>

        {/* Project Description */}
        <p className="text-body text-neutral-600 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Metadata: Date and Status */}
        <div className="flex flex-wrap gap-3 text-body-small text-neutral-500">
          <time dateTime={date} className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {status}
          </span>
        </div>
      </article>
    </Link>
  );
}
