import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.permalink
            ? post.permalink.replace(/^\//, '').replace(/\/$/, '')
            : post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = getPostBySlug(resolvedParams.slug);
    if (!post) {
        return { title: 'Post Not Found' };
    }
    return {
        title: post.title,
        description: post.excerpt,
    };
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = getPostBySlug(resolvedParams.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="post-detail">
            <header className="post-header">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-meta">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span className="meta-sep">&bull;</span>
                    <span className="post-tags">
                        {post.tags.map((tag) => (
                            <span key={tag}>
                                <Link href={`/tag/${tag}`}>#{tag}</Link>{' '}
                            </span>
                        ))}
                    </span>
                </div>
            </header>

            <div className="prose">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
