import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Type definitions for our Post
export type Post = {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    tags: string[];
    thumbnail: string | null;
    permalink?: string;
};

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts');

// Utility to automate thumbnail extraction just like the Jekyll logic
function extractThumbnail(content: string, frontmatterThumbnail?: string): string | null {
    if (frontmatterThumbnail) return frontmatterThumbnail;

    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) return imgMatch[1];

    const sourceMatch = content.match(/<source[^>]+src=["']([^"']+)["']/i);
    if (sourceMatch) return sourceMatch[1];

    // Also check markdown standard format: ![alt](url)
    const mdImgMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (mdImgMatch) return mdImgMatch[1];

    return null;
}

export function getAllPosts(): Post[] {
    // If the directory doesn't exist, return empty
    if (!fs.existsSync(postsDirectory)) return [];

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            // Remove ".md" from file name to get slug
            const slug = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            const title = matterResult.data.title || slug;
            const dateRaw = matterResult.data.date;
            // Handle Date objects and strings gracefully
            const date = dateRaw instanceof Date
                ? dateRaw.toISOString()
                : typeof dateRaw === 'string'
                    ? dateRaw
                    : new Date().toISOString();

            let tags = matterResult.data.tags || [];
            if (typeof tags === 'string') {
                tags = tags.split(',').map(t => t.trim());
            }

            const permalink = matterResult.data.permalink;

            // Ensure excerpt exists
            let excerpt = matterResult.data.excerpt || '';
            if (!excerpt) {
                // Fallback: take first 150 chars of text content
                const plainText = matterResult.content.replace(/<[^>]+>/g, '').replace(/[#*_~`>\[\]\(\)]/g, ' ').trim();
                excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
            }

            // Automatically extract thumbnail from content
            const thumbnail = extractThumbnail(matterResult.content, matterResult.data.thumbnail);

            // Combine the data with the slug
            return {
                slug,
                title,
                date,
                excerpt,
                content: matterResult.content,
                tags,
                thumbnail,
                permalink
            };
        });

    // Sort posts by date DESC
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

// Extract all unique tags across all posts
export function getAllTags(): string[] {
    const posts = getAllPosts();
    const tagsSet = new Set<string>();

    posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => tagsSet.add(String(tag)));
        }
    });

    // Return sorted array
    return Array.from(tagsSet).sort();
}

export function getPostBySlug(slug: string): Post | undefined {
    const posts = getAllPosts();
    return posts.find(post => post.slug === slug || post.permalink === `/${slug}/` || post.permalink === `${slug}/`);
}
