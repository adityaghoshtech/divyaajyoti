"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";


export default function MyCoursesPage() {
  const [phone, setPhone] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [error, setError] = useState("");

  const courses = useQuery(
    api.studentCourses.getMyCourses,
    phone
      ? {
          phone,
        }
      : "skip",
  );


  /* =====================================================
     SUBMIT MOBILE NUMBER
  ===================================================== */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    const cleaned =
      inputPhone.replace(/\D/g, "");

    if (cleaned.length < 10) {
      setError(
        "Please enter a valid 10-digit mobile number.",
      );

      return;
    }

    setPhone(cleaned);
  };


  /* =====================================================
     CHANGE NUMBER
  ===================================================== */

  const changeNumber = () => {
    setPhone("");
    setInputPhone("");
    setError("");
  };


  return (
    <main className="learning-hub my-courses-page-v2">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="learning-hub-hero">

        <div className="education-container learning-hub-hero-grid">

          <div>

            <p className="learning-kicker">
              DIVYAJYOTI • LEARNING
            </p>

            <h1>
              My Courses
            </h1>

            <p className="learning-hero-copy">
              A private space for the courses
              you have purchased and received
              approval for.
            </p>

          </div>


          <div className="learning-hero-note">

            <span>
              01
            </span>

            <strong>
              Enter the mobile number used
              during registration.
            </strong>

            <p>
              Your courses are matched to
              the number attached to your
              enrollment.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN ACCESS SECTION
      ================================================= */}

      <section className="my-courses-access-section">

        <div className="education-container">

          {/* =================================================
              NO PHONE YET
          ================================================= */}

          {!phone ? (

            <div className="student-access-layout">

              {/* LEFT CONTENT */}

              <div className="student-access-intro">

                <p className="eyebrow">
                  STUDENT ACCESS
                </p>

                <h2>
                  Continue where you
                  left off.
                </h2>

                <p>
                  Enter the same mobile number
                  you used while registering for
                  a Divyajyoti course. We will
                  show only the courses approved
                  for that number.
                </p>


                <div className="student-access-points">

                  <span>
                    <b className="access-check">
                      ✓
                    </b>

                    Approved courses only
                  </span>


                  <span>
                    <b className="access-check">
                      ✓
                    </b>

                    Recorded classes and resources
                  </span>


                  <span>
                    <b className="access-check">
                      ✓
                    </b>

                    One place for your learning
                  </span>

                </div>

              </div>


              {/* ACCESS CARD */}

              <div className="student-access-card">

                <div className="student-access-icon">
                  <span className="access-book-icon">
                    ▣
                  </span>
                </div>


                <p className="learning-kicker">
                  ACCESS YOUR LEARNING
                </p>


                <h3>
                  Enter your mobile number
                </h3>


                <p>
                  We will find the courses
                  approved for this number.
                </p>


                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="student-access-form"
                >

                  <label htmlFor="my-course-phone">
                    Mobile number
                  </label>


                  <input
                    id="my-course-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={
                      inputPhone
                    }
                    maxLength={15}
                    onChange={(event) =>
                      setInputPhone(
                        event.target.value,
                      )
                    }
                  />


                  {error && (

                    <div className="student-access-error">
                      {error}
                    </div>

                  )}


                  <button
                    type="submit"
                    className="student-access-button"
                  >
                    Access My Courses

                    <span className="button-arrow">
                      →
                    </span>

                  </button>

                </form>

              </div>

            </div>

          ) : (

            <>
              {/* =================================================
                  SESSION BAR
              ================================================= */}

              <div className="student-session-bar">

                <div>

                  <span>
                    COURSE ACCESS
                  </span>

                  <strong>
                    Your approved learning space
                  </strong>

                </div>


                <button
                  type="button"
                  onClick={
                    changeNumber
                  }
                >
                  <span>
                    ↻
                  </span>

                  Use another number

                </button>

              </div>


              {/* =================================================
                  LOADING
              ================================================= */}

              {courses === undefined && (

                <div className="learning-state-card">

                  <div className="learning-spinner" />

                  <h3>
                    Loading your courses
                  </h3>

                  <p>
                    Checking your approved
                    enrollments.
                  </p>

                </div>

              )}


              {/* =================================================
                  NO COURSES
              ================================================= */}

              {courses &&
                courses.length === 0 && (

                  <div className="learning-empty-card">

                    <div className="learning-empty-icon">

                      <span className="empty-book-icon">
                        ▣
                      </span>

                    </div>


                    <p className="eyebrow">
                      NO APPROVED ENROLLMENT
                    </p>


                    <h2>
                      We could not find a
                      course for this number.
                    </h2>


                    <p>
                      If you have just completed
                      a payment, your course will
                      appear here after the
                      Divyajyoti team approves it.
                    </p>


                    <Link
                      href="/education"
                      className="learning-primary-button"
                    >
                      Explore courses

                      <span>
                        →
                      </span>

                    </Link>

                  </div>

                )}


              {/* =================================================
                  COURSES FOUND
              ================================================= */}

              {courses &&
                courses.length > 0 && (

                  <div className="student-courses-results">

                    <div className="student-courses-heading">

                      <div>

                        <p className="eyebrow">
                          YOUR LEARNING LIBRARY
                        </p>

                        <h2>
                          Courses ready
                          for you.
                        </h2>

                      </div>


                      <span>
                        {courses.length}{" "}
                        {courses.length === 1
                          ? "course"
                          : "courses"}
                      </span>

                    </div>


                    <div className="student-courses-grid">

                      {courses.map(
                        (item) => (

                          <article
                            className="student-course-card"
                            key={
                              item.enrollmentId
                            }
                          >

                            {/* COURSE IMAGE */}

                            <div
                              className="student-course-image"
                              style={
                                item.course?.image
                                  ? {
                                      backgroundImage:
                                        `url(${item.course.image})`,
                                    }
                                  : undefined
                              }
                            >

                              <span>
                                APPROVED ACCESS
                              </span>

                            </div>


                            {/* COURSE CONTENT */}

                            <div className="student-course-body">

                              <p className="student-course-category">
                                {item.course?.category ??
                                  "DIVYAJYOTI LEARNING"}
                              </p>


                              <h3>
                                {item.course?.title ??
                                  item.courseTitle}
                              </h3>


                              <p>
                                {item.course?.description ??
                                  "Your approved course is ready to continue."}
                              </p>


                              {/* COURSE META */}

                              <div className="student-course-meta">

                                <span>
                                  {item.course?.lessonCount ??
                                    0}{" "}
                                  lessons
                                </span>


                                <span>
                                  {item.course?.duration ??
                                    "Flexible"}
                                </span>


                                <span>
                                  {item.course?.level ??
                                    "Learning"}
                                </span>

                              </div>


                              {/* CONTINUE */}

                              <Link
                                href={`/my-courses/${item.courseSlug}`}
                                className="student-course-button"
                              >
                                Continue learning

                                <span>
                                  →
                                </span>

                              </Link>

                            </div>

                          </article>

                        ),
                      )}

                    </div>

                  </div>

                )}

            </>

          )}

        </div>

      </section>

    </main>
  );
}