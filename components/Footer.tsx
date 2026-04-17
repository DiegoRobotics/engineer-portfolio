import { siteConfig } from '@/config/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6">
          <p className="text-base text-neutral-600">
            © {currentYear} {siteConfig.engineerName}. All rights reserved.
          </p>
          {siteConfig.contact?.email && (
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-base text-neutral-600 transition-colors duration-200 hover:text-neutral-900"
            >
              {siteConfig.contact.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
