"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="dj-meta-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="dj-feature">
      <div className="dj-feature-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function LearningPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="dj-learning-point">
      <span className="dj-check">✓</span>
      <span>{children}</span>
    </li>
  );
}

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="dj-trust-item">
      <div className="dj-trust-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default function BuyCoursePage() {
  const params = useParams();

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";

  const course = useQuery(
    api.courses.bySlug,
    slug ? { slug } : "skip"
  );

  if (!slug || course === undefined) {
    return (
      <>
        <main className="dj-buy-page">
          <div className="dj-loading">
            <div className="dj-loading-spinner" />
            <p>Loading course...</p>
          </div>
        </main>

        <CourseBuyStyles />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <main className="dj-buy-page">
          <div className="dj-empty">
            <span className="dj-empty-label">COURSE</span>

            <h1>Course not found</h1>

            <p>
              The course you are looking for is unavailable or
              may have been removed.
            </p>

            <Link href="/education" className="dj-back-button">
              Back to Learning
              <span>↗</span>
            </Link>
          </div>
        </main>

        <CourseBuyStyles />
      </>
    );
  }

  const lessonCount = Array.isArray(course.lessons)
    ? course.lessons.length
    : course.lessons;

  const price =
    typeof course.price === "number"
      ? course.price
      : 0;

  const category =
    course.category?.trim() || "ASTROLOGY";

  const level =
    course.level?.trim() || "ADVANCED";

  const duration =
    course.duration?.trim() || "16 weeks";

  const instructor =
    course.instructor?.trim() || "Divyajyoti Faculty";

  const syllabus =
    Array.isArray(course.syllabus)
      ? course.syllabus
      : [];

  const learningPoints =
    syllabus.length > 0
      ? syllabus.slice(0, 6)
      : [
          "Core principles of predictive astrology",
          "How to read and interpret birth charts",
          "Planetary influences and life patterns",
          "Timing important life events",
          "Real-life examples and case studies",
          "Practical guidance for personal and professional life",
        ];

  return (
    <>
      <main className="dj-buy-page">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="dj-container">
          <div className="dj-breadcrumb">
            <Link href="/education">Education</Link>

            <span>›</span>

            <strong>
              {course.title}
            </strong>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <section className="dj-container dj-main-grid">

          {/* ===================================================
              LEFT
          =================================================== */}

          <div className="dj-left-column">

            {/* PREMIUM COURSE HERO */}
            <section className="dj-course-visual">

              <div className="dj-course-visual-content">

                <div className="dj-category">
                  {category.toUpperCase()}
                </div>

                <h2>
                  Discover the
                  <br />
                  Science of Timing
                </h2>

                <p>
                  Learn predictive astrology through
                  structured lessons, practical techniques,
                  real examples and a disciplined approach
                  to understanding life's patterns.
                </p>

                <div className="dj-visual-features">

                  <Feature
                    icon="▱"
                    title="Structured Lessons"
                    text="Learn step by step"
                  />

                  <Feature
                    icon="▷"
                    title="Recorded Classes"
                    text="Learn at your pace"
                  />

                  <Feature
                    icon="▤"
                    title="Practical Examples"
                    text="Real-world learning"
                  />

                  <Feature
                    icon="◫"
                    title="Lifetime Access"
                    text="Return anytime"
                  />

                </div>
              </div>

              {/* ASTROLOGY ORBIT */}
              <div className="dj-orbit">

                <div className="dj-orbit-ring dj-ring-one" />
                <div className="dj-orbit-ring dj-ring-two" />
                <div className="dj-orbit-ring dj-ring-three" />

                <div className="dj-orbit-sun">
                  ☼
                </div>

                <span className="dj-planet dj-planet-one">
                  ●
                </span>

                <span className="dj-planet dj-planet-two">
                  ●
                </span>

                <span className="dj-planet dj-planet-three">
                  ◐
                </span>

                <span className="dj-star dj-star-one">
                  ✦
                </span>

                <span className="dj-star dj-star-two">
                  ✦
                </span>

                <span className="dj-moon">
                  ☾
                </span>

              </div>

            </section>

            {/* =================================================
                COURSE INTRO
            ================================================= */}

            <section className="dj-course-intro">

              <span className="dj-section-label">
                COURSE ENROLLMENT
              </span>

              <h1>
                Enrol in{" "}
                {course.title}
              </h1>

              <p className="dj-course-description">
                {course.description ||
                  "Gain deep insights through the timeless wisdom of Vedic astrology. Learn practical techniques with structured lessons and real examples."}
              </p>

              <div className="dj-course-divider" />

            </section>

            {/* =================================================
                WHAT YOU WILL LEARN
            ================================================= */}

            <section className="dj-learning-section">

              <div className="dj-section-heading">
                <span className="dj-section-label">
                  COURSE OUTCOMES
                </span>

                <h2>
                  What you&apos;ll learn
                </h2>
              </div>

              <ul className="dj-learning-list">

                {learningPoints.map(
                  (item, index) => (
                    <LearningPoint key={index}>
                      {item}
                    </LearningPoint>
                  )
                )}

              </ul>

            </section>

            {/* =================================================
                COURSE DETAILS
            ================================================= */}

            <section className="dj-details-section">

              <div className="dj-section-heading">
                <span className="dj-section-label">
                  COURSE DETAILS
                </span>

                <h2>
                  Everything you need to begin.
                </h2>
              </div>

              <div className="dj-details-grid">

                <MetaItem
                  label="Lessons"
                  value={lessonCount}
                />

                <MetaItem
                  label="Level"
                  value={level}
                />

                <MetaItem
                  label="Duration"
                  value={duration}
                />

                <MetaItem
                  label="Instructor"
                  value={instructor}
                />

              </div>

            </section>

          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          =================================================== */}

          <aside className="dj-right-column">

            <div className="dj-enrollment-card">

              <span className="dj-enroll-label">
                ENROL NOW
              </span>

              <h2>
                Start learning
                <br />
                today.
              </h2>

              <p>
                Complete your enrollment to
                continue to checkout.
              </p>

              <div className="dj-card-divider" />

              <span className="dj-fee-label">
                COURSE FEE
              </span>

              <div className="dj-price">
                ₹{price.toLocaleString("en-IN")}
              </div>

              <div className="dj-card-divider" />

              <div className="dj-card-stats">

                <div>
                  <span>LESSONS</span>
                  <strong>{lessonCount}</strong>
                </div>

                <div>
                  <span>LEVEL</span>
                  <strong>{level}</strong>
                </div>

                <div>
                  <span>DURATION</span>
                  <strong>{duration}</strong>
                </div>

              </div>

              <Link
                href={`/education/${course.slug}/checkout`}
                className="dj-checkout-button"
              >
                <span>
                  Continue to Checkout
                </span>

                <span>↗</span>
              </Link>

              <div className="dj-secure">
                <span className="dj-lock">
                  ♙
                </span>

                Secure & encrypted payment
              </div>

            </div>

            {/* =================================================
                TRUST CARD
            ================================================= */}

            <div className="dj-trust-card">

              <TrustItem
                icon="◇"
                title="Lifetime access"
                text="Learn at your own pace"
              />

              <TrustItem
                icon="▣"
                title="Watch on any device"
                text="Mobile, tablet or desktop"
              />

              <TrustItem
                icon="◉"
                title="Dedicated support"
                text="Get help whenever you need"
              />

              <TrustItem
                icon="☆"
                title="Trusted learning"
                text="Practical, structured knowledge"
              />

            </div>

            {/* =================================================
                HELP CARD
            ================================================= */}

            <div className="dj-help-card">

              <div className="dj-help-icon">
                ?
              </div>

              <div>
                <strong>
                  Need help?
                </strong>

                <p>
                  Have questions about this
                  course? Our team is here
                  to help.
                </p>

                <Link href="/contact">
                  Contact Support
                  <span> →</span>
                </Link>
              </div>

            </div>

          </aside>

        </section>

        {/* =====================================================
            BOTTOM TRUST STRIP
        ===================================================== */}

        <section className="dj-bottom-strip">

          <div className="dj-container dj-bottom-grid">

            <TrustItem
              icon="☆"
              title="Trusted Learning"
              text="Practical & authentic knowledge"
            />

            <TrustItem
              icon="◷"
              title="Learn at Your Pace"
              text="Lifetime access to content"
            />

            <TrustItem
              icon="♙"
              title="Secure Payments"
              text="Safe and encrypted"
            />

            <TrustItem
              icon="♧"
              title="Dedicated Support"
              text="We're here to help"
            />

          </div>

        </section>

      </main>

      <CourseBuyStyles />
    </>
  );
}


