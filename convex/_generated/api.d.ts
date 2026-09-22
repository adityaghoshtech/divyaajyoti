/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as adminCourses from "../adminCourses.js";
import type * as consultations from "../consultations.js";
import type * as courseMaterials from "../courseMaterials.js";
import type * as coursePayments from "../coursePayments.js";
import type * as courses from "../courses.js";
import type * as leads from "../leads.js";
import type * as properties from "../properties.js";
import type * as seedCourses from "../seedCourses.js";
import type * as studentAuth from "../studentAuth.js";
import type * as studentCourses from "../studentCourses.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  adminCourses: typeof adminCourses;
  consultations: typeof consultations;
  courseMaterials: typeof courseMaterials;
  coursePayments: typeof coursePayments;
  courses: typeof courses;
  leads: typeof leads;
  properties: typeof properties;
  seedCourses: typeof seedCourses;
  studentAuth: typeof studentAuth;
  studentCourses: typeof studentCourses;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
