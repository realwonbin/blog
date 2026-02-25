import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import externals from '../data/externals.json';
import { getAllTags, getAllPosts } from '@/lib/posts';
import Search from '@/components/Search';

export const metadata: Metadata = {
  title: {
    template: '%s | 이영',
    default: '이영',
  },
  description: '기록의 보관소',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get all unique tags from markdown files
  const tags = getAllTags();

  // Exclude tags that are already in the externals list
  const externalNames = externals.map(e => e.name);
  const displayTags = tags.filter(tag => !externalNames.includes(tag));

  // Get lightweight post data for the search component
  const allPosts = getAllPosts();
  const searchPosts = allPosts.map(p => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    permalink: p.permalink
  }));

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        {/* Top Navigation Bar */}
        <header className="site-header">
          <div className="header-inner">
            <Link className="site-title-link" href="/">
              <span className="site-title">이영</span>
            </Link>

            {/* Tags inside header */}
            <nav className="header-tags">
              {displayTags.map(tag => (
                <Link key={tag} className="tag" href={`/tag/${tag}`}>
                  #{tag}
                </Link>
              ))}
            </nav>

            <Search posts={searchPosts} />
          </div>
        </header>

        {/* Main Content Area */}
        <div id="container" className="layout-single">
          <main id="content" role="main">
            {children}
          </main>

          {/* Footer Copyright */}
          <footer className="site-footer">
            <div className="footer-links">
              {externals.map(e => (
                <a
                  key={e.name}
                  href={e.url}
                  target={e.newtab ? "_blank" : undefined}
                  rel={e.newtab ? "noopener noreferrer" : undefined}
                >
                  {e.label || e.name} ↗
                </a>
              ))}
            </div>
            <p className="copyright">
              &copy; {new Date().getFullYear()} 영사마. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
