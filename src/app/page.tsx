import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <div className="home-cover">
        <h1 className="home-title">기록의 보관소</h1>
        <p className="home-desc">그냥 아무거나.</p>
      </div>

      <div className="post-list">
        {posts.map((post) => {
          // Determine the post URL logic identical to Jekyll
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
    </>
  );
}
