"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useQuery,
} from "convex/react";

import {
  api,
} from "../../convex/_generated/api";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LogOut,
  Phone,
} from "lucide-react";


export default function MyCoursesPage() {
  const [phone, setPhone] =
    useState("");

  const [inputPhone, setInputPhone] =
    useState("");

  /* =====================================================
     LOAD SAVED PHONE
  ===================================================== */

  useEffect(() => {
    const savedPhone =
      localStorage.getItem(
        "divyajyoti_student_phone",
      );

    if (savedPhone) {
      setPhone(savedPhone);
      setInputPhone(savedPhone);
    }
  }, []);


  /* =====================================================
     LOAD APPROVED COURSES
  ===================================================== */

  const courses = useQuery(
    api.studentCourses.getMyCourses,
    phone
      ? {
          phone,
        }
      : "skip",
  );


  /* =====================================================
     LOGIN WITH PHONE
  ===================================================== */

  const handleContinue = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    const cleanedPhone =
      inputPhone.replace(
        /\D/g,
        "",
      );

    if (cleanedPhone.length < 10) {
      alert(
        "Please enter a valid 10-digit phone number.",
      );

      return;
    }

    localStorage.setItem(
      "divyajyoti_student_phone",
      cleanedPhone,
    );

    setPhone(cleanedPhone);
  };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "divyajyoti_student_phone",
    );

    setPhone("");
    setInputPhone("");
  };


  return (
    <main className="my-courses-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="my-courses-hero">

        <div className="my-courses-hero-inner">

          <div>

            <p className="my-courses-eyebrow">
              DIVYAJYOTI • LEARNING
            </p>

            <h1>
              My Courses
            </h1>

            <p className="my-courses-subtitle">
              Access the courses you have
              purchased and received approval
              for.
            </p>

          </div>

          {phone && (
            <button
              type="button"
              className="my-courses-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Change number
            </button>
          )}

        </div>

      </section>


      {/* =================================================
          PHONE LOGIN
      ================================================= */}

      {!phone && (
        <section className="my-courses-login">

          <div className="my-courses-login-card">

            <div className="my-courses-login-icon">
              <Phone size={28} />
            </div>

            <p className="my-courses-eyebrow">
              STUDENT ACCESS
            </p>

            <h2>
              Enter your phone number
            </h2>

            <p>
              Use the same phone number you
              entered while making your course
              payment.
            </p>

            <form
              onSubmit={handleContinue}
              className="my-courses-phone-form"
            >

              <label htmlFor="student-phone">
                Mobile number
              </label>

              <input
                id="student-phone"
                type="tel"
                value={inputPhone}
                onChange={(event) =>
                  setInputPhone(
                    event.target.value,
                  )
                }
                placeholder="Enter your 10-digit number"
                maxLength={15}
              />

              <button type="submit">
                View My Courses
                <ArrowRight size={18} />
              </button>

            </form>

          </div>

        </section>
      )}


      {/* =================================================
          STUDENT AREA
      ================================================= */}

      {phone && (
        <section className="my-courses-content">

          {/* ACCOUNT */}

          <div className="my-courses-account">

            <div>

              <span>
                Signed in with
              </span>

              <strong>
                {phone}
              </strong>

            </div>

            <CheckCircle2 size={22} />

          </div>


          {/* LOADING */}

          {courses === undefined && (
            <div className="my-courses-state">

              <div className="my-courses-spinner" />

              <p>
                Loading your courses...
              </p>

            </div>
          )}


          {/* EMPTY */}

          {courses &&
            courses.length === 0 && (
              <div className="my-courses-empty">

                <div className="my-courses-empty-icon">
                  <BookOpen size={30} />
                </div>

                <h2>
                  No approved courses yet.
                </h2>

                <p>
                  We could not find an approved
                  course linked to this phone
                  number.
                </p>

                <Link
                  href="/education"
                  className="my-courses-primary-button"
                >
                  Explore Courses
                  <ArrowRight size={18} />
                </Link>

              </div>
            )}


          {/* COURSES */}

          {courses &&
            courses.length > 0 && (
              <>

                <div className="my-courses-heading">

                  <div>

                    <p className="my-courses-eyebrow">
                      YOUR LEARNING
                    </p>

                    <h2>
                      Courses you own
                    </h2>

                  </div>

                  <span>
                    {courses.length}{" "}
                    {courses.length === 1
                      ? "Course"
                      : "Courses"}
                  </span>

                </div>


                <div className="my-courses-grid">

                  {courses.map(
                    (course) => (
                      <article
                        key={
                          course.enrollmentId
                        }
                        className="my-course-card"
                      >

                        <div className="my-course-card-top">

                          <div className="my-course-icon">
                            <BookOpen
                              size={25}
                            />
                          </div>

                          <span className="my-course-approved">
                            <CheckCircle2
                              size={15}
                            />
                            Approved
                          </span>

                        </div>


                        <p className="my-course-label">
                          DIVYAJYOTI LEARNING
                        </p>

                        <h3>
                          {
                            course.courseTitle
                          }
                        </h3>

                        <p className="my-course-student">
                          Registered to{" "}
                          <strong>
                            {course.name}
                          </strong>
                        </p>


                        <Link
                          href={`/my-courses/${course.courseSlug}`}
                          className="my-course-button"
                        >
                          Open Course
                          <ArrowRight
                            size={18}
                          />
                        </Link>

                      </article>
                    ),
                  )}

                </div>

              </>
            )}

        </section>
      )}

    </main>
  );
}