/* =============================================================
   STYLES
============================================================= */

function CourseBuyStyles() {
  return (
    <style jsx global>{`

      :root {
        --dj-navy: #0d2948;
        --dj-navy-dark: #09223d;
        --dj-gold: #d99b20;
        --dj-gold-light: #f1c55b;
        --dj-cream: #f8f6f0;
        --dj-cream-dark: #f1ede3;
        --dj-white: #ffffff;
        --dj-text: #102b49;
        --dj-muted: #66788d;
        --dj-border: #e4e0d7;
      }

      * {
        box-sizing: border-box;
      }

      .dj-buy-page {
        min-height: 100vh;
        background: #fbfaf7;
        color: var(--dj-text);
        padding-top: 28px;
      }

      .dj-container {
        width: min(1320px, calc(100% - 64px));
        margin: 0 auto;
      }

      /* =======================================================
         BREADCRUMB
      ======================================================= */

      .dj-breadcrumb {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 8px 0 26px;
        font-size: 14px;
        color: #68809a;
      }

      .dj-breadcrumb a {
        color: #66809a;
        text-decoration: none;
      }

      .dj-breadcrumb a:hover {
        color: var(--dj-navy);
      }

      .dj-breadcrumb span {
        font-size: 20px;
        color: #9aa5af;
      }

      .dj-breadcrumb strong {
        color: var(--dj-navy);
        font-weight: 700;
      }

      /* =======================================================
         MAIN GRID
      ======================================================= */

      .dj-main-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 38px;
        align-items: start;
      }

      .dj-left-column {
        min-width: 0;
      }

      .dj-right-column {
        position: sticky;
        top: 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      /* =======================================================
         PREMIUM VISUAL
      ======================================================= */

      .dj-course-visual {
        position: relative;
        min-height: 395px;
        overflow: hidden;
        border-radius: 14px;
        background:
          radial-gradient(
            circle at 78% 46%,
            rgba(218, 157, 37, 0.13),
            transparent 26%
          ),
          linear-gradient(
            135deg,
            #f8f4e9 0%,
            #f5f1e7 52%,
            #ece7dc 100%
          );
        border: 1px solid #eee8dc;
        padding: 46px 42px;
      }

      .dj-course-visual-content {
        position: relative;
        z-index: 3;
        max-width: 620px;
      }

      .dj-category,
      .dj-section-label,
      .dj-enroll-label {
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 3px;
      }

      .dj-category {
        display: inline-flex;
        padding: 9px 15px;
        border-radius: 999px;
        background: #ffffff;
        color: var(--dj-navy);
        margin-bottom: 22px;
        box-shadow: 0 5px 18px rgba(13, 41, 72, 0.06);
      }

      .dj-course-visual h2 {
        margin: 0;
        max-width: 590px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(42px, 4.1vw, 66px);
        line-height: 0.98;
        letter-spacing: -2.5px;
        color: var(--dj-navy);
        font-weight: 500;
      }

      .dj-course-visual-content > p {
        max-width: 590px;
        margin: 22px 0 0;
        color: #65778b;
        font-size: 16px;
        line-height: 1.65;
      }

      /* =======================================================
         ORBIT
      ======================================================= */

      .dj-orbit {
        position: absolute;
        width: 330px;
        height: 330px;
        right: 20px;
        top: 28px;
        opacity: 0.95;
      }

      .dj-orbit-ring {
        position: absolute;
        border: 1px dashed rgba(205, 146, 26, 0.55);
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .dj-ring-one {
        width: 145px;
        height: 145px;
      }

      .dj-ring-two {
        width: 220px;
        height: 220px;
      }

      .dj-ring-three {
        width: 295px;
        height: 295px;
      }

      .dj-orbit-sun {
        position: absolute;
        width: 92px;
        height: 92px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: #bd7d09;
        font-size: 68px;
        font-family: Georgia, serif;
        background: radial-gradient(
          circle,
          #f0c764,
          #d5961b
        );
        box-shadow:
          0 0 0 8px rgba(220, 165, 54, 0.08),
          0 12px 30px rgba(175, 122, 21, 0.18);
      }

      .dj-planet,
      .dj-star,
      .dj-moon {
        position: absolute;
        color: #c68c1c;
      }

      .dj-planet-one {
        top: 33px;
        right: 92px;
        font-size: 11px;
      }

      .dj-planet-two {
        right: 14px;
        top: 146px;
        font-size: 15px;
      }

      .dj-planet-three {
        bottom: 49px;
        left: 75px;
        font-size: 30px;
      }

      .dj-star-one {
        top: 22px;
        left: 50%;
        font-size: 25px;
      }

      .dj-star-two {
        bottom: 34px;
        right: 80px;
        font-size: 16px;
      }

      .dj-moon {
        top: 59px;
        right: 28px;
        font-size: 45px;
      }

      /* =======================================================
         VISUAL FEATURES
      ======================================================= */

      .dj-visual-features {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        margin-top: 30px;
        max-width: 650px;
      }

      .dj-feature {
        display: flex;
        align-items: center;
        gap: 11px;
        padding-right: 18px;
        margin-right: 18px;
        border-right: 1px solid #ded8ca;
      }

      .dj-feature:last-child {
        border-right: 0;
      }

      .dj-feature-icon {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #f4ead3;
        color: var(--dj-navy);
        font-size: 20px;
      }

      .dj-feature strong {
        display: block;
        font-size: 12px;
        line-height: 1.25;
        color: var(--dj-navy);
      }

      .dj-feature span {
        display: block;
        margin-top: 3px;
        font-size: 10px;
        color: #7b8793;
      }

      /* =======================================================
         COURSE INTRO
      ======================================================= */

      .dj-course-intro {
        padding: 58px 0 30px;
      }

      .dj-section-label {
        color: #c68b1d;
      }

      .dj-course-intro h1 {
        margin: 15px 0 18px;
        max-width: 850px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(44px, 5vw, 70px);
        line-height: 1;
        letter-spacing: -2.5px;
        font-weight: 500;
        color: var(--dj-navy);
      }

      .dj-course-description {
        max-width: 760px;
        margin: 0;
        color: #68798d;
        font-size: 17px;
        line-height: 1.7;
      }

      .dj-course-divider {
        width: 100%;
        height: 1px;
        background: var(--dj-border);
        margin-top: 38px;
      }

      /* =======================================================
         LEARNING
      ======================================================= */

      .dj-learning-section {
        padding: 30px 0 50px;
      }

      .dj-section-heading h2 {
        margin: 12px 0 28px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 42px;
        line-height: 1.05;
        font-weight: 500;
        color: var(--dj-navy);
      }

      .dj-learning-list {
        padding: 0;
        margin: 0;
        list-style: none;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px 30px;
      }

      .dj-learning-point {
        display: flex;
        align-items: center;
        gap: 13px;
        font-size: 15px;
        line-height: 1.5;
        color: #435b73;
      }

      .dj-check {
        width: 27px;
        height: 27px;
        flex: 0 0 27px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #dda12a;
        color: white;
        font-size: 13px;
        font-weight: 800;
      }

      /* =======================================================
         DETAILS
      ======================================================= */

      .dj-details-section {
        padding: 20px 0 70px;
      }

      .dj-details-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border-top: 1px solid var(--dj-border);
        border-bottom: 1px solid var(--dj-border);
      }

      .dj-meta-item {
        padding: 22px 18px 22px 0;
        border-right: 1px solid var(--dj-border);
      }

      .dj-meta-item:not(:first-child) {
        padding-left: 20px;
      }

      .dj-meta-item:last-child {
        border-right: 0;
      }

      .dj-meta-item span {
        display: block;
        margin-bottom: 7px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.5px;
        color: #8a98a7;
        text-transform: uppercase;
      }

      .dj-meta-item strong {
        display: block;
        font-size: 14px;
        color: var(--dj-navy);
      }

      /* =======================================================
         ENROLLMENT CARD
      ======================================================= */

      .dj-enrollment-card {
        padding: 38px 34px 30px;
        border-radius: 13px;
        background: linear-gradient(
          150deg,
          #123656,
          #092541
        );
        color: white;
        box-shadow: 0 20px 50px rgba(7, 29, 50, 0.12);
      }

      .dj-enroll-label {
        color: #f0bd4b;
      }

      .dj-enrollment-card h2 {
        margin: 20px 0 24px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 44px;
        line-height: 0.98;
        letter-spacing: -1.5px;
        font-weight: 500;
      }

      .dj-enrollment-card > p {
        margin: 0;
        color: #b7c7d7;
        font-size: 15px;
        line-height: 1.65;
      }

      .dj-card-divider {
        height: 1px;
        background: rgba(255,255,255,0.14);
        margin: 27px 0;
      }

      .dj-fee-label {
        display: block;
        color: #aebfd0;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .dj-price {
        margin-top: 7px;
        color: white;
        font-size: 42px;
        line-height: 1;
        font-weight: 800;
        letter-spacing: -1px;
      }

      .dj-card-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-bottom: 27px;
      }

      .dj-card-stats > div {
        min-width: 0;
        padding-left: 14px;
        border-left: 1px solid rgba(255,255,255,0.15);
      }

      .dj-card-stats > div:first-child {
        padding-left: 0;
        border-left: 0;
      }

      .dj-card-stats span {
        display: block;
        margin-bottom: 6px;
        font-size: 9px;
        color: #91a7ba;
        letter-spacing: 0.7px;
      }

      .dj-card-stats strong {
        display: block;
        font-size: 12px;
        color: white;
        line-height: 1.3;
        word-break: break-word;
      }

      .dj-checkout-button {
        width: 100%;
        min-height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px 0 22px;
        border-radius: 999px;
        background: #efbc50;
        color: #092541;
        text-decoration: none;
        font-size: 14px;
        font-weight: 800;
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      }

      .dj-checkout-button:hover {
        background: #f4c862;
        transform: translateY(-2px);
      }

      .dj-checkout-button span:last-child {
        font-size: 20px;
      }

      .dj-secure {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;
        margin-top: 18px;
        color: #aebfd0;
        font-size: 11px;
      }

      .dj-lock {
        font-size: 15px;
      }

      /* =======================================================
         TRUST CARD
      ======================================================= */

      .dj-trust-card {
        padding: 8px 17px;
        background: #ffffff;
        border: 1px solid #ebe6dc;
        border-radius: 12px;
      }

      .dj-trust-item {
        display: flex;
        align-items: center;
        gap: 13px;
        padding: 15px 4px;
        border-bottom: 1px solid #ece8df;
      }

      .dj-trust-item:last-child {
        border-bottom: 0;
      }

      .dj-trust-icon {
        width: 35px;
        height: 35px;
        flex: 0 0 35px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #f4ead4;
        color: #b77b0b;
        font-size: 19px;
      }

      .dj-trust-item strong {
        display: block;
        color: var(--dj-navy);
        font-size: 13px;
      }

      .dj-trust-item span {
        display: block;
        margin-top: 3px;
        color: #7b8998;
        font-size: 11px;
      }

      /* =======================================================
         HELP
      ======================================================= */

      .dj-help-card {
        display: flex;
        gap: 14px;
        padding: 20px;
        border-radius: 12px;
        background: #f6f3eb;
        border: 1px solid #ebe6dc;
      }

      .dj-help-icon {
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        border: 2px solid var(--dj-navy);
        color: var(--dj-navy);
        font-weight: 800;
      }

      .dj-help-card strong {
        display: block;
        color: var(--dj-navy);
        font-size: 14px;
      }

      .dj-help-card p {
        margin: 6px 0 9px;
        color: #748295;
        font-size: 12px;
        line-height: 1.5;
      }

      .dj-help-card a {
        color: #b97908;
        font-size: 12px;
        font-weight: 800;
        text-decoration: none;
      }

      .dj-help-card a:hover {
        text-decoration: underline;
      }

      /* =======================================================
         BOTTOM STRIP
      ======================================================= */

      .dj-bottom-strip {
        background: #f4f0e6;
        border-top: 1px solid #e8e1d4;
      }

      .dj-bottom-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }

      .dj-bottom-grid .dj-trust-item {
        padding: 30px 25px 30px 0;
        margin-right: 25px;
        border-bottom: 0;
        border-right: 1px solid #ddd6c8;
      }

      .dj-bottom-grid .dj-trust-item:last-child {
        border-right: 0;
        margin-right: 0;
      }

      /* =======================================================
         LOADING
      ======================================================= */

      .dj-loading {
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        color: var(--dj-muted);
      }

      .dj-loading-spinner {
        width: 34px;
        height: 34px;
        border: 3px solid #e6e0d5;
        border-top-color: var(--dj-gold);
        border-radius: 50%;
        animation: dj-spin 0.8s linear infinite;
      }

      @keyframes dj-spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* =======================================================
         EMPTY
      ======================================================= */

      .dj-empty {
        width: min(700px, calc(100% - 40px));
        margin: 100px auto;
        padding: 60px 30px;
        text-align: center;
      }

      .dj-empty-label {
        color: #c68b1d;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 3px;
      }

      .dj-empty h1 {
        margin: 15px 0;
        font-family: Georgia, "Times New Roman", serif;
        color: var(--dj-navy);
        font-size: 52px;
        font-weight: 500;
      }

      .dj-empty p {
        color: #718195;
        line-height: 1.6;
      }

      .dj-back-button {
        display: inline-flex;
        align-items: center;
        gap: 15px;
        margin-top: 22px;
        padding: 14px 22px;
        border-radius: 999px;
        background: var(--dj-navy);
        color: white;
        text-decoration: none;
        font-weight: 700;
      }

      /* =======================================================
         RESPONSIVE
      ======================================================= */

      @media (max-width: 1100px) {

        .dj-main-grid {
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 25px;
        }

        .dj-course-visual {
          padding: 38px 32px;
        }

        .dj-orbit {
          width: 270px;
          height: 270px;
          right: -15px;
        }

        .dj-visual-features {
          max-width: 570px;
        }

        .dj-feature {
          padding-right: 10px;
          margin-right: 10px;
        }

      }

      @media (max-width: 900px) {

        .dj-main-grid {
          grid-template-columns: 1fr;
        }

        .dj-right-column {
          position: static;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
        }

        .dj-enrollment-card {
          grid-row: span 2;
        }

        .dj-course-visual {
          min-height: 430px;
        }

        .dj-orbit {
          right: 20px;
          opacity: 0.6;
        }

      }

      @media (max-width: 700px) {

        .dj-container {
          width: min(100% - 32px, 600px);
        }

        .dj-buy-page {
          padding-top: 15px;
        }

        .dj-course-visual {
          min-height: auto;
          padding: 30px 25px;
        }

        .dj-course-visual h2 {
          font-size: 42px;
        }

        .dj-orbit {
          position: relative;
          width: 220px;
          height: 220px;
          right: auto;
          top: auto;
          margin: 25px auto -10px;
        }

        .dj-visual-features {
          grid-template-columns: repeat(2, 1fr);
          gap: 15px 0;
        }

        .dj-feature {
          border-right: 0;
        }

        .dj-course-intro {
          padding-top: 40px;
        }

        .dj-course-intro h1 {
          font-size: 44px;
        }

        .dj-learning-list {
          grid-template-columns: 1fr;
        }

        .dj-details-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .dj-meta-item:nth-child(2) {
          border-right: 0;
        }

        .dj-meta-item:nth-child(3),
        .dj-meta-item:nth-child(4) {
          border-top: 1px solid var(--dj-border);
        }

        .dj-right-column {
          grid-template-columns: 1fr;
        }

        .dj-enrollment-card {
          grid-row: auto;
        }

        .dj-bottom-grid {
          grid-template-columns: 1fr 1fr;
        }

        .dj-bottom-grid .dj-trust-item {
          border-right: 0;
          border-bottom: 1px solid #ddd6c8;
          margin-right: 0;
          padding-right: 12px;
        }

      }

      @media (max-width: 430px) {

        .dj-breadcrumb {
          font-size: 12px;
        }

        .dj-course-visual h2 {
          font-size: 36px;
        }

        .dj-course-visual-content > p {
          font-size: 14px;
        }

        .dj-visual-features {
          grid-template-columns: 1fr;
        }

        .dj-course-intro h1 {
          font-size: 38px;
        }

        .dj-section-heading h2 {
          font-size: 34px;
        }

        .dj-enrollment-card {
          padding: 30px 25px;
        }

        .dj-enrollment-card h2 {
          font-size: 39px;
        }

        .dj-price {
          font-size: 36px;
        }

        .dj-bottom-grid {
          grid-template-columns: 1fr;
        }

        .dj-details-grid {
          grid-template-columns: 1fr;
        }

        .dj-meta-item,
        .dj-meta-item:not(:first-child) {
          padding-left: 0;
          border-right: 0;
          border-bottom: 1px solid var(--dj-border);
        }

        .dj-meta-item:last-child {
          border-bottom: 0;
        }

      }

    `}</style>
  );
}