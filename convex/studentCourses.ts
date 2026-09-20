import { query } from "./_generated/server";
import { v } from "convex/values";
import { normalizePhone } from "./utils";

/* =========================================================
   GET ALL APPROVED COURSES FOR A PHONE NUMBER
========================================================= */

export const getMyCourses = query({
  args: {
    phone: v.string(),
  },

  handler: async (ctx, args) => {
    const phone = normalizePhone(args.phone);

    if (!phone) {
      return [];
    }

    const enrollments = await ctx.db
      .query("courseEnrollments")
      .withIndex("by_phone", (q) =>
        q.eq("phone", phone),
      )
      .collect();

    const approvedEnrollments = enrollments.filter(
      (enrollment) =>
        String(enrollment.status ?? "").toUpperCase() ===
        "APPROVED",
    );

    return approvedEnrollments.map((enrollment) => ({
      enrollmentId: enrollment._id,

      courseSlug: enrollment.courseSlug,

      courseTitle: enrollment.courseTitle,

      name: enrollment.name,

      email: enrollment.email,

      phone: enrollment.phone,

      amount: enrollment.amount,

      approvedAt: enrollment.approvedAt,

      paidAt: enrollment.paidAt,
    }));
  },
});


/* =========================================================
   CHECK COURSE ACCESS
========================================================= */

export const checkCourseAccess = query({
  args: {
    phone: v.string(),
    courseSlug: v.string(),
  },

  handler: async (ctx, args) => {
    const phone = normalizePhone(args.phone);

    if (!phone) {
      return null;
    }

    const enrollments = await ctx.db
      .query("courseEnrollments")
      .withIndex("by_phone", (q) =>
        q.eq("phone", phone),
      )
      .collect();

    const enrollment = enrollments.find(
      (item) =>
        item.courseSlug === args.courseSlug,
    );

    if (!enrollment) {
      return null;
    }

    const status = String(
      enrollment.status ?? "",
    ).toUpperCase();

    return {
      hasEnrollment: true,

      approved: status === "APPROVED",

      status,

      enrollmentId: enrollment._id,

      courseSlug: enrollment.courseSlug,

      courseTitle: enrollment.courseTitle,

      name: enrollment.name,

      phone: enrollment.phone,
    };
  },
});


/* =========================================================
   GET PRIVATE COURSE MATERIALS

   Only APPROVED students can access materials.
========================================================= */

export const getCourseMaterials = query({
  args: {
    phone: v.string(),
    courseSlug: v.string(),
  },

  handler: async (ctx, args) => {
    const phone = normalizePhone(args.phone);

    if (!phone) {
      return {
        authorized: false,
        materials: [],
      };
    }

    const enrollments = await ctx.db
      .query("courseEnrollments")
      .withIndex("by_phone", (q) =>
        q.eq("phone", phone),
      )
      .collect();

    const enrollment = enrollments.find(
      (item) =>
        item.courseSlug === args.courseSlug,
    );

    if (!enrollment) {
      return {
        authorized: false,
        materials: [],
      };
    }

    const status = String(
      enrollment.status ?? "",
    ).toUpperCase();

    if (status !== "APPROVED") {
      return {
        authorized: false,
        materials: [],
      };
    }

    const materials = await ctx.db
      .query("courseMaterials")
      .withIndex("by_course", (q) =>
        q.eq(
          "courseSlug",
          args.courseSlug,
        ),
      )
      .collect();

    const publishedMaterials = materials
      .filter(
        (material) =>
          String(material.status ?? "").toUpperCase() ===
          "PUBLISHED",
      )
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder,
      );

    return {
      authorized: true,

      enrollment: {
        enrollmentId: enrollment._id,

        name: enrollment.name,

        phone: enrollment.phone,

        courseTitle:
          enrollment.courseTitle,

        courseSlug:
          enrollment.courseSlug,
      },

      materials: publishedMaterials,
    };
  },
});