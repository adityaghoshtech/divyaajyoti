"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

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

type Filter = "all" | "astrology" | "real-estate";

export default function EducationPage() {
  const courses = useQuery(api.courses.list, {});

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  if (courses === undefined) {
    return (
      <main className="dj-education">
        <section className="dj-loading">
          <div className="dj-loading-inner">
            <span className="dj-loading-mark">D</span>
            <p>Loading learning paths...</p>
          </div>
        </section>

        <EducationStyles />
      </main>
    );
  }

  const publishedCourses: Course[] = courses
    .filter((course) => course.status === "published")
    .map((course) => ({
      ...course,
      category: course.category || "ASTROLOGY",
      duration: course.duration || "",
      level: course.level || "Beginner",
      price: course.price ?? 0,
      image:
        course.image ||
        course.images?.[0] ||
        getFallbackImage(course.category),
    }));

  const filteredCourses = publishedCourses.filter((course) => {
    const category = normalizeCategory(course.category);

    const matchesFilter =
      filter === "all" ||
      (filter === "astrology" && category === "ASTROLOGY") ||
      
      (filter === "real-estate" && category === "REAL_ESTATE");

    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      String(course.category || "")
        .toLowerCase()
        .includes(query);

    return matchesFilter && matchesSearch;
  });

  const astrologyCount = publishedCourses.filter(
    (course) =>
      normalizeCategory(course.category) === "ASTROLOGY"
  ).length;

  

  const realEstateCount = publishedCourses.filter(
    (course) =>
      normalizeCategory(course.category) === "REAL_ESTATE"
  ).length;

  return (
    <main className="dj-education">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="dj-education-hero">
        <div className="dj-hero-orbit dj-orbit-one" />
        <div className="dj-hero-orbit dj-orbit-two" />
        <div className="dj-hero-orbit dj-orbit-three" />

        <div className="dj-hero-glow" />

        <div className="dj-container dj-hero-container">
          <div className="dj-hero-copy">
            <div className="dj-eyebrow dj-eyebrow-light">
              DIVYAJYOTI · EDUCATION
            </div>

            <h1>
              Learn with structure.
              <br />
              Grow with knowledge.
            </h1>

            <p>
              Explore focused learning paths in astrology,
              vastu and real estate, with recorded classes
              and practical resources.
            </p>

            <div className="dj-hero-actions">
              <a
                href="#courses"
                className="dj-button dj-button-gold"
              >
                Explore courses
                <span>→</span>
              </a>

              <Link
                href="/my-courses"
                className="dj-button dj-button-outline"
              >
                <span className="dj-button-icon">□</span>
                My Courses
              </Link>
            </div>
          </div>

          <div className="dj-hero-art">
            <div className="dj-art-label">
              <span>KNOWLEDGE</span>
              <span>CREATES</span>
              <span>CLARITY</span>
            </div>

            <div className="dj-sun">
              <div className="dj-sun-core" />
              <div className="dj-sun-rays" />
            </div>

            <div className="dj-moon dj-moon-one" />
            <div className="dj-moon dj-moon-two" />

            <span className="dj-star dj-star-one">✦</span>
            <span className="dj-star dj-star-two">·</span>
            <span className="dj-star dj-star-three">✦</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          COURSE SECTION
      ===================================================== */}

      <section
        id="courses"
        className="dj-course-section"
      >
        <div className="dj-container">
          <div className="dj-section-top">
            <div>
              <div className="dj-eyebrow">
                01 / COURSES
              </div>

              <h2>
                Learning paths for deeper
                <br className="dj-desktop-break" />
                understanding.
              </h2>

              <p>
                Explore courses built for beginners,
                developing learners and advanced study.
              </p>
            </div>

            <div className="dj-course-count">
              <strong>{publishedCourses.length}</strong>
              <span>
                {publishedCourses.length === 1
                  ? "course"
                  : "courses"}
              </span>
            </div>
          </div>

          {/* FILTER BAR */}

          <div className="dj-course-toolbar">
            <div className="dj-filters">
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All Courses
                <small>{publishedCourses.length}</small>
              </FilterButton>

              <FilterButton
                active={filter === "astrology"}
                onClick={() => setFilter("astrology")}
              >
                Astrology
                <small>{astrologyCount}</small>
              </FilterButton>

              

              <FilterButton
                active={filter === "real-estate"}
                onClick={() => setFilter("real-estate")}
              >
                Real Estate
                <small>{realEstateCount}</small>
              </FilterButton>
            </div>

            <div className="dj-search">
              <span className="dj-search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          {/* COURSE GRID */}

          {filteredCourses.length > 0 ? (
            <div className="dj-course-grid">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                />
              ))}
            </div>
          ) : (
            <div className="dj-empty">
              <div className="dj-empty-symbol">D</div>

              <h3>No courses found</h3>

              <p>
                Try another category or search term.
              </p>

              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                }}
              >
                View all courses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          LEARNING PRINCIPLES
      ===================================================== */}

      <section className="dj-learning-strip">
        <div className="dj-container">
          <div className="dj-learning-grid">
            <LearningPoint
              number="01"
              title="Structured Learning"
              text="Step-by-step courses"
            />

            <LearningPoint
              number="02"
              title="Recorded Classes"
              text="Learn at your own pace"
            />

            <LearningPoint
              number="03"
              title="Practical Resources"
              text="Notes, charts and examples"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="dj-learning-cta">
        <div className="dj-container">
          <div className="dj-cta-layout">
            <div className="dj-cta-copy">
              <div className="dj-vertical-line" />

              <div>
                <div className="dj-eyebrow">
                  LEARNING AT DIVYAJYOTI
                </div>

                <h2>
                  Knowledge for a
                  <br />
                  better tomorrow.
                </h2>

                <p>
                  Practical. Authentic. Easy to learn.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="dj-contact-card"
            >
              <span className="dj-contact-icon">
                ◌
              </span>

              <span>
                <strong>Have questions?</strong>
                <small>
                  Get in touch with our team
                </small>
              </span>

              <b>→</b>
            </Link>
          </div>
        </div>
      </section>

      <EducationStyles />
    </main>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`dj-filter ${
        active ? "dj-filter-active" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* =========================================================
   COURSE CARD
========================================================= */

function CourseCard({
  course,
}: {
  course: Course;
}) {
  const lessonCount = getLessonCount(course.lessons);

  const image =
    course.image ||
    course.images?.[0] ||
    getFallbackImage(course.category);

  const category = formatCategory(course.category);

  return (
    <article className="dj-course-card">
      {/* IMAGE */}

      <Link
        href={`/education/${course.slug}`}
        className="dj-course-media"
      >
        <div
          className="dj-course-image"
          style={{
            backgroundImage: `url("${image}")`,
          }}
        />

        <div className="dj-course-overlay" />

        <span className="dj-course-level">
          {course.level}
        </span>

        <span className="dj-course-bookmark">
          ♧
        </span>
      </Link>

      {/* CONTENT */}

      <div className="dj-course-content">
        <div className="dj-course-category">
          {category}
        </div>

        <Link
          href={`/education/${course.slug}`}
          className="dj-course-title"
        >
          {course.title}
        </Link>

        <p className="dj-course-description">
          {course.description}
        </p>

        <div className="dj-course-details">
          <span>
            <i>□</i>
            {lessonCount} lessons
          </span>

          <span>
            <i>◷</i>
            {course.duration || "Self paced"}
          </span>

          <span>
            <i>▥</i>
            {course.level}
          </span>
        </div>

        <div className="dj-course-footer">
          <div className="dj-course-price">
            {course.price && course.price > 0 ? (
              <>
                <small>Course fee</small>
                <strong>
                  ₹{course.price.toLocaleString("en-IN")}
                </strong>
              </>
            ) : (
              <>
                <small>Course access</small>
                <strong>Available</strong>
              </>
            )}
          </div>

          <Link
            href={`/education/${course.slug}`}
            className="dj-view-course"
          >
            View Course
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   LEARNING POINT
========================================================= */

function LearningPoint({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="dj-learning-point">
      <div className="dj-learning-number">
        {number}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getLessonCount(
  lessons: number | number[]
) {
  if (Array.isArray(lessons)) {
    return lessons.length;
  }

  return Number(lessons || 0);
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

  if (normalized === "ASTROLOGY") {
    return "ASTROLOGY";
  }

  return normalized;
}

function formatCategory(
  category?: string
) {
  const normalized = normalizeCategory(category);

  if (normalized === "REAL_ESTATE") {
    return "REAL ESTATE";
  }

  if (normalized === "VASTU") {
    return "VASTU";
  }

  if (normalized === "ASTROLOGY") {
    return "ASTROLOGY";
  }

  return category || "ASTROLOGY";
}

function getFallbackImage(
  category?: string
) {
  const normalized = normalizeCategory(category);

  if (normalized === "REAL_ESTATE") {
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85";
  }

  if (normalized === "VASTU") {
    return "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85";
  }

  return "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85";
}

/* =========================================================
   PAGE CSS
========================================================= */

function EducationStyles() {
  return (
    <style jsx global>{`
      /* =====================================================
         ROOT
      ===================================================== */

      .dj-education {
        --dj-navy: #0b1d33;
        --dj-navy-2: #102944;
        --dj-cream: #fbfaf6;
        --dj-white: #ffffff;
        --dj-gold: #c99845;
        --dj-gold-light: #e6c98d;
        --dj-text: #10233c;
        --dj-muted: #6d7c91;
        --dj-border: #e7e4dc;

        width: 100%;
        overflow: hidden;
        background: var(--dj-cream);
        color: var(--dj-text);
      }

      .dj-container {
        width: min(1180px, calc(100% - 96px));
        margin: 0 auto;
      }

      /* =====================================================
         LOADING
      ===================================================== */

      .dj-loading {
        min-height: 70vh;
        display: grid;
        place-items: center;
        background: var(--dj-cream);
      }

      .dj-loading-inner {
        text-align: center;
        color: var(--dj-muted);
      }

      .dj-loading-mark {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        margin: 0 auto 16px;
        border-radius: 50%;
        background: var(--dj-navy);
        color: white;
        font-family: Georgia, serif;
        font-size: 24px;
      }

      .dj-loading-inner p {
        margin: 0;
        font-size: 14px;
      }

      /* =====================================================
         HERO
      ===================================================== */

      .dj-education-hero {
        position: relative;
        min-height: 465px;
        display: flex;
        align-items: center;
        overflow: hidden;
        background:
          radial-gradient(
            circle at 80% 50%,
            rgba(49, 78, 108, 0.35),
            transparent 34%
          ),
          linear-gradient(
            110deg,
            #091b30 0%,
            #0b2038 55%,
            #0a1b30 100%
          );
        color: white;
      }

      .dj-hero-container {
        position: relative;
        z-index: 4;
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(350px, 0.9fr);
        align-items: center;
        min-height: 465px;
      }

      .dj-hero-copy {
        padding: 64px 0;
      }

      .dj-eyebrow {
        margin-bottom: 17px;
        color: var(--dj-gold);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 3px;
        text-transform: uppercase;
      }

      .dj-eyebrow-light {
        color: #d5a858;
      }

      .dj-hero-copy h1 {
        max-width: 700px;
        margin: 0;
        color: #fff;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(48px, 5.4vw, 76px);
        font-weight: 400;
        letter-spacing: -3.5px;
        line-height: 0.98;
      }

      .dj-hero-copy p {
        max-width: 590px;
        margin: 28px 0 0;
        color: #c5d0dd;
        font-size: 17px;
        line-height: 1.7;
      }

      .dj-hero-actions {
        display: flex;
        align-items: center;
        gap: 13px;
        margin-top: 30px;
      }

      .dj-button {
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 0 21px;
        border-radius: 999px;
        text-decoration: none;
        font-size: 14px;
        font-weight: 750;
        transition:
          transform 180ms ease,
          background 180ms ease,
          border-color 180ms ease;
      }

      .dj-button:hover {
        transform: translateY(-2px);
      }

      .dj-button-gold {
        background: #e6c98d;
        color: #12243a;
      }

      .dj-button-gold:hover {
        background: #efd8a8;
      }

      .dj-button-outline {
        border: 1px solid rgba(255, 255, 255, 0.35);
        color: white;
        background: rgba(255, 255, 255, 0.03);
      }

      .dj-button-outline:hover {
        border-color: rgba(255, 255, 255, 0.65);
      }

      .dj-button-icon {
        font-size: 15px;
      }

      /* =====================================================
         HERO ART
      ===================================================== */

      .dj-hero-art {
        position: relative;
        height: 420px;
      }

      .dj-hero-orbit {
        position: absolute;
        top: 50%;
        left: 50%;
        border: 1px solid rgba(214, 170, 92, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }

      .dj-orbit-one {
        width: 310px;
        height: 310px;
      }

      .dj-orbit-two {
        width: 430px;
        height: 430px;
      }

      .dj-orbit-three {
        width: 560px;
        height: 560px;
        border-color: rgba(214, 170, 92, 0.16);
      }

      .dj-hero-glow {
        position: absolute;
        width: 300px;
        height: 300px;
        right: 10%;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        background: rgba(216, 164, 77, 0.08);
        filter: blur(25px);
      }

      .dj-sun {
        position: absolute;
        top: 50%;
        left: 51%;
        width: 104px;
        height: 104px;
        transform: translate(-50%, -50%);
      }

      .dj-sun-core {
        position: absolute;
        inset: 24px;
        border-radius: 50%;
        background:
          radial-gradient(
            circle at 40% 35%,
            #f2dfb4,
            #c79b51 70%
          );
        box-shadow:
          0 0 30px rgba(221, 174, 90, 0.35),
          0 0 70px rgba(221, 174, 90, 0.12);
      }

      .dj-sun-rays {
        position: absolute;
        inset: 0;
        border: 1px solid rgba(221, 174, 90, 0.6);
        border-radius: 50%;
      }

      .dj-sun-rays::before,
      .dj-sun-rays::after {
        content: "";
        position: absolute;
        inset: 7px;
        border: 1px dashed rgba(221, 174, 90, 0.4);
        border-radius: 50%;
      }

      .dj-moon {
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #e9d3a1;
      }

      .dj-moon-one {
        top: 26%;
        right: 22%;
      }

      .dj-moon-two {
        bottom: 22%;
        left: 19%;
        width: 29px;
        height: 29px;
        opacity: 0.9;
      }

      .dj-star {
        position: absolute;
        color: #d7ad63;
      }

      .dj-star-one {
        top: 20%;
        left: 22%;
        font-size: 14px;
      }

      .dj-star-two {
        top: 33%;
        right: 13%;
        font-size: 24px;
      }

      .dj-star-three {
        bottom: 20%;
        right: 27%;
        font-size: 12px;
      }

      .dj-art-label {
        position: absolute;
        z-index: 5;
        top: 50%;
        left: 3%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        transform: translateY(-50%);
        color: #d8bd87;
        font-family: Georgia, serif;
        font-size: 12px;
        letter-spacing: 3px;
        line-height: 1.5;
      }

      /* =====================================================
         COURSE SECTION
      ===================================================== */

      .dj-course-section {
        padding: 72px 0 82px;
        background: var(--dj-cream);
      }

      .dj-section-top {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 50px;
      }

      .dj-section-top h2 {
        max-width: 850px;
        margin: 0;
        color: var(--dj-text);
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(40px, 4.2vw, 60px);
        font-weight: 400;
        letter-spacing: -2.7px;
        line-height: 1.02;
      }

      .dj-section-top p {
        max-width: 660px;
        margin: 17px 0 0;
        color: var(--dj-muted);
        font-size: 16px;
        line-height: 1.65;
      }

      .dj-course-count {
        min-width: 85px;
        padding-bottom: 8px;
        text-align: right;
      }

      .dj-course-count strong {
        display: block;
        color: var(--dj-text);
        font-size: 20px;
        font-weight: 750;
      }

      .dj-course-count span {
        color: var(--dj-muted);
        font-size: 13px;
      }

      /* =====================================================
         TOOLBAR
      ===================================================== */

      .dj-course-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
        margin: 42px 0 26px;
        padding-bottom: 18px;
        border-bottom: 1px solid var(--dj-border);
      }

      .dj-filters {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .dj-filter {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        height: 42px;
        padding: 0 15px;
        border: 1px solid transparent;
        border-radius: 999px;
        background: #f1f0eb;
        color: #34445a;
        cursor: pointer;
        font-family: inherit;
        font-size: 13px;
        font-weight: 650;
        transition:
          background 160ms ease,
          color 160ms ease,
          transform 160ms ease;
      }

      .dj-filter:hover {
        transform: translateY(-1px);
        background: #e9e7df;
      }

      .dj-filter small {
        opacity: 0.65;
        font-size: 11px;
      }

      .dj-filter-active {
        background: var(--dj-navy);
        color: white;
      }

      .dj-filter-active:hover {
        background: var(--dj-navy);
      }

      .dj-search {
        width: 250px;
        height: 44px;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 0 14px;
        border: 1px solid #dedbd2;
        border-radius: 8px;
        background: white;
      }

      .dj-search-icon {
        color: #7d8794;
        font-size: 22px;
        line-height: 1;
      }

      .dj-search input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--dj-text);
        font-family: inherit;
        font-size: 13px;
      }

      .dj-search input::placeholder {
        color: #9ba3ae;
      }

      /* =====================================================
         COURSE GRID
      ===================================================== */

      .dj-course-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 22px;
      }

      .dj-course-card {
        overflow: hidden;
        border: 1px solid #e5e2da;
        border-radius: 12px;
        background: white;
        box-shadow: 0 8px 30px rgba(23, 35, 48, 0.045);
        transition:
          transform 200ms ease,
          box-shadow 200ms ease,
          border-color 200ms ease;
      }

      .dj-course-card:hover {
        transform: translateY(-4px);
        border-color: #d8d3c8;
        box-shadow: 0 18px 45px rgba(23, 35, 48, 0.09);
      }

      /* =====================================================
         COURSE IMAGE
      ===================================================== */

      .dj-course-media {
        position: relative;
        display: block;
        height: 245px;
        overflow: hidden;
        background: #e9ecee;
        text-decoration: none;
      }

      .dj-course-image {
        position: absolute;
        inset: 0;
        background-position: center;
        background-size: cover;
        transition: transform 450ms ease;
      }

      .dj-course-card:hover .dj-course-image {
        transform: scale(1.035);
      }

      .dj-course-overlay {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            180deg,
            rgba(5, 17, 31, 0.08),
            transparent 45%,
            rgba(5, 17, 31, 0.18)
          );
      }

      .dj-course-level {
        position: absolute;
        top: 18px;
        left: 18px;
        padding: 7px 11px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.94);
        color: var(--dj-navy);
        font-size: 10px;
        font-weight: 850;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .dj-course-bookmark {
        position: absolute;
        top: 17px;
        right: 17px;
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.95);
        color: var(--dj-navy);
        font-size: 17px;
      }

      /* =====================================================
         COURSE CONTENT
      ===================================================== */

      .dj-course-content {
        padding: 22px 23px 20px;
      }

      .dj-course-category {
        margin-bottom: 7px;
        color: var(--dj-gold);
        font-size: 10px;
        font-weight: 850;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .dj-course-title {
        display: block;
        margin: 0;
        color: var(--dj-text);
        font-family: Georgia, "Times New Roman", serif;
        font-size: 28px;
        font-weight: 400;
        letter-spacing: -0.8px;
        line-height: 1.08;
        text-decoration: none;
      }

      .dj-course-title:hover {
        color: #244d73;
      }

      .dj-course-description {
        display: -webkit-box;
        overflow: hidden;
        max-width: 600px;
        margin: 10px 0 18px;
        color: #6d7b8d;
        font-size: 14px;
        line-height: 1.6;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .dj-course-details {
        display: flex;
        align-items: center;
        gap: 17px;
        padding: 13px 0;
        border-top: 1px solid #eeeae3;
        border-bottom: 1px solid #eeeae3;
      }

      .dj-course-details span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #65758a;
        font-size: 11px;
        white-space: nowrap;
      }

      .dj-course-details i {
        color: #7a8797;
        font-size: 13px;
        font-style: normal;
      }

      .dj-course-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding-top: 16px;
      }

      .dj-course-price {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .dj-course-price small {
        color: #8993a0;
        font-size: 10px;
      }

      .dj-course-price strong {
        color: var(--dj-text);
        font-size: 15px;
        font-weight: 750;
      }

      .dj-view-course {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 11px 15px;
        border-radius: 6px;
        background: var(--dj-navy);
        color: white;
        text-decoration: none;
        font-size: 12px;
        font-weight: 750;
        transition:
          background 160ms ease,
          transform 160ms ease;
      }

      .dj-view-course:hover {
        background: #173b61;
        transform: translateX(2px);
      }

      .dj-view-course span {
        font-size: 16px;
      }

      /* =====================================================
         EMPTY
      ===================================================== */

      .dj-empty {
        min-height: 260px;
        display: grid;
        place-items: center;
        align-content: center;
        border: 1px dashed #d8d4cb;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.45);
        text-align: center;
      }

      .dj-empty-symbol {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        margin-bottom: 13px;
        border-radius: 50%;
        background: var(--dj-navy);
        color: white;
        font-family: Georgia, serif;
      }

      .dj-empty h3 {
        margin: 0;
        font-family: Georgia, serif;
        font-size: 24px;
        font-weight: 400;
      }

      .dj-empty p {
        margin: 7px 0 15px;
        color: var(--dj-muted);
        font-size: 13px;
      }

      .dj-empty button {
        border: 0;
        background: transparent;
        color: var(--dj-navy);
        cursor: pointer;
        font-family: inherit;
        font-size: 13px;
        font-weight: 750;
        text-decoration: underline;
      }

      /* =====================================================
         LEARNING STRIP
      ===================================================== */

      .dj-learning-strip {
        border-top: 1px solid #ece8df;
        border-bottom: 1px solid #ece8df;
        background: #f7f4ed;
      }

      .dj-learning-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        min-height: 105px;
      }

      .dj-learning-point {
        display: flex;
        align-items: center;
        gap: 17px;
        padding: 22px 35px;
        border-right: 1px solid #e2ddd3;
      }

      .dj-learning-point:first-child {
        padding-left: 0;
      }

      .dj-learning-point:last-child {
        border-right: 0;
      }

      .dj-learning-number {
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        border: 1px solid #ddbd80;
        border-radius: 50%;
        color: var(--dj-gold);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1px;
      }

      .dj-learning-point strong {
        display: block;
        color: var(--dj-text);
        font-size: 13px;
      }

      .dj-learning-point span {
        display: block;
        margin-top: 4px;
        color: var(--dj-muted);
        font-size: 11px;
      }

      /* =====================================================
         CTA
      ===================================================== */

      .dj-learning-cta {
        padding: 58px 0 70px;
        background: #fcfaf5;
      }

      .dj-cta-layout {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 50px;
      }

      .dj-cta-copy {
        display: flex;
        align-items: stretch;
        gap: 22px;
      }

      .dj-vertical-line {
        width: 3px;
        border-radius: 5px;
        background: var(--dj-gold);
      }

      .dj-cta-copy h2 {
        margin: 0;
        color: var(--dj-text);
        font-family: Georgia, "Times New Roman", serif;
        font-size: 38px;
        font-weight: 400;
        letter-spacing: -1.5px;
        line-height: 1.05;
      }

      .dj-cta-copy p {
        margin: 8px 0 0;
        color: var(--dj-muted);
        font-size: 14px;
      }

      .dj-contact-card {
        min-width: 290px;
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 17px 19px;
        border: 1px solid #e5d8c3;
        border-radius: 9px;
        background: white;
        color: var(--dj-text);
        text-decoration: none;
        transition:
          transform 180ms ease,
          box-shadow 180ms ease;
      }

      .dj-contact-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(20, 35, 52, 0.08);
      }

      .dj-contact-icon {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border: 1px solid #e1c48e;
        border-radius: 50%;
        color: var(--dj-gold);
        font-size: 22px;
      }

      .dj-contact-card span:nth-child(2) {
        flex: 1;
      }

      .dj-contact-card strong {
        display: block;
        font-size: 13px;
      }

      .dj-contact-card small {
        display: block;
        margin-top: 3px;
        color: var(--dj-muted);
        font-size: 11px;
      }

      .dj-contact-card b {
        color: var(--dj-gold);
        font-size: 19px;
        font-weight: 400;
      }

      /* =====================================================
         TABLET
      ===================================================== */

      @media (max-width: 1000px) {
        .dj-container {
          width: min(100% - 50px, 900px);
        }

        .dj-hero-container {
          grid-template-columns: 1fr;
        }

        .dj-hero-art {
          display: none;
        }

        .dj-education-hero,
        .dj-hero-container {
          min-height: auto;
        }

        .dj-hero-copy {
          padding: 65px 0;
        }

        .dj-course-grid {
          grid-template-columns: 1fr 1fr;
        }

        .dj-course-media {
          height: 215px;
        }

        .dj-course-details {
          gap: 10px;
        }

        .dj-course-details span {
          font-size: 10px;
        }

        .dj-learning-point {
          padding: 20px;
        }
      }

      /* =====================================================
         MOBILE
      ===================================================== */

      @media (max-width: 720px) {
        .dj-container {
          width: min(100% - 32px, 560px);
        }

        .dj-education-hero {
          min-height: 0;
        }

        .dj-hero-copy {
          padding: 52px 0 55px;
        }

        .dj-hero-copy h1 {
          font-size: 46px;
          letter-spacing: -2.2px;
        }

        .dj-hero-copy p {
          margin-top: 20px;
          font-size: 15px;
        }

        .dj-hero-actions {
          align-items: stretch;
          flex-direction: column;
          width: 100%;
        }

        .dj-button {
          width: 100%;
        }

        .dj-course-section {
          padding: 52px 0 60px;
        }

        .dj-section-top {
          display: block;
        }

        .dj-section-top h2 {
          font-size: 39px;
          letter-spacing: -1.8px;
        }

        .dj-desktop-break {
          display: none;
        }

        .dj-course-count {
          margin-top: 15px;
          padding: 0;
          text-align: left;
        }

        .dj-course-toolbar {
          display: block;
          margin-top: 28px;
        }

        .dj-filters {
          overflow-x: auto;
          flex-wrap: nowrap;
          padding-bottom: 3px;
        }

        .dj-filter {
          flex-shrink: 0;
        }

        .dj-search {
          width: 100%;
          margin-top: 13px;
        }

        .dj-course-grid {
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .dj-course-media {
          height: 220px;
        }

        .dj-course-title {
          font-size: 27px;
        }

        .dj-course-details {
          gap: 12px;
          flex-wrap: wrap;
        }

        .dj-course-footer {
          align-items: flex-end;
        }

        .dj-learning-grid {
          grid-template-columns: 1fr;
        }

        .dj-learning-point,
        .dj-learning-point:first-child {
          padding: 18px 0;
          border-right: 0;
          border-bottom: 1px solid #e2ddd3;
        }

        .dj-learning-point:last-child {
          border-bottom: 0;
        }

        .dj-cta-layout {
          align-items: stretch;
          flex-direction: column;
          gap: 30px;
        }

        .dj-cta-copy h2 {
          font-size: 33px;
        }

        .dj-contact-card {
          min-width: 0;
          width: 100%;
        }
      }

      @media (max-width: 430px) {
        .dj-container {
          width: min(100% - 24px, 560px);
        }

        .dj-hero-copy h1 {
          font-size: 40px;
        }

        .dj-section-top h2 {
          font-size: 35px;
        }

        .dj-course-content {
          padding: 20px 17px 18px;
        }

        .dj-course-footer {
          gap: 8px;
        }

        .dj-view-course {
          padding: 10px 12px;
        }
      }
    `}</style>
  );
}