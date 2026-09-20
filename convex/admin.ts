import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// =========================================================
// TABLE TYPES
// =========================================================

const table = v.union(
  v.literal("properties"),
  v.literal("courses"),
  v.literal("events"),
  v.literal("leads"),
  v.literal("consultations"),
  v.literal("siteVisits"),
  v.literal("courseEnrollments"),
  v.literal("payments"),
  v.literal("propertyCategories"),
);

const contentTable = v.union(
  v.literal("properties"),
  v.literal("courses"),
  v.literal("events"),
);

// =========================================================
// DASHBOARD
// =========================================================

export const overview = query({
  args: {},

  handler: async (ctx) => {
    const [
      properties,
      courses,
      events,
      leads,
      consultations,
      siteVisits,
      enrollments,
      payments,
      categories,
    ] = await Promise.all([
      ctx.db.query("properties").collect(),
      ctx.db.query("courses").collect(),
      ctx.db.query("events").collect(),
      ctx.db.query("leads").collect(),
      ctx.db.query("consultations").collect(),
      ctx.db.query("siteVisits").collect(),
      ctx.db.query("courseEnrollments").collect(),
      ctx.db.query("payments").collect(),
      ctx.db.query("propertyCategories").collect(),
    ]);

    const now = Date.now();

    const newLeads = leads.filter(
      (x) => x.status === "new" || x.status === "pending",
    );

    const followUps = leads.filter(
      (x) =>
        x.followUpAt &&
        x.followUpAt <= now &&
        x.status !== "converted" &&
        x.status !== "closed",
    );
    const today = new Date().toISOString().slice(0, 10);
    const upcomingEvents = events.filter(
      (x) => Date.parse(x.date) >= now && x.status !== "cancelled",
    );

    const paidPayments = payments.filter(
      (x) => x.status === "paid",
    );

    const revenue = paidPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );

    return {
      properties: properties.length,

      activeProperties: properties.filter(
        (x) => x.status !== "archived",
      ).length,

      publishedProperties: properties.filter(
        (x) => x.status === "published" || x.status === "active",
      ).length,

      courses: courses.length,

      publishedCourses: courses.filter(
        (x) => x.status === "published",
      ).length,

      events: events.length,

      upcomingEvents: upcomingEvents.length,

      leads: leads.length,

      newLeads: newLeads.length,

      followUps: followUps.length,

      qualifiedLeads: leads.filter(
        (x) => x.status === "qualified",
      ).length,

      convertedLeads: leads.filter(
        (x) => x.status === "converted",
      ).length,

      consultations: consultations.length,

      pendingConsultations: consultations.filter(
        (x) =>
          x.status === "pending" ||
          x.status === "new",
      ).length,

      siteVisits: siteVisits.length,

      scheduledSiteVisits: siteVisits.filter(
        (x) => x.status === "scheduled",
      ).length,

      enrollments: enrollments.length,

      paidEnrollments: enrollments.filter(
        (x) => x.status === "paid",
      ).length,

      payments: payments.length,

      paidPayments: paidPayments.length,

      revenue,

      categories: categories.length,
    };
  },
});

// =========================================================
// CATEGORIES
// =========================================================

export const listCategories = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("propertyCategories")
      .order("desc")
      .collect();
  },
});

// =========================================================
// GENERIC LIST
// =========================================================

export const list = query({
  args: {
    table,
  },

  handler: async (ctx, args) => {
    switch (args.table) {
      case "properties":
        return await ctx.db
          .query("properties")
          .order("desc")
          .collect();

      case "courses":
        return await ctx.db
          .query("courses")
          .order("desc")
          .collect();

      case "events":
        return await ctx.db
          .query("events")
          .order("desc")
          .collect();

      case "leads":
        return await ctx.db
          .query("leads")
          .order("desc")
          .collect();

      case "consultations":
        return await ctx.db
          .query("consultations")
          .order("desc")
          .collect();

      case "siteVisits":
        return await ctx.db
          .query("siteVisits")
          .order("desc")
          .collect();

      case "courseEnrollments":
        return await ctx.db
          .query("courseEnrollments")
          .order("desc")
          .collect();

      case "payments":
        return await ctx.db
          .query("payments")
          .order("desc")
          .collect();

      case "propertyCategories":
        return await ctx.db
          .query("propertyCategories")
          .order("desc")
          .collect();
    }
  },
});

// =========================================================
// CREATE
// =========================================================

