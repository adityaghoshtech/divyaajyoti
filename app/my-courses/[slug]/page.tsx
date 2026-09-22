"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

/* =========================================================
   TYPES
========================================================= */

type Material = {
  _id: string;
  courseSlug: string;
  title: string;
  type: string;
  description?: string;
  url?: string | null;
  storageId?: string;
  sortOrder: number;
  status: string;
  createdAt: number;
  updatedAt: number;

  /*
   * Some versions of the backend may return
   * a resolved storage URL.
   */
  storageUrl?: string | null;
  fileUrl?: string | null;
};

/* =========================================================
   HELPERS
========================================================= */

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeType(value?: string) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function isLiveClass(material: Material) {
  const type = normalizeType(material.type);

  return (
    type === "LIVE" ||
    type === "LIVE_CLASS" ||
    type === "GOOGLE_MEET" ||
    type === "MEET"
  );
}

function isRecordedClass(material: Material) {
  const type = normalizeType(material.type);

  return (
    type === "VIDEO" ||
    type === "RECORDED" ||
    type === "RECORDED_CLASS" ||
    type === "RECORDING"
  );
}

function isPdf(material: Material) {
  const type = normalizeType(material.type);

  return (
    type === "PDF" ||
    type === "NOTE_PDF" ||
    type === "PDF_NOTE"
  );
}

function isNote(material: Material) {
  const type = normalizeType(material.type);

  return (
    type === "NOTE" ||
    type === "NOTES" ||
    type === "STUDY_NOTE"
  );
}

function isResource(material: Material) {
  const type = normalizeType(material.type);

  return (
    type === "LINK" ||
    type === "RESOURCE" ||
    type === "RESOURCE_LINK"
  );
}

function materialLabel(material: Material) {
  const type = normalizeType(material.type);

  if (isLiveClass(material)) {
    return "LIVE CLASS";
  }

  if (isRecordedClass(material)) {
    return "RECORDED CLASS";
  }

  if (isPdf(material)) {
    return "PDF NOTES";
  }

  if (isNote(material)) {
    return "STUDY NOTES";
  }

  if (isResource(material)) {
    return "RESOURCE";
  }

  return type || "MATERIAL";
}

function materialIcon(material: Material) {
  if (isLiveClass(material)) {
    return "LIVE";
  }

  if (isRecordedClass(material)) {
    return "▶";
  }

  if (isPdf(material)) {
    return "PDF";
  }

  if (isNote(material)) {
    return "NOTE";
  }

  if (isResource(material)) {
    return "↗";
  }

  return "DOC";
}

