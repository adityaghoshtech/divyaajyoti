import { query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

import {
  normalizePhone,
} from "./utils";


/* =========================================================
   GET ALL APPROVED COURSES FOR ONE PHONE NUMBER
========================================================= */

export const getMyCourses = query({

  args: {
    phone: v.string(),
  },

  handler: async (
    ctx,
    args,
  ) => {

    const phone =
      normalizePhone(
        args.phone,
      );

    if (!phone) {
      return [];
    }


    /* =====================================================
       FIND ALL ENROLLMENTS FOR THIS PHONE
    ===================================================== */

    const enrollments =
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


    /* =====================================================
       ONLY APPROVED ENROLLMENTS
    ===================================================== */

    const approved =
      enrollments
        .filter(
          (item) =>
            String(
              item.status ?? "",
            ).toUpperCase() ===
            "APPROVED",
        )
        .sort(
          (a, b) =>
            b.createdAt -
            a.createdAt,
        );


    /* =====================================================
       LOAD COURSE INFORMATION
    ===================================================== */

    const result =
      await Promise.all(

        approved.map(
          async (
            enrollment,
          ) => {

            const course =
              await ctx.db
                .query(
                  "courses",
                )
                .withIndex(
                  "by_slug",
                  (q) =>
                    q.eq(
                      "slug",
                      enrollment.courseSlug,
                    ),
                )
                .unique();


            /* =============================================
               LESSON COUNT
            ============================================= */

            const lessonCount =
              course
                ? Array.isArray(
                    course.lessons,
                  )
                  ? course.lessons.length
                  : Number(
                      course.lessons ||
                        0,
                    )
                : 0;


            /* =============================================
               RETURN COURSE
            ============================================= */

            return {

              enrollmentId:
                enrollment._id,

              courseSlug:
                enrollment.courseSlug,

              courseTitle:
                enrollment.courseTitle,

              name:
                enrollment.name,

              email:
                enrollment.email,

              approvedAt:
                enrollment.approvedAt ??
                enrollment.createdAt,

              course:
                course
                  ? {

                      title:
                        course.title,

                      slug:
                        course.slug,

                      category:
                        course.category ??
                        "Learning",

                      duration:
                        course.duration,

                      level:
                        course.level,

                      description:
                        course.description,

                      instructor:
                        course.instructor,

                      price:
                        course.price ??
                        0,

                      image:
                        course.image ??
                        course.images?.[0] ??
                        "",

                      lessonCount,

                    }
                  : null,

            };

          },
        ),

      );


    return result;

  },

});


/* =========================================================
   GET ONE APPROVED COURSE + ITS MATERIALS
========================================================= */

export const getCourseAccess =
  query({

    args: {

      phone:
        v.string(),

      courseSlug:
        v.string(),

    },

    handler: async (
      ctx,
      args,
    ) => {

      /* ===================================================
         NORMALIZE PHONE
      =================================================== */

      const phone =
        normalizePhone(
          args.phone,
        );

      if (!phone) {
        return null;
      }


      /* ===================================================
         FIND ENROLLMENTS FOR THIS PHONE
      =================================================== */

      const enrollments =
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


      /* ===================================================
         ACCESS RULE

         USER MUST HAVE:

         PHONE
         +
         COURSE SLUG
         +
         APPROVED STATUS

         This prevents one student's approval from
         giving another student access.
      =================================================== */

      const enrollment =
        enrollments
          .filter(
            (item) =>
              item.courseSlug ===
                args.courseSlug &&
              String(
                item.status ?? "",
              ).toUpperCase() ===
                "APPROVED",
          )
          .sort(
            (a, b) =>
              b.createdAt -
              a.createdAt,
          )[0];


      if (!enrollment) {
        return null;
      }


      /* ===================================================
         FIND COURSE
      =================================================== */

      const course =
        await ctx.db
          .query(
            "courses",
          )
          .withIndex(
            "by_slug",
            (q) =>
              q.eq(
                "slug",
                args.courseSlug,
              ),
          )
          .unique();


      if (!course) {
        return null;
      }


      /* ===================================================
         GET ALL COURSE MATERIALS
      =================================================== */

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


      /* ===================================================
         ONLY PUBLISHED MATERIALS

         Then generate a URL for Convex Storage files.
      =================================================== */

      const publishedMaterials =
        await Promise.all(

          materials
            .filter(
              (item) =>
                String(
                  item.status ?? "",
                ).toUpperCase() ===
                "PUBLISHED",
            )
            .sort(
              (a, b) =>
                a.sortOrder -
                b.sortOrder,
            )
            .map(
              async (
                item,
              ) => {

                /* =========================================
                   STORAGE URL
                ========================================= */

                let storageUrl:
                  | string
                  | null =
                  null;


                if (
                  item.storageId
                ) {

                  try {

                    storageUrl =
                      await ctx.storage.getUrl(
                        item.storageId as Id<"_storage">,
                      );

                  } catch {

                    storageUrl =
                      null;

                  }

                }


                /* =========================================
                   RETURN MATERIAL
                ========================================= */

                return {

                  id:
                    item._id,

                  courseSlug:
                    item.courseSlug,

                  title:
                    item.title,

                  type:
                    String(
                      item.type ?? "",
                    ).toUpperCase(),

                  description:
                    item.description ??
                    "",

                  /*
                   * External URL
                   *
                   * Example:
                   * Google Meet
                   * YouTube
                   * Google Drive
                   */
                  url:
                    item.url ??
                    "",

                  /*
                   * Convex Storage URL
                   *
                   * Example:
                   * MP4
                   * PDF
                   * DOC
                   * Image
                   */
                  storageUrl,

                  /*
                   * Keep storageId available
                   * for debugging / future use.
                   */
                  storageId:
                    item.storageId ??
                    null,

                  sortOrder:
                    item.sortOrder,

                  status:
                    item.status,

                };

              },
            ),

        );


      /* ===================================================
         LESSON COUNT
      =================================================== */

      const lessonCount =
        Array.isArray(
          course.lessons,
        )
          ? course.lessons.length
          : Number(
              course.lessons ||
                0,
            );


      /* ===================================================
         FINAL RESPONSE
      =================================================== */

      return {

        /* ===============================================
           ENROLLMENT
        =============================================== */

        enrollment: {

          id:
            enrollment._id,

          name:
            enrollment.name,

          email:
            enrollment.email,

          phone:
            enrollment.phone,

          approvedAt:
            enrollment.approvedAt ??
            enrollment.createdAt,

        },


        /* ===============================================
           COURSE
        =============================================== */

        course: {

          title:
            course.title,

          slug:
            course.slug,

          category:
            course.category ??
            "Learning",

          duration:
            course.duration,

          level:
            course.level,

          description:
            course.description,

          instructor:
            course.instructor,

          image:
            course.image ??
            course.images?.[0] ??
            "",

          lessonCount,

          syllabus:
            course.syllabus ??
            [],

        },


        /* ===============================================
           MATERIALS

           Every material here belongs to THIS course.
        =============================================== */

        materials:
          publishedMaterials,

      };

    },

  });