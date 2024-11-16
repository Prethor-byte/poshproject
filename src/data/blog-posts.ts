export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  publishedAt: string;
  readingTime: string;
  category: {
    name: string;
    slug: string;
  };
  tags: string[];
  featuredImage: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Poshmark Automation",
    slug: "getting-started-with-poshmark-automation",
    excerpt: "Learn how to automate your Poshmark business and save hours of manual work.",
    content: `# Getting Started with Poshmark Automation

Are you tired of spending countless hours manually sharing, following, and relisting items on Poshmark? In this comprehensive guide, we'll show you how automation can transform your reselling business and help you scale efficiently.

## Why Automate Your Poshmark Business?

Running a successful Poshmark business requires consistent effort in several key areas:
- Regular sharing of your listings
- Following potential customers
- Engaging with your audience
- Relisting items for better visibility
- Managing cross-platform listings

Automation tools can handle these repetitive tasks, allowing you to focus on:
- Sourcing quality inventory
- Taking great photos
- Writing compelling descriptions
- Building customer relationships
- Growing your business strategically

## Key Benefits of Automation

1. **Save Time**: Automate routine tasks and reclaim hours of your day
2. **Increase Visibility**: Maintain consistent activity to boost your listings
3. **Boost Sales**: Reach more potential buyers through automated sharing
4. **Scale Your Business**: Manage multiple accounts efficiently
5. **Improve Consistency**: Maintain regular activity even when you're busy

## Getting Started with PoshAuto

PoshAuto makes it easy to automate your Poshmark business. Here's how to get started:

1. Create your account
2. Connect your Poshmark closet
3. Configure your automation preferences
4. Monitor your results
5. Adjust strategies as needed

## Best Practices for Automation

1. Start slowly and gradually increase activity
2. Maintain natural patterns
3. Monitor your results
4. Stay within Poshmark's guidelines
5. Combine automation with personal engagement

## Conclusion

Automation is a game-changer for Poshmark sellers. Start your automation journey today and transform your reselling business.`,
    author: {
      name: "Sarah Johnson",
      avatar: "/images/authors/sarah.jpg",
      title: "Poshmark Automation Expert"
    },
    publishedAt: "2024-01-15T10:00:00Z",
    readingTime: "5 min read",
    category: {
      name: "Automation",
      slug: "automation"
    },
    tags: ["automation", "poshmark", "reselling", "business"],
    featuredImage: "/images/blog/automation-guide.jpg"
  },
  {
    id: "2",
    title: "Multi-Region Selling on Poshmark",
    slug: "multi-region-selling-poshmark",
    excerpt: "Expand your Poshmark business internationally with our comprehensive guide to multi-region selling.",
    content: `# Multi-Region Selling on Poshmark

Learn how to expand your Poshmark business across multiple regions and maximize your profits.

## Why Sell in Multiple Regions?

- Access new markets
- Increase your potential customer base
- Diversify your revenue streams
- Take advantage of seasonal differences
- Maximize item values in different markets

## Key Considerations

1. **Understanding Regional Differences**
   - Market preferences
   - Pricing strategies
   - Seasonal timing
   - Cultural considerations

2. **Logistics Management**
   - Inventory tracking
   - Shipping solutions
   - Return handling
   - Cost calculations

3. **Listing Optimization**
   - Region-specific keywords
   - Local measurements
   - Currency conversion
   - Shipping options

## Best Practices

1. Research your target markets
2. Start with one new region at a time
3. Track performance metrics
4. Adjust strategies based on data
5. Build regional relationships

## Tools and Resources

- PoshAuto's multi-region support
- Currency converters
- Shipping calculators
- Analytics tools
- Local market research

## Success Stories

Read how other sellers have successfully expanded their Poshmark business internationally.`,
    author: {
      name: "Michael Chen",
      avatar: "/images/authors/michael.jpg",
      title: "International E-commerce Specialist"
    },
    publishedAt: "2024-01-20T14:30:00Z",
    readingTime: "6 min read",
    category: {
      name: "Strategy",
      slug: "strategy"
    },
    tags: ["international", "multi-region", "strategy", "growth"],
    featuredImage: "/images/blog/multi-region.jpg"
  }
];
