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

export const generateUploadUrl = mutation({
  args: {},

  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});


/* =========================================================
   SUBMIT PAYMENT
========================================================= */

export const submitPayment = mutation({
  args: {
    courseSlug: v.string(),
    courseTitle: v.string(),

    name: v.string(),
    email: v.string(),
    phone: v.string(),

    amount: v.number(),

    paymentReference: v.string(),

    paymentProofStorageId:
      v.optional(
        v.id("_storage"),
      ),
  },

  handler: async (ctx, args) => {
    const name =
      args.name.trim();

    const email =
      args.email
        .trim()
        .toLowerCase();

    const phone =
      normalizePhone(args.phone);

    const paymentReference =
      args.paymentReference.trim();

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

    if (paymentReference.length < 4) {
      throw new Error(
        "Please enter a valid payment reference / UTR.",
      );
    }

    if (args.amount < 0) {
      throw new Error(
        "Invalid payment amount.",
      );
    }


    /* =====================================================
       FIND ONLY THIS PHONE
    ===================================================== */

    const enrollments =
      await ctx.db
        .query("courseEnrollments")
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
       FIND ONLY THIS PHONE + THIS COURSE
    ===================================================== */

    const sameCourse =
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


    /* =====================================================
       ALREADY APPROVED
    ===================================================== */

    const approved =
      sameCourse.find(
        (item) =>
          String(
            item.status ?? "",
          ).toUpperCase() ===
          "APPROVED",
      );

    if (approved) {
      return {
        enrollmentId:
          approved._id,

        status:
          "APPROVED",
      };
    }


    /* =====================================================
       ALREADY PENDING
    ===================================================== */

    const pending =
      sameCourse.find(
        (item) =>
          String(
            item.status ?? "",
          ).toUpperCase() ===
          "PENDING",
      );

    if (pending) {
      return {
        enrollmentId:
          pending._id,

        status:
          "PENDING",
      };
    }


    /* =====================================================
       PAYMENT PROOF URL
    ===================================================== */

    let paymentProofUrl:
      | string
      | undefined;

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

       IMPORTANT:

       Every phone can buy the same course.

       Example:

       9876543123 + predictive-astrology
       9123456789 + predictive-astrology

       are two completely different enrollments.
    ===================================================== */

    const now =
      Date.now();

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
            now,

          updatedAt:
            now,
        },
      );




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

export const getEnrollment = query({
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
   MY COURSES
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

      const wanted =
        args.status.toUpperCase();

      
      return enrollments.filter(
        (item) =>
          String(
            item.status ?? "",
          ).toUpperCase() ===
          wanted,
      );
    },
  });


/* =========================================================
   ADMIN: APPROVE
========================================================= */

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
          "This payment was rejected. Move it to pending before approving.",
        );
      }

      const now =
        Date.now();

      
      await ctx.db.patch(
        args.enrollmentId,
        {
          status:
            "APPROVED",

          adminNote:
            args.adminNote?.trim() ||
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



      return {
        success: true,

        enrollmentId:
          args.enrollmentId,

        status:
          "APPROVED",
      };
    },
  });


/* =========================================================
   ADMIN: REJECT
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




      await ctx.db.patch(
        args.enrollmentId,
        {
          status:
            "REJECTED",

          adminNote:
            args.adminNote?.trim() ||
            "Payment was rejected by Divyajyoti admin.",

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
        success: true,

        enrollmentId:
          args.enrollmentId,

        status:
          "PENDING",
      };
    },
  });