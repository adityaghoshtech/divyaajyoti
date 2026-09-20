"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  useQuery,
} from "convex/react";

import {
  api,
} from "../../../convex/_generated/api";

import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FileText,
  PlayCircle,
} from "lucide-react";


export default function PrivateCoursePage() {
  const params =
    useParams();

  const slug =
    String(params.slug);


  const [phone, setPhone] =
    useState<string | null>(null);


  /* =====================================================
     GET STUDENT PHONE
  ===================================================== */

  useEffect(() => {
    const savedPhone =
      localStorage.getItem(
        "divyajyoti_student_phone",
      );

    setPhone(savedPhone);
  }, []);


  /* =====================================================
     GET PRIVATE MATERIALS
  ===================================================== */

  const data = useQuery(
    api.studentCourses.getCourseMaterials,
    phone
      ? {
          phone,
          courseSlug: slug,
        }
      : "skip",
  );


  /* =====================================================
     NO STUDENT SESSION
  ===================================================== */

  if (phone === null) {
    return (
      <main className="private-course-page">

        <div className="private-course-state">

          <p className="my-courses-eyebrow">
            STUDENT ACCESS
          </p>

          <h1>
            Please open My Courses.
          </h1>

          <p>
            Enter the phone number used during
            your course enrollment.
          </p>

          <Link
            href="/my-courses"
            className="private-course-button"
          >
            Go to My Courses
          </Link>

        </div>

      </main>
    );
  }


  /* =====================================================
     LOADING
  ===================================================== */

  if (data === undefined) {
    return (
      <main className="private-course-page">

        <div className="private-course-state">

          <div className="my-courses-spinner" />

          <p>
            Loading your course...
          </p>

        </div>

      </main>
    );
  }


  /* =====================================================
     NOT AUTHORIZED
  ===================================================== */

  if (!data.authorized) {
    return (
      <main className="private-course-page">

        <div className="private-course-state">

          <p className="my-courses-eyebrow">
            ACCESS DENIED
          </p>

          <h1>
            Course access unavailable.
          </h1>

          <p>
            This course has not been approved
            for the phone number currently
            signed in.
          </p>

          <Link
            href="/my-courses"
            className="private-course-button"
          >
            Go to My Courses
          </Link>

        </div>

      </main>
    );
  }

  if (!data.enrollment) {
    return (
      <main className="private-course-page">

        <div className="private-course-state">

          <p className="my-courses-eyebrow">
            ACCESS DENIED
          </p>

          <h1>
            Course access unavailable.
          </h1>

          <Link
            href="/my-courses"
            className="private-course-button"
          >
            Go to My Courses
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="private-course-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="private-course-hero">

        <div className="private-course-hero-inner">

          <Link
            href="/my-courses"
            className="private-course-back"
          >
            <ArrowLeft size={17} />
            My Courses
          </Link>

          <p className="my-courses-eyebrow">
            DIVYAJYOTI • PRIVATE LEARNING
          </p>

          <h1>
            {data.enrollment.courseTitle}
          </h1>

          <p>
            Welcome back,{" "}
            <strong>
              {data.enrollment.name}
            </strong>
            .
          </p>

        </div>

      </section>


      {/* =================================================
          COURSE MATERIAL
      ================================================= */}

      <section className="private-course-content">

        <div className="private-course-title-row">

          <div>

            <p className="my-courses-eyebrow">
              YOUR COURSE MATERIAL
            </p>

            <h2>
              Continue learning
            </h2>

          </div>

          <span className="private-course-access">
            Access activated
          </span>

        </div>


        {/* NO MATERIAL */}

        {data.materials.length === 0 ? (
          <div className="private-course-empty">

            <BookOpen size={35} />

            <h3>
              Your course is ready.
            </h3>

            <p>
              Course materials will appear here
              once they are published by
              Divyajyoti.
            </p>

          </div>
        ) : (

          /* MATERIALS */

          <div className="private-course-materials">

            {data.materials.map(
              (material) => {

                const type =
                  String(
                    material.type ?? "",
                  ).toUpperCase();

                let Icon =
                  FileText;

                if (
                  type === "VIDEO"
                ) {
                  Icon =
                    PlayCircle;
                }


                return (
                  <article
                    key={material._id}
                    className="private-material-card"
                  >

                    <div className="private-material-icon">
                      <Icon size={25} />
                    </div>

                    <div className="private-material-info">

                      <span>
                        {material.type}
                      </span>

                      <h3>
                        {material.title}
                      </h3>

                      {material.description && (
                        <p>
                          {
                            material.description
                          }
                        </p>
                      )}

                    </div>


                    {material.url && (
                      <a
                        href={
                          material.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="private-material-open"
                      >
                        Open
                        <ExternalLink
                          size={17}
                        />
                      </a>
                    )}

                  </article>
                );
              },
            )}

          </div>
        )}

      </section>

    </main>
  );
}