export const create = mutation({
  args: {
    table,
    data: v.any(),
  },

  handler: async (ctx, args) => {
    const data = {
      ...(args.data as Record<string, unknown>),
    };

    const now = Date.now();

    switch (args.table) {
      case "properties":
        return await ctx.db.insert("properties", {
          ...data,
          updatedAt: now,
        } as any);

      case "courses":
        return await ctx.db.insert("courses", {
          ...data,
          updatedAt: now,
        } as any);

      case "events":
        return await ctx.db.insert("events", {
          ...data,
          updatedAt: now,
        } as any);

      case "leads":
        return await ctx.db.insert("leads", {
          ...data,
          status: data.status || "new",
          createdAt: data.createdAt || now,
          updatedAt: now,
        } as any);

      case "consultations":
        return await ctx.db.insert("consultations", {
          ...data,
          status: data.status || "pending",
          createdAt: data.createdAt || now,
          updatedAt: now,
        } as any);

      case "siteVisits":
        return await ctx.db.insert("siteVisits", {
          ...data,
          status: data.status || "pending",
          createdAt: data.createdAt || now,
          updatedAt: now,
        } as any);

      case "courseEnrollments":
        return await ctx.db.insert("courseEnrollments", {
          ...data,
          createdAt: data.createdAt || now,
          updatedAt: now,
        } as any);

      case "payments":
        return await ctx.db.insert("payments", {
          ...data,
          createdAt: data.createdAt || now,
          updatedAt: now,
        } as any);

      case "propertyCategories":
        return await ctx.db.insert("propertyCategories", {
          ...data,
          updatedAt: now,
        } as any);
    }
  },
});

// =========================================================
// UPDATE
// =========================================================

export const update = mutation({
  args: {
    table,
    id: v.string(),
    patch: v.any(),
  },

  handler: async (ctx, args) => {
    const normalized = ctx.db.normalizeId(
      args.table,
      args.id,
    );

    if (!normalized) {
      throw new Error("Invalid record id.");
    }

    const patch = {
      ...(args.patch as Record<string, unknown>),
      updatedAt: Date.now(),
    };

    await ctx.db.patch(
      normalized as any,
      patch as any,
    );

    return normalized;
  },
});

// =========================================================
// DELETE
// =========================================================

export const remove = mutation({
  args: {
    table,
    id: v.string(),
  },

  handler: async (ctx, args) => {
    const normalized = ctx.db.normalizeId(
      args.table,
      args.id,
    );

    if (!normalized) {
      throw new Error("Invalid record id.");
    }

    await ctx.db.delete(normalized as any);
  },
});

// =========================================================
// IMAGE UPLOAD
// =========================================================

export const generateUploadUrl = mutation({
  args: {},

  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// =========================================================
// ATTACH IMAGES
// =========================================================

export const attachImages = mutation({
  args: {
    table: contentTable,
    id: v.string(),
    storageIds: v.array(v.string()),
  },

  handler: async (ctx, args) => {
    const normalized = ctx.db.normalizeId(
      args.table,
      args.id
    );

    if (!normalized) {
      throw new Error("Invalid record id.");
    }

    const uploadedUrls: string[] = [];

    for (const storageId of args.storageIds) {
      const url = await ctx.storage.getUrl(
        storageId as any
      );

      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length === 0) {
      throw new Error(
        "The image was uploaded, but Convex could not create an image URL."
      );
    }

    const existing = await ctx.db.get(
      normalized as any
    ) as any;

    const existingImages = Array.isArray(existing?.images)
      ? existing.images.filter(
          (item: unknown): item is string =>
            typeof item === "string" && item.trim().length > 0
        )
      : [];

    const allImages = [
      ...existingImages,
      ...uploadedUrls,
    ];

    /*
     * IMPORTANT:
     *
     * The first newly uploaded image becomes
     * the main cover image.
     *
     * This applies to:
     * - properties
     * - courses
     * - events
     */
    const coverImage =
      existing?.image &&
      typeof existing.image === "string" &&
      existing.image.trim()
        ? existing.image
        : uploadedUrls[0];

    await ctx.db.patch(
      normalized as any,
      {
        image: coverImage,
        images: allImages,
        updatedAt: Date.now(),
      } as any
    );

    return {
      image: coverImage,
      images: allImages,
    };
  },
});

// =========================================================
// LEAD ACTIVITIES
// =========================================================

export const addLeadActivity = mutation({
  args: {
    leadId: v.id("leads"),
    type: v.string(),
    note: v.string(),
    createdBy: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert(
      "leadActivities",
      {
        leadId: args.leadId,
        type: args.type,
        note: args.note,
        createdAt: Date.now(),
        createdBy: args.createdBy,
      },
    );
  },
});

export const getLeadActivities = query({
  args: {
    leadId: v.id("leads"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("leadActivities")
      .withIndex(
        "by_lead",
        (q) => q.eq("leadId", args.leadId),
      )
      .order("desc")
      .collect();
  },
});