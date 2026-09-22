import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* =========================================================
   TABLE VALIDATOR
========================================================= */

const table = v.union(
  v.literal("properties"),
  v.literal("courses"),
  v.literal("courseMaterials"),
  v.literal("events"),
  v.literal("leads"),
  v.literal("consultations"),
  v.literal("siteVisits"),
  v.literal("courseEnrollments"),
  v.literal("payments"),
  v.literal("propertyCategories"),
);

/*
 * Tables that support multiple uploaded images.
 *
 * courseMaterials is intentionally NOT here because
 * course materials use one primary storageId.
 */
const contentTable = v.union(
  v.literal("properties"),
  v.literal("courses"),
  v.literal("events"),
);


/* =========================================================
   OVERVIEW
========================================================= */

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

      ctx.db
        .query("properties")
        .collect(),

      ctx.db
        .query("courses")
        .collect(),

      ctx.db
        .query("events")
        .collect(),

      ctx.db
        .query("leads")
        .collect(),

      ctx.db
        .query("consultations")
        .collect(),

      ctx.db
        .query("siteVisits")
        .collect(),

      ctx.db
        .query("courseEnrollments")
        .collect(),

      ctx.db
        .query("payments")
        .collect(),

      ctx.db
        .query("propertyCategories")
        .collect(),

    ]);

    return {

      properties:
        properties.length,

      activeProperties:
        properties.filter(
          (x) =>
            x.status !==
            "archived",
        ).length,

      courses:
        courses.length,

      publishedCourses:
        courses.filter(
          (x) =>
            x.status ===
            "published",
        ).length,

      events:
        events.length,

      upcomingEvents:
        events.filter(
          (x) =>
            x.status !==
            "cancelled",
        ).length,

      leads:
        leads.length,

      newLeads:
        leads.filter(
          (x) =>
            x.status === "new" ||
            x.status === "pending",
        ).length,

      consultations:
        consultations.length,

      siteVisits:
        siteVisits.length,

      enrollments:
        enrollments.length,

      payments:
        payments.length,

      categories:
        categories.length,

    };
  },
});


/* =========================================================
   PROPERTY CATEGORIES
========================================================= */

export const listCategories =
  query({

    args: {},

    handler: async (ctx) => {

      return await ctx.db
        .query(
          "propertyCategories",
        )
        .order("desc")
        .collect();

    },

  });


/* =========================================================
   LIST
========================================================= */

