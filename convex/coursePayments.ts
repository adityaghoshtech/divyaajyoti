import {
  mutation,
  query,
} from "./_generated/server";

import { v } from "convex/values";

import {
  normalizePhone,
} from "./utils";


/* =========================================================
   GENERATE PAYMENT UPLOAD URL
========================================================= */

export const generateUploadUrl =
  mutation({
    args: {},

    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
  });


/* =========================================================
   SUBMIT PAYMENT
========================================================= */

export const submitPayment =
  mutation({
    args: {
      courseSlug:
        v.string(),

      courseTitle:
        v.string(),

      name:
        v.string(),

      email:
        v.string(),

      phone:
        v.string(),

      amount:
        v.number(),

      paymentReference:
        v.string(),

      paymentProofStorageId:
        v.optional(
          v.id("_storage"),
        ),
    },

    handler: async (
      ctx,
      args,
    ) => {

      /* =====================================================
         CLEAN DATA
      ===================================================== */

      const name =
        args.name.trim();

      const email =
        args.email
          .trim()
          .toLowerCase();

      const phone =
        normalizePhone(
          args.phone,
        );

      const paymentReference =
        args.paymentReference.trim();


      /* =====================================================
         VALIDATION
      ===================================================== */

      if (!name) {
        throw new Error(
          "Please enter your full name.",
        );
      }

      if (!email) {
        throw new Error(
          "Please enter your email address.",
        );
      }

      if (!phone) {
        throw new Error(
          "Please enter your phone number.",
        );
      }

      if (
        paymentReference.length <
        4
      ) {
        throw new Error(
          "Please enter a valid payment reference / UTR.",
        );
      }

      if (
        args.amount < 0
      ) {
        throw new Error(
          "Invalid payment amount.",
        );
      }


      /* =====================================================
         FIND ALL ENROLLMENTS FOR THIS PHONE
      ===================================================== */

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


      /* =====================================================
         ONLY THIS COURSE
      ===================================================== */

      const sameCourse =
        existing
          .filter(
            (item) =>
              item.courseSlug ===
              args.courseSlug,
          )
          .sort(
            (a, b) =>
              b.createdAt -
              a.createdAt,
          );


      /* =====================================================
         CHECK WHETHER THIS USER ALREADY OWNS THE COURSE

         IMPORTANT:

         This does NOT check the course globally.

         It checks:

           THIS PHONE
           +
           THIS COURSE
      ===================================================== */

      const approvedEnrollment =
        sameCourse.find(
          (item) =>
            String(
              item.status ?? "",
            ).toUpperCase() ===
            "APPROVED",
        );


      if (approvedEnrollment) {
        return {
          enrollmentId:
            approvedEnrollment._id,

          status:
            "APPROVED",
        };
      }


      /* =====================================================
         CHECK FOR EXISTING PENDING PAYMENT
      ===================================================== */

      const pendingEnrollment =
        sameCourse.find(
          (item) =>
            String(
              item.status ?? "",
            ).toUpperCase() ===
            "PENDING",
        );


      if (pendingEnrollment) {
        return {
          enrollmentId:
            pendingEnrollment._id,

          status:
            "PENDING",
        };
      }


      /* =====================================================
         PAYMENT PROOF URL
      ===================================================== */

      let paymentProofUrl:
        | string
        | undefined =
        undefined;


      if (
        args.paymentProofStorageId
      ) {
        paymentProofUrl =
          (
            await ctx.storage.getUrl(
              args.paymentProofStorageId,
            )
          ) || undefined;
      }


      /* =====================================================
         CREATE NEW ENROLLMENT
      ===================================================== */

      const enrollmentId =
        await ctx.db.insert(
          "courseEnrollments",
          {
            courseSlug:
              args.courseSlug,

            courseTitle:
              args.courseTitle,

            name,

            email,

            phone,

            amount:
              args.amount,

            currency:
              "INR",

            paymentReference:
              paymentReference,

            paymentProofStorageId:
              args.paymentProofStorageId,

            paymentProofUrl:
              paymentProofUrl,

            status:
              "PENDING",

            createdAt:
              Date.now(),

            updatedAt:
              Date.now(),
          },
        );


      /* =====================================================
         RETURN
      ===================================================== */

      return {
        enrollmentId,

        status:
          "PENDING",
      };
    },
  });


/* =========================================================
   GET ENROLLMENT BY ID
========================================================= */

export const getEnrollment =
  query({
    args: {
      enrollmentId:
        v.id(
          "courseEnrollments",
        ),
    },

    handler: async (
      ctx,
      args,
    ) => {

      return await ctx.db.get(
        args.enrollmentId,
      );
    },
  });


/* =========================================================
   GET ENROLLMENT BY PHONE + COURSE
========================================================= */

export const getEnrollmentByPhone =
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


      /* =====================================================
         ONLY THIS USER + THIS COURSE

         Latest enrollment first.
      ===================================================== */

      const matching =
        enrollments
          .filter(
            (item) =>
              item.courseSlug ===
              args.courseSlug,
          )
          .sort(
            (a, b) =>
              b.createdAt -
              a.createdAt,
          );


      return (
        matching[0] ??
        null
      );
    },
  });


