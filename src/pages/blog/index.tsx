import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { format } from "date-fns";
import { blogPosts, type BlogPost } from "@/data/blog-posts";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

// Structured data for the blog list
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "PoshAuto Blog",
  "description": "Expert tips and strategies for Poshmark sellers to grow their business using automation.",
  "publisher": {
    "@type": "Organization",
    "name": "PoshAuto",
    "logo": {
      "@type": "ImageObject",
      "url": "/logo.png"
    }
  },
  "blogPost": blogPosts.map(post => ({
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name
    }
  }))
};

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique categories and tags
  const categories = Array.from(new Set(blogPosts.map(post => post.category.name)));
  const tags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  // Filter posts based on selected category and tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = !selectedCategory || post.category.name === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesCategory && matchesTag;
  });

  const trackPostClick = (post: BlogPost) => {
    trackEvent('blog_post_click', {
      post_id: post.id,
      post_title: post.title,
      category: post.category.name
    });
  };

  return (
    <>
      <Helmet>
        <title>PoshAuto Blog - Expert Tips for Poshmark Sellers</title>
        <meta 
          name="description" 
          content="Discover expert tips, strategies, and insights to grow your Poshmark business using automation. Learn from successful sellers and industry experts."
        />
        <meta 
          name="keywords" 
          content="poshmark tips, poshmark automation, reseller tips, poshmark strategy, social selling, ecommerce automation"
        />
        <meta property="og:title" content="PoshAuto Blog - Expert Tips for Poshmark Sellers" />
        <meta 
          property="og:description" 
          content="Discover expert tips, strategies, and insights to grow your Poshmark business using automation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/blog-og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            PoshAuto Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert tips, strategies, and insights to help you grow your Poshmark business using automation.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-gray-700">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category ? null : category
                    )}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-gray-700">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(
                      selectedTag === tag ? null : tag
                    )}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      selectedTag === tag
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link
                to={`/blog/${post.slug}`}
                onClick={() => trackPostClick(post)}
                className="group"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <LazyLoadImage
                    alt={post.title}
                    src={post.featuredImage}
                    effect="blur"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <time dateTime={post.publishedAt}>
                      {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-4">
                    <LazyLoadImage
                      alt={post.author.name}
                      src={post.author.avatar}
                      effect="blur"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {post.author.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {post.author.title}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
