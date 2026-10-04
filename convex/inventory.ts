import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const inventoryType = v.union(
  v.literal("FLAT"),
  v.literal("PLOT"),
);

const status = v.union(
  v.literal("AVAILABLE"),
  v.literal("BOOKED"),
  v.literal("HOLD"),
  v.literal("SOLD"),
  v.literal("BLOCKED"),
);

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeUnit(value: unknown) {
  return clean(value).toUpperCase();
}

function normalizeStatus(value: unknown) {
  const valueText = clean(value).toUpperCase();

  if (
    valueText === "BOOKED" ||
    valueText === "SOLD" ||
    valueText === "HOLD" ||
    valueText === "BLOCKED"
  ) {
    return valueText as
      | "BOOKED"
      | "SOLD"
      | "HOLD"
      | "BLOCKED";
  }

  return "AVAILABLE" as const;
}

function normalizeType(value: unknown) {
  return clean(value).toUpperCase() === "PLOT"
    ? "PLOT"
    : "FLAT";
}

/* =========================================================
   PROJECTS
========================================================= */

export const listProjects = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },

  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("propertyProjects")
      .order("desc")
      .collect();

    if (args.includeInactive) {
      return projects;
    }

    return projects.filter(
      (project) =>
        String(project.status).toUpperCase() !== "INACTIVE",
    );
  },
});

