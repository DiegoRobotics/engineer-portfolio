'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-container px-6 lg:px-12">
        <nav className="flex h-16 lg:h-18 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-neutral-900">
            {siteConfig.title}
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/"
                className={`text-sm font-medium transition-colors duration-200 ease-in-out hover:text-neutral-900 ${
                  pathname === '/'
                    ? 'text-neutral-900 underline decoration-2 underline-offset-4'
                    : 'text-neutral-600'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className={`text-sm font-medium transition-colors duration-200 ease-in-out hover:text-neutral-900 ${
                  pathname === '/projects' || pathname?.startsWith('/projects/')
                    ? 'text-neutral-900 underline decoration-2 underline-offset-4'
                    : 'text-neutral-600'
                }`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors duration-200 ease-in-out hover:text-neutral-900 ${
                  pathname === '/about'
                    ? 'text-neutral-900 underline decoration-2 underline-offset-4'
                    : 'text-neutral-600'
                }`}
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
