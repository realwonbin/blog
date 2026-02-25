import { getAllPosts, getAllTags } from '@/lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
    const tags = getAllTags();
    return tags.map((tag) => ({
        tag: tag,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
    const resolvedParams = await params;
    return {
        title: `#${resolvedParams.tag}`,
        description: `Posts tagged with ${resolvedParams.tag}`,
    };
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
};

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const resolvedParams = await params;
    const tag = resolvedParams.tag;
    const allPosts = getAllPosts();

    // Filter posts that contain this tag
    const posts = allPosts.filter(post => post.tags.includes(tag));

    return (
        <>
            <div className="home-cover">
                <h1 className="home-title">#{tag}</h1>
                <p className="home-desc">{posts.length}개의 글</p>
            </div>

            {posts.length > 0 ? (
                <div className="post-list">
                    {posts.map((post) => {
                        const postUrl = post.permalink || `/${post.slug}`;
                        const isVideo =
                            post.thumbnail &&
                            (post.thumbnail.toLowerCase().endsWith('.mp4') ||
                                post.thumbnail.toLowerCase().endsWith('.mov') ||
                                post.thumbnail.toLowerCase().endsWith('.webm'));

                        return (
                            <article className="post-card" key={post.slug}>
                                <Link className="post-card-link" href={postUrl}>
                                    <div className="post-card-layout">
                                        <div className="post-card-thumb-wrapper">
                                            {post.thumbnail ? (
                                                isVideo ? (
                                                    <video
                                                        className="post-card-thumb"
                                                        src={post.thumbnail}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                    />
                                                ) : (
                                                    <img
                                                        src={post.thumbnail}
                                                        alt=""
                                                        className="post-card-thumb"
                                                    />
                                                )
                                            ) : (
                                                <div className="post-card-thumb-fallback"></div>
                                            )}
                                        </div>
                                        <div className="post-card-content">
                                            <h2 className="post-card-title">{post.title}</h2>
                                            <div className="post-card-meta">
                                                <time dateTime={post.date}>{formatDate(post.date)}</time>
                                            </div>
                                            <p className="post-card-excerpt">{post.excerpt}</p>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">이 태그에 해당하는 글이 없습니다.</div>
            )}
        </>
    );
}
