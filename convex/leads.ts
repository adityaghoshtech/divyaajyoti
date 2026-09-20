import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

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
