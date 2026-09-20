"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BookOpen,
  Lock,
  PlayCircle,
} from "lucide-react";

import {
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";

export default function LearnCoursePage() {
  const params = useParams();

  const slug = String(
    params.slug ?? "",
  );

  /*
   * Get the student's enrollment ID
   * saved after payment submission.
   */
  const enrollmentId =
    typeof window !== "undefined"
      ? localStorage.getItem(
          `divyajyoti_enrollment_${slug}`,
        )
      : null;

  const enrollment =
    useQuery(
      api.coursePayments.getEnrollment,
      enrollmentId
        ? {
            enrollmentId:
              enrollmentId as any,
          }
        : "skip",
    );

  const course =
    useQuery(
      api.courses.bySlug,
      {
        slug,
      },
    );

  if (
    enrollment === undefined ||
    course === undefined
  ) {
    return (
      <main className="learn-page">
        <div className="learn-loading">
          Loading your course...
        </div>
      </main>
    );
  }

  /*
   * No enrollment
   */
  if (!enrollment) {
    return (
      <main className="learn-page">
        <div className="learn-locked">
          <Lock size={48} />

          <h1>
            Course access required
          </h1>

          <p>
            Please complete enrollment
            before accessing this course.
          </p>

          <Link
            href={`/education/${slug}/buy`}
            className="learn-button"
          >
            Enroll Now
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Payment not approved
   */
  if (
    String(
      enrollment.status,
    ).toUpperCase() !== "APPROVED"
  ) {
    return (
      <main className="learn-page">
        <div className="learn-locked">
          <Lock size={48} />

          <h1>
            Course is locked
          </h1>

          <p>
            Your payment is still being
            reviewed.
          </p>

          <Link
            href={`/education/${slug}/payment-status`}
            className="learn-button"
          >
            Check Payment Status
          </Link>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="learn-page">
        <div className="learn-locked">
          <h1>
            Course not found
          </h1>
        </div>
      </main>
    );
  }

  const lessons =
    Array.isArray(course.lessons)
      ? course.lessons
      : [];

  return (
    <main className="learn-page">
      <section className="learn-hero">
        <div className="learn-container">
          <span className="learn-eyebrow">
            MY COURSE
          </span>

          <h1>
            {course.title}
          </h1>

          <p>
            Welcome to your private
            learning area.
          </p>

          <div className="learn-status">
            <span>
              ✓ Payment Approved
            </span>

            <span>
              ✓ Course Access Active
            </span>
          </div>
        </div>
      </section>

      <section className="learn-content">
        <div className="learn-container">
          <div className="learn-header-card">
            <div>
              <span className="learn-label">
                COURSE
              </span>

              <h2>
                {course.title}
              </h2>

              <p>
                {course.description}
              </p>
            </div>

            <BookOpen size={42} />
          </div>

          <div className="learn-section">
            <div className="learn-section-heading">
              <div>
                <span className="learn-label">
                  CURRICULUM
                </span>

                <h2>
                  Start Learning
                </h2>
              </div>
            </div>

            <div className="lesson-list">
              {lessons.length > 0 ? (
                lessons.map(
                  (
                    lesson: any,
                    index: number,
                  ) => (
                    <div
                      className="lesson-card"
                      key={index}
                    >
                      <div className="lesson-number">
                        {index + 1}
                      </div>

                      <div className="lesson-content">
                        <h3>
                          Lesson{" "}
                          {index + 1}
                        </h3>

                        <p>
                          {String(
                            lesson,
                          )}
                        </p>
                      </div>

                      <PlayCircle
                        size={23}
                      />
                    </div>
                  ),
                )
              ) : (
                <div className="lesson-card">
                  <div className="lesson-content">
                    <h3>
                      Course content
                      coming soon
                    </h3>

                    <p>
                      Your instructor
                      will add the
                      learning materials
                      here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}