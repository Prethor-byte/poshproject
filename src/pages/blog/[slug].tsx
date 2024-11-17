import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format, parseISO } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { blogPosts } from "@/data/blog-posts";
import { trackEvent } from "@/lib/analytics";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PublicLayout } from "@/components/layout/public-layout";
import { Share2, Twitter, Facebook, Linkedin, Copy, ArrowLeft } from "lucide-react";
import type { Components } from "react-markdown";

// Custom styles for markdown content
const markdownStyles = {
  h1: "text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6 leading-tight scroll-mt-20",
  h2: "text-3xl font-semibold text-gray-800 dark:text-gray-100 mt-12 mb-4 scroll-mt-20",
  h3: "text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-3 scroll-mt-20",
  p: "text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6",
  ul: "list-disc list-outside ml-6 mb-6 text-gray-700 dark:text-gray-300",
  ol: "list-decimal list-outside ml-6 mb-6 text-gray-700 dark:text-gray-300",
  li: "text-lg leading-relaxed mb-2",
  blockquote: "border-l-4 border-primary pl-4 italic my-6",
  a: "text-primary hover:text-primary/80 underline transition-colors",
  code: "bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 font-mono text-sm",
  pre: "bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 overflow-x-auto",
};

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate("/blog", { replace: true });
      return;
    }

    // Track page view
    trackEvent('blog_post_view', {
      post_id: post.id,
      post_title: post.title,
      category: post.category.name
    });

    // Setup scroll progress tracking
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const components: Components = {
    h1: ({ ...props }) => <h1 className={markdownStyles.h1} {...props} />,
    h2: ({ ...props }) => {
      const id = props.children?.toString().toLowerCase().replace(/\s+/g, '-') || '';
      return <h2 id={id} className={markdownStyles.h2} {...props} />;
    },
    h3: ({ ...props }) => {
      const id = props.children?.toString().toLowerCase().replace(/\s+/g, '-') || '';
      return <h3 id={id} className={markdownStyles.h3} {...props} />;
    },
    p: ({ ...props }) => <p className={markdownStyles.p} {...props} />,
    ul: ({ ...props }) => <ul className={markdownStyles.ul} {...props} />,
    ol: ({ ...props }) => <ol className={markdownStyles.ol} {...props} />,
    li: ({ ...props }) => <li className={markdownStyles.li} {...props} />,
    blockquote: ({ ...props }) => <blockquote className={markdownStyles.blockquote} {...props} />,
    a: ({ ...props }) => <a className={markdownStyles.a} target="_blank" rel="noopener noreferrer" {...props} />,
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      return isInline ? (
        <code className={markdownStyles.code} {...props}>{children}</code>
      ) : (
        <pre className={markdownStyles.pre}>
          <code className={className} {...props}>{children}</code>
        </pre>
      );
    },
  };

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  const handleShare = async (platform: string) => {
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <PublicLayout>
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

      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50"
        style={{ transform: `translateX(${readingProgress - 100}%)` }}
      >
        <div className="h-full bg-primary transition-transform duration-150" />
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to Blog */}
        <a 
          href="/blog"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </a>

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
              <time dateTime={post.publishedAt}>
                {format(parseISO(post.publishedAt), 'MMMM d, yyyy')}
              </time>
              <span className="mx-2">•</span>
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
            components={components}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Share Button */}
      <div className="fixed bottom-8 right-8">
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {showShareMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 min-w-[200px]">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-3 w-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Twitter className="w-5 h-5" /> Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-3 w-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Facebook className="w-5 h-5" /> Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-3 w-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Linkedin className="w-5 h-5" /> LinkedIn
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-3 w-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Copy className="w-5 h-5" /> Copy Link
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
