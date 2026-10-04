import {
  mutation,
  query,
} from "./_generated/server";

import { v } from "convex/values";

/* =========================================================
   HELPERS
========================================================= */

function cleanText(
  value: string | undefined,
) {
  return value?.trim() || "";
}

function normalizeStatus(
  value: string | undefined,
) {
  return String(
    value ?? "",
  )
    .trim()
    .toUpperCase();
}

/* =========================================================
   CREATE SITE VISIT
========================================================= */

export const create = mutation({
  args: {
    propertySlug: v.string(),

    name: v.string(),

    phone: v.string(),

    email: v.optional(
      v.string(),
    ),

    preferredDate: v.string(),

    notes: v.optional(
      v.string(),
    ),
  },

  handler: async (
    ctx,
    args,
  ) => {
    const propertySlug =
      cleanText(
        args.propertySlug,
      );

    const name =
      cleanText(args.name);

    const phone =
      cleanText(args.phone);

    const email =
      cleanText(args.email);

    const preferredDate =
      cleanText(
        args.preferredDate,
      );

    const notes =
      cleanText(args.notes);

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!propertySlug) {
      throw new Error(
        "Property is required.",
      );
    }

    if (!name) {
      throw new Error(
        "Name is required.",
      );
    }

    if (!phone) {
      throw new Error(
        "Phone number is required.",
      );
    }

    if (!preferredDate) {
      throw new Error(
        "Preferred visit date is required.",
      );
    }

    /* -------------------------------------------------------
       FIND PROPERTY
    ------------------------------------------------------- */

    const property =
      await ctx.db
        .query("properties")
        .withIndex(
          "by_slug",
          (q) =>
            q.eq(
              "slug",
              propertySlug,
            ),
        )
        .unique();

    if (!property) {
      throw new Error(
        "The selected property could not be found.",
      );
    }

    /* -------------------------------------------------------
       CREATE SITE VISIT
    ------------------------------------------------------- */

    const now =
      Date.now();

    const siteVisitId =
      await ctx.db.insert(
        "siteVisits",
        {
          propertyId:
            property._id,

          name,

          phone,

          email:
            email || undefined,

          preferredDate,

          status:
            "PENDING",

          notes:
            notes || undefined,

          createdAt:
            now,

          updatedAt:
            now,
        },
      );

    return {
      success: true,

      id: siteVisitId,

      propertyId:
        property._id,

      propertySlug:
        property.slug,
    };
  },
});

/* =========================================================
   LIST SITE VISITS
========================================================= */

export const list = query({
  args: {
    status: v.optional(
      v.string(),
    ),
  },

  handler: async (
    ctx,
    args,
  ) => {
    let visits;

    const status =
      normalizeStatus(
        args.status,
      );

    if (status) {
      visits =
        await ctx.db
          .query("siteVisits")
          .withIndex(
            "by_status",
            (q) =>
              q.eq(
                "status",
                status,
              ),
          )
          .collect();
    } else {
      visits =
        await ctx.db
          .query("siteVisits")
          .collect();
    }

    /* -------------------------------------------------------
       SORT NEWEST FIRST
    ------------------------------------------------------- */

    visits.sort(
      (a, b) =>
        b.createdAt -
        a.createdAt,
    );

    /* -------------------------------------------------------
       ADD PROPERTY DETAILS
    ------------------------------------------------------- */

    return await Promise.all(
      visits.map(
        async (visit) => {
          const property =
            await ctx.db.get(
              visit.propertyId,
            );

          return {
            ...visit,

            property: property
              ? {
                  _id:
                    property._id,

                  title:
                    property.title,

                  slug:
                    property.slug,

                  location:
                    property.location,

                  price:
                    property.price,

                  image:
                    property.image,
                }
              : null,
          };
        },
      ),
    );
  },
});

/* =========================================================
   GET SINGLE SITE VISIT
========================================================= */

export const byId = query({
  args: {
    id: v.id(
      "siteVisits",
    ),
  },

  handler: async (
    ctx,
    args,
  ) => {
    const visit =
      await ctx.db.get(
        args.id,
      );

    if (!visit) {
      return null;
    }

    const property =
      await ctx.db.get(
        visit.propertyId,
      );

    return {
      ...visit,

      property: property
        ? {
            _id:
              property._id,

            title:
              property.title,

            slug:
              property.slug,

            location:
              property.location,

            price:
              property.price,

            image:
              property.image,
          }
        : null,
    };
  },
});

/* =========================================================
   UPDATE SITE VISIT
========================================================= */

export const update = mutation({
  args: {
    id: v.id(
      "siteVisits",
    ),

    name: v.string(),

    phone: v.string(),

    email: v.optional(
      v.string(),
    ),

    preferredDate: v.string(),

    status: v.string(),

    notes: v.optional(
      v.string(),
    ),
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
        "Site visit not found.",
      );
    }

    const name =
      cleanText(args.name);

    const phone =
      cleanText(args.phone);

    const email =
      cleanText(args.email);

    const preferredDate =
      cleanText(
        args.preferredDate,
      );

    const notes =
      cleanText(args.notes);

    if (!name) {
      throw new Error(
        "Name is required.",
      );
    }

    if (!phone) {
      throw new Error(
        "Phone number is required.",
      );
    }

    if (!preferredDate) {
      throw new Error(
        "Preferred visit date is required.",
      );
    }

    const status =
      normalizeStatus(
        args.status,
      ) || "PENDING";

    await ctx.db.patch(
      args.id,
      {
        name,

        phone,

        email:
          email || undefined,

        preferredDate,

        status,

        notes:
          notes || undefined,

        updatedAt:
          Date.now(),
      },
    );

    return {
      success: true,
      id: args.id,
    };
  },
});

/* =========================================================
   UPDATE STATUS ONLY
========================================================= */

export const updateStatus =
  mutation({
    args: {
      id: v.id(
        "siteVisits",
      ),

      status: v.string(),
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
          "Site visit not found.",
        );
      }

      const status =
        normalizeStatus(
          args.status,
        );

      if (!status) {
        throw new Error(
          "Status is required.",
        );
      }

      await ctx.db.patch(
        args.id,
        {
          status,

          updatedAt:
            Date.now(),
        },
      );

      return {
        success: true,
        id: args.id,
        status,
      };
    },
  });

/* =========================================================
   DELETE SITE VISIT
========================================================= */

export const remove = mutation({
  args: {
    id: v.id(
      "siteVisits",
    ),
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
        "Site visit not found.",
      );
    }

    await ctx.db.delete(
      args.id,
    );

    return {
      success: true,
    };
  },
});