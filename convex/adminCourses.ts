import {
  mutation,
  query,
} from "./_generated/server";

import { v } from "convex/values";

import {
  normalizePhone,
} from "./utils";


// =========================================================
// GENERATE PAYMENT UPLOAD URL
// =========================================================

export const generateUploadUrl =
  mutation({
    args: {},

    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
  });


// =========================================================
// SUBMIT PAYMENT
// =========================================================

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

      // ===================================================
      // NORMALIZE DATA
      // ===================================================

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


      // ===================================================
      // VALIDATION
      // ===================================================

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
        paymentReference.length < 4
      ) {
        throw new Error(
          "Please enter a valid payment reference / UTR.",
        );
      }

      if (args.amount < 0) {
        throw new Error(
          "Invalid payment amount.",
        );
      }


      // ===================================================
      // CREATE PAYMENT PROOF URL
      // ===================================================

      let paymentProofUrl:
        | string
        | undefined =
        undefined;


      if (
        args.paymentProofStorageId
      ) {

        const proof =
          await ctx.db.system.get(
            "_storage",
            args.paymentProofStorageId,
          );

        if (!proof) {
          throw new Error(
            "Payment screenshot could not be found.",
          );
        }

        paymentProofUrl =
          (
            await ctx.storage.getUrl(
              args.paymentProofStorageId,
            )
          ) || undefined;
      }


      // ===================================================
      // FIND EXISTING ENROLLMENTS
      // ===================================================

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


      // ===================================================
      // FIND SAME COURSE
      // ===================================================

      const existingEnrollment =
        existing.find(
          (item) =>
            item.courseSlug ===
            args.courseSlug,
        );


      // ===================================================
      // ALREADY APPROVED
      // ===================================================

      if (
        existingEnrollment &&
        String(
          existingEnrollment.status,
        ).toUpperCase() ===
          "APPROVED"
      ) {

        return {
          enrollmentId:
            existingEnrollment._id,

          status:
            "APPROVED",
        };
      }


      // ===================================================
      // EXISTING PENDING PAYMENT
      //
      // IMPORTANT:
      //
      // Instead of returning the old record without
      // updating it, update it with the NEW payment data.
      //
      // This means a new payment attempt will immediately
      // appear in Admin with the latest UTR and screenshot.
      // ===================================================

      if (
        existingEnrollment &&
        String(
          existingEnrollment.status,
        ).toUpperCase() ===
          "PENDING"
      ) {

        await ctx.db.patch(
          existingEnrollment._id,
          {
            name,

            email,

            phone,

            amount:
              args.amount,

            currency:
              "INR",

            paymentReference,

            paymentProofUrl,

            paymentProofStorageId:
              args.paymentProofStorageId,

            status:
              "PENDING",

            /*
             * Clear old approval/rejection information.
             */

            approvedAt:
              undefined,

            approvedBy:
              undefined,

            paidAt:
              undefined,

            rejectedAt:
              undefined,

            adminNote:
              undefined,

            updatedAt:
              Date.now(),
          },
        );


        return {
          enrollmentId:
            existingEnrollment._id,

          status:
            "PENDING",
        };
      }


      // ===================================================
      // EXISTING REJECTED PAYMENT
      //
      // Allow the student to submit again.
      // Reuse the same enrollment instead of creating
      // unnecessary duplicate records.
      // ===================================================

      if (
        existingEnrollment &&
        String(
          existingEnrollment.status,
        ).toUpperCase() ===
          "REJECTED"
      ) {

        await ctx.db.patch(
          existingEnrollment._id,
          {
            name,

            email,

            phone,

            amount:
              args.amount,

            currency:
              "INR",

            paymentReference,

            paymentProofUrl,

            paymentProofStorageId:
              args.paymentProofStorageId,

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

            adminNote:
              undefined,

            updatedAt:
              Date.now(),
          },
        );


        return {
          enrollmentId:
            existingEnrollment._id,

          status:
            "PENDING",
        };
      }


      // ===================================================
      // CREATE BRAND NEW ENROLLMENT
      // ===================================================

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

            paymentReference,

            paymentProofStorageId:
              args.paymentProofStorageId,

            paymentProofUrl,

            status:
              "PENDING",

            createdAt:
              Date.now(),

            updatedAt:
              Date.now(),
          },
        );


      // ===================================================
      // RETURN
      // ===================================================

      return {
        enrollmentId,

        status:
          "PENDING",
      };
    },
  });


// =========================================================
// GET ENROLLMENT
// =========================================================

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


// =========================================================
// GET ENROLLMENT BY PHONE + COURSE
// =========================================================

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

      return (
        enrollments.find(
          (item) =>
            item.courseSlug ===
            args.courseSlug,
        ) || null
      );
    },
  });


// =========================================================
// LIST ALL ENROLLMENTS
// =========================================================

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
        args.status
          .toUpperCase();


      return enrollments.filter(
        (item) =>
          String(
            item.status,
          ).toUpperCase() ===
          wantedStatus,
      );
    },
  });


// =========================================================
// APPROVE PAYMENT
// =========================================================

export const approvePayment =
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


      const status =
        String(
          enrollment.status ?? "",
        ).toUpperCase();


      if (
        status ===
        "APPROVED"
      ) {
        return {
          success: true,

          enrollmentId:
            args.enrollmentId,

          status:
            "APPROVED",
        };
      }


      if (
        status ===
        "REJECTED"
      ) {
        throw new Error(
          "This payment was rejected. Reset it to pending before approving.",
        );
      }


      const now =
        Date.now();


      await ctx.db.patch(
        args.enrollmentId,
        {
          status:
            "APPROVED",

          approvedAt:
            now,

          approvedBy:
            "Divyajyoti Admin",

          paidAt:
            now,

          adminNote:
            args.adminNote?.trim() ||
            "Payment verified by Divyajyoti admin.",

          rejectedAt:
            undefined,

          updatedAt:
            now,
        },
      );


      return {
        success: true,

        enrollmentId:
          args.enrollmentId,

        status:
          "APPROVED",
      };
    },
  });


// =========================================================
// REJECT PAYMENT
// =========================================================

export const rejectPayment =
  mutation({
    args: {
      enrollmentId:
        v.id(
          "courseEnrollments",
        ),

      adminNote:
        v.string(),
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


      const status =
        String(
          enrollment.status ?? "",
        ).toUpperCase();


      if (
        status ===
        "APPROVED"
      ) {
        throw new Error(
          "An approved payment cannot be rejected.",
        );
      }


      const note =
        args.adminNote.trim();


      if (!note) {
        throw new Error(
          "Please provide a rejection reason.",
        );
      }


      await ctx.db.patch(
        args.enrollmentId,
        {
          status:
            "REJECTED",

          adminNote:
            note,

          rejectedAt:
            Date.now(),

          updatedAt:
            Date.now(),
        },
      );


      return {
        success: true,

        enrollmentId:
          args.enrollmentId,

        status:
          "REJECTED",
      };
    },
  });


// =========================================================
// RESET TO PENDING
// =========================================================

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

          adminNote:
            undefined,

          updatedAt:
            Date.now(),
        },
      );


      return {
        success: true,

        enrollmentId:
          args.enrollmentId,

        status:
          "PENDING",
      };
    },
  });