"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Clock3,
  Sparkles,
} from "lucide-react";

import {
  ConvexProvider,
  ConvexReactClient,
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is missing from .env.local"
  );
}

const convex = new ConvexReactClient(convexUrl);

type Course = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  duration: string;
  level: string;
  price?: number;
  description: string;
  instructor: string;
  lessons: number | number[];
  image?: string;
  images?: string[];
  syllabus?: string[];
  status: string;
};

export default function Education() {
  return (
    <ConvexProvider client={convex}>
      <EducationContent />
    </ConvexProvider>
  );
}

function EducationContent() {
  const courses = useQuery(api.courses.list, {});

  /*
   * While Convex is loading
   */
  if (courses === undefined) {
    return (
      <main className="education-page">
        <div className="education-container">
          <div
            style={{
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "#58708d",
            }}
          >
            Loading courses...
          </div>
        </div>
      </main>
    );
  }

  /*
   * Only published courses should appear
   * on the public website.
   */
  const publishedCourses: Course[] = courses
    .filter((course) => course.status === "published")
    .map((course) => ({
      ...course,
      category: course.category || "ASTROLOGY",
      duration: course.duration || "",
      level: course.level || "Beginner",
      price: course.price ?? 0,
      lessons: course.lessons,
      image:
        course.image ||
        course.images?.[0] ||
        getFallbackImage(course.category),
    }));

  /*
   * ASTROLOGY SECTION
   *
   * We include VASTU here because your
   * existing website design shows Vastu Basics
   * inside the first learning section.
   */
  const astrologyCourses = publishedCourses.filter((course) => {
    const category = normalizeCategory(course.category);

    return (
      category === "ASTROLOGY" ||
      category === "VASTU"
    );
  });

  /*
   * REAL ESTATE SECTION
   */
  const realEstateCourses = publishedCourses.filter((course) => {
    const category = normalizeCategory(course.category);

    return category === "REAL_ESTATE";
  });

  return (
    <main className="education-page">

      {/* =====================================================
          ASTROLOGY
      ===================================================== */}

      <section
        className="education-course-section"
        id="astrology-courses"
      >
        <div className="education-container">

          <div className="course-section-heading">

            <div>
              <div className="eyebrow">
                01 / ASTROLOGY
              </div>

              <h1 className="display">
                Astrology learning paths.
              </h1>

              <p className="course-section-subtitle">
                Practical courses to help you understand,
                interpret and apply astrology in real life.
              </p>
            </div>

            <Link
              href="#astrology-courses"
              className="course-view-all"
            >
              View all astrology courses
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="education-course-grid">

            {astrologyCourses.length > 0 ? (
              astrologyCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  icon={<Sparkles size={17} />}
                />
              ))
            ) : (
              <EmptyCourses
                message="No astrology courses are currently published."
              />
            )}

          </div>

        </div>
      </section>


      {/* =====================================================
          REAL ESTATE
      ===================================================== */}

      <section
        className="education-course-section education-realestate"
        id="real-estate-courses"
      >
        <div className="education-container">

          <div className="course-section-heading">

            <div>
              <div className="eyebrow">
                02 / REAL ESTATE
              </div>

              <h2 className="display">
                Real estate learning paths.
              </h2>

              <p className="course-section-subtitle">
                Practical knowledge for better property
                decisions and long-term value.
              </p>
            </div>

            <Link
              href="#real-estate-courses"
              className="course-view-all"
            >
              View all real estate courses
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="education-course-grid">

            {realEstateCourses.length > 0 ? (
              realEstateCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  icon={<Building2 size={17} />}
                />
              ))
            ) : (
              <EmptyCourses
                message="No real estate courses are currently published."
              />
            )}

          </div>

        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="education-cta">
        <div className="education-container">

          <div className="education-cta-inner">

            <BookOpen size={24} />

            <div>
              <div className="eyebrow">
                LEARN AT YOUR PACE
              </div>

              <h2>
                Choose a course and start building
                practical knowledge.
              </h2>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}


/* =========================================================
   COURSE CARD
========================================================= */

function CourseCard({
  course,
  icon,
}: {
  course: Course;
  icon: React.ReactNode;
}) {
  const lessonCount = getLessonCount(course.lessons);

  return (
    <article className="education-course-card">

      {/* IMAGE */}

      <Link
        href={`/education/${course.slug}`}
        className="education-course-image"
        style={{
          backgroundImage: `url(${course.image})`,
        }}
      >
        <span className="course-level">
          {course.level}
        </span>
      </Link>


      {/* BODY */}

      <div className="education-course-body">

        <div className="course-icon">
          {icon}
        </div>

        <div className="course-category">
          {formatCategory(course.category)}
        </div>

        <Link
          href={`/education/${course.slug}`}
          className="course-title-link"
        >
          <h3>
            {course.title}
          </h3>
        </Link>

        <p>
          {course.description}
        </p>


        {/* COURSE INFO */}

        <div className="education-course-meta">

          <span>
            <Clock3 size={13} />
            {course.duration}
          </span>

          <span>
            <BookOpen size={13} />
            {lessonCount} lessons
          </span>

        </div>


        {/* PRICE */}

        <div className="education-course-footer">

          <strong>
            ₹{course.price?.toLocaleString("en-IN")}
          </strong>

          <Link
            href={`/education/${course.slug}`}
            className="course-view-link"
          >
            View course
            <ArrowRight size={14} />
          </Link>

        </div>

      </div>

    </article>
  );
}


/* =========================================================
   HELPERS
========================================================= */

function getLessonCount(
  lessons: number | number[]
) {
  /*
   * Old courses have:
   * lessons: 24
   *
   * Newer courses may have:
   * lessons: [1, 2, 3, ...]
   */
  if (Array.isArray(lessons)) {
    return lessons.length;
  }

  return lessons;
}


function normalizeCategory(
  category?: string
) {
  if (!category) {
    return "ASTROLOGY";
  }

  const normalized = category
    .trim()
    .toUpperCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");

  if (
    normalized === "REAL_ESTATE" ||
    normalized === "REALESTATE" ||
    normalized === "PROPERTY"
  ) {
    return "REAL_ESTATE";
  }

  if (normalized === "VASTU") {
    return "VASTU";
  }

  return normalized;
}


function formatCategory(
  category?: string
) {
  const normalized = normalizeCategory(category);

  if (normalized === "REAL_ESTATE") {
    return "Real Estate";
  }

  if (normalized === "VASTU") {
    return "Vastu";
  }

  if (normalized === "ASTROLOGY") {
    return "Astrology";
  }

  return category || "Astrology";
}


function getFallbackImage(
  category?: string
) {
  const normalized = normalizeCategory(category);

  if (normalized === "REAL_ESTATE") {
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85";
  }

  if (normalized === "VASTU") {
    return "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85";
  }

  return "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85";
}


function EmptyCourses({
  message,
}: {
  message: string;
}) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        padding: "40px 20px",
        textAlign: "center",
        color: "#58708d",
      }}
    >
      {message}
    </div>
  );
}