function materialHref(material: Material) {
  /*
   * Priority:
   *
   * 1. Resolved storage URL
   * 2. External URL
   */

  if (material.storageUrl) {
    return material.storageUrl;
  }

  if (material.fileUrl) {
    return material.fileUrl;
  }

  if (material.url) {
    return material.url;
  }

  return "";
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function PrivateCoursePage() {
  const params = useParams();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : "";

  /* =======================================================
     STUDENT PHONE
  ======================================================= */

  const [phone, setPhone] = useState("");

  const [phoneReady, setPhoneReady] =
    useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedPhone =
      localStorage.getItem(
        "divyajyoti_student_phone",
      ) || "";

    setPhone(normalizePhone(savedPhone));

    setPhoneReady(true);
  }, []);

  /* =======================================================
     APPROVED COURSES FOR THIS STUDENT

     The My Courses page has already established which
     enrollment belongs to this student. We reuse that
     enrollment here instead of performing a second,
     independent phone lookup. This prevents the private
     course page from rejecting a course that is already
     visible as APPROVED on /my-courses.
  ======================================================= */

  const myCourses = useQuery(
    api.studentCourses.getMyCourses,
    phoneReady && phone
      ? { phone }
      : "skip",
  );

  const selectedCourse = useMemo(() => {
    if (!Array.isArray(myCourses) || !slug) {
      return null;
    }

    const normalizedSlug = slug.trim().toLowerCase();

    return (
      myCourses.find(
        (item: any) =>
          String(item.courseSlug ?? item.course?.slug ?? "")
            .trim()
            .toLowerCase() === normalizedSlug,
      ) ?? null
    );
  }, [myCourses, slug]);

  /* =======================================================
     COURSE ACCESS

     If the course is present in My Courses, pass its exact
     enrollment ID to the backend. The backend then verifies
     that exact approved enrollment and loads its materials.
  ======================================================= */

  const access = useQuery(
    api.studentCourses.getCourseAccess,
    phoneReady &&
    phone &&
    slug &&
    selectedCourse?.enrollmentId
      ? {
          phone,
          courseSlug: slug,
          enrollmentId: selectedCourse.enrollmentId,
        }
      : "skip",
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    !phoneReady ||
    myCourses === undefined ||
    (selectedCourse && access === undefined)
  ) {
    return (
      <>
        <main className="dj-private-state">
          <div className="dj-private-loader" />

          <div className="dj-private-state-eyebrow">
            DIVYAJYOTI LEARNING
          </div>

          <h1>
            Loading your course...
          </h1>

          <p>
            Please wait while we check your
            course access.
          </p>
        </main>

        <PrivateCourseStyles />
      </>
    );
  }

  /* =======================================================
     NO PHONE
  ======================================================= */

  if (!phone) {
    return (
      <>
        <main className="dj-private-state">
          <div className="dj-private-state-icon">
            D
          </div>

          <div className="dj-private-state-eyebrow">
            STUDENT ACCESS
          </div>

          <h1>
            Sign in to continue.
          </h1>

          <p>
            We could not find the student phone
            number used for your course enrollment.
          </p>

          <Link
            href="/my-courses"
            className="dj-private-primary"
          >
            Go to My Courses
            <span>→</span>
          </Link>
        </main>

        <PrivateCourseStyles />
      </>
    );
  }

  /* =======================================================
     COURSE NOT FOUND / NO ACCESS
  ======================================================= */

  if (
    !selectedCourse ||
    !access ||
    !access.course
  ) {
    return (
      <>
        <main className="dj-private-state">
          <div className="dj-private-state-icon">
            D
          </div>

          <div className="dj-private-state-eyebrow">
            DIVYAJYOTI LEARNING
          </div>

          <h1>
            Course access not available.
          </h1>

          <p>
            This course is not available for
            your current student account.
          </p>

          <div className="dj-private-state-actions">
            <Link
              href="/my-courses"
              className="dj-private-primary"
            >
              My Courses
              <span>→</span>
            </Link>

            <Link
              href="/education"
              className="dj-private-secondary"
            >
              Explore Courses
            </Link>
          </div>
        </main>

        <PrivateCourseStyles />
      </>
    );
  }

  const course = access.course;

  const materials =
    Array.isArray(access.materials)
      ? access.materials.map((material): Material => ({
          _id: String(material.id),
          courseSlug: material.courseSlug || slug,
          title: material.title,
          type: material.type,
          description: material.description ?? undefined,
          url: material.url ?? undefined,
          storageId: material.storageId ?? undefined,
          storageUrl: material.storageUrl ?? material.fileUrl ?? undefined,
          fileUrl: material.fileUrl ?? material.storageUrl ?? undefined,
          sortOrder: Number(material.sortOrder ?? 0),
          status: String(material.status ?? "PUBLISHED").toLowerCase(),
          createdAt: Number(material.createdAt ?? 0),
          updatedAt: Number(material.updatedAt ?? 0),
        }))
      : [];

  /* =======================================================
     MATERIAL GROUPS
  ======================================================= */

  const liveClasses = materials.filter((item) =>
    isLiveClass(item),
  );

  const recordedClasses = materials.filter((item) =>
    isRecordedClass(item),
  );

  const pdfNotes = materials.filter((item) =>
    isPdf(item),
  );

  const studyNotes = materials.filter((item) =>
    isNote(item),
  );

  const resources = materials.filter((item) =>
    isResource(item),
  );

  const otherMaterials = materials.filter(
    (item) =>
      !isLiveClass(item) &&
      !isRecordedClass(item) &&
      !isPdf(item) &&
      !isNote(item) &&
      !isResource(item),
  );

  /* =======================================================
     LESSON COUNT
  ======================================================= */

  const lessonCount = Number(course.lessonCount || 0);

  /* =======================================================
     IMAGE
  ======================================================= */

  const courseImage =
    course.image ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <main className="dj-private-page">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="dj-private-hero">

          <div className="dj-private-hero-glow" />

          <div className="dj-private-container">

            <Link
              href="/my-courses"
              className="dj-private-back"
            >
              <span>←</span>
              Back to My Courses
            </Link>

            <div className="dj-private-hero-grid">

              {/* -----------------------------------------
                  HERO COPY
              ----------------------------------------- */}

              <div className="dj-private-hero-copy">

                <div className="dj-private-eyebrow">
                  <span className="dj-private-dot" />
                  PRIVATE LEARNING AREA
                </div>

                <div className="dj-private-category">
                  {course.category ||
                    "DIVYAJYOTI LEARNING"}
                </div>

                <h1>
                  {course.title}
                </h1>

                <p className="dj-private-description">
                  {course.description ||
                    "Your private course area contains all the learning materials provided by the Divyajyoti team."}
                </p>

                <div className="dj-private-meta">

                  <span>
                    <b>{lessonCount}</b>
                    Lessons
                  </span>

                  <span>
                    <b>
                      {course.duration ||
                        "Flexible"}
                    </b>
                    Duration
                  </span>

                  <span>
                    <b>
                      {course.level ||
                        "All Levels"}
                    </b>
                    Level
                  </span>

                  <span>
                    <b>
                      {course.instructor ||
                        "Divyajyoti"}
                    </b>
                    Instructor
                  </span>

                </div>

              </div>

              {/* -----------------------------------------
                  HERO IMAGE
              ----------------------------------------- */}

              <div className="dj-private-hero-image">

                <img
                  src={courseImage}
                  alt={course.title}
                />

                <div className="dj-private-image-overlay" />

                <div className="dj-private-image-card">

                  <span>
                    YOUR COURSE
                  </span>

                  <strong>
                    Private access
                  </strong>

                  <small>
                    Available after payment approval
                  </small>

                </div>

              </div>

            </div>
          </div>
        </section>


        {/* =================================================
            ACCESS BAR
        ================================================= */}

        <section className="dj-private-access-bar">

          <div className="dj-private-container">

            <div className="dj-private-access-inner">

              <div className="dj-private-access-status">

                <span className="dj-private-access-check">
                  ✓
                </span>

                <div>
                  <strong>
                    Course access confirmed
                  </strong>

                  <small>
                    You can access the materials
                    published by the admin.
                  </small>
                </div>

              </div>

              <div className="dj-private-access-phone">
                Student
                <strong>
                  {phone}
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="dj-private-content">

          <div className="dj-private-container">

            <div className="dj-private-layout">

              {/* =================================================
                  LEFT CONTENT
              ================================================= */}

              <div className="dj-private-main">

                {/* -----------------------------------------
                    LIVE CLASS
                ----------------------------------------- */}

                {liveClasses.length > 0 && (
                  <section className="dj-private-section">

                    <div className="dj-private-section-head">

                      <div>
                        <span className="dj-private-section-label live">
                          LIVE LEARNING
                        </span>

                        <h2>
                          Live classes
                        </h2>

                        <p>
                          Join your scheduled
                          Google Meet class here.
                        </p>
                      </div>

                      <span className="dj-private-count">
                        {liveClasses.length}
                      </span>

                    </div>

                    <div className="dj-private-material-list">

                      {liveClasses.map(
                        (material) => (
                          <MaterialCard
                            key={material._id}
                            material={material}
                          />
                        ),
                      )}

                    </div>

                  </section>
                )}


                {/* -----------------------------------------
                    RECORDED CLASSES
                ----------------------------------------- */}

                <section className="dj-private-section">

                  <div className="dj-private-section-head">

                    <div>
                      <span className="dj-private-section-label">
                        RECORDED CLASSES
                      </span>

                      <h2>
                        Learn at your own pace.
                      </h2>

                      <p>
                        Watch the recorded classes
                        uploaded by your instructor.
                      </p>
                    </div>

                    <span className="dj-private-count">
                      {recordedClasses.length}
                    </span>

                  </div>

                  {recordedClasses.length > 0 ? (
                    <div className="dj-private-material-list">

                      {recordedClasses.map(
                        (material) => (
                          <MaterialCard
                            key={material._id}
                            material={material}
                          />
                        ),
                      )}

                    </div>
                  ) : (
                    <EmptyMaterials
                      title="No recorded classes yet"
                      text="Your instructor has not published any recorded classes for this course yet."
                    />
                  )}

                </section>


                {/* -----------------------------------------
                    PDF NOTES
                ----------------------------------------- */}

                <section className="dj-private-section">

                  <div className="dj-private-section-head">

                    <div>
                      <span className="dj-private-section-label">
                        COURSE NOTES
                      </span>

                      <h2>
                        Notes & PDFs
                      </h2>

                      <p>
                        Download or open the study
                        documents provided by your instructor.
                      </p>
                    </div>

                    <span className="dj-private-count">
                      {pdfNotes.length +
                        studyNotes.length}
                    </span>

                  </div>

                  {pdfNotes.length > 0 ||
                  studyNotes.length > 0 ? (
                    <div className="dj-private-material-list">

                      {[
                        ...pdfNotes,
                        ...studyNotes,
                      ].map((material) => (
                        <MaterialCard
                          key={material._id}
                          material={material}
                        />
                      ))}

                    </div>
                  ) : (
                    <EmptyMaterials
                      title="No notes available yet"
                      text="Course notes and PDFs will appear here when the admin publishes them."
                    />
                  )}

                </section>


                {/* -----------------------------------------
                    OTHER RESOURCES
                ----------------------------------------- */}

                {(resources.length > 0 ||
                  otherMaterials.length > 0) && (
                  <section className="dj-private-section">

                    <div className="dj-private-section-head">

                      <div>
                        <span className="dj-private-section-label">
                          ADDITIONAL MATERIAL
                        </span>

                        <h2>
                          Resources
                        </h2>

                        <p>
                          Additional links, references
                          and learning resources.
                        </p>
                      </div>

                      <span className="dj-private-count">
                        {resources.length +
                          otherMaterials.length}
                      </span>

                    </div>

                    <div className="dj-private-material-list">

                      {[
                        ...resources,
                        ...otherMaterials,
                      ].map((material) => (
                        <MaterialCard
                          key={material._id}
                          material={material}
                        />
                      ))}

                    </div>

                  </section>
                )}


                {/* -----------------------------------------
                    EMPTY ENTIRE COURSE
                ----------------------------------------- */}

                {materials.length === 0 && (
                  <section className="dj-private-empty-large">

                    <div className="dj-private-empty-icon">
                      +
                    </div>

                    <span>
                      COURSE CONTENT
                    </span>

                    <h2>
                      Your learning space is ready.
                    </h2>

                    <p>
                      The course has been approved,
                      but the admin has not published
                      any classes, notes or resources yet.
                    </p>

                  </section>
                )}

              </div>


              {/* =================================================
                  SIDEBAR
              ================================================= */}

              <aside className="dj-private-sidebar">

                <div className="dj-private-sidebar-card">

                  <span className="dj-private-sidebar-label">
                    COURSE OVERVIEW
                  </span>

                  <h3>
                    {course.title}
                  </h3>

                  <div className="dj-private-sidebar-divider" />

                  <div className="dj-private-sidebar-stat">
                    <span>
                      Lessons
                    </span>

                    <strong>
                      {lessonCount}
                    </strong>
                  </div>

                  <div className="dj-private-sidebar-stat">
                    <span>
                      Duration
                    </span>

                    <strong>
                      {course.duration ||
                        "Flexible"}
                    </strong>
                  </div>

                  <div className="dj-private-sidebar-stat">
                    <span>
                      Level
                    </span>

                    <strong>
                      {course.level ||
                        "All Levels"}
                    </strong>
                  </div>

                  <div className="dj-private-sidebar-stat">
                    <span>
                      Materials
                    </span>

                    <strong>
                      {materials.length}
                    </strong>
                  </div>

                </div>


                <div className="dj-private-sidebar-note">

                  <div className="dj-private-sidebar-note-icon">
                    D
                  </div>

                  <strong>
                    Need help?
                  </strong>

                  <p>
                    If you cannot access a class,
                    PDF or Google Meet link, contact
                    the Divyajyoti team.
                  </p>

                  <Link href="/contact">
                    Contact support
                    <span>→</span>
                  </Link>

                </div>


                <Link
                  href="/my-courses"
                  className="dj-private-sidebar-back"
                >
                  <span>←</span>
                  Back to My Courses
                </Link>

              </aside>

            </div>

          </div>

        </section>

      </main>

      <PrivateCourseStyles />
    </>
  );
}


