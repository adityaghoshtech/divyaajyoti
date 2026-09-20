"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  GraduationCap,
  UserRound,
} from "lucide-react";

import { api } from "../../../../convex/_generated/api";

export default function CourseBuyPage() {
  const params = useParams();

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";

  /*
   * IMPORTANT:
   * Do not call the Convex query until we actually have
   * the course slug.
   */
  const course = useQuery(
    api.courses.bySlug,
    slug
      ? {
          slug,
        }
      : "skip",
  );


  /* =========================================================
     NO SLUG
  ========================================================= */

  if (!slug) {
    return (
      <main className="course-buy-page course-buy-page-offset">
        <section className="course-buy-status">
          <div className="course-buy-status-card">
            <h1>Course not found</h1>

            <p>
              We could not determine which course you want
              to purchase.
            </p>

            <Link
              href="/education"
              className="course-buy-primary-button"
            >
              Browse courses
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    );
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (course === undefined) {
    return (
      <main className="course-buy-page course-buy-page-offset">
        <section className="course-buy-status">
          <div className="course-buy-loading">

            <div className="course-buy-spinner" />

            <p>
              Loading course...
            </p>

          </div>
        </section>
      </main>
    );
  }


  /* =========================================================
     COURSE DOES NOT EXIST
  ========================================================= */

  if (course === null) {
    return (
      <main className="course-buy-page course-buy-page-offset">
        <section className="course-buy-status">
          <div className="course-buy-status-card">

            <div className="course-buy-status-label">
              DIVYAJYOTI • LEARNING
            </div>

            <h1>
              Course not found.
            </h1>

            <p>
              The course you are looking for is no longer
              available or the course URL is incorrect.
            </p>

            <Link
              href="/education"
              className="course-buy-primary-button"
            >
              Browse all courses
              <ArrowRight size={18} />
            </Link>

          </div>
        </section>
      </main>
    );
  }


  /* =========================================================
     COURSE DATA
  ========================================================= */

  const lessonCount =
    Array.isArray(course.lessons)
      ? course.lessons.length
      : Number(course.lessons || 0);

  const price =
    typeof course.price === "number"
      ? course.price
      : 0;

  const courseImage =
    course.image ||
    (course.images &&
    course.images.length > 0
      ? course.images[0]
      : "");


  /*
   * Show only a small curriculum preview.
   */
  const syllabus =
    Array.isArray(course.syllabus)
      ? course.syllabus
      : [];

  const syllabusPreview =
    syllabus.slice(0, 6);


  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <main className="course-buy-page course-buy-page-offset">

      <div className="course-buy-container">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <section className="course-buy-main">

          {/* HERO IMAGE */}
          <div className="course-buy-hero">

            {courseImage ? (
              <img
                src={courseImage}
                alt={course.title}
                className="course-buy-hero-image"
              />
            ) : (
              <div className="course-buy-hero-placeholder">
                <div>
                  DIVYAJYOTI • LEARNING
                </div>
              </div>
            )}

            <div className="course-buy-hero-overlay" />

            <div className="course-buy-hero-label">
              DIVYAJYOTI • LEARNING
            </div>

          </div>


          {/* COURSE TITLE */}

          <div className="course-buy-content">

            <div className="course-buy-eyebrow">
              COURSE ENROLLMENT
            </div>

            <h1>
              Enrol in {course.title}
            </h1>

            <p className="course-buy-description">
              {course.description}
            </p>


            {/* COURSE DETAILS */}

            <div className="course-buy-details">

              <div className="course-buy-detail">

                <BookOpen size={20} />

                <div>
                  <span>
                    Lessons
                  </span>

                  <strong>
                    {lessonCount}
                  </strong>
                </div>

              </div>


              <div className="course-buy-detail">

                <Clock3 size={20} />

                <div>
                  <span>
                    Duration
                  </span>

                  <strong>
                    {course.duration}
                  </strong>
                </div>

              </div>


              <div className="course-buy-detail">

                <GraduationCap size={20} />

                <div>
                  <span>
                    Level
                  </span>

                  <strong>
                    {course.level}
                  </strong>
                </div>

              </div>


              <div className="course-buy-detail">

                <UserRound size={20} />

                <div>
                  <span>
                    Instructor
                  </span>

                  <strong>
                    {course.instructor}
                  </strong>
                </div>

              </div>

            </div>


            {/* =================================================
                WHAT YOU GET
            ================================================= */}

            <div className="course-buy-section">

              <div className="course-buy-section-eyebrow">
                WHAT YOU GET
              </div>

              <h2>
                Everything you need to learn.
              </h2>

              <div className="course-buy-benefits">

                <div className="course-buy-benefit">
                  <span>
                    <Check size={15} />
                  </span>

                  <p>
                    Structured learning designed for
                    practical understanding.
                  </p>
                </div>


                <div className="course-buy-benefit">
                  <span>
                    <Check size={15} />
                  </span>

                  <p>
                    Access to course lessons after
                    payment approval.
                  </p>
                </div>


                <div className="course-buy-benefit">
                  <span>
                    <Check size={15} />
                  </span>

                  <p>
                    Course notes and learning materials.
                  </p>
                </div>


                <div className="course-buy-benefit">
                  <span>
                    <Check size={15} />
                  </span>

                  <p>
                    Learn at your own pace from your
                    private course area.
                  </p>
                </div>

              </div>

            </div>


            {/* =================================================
                CURRICULUM
            ================================================= */}

            {syllabusPreview.length > 0 && (
              <div className="course-buy-section">

                <div className="course-buy-section-eyebrow">
                  CURRICULUM
                </div>

                <h2>
                  What you will learn.
                </h2>

                <div className="course-buy-curriculum">

                  {syllabusPreview.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="course-buy-curriculum-item"
                      >

                        <span>
                          {String(
                            index + 1,
                          ).padStart(2, "0")}
                        </span>

                        <p>
                          {item}
                        </p>

                      </div>
                    ),
                  )}

                </div>

                {syllabus.length > 6 && (
                  <p className="course-buy-more">
                    + {syllabus.length - 6} more
                    curriculum topics
                  </p>
                )}

              </div>
            )}

          </div>

        </section>


        {/* ===================================================
            RIGHT SIDE PURCHASE CARD
        =================================================== */}

        <aside className="course-buy-sidebar">

          <div className="course-buy-card">

            <div className="course-buy-card-eyebrow">
              ENROLL NOW
            </div>

            <h2>
              Start learning
              <br />
              today.
            </h2>

            <p>
              Complete your enrollment to continue
              to checkout.
            </p>


            <div className="course-buy-card-divider" />


            <div className="course-buy-price-label">
              Course Fee
            </div>

            <div className="course-buy-price">
              ₹
              {price.toLocaleString(
                "en-IN",
              )}
            </div>


            <div className="course-buy-card-divider" />


            {/* COURSE STATS */}

            <div className="course-buy-stats">

              <div>
                <BookOpen size={18} />

                <span>
                  {lessonCount} lessons
                </span>
              </div>


              <div>
                <Clock3 size={18} />

                <span>
                  {course.duration}
                </span>
              </div>


              <div>
                <GraduationCap size={18} />

                <span>
                  {course.level}
                </span>
              </div>


              <div>
                <UserRound size={18} />

                <span>
                  {course.instructor}
                </span>
              </div>

            </div>


            {/* =================================================
                CHECKOUT BUTTON
            ================================================= */}

            <Link
              href={`/education/${course.slug}/checkout`}
              className="course-buy-primary-button"
            >

              <span>
                Continue to Checkout
              </span>

              <ArrowRight size={19} />

            </Link>


            <p className="course-buy-secure-note">
              Your payment details are reviewed
              securely by the Divyajyoti team.
            </p>

          </div>

        </aside>

      </div>

    </main>
  );
}