export interface SiteConfig {
  title: string;
  engineerName: string;
  bioSummary: string;
  contact?: {
    email?: string;
    github?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
}

export const siteConfig: SiteConfig = {
  title: 'My Portfolio',
  engineerName: 'Your Name',
  bioSummary:
    'A passionate engineer who builds things across software, hardware, and everything in between.',
  contact: {
    github: 'https://github.com/yourhandle',
    linkedin: 'https://linkedin.com/in/yourhandle',
    email: 'you@example.com',
  },
};

if (!siteConfig) {
  throw new Error(
    '[engineer-portfolio] ERROR: Site config is missing or malformed — halting build.'
  );
}