/* =========================================================
   GET MY COURSES

   ONLY APPROVED COURSES FOR THIS PHONE.
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


      return enrollments
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
    },
  });


/* =========================================================
   ADMIN: LIST ENROLLMENTS
========================================================= */

export const listEnrollments =
  query({
    args: {
      status:
        v.optional(
          v.string(),
        ),
    },

    handler: async (
      ctx,
      args,
    ) => {

      const enrollments =
        await ctx.db
          .query(
            "courseEnrollments",
          )
          .order("desc")
          .collect();


      if (!args.status) {
        return enrollments;
      }


      const wantedStatus =
        args.status.toUpperCase();


      return enrollments.filter(
        (item) =>
          String(
            item.status ?? "",
          ).toUpperCase() ===
          wantedStatus,
      );
    },
  });


/* =========================================================
   ADMIN: APPROVE PAYMENT
========================================================= */

export const approvePayment =
  mutation({
    args: {
      enrollmentId:
        v.id(
          "courseEnrollments",
        ),

      /*
       * Optional because your admin UI
       * can send an admin note.
       */
      adminNote:
        v.optional(
          v.string(),
        ),
    },

    handler: async (
      ctx,
      args,
    ) => {

      /* ===================================================
         GET ENROLLMENT
      =================================================== */

      const enrollment =
        await ctx.db.get(
          args.enrollmentId,
        );


      if (!enrollment) {
        throw new Error(
          "Enrollment not found.",
        );
      }


      /* ===================================================
         CURRENT STATUS
      =================================================== */

      const currentStatus =
        String(
          enrollment.status ?? "",
        ).toUpperCase();


      /* ===================================================
         ALREADY APPROVED
      =================================================== */

      if (
        currentStatus ===
        "APPROVED"
      ) {
        return {
          success:
            true,

          enrollmentId:
            args.enrollmentId,

          status:
            "APPROVED",
        };
      }


      /* ===================================================
         APPROVE
      =================================================== */

      const now =
        Date.now();


      await ctx.db.patch(
        args.enrollmentId,
        {
          status:
            "APPROVED",

          adminNote:
            args.adminNote ??
            "Payment verified by Divyajyoti admin.",

          approvedAt:
            now,

          approvedBy:
            "Divyajyoti Admin",

          paidAt:
            now,

          updatedAt:
            now,
        },
      );


      /* ===================================================
         VERIFY DATABASE UPDATE
      =================================================== */

      const updated =
        await ctx.db.get(
          args.enrollmentId,
        );


      if (!updated) {
        throw new Error(
          "Enrollment could not be loaded after approval.",
        );
      }


      if (
        String(
          updated.status ?? "",
        ).toUpperCase() !==
        "APPROVED"
      ) {
        throw new Error(
          "Payment approval failed. Enrollment status was not updated.",
        );
      }


      /* ===================================================
         SUCCESS
      =================================================== */

      return {
        success:
          true,

        enrollmentId:
          args.enrollmentId,

        status:
          "APPROVED",
      };
    },
  });


/* =========================================================
   ADMIN: REJECT PAYMENT
========================================================= */

export const rejectPayment =
  mutation({
    args: {
      enrollmentId:
        v.id(
          "courseEnrollments",
        ),

      adminNote:
        v.optional(
          v.string(),
        ),
    },

    handler: async (
      ctx,
      args,
    ) => {

      const enrollment =
        await ctx.db.get(
          args.enrollmentId,
        );


      if (!enrollment) {
        throw new Error(
          "Enrollment not found.",
        );
      }


      const currentStatus =
        String(
          enrollment.status ?? "",
        ).toUpperCase();


      /* ===================================================
         DO NOT REJECT APPROVED PAYMENT
      =================================================== */

      if (
        currentStatus ===
        "APPROVED"
      ) {
        throw new Error(
          "An approved payment cannot be rejected.",
        );
      }


      /* ===================================================
         REJECT
      =================================================== */

      await ctx.db.patch(
        args.enrollmentId,
        {
          status:
            "REJECTED",

          adminNote:
            args.adminNote ??
            "Payment was rejected by Divyajyoti admin.",

          rejectedAt:
            Date.now(),

          updatedAt:
            Date.now(),
        },
      );


      return {
        success:
          true,

        enrollmentId:
          args.enrollmentId,

        status:
          "REJECTED",
      };
    },
  });


/* =========================================================
   ADMIN: RESET TO PENDING
========================================================= */

export const resetToPending =
  mutation({
    args: {
      enrollmentId:
        v.id(
          "courseEnrollments",
        ),
    },

    handler: async (
      ctx,
      args,
    ) => {

      const enrollment =
        await ctx.db.get(
          args.enrollmentId,
        );


      if (!enrollment) {
        throw new Error(
          "Enrollment not found.",
        );
      }


      await ctx.db.patch(
        args.enrollmentId,
        {
          status:
            "PENDING",

          approvedAt:
            undefined,

          approvedBy:
            undefined,

          paidAt:
            undefined,

          rejectedAt:
            undefined,

          updatedAt:
            Date.now(),
        },
      );


      return {
        success:
          true,

        enrollmentId:
          args.enrollmentId,

        status:
          "PENDING",
      };
    },
  });