import {
  mutation,
  query,
} from "./_generated/server";

import { v } from "convex/values";

import { Id } from "./_generated/dataModel";


// =========================================================
// GENERATE UPLOAD URL
// =========================================================

export const generateUploadUrl =
  mutation({
    args: {},

    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
  });


// =========================================================
// LIST MATERIALS
// =========================================================
//
// Students:
//   only PUBLISHED materials
//
// Admin:
//   includeDrafts = true
// =========================================================

export const list = query({
  args: {
    courseSlug: v.string(),

    includeDrafts: v.optional(
      v.boolean(),
    ),
  },

  handler: async (
    ctx,
    args,
  ) => {

    const materials =
      await ctx.db
        .query(
          "courseMaterials",
        )
        .withIndex(
          "by_course",
          (q) =>
            q.eq(
              "courseSlug",
              args.courseSlug,
            ),
        )
        .collect();


    const filtered =
      args.includeDrafts
        ? materials
        : materials.filter(
            (item) =>
              String(
                item.status,
              ).toUpperCase() ===
              "PUBLISHED",
          );


    const result =
      await Promise.all(
        filtered.map(
          async (item) => {

            let storageUrl:
              | string
              | null = null;


            if (
              item.storageId
            ) {
              try {

                storageUrl =
                  await ctx.storage.getUrl(
                    item.storageId as Id<"_storage">,
                  );

              } catch {
                storageUrl = null;
              }
            }


            return {
              ...item,

              storageUrl,

              effectiveUrl:
                storageUrl ||
                item.url ||
                null,
            };
          },
        ),
      );


    return result.sort(
      (a, b) =>
        a.sortOrder -
        b.sortOrder,
    );
  },
});


// =========================================================
// GET ONE MATERIAL
// =========================================================

export const get = query({
  args: {
    id: v.id(
      "courseMaterials",
    ),
  },

  handler: async (
    ctx,
    args,
  ) => {

    const material =
      await ctx.db.get(
        args.id,
      );

    if (!material) {
      return null;
    }


    let storageUrl:
      | string
      | null = null;


    if (
      material.storageId
    ) {
      try {

        storageUrl =
          await ctx.storage.getUrl(
            material.storageId as Id<"_storage">,
          );

      } catch {
        storageUrl = null;
      }
    }


    return {
      ...material,

      storageUrl,

      effectiveUrl:
        storageUrl ||
        material.url ||
        null,
    };
  },
});


// =========================================================
// CREATE
// =========================================================

export const create = mutation({
  args: {

    courseSlug:
      v.string(),

    title:
      v.string(),

    type:
      v.string(),

    description:
      v.optional(
        v.string(),
      ),

    url:
      v.optional(
        v.string(),
      ),

    storageId:
      v.optional(
        v.string(),
      ),

    sortOrder:
      v.number(),

    status:
      v.string(),

    liveAt:
      v.optional(
        v.number(),
      ),

    liveEndAt:
      v.optional(
        v.number(),
      ),
  },

  handler: async (
    ctx,
    args,
  ) => {

    const now =
      Date.now();


    const title =
      args.title.trim();

    const type =
      args.type
        .trim()
        .toUpperCase();

    const status =
      args.status
        .trim()
        .toUpperCase();


    if (!title) {
      throw new Error(
        "Material title is required.",
      );
    }


    if (!args.courseSlug) {
      throw new Error(
        "Course is required.",
      );
    }


    if (
      type === "LIVE" &&
      !args.url
    ) {
      throw new Error(
        "Google Meet link is required for a live class.",
      );
    }


    if (
      type === "LIVE" &&
      !args.liveAt
    ) {
      throw new Error(
        "Live class start time is required.",
      );
    }


    if (
      type === "LIVE" &&
      !args.liveEndAt
    ) {
      throw new Error(
        "Live class end time is required.",
      );
    }


    if (
      args.liveAt &&
      args.liveEndAt &&
      args.liveEndAt <= args.liveAt
    ) {
      throw new Error(
        "Live class end time must be after the start time.",
      );
    }


    return await ctx.db.insert(
      "courseMaterials",
      {
        courseSlug:
          args.courseSlug,

        title,

        type,

        description:
          args.description
            ?.trim() ||
          undefined,

        url:
          args.url?.trim() ||
          undefined,

        storageId:
          args.storageId,

        sortOrder:
          args.sortOrder,

        status,

        liveAt:
          args.liveAt,

        liveEndAt:
          args.liveEndAt,

        createdAt:
          now,

        updatedAt:
          now,
      },
    );
  },
});


// =========================================================
// UPDATE
// =========================================================

export const update = mutation({
  args: {

    id:
      v.id(
        "courseMaterials",
      ),

    title:
      v.string(),

    type:
      v.string(),

    description:
      v.optional(
        v.string(),
      ),

    url:
      v.optional(
        v.string(),
      ),

    storageId:
      v.optional(
        v.string(),
      ),

    sortOrder:
      v.number(),

    status:
      v.string(),

    liveAt:
      v.optional(
        v.number(),
      ),

    liveEndAt:
      v.optional(
        v.number(),
      ),
  },

  handler: async (
    ctx,
    args,
  ) => {

    const type =
      args.type
        .trim()
        .toUpperCase();

    const status =
      args.status
        .trim()
        .toUpperCase();


    if (
      type === "LIVE" &&
      !args.url
    ) {
      throw new Error(
        "Google Meet link is required for a live class.",
      );
    }


    if (
      type === "LIVE" &&
      !args.liveAt
    ) {
      throw new Error(
        "Live class start time is required.",
      );
    }


    if (
      type === "LIVE" &&
      !args.liveEndAt
    ) {
      throw new Error(
        "Live class end time is required.",
      );
    }


    if (
      args.liveAt &&
      args.liveEndAt &&
      args.liveEndAt <= args.liveAt
    ) {
      throw new Error(
        "Live class end time must be after the start time.",
      );
    }


    await ctx.db.patch(
      args.id,
      {
        title:
          args.title.trim(),

        type,

        description:
          args.description
            ?.trim() ||
          undefined,

        url:
          args.url?.trim() ||
          undefined,

        storageId:
          args.storageId,

        sortOrder:
          args.sortOrder,

        status,

        liveAt:
          args.liveAt,

        liveEndAt:
          args.liveEndAt,

        updatedAt:
          Date.now(),
      },
    );


    return args.id;
  },
});


// =========================================================
// REMOVE
// =========================================================

export const remove = mutation({
  args: {
    id: v.id(
      "courseMaterials",
    ),
  },

  handler: async (
    ctx,
    args,
  ) => {

    await ctx.db.delete(
      args.id,
    );

    return true;
  },
});