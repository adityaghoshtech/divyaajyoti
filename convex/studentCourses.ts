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


            const lessonCount =
              course
                ? Array.isArray(
                    course.lessons,
                  )
                  ? course.lessons.length
                  : Number(
                      course.lessons || 0,
                    )
                : 0;


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

      const phone =
        normalizePhone(
          args.phone,
        );

      if (!phone) {
        return null;
      }


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


      /*
       * IMPORTANT:
       *
       * Access is based on:
       *
       * PHONE + COURSE SLUG
       *
       * Not course alone.
       */

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


      const publishedMaterials =
        await Promise.all(

          materials
            .filter(
              (item) =>
                String(
                  item.status,
                ).toLowerCase() ===
                "published",
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

                let storageUrl:
                  string | null =
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


                return {

                  id:
                    item._id,

                  title:
                    item.title,

                  type:
                    item.type,

                  description:
                    item.description ??
                    "",

                  url:
                    item.url ??
                    storageUrl ??
                    "",

                  sortOrder:
                    item.sortOrder,

                };

              },
            ),

        );


      const lessonCount =
        Array.isArray(
          course.lessons,
        )
          ? course.lessons.length
          : Number(
              course.lessons || 0,
            );


      return {

        enrollment: {

          id:
            enrollment._id,

          name:
            enrollment.name,

          approvedAt:
            enrollment.approvedAt ??
            enrollment.createdAt,

        },

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

        materials:
          publishedMaterials,

      };

    },

  });