/* =========================================================
   MATERIAL CARD
========================================================= */

function MaterialCard({
  material,
}: {
  material: Material;
}) {
  const href = materialHref(material);
  const live = isLiveClass(material);
  const recorded = isRecordedClass(material);
  const pdf = isPdf(material);

  return (
    <article
      className={`dj-private-material ${
        live ? "dj-private-material-live" : ""
      }`}
    >
      <div
        className={`dj-private-material-icon ${
          live ? "dj-private-live-icon" : ""
        }`}
      >
        {materialIcon(material)}
      </div>

      <div className="dj-private-material-body">
        <div className="dj-private-material-label">
          {materialLabel(material)}
        </div>

        <h3>{material.title}</h3>

        {material.description && (
          <p>{material.description}</p>
        )}

        {live && (
          <div className="dj-private-meet-note">
            Google Meet
          </div>
        )}

        {recorded && href && (
          <div className="dj-private-video-frame">
            <video
              controls
              preload="metadata"
              playsInline
            >
              <source src={href} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
        )}

        {pdf && href && (
          <div className="dj-private-pdf-frame">
            <iframe
              src={href}
              title={material.title}
            />
          </div>
        )}
      </div>

      <div className="dj-private-material-action">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              live
                ? "dj-private-live-button"
                : "dj-private-open-button"
            }
          >
            {live
              ? "Join Live Class"
              : pdf
                ? "Open PDF"
                : recorded
                  ? "Open Video"
                  : "Open Resource"}
            <span>↗</span>
          </a>
        ) : (
          <span className="dj-private-unavailable">
            File unavailable
          </span>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY MATERIAL
========================================================= */

function EmptyMaterials({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="dj-private-empty">

      <div className="dj-private-empty-small-icon">
        +
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   PAGE STYLES
========================================================= */

function PrivateCourseStyles() {
  return (
    <style jsx global>{`

      /* =====================================================
         PAGE
      ===================================================== */

      .dj-private-page {
        min-height: 100vh;
        background: #f8f5ee;
        color: #142238;
      }

      .dj-private-container {
        width: min(
          1180px,
          calc(100% - 48px)
        );

        margin: 0 auto;
      }


      /* =====================================================
         HERO
      ===================================================== */

      .dj-private-hero {
        position: relative;
        overflow: hidden;

        background:
          linear-gradient(
            135deg,
            #0b213a,
            #102f50
          );

        color: white;

        padding: 55px 0 65px;
      }

      .dj-private-hero-glow {
        position: absolute;

        width: 550px;
        height: 550px;

        right: -180px;
        top: -240px;

        border-radius: 50%;

        background:
          radial-gradient(
            circle,
            rgba(220,174,79,.18),
            transparent 68%
          );

        pointer-events: none;
      }

      .dj-private-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;

        color: #b9c6d5;

        font-size: 12px;
        font-weight: 700;

        text-decoration: none;

        margin-bottom: 42px;

        transition: .2s ease;
      }

      .dj-private-back:hover {
        color: white;
        transform: translateX(-2px);
      }

      .dj-private-hero-grid {
        display: grid;

        grid-template-columns:
          minmax(0, 1fr)
          390px;

        gap: 60px;

        align-items: center;
      }

      .dj-private-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;

        color: #dfbd80;

        font-size: 10px;
        font-weight: 800;

        letter-spacing: .19em;

        margin-bottom: 20px;
      }

      .dj-private-dot {
        width: 7px;
        height: 7px;

        border-radius: 50%;

        background: #73b58a;

        box-shadow:
          0 0 0 5px
          rgba(115,181,138,.12);
      }

      .dj-private-category {
        color: #92a6bd;

        font-size: 10px;
        font-weight: 800;

        letter-spacing: .18em;

        text-transform: uppercase;

        margin-bottom: 12px;
      }

      .dj-private-hero h1 {
        max-width: 750px;

        margin: 0;

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size:
          clamp(
            44px,
            5.4vw,
            72px
          );

        line-height: .99;

        font-weight: 500;

        letter-spacing: -.04em;
      }

      .dj-private-description {
        max-width: 650px;

        margin: 22px 0 0;

        color: #c2ccd8;

        font-size: 15px;

        line-height: 1.75;
      }

      .dj-private-meta {
        display: flex;
        flex-wrap: wrap;

        gap: 10px;

        margin-top: 28px;
      }

      .dj-private-meta span {
        min-width: 105px;

        padding: 12px 14px;

        border:
          1px solid
          rgba(255,255,255,.12);

        background:
          rgba(255,255,255,.045);

        color: #94a4b7;

        font-size: 9px;

        text-transform: uppercase;

        letter-spacing: .08em;
      }

      .dj-private-meta b {
        display: block;

        color: white;

        font-size: 12px;

        text-transform: none;

        letter-spacing: 0;

        margin-bottom: 4px;

        max-width: 150px;

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;
      }


      /* =====================================================
         HERO IMAGE
      ===================================================== */

      .dj-private-hero-image {
        position: relative;

        height: 400px;

        overflow: hidden;

        border-radius:
          24px
          24px
          80px
          24px;

        background: #1b2b3d;

        box-shadow:
          0 28px 70px
          rgba(0,0,0,.25);
      }

      .dj-private-hero-image img {
        width: 100%;
        height: 100%;

        display: block;

        object-fit: cover;

        opacity: .82;

        filter:
          saturate(.78)
          contrast(.98);
      }

      .dj-private-image-overlay {
        position: absolute;
        inset: 0;

        background:
          linear-gradient(
            180deg,
            transparent 35%,
            rgba(5,15,27,.75)
          );
      }

      .dj-private-image-card {
        position: absolute;

        left: 20px;
        right: 20px;
        bottom: 20px;

        padding: 15px 17px;

        border:
          1px solid
          rgba(255,255,255,.14);

        background:
          rgba(10,26,45,.83);

        backdrop-filter: blur(12px);
      }

      .dj-private-image-card span {
        display: block;

        color: #dfbd80;

        font-size: 8px;

        font-weight: 800;

        letter-spacing: .17em;
      }

      .dj-private-image-card strong {
        display: block;

        margin-top: 5px;

        color: white;

        font-family:
          Georgia,
          serif;

        font-size: 19px;

        font-weight: 500;
      }

      .dj-private-image-card small {
        display: block;

        margin-top: 4px;

        color: #aab8c8;

        font-size: 9px;
      }


      /* =====================================================
         ACCESS BAR
      ===================================================== */

      .dj-private-access-bar {
        background: white;

        border-bottom:
          1px solid #e7e0d5;
      }

      .dj-private-access-inner {
        min-height: 78px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 20px;
      }

      .dj-private-access-status {
        display: flex;
        align-items: center;

        gap: 11px;
      }

      .dj-private-access-check {
        width: 31px;
        height: 31px;

        display: grid;
        place-items: center;

        border-radius: 50%;

        background: #edf8f1;

        color: #258052;

        font-size: 14px;
        font-weight: 900;
      }

      .dj-private-access-status strong {
        display: block;

        font-size: 12px;
      }

      .dj-private-access-status small {
        display: block;

        margin-top: 3px;

        color: #8190a1;

        font-size: 9px;
      }

      .dj-private-access-phone {
        display: flex;
        align-items: center;
        gap: 9px;

        color: #8793a3;

        font-size: 10px;
      }

      .dj-private-access-phone strong {
        color: #17263b;

        font-size: 11px;
      }


      /* =====================================================
         CONTENT
      ===================================================== */

      .dj-private-content {
        padding: 65px 0 100px;
      }

      .dj-private-layout {
        display: grid;

        grid-template-columns:
          minmax(0, 1fr)
          285px;

        gap: 45px;

        align-items: start;
      }

      .dj-private-main {
        min-width: 0;
      }


      /* =====================================================
         SECTIONS
      ===================================================== */

      .dj-private-section {
        margin-bottom: 55px;
      }

      .dj-private-section-head {
        display: flex;

        align-items: flex-end;

        justify-content: space-between;

        gap: 20px;

        margin-bottom: 22px;
      }

      .dj-private-section-label {
        display: block;

        color: #ad7933;

        font-size: 9px;

        font-weight: 850;

        letter-spacing: .17em;

        margin-bottom: 8px;
      }

      .dj-private-section-label.live {
        color: #258052;
      }

      .dj-private-section-head h2 {
        margin: 0;

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size: 35px;

        line-height: 1.05;

        font-weight: 500;

        letter-spacing: -.025em;
      }

      .dj-private-section-head p {
        max-width: 580px;

        margin: 9px 0 0;

        color: #78879a;

        font-size: 12px;

        line-height: 1.6;
      }

      .dj-private-count {
        min-width: 34px;
        height: 34px;

        display: grid;
        place-items: center;

        border: 1px solid #e2dbd0;

        border-radius: 50%;

        background: white;

        color: #8c6a3d;

        font-size: 10px;

        font-weight: 800;
      }


      /* =====================================================
         MATERIAL LIST
      ===================================================== */

      .dj-private-material-list {
        display: flex;
        flex-direction: column;

        gap: 10px;
      }

      .dj-private-material {
        display: flex;

        align-items: center;

        gap: 15px;

        padding: 16px;

        background: white;

        border:
          1px solid
          #e5ded2;

        transition:
          transform .2s ease,
          box-shadow .2s ease,
          border-color .2s ease;
      }

      .dj-private-material:hover {
        transform: translateY(-2px);

        border-color: #d5c8b6;

        box-shadow:
          0 15px 35px
          rgba(20,34,56,.07);
      }

      .dj-private-material-live {
        border-color: #cfe3d7;

        background:
          linear-gradient(
            90deg,
            #fbfffc,
            white
          );
      }

      .dj-private-material-icon {
        width: 52px;
        height: 52px;

        flex: 0 0 52px;

        display: grid;
        place-items: center;

        background: #f7efe1;

        color: #a87331;

        font-size: 9px;

        font-weight: 900;

        letter-spacing: .04em;
      }

      .dj-private-live-icon {
        background: #edf8f1;

        color: #258052;
      }

      .dj-private-material-body {
        min-width: 0;
        flex: 1;
      }

      .dj-private-material-label {
        color: #b07d35;

        font-size: 8px;

        font-weight: 850;

        letter-spacing: .15em;
      }

      .dj-private-material-live
      .dj-private-material-label {
        color: #258052;
      }

      .dj-private-material-body h3 {
        margin: 5px 0 0;

        color: #16263c;

        font-size: 16px;

        font-weight: 750;
      }

      .dj-private-material-body p {
        max-width: 620px;

        margin: 5px 0 0;

        color: #78879a;

        font-size: 11px;

        line-height: 1.55;
      }

      .dj-private-meet-note {
        display: inline-flex;

        margin-top: 8px;

        padding: 4px 7px;

        border-radius: 999px;

        background: #edf8f1;

        color: #28724d;

        font-size: 8px;

        font-weight: 800;
      }

      .dj-private-material-action {
        flex: 0 0 auto;
      }

      .dj-private-open-button,
      .dj-private-live-button {
        display: inline-flex;

        align-items: center;

        justify-content: center;

        gap: 7px;

        padding: 10px 13px;

        text-decoration: none;

        font-size: 10px;

        font-weight: 800;

        white-space: nowrap;

        transition: .2s ease;
      }

      .dj-private-open-button {
        background: #101e32;

        color: white;
      }

      .dj-private-open-button:hover {
        background: #1b304b;
      }

      .dj-private-live-button {
        background: #23764c;

        color: white;
      }

      .dj-private-live-button:hover {
        background: #1b6340;
      }

      .dj-private-unavailable {
        color: #a2aab4;

        font-size: 9px;
      }


      .dj-private-video-frame {
        margin-top: 18px;
        width: 100%;
        overflow: hidden;
        border-radius: 12px;
        background: #07182d;
      }

      .dj-private-video-frame video {
        display: block;
        width: 100%;
        max-height: 520px;
        background: #07182d;
      }

      .dj-private-pdf-frame {
        margin-top: 18px;
        width: 100%;
        height: 650px;
        overflow: hidden;
        border: 1px solid #e5ded2;
        border-radius: 10px;
        background: white;
      }

      .dj-private-pdf-frame iframe {
        width: 100%;
        height: 100%;
        display: block;
        border: 0;
      }

      /* =====================================================
         EMPTY STATES
      ===================================================== */

      .dj-private-empty {
        padding: 42px 25px;

        text-align: center;

        border:
          1px dashed
          #d9d1c5;

        background:
          rgba(255,255,255,.6);
      }

      .dj-private-empty-small-icon {
        width: 38px;
        height: 38px;

        margin: 0 auto 13px;

        display: grid;
        place-items: center;

        border-radius: 11px;

        background: #f7edda;

        color: #b87820;

        font-size: 22px;
      }

      .dj-private-empty h3 {
        margin: 0;

        font-family:
          Georgia,
          serif;

        font-size: 22px;

        font-weight: 500;
      }

      .dj-private-empty p {
        max-width: 480px;

        margin: 8px auto 0;

        color: #7c8998;

        font-size: 11px;

        line-height: 1.6;
      }

      .dj-private-empty-large {
        padding: 70px 35px;

        text-align: center;

        background: white;

        border: 1px solid #e5ded2;
      }

      .dj-private-empty-icon {
        width: 48px;
        height: 48px;

        margin: 0 auto 17px;

        display: grid;
        place-items: center;

        border-radius: 14px;

        background: #f7edda;

        color: #b87820;

        font-size: 25px;
      }

      .dj-private-empty-large > span {
        color: #b07d35;

        font-size: 9px;

        font-weight: 850;

        letter-spacing: .17em;
      }

      .dj-private-empty-large h2 {
        margin: 9px 0;

        font-family:
          Georgia,
          serif;

        font-size: 31px;

        font-weight: 500;
      }

      .dj-private-empty-large p {
        max-width: 530px;

        margin: 0 auto;

        color: #7b8999;

        font-size: 12px;

        line-height: 1.7;
      }


      /* =====================================================
         SIDEBAR
      ===================================================== */

      .dj-private-sidebar {
        position: sticky;

        top: 105px;
      }

      .dj-private-sidebar-card {
        padding: 22px;

        background: white;

        border:
          1px solid
          #e4ddd2;

        box-shadow:
          0 15px 40px
          rgba(20,34,56,.06);
      }

      .dj-private-sidebar-label {
        color: #ad7933;

        font-size: 8px;

        font-weight: 850;

        letter-spacing: .17em;
      }

      .dj-private-sidebar-card h3 {
        margin: 11px 0 20px;

        font-family:
          Georgia,
          serif;

        font-size: 25px;

        line-height: 1.15;

        font-weight: 500;
      }

      .dj-private-sidebar-divider {
        height: 1px;

        background: #e9e2d8;

        margin: 0 -22px 8px;
      }

      .dj-private-sidebar-stat {
        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 10px;

        padding: 12px 0;

        border-bottom:
          1px solid
          #eee8df;
      }

      .dj-private-sidebar-stat:last-child {
        border-bottom: 0;
      }

      .dj-private-sidebar-stat span {
        color: #8995a5;

        font-size: 10px;
      }

      .dj-private-sidebar-stat strong {
        max-width: 135px;

        color: #17263b;

        font-size: 10px;

        text-align: right;

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;
      }

      .dj-private-sidebar-note {
        margin-top: 12px;

        padding: 19px;

        background: #101e32;

        color: white;
      }

      .dj-private-sidebar-note-icon {
        width: 31px;
        height: 31px;

        display: grid;
        place-items: center;

        margin-bottom: 13px;

        border-radius: 50%;

        background: #dfbd80;

        color: #102039;

        font-family:
          Georgia,
          serif;

        font-size: 17px;
      }

      .dj-private-sidebar-note strong {
        display: block;

        font-size: 13px;
      }

      .dj-private-sidebar-note p {
        margin: 7px 0 13px;

        color: #abb7c6;

        font-size: 10px;

        line-height: 1.6;
      }

      .dj-private-sidebar-note a {
        display: inline-flex;

        align-items: center;

        gap: 6px;

        color: #dfbd80;

        font-size: 10px;

        font-weight: 800;

        text-decoration: none;
      }

      .dj-private-sidebar-back {
        display: flex;

        align-items: center;

        justify-content: center;

        gap: 7px;

        margin-top: 11px;

        padding: 12px;

        border:
          1px solid
          #e1d9cd;

        background: white;

        color: #26374c;

        font-size: 10px;

        font-weight: 750;

        text-decoration: none;
      }


      /* =====================================================
         STATE
      ===================================================== */

      .dj-private-state {
        min-height:
          calc(100vh - 82px);

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;

        padding: 80px 20px;

        text-align: center;

        background: #f8f5ee;

        color: #142238;
      }

      .dj-private-state-icon {
        width: 55px;
        height: 55px;

        display: grid;
        place-items: center;

        margin-bottom: 20px;

        border-radius: 50%;

        background: #102039;

        color: #dfbd80;

        font-family:
          Georgia,
          serif;

        font-size: 27px;
      }

      .dj-private-state-eyebrow {
        color: #b07d35;

        font-size: 9px;

        font-weight: 850;

        letter-spacing: .18em;
      }

      .dj-private-state h1 {
        margin: 13px 0 10px;

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size:
          clamp(
            38px,
            5vw,
            60px
          );

        line-height: 1;

        font-weight: 500;

        letter-spacing: -.03em;
      }

      .dj-private-state p {
        max-width: 520px;

        margin: 0;

        color: #718096;

        font-size: 13px;

        line-height: 1.7;
      }

      .dj-private-primary {
        display: inline-flex;

        align-items: center;

        gap: 9px;

        margin-top: 25px;

        padding: 13px 18px;

        background: #102039;

        color: white;

        font-size: 11px;

        font-weight: 800;

        text-decoration: none;
      }

      .dj-private-secondary {
        display: inline-flex;

        align-items: center;

        justify-content: center;

        margin-top: 25px;

        padding: 13px 18px;

        border:
          1px solid
          #ddd5c9;

        background: white;

        color: #24364c;

        font-size: 11px;

        font-weight: 800;

        text-decoration: none;
      }

      .dj-private-state-actions {
        display: flex;

        gap: 9px;

        flex-wrap: wrap;

        justify-content: center;
      }

      .dj-private-loader {
        width: 30px;
        height: 30px;

        margin-bottom: 20px;

        border:
          2px solid
          #e4ddd2;

        border-top-color:
          #b07d35;

        border-radius: 50%;

        animation:
          dj-private-spin
          .75s
          linear
          infinite;
      }

      @keyframes dj-private-spin {
        to {
          transform: rotate(360deg);
        }
      }


      /* =====================================================
         TABLET
      ===================================================== */

      @media (max-width: 1000px) {

        .dj-private-hero-grid {
          grid-template-columns: 1fr;

          gap: 35px;
        }

        .dj-private-hero-image {
          width: min(
            600px,
            100%
          );

          height: 390px;
        }

        .dj-private-layout {
          grid-template-columns: 1fr;
        }

        .dj-private-sidebar {
          position: static;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 12px;
        }

        .dj-private-sidebar-back {
          grid-column: span 2;
        }

      }


      /* =====================================================
         MOBILE
      ===================================================== */

      @media (max-width: 700px) {

        .dj-private-container {
          width:
            calc(100% - 28px);
        }

        .dj-private-hero {
          padding:
            35px 0 45px;
        }

        .dj-private-back {
          margin-bottom: 30px;
        }

        .dj-private-hero h1 {
          font-size: 45px;
        }

        .dj-private-description {
          font-size: 13px;
        }

        .dj-private-meta {
          display: grid;

          grid-template-columns:
            1fr 1fr;
        }

        .dj-private-meta span {
          min-width: 0;
        }

        .dj-private-hero-image {
          height: 300px;

          border-radius:
            20px
            20px
            55px
            20px;
        }

        .dj-private-access-inner {
          min-height: auto;

          padding: 15px 0;

          align-items:
            flex-start;

          flex-direction: column;
        }

        .dj-private-access-phone {
          padding-left: 42px;
        }

        .dj-private-content {
          padding:
            45px 0 75px;
        }

        .dj-private-section {
          margin-bottom: 42px;
        }

        .dj-private-section-head {
          align-items:
            flex-start;
        }

        .dj-private-section-head h2 {
          font-size: 29px;
        }

        .dj-private-material {
          align-items:
            flex-start;

          flex-wrap: wrap;
        }

        .dj-private-material-body {
          min-width:
            calc(
              100% - 67px
            );
        }

        .dj-private-video-frame video {
          max-height: 360px;
        }

        .dj-private-pdf-frame {
          height: 500px;
        }

        .dj-private-material-action {
          width: 100%;
        }

        .dj-private-open-button,
        .dj-private-live-button {
          width: 100%;
        }

        .dj-private-sidebar {
          display: flex;

          flex-direction: column;
        }

        .dj-private-sidebar-back {
          width: 100%;
        }

      }


      /* =====================================================
         SMALL MOBILE
      ===================================================== */

      @media (max-width: 430px) {

        .dj-private-hero h1 {
          font-size: 39px;
        }

        .dj-private-meta {
          grid-template-columns:
            1fr 1fr;
        }

        .dj-private-meta span {
          padding: 10px;
        }

        .dj-private-section-head {
          gap: 10px;
        }

        .dj-private-section-head h2 {
          font-size: 26px;
        }

        .dj-private-count {
          min-width: 30px;
          height: 30px;
        }

      }

    `}</style>
  );
}