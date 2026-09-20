"use client";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  UserRound,
} from "lucide-react";

import { useParams } from "next/navigation";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function CourseDetailPage() {
  const params = useParams();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : "";

  const course = useQuery(
    api.courses.bySlug,
    slug
      ? { slug }
      : "skip",
  );

  if (course === undefined) {
    return (
      <main className="course-detail-page">
        <section className="course-detail-hero">
          <div className="education-container">
            <div className="course-detail-loading">
              Loading course...
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (course === null) {
    return (
      <main className="course-detail-page">
        <section className="course-detail-hero">
          <div className="education-container">

            <Link
              href="/education"
              className="course-back"
            >
              <ArrowLeft size={16} />
              Back to courses
            </Link>

            <div className="course-not-found">

              <div className="eyebrow">
                LEARNING
              </div>

              <h1>
                Course not found.
              </h1>

              <p>
                This course may have been
                removed or the course link
                is incorrect.
              </p>

              <Link
                href="/education"
                className="course-detail-button"
              >
                View all courses
                <ArrowUpRight size={16} />
              </Link>

            </div>
          </div>
        </section>
      </main>
    );
  }

  const mainImage =
    course.image ||
    (
      Array.isArray(course.images)
        ? course.images[0]
        : ""
    ) ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85";

  const lessonCount =
  Array.isArray(course.lessons)
    ? course.lessons.length
    : Number(course.lessons || 0);

  const price =
    typeof course.price === "number"
      ? course.price
      : 0;

  const syllabus =
    Array.isArray(course.syllabus)
      ? course.syllabus
      : [];

  const gallery =
    Array.isArray(course.images)
      ? course.images.filter(Boolean)
      : [];

  return (
    <main className="course-detail-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="course-detail-hero">

        <div className="education-container">

          <Link
            href="/education"
            className="course-back"
          >
            <ArrowLeft size={16} />
            Back to courses
          </Link>

          <div className="course-detail-grid">

            <div className="course-detail-copy">

              <div className="eyebrow">
                {course.category ||
                  "DIVYAJYOTI LEARNING"}
              </div>

              <span className="course-detail-level">
                {course.level}
              </span>

              <h1>
                {course.title}
              </h1>

              <p className="course-detail-description">
                {course.description}
              </p>

              <div className="course-detail-stats">

                <span>
                  <Clock3 size={16} />
                  {course.duration}
                </span>

                <span>
                  <BookOpen size={16} />
                  {lessonCount} lessons
                </span>

                <span>
                  <UserRound size={16} />
                  {course.instructor}
                </span>

              </div>

              <div className="course-detail-price">

                <strong>
                  ₹{price.toLocaleString("en-IN")}
                </strong>

                <span>
                  Course fee
                </span>

              </div>

              <div className="course-detail-actions">

                <Link
                  href={`/education/${course.slug}/buy`}
                  className="course-detail-button"
                >
                  Buy This Course
                  <ArrowUpRight size={17} />
                </Link>

                <Link
                  href="#curriculum"
                  className="course-secondary-button"
                >
                  View syllabus
                </Link>

              </div>

            </div>

            <div className="course-detail-visual">

              <div
                className="course-detail-image"
                style={{
                  backgroundImage:
                    `url(${mainImage})`,
                }}
              />

              <div className="course-detail-image-note">

                <GraduationCap size={17} />

                <div>
                  <strong>
                    Divyajyoti Learning
                  </strong>

                  <span>
                    Practical knowledge.
                    Guided learning.
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>

      </section>

      {/* =====================================================
          COURSE OVERVIEW
      ===================================================== */}

      <section className="course-detail-section">

        <div className="education-container">

          <div className="course-content-grid">

            <div>

              <div className="eyebrow">
                COURSE OVERVIEW
              </div>

              <h2>
                Learn with a clear,
                practical structure.
              </h2>

              <p className="course-long-description">
                {course.description}
              </p>

            </div>

            <div className="course-info-card">

              <div className="course-info-row">
                <span>Course</span>
                <strong>
                  {course.title}
                </strong>
              </div>

              <div className="course-info-row">
                <span>Category</span>
                <strong>
                  {course.category || "Learning"}
                </strong>
              </div>

              <div className="course-info-row">
                <span>Level</span>
                <strong>
                  {course.level}
                </strong>
              </div>

              <div className="course-info-row">
                <span>Duration</span>
                <strong>
                  {course.duration}
                </strong>
              </div>

              <div className="course-info-row">
                <span>Lessons</span>
                <strong>
                  {lessonCount}
                </strong>
              </div>

              <div className="course-info-row">
                <span>Instructor</span>
                <strong>
                  {course.instructor}
                </strong>
              </div>

              <div className="course-info-row course-fee-row">
                <span>Course Fee</span>
                <strong>
                  ₹{price.toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WHAT YOU WILL LEARN
      ===================================================== */}

      {syllabus.length > 0 && (
        <section
          id="curriculum"
          className="course-curriculum-section"
        >

          <div className="education-container">

            <div className="course-section-heading">

              <div>

                <div className="eyebrow">
                  CURRICULUM
                </div>

                <h2>
                  What you will learn.
                </h2>

              </div>

              <p>
                A structured syllabus designed
                to help you build practical
                understanding step by step.
              </p>

            </div>

            <div className="course-syllabus">

              {syllabus.map(
                (lesson, index) => (

                  <div
                    key={`${lesson}-${index}`}
                    className="course-syllabus-item"
                  >

                    <span className="course-syllabus-number">
                      {String(
                        index + 1,
                      ).padStart(2, "0")}
                    </span>

                    <div>
                      <h3>
                        {lesson}
                      </h3>

                      <p>
                        Module {index + 1}
                      </p>
                    </div>

                                       <CheckCircle2 size={18} />

                  </div>

                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          INSTRUCTOR
      ===================================================== */}

      <section className="course-instructor-section">

        <div className="education-container">

          <div className="course-instructor-card">

            <div className="course-instructor-icon">
              <UserRound size={28} />
            </div>

            <div>

              <div className="eyebrow">
                YOUR INSTRUCTOR
              </div>

              <h2>
                {course.instructor}
              </h2>

              <p>
                Learn through structured
                guidance, practical examples
                and focused lessons.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          GALLERY
      ===================================================== */}

      {gallery.length > 0 && (
        <section className="course-gallery-section">

          <div className="education-container">

            <div className="eyebrow">
              COURSE GALLERY
            </div>

            <h2>
              Inside the learning experience.
            </h2>

            <div className="course-gallery-grid">

              {gallery.map(
                (
                  image,
                  index
                ) => (

                  <div
                    key={`${image}-${index}`}
                    className="course-gallery-image"
                    style={{
                      backgroundImage:
                        `url(${image})`,
                    }}
                  />

                )
              )}

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="course-final-cta">

        <div className="education-container">

          <div>

            <div className="eyebrow">
              START LEARNING
            </div>

            <h2>
              Ready to begin
              your learning journey?
            </h2>

            <p>
              Join this course and build
              practical knowledge with
              Divyajyoti.
            </p>

          </div>

          <div className="course-final-cta-right">

            <strong>
              ₹{price.toLocaleString("en-IN")}
            </strong>

            <Link
              href={`/education/${course.slug}/enroll`}
              className="course-detail-button light"
            >
              Enrol Now
              <ArrowUpRight size={17} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}