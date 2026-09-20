import {
  mutation,
  query,
} from "./_generated/server";

import { v } from "convex/values";

import {
  normalizePhone,
  sha256,
} from "./utils";

// =========================================================
// LOGIN
// =========================================================

export const login = mutation({
  args: {
    phone: v.string(),
    password: v.string(),
  },

  handler: async (ctx, args) => {
    const phone = normalizePhone(
      args.phone,
    );

    const student = await ctx.db
      .query("students")
      .withIndex("by_phone", (q) =>
        q.eq("phone", phone),
      )
      .unique();

    if (!student) {
      throw new Error(
        "Invalid mobile number or password.",
      );
    }

    if (student.status !== "ACTIVE") {
      throw new Error(
        "Your student account is not active.",
      );
    }

    const passwordHash = await sha256(
      args.password,
    );

    if (
      passwordHash !==
      student.passwordHash
    ) {
      throw new Error(
        "Invalid mobile number or password.",
      );
    }

    const rawToken =
      `${crypto.randomUUID()}-${crypto.randomUUID()}`;

    const tokenHash =
      await sha256(rawToken);

    await ctx.db.insert(
      "studentSessions",
      {
        studentId: student._id,

        tokenHash,

        expiresAt:
          Date.now() +
          1000 *
            60 *
            60 *
            24 *
            30,

        createdAt: Date.now(),
      },
    );

    return {
      token: rawToken,
      studentId: student._id,
      name: student.name,
      phone: student.phone,
    };
  },
});

// =========================================================
// SESSION
// =========================================================

export const getSession = query({
  args: {
    token: v.string(),
  },

  handler: async (ctx, args) => {
    const tokenHash =
      await sha256(args.token);

    const session = await ctx.db
      .query("studentSessions")
      .withIndex(
        "by_tokenHash",
        (q) =>
          q.eq(
            "tokenHash",
            tokenHash,
          ),
      )
      .unique();

    if (!session) {
      return null;
    }

    if (
      session.expiresAt <
      Date.now()
    ) {
      return null;
    }

    const student =
      await ctx.db.get(
        session.studentId,
      );

    if (!student) {
      return null;
    }

    return {
      id: student._id,
      name: student.name,
      phone: student.phone,
      email: student.email,
      status: student.status,
    };
  },
});

// =========================================================
// MY COURSES
// =========================================================

export const getMyCourses = query({
  args: {
    token: v.string(),
  },

  handler: async (ctx, args) => {
    const tokenHash =
      await sha256(args.token);

    const session = await ctx.db
      .query("studentSessions")
      .withIndex(
        "by_tokenHash",
        (q) =>
          q.eq(
            "tokenHash",
            tokenHash,
          ),
      )
      .unique();

    if (!session) {
      throw new Error(
        "Unauthorized.",
      );
    }

    if (
      session.expiresAt <
      Date.now()
    ) {
      throw new Error(
        "Session expired.",
      );
    }

    const student =
      await ctx.db.get(
        session.studentId,
      );

    if (!student) {
      throw new Error(
        "Student not found.",
      );
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
              student.phone,
            ),
        )
        .collect();

    return enrollments.filter(
      (item) =>
        item.status ===
        "APPROVED",
    );
  },
});

// =========================================================
// COURSE MATERIALS
// =========================================================

export const getCourseMaterials =
  query({
    args: {
      token: v.string(),
      courseSlug: v.string(),
    },

    handler: async (
      ctx,
      args,
    ) => {
      const tokenHash =
        await sha256(
          args.token,
        );

      const session =
        await ctx.db
          .query(
            "studentSessions",
          )
          .withIndex(
            "by_tokenHash",
            (q) =>
              q.eq(
                "tokenHash",
                tokenHash,
              ),
          )
          .unique();

      if (!session) {
        throw new Error(
          "Unauthorized.",
        );
      }

      if (
        session.expiresAt <
        Date.now()
      ) {
        throw new Error(
          "Session expired.",
        );
      }

      const student =
        await ctx.db.get(
          session.studentId,
        );

      if (!student) {
        throw new Error(
          "Student not found.",
        );
      }

      const enrollments =
        await ctx.db
          .query(
            "courseEnrollments",
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

      const approved =
        enrollments.some(
          (enrollment) =>
            enrollment.status ===
              "APPROVED" &&
            normalizePhone(
              enrollment.phone,
            ) ===
              normalizePhone(
                student.phone,
              ),
        );

      if (!approved) {
        throw new Error(
          "You do not have access to this course.",
        );
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

      return materials
        .filter(
          (item) =>
            item.status ===
            "PUBLISHED",
        )
        .sort(
          (a, b) =>
            a.sortOrder -
            b.sortOrder,
        );
    },
  });

// =========================================================
// LOGOUT
// =========================================================

export const logout = mutation({
  args: {
    token: v.string(),
  },

  handler: async (
    ctx,
    args,
  ) => {
    const tokenHash =
      await sha256(
        args.token,
      );

    const session =
      await ctx.db
        .query(
          "studentSessions",
        )
        .withIndex(
          "by_tokenHash",
          (q) =>
            q.eq(
              "tokenHash",
              tokenHash,
            ),
        )
        .unique();

    if (session) {
      await ctx.db.delete(
        session._id,
      );
    }

    return true;
  },
});