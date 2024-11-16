import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { blogPosts } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/components/theme-switch";

export function BlogPage() {
  if (!blogPosts || blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
            No blog posts available
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Check back soon for new content!
          </p>
        </div>
      </div>
    );
  }

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog | PoshAuto - Poshmark Automation Platform</title>
        <meta 
          name="description" 
          content="Learn about Poshmark automation, multi-region selling strategies, and e-commerce best practices."
        />
        <meta 
          name="keywords" 
          content="poshmark automation, poshmark bot, multi-region selling, e-commerce, reselling"
        />
      </Helmet>

      <main className="min-h-screen bg-white dark:bg-gray-950">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              PoshAuto Blog
            </h1>
            <div className="flex items-center gap-4">
              <ThemeSwitch />
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Featured Post */}
          <section className="mb-16">
            <h2 className="sr-only">Featured Post</h2>
            <Link 
              to={`/blog/${featuredPost.slug}`}
              className="group block"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <LazyLoadImage
                    alt={featuredPost.title}
                    src={featuredPost.featuredImage}
                    effect="blur"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      {featuredPost.category.name}
                    </span>
                    <time className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(featuredPost.publishedAt), 'MMMM d, yyyy')}
                    </time>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <LazyLoadImage
                        alt={featuredPost.author.name}
                        src={featuredPost.author.avatar}
                        effect="blur"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-50">
                          {featuredPost.author.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {featuredPost.author.title}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {featuredPost.readingTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* Post Grid */}
          {otherPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-8">
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map(post => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col"
                  >
                    <div className="aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                      <LazyLoadImage
                        alt={post.title}
                        src={post.featuredImage}
                        effect="blur"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {post.category.name}
                        </span>
                        <time className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                        </time>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LazyLoadImage
                            alt={post.author.name}
                            src={post.author.avatar}
                            effect="blur"
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            {post.author.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {post.readingTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter Section */}
          <section className="mt-16 py-12 px-8 rounded-2xl bg-gray-100 dark:bg-gray-800">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get the latest Poshmark automation tips and strategies delivered directly to your inbox.
              </p>
              <form className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    "flex-1 rounded-lg px-4 py-2",
                    "bg-white dark:bg-gray-900",
                    "text-gray-900 dark:text-gray-100",
                    "border border-gray-300 dark:border-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-primary"
                  )}
                />
                <Button>Subscribe</Button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
