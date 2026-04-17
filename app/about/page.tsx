import { siteConfig } from '@/config/site';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">{siteConfig.engineerName}</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-700 leading-relaxed">{siteConfig.bioSummary}</p>
      </section>

      {siteConfig.contact && Object.keys(siteConfig.contact).length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <ul className="space-y-3">
            {siteConfig.contact.email && (
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
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
                  className="text-blue-600 hover:text-blue-800 hover:underline"
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
                  className="text-blue-600 hover:text-blue-800 hover:underline"
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
                      className="text-blue-600 hover:text-blue-800 hover:underline"
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
