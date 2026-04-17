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
  title: "Diego Morales' Engineering Projects",
  engineerName: 'Diego Morales',
  bioSummary:
    'A passionate engineer who builds things across software, hardware, and everything in between.',
  contact: {
    email: 'diegoamr202003@gmail.com',
    github: 'https://github.com/DiegoRobotics',
    linkedin: 'https://www.linkedin.com/in/diegoalejandromorales',
  },
};

if (!siteConfig) {
  throw new Error(
    '[engineer-portfolio] ERROR: Site config is missing or malformed — halting build.'
  );
}
