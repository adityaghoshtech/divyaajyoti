import {
  defineSchema,
  defineTable,
} from "convex/server";

import {
  v,
} from "convex/values";


export default defineSchema({

  // =========================================================
  // PROPERTIES
  // =========================================================

  properties: defineTable({

    title:
      v.string(),

    slug:
      v.string(),

    location:
      v.string(),

    price:
      v.number(),

    type:
      v.string(),

    beds:
      v.number(),

    baths:
      v.number(),

    area:
      v.number(),


    image:
      v.optional(
        v.string(),
      ),

    images:
      v.optional(
        v.array(
          v.string(),
        ),
      ),


    status:
      v.string(),


    propertyId:
      v.optional(
        v.string(),
      ),

    verification:
      v.optional(
        v.string(),
      ),


    floor:
      v.optional(
        v.number(),
      ),

    totalFloors:
      v.optional(
        v.number(),
      ),

    parking:
      v.optional(
        v.string(),
      ),

    furnishing:
      v.optional(
        v.string(),
      ),

    age:
      v.optional(
        v.string(),
      ),

    possession:
      v.optional(
        v.string(),
      ),


    videoUrl:
      v.optional(
        v.string(),
      ),

    brochureUrl:
      v.optional(
        v.string(),
      ),


    overview:
      v.optional(
        v.string(),
      ),

    highlights:
      v.optional(
        v.array(
          v.string(),
        ),
      ),

    keyFeatures:
      v.optional(
        v.array(
          v.string(),
        ),
      ),

    amenities:
      v.optional(
        v.array(
          v.string(),
        ),
      ),


    floorPlanTitle:
      v.optional(
        v.string(),
      ),

    floorPlanArea:
      v.optional(
        v.string(),
      ),

    floorPlanPrice:
      v.optional(
        v.number(),
      ),

    floorPlanImage:
      v.optional(
        v.string(),
      ),


    nearbyPlaces:
      v.optional(
        v.array(
          v.string(),
        ),
      ),


    vastuTitle:
      v.optional(
        v.string(),
      ),

    vastuDescription:
      v.optional(
        v.string(),
      ),


    walkthroughTitle:
      v.optional(
        v.string(),
      ),

    walkthroughDescription:
      v.optional(
        v.string(),
      ),


    contactHeading:
      v.optional(
        v.string(),
      ),

    contactDescription:
      v.optional(
        v.string(),
      ),


    updatedAt:
      v.optional(
        v.number(),
      ),

  })
    .index(
      "by_slug",
      ["slug"],
    )
    .index(
      "by_status",
      ["status"],
    )
    .index(
      "by_type",
      ["type"],
    ),


  // =========================================================
  // PROPERTY CATEGORIES
  // =========================================================

  propertyCategories: defineTable({

    name:
      v.string(),

    slug:
      v.string(),

    status:
      v.string(),

    updatedAt:
      v.optional(
        v.number(),
      ),

  }).index(
    "by_slug",
    ["slug"],
  ),


  // =========================================================
  // LEADS / CRM
  // =========================================================

  leads: defineTable({

    name:
      v.string(),

    phone:
      v.string(),

    email:
      v.optional(
        v.string(),
      ),

    source:
      v.string(),

    message:
      v.optional(
        v.string(),
      ),

    status:
      v.string(),

    interest:
      v.optional(
        v.string(),
      ),

    assignedTo:
      v.optional(
        v.string(),
      ),

    priority:
      v.optional(
        v.string(),
      ),

    followUpAt:
      v.optional(
        v.number(),
      ),

    lastContactedAt:
      v.optional(
        v.number(),
      ),

    notes:
      v.optional(
        v.string(),
      ),

    createdAt:
      v.number(),

    updatedAt:
      v.optional(
        v.number(),
      ),

  })
    .index(
      "by_status",
      ["status"],
    )
    .index(
      "by_source",
      ["source"],
    )
    .index(
      "by_follow_up",
      ["followUpAt"],
    ),


  // =========================================================
  // LEAD ACTIVITIES
  // =========================================================

  leadActivities: defineTable({

    leadId:
      v.id(
        "leads",
      ),

    type:
      v.string(),

    note:
      v.string(),

    createdAt:
      v.number(),

    createdBy:
      v.optional(
        v.string(),
      ),

  }).index(
    "by_lead",
    ["leadId"],
  ),


  // =========================================================
  // SITE VISITS
  // =========================================================

  siteVisits: defineTable({

    propertyId:
      v.id(
        "properties",
      ),

    name:
      v.string(),

    phone:
      v.string(),

    email:
      v.optional(
        v.string(),
      ),

    preferredDate:
      v.string(),

    status:
      v.string(),

    notes:
      v.optional(
        v.string(),
      ),

    createdAt:
      v.number(),

    updatedAt:
      v.optional(
        v.number(),
      ),

  }).index(
    "by_status",
    ["status"],
  ),


  // =========================================================
  // CONSULTATIONS
  // =========================================================

  consultations: defineTable({

    name:
      v.string(),

    phone:
      v.string(),

    email:
      v.optional(
        v.string(),
      ),

    service:
      v.string(),

    message:
      v.optional(
        v.string(),
      ),

    preferredDate:
      v.optional(
        v.number(),
      ),

    preferredTime:
      v.optional(
        v.string(),
      ),

    status:
      v.string(),

    notes:
      v.optional(
        v.string(),
      ),

    createdAt:
      v.number(),

    updatedAt:
      v.optional(
        v.number(),
      ),

  }).index(
    "by_status",
    ["status"],
  ),


  // =========================================================
  // COURSES
  // =========================================================

  courses: defineTable({

    title:
      v.string(),

    slug:
      v.string(),

    category:
      v.optional(
        v.string(),
      ),

    duration:
      v.string(),

    level:
      v.string(),

    status:
      v.string(),

    price:
      v.optional(
        v.number(),
      ),

    description:
      v.string(),

    instructor:
      v.string(),


    /*
     * Existing records may contain:
     *
     * lessons: 24
     *
     * New records may contain:
     *
     * lessons: [1, 2, 3]
     *
     * Both are supported.
     */

    lessons:
      v.union(
        v.number(),
        v.array(
          v.number(),
        ),
      ),


    image:
      v.optional(
        v.string(),
      ),

    images:
      v.optional(
        v.array(
          v.string(),
        ),
      ),

    syllabus:
      v.optional(
        v.array(
          v.string(),
        ),
      ),

    updatedAt:
      v.optional(
        v.number(),
      ),

  }).index(
    "by_slug",
    ["slug"],
  ),


  // =========================================================
  // COURSE ENROLLMENTS
  //
  // PAYMENT FLOW
  //
  // PENDING
  //     ↓
  // APPROVED
  //
  // OR
  //
  // PENDING
  //     ↓
  // REJECTED
  // =========================================================

  // =========================================================
// COURSE ENROLLMENTS
// =========================================================

courseEnrollments: defineTable({

  // -------------------------------------------------------
  // COURSE
  // -------------------------------------------------------

  courseSlug:
    v.string(),

  courseTitle:
    v.string(),


  // -------------------------------------------------------
  // STUDENT
  // -------------------------------------------------------

  name:
    v.string(),

  email:
    v.string(),

  phone:
    v.string(),


  // -------------------------------------------------------
  // PAYMENT
  // -------------------------------------------------------

  amount:
    v.number(),

  currency:
    v.string(),


  // -------------------------------------------------------
  // MANUAL PAYMENT REFERENCE / UTR
  // -------------------------------------------------------

  paymentReference:
    v.string(),


  // -------------------------------------------------------
  // PAYMENT PROOF
  // -------------------------------------------------------

  paymentProofStorageId:
    v.optional(
      v.id("_storage"),
    ),

  paymentProofUrl:
    v.optional(
      v.string(),
    ),


  // -------------------------------------------------------
  // RAZORPAY LEGACY FIELDS
  //
  // IMPORTANT:
  // Existing documents already contain these fields.
  // Keep them optional so Convex accepts old records.
  // -------------------------------------------------------

  razorpayOrderId:
    v.optional(
      v.string(),
    ),

  razorpayPaymentId:
    v.optional(
      v.string(),
    ),


  // -------------------------------------------------------
  // ADMIN
  // -------------------------------------------------------

  adminNote:
    v.optional(
      v.string(),
    ),


  // -------------------------------------------------------
  // APPROVAL
  // -------------------------------------------------------

  approvedAt:
    v.optional(
      v.number(),
    ),

  approvedBy:
    v.optional(
      v.string(),
    ),


  // -------------------------------------------------------
  // REJECTION
  // -------------------------------------------------------

  rejectedAt:
    v.optional(
      v.number(),
    ),


  // -------------------------------------------------------
  // PAYMENT COMPLETION
  // -------------------------------------------------------

  paidAt:
    v.optional(
      v.number(),
    ),


  // -------------------------------------------------------
  // STATUS
  //
  // PENDING
  // APPROVED
  // REJECTED
  // -------------------------------------------------------

  status:
    v.string(),


  // -------------------------------------------------------
  // TIMESTAMPS
  // -------------------------------------------------------

  createdAt:
    v.number(),

  updatedAt:
    v.optional(
      v.number(),
    ),

})
  .index(
    "by_phone",
    ["phone"],
  )

  .index(
    "by_email",
    ["email"],
  )

  .index(
    "by_course",
    ["courseSlug"],
  )

  .index(
    "by_status",
    ["status"],
  ),


  // =========================================================
  // PAYMENTS
  // =========================================================

  payments: defineTable({

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


    paymentId:
      v.optional(
        v.string(),
      ),

    razorpayOrderId:
      v.optional(
        v.string(),
      ),

    razorpayPaymentId:
      v.optional(
        v.string(),
      ),


    paymentReference:
      v.optional(
        v.string(),
      ),


    status:
      v.string(),


    createdAt:
      v.number(),

    updatedAt:
      v.optional(
        v.number(),
      ),

  }).index(
    "by_status",
    ["status"],
  ),


  // =========================================================
  // STUDENTS
  // =========================================================

  students: defineTable({

    name:
      v.string(),

    phone:
      v.string(),

    email:
      v.optional(
        v.string(),
      ),


    /*
     * We never store the plain password.
     *
     * Store a password hash instead.
     */

    passwordHash:
      v.string(),


    /*
     * ACTIVE
     *
     * BLOCKED
     */

    status:
      v.string(),


    createdAt:
      v.number(),

    updatedAt:
      v.optional(
        v.number(),
      ),

  }).index(
    "by_phone",
    ["phone"],
  ),


  // =========================================================
  // STUDENT SESSIONS
  // =========================================================

  studentSessions: defineTable({

    studentId:
      v.id(
        "students",
      ),

    tokenHash:
      v.string(),

    expiresAt:
      v.number(),

    createdAt:
      v.number(),

  })

    .index(
      "by_tokenHash",
      ["tokenHash"],
    )

    .index(
      "by_student",
      ["studentId"],
    ),


  // =========================================================
  // COURSE MATERIALS
  // =========================================================

  courseMaterials: defineTable({

    courseSlug:
      v.string(),

    title:
      v.string(),


    /*
     * VIDEO
     * PDF
     * NOTE
     * LINK
     * RESOURCE
     */

    type:
      v.string(),


    description:
      v.optional(
        v.string(),
      ),


    /*
     * External URL
     */

    url:
      v.optional(
        v.string(),
      ),


    /*
     * Convex Storage file.
     *
     * Kept as string for compatibility with your
     * existing records.
     */

    storageId:
      v.optional(
        v.string(),
      ),


    sortOrder:
      v.number(),


    /*
     * PUBLISHED
     * DRAFT
     */

    status:
      v.string(),


    createdAt:
      v.number(),

    updatedAt:
      v.optional(
        v.number(),
      ),

  })

    .index(
      "by_course",
      ["courseSlug"],
    )

    .index(
      "by_status",
      ["status"],
    ),


  // =========================================================
  // EVENTS
  // =========================================================

  events: defineTable({

    title:
      v.string(),

    slug:
      v.string(),

    date:
      v.string(),

    place:
      v.string(),

    description:
      v.string(),


    image:
      v.optional(
        v.string(),
      ),

    images:
      v.optional(
        v.array(
          v.string(),
        ),
      ),


    status:
      v.string(),

    updatedAt:
      v.optional(
        v.number(),
      ),

  }).index(
    "by_slug",
    ["slug"],
  ),

});