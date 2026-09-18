import { queryGeneric } from "convex/server";
import { v } from "convex/values";

export const list = queryGeneric({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("properties")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("properties").collect();
  },
});

export const bySlug = queryGeneric({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("properties")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});
