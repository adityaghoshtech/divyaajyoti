import { query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

import {
  normalizePhone,
} from "./utils";


/* =========================================================
   HELPERS
========================================================= */

function cleanPhone(
  value: string,
) {
  return normalizePhone(
    String(value ?? ""),
  );
}


function cleanSlug(
  value: string,
) {
  return String(
    value ?? "",
  )
    .trim()
    .toLowerCase();
}


function isApproved(
  status?: string,
) {
  return (
    String(
      status ?? "",
    )
      .trim()
      .toUpperCase() ===
    "APPROVED"
  );
}


function isPublished(
  status?: string,
) {
  return (
    String(
      status ?? "",
    )
      .trim()
      .toUpperCase() ===
    "PUBLISHED"
  );
}


/*
 * Important compatibility helper.
 *
 * New enrollments should store a normalized phone number.
 * Older records may contain values such as:
 *
 *   +91 98368 02673
 *   98368-02673
 *   9836802673
 *
 * The by_phone index only finds an exact stored value, so
 * when the indexed lookup does not find a record we perform
 * a fallback normalized comparison. This makes existing
 * enrollments work without asking students to buy again.
 */
async function findEnrollmentsForPhone(
  ctx: any,
  phone: string,
) {
  const normalizedPhone =
    cleanPhone(phone);

  if (!normalizedPhone) {
    return [];
  }

  const indexed =
    await ctx.db
      .query(
        "courseEnrollments",
      )
      .withIndex(
        "by_phone",
        (q: any) =>
          q.eq(
            "phone",
            normalizedPhone,
          ),
      )
      .collect();

  /*
   * Also scan legacy records even when the exact indexed
   * phone has other enrollments. This is important when a
   * student has older purchases stored with formatting such
   * as +91 98368 02673 while newer purchases use digits only.
   */
  const all =
    await ctx.db
      .query(
        "courseEnrollments",
      )
      .collect();

  const legacyMatches = all.filter(
    (item: any) =>
      cleanPhone(
        item.phone,
      ) ===
      normalizedPhone,
  );

  const seen = new Set<string>();
  return [...indexed, ...legacyMatches].filter((item: any) => {
    const id = String(item._id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}


/*
 * Find a course by normalized slug.
 *
 * The normal path uses the by_slug index.
 * The fallback handles an older record whose slug has
 * different casing or accidental surrounding whitespace.
 */
async function findCourseBySlug(
  ctx: any,
  slug: string,
) {
  const normalizedSlug =
    cleanSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  const indexed =
    await ctx.db
      .query(
        "courses",
      )
      .withIndex(
        "by_slug",
        (q: any) =>
          q.eq(
            "slug",
            normalizedSlug,
          ),
      )
      .unique();

  if (indexed) {
    return indexed;
  }

  const all =
    await ctx.db
      .query(
        "courses",
      )
      .collect();

  return (
    all.find(
      (course: any) =>
        cleanSlug(
          course.slug,
        ) ===
        normalizedSlug,
    ) ??
    null
  );
}


/*
 * Course materials can also contain legacy courseSlug
 * formatting. Use the index first and fall back to a
 * normalized comparison when necessary.
 */
async function findCourseMaterials(
  ctx: any,
  courseSlug: string,
) {
  const normalizedSlug =
    cleanSlug(courseSlug);

  if (!normalizedSlug) {
    return [];
  }

  const indexed =
    await ctx.db
      .query(
        "courseMaterials",
      )
      .withIndex(
        "by_course",
        (q: any) =>
          q.eq(
            "courseSlug",
            normalizedSlug,
          ),
      )
      .collect();

  if (
    indexed.length > 0
  ) {
    return indexed;
  }

  const all =
    await ctx.db
      .query(
        "courseMaterials",
      )
      .collect();

  return all.filter(
    (material: any) =>
      cleanSlug(
        material.courseSlug,
      ) ===
      normalizedSlug,
  );
}


/*
 * Resolve a Convex Storage file into a browser URL.
 *
 * storageId is stored as a string in the current schema,
 * so it is cast to the Convex storage Id only at the point
 * where getUrl() needs it.
 */
async function resolveStorageUrl(
  ctx: any,
  storageId?: string,
) {
  if (!storageId) {
    return null;
  }

  try {
    return await ctx.storage.getUrl(
      storageId as Id<"_storage">,
    );
  } catch {
    return null;
  }
}


/* =========================================================
   GET ALL APPROVED COURSES FOR ONE PHONE NUMBER
========================================================= */

export const getMyCourses =
  query({

    args: {
      phone:
        v.string(),
    },

    handler: async (
      ctx,
      args,
    ) => {

      const phone =
        cleanPhone(
          args.phone,
        );

      if (!phone) {
        return [];
      }


      /* ================================================
         FIND ENROLLMENTS FOR THIS STUDENT
      ================================================ */

      const enrollments =
        await findEnrollmentsForPhone(
          ctx,
          phone,
        );


      /* ================================================
         ONLY APPROVED ENROLLMENTS
      ================================================ */

      const approved =
        enrollments
          .filter(
            (item: any) =>
              isApproved(
                item.status,
              ),
          )
          .sort(
            (
              a: any,
              b: any,
            ) =>
              Number(
                b.createdAt ??
                0,
              ) -
              Number(
                a.createdAt ??
                0,
              ),
          );


      /* ================================================
         LOAD COURSE INFORMATION
      ================================================ */

      const result =
        await Promise.all(
          approved.map(
            async (
              enrollment: any,
            ) => {

              const course =
                await findCourseBySlug(
                  ctx,
                  enrollment.courseSlug,
                );

              if (!course) {
                return null;
              }


              const lessonCount =
                Array.isArray(
                  course.lessons,
                )
                  ? course.lessons.length
                  : Number(
                      course.lessons ??
                      0,
                    );


              return {

                enrollmentId:
                  enrollment._id,

                courseSlug:
                  course.slug,

                courseTitle:
                  course.title,

                name:
                  enrollment.name,

                email:
                  enrollment.email,

                phone:
                  enrollment.phone,

                status:
                  enrollment.status,

                approvedAt:
                  enrollment.approvedAt ??
                  enrollment.createdAt,

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

                  price:
                    course.price ??
                    0,

                  image:
                    course.image ??
                    course.images?.[0] ??
                    "",

                  lessonCount,

                },

              };

            },
          ),
        );


      /*
       * A deleted course should not create a null card
       * on the student's My Courses page.
       */
      return result.filter(
        (
          item,
        ): item is NonNullable<
          typeof item
        > =>
          item !== null,
      );

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

      enrollmentId:
        v.optional(
          v.id("courseEnrollments"),
        ),

    },

    handler: async (
      ctx,
      args,
    ) => {

      /* ================================================
         NORMALIZE INPUT
      ================================================ */

      const phone =
        cleanPhone(
          args.phone,
        );

      const courseSlug =
        cleanSlug(
          args.courseSlug,
        );

      if (
        !phone ||
        !courseSlug
      ) {
        return null;
      }


      /* ================================================
         FIND THE APPROVED ENROLLMENT

         When /my-courses supplied an enrollmentId, use that
         exact record. This is the authoritative record that
         the student already saw as APPROVED.

         The phone and course slug are still checked so one
         enrollment cannot accidentally be used for another
         student or another course.
      ================================================ */

      let approvedEnrollment: any = null;

      if (args.enrollmentId) {
        const exactEnrollment =
          await ctx.db.get(args.enrollmentId);

        if (exactEnrollment) {
          const enrollmentPhone = cleanPhone(
            exactEnrollment.phone,
          );

          const enrollmentSlug = cleanSlug(
            exactEnrollment.courseSlug,
          );

          if (
            enrollmentPhone === phone &&
            enrollmentSlug === courseSlug &&
            isApproved(exactEnrollment.status)
          ) {
            approvedEnrollment = exactEnrollment;
          }
        }
      }

      /*
       * Backward-compatible fallback for old links that do
       * not provide an enrollmentId.
       */
      if (!approvedEnrollment) {
        const enrollments =
          await findEnrollmentsForPhone(
            ctx,
            phone,
          );

        const matching =
          enrollments
            .filter(
              (item: any) =>
                cleanSlug(item.courseSlug) === courseSlug,
            )
            .sort(
              (a: any, b: any) =>
                Number(b.createdAt ?? 0) -
                Number(a.createdAt ?? 0),
            );

        approvedEnrollment =
          matching.find((item: any) =>
            isApproved(item.status),
          ) ?? null;
      }

      if (!approvedEnrollment) {
        return null;
      }


      /* ================================================
         FIND COURSE
      ================================================ */

      const course =
        await findCourseBySlug(
          ctx,
          courseSlug,
        );


      if (!course) {
        return null;
      }


      /* ================================================
         FIND COURSE MATERIALS
      ================================================ */

      const materials =
        await findCourseMaterials(
          ctx,
          courseSlug,
        );


      /* ================================================
         ONLY PUBLISHED MATERIALS
      ================================================ */

      const publishedMaterials =
        materials
          .filter(
            (item: any) =>
              isPublished(
                item.status,
              ),
          )
          .sort(
            (
              a: any,
              b: any,
            ) =>
              Number(
                a.sortOrder ??
                0,
              ) -
              Number(
                b.sortOrder ??
                0,
              ),
          );


      /* ================================================
         RESOLVE STORAGE FILE URLS
      ================================================ */

      const resolvedMaterials =
        await Promise.all(
          publishedMaterials.map(
            async (
              item: any,
            ) => {

              const storageUrl =
                await resolveStorageUrl(
                  ctx,
                  item.storageId,
                );


              /*
               * fileUrl is returned as an alias so the
               * frontend can use one consistent property
               * regardless of which version of the page
               * is installed.
               */

              return {

                id:
                  item._id,

                courseSlug:
                  item.courseSlug,

                title:
                  item.title,

                type:
                  String(
                    item.type ??
                    "",
                  )
                    .trim()
                    .toUpperCase(),

                description:
                  item.description ??
                  "",

                /*
                 * External URL:
                 * Google Meet, YouTube, Drive, etc.
                 */
                url:
                  item.url ??
                  "",

                /*
                 * Convex Storage URL:
                 * MP4, PDF, DOC, image, etc.
                 */
                storageUrl,

                /*
                 * Same resolved URL under a clearer name.
                 */
                fileUrl:
                  storageUrl,

                /*
                 * Keep storageId available for
                 * debugging and future features.
                 */
                storageId:
                  item.storageId ??
                  null,

                sortOrder:
                  Number(
                    item.sortOrder ??
                    0,
                  ),

                status:
                  item.status,

              };

            },
          ),
        );


      /* ================================================
         LESSON COUNT
      ================================================ */

      const lessonCount =
        Array.isArray(
          course.lessons,
        )
          ? course.lessons.length
          : Number(
              course.lessons ??
              0,
            );


      /* ================================================
         FINAL RESPONSE
      ================================================ */

      return {

        enrollment: {

          id:
            approvedEnrollment._id,

          name:
            approvedEnrollment.name,

          email:
            approvedEnrollment.email,

          phone:
            approvedEnrollment.phone,

          approvedAt:
            approvedEnrollment.approvedAt ??
            approvedEnrollment.createdAt,

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


        /*
         * Every material returned here belongs to
         * THIS course and THIS approved student access.
         */
        materials:
          resolvedMaterials,

      };

    },

  });
