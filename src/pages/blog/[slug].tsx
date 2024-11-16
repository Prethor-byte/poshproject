import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { blogPosts } from "@/data/blog-posts";
import { trackEvent } from "@/lib/analytics";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/components/ui/theme-switch";

// Custom styles for markdown content
const markdownStyles = {
  h1: "text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6 leading-tight",
  h2: "text-3xl font-semibold text-gray-800 dark:text-gray-100 mt-12 mb-4",
  h3: "text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-3",
  p: "text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6",
  ul: "list-disc list-outside ml-6 mb-6 text-gray-700 dark:text-gray-300",
  ol: "list-decimal list-outside ml-6 mb-6 text-gray-700 dark:text-gray-300",
  li: "text-lg leading-relaxed mb-2",
  blockquote: "border-l-4 border-primary pl-4 italic my-6",
  a: "text-primary hover:text-primary/80 underline transition-colors",
  code: "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm",
  pre: "bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 overflow-x-auto",
};

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

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/blog")}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
                <Link to="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <ThemeSwitch />
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </time>
              </div>
            </div>
          </div>
        </nav>

        <article className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="mb-12">
            <div className="space-y-4 text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <LazyLoadImage
                  alt={post.author.name}
                  src={post.author.avatar}
                  effect="blur"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-50">
                    {post.author.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {post.author.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{post.readingTime}</span>
              </div>
            </div>

            <div className="aspect-[2/1] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
              <LazyLoadImage
                alt={post.title}
                src={post.featuredImage}
                effect="blur"
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className={markdownStyles.h1} {...props} />,
                h2: ({ node, ...props }) => <h2 className={markdownStyles.h2} {...props} />,
                h3: ({ node, ...props }) => <h3 className={markdownStyles.h3} {...props} />,
                p: ({ node, ...props }) => <p className={markdownStyles.p} {...props} />,
                ul: ({ node, ...props }) => <ul className={markdownStyles.ul} {...props} />,
                ol: ({ node, ...props }) => <ol className={markdownStyles.ol} {...props} />,
                li: ({ node, ...props }) => <li className={markdownStyles.li} {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className={markdownStyles.blockquote} {...props} />,
                a: ({ node, ...props }) => <a className={markdownStyles.a} {...props} />,
                code: ({ node, inline, ...props }) => 
                  inline ? (
                    <code className={markdownStyles.code} {...props} />
                  ) : (
                    <pre className={markdownStyles.pre}>
                      <code {...props} />
                    </pre>
                  ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Related Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
                    "transition-colors duration-200"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/blog")}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
              <Link to="/">
                <Button
                  variant="ghost"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
