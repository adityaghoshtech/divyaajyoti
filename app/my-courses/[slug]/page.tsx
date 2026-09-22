"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


/* =========================================================
   MATERIAL TYPE
========================================================= */

type Material = {
  _id: string;

  courseSlug: string;

  title: string;

  type: string;

  description?: string;

  url?: string | null;

  storageId?: string | null;

  storageUrl?: string | null;

  sortOrder: number;

  status: string;

  createdAt?: number;

  updatedAt?: number;
};


/* =========================================================
   HELPERS
========================================================= */

function normalizeType(
  type?: string,
) {
  return String(
    type ?? "",
  )
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}


/* =========================================================
   RECORDED CLASS
========================================================= */

function isRecordedClass(
  material: Material,
) {

  const type =
    normalizeType(
      material.type,
    );

  return (
    type === "VIDEO" ||
    type === "RECORDED" ||
    type === "RECORDED_CLASS" ||
    type === "RECORDING"
  );
}


/* =========================================================
   PDF
========================================================= */

function isPdf(
  material: Material,
) {

  const type =
    normalizeType(
      material.type,
    );

  return (
    type === "PDF" ||
    type === "DOCUMENT"
  );
}


/* =========================================================
   NOTE
========================================================= */

function isNote(
  material: Material,
) {

  const type =
    normalizeType(
      material.type,
    );

  return (
    type === "NOTE" ||
    type === "NOTES"
  );
}


/* =========================================================
   LIVE CLASS
========================================================= */

function isLiveClass(
  material: Material,
) {

  const type =
    normalizeType(
      material.type,
    );

  return (
    type === "LIVE_CLASS" ||
    type === "GOOGLE_MEET" ||
    type === "MEET" ||
    type === "LIVE"
  );
}


/* =========================================================
   RESOURCE
========================================================= */

function isResource(
  material: Material,
) {

  const type =
    normalizeType(
      material.type,
    );

  return (
    type === "RESOURCE" ||
    type === "LINK"
  );
}


/* =========================================================
   MATERIAL LABEL
========================================================= */

function materialLabel(
  material: Material,
) {

  if (
    isRecordedClass(
      material,
    )
  ) {
    return "RECORDED CLASS";
  }

  if (
    isPdf(
      material,
    )
  ) {
    return "PDF";
  }

  if (
    isNote(
      material,
    )
  ) {
    return "COURSE NOTE";
  }

  if (
    isLiveClass(
      material,
    )
  ) {
    return "LIVE CLASS";
  }

  if (
    isResource(
      material,
    )
  ) {
    return "RESOURCE";
  }

  return "COURSE MATERIAL";
}


/* =========================================================
   PAGE
========================================================= */

