import {
  mutation,
  query,
} from "./_generated/server";

import { v } from "convex/values";

import {
  normalizePhone,
} from "./utils";

// =========================================================
// COURSE LIST
// =========================================================

export const list = query({
  args: {
    category: v.optional(
      v.string(),
    ),
  },

  handler: async (
    ctx,
    args,
  ) => {
    const courses =
      await ctx.db
        .query("courses")
        .collect();

    if (!args.category) {
      return courses;
    }

    return courses.filter(
      (course) =>
        course.category
          ?.toLowerCase() ===
        args.category!
          .toLowerCase(),
    );
  },
});

// =========================================================
// COURSE BY SLUG
// =========================================================

export const bySlug = query({
  args: {
    slug: v.string(),
  },

  handler: async (ctx, args) => {
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!course) {
      return null;
    }

    let imageUrl: string | null = null;

    if (course.image) {
      try {
        imageUrl = await ctx.storage.getUrl(
          course.image as any
        );
      } catch {
        // If image is already a normal URL/path,
        // keep it as-is.
        imageUrl = course.image;
      }
    }

    const imageUrls: string[] = [];

    if (course.images) {
      for (const image of course.images) {
        try {
          const url = await ctx.storage.getUrl(
            image as any
          );

          if (url) {
            imageUrls.push(url);
          }
        } catch {
          if (image) {
            imageUrls.push(image);
          }
        }
      }
    }

    return {
      ...course,
      image: imageUrl,
      images: imageUrls,
    };
  },
});

// =========================================================
// SUBMIT QR PAYMENT
// =========================================================

export const submitManualPayment =
  mutation({
    args: {
      courseSlug: v.string(),
      courseTitle: v.string(),

      name: v.string(),
      email: v.string(),
      phone: v.string(),

      amount: v.number(),

      paymentReference:
        v.string(),
    },

    handler: async (
      ctx,
      args,
    ) => {
      const phone =
        normalizePhone(
          args.phone,
        );

      const existing =
        await ctx.db
          .query(
            "courseEnrollments",
          )
          .withIndex(
            "by_phone",
            (q) =>
              q.eq(
                "phone",
                phone,
              ),
          )
          .collect();

      const duplicate =
        existing.some(
          (item) =>
            item.courseSlug ===
              args.courseSlug &&
            item.status ===
              "PENDING",
        );

      if (duplicate) {
        throw new Error(
          "You already have a payment awaiting approval for this course.",
        );
      }

      const approved =
        existing.some(
          (item) =>
            item.courseSlug ===
              args.courseSlug &&
            item.status ===
              "APPROVED",
        );

      if (approved) {
        throw new Error(
          "You already have access to this course.",
        );
      }

      const enrollmentId =
        await ctx.db.insert(
          "courseEnrollments",
          {
            courseSlug:
              args.courseSlug,

            courseTitle:
              args.courseTitle,

            name: args.name,

            email: args.email,

            phone,

            amount: args.amount,

            currency: "INR",

            paymentReference:
              args.paymentReference,

            status: "PENDING",

            createdAt:
              Date.now(),

            updatedAt:
              Date.now(),
          },
        );

      /*
       * Also keep a payment record
       * for the admin payment manager.
       */

      await ctx.db.insert(
        "payments",
        {
          courseSlug:
            args.courseSlug,

          courseTitle:
            args.courseTitle,

          name: args.name,

          email: args.email,

          phone,

          amount:
            args.amount,

          paymentReference:
            args.paymentReference,

          status: "pending",

          createdAt:
            Date.now(),

          updatedAt:
            Date.now(),
        },
      );

      return enrollmentId;
    },
  });