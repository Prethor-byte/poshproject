import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { blogPosts } from "@/data/blog-posts";
import { trackEvent } from "@/lib/analytics";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate("/blog", { replace: true });
      return;
    }

    trackEvent('blog_post_view', {
      post_id: post.id,
      post_title: post.title,
      category: post.category.name
    });
  }, [post, navigate]);

  if (!post) return null;

  // Structured data for the blog post
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "image": post.author.avatar
    },
    "publisher": {
      "@type": "Organization",
      "name": "PoshAuto",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | PoshAuto Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(", ")} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.featuredImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category.name} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate("/blog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        <article className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <header className="mb-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600">
                {post.excerpt}
              </p>
            </div>

            {/* Author and Meta Info */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <LazyLoadImage
                  alt={post.author.name}
                  src={post.author.avatar}
                  effect="blur"
                  className="w-12 h-12 rounded-full"
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <time dateTime={post.publishedAt}>
                  {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </time>
                <span>•</span>
                <span>{post.readingTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[2/1] overflow-hidden rounded-xl mb-12">
              <LazyLoadImage
                alt={post.title}
                src={post.featuredImage}
                effect="blur"
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-6 border-t">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
