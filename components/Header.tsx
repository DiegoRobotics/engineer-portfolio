'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            {siteConfig.title}
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  pathname === '/'
                    ? 'text-gray-900 underline decoration-2 underline-offset-4'
                    : 'text-gray-600'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  pathname === '/about'
                    ? 'text-gray-900 underline decoration-2 underline-offset-4'
                    : 'text-gray-600'
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
