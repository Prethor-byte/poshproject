import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format, parseISO } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { blogPosts } from "@/data/blog-posts";
import { PublicLayout } from "@/components/layout/public-layout";

export function BlogPage() {
  if (!blogPosts || blogPosts.length === 0) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              No blog posts available
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new content!
            </p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Date unavailable';
    }
  };

  return (
    <PublicLayout>
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
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PoshAuto Blog - Poshmark Automation Insights" />
        <meta property="og:description" content="Learn about Poshmark automation, multi-region selling strategies, and e-commerce best practices." />
        <meta property="og:image" content={featuredPost.featuredImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-5">
              PoshAuto Blog
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              Insights and strategies for Poshmark sellers looking to scale their business
            </p>
          </div>

          {/* Featured Post */}
          <section className="mb-24">
            <h2 className="sr-only">Featured Article</h2>
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group relative block bg-gradient-to-tr from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="aspect-[21/9] overflow-hidden">
                <LazyLoadImage
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  effect="blur"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <time dateTime={featuredPost.publishedAt}>{formatDate(featuredPost.publishedAt)}</time>
                  <span>•</span>
                  <span>{featuredPost.readingTime}</span>
                  {featuredPost.category && (
                    <>
                      <span>•</span>
                      <span className="text-primary">{featuredPost.category.name}</span>
                    </>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <LazyLoadImage
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full"
                      effect="blur"
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
                </div>
              </div>
            </Link>
          </section>

          {/* Other Posts Grid */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <LazyLoadImage
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      effect="blur"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <LazyLoadImage
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full"
                        effect="blur"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {post.author.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}
