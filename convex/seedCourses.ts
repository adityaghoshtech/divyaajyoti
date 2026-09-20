import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},

  handler: async (ctx) => {
    const courses = [
      // =========================
      // ASTROLOGY
      // =========================

      {
        title: "Astrology Foundation",
        slug: "astrology-foundation",
        category: "ASTROLOGY",
        duration: "12 weeks",
        level: "BEGINNER",
        price: 4999,
        description:
          "Learn the basics of astrology, understand a birth chart and build a strong foundation.",
        instructor: "Divyajyoti",
        lessons: 24,
        status: "published",
      },

      {
        title: "Practical Chart Reading",
        slug: "practical-chart-reading",
        category: "ASTROLOGY",
        duration: "14 weeks",
        level: "INTERMEDIATE",
        price: 7499,
        description:
          "Move from theory to practical chart reading with guided examples and regular practice.",
        instructor: "Divyajyoti",
        lessons: 28,
        status: "published",
      },

      {
        title: "Predictive Astrology",
        slug: "predictive-astrology",
        category: "ASTROLOGY",
        duration: "16 weeks",
        level: "ADVANCED",
        price: 9999,
        description:
          "Develop a deeper understanding of timing and prediction through structured lessons and case studies.",
        instructor: "Divyajyoti",
        lessons: 32,
        status: "published",
      },

      {
        title: "Applied Astrology",
        slug: "applied-astrology",
        category: "ASTROLOGY",
        duration: "10 weeks",
        level: "PRACTICE",
        price: 6999,
        description:
          "Learn through practical interpretation, case discussions and guided practice.",
        instructor: "Divyajyoti",
        lessons: 20,
        status: "published",
      },

      // =========================
      // VASTU
      // =========================

      {
        title: "Vastu Basics",
        slug: "vastu-basics",
        category: "VASTU",
        duration: "8 weeks",
        level: "SPECIALISED",
        price: 5999,
        description:
          "Learn Vastu principles and how to apply them to your home or workspace.",
        instructor: "Divyajyoti",
        lessons: 16,
        status: "published",
      },

      // =========================
      // REAL ESTATE
      // =========================

      {
        title: "Real Estate Foundation",
        slug: "real-estate-foundation",
        category: "REAL_ESTATE",
        duration: "8 weeks",
        level: "BEGINNER",
        price: 4999,
        description:
          "Understand property buying, documentation, location and basic valuation.",
        instructor: "Divyajyoti",
        lessons: 16,
        status: "published",
      },

      {
        title: "Property Investment",
        slug: "property-investment",
        category: "REAL_ESTATE",
        duration: "10 weeks",
        level: "INTERMEDIATE",
        price: 6999,
        description:
          "Learn how to evaluate properties and make informed investment decisions.",
        instructor: "Divyajyoti",
        lessons: 20,
        status: "published",
      },

      {
        title: "Real Estate Masterclass",
        slug: "real-estate-masterclass",
        category: "REAL_ESTATE",
        duration: "12 weeks",
        level: "ADVANCED",
        price: 8999,
        description:
          "Explore advanced property investment strategies, returns, risks and planning.",
        instructor: "Divyajyoti",
        lessons: 24,
        status: "published",
      },

      {
        title: "Property Valuation",
        slug: "property-valuation",
        category: "REAL_ESTATE",
        duration: "6 weeks",
        level: "PRACTICAL",
        price: 5999,
        description:
          "Understand property valuation, pricing factors and market comparison.",
        instructor: "Divyajyoti",
        lessons: 12,
        status: "published",
      },

      {
        title: "Smart Property Buying",
        slug: "smart-property-buying",
        category: "REAL_ESTATE",
        duration: "7 weeks",
        level: "SPECIALISED",
        price: 6499,
        description:
          "Learn a practical framework for selecting and purchasing the right property.",
        instructor: "Divyajyoti",
        lessons: 14,
        status: "published",
      },
    ];

    const results = [];

    for (const course of courses) {
      const existing = await ctx.db
        .query("courses")
        .withIndex("by_slug", (q) =>
          q.eq("slug", course.slug)
        )
        .unique();

      if (existing) {
        // Update existing course so its category/data
        // also becomes correct.
        await ctx.db.patch(existing._id, {
          title: course.title,
          category: course.category,
          duration: course.duration,
          level: course.level,
          price: course.price,
          description: course.description,
          instructor: course.instructor,
          lessons: course.lessons,
          status: course.status,
          updatedAt: Date.now(),
        });

        results.push({
          title: course.title,
          action: "updated",
        });
      } else {
        await ctx.db.insert("courses", {
          ...course,
          updatedAt: Date.now(),
        });

        results.push({
          title: course.title,
          action: "created",
        });
      }
    }

    return results;
  },
});