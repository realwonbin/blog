'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type SearchPost = {
    slug: string;
    title: string;
    date: string;
    permalink?: string;
};

export default function Search({ posts }: { posts: SearchPost[] }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter posts based on query
    const results = query.trim() === ''
        ? []
        : posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase())
        );

    // Handle clicking outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = String(date.getFullYear()).slice(2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    return (
        <div className="search-container" ref={containerRef} style={{ position: 'relative', marginLeft: 'auto' }}>
            <input
                type="text"
                className="search-input"
                placeholder="검색..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    width: '200px',
                    transition: 'all 0.2s ease'
                }}
            />

            {isOpen && results.length > 0 && (
                <div
                    className="search-results"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        width: '300px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {results.map(post => (
                        <Link
                            key={post.slug}
                            href={post.permalink || `/${post.slug}`}
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'var(--text-primary)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <span style={{ fontSize: '0.95rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '12px' }}>
                                {post.title}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                {formatDate(post.date)}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
            {isOpen && query.trim() !== '' && results.length === 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        width: '300px',
                        zIndex: 1000,
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}
                >
                    검색 결과가 없습니다.
                </div>
            )}
        </div>
    );
}
