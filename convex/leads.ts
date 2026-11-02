
import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

// Create a new lead
export const create = mutationGeneric({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    source: v.string(),
    message: v.optional(v.string()),
    interest: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", {
      name: args.name,
      phone: args.phone,
      email: args.email,
      source: args.source,
      message: args.message,
      interest: args.interest,

      status: "new",
      priority: "normal",

      createdAt: Date.now(),
    });
  },
});

// Get all leads for admin
export const getAll = queryGeneric({
  args: {},

  handler: async (ctx) => {
    const leads = await ctx.db
      .query("leads")
      .collect();

    return leads.sort(
      (a, b) => b.createdAt - a.createdAt
    );
  },
});