export const list =
  query({

    args: {
      table,
    },

    handler: async (
      ctx,
      args,
    ) => {

      switch (
        args.table
      ) {

        /* -----------------------------------------------
           PROPERTIES
        ----------------------------------------------- */

        case "properties":

          return await ctx.db
            .query(
              "properties",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           COURSES
        ----------------------------------------------- */

        case "courses":

          return await ctx.db
            .query(
              "courses",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           COURSE MATERIALS
        ----------------------------------------------- */

        case "courseMaterials":

          return await ctx.db
            .query(
              "courseMaterials",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           EVENTS
        ----------------------------------------------- */

        case "events":

          return await ctx.db
            .query(
              "events",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           LEADS
        ----------------------------------------------- */

        case "leads":

          return await ctx.db
            .query(
              "leads",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           CONSULTATIONS
        ----------------------------------------------- */

        case "consultations":

          return await ctx.db
            .query(
              "consultations",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           SITE VISITS
        ----------------------------------------------- */

        case "siteVisits":

          return await ctx.db
            .query(
              "siteVisits",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           COURSE ENROLLMENTS
        ----------------------------------------------- */

        case "courseEnrollments":

          return await ctx.db
            .query(
              "courseEnrollments",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           PAYMENTS
        ----------------------------------------------- */

        case "payments":

          return await ctx.db
            .query(
              "payments",
            )
            .order("desc")
            .collect();


        /* -----------------------------------------------
           PROPERTY CATEGORIES
        ----------------------------------------------- */

        case "propertyCategories":

          return await ctx.db
            .query(
              "propertyCategories",
            )
            .order("desc")
            .collect();

      }

    },

  });


/* =========================================================
   CREATE
========================================================= */

export const create =
  mutation({

    args: {
      table,
      data: v.any(),
    },

    handler: async (
      ctx,
      args,
    ) => {

      const data = {
        ...(args.data as Record<
          string,
          unknown
        >),
      };

      const now = Date.now();


      switch (
        args.table
      ) {

        /* -----------------------------------------------
           PROPERTIES
        ----------------------------------------------- */

        case "properties":

          return await ctx.db.insert(
            "properties",
            data as any,
          );


        /* -----------------------------------------------
           COURSES
        ----------------------------------------------- */

        case "courses":

          return await ctx.db.insert(
            "courses",
            data as any,
          );


        /* -----------------------------------------------
           COURSE MATERIALS
        ----------------------------------------------- */

        case "courseMaterials":

          return await ctx.db.insert(
            "courseMaterials",
            {
              ...data,
              createdAt:
                typeof data.createdAt === "number"
                  ? data.createdAt
                  : now,
              updatedAt: now,
            } as any,
          );


        /* -----------------------------------------------
           EVENTS
        ----------------------------------------------- */

        case "events":

          return await ctx.db.insert(
            "events",
            data as any,
          );


        /* -----------------------------------------------
           LEADS
        ----------------------------------------------- */

        case "leads":

          return await ctx.db.insert(
            "leads",
            data as any,
          );


        /* -----------------------------------------------
           CONSULTATIONS
        ----------------------------------------------- */

        case "consultations":

          return await ctx.db.insert(
            "consultations",
            data as any,
          );


        /* -----------------------------------------------
           SITE VISITS
        ----------------------------------------------- */

        case "siteVisits":

          return await ctx.db.insert(
            "siteVisits",
            data as any,
          );


        /* -----------------------------------------------
           COURSE ENROLLMENTS
        ----------------------------------------------- */

        case "courseEnrollments":

          return await ctx.db.insert(
            "courseEnrollments",
            data as any,
          );


        /* -----------------------------------------------
           PAYMENTS
        ----------------------------------------------- */

        case "payments":

          return await ctx.db.insert(
            "payments",
            data as any,
          );


        /* -----------------------------------------------
           PROPERTY CATEGORIES
        ----------------------------------------------- */

        case "propertyCategories":

          return await ctx.db.insert(
            "propertyCategories",
            data as any,
          );

      }

    },

  });


/* =========================================================
   UPDATE
========================================================= */

export const update =
  mutation({

    args: {
      table,
      id:
        v.string(),

      patch:
        v.any(),
    },

    handler: async (
      ctx,
      args,
    ) => {

      const normalized =
        ctx.db.normalizeId(
          args.table,
          args.id,
        );

      if (!normalized) {

        throw new Error(
          "Invalid record id.",
        );

      }

      await ctx.db.patch(
        normalized as any,

        {
          ...(args.patch as Record<
            string,
            unknown
          >),

          updatedAt:
            Date.now(),
        },
      );

      return normalized;

    },

  });


/* =========================================================
   DELETE
========================================================= */

export const remove =
  mutation({

    args: {
      table,

      id:
        v.string(),
    },

    handler: async (
      ctx,
      args,
    ) => {

      const normalized =
        ctx.db.normalizeId(
          args.table,
          args.id,
        );

      if (!normalized) {

        throw new Error(
          "Invalid record id.",
        );

      }

      await ctx.db.delete(
        normalized as any,
      );

    },

  });


/* =========================================================
   CONVEX STORAGE
   GENERATE UPLOAD URL
========================================================= */

export const generateUploadUrl =
  mutation({

    args: {},

    handler: async (
      ctx,
    ) => {

      return await ctx.storage
        .generateUploadUrl();

    },

  });


/* =========================================================
   ATTACH IMAGES
   FOR PROPERTIES / COURSES / EVENTS
========================================================= */

export const attachImages =
  mutation({

    args: {

      table:
        contentTable,

      id:
        v.string(),

      storageIds:
        v.array(
          v.string(),
        ),

    },

    handler: async (
      ctx,
      args,
    ) => {

      const normalized =
        ctx.db.normalizeId(
          args.table,
          args.id,
        );

      if (!normalized) {

        throw new Error(
          "Invalid record id.",
        );

      }


      const urls:
        string[] = [];


      for (
        const storageId of
        args.storageIds
      ) {

        const url =
          await ctx.storage
            .getUrl(
              storageId as any,
            );

        if (url) {

          urls.push(url);

        }

      }


      if (
        !urls.length
      ) {

        return [];

      }


      const existing =
        await ctx.db.get(
          normalized as any,
        ) as any;


      const current =
        Array.isArray(
          existing?.images,
        )
          ? existing.images
          : [];


      const images =
        [
          ...current,
          ...urls,
        ];


      await ctx.db.patch(
        normalized as any,
        {

          images,

          ...(existing?.image
            ? {}
            : {
                image:
                  images[0],
              }),

          updatedAt:
            Date.now(),

        },
      );


      return urls;

    },

  });