import {
  mutation,
  query,
} from "./_generated/server";

import { v } from "convex/values";

/* =========================================================
   GENERATE UPLOAD URL
========================================================= */

export const generateUploadUrl =
  mutation({
    args: {},

    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
  });

/* =========================================================
   LIST MATERIALS
========================================================= */

export const list =
  query({
    args: {
      includeDrafts:
        v.optional(v.boolean()),

      courseSlug:
        v.optional(v.string()),
    },

    handler: async (
      ctx,
      args,
    ) => {
      let materials =
        await ctx.db
          .query("courseMaterials")
          .collect();

      /* -----------------------------------------------------
         COURSE FILTER
      ----------------------------------------------------- */

      if (
        args.courseSlug &&
        args.courseSlug.trim()
      ) {
        materials =
          materials.filter(
            (item) =>
              item.courseSlug ===
              args.courseSlug,
          );
      }

      /* -----------------------------------------------------
         PUBLISHED / DRAFT
      ----------------------------------------------------- */

      if (!args.includeDrafts) {
        materials =
          materials.filter(
            (item) =>
              String(
                item.status ?? "",
              ).toUpperCase() ===
              "PUBLISHED",
          );
      }

      /* -----------------------------------------------------
         SORT
      ----------------------------------------------------- */

      materials.sort(
        (a, b) =>
          a.courseSlug.localeCompare(
            b.courseSlug,
          ) ||
          a.sortOrder -
            b.sortOrder ||
          b.createdAt -
            a.createdAt,
      );

      /* -----------------------------------------------------
         STORAGE URL
      ----------------------------------------------------- */

      return await Promise.all(
        materials.map(
          async (material) => {
            let storageUrl:
              | string
              | undefined =
              undefined;

            if (
              material.storageId
            ) {
              storageUrl =
                (await ctx.storage.getUrl(
                  material.storageId,
                )) ||
                undefined;
            }

            return {
              ...material,

              storageUrl,
            };
          },
        ),
      );
    },
  });

/* =========================================================
   CREATE
========================================================= */

export const create =
  mutation({
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
          v.id("_storage"),
        ),

      sortOrder:
        v.number(),

      status:
        v.string(),
    },

    handler: async (
      ctx,
      args,
    ) => {
      const courseSlug =
        args.courseSlug.trim();

      const title =
        args.title.trim();

      if (!courseSlug) {
        throw new Error(
          "Course is required.",
        );
      }

      if (!title) {
        throw new Error(
          "Material title is required.",
        );
      }

      if (!args.type) {
        throw new Error(
          "Material type is required.",
        );
      }

      const course =
        await ctx.db
          .query("courses")
          .withIndex(
            "by_slug",
            (q) =>
              q.eq(
                "slug",
                courseSlug,
              ),
          )
          .unique();

      if (!course) {
        throw new Error(
          "Selected course was not found.",
        );
      }

      const cleanUrl =
        args.url?.trim() ||
        undefined;

      const status =
        String(
          args.status ?? "DRAFT",
        ).toUpperCase() ===
        "PUBLISHED"
          ? "PUBLISHED"
          : "DRAFT";

      const now =
        Date.now();

      return await ctx.db.insert(
        "courseMaterials",
        {
          courseSlug,

          title,

          type:
            args.type
              .trim()
              .toUpperCase(),

          description:
            args.description?.trim() ||
            undefined,

          url:
            cleanUrl,

          storageId:
            args.storageId,

          sortOrder:
            Number(
              args.sortOrder ?? 0,
            ),

          status,

          createdAt:
            now,

          updatedAt:
            now,
        },
      );
    },
  });

/* =========================================================
   UPDATE
========================================================= */

export const update =
  mutation({
    args: {
      id:
        v.id(
          "courseMaterials",
        ),

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
          v.id("_storage"),
        ),

      sortOrder:
        v.number(),

      status:
        v.string(),
    },

    handler: async (
      ctx,
      args,
    ) => {
      const existing =
        await ctx.db.get(
          args.id,
        );

      if (!existing) {
        throw new Error(
          "Course material not found.",
        );
      }

      const courseSlug =
        args.courseSlug.trim();

      const title =
        args.title.trim();

      if (!courseSlug) {
        throw new Error(
          "Course is required.",
        );
      }

      if (!title) {
        throw new Error(
          "Material title is required.",
        );
      }

      const course =
        await ctx.db
          .query("courses")
          .withIndex(
            "by_slug",
            (q) =>
              q.eq(
                "slug",
                courseSlug,
              ),
          )
          .unique();

      if (!course) {
        throw new Error(
          "Selected course was not found.",
        );
      }

      const status =
        String(
          args.status ?? "DRAFT",
        ).toUpperCase() ===
        "PUBLISHED"
          ? "PUBLISHED"
          : "DRAFT";

      const patch: any = {
        courseSlug,

        title,

        type:
          args.type
            .trim()
            .toUpperCase(),

        description:
          args.description?.trim() ||
          undefined,

        url:
          args.url?.trim() ||
          undefined,

        sortOrder:
          Number(
            args.sortOrder ?? 0,
          ),

        status,

        updatedAt:
          Date.now(),
      };

      /*
       * Only replace the existing storage file
       * when a new file was uploaded.
       */
      if (
        args.storageId
      ) {
        patch.storageId =
          args.storageId;
      }

      await ctx.db.patch(
        args.id,
        patch,
      );

      return args.id;
    },
  });

/* =========================================================
   DELETE
========================================================= */

export const remove =
  mutation({
    args: {
      id:
        v.id(
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
        throw new Error(
          "Course material not found.",
        );
      }

      /*
       * Remove the associated file from
       * Convex Storage as well.
       */
      if (
        material.storageId
      ) {
        try {
          await ctx.storage.delete(
            material.storageId,
          );
        } catch {
          /*
           * Do not block database deletion
           * if the storage object is already gone.
           */
        }
      }

      await ctx.db.delete(
        args.id,
      );

      return {
        success: true,
      };
    },
  });