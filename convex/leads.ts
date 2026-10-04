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
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

// Get all leads for the admin CSV export
export const getAll = queryGeneric({
  args: {},

  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();

    return leads.sort((a, b) => b.createdAt - a.createdAt);
  },
});