export const createProject = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    developer: v.optional(v.string()),
    location: v.optional(v.string()),
    type: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
  },

  handler: async (ctx, args) => {
    const name = clean(args.name);

    if (!name) {
      throw new Error("Project name is required.");
    }

    const slug =
      clean(args.slug) ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    if (!slug) {
      throw new Error("Project slug is required.");
    }

    const existing = await ctx.db
      .query("propertyProjects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      throw new Error(
        `A project with slug "${slug}" already exists.`,
      );
    }

    const now = Date.now();

    return await ctx.db.insert("propertyProjects", {
      name,
      slug,
      developer: clean(args.developer) || undefined,
      location: clean(args.location) || undefined,
      type: clean(args.type).toUpperCase() || "MIXED",
      description: clean(args.description) || undefined,
      status:
        clean(args.status).toUpperCase() || "ACTIVE",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("propertyProjects"),
    name: v.string(),
    slug: v.string(),
    developer: v.optional(v.string()),
    location: v.optional(v.string()),
    type: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);

    if (!existing) {
      throw new Error("Project not found.");
    }

    const name = clean(args.name);
    const slug = clean(args.slug);

    if (!name || !slug) {
      throw new Error("Project name and slug are required.");
    }

    const duplicate = await ctx.db
      .query("propertyProjects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (duplicate && duplicate._id !== args.id) {
      throw new Error(
        `A project with slug "${slug}" already exists.`,
      );
    }

    await ctx.db.patch(args.id, {
      name,
      slug,
      developer: clean(args.developer) || undefined,
      location: clean(args.location) || undefined,
      type: clean(args.type).toUpperCase() || "MIXED",
      description: clean(args.description) || undefined,
      status:
        clean(args.status).toUpperCase() || "ACTIVE",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const removeProject = mutation({
  args: {
    id: v.id("propertyProjects"),
  },

  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      return false;
    }

    const inventory = await ctx.db
      .query("propertyInventory")
      .withIndex("by_project", (q) =>
        q.eq("projectId", args.id),
      )
      .collect();

    if (inventory.length > 0) {
      throw new Error(
        "This project still has inventory records. Delete or move the inventory first.",
      );
    }

    const documents = await ctx.db
      .query("propertyDocuments")
      .withIndex("by_project", (q) =>
        q.eq("projectId", args.id),
      )
      .collect();

    for (const document of documents) {
      if (document.storageId) {
        try {
          await ctx.storage.delete(document.storageId);
        } catch {
          // Continue if the file is already missing.
        }
      }

      await ctx.db.delete(document._id);
    }

    await ctx.db.delete(args.id);

    return true;
  },
});

/* =========================================================
   INVENTORY
========================================================= */

export const listInventory = query({
  args: {
    projectId: v.optional(v.id("propertyProjects")),
    status: v.optional(v.string()),
    inventoryType: v.optional(v.string()),
    search: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    let rows;

    if (args.projectId) {
      rows = await ctx.db
        .query("propertyInventory")
        .withIndex("by_project", (q) =>
          q.eq("projectId", args.projectId!),
        )
        .collect();
    } else {
      rows = await ctx.db
        .query("propertyInventory")
        .collect();
    }

    const wantedStatus = clean(args.status).toUpperCase();
    const wantedType = clean(args.inventoryType).toUpperCase();
    const search = clean(args.search).toLowerCase();

    return rows
      .filter((row) => {
        if (
          wantedStatus &&
          wantedStatus !== "ALL" &&
          String(row.status).toUpperCase() !== wantedStatus
        ) {
          return false;
        }

        if (
          wantedType &&
          wantedType !== "ALL" &&
          String(row.inventoryType).toUpperCase() !== wantedType
        ) {
          return false;
        }

        if (!search) {
          return true;
        }

        const haystack = [
          row.unitCode,
          row.category,
          row.tower,
          row.flatNo,
          row.facing,
          row.size,
          row.clientName,
          row.sourceDocument,
          row.notes,
        ]
          .map((value) => clean(value).toLowerCase())
          .join(" ");

        return haystack.includes(search);
      })
      .sort(
        (a, b) =>
          String(a.unitCode).localeCompare(
            String(b.unitCode),
            undefined,
            { numeric: true },
          ),
      );
  },
});

export const stats = query({
  args: {
    projectId: v.optional(v.id("propertyProjects")),
  },

  handler: async (ctx, args) => {
    const rows = args.projectId
      ? await ctx.db
          .query("propertyInventory")
          .withIndex("by_project", (q) =>
            q.eq("projectId", args.projectId!),
          )
          .collect()
      : await ctx.db
          .query("propertyInventory")
          .collect();

    const count = (wanted: string) =>
      rows.filter(
        (row) =>
          String(row.status).toUpperCase() === wanted,
      ).length;

    return {
      total: rows.length,
      available: count("AVAILABLE"),
      booked: count("BOOKED"),
      hold: count("HOLD"),
      sold: count("SOLD"),
      blocked: count("BLOCKED"),
      flats: rows.filter(
        (row) =>
          String(row.inventoryType).toUpperCase() === "FLAT",
      ).length,
      plots: rows.filter(
        (row) =>
          String(row.inventoryType).toUpperCase() === "PLOT",
      ).length,
    };
  },
});

export const createInventory = mutation({
  args: {
    projectId: v.id("propertyProjects"),
    inventoryType,
    unitCode: v.string(),
    category: v.optional(v.string()),
    tower: v.optional(v.string()),
    floor: v.optional(v.number()),
    flatNo: v.optional(v.string()),
    facing: v.optional(v.string()),
    size: v.optional(v.string()),
    price: v.optional(v.number()),
    parking: v.optional(v.string()),
    totalValue: v.optional(v.number()),
    status: v.string(),
    clientName: v.optional(v.string()),
    sourceDocument: v.optional(v.string()),
    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Selected project was not found.");
    }

    const unitCode = normalizeUnit(args.unitCode);

    if (!unitCode) {
      throw new Error("Unit / plot number is required.");
    }

    const existing = await ctx.db
      .query("propertyInventory")
      .withIndex("by_project_unit", (q) =>
        q
          .eq("projectId", args.projectId)
          .eq("unitCode", unitCode),
      )
      .unique();

    if (existing) {
      throw new Error(
        `Inventory "${unitCode}" already exists in this project.`,
      );
    }

    const now = Date.now();

    return await ctx.db.insert("propertyInventory", {
      projectId: args.projectId,
      inventoryType: normalizeType(args.inventoryType),
      unitCode,
      category: clean(args.category) || undefined,
      tower: clean(args.tower) || undefined,
      floor:
        typeof args.floor === "number"
          ? args.floor
          : undefined,
      flatNo: clean(args.flatNo) || undefined,
      facing: clean(args.facing) || undefined,
      size: clean(args.size) || undefined,
      price:
        typeof args.price === "number"
          ? args.price
          : undefined,
      parking: clean(args.parking) || undefined,
      totalValue:
        typeof args.totalValue === "number"
          ? args.totalValue
          : undefined,
      status: normalizeStatus(args.status),
      clientName: clean(args.clientName) || undefined,
      sourceDocument:
        clean(args.sourceDocument) || undefined,
      notes: clean(args.notes) || undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateInventory = mutation({
  args: {
    id: v.id("propertyInventory"),
    projectId: v.id("propertyProjects"),
    inventoryType,
    unitCode: v.string(),
    category: v.optional(v.string()),
    tower: v.optional(v.string()),
    floor: v.optional(v.number()),
    flatNo: v.optional(v.string()),
    facing: v.optional(v.string()),
    size: v.optional(v.string()),
    price: v.optional(v.number()),
    parking: v.optional(v.string()),
    totalValue: v.optional(v.number()),
    status: v.string(),
    clientName: v.optional(v.string()),
    sourceDocument: v.optional(v.string()),
    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);

    if (!existing) {
      throw new Error("Inventory record not found.");
    }

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Selected project was not found.");
    }

    const unitCode = normalizeUnit(args.unitCode);

    if (!unitCode) {
      throw new Error("Unit / plot number is required.");
    }

    const duplicate = await ctx.db
      .query("propertyInventory")
      .withIndex("by_project_unit", (q) =>
        q
          .eq("projectId", args.projectId)
          .eq("unitCode", unitCode),
      )
      .unique();

    if (duplicate && duplicate._id !== args.id) {
      throw new Error(
        `Inventory "${unitCode}" already exists in this project.`,
      );
    }

    await ctx.db.patch(args.id, {
      projectId: args.projectId,
      inventoryType: normalizeType(args.inventoryType),
      unitCode,
      category: clean(args.category) || undefined,
      tower: clean(args.tower) || undefined,
      floor:
        typeof args.floor === "number"
          ? args.floor
          : undefined,
      flatNo: clean(args.flatNo) || undefined,
      facing: clean(args.facing) || undefined,
      size: clean(args.size) || undefined,
      price:
        typeof args.price === "number"
          ? args.price
          : undefined,
      parking: clean(args.parking) || undefined,
      totalValue:
        typeof args.totalValue === "number"
          ? args.totalValue
          : undefined,
      status: normalizeStatus(args.status),
      clientName: clean(args.clientName) || undefined,
      sourceDocument:
        clean(args.sourceDocument) || undefined,
      notes: clean(args.notes) || undefined,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("propertyInventory"),
    status: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);

    if (!existing) {
      throw new Error("Inventory record not found.");
    }

    await ctx.db.patch(args.id, {
      status: normalizeStatus(args.status),
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const removeInventory = mutation({
  args: {
    id: v.id("propertyInventory"),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);

    if (!existing) {
      return false;
    }

    await ctx.db.delete(args.id);

    return true;
  },
});

/* =========================================================
   BULK CSV IMPORT
========================================================= */

const bulkRow = v.object({
  unitCode: v.string(),
  inventoryType: v.string(),
  category: v.optional(v.string()),
  tower: v.optional(v.string()),
  floor: v.optional(v.number()),
  flatNo: v.optional(v.string()),
  facing: v.optional(v.string()),
  size: v.optional(v.string()),
  price: v.optional(v.number()),
  parking: v.optional(v.string()),
  totalValue: v.optional(v.number()),
  status: v.string(),
  clientName: v.optional(v.string()),
  sourceDocument: v.optional(v.string()),
  notes: v.optional(v.string()),
});

export const bulkUpsert = mutation({
  args: {
    projectId: v.id("propertyProjects"),
    rows: v.array(bulkRow),
  },

  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Selected project was not found.");
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of args.rows) {
      const unitCode = normalizeUnit(row.unitCode);

      if (!unitCode) {
        skipped += 1;
        continue;
      }

      const existing = await ctx.db
        .query("propertyInventory")
        .withIndex("by_project_unit", (q) =>
          q
            .eq("projectId", args.projectId)
            .eq("unitCode", unitCode),
        )
        .unique();

      const payload = {
        projectId: args.projectId,
        inventoryType: normalizeType(row.inventoryType),
        unitCode,
        category: clean(row.category) || undefined,
        tower: clean(row.tower) || undefined,
        floor:
          typeof row.floor === "number"
            ? row.floor
            : undefined,
        flatNo: clean(row.flatNo) || undefined,
        facing: clean(row.facing) || undefined,
        size: clean(row.size) || undefined,
        price:
          typeof row.price === "number"
            ? row.price
            : undefined,
        parking: clean(row.parking) || undefined,
        totalValue:
          typeof row.totalValue === "number"
            ? row.totalValue
            : undefined,
        status: normalizeStatus(row.status),
        clientName:
          clean(row.clientName) || undefined,
        sourceDocument:
          clean(row.sourceDocument) || undefined,
        notes: clean(row.notes) || undefined,
      };

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...payload,
          updatedAt: Date.now(),
        });
        updated += 1;
      } else {
        const now = Date.now();

        await ctx.db.insert("propertyInventory", {
          ...payload,
          createdAt: now,
          updatedAt: now,
        });

        created += 1;
      }
    }

    return {
      created,
      updated,
      skipped,
      total: args.rows.length,
    };
  },
});

/* =========================================================
   DOCUMENTS
========================================================= */

export const generateUploadUrl = mutation({
  args: {},

  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const listDocuments = query({
  args: {
    projectId: v.optional(v.id("propertyProjects")),
  },

  handler: async (ctx, args) => {
    const documents = args.projectId
      ? await ctx.db
          .query("propertyDocuments")
          .withIndex("by_project", (q) =>
            q.eq("projectId", args.projectId!),
          )
          .collect()
      : await ctx.db
          .query("propertyDocuments")
          .collect();

    return await Promise.all(
      documents
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async (document) => ({
          ...document,
          fileUrl: document.storageId
            ? await ctx.storage.getUrl(document.storageId)
            : null,
        })),
    );
  },
});

export const createDocument = mutation({
  args: {
    projectId: v.id("propertyProjects"),
    title: v.string(),
    fileName: v.string(),
    mimeType: v.string(),
    category: v.string(),
    storageId: v.id("_storage"),
  },

  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Selected project was not found.");
    }

    const now = Date.now();

    return await ctx.db.insert("propertyDocuments", {
      projectId: args.projectId,
      title: clean(args.title) || args.fileName,
      fileName: clean(args.fileName),
      mimeType: clean(args.mimeType),
      category:
        clean(args.category).toUpperCase() || "OTHER",
      storageId: args.storageId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const removeDocument = mutation({
  args: {
    id: v.id("propertyDocuments"),
  },

  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);

    if (!document) {
      return false;
    }

    if (document.storageId) {
      try {
        await ctx.storage.delete(document.storageId);
      } catch {
        // Ignore missing storage objects.
      }
    }

    await ctx.db.delete(args.id);

    return true;
  },
});
