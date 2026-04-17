import { siteConfig } from '@/config/site';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-8 lg:px-12 py-8 lg:py-12 max-w-3xl">
      <h1 className="text-page-title mb-8">{siteConfig.engineerName}</h1>

      <section className="mb-12">
        <h2 className="text-section mb-6">About Me</h2>
        <p className="text-neutral-700 leading-relaxed text-lg">{siteConfig.bioSummary}</p>
      </section>

      {siteConfig.contact && Object.keys(siteConfig.contact).length > 0 && (
        <section className="mb-12">
          <h2 className="text-section mb-6">Contact</h2>
          <ul className="space-y-4">
            {siteConfig.contact.email && (
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-accent hover:text-accent-dark transition-colors duration-200 hover:underline"
                  aria-label={`Email ${siteConfig.engineerName}`}
                >
                  Email: {siteConfig.contact.email}
                </a>
              </li>
            )}
            {siteConfig.contact.github && (
              <li>
                <a
                  href={siteConfig.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark transition-colors duration-200 hover:underline"
                  aria-label={`${siteConfig.engineerName}'s GitHub profile`}
                >
                  GitHub: {siteConfig.contact.github}
                </a>
              </li>
            )}
            {siteConfig.contact.linkedin && (
              <li>
                <a
                  href={siteConfig.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark transition-colors duration-200 hover:underline"
                  aria-label={`${siteConfig.engineerName}'s LinkedIn profile`}
                >
                  LinkedIn: {siteConfig.contact.linkedin}
                </a>
              </li>
            )}
            {Object.entries(siteConfig.contact)
              .filter(([key]) => !['email', 'github', 'linkedin'].includes(key))
              .map(([key, value]) => {
                if (!value) return null;
                return (
                  <li key={key}>
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-dark transition-colors duration-200 hover:underline"
                      aria-label={`${siteConfig.engineerName}'s ${key}`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </a>
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </main>
  );
}