export default function PrivateCoursePage() {

  const params =
    useParams();

  const slug =
    typeof params?.slug ===
    "string"
      ? params.slug
      : "";


  /* =======================================================
     STUDENT PHONE
  ======================================================= */

  const [
    phone,
    setPhone,
  ] =
    useState("");


  useEffect(() => {

    const storedPhone =
      window.localStorage.getItem(
        "divyajyoti_student_phone",
      );

    if (
      storedPhone
    ) {

      setPhone(
        storedPhone,
      );

    }

  }, []);


  /* =======================================================
     COURSE ACCESS
  ======================================================= */

  const access =
    useQuery(
      api.studentCourses.getCourseAccess,

      phone && slug
        ? {
            phone,
            courseSlug:
              slug,
          }
        : "skip",
    );


  /* =======================================================
     LOADING
  ======================================================= */

  const loading =
    Boolean(
      phone &&
      slug &&
      access ===
        undefined,
    );


  /* =======================================================
     MATERIALS
  ======================================================= */

  const materials =
    useMemo<Material[]>(
      () => {

        if (
          !access ||
          !Array.isArray(
            access.materials,
          )
        ) {
          return [];
        }

        return access.materials
          .map(
            (
              material,
            ): Material => ({

              _id:
                String(
                  material.id,
                ),

              courseSlug:
                slug,

              title:
                material.title,

              type:
                material.type,

              description:
                material.description ??
                "",

              url:
                material.url ??
                null,

              storageId:
                material.storageId ??
                null,

              storageUrl:
                material.storageUrl ??
                null,

              sortOrder:
                Number(
                  material.sortOrder ??
                    0,
                ),

              status:
                material.status ??
                "PUBLISHED",

            }),
          )
          .sort(
            (a, b) =>
              a.sortOrder -
              b.sortOrder,
          );

      },
      [
        access,
        slug,
      ],
    );


  /* =======================================================
     MATERIAL GROUPS
  ======================================================= */

  const recordedClasses =
    useMemo(
      () =>
        materials.filter(
          (
            material,
          ) =>
            isRecordedClass(
              material,
            ),
        ),
      [materials],
    );


  const pdfNotes =
    useMemo(
      () =>
        materials.filter(
          (
            material,
          ) =>
            isPdf(
              material,
            ),
        ),
      [materials],
    );


  const studyNotes =
    useMemo(
      () =>
        materials.filter(
          (
            material,
          ) =>
            isNote(
              material,
            ),
        ),
      [materials],
    );


  const liveClasses =
    useMemo(
      () =>
        materials.filter(
          (
            material,
          ) =>
            isLiveClass(
              material,
            ),
        ),
      [materials],
    );


  const resources =
    useMemo(
      () =>
        materials.filter(
          (
            material,
          ) =>
            isResource(
              material,
            ),
        ),
      [materials],
    );


  const otherMaterials =
    useMemo(
      () =>
        materials.filter(
          (
            material,
          ) =>
            !isRecordedClass(
              material,
            ) &&
            !isPdf(
              material,
            ) &&
            !isNote(
              material,
            ) &&
            !isLiveClass(
              material,
            ) &&
            !isResource(
              material,
            ),
        ),
      [materials],
    );


  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (
    loading
  ) {

    return (
      <>
        <main className="dj-private-state">

          <div className="dj-private-loader">
            D
          </div>

          <div className="dj-private-state-eyebrow">
            DIVYAJYOTI LEARNING
          </div>

          <h1>
            Loading your course...
          </h1>

          <p>
            Please wait while we prepare
            your private learning space.
          </p>

        </main>

        <PrivateCourseStyles />
      </>
    );
  }


  /* =======================================================
     NO PHONE
  ======================================================= */

  if (
    !phone
  ) {

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
            We could not find the student
            phone number used for your
            course enrollment.
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
     NO ACCESS
  ======================================================= */

  if (
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
            This course is not available
            for your current student account.
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


  /* =======================================================
     COURSE
  ======================================================= */

  const course =
    access.course;


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

              {/* ===========================================
                  HERO COPY
              =========================================== */}

              <div className="dj-private-hero-copy">

                <div className="dj-private-eyebrow">
                  PRIVATE LEARNING SPACE
                </div>

                <h1>
                  {course.title}
                </h1>

                <p>
                  {course.description}
                </p>


                <div className="dj-private-meta">

                  <div>
                    <span>
                      LESSONS
                    </span>

                    <strong>
                      {course.lessonCount}
                    </strong>
                  </div>


                  <div>
                    <span>
                      DURATION
                    </span>

                    <strong>
                      {course.duration}
                    </strong>
                  </div>


                  <div>
                    <span>
                      LEVEL
                    </span>

                    <strong>
                      {course.level}
                    </strong>
                  </div>

                </div>

              </div>


              {/* ===========================================
                  HERO IMAGE
              =========================================== */}

              <div className="dj-private-hero-image">

                <img
                  src={courseImage}
                  alt={
                    course.title
                  }
                />

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="dj-private-content">

          <div className="dj-private-container">

            <div className="dj-private-layout">

              {/* =========================================
                  MAIN CONTENT
              ========================================= */}

              <div className="dj-private-main">


                {/* =======================================
                    ACCESS CONFIRMED
                ======================================= */}

                <div className="dj-private-access">

                  <div className="dj-private-access-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Course access confirmed
                    </strong>

                    <span>
                      This learning space is available
                      to your approved enrollment.
                    </span>

                  </div>

                </div>


                {/* =======================================
                    RECORDED CLASSES
                ======================================= */}

                <CourseSection
                  eyebrow="RECORDED CLASSES"
                  title="Learn at your own pace."
                  description="Watch the recorded classes uploaded by your instructor."
                  count={
                    recordedClasses.length
                  }
                >

                  {recordedClasses.length >
                  0 ? (

                    <div className="dj-video-list">

                      {recordedClasses.map(
                        (
                          material,
                        ) => (
                          <RecordedClassCard
                            key={
                              material._id
                            }
                            material={
                              material
                            }
                          />
                        ),
                      )}

                    </div>

                  ) : (

                    <EmptyMaterials
                      title="No recorded classes yet"
                      description="Your instructor has not published any recorded classes for this course yet."
                    />

                  )}

                </CourseSection>


                {/* =======================================
                    LIVE CLASSES
                ======================================= */}

                {liveClasses.length >
                  0 && (

                  <CourseSection
                    eyebrow="LIVE CLASSES"
                    title="Join your live sessions."
                    description="Access upcoming live classes and Google Meet sessions."
                    count={
                      liveClasses.length
                    }
                  >

                    <div className="dj-material-list">

                      {liveClasses.map(
                        (
                          material,
                        ) => (
                          <MaterialCard
                            key={
                              material._id
                            }
                            material={
                              material
                            }
                          />
                        ),
                      )}

                    </div>

                  </CourseSection>

                )}


                {/* =======================================
                    PDFS
                ======================================= */}

                <CourseSection
                  eyebrow="COURSE NOTES"
                  title="Notes & PDFs"
                  description="Download or open the study documents provided by your instructor."
                  count={
                    pdfNotes.length
                  }
                >

                  {pdfNotes.length >
                  0 ? (

                    <div className="dj-material-list">

                      {pdfNotes.map(
                        (
                          material,
                        ) => (
                          <MaterialCard
                            key={
                              material._id
                            }
                            material={
                              material
                            }
                          />
                        ),
                      )}

                    </div>

                  ) : (

                    <EmptyMaterials
                      title="No notes available yet"
                      description="Course notes and PDFs will appear here when the admin publishes them."
                    />

                  )}

                </CourseSection>


                {/* =======================================
                    STUDY NOTES
                ======================================= */}

                {studyNotes.length >
                  0 && (

                  <CourseSection
                    eyebrow="STUDY MATERIAL"
                    title="Study notes."
                    description="Additional notes and learning material from your instructor."
                    count={
                      studyNotes.length
                    }
                  >

                    <div className="dj-material-list">

                      {studyNotes.map(
                        (
                          material,
                        ) => (
                          <MaterialCard
                            key={
                              material._id
                            }
                            material={
                              material
                            }
                          />
                        ),
                      )}

                    </div>

                  </CourseSection>

                )}


                {/* =======================================
                    RESOURCES
                ======================================= */}

                {resources.length >
                  0 && (

                  <CourseSection
                    eyebrow="RESOURCES"
                    title="Additional resources."
                    description="Useful links and resources shared with you."
                    count={
                      resources.length
                    }
                  >

                    <div className="dj-material-list">

                      {resources.map(
                        (
                          material,
                        ) => (
                          <MaterialCard
                            key={
                              material._id
                            }
                            material={
                              material
                            }
                          />
                        ),
                      )}

                    </div>

                  </CourseSection>

                )}


                {/* =======================================
                    OTHER MATERIALS
                ======================================= */}

                {otherMaterials.length >
                  0 && (

                  <CourseSection
                    eyebrow="COURSE CONTENT"
                    title="Additional course material."
                    description="Other resources published by your instructor."
                    count={
                      otherMaterials.length
                    }
                  >

                    <div className="dj-material-list">

                      {otherMaterials.map(
                        (
                          material,
                        ) => (
                          <MaterialCard
                            key={
                              material._id
                            }
                            material={
                              material
                            }
                          />
                        ),
                      )}

                    </div>

                  </CourseSection>

                )}


                {/* =======================================
                    EMPTY COURSE
                ======================================= */}

                {materials.length ===
                  0 && (

                  <section className="dj-private-ready">

                    <div className="dj-private-ready-icon">
                      +
                    </div>

                    <div className="dj-private-eyebrow">
                      COURSE CONTENT
                    </div>

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


              {/* =========================================
                  SIDEBAR
              ========================================= */}

              <aside className="dj-private-sidebar">

                <div className="dj-private-overview">

                  <div className="dj-private-sidebar-eyebrow">
                    COURSE OVERVIEW
                  </div>

                  <h2>
                    {course.title}
                  </h2>


                  <div className="dj-private-overview-row">

                    <span>
                      Lessons
                    </span>

                    <strong>
                      {course.lessonCount}
                    </strong>

                  </div>


                  <div className="dj-private-overview-row">

                    <span>
                      Duration
                    </span>

                    <strong>
                      {course.duration}
                    </strong>

                  </div>


                  <div className="dj-private-overview-row">

                    <span>
                      Level
                    </span>

                    <strong>
                      {course.level}
                    </strong>

                  </div>


                  <div className="dj-private-overview-row">

                    <span>
                      Materials
                    </span>

                    <strong>
                      {materials.length}
                    </strong>

                  </div>

                </div>


                <div className="dj-private-help">

                  <div className="dj-private-help-mark">
                    D
                  </div>

                  <h3>
                    Need help?
                  </h3>

                  <p>
                    If you cannot access a class,
                    PDF or Google Meet link,
                    contact the Divyajyoti team.
                  </p>

                  <Link
                    href="/contact"
                  >
                    Contact support
                    <span>→</span>
                  </Link>

                </div>


                <Link
                  href="/my-courses"
                  className="dj-private-back-card"
                >
                  ← Back to My Courses
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
   COURSE SECTION
========================================================= */

function CourseSection({
  eyebrow,
  title,
  description,
  count,
  children,
}: {
  eyebrow: string;

  title: string;

  description: string;

  count: number;

  children: React.ReactNode;
}) {

  return (
    <section className="dj-private-section">

      <div className="dj-private-section-heading">

        <div>

          <div className="dj-private-eyebrow">
            {eyebrow}
          </div>

          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>

        </div>


        <div className="dj-private-count">
          {count}
        </div>

      </div>


      {children}

    </section>
  );
}


/* =========================================================
   RECORDED CLASS CARD
========================================================= */

function RecordedClassCard({
  material,
}: {
  material: Material;
}) {

  /*
   * Uploaded Convex Storage video
   */
  const videoUrl =
    material.storageUrl ||
    null;


  /*
   * External video
   *
   * Example:
   * YouTube
   * Google Drive
   * Vimeo
   */
  const externalUrl =
    material.url ||
    null;


  return (
    <article className="dj-recorded-card">

      {/* ===============================================
          VIDEO
      =============================================== */}

      {videoUrl ? (

        <div className="dj-video-player">

          <video
            controls
            preload="metadata"
            playsInline
            src={
              videoUrl
            }
          />

        </div>

      ) : externalUrl ? (

        <div className="dj-external-video">

          <div className="dj-external-video-icon">
            ▶
          </div>

          <div>

            <span>
              EXTERNAL VIDEO
            </span>

            <h3>
              Watch recorded class
            </h3>

          </div>

          <a
            href={
              externalUrl
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Open video
            <span>→</span>
          </a>

        </div>

      ) : (

        <div className="dj-video-unavailable">

          <div>
            VIDEO
          </div>

          <p>
            The recorded class file
            is not available yet.
          </p>

        </div>

      )}


      {/* ===============================================
          VIDEO INFORMATION
      =============================================== */}

      <div className="dj-recorded-copy">

        <div className="dj-private-material-label">
          RECORDED CLASS
        </div>

        <h3>
          {material.title}
        </h3>

        {material.description && (

          <p>
            {material.description}
          </p>

        )}

      </div>

    </article>
  );
}


/* =========================================================
   NORMAL MATERIAL CARD
========================================================= */

function MaterialCard({
  material,
}: {
  material: Material;
}) {

  const storageUrl =
    material.storageUrl ||
    null;

  const externalUrl =
    material.url ||
    null;


  /*
   * For uploaded PDFs or files,
   * prefer Convex Storage URL.
   */
  const href =
    storageUrl ||
    externalUrl ||
    "#";


  const pdf =
    isPdf(
      material,
    );


  const live =
    isLiveClass(
      material,
    );


  return (
    <article className="dj-material-card">

      <div
        className={
          pdf
            ? "dj-material-icon pdf"
            : live
            ? "dj-material-icon live"
            : "dj-material-icon"
        }
      >

        {pdf
          ? "PDF"
          : live
          ? "LIVE"
          : "↗"}

      </div>


      <div className="dj-material-info">

        <span>
          {materialLabel(
            material,
          )}
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


      {href !== "#" && (

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="dj-material-open"
        >

          {pdf
            ? "Open PDF"
            : live
            ? "Join class"
            : "Open"}

          <span>
            →
          </span>

        </a>

      )}

    </article>
  );
}


/* =========================================================
   EMPTY MATERIALS
========================================================= */

function EmptyMaterials({
  title,
  description,
}: {
  title: string;

  description: string;
}) {

  return (
    <div className="dj-private-empty">

      <div className="dj-private-empty-icon">
        +
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   STYLES
========================================================= */

function PrivateCourseStyles() {

  return (
    <style jsx global>{`

      /* ===================================================
         BASE
      =================================================== */

      .dj-private-page {
        min-height: 100vh;
        background: #f7f3eb;
        color: #102039;
      }

      .dj-private-container {
        width: min(
          1420px,
          calc(100% - 48px)
        );
        margin: 0 auto;
      }


      /* ===================================================
         HERO
      =================================================== */

      .dj-private-hero {
        position: relative;
        overflow: hidden;
        padding:
          54px 0 72px;
        background:
          radial-gradient(
            circle at 75% 20%,
            rgba(
              211,
              161,
              82,
              0.15
            ),
            transparent 32%
          ),
          #f7f3eb;
      }

      .dj-private-hero-glow {
        position: absolute;
        width: 500px;
        height: 500px;
        right: -180px;
        top: -180px;
        border-radius: 50%;
        background:
          rgba(
            211,
            161,
            82,
            0.08
          );
        pointer-events: none;
      }

      .dj-private-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 42px;
        color: #68768b;
        text-decoration: none;
        font-size: 14px;
        font-weight: 700;
      }

      .dj-private-back:hover {
        color: #102039;
      }


      .dj-private-hero-grid {
        display: grid;
        grid-template-columns:
          minmax(0, 1fr)
          430px;
        gap: 72px;
        align-items: center;
      }


      .dj-private-hero-copy {
        max-width: 760px;
      }


      .dj-private-eyebrow {
        margin-bottom: 14px;
        color: #b87925;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 2.5px;
      }


      .dj-private-hero-copy h1 {
        margin: 0;
        max-width: 760px;
        color: #102039;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size:
          clamp(
            48px,
            5vw,
            76px
          );
        font-weight: 500;
        line-height: 1.03;
        letter-spacing: -2px;
      }


      .dj-private-hero-copy p {
        max-width: 680px;
        margin: 24px 0 0;
        color: #728198;
        font-size: 17px;
        line-height: 1.8;
      }


      .dj-private-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0;
        margin-top: 36px;
        border-top: 1px solid #ded7ca;
        border-bottom: 1px solid #ded7ca;
      }


      .dj-private-meta > div {
        min-width: 150px;
        padding:
          18px 30px 18px 0;
        margin-right: 30px;
        border-right: 1px solid #ded7ca;
      }


      .dj-private-meta > div:last-child {
        border-right: 0;
      }


      .dj-private-meta span {
        display: block;
        margin-bottom: 6px;
        color: #8a95a6;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.5px;
      }


      .dj-private-meta strong {
        color: #16243a;
        font-size: 14px;
        font-weight: 800;
        text-transform: uppercase;
      }


      .dj-private-hero-image {
        height: 470px;
        overflow: hidden;
        background: #ddd5c7;
      }


      .dj-private-hero-image img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }


      /* ===================================================
         CONTENT
      =================================================== */

      .dj-private-content {
        padding:
          70px 0 100px;
      }


      .dj-private-layout {
        display: grid;
        grid-template-columns:
          minmax(0, 1fr)
          360px;
        gap: 58px;
        align-items: start;
      }


      .dj-private-main {
        min-width: 0;
      }


      /* ===================================================
         ACCESS
      =================================================== */

      .dj-private-access {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 66px;
        padding: 20px 22px;
        border: 1px solid #dfd6c7;
        background: #fffdf9;
      }


      .dj-private-access-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        border-radius: 50%;
        background: #102039;
        color: #dcb263;
        font-size: 16px;
        font-weight: 900;
      }


      .dj-private-access strong {
        display: block;
        margin-bottom: 3px;
        color: #102039;
        font-size: 14px;
      }


      .dj-private-access span {
        color: #78869a;
        font-size: 13px;
      }


      /* ===================================================
         SECTION
      =================================================== */

      .dj-private-section {
        margin-bottom: 76px;
      }


      .dj-private-section-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 26px;
      }


      .dj-private-section-heading h2 {
        margin: 0;
        color: #102039;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size:
          clamp(
            36px,
            4vw,
            52px
          );
        font-weight: 500;
        line-height: 1.08;
        letter-spacing: -1px;
      }


      .dj-private-section-heading p {
        max-width: 680px;
        margin: 10px 0 0;
        color: #718096;
        font-size: 15px;
        line-height: 1.7;
      }


      .dj-private-count {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        border: 1px solid #ded5c6;
        border-radius: 50%;
        color: #9c671d;
        background: #fffdf9;
        font-size: 12px;
        font-weight: 900;
      }


      /* ===================================================
         VIDEO
      =================================================== */

      .dj-video-list {
        display: grid;
        gap: 24px;
      }


      .dj-recorded-card {
        overflow: hidden;
        border: 1px solid #ded7cb;
        background: #fff;
      }


      .dj-video-player {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: #081526;
      }


      .dj-video-player video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #081526;
      }


      .dj-recorded-copy {
        padding:
          25px 28px 29px;
      }


      .dj-private-material-label {
        margin-bottom: 8px;
        color: #b87925;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }


      .dj-recorded-copy h3 {
        margin: 0;
        color: #102039;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 26px;
        font-weight: 500;
      }


      .dj-recorded-copy p {
        margin: 10px 0 0;
        color: #718096;
        font-size: 14px;
        line-height: 1.7;
      }


      /* ===================================================
         EXTERNAL VIDEO
      =================================================== */

      .dj-external-video {
        display: flex;
        align-items: center;
        gap: 18px;
        padding: 26px;
        background: #102039;
        color: white;
      }


      .dj-external-video-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        flex: 0 0 52px;
        border-radius: 50%;
        background: #dcb263;
        color: #102039;
        font-size: 16px;
      }


      .dj-external-video > div:nth-child(2) {
        flex: 1;
      }


      .dj-external-video span {
        display: block;
        margin-bottom: 5px;
        color: #dcb263;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }


      .dj-external-video h3 {
        margin: 0;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 23px;
        font-weight: 500;
      }


      .dj-external-video a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }


      .dj-video-unavailable {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        min-height: 250px;
        background: #101c2e;
        color: white;
        text-align: center;
      }


      .dj-video-unavailable div {
        margin-bottom: 10px;
        color: #dcb263;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 2px;
      }


      .dj-video-unavailable p {
        margin: 0;
        color: #aab5c4;
        font-size: 13px;
      }


      /* ===================================================
         MATERIALS
      =================================================== */

      .dj-material-list {
        display: grid;
        gap: 12px;
      }


      .dj-material-card {
        display: flex;
        align-items: center;
        gap: 18px;
        padding: 20px 22px;
        border: 1px solid #ded7cb;
        background: #fff;
        transition:
          transform 0.2s ease,
          border-color 0.2s ease;
      }


      .dj-material-card:hover {
        transform: translateY(-2px);
        border-color: #c8b79d;
      }


      .dj-material-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        flex: 0 0 50px;
        background: #f4ecdc;
        color: #a86f20;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1px;
      }


      .dj-material-icon.pdf {
        background: #f4e7d7;
        color: #9d5c19;
      }


      .dj-material-icon.live {
        background: #102039;
        color: #dcb263;
      }


      .dj-material-info {
        min-width: 0;
        flex: 1;
      }


      .dj-material-info > span {
        display: block;
        margin-bottom: 5px;
        color: #a96f20;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.6px;
      }


      .dj-material-info h3 {
        margin: 0;
        color: #102039;
        font-size: 16px;
        font-weight: 800;
      }


      .dj-material-info p {
        margin: 5px 0 0;
        color: #7a8799;
        font-size: 13px;
        line-height: 1.6;
      }


      .dj-material-open {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
        color: #102039;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }


      .dj-material-open:hover {
        color: #b87925;
      }


      /* ===================================================
         EMPTY
      =================================================== */

      .dj-private-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        min-height: 235px;
        padding: 40px;
        border: 1px dashed #d8cebd;
        background: #fffdf9;
        text-align: center;
      }


      .dj-private-empty-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        margin-bottom: 18px;
        border-radius: 13px;
        background: #f7edd9;
        color: #b87925;
        font-size: 25px;
      }


      .dj-private-empty h3 {
        margin: 0;
        color: #102039;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 25px;
        font-weight: 500;
      }


      .dj-private-empty p {
        max-width: 540px;
        margin: 9px 0 0;
        color: #7b889b;
        font-size: 13px;
        line-height: 1.7;
      }


      /* ===================================================
         READY
      =================================================== */

      .dj-private-ready {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        min-height: 360px;
        padding: 60px;
        border: 1px solid #ded7cb;
        background: #fff;
        text-align: center;
      }


      .dj-private-ready-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        margin-bottom: 26px;
        border-radius: 14px;
        background: #f6ead5;
        color: #b87925;
        font-size: 30px;
      }


      .dj-private-ready h2 {
        margin: 0;
        color: #102039;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 38px;
        font-weight: 500;
      }


      .dj-private-ready p {
        max-width: 650px;
        margin: 14px 0 0;
        color: #748197;
        font-size: 15px;
        line-height: 1.7;
      }


      /* ===================================================
         SIDEBAR
      =================================================== */

      .dj-private-sidebar {
        position: sticky;
        top: 105px;
      }


      .dj-private-overview {
        border: 1px solid #ddd5c8;
        background: #fff;
      }


      .dj-private-sidebar-eyebrow {
        padding:
          27px 28px 0;
        color: #b87925;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }


      .dj-private-overview h2 {
        margin: 14px 28px 25px;
        color: #102039;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 30px;
        font-weight: 500;
        line-height: 1.15;
      }


      .dj-private-overview-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding:
          16px 28px;
        border-top: 1px solid #e7e0d5;
      }


      .dj-private-overview-row span {
        color: #8793a4;
        font-size: 12px;
      }


      .dj-private-overview-row strong {
        color: #19263a;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
      }


      /* ===================================================
         HELP
      =================================================== */

      .dj-private-help {
        margin-top: 16px;
        padding: 28px;
        background: #102039;
        color: white;
      }


      .dj-private-help-mark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        margin-bottom: 22px;
        border-radius: 50%;
        background: #dcb263;
        color: #102039;
        font-family:
          Georgia,
          serif;
        font-size: 20px;
      }


      .dj-private-help h3 {
        margin: 0;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 23px;
        font-weight: 500;
      }


      .dj-private-help p {
        margin: 9px 0 22px;
        color: #aeb9c8;
        font-size: 13px;
        line-height: 1.7;
      }


      .dj-private-help a {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        color: #e0bc73;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }


      .dj-private-back-card {
        display: block;
        margin-top: 14px;
        padding: 17px;
        border: 1px solid #ddd5c8;
        background: #fff;
        color: #27354a;
        text-align: center;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }


      .dj-private-back-card:hover {
        border-color: #c9b99e;
      }


      /* ===================================================
         STATE
      =================================================== */

      .dj-private-state {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        min-height: calc(100vh - 100px);
        padding: 60px 24px;
        background: #f7f3eb;
        text-align: center;
      }


      .dj-private-state-icon,
      .dj-private-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        height: 58px;
        margin-bottom: 24px;
        border-radius: 50%;
        background: #102039;
        color: #dcb263;
        font-family:
          Georgia,
          serif;
        font-size: 25px;
      }


      .dj-private-state-eyebrow {
        margin-bottom: 10px;
        color: #b87925;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }


      .dj-private-state h1 {
        margin: 0;
        color: #102039;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size:
          clamp(
            38px,
            5vw,
            58px
          );
        font-weight: 500;
      }


      .dj-private-state p {
        max-width: 520px;
        margin: 15px 0 28px;
        color: #748197;
        font-size: 15px;
        line-height: 1.7;
      }


      .dj-private-primary {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding:
          14px 20px;
        background: #102039;
        color: white;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }


      .dj-private-primary:hover {
        background: #182d49;
      }


      .dj-private-secondary {
        display: inline-flex;
        align-items: center;
        padding:
          14px 20px;
        border: 1px solid #d8cebd;
        background: #fff;
        color: #26354b;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }


      .dj-private-state-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
      }


      /* ===================================================
         RESPONSIVE
      =================================================== */

      @media (
        max-width: 1100px
      ) {

        .dj-private-hero-grid {
          grid-template-columns:
            minmax(0, 1fr)
            340px;

          gap: 42px;
        }

        .dj-private-layout {
          grid-template-columns:
            minmax(0, 1fr)
            320px;

          gap: 35px;
        }

      }


      @media (
        max-width: 850px
      ) {

        .dj-private-hero-grid {
          grid-template-columns: 1fr;
        }

        .dj-private-hero-image {
          height: 330px;
        }

        .dj-private-layout {
          grid-template-columns: 1fr;
        }

        .dj-private-sidebar {
          position: static;
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 16px;
        }

        .dj-private-help {
          margin-top: 0;
        }

        .dj-private-back-card {
          grid-column: 1 / -1;
          margin-top: 0;
        }

      }


      @media (
        max-width: 620px
      ) {

        .dj-private-container {
          width: min(
            100% - 30px,
            1420px
          );
        }

        .dj-private-hero {
          padding:
            35px 0 55px;
        }

        .dj-private-back {
          margin-bottom: 30px;
        }

        .dj-private-hero-copy h1 {
          font-size: 44px;
          letter-spacing: -1.2px;
        }

        .dj-private-hero-image {
          height: 280px;
        }

        .dj-private-content {
          padding:
            50px 0 70px;
        }

        .dj-private-section-heading {
          align-items: flex-start;
        }

        .dj-private-section-heading h2 {
          font-size: 36px;
        }

        .dj-private-meta > div {
          min-width: 120px;
          padding-right: 18px;
          margin-right: 18px;
        }

        .dj-private-sidebar {
          display: block;
        }

        .dj-private-help {
          margin-top: 16px;
        }

        .dj-private-back-card {
          margin-top: 14px;
        }

        .dj-material-card {
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .dj-material-open {
          width: 100%;
          margin-left: 68px;
        }

        .dj-external-video {
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .dj-external-video a {
          width: 100%;
          margin-left: 70px;
        }

      }

    `}</style>
  );
}