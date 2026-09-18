import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .collect();

    if (!args.category) {
      return courses;
    }

    return courses.filter(
      (course) =>
        course.category.toLowerCase() === args.category!.toLowerCase()
    );
  },
});

export const bySlug = query({
  args: {
    slug: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const createEnrollment = mutation({
  args: {
    courseSlug: v.string(),
    courseTitle: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    amount: v.number(),
    paymentId: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("courseEnrollments", {
      courseSlug: args.courseSlug,
      courseTitle: args.courseTitle,
      name: args.name,
      email: args.email,
      phone: args.phone,
      amount: args.amount,
      currency: "INR",
      razorpayPaymentId: args.paymentId,
      status: "PAID",
      createdAt: Date.now(),
    });
  },
});