import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PlayCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

import { courses } from "@/lib/data";

export default async function CourseDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = courses.find(
    (item) => item.slug === slug
  );

  if (!course) {
    return (
      <main>

        <section className="section">

          <div className="container">

            <div className="eyebrow">
              Learning
            </div>

            <h1>
              Course not found.
            </h1>

            <Link
              href="/education"
              className="btn btn-dark"
              style={{ marginTop: 20 }}
            >
              <ArrowLeft size={15} />
              Back to courses
            </Link>

          </div>

        </section>

      </main>
    );
  }

  return (
    <main>

      {/* =====================================================
          COURSE HERO
      ===================================================== */}

      <section className="course-detail-hero">

        <div className="container">

          <Link
            href="/education"
            className="course-back"
          >
            <ArrowLeft size={15} />
            Back to courses
          </Link>


          <div className="course-detail-grid">

            <div className="course-detail-copy">

              <div className="eyebrow">
                {course.category}
              </div>

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
                  {course.lessons} lessons
                </span>

                <span>
                  <Users size={16} />
                  {course.level}
                </span>

              </div>


              <div className="course-detail-price">

                <strong>
                  ₹{course.price.toLocaleString("en-IN")}
                </strong>

                <span>
                  One-time course fee
                </span>

              </div>


              <Link
                href={`/education/${course.slug}/checkout`}
                className="btn btn-dark course-buy-button"
              >
                Buy this course
                <ArrowUpRight size={15} />
              </Link>

            </div>


            <div
              className="course-detail-image"
              style={{
                backgroundImage:
                  `url(${course.image})`,
              }}
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          COURSE INFORMATION
      ===================================================== */}

      <section className="section">

        <div className="container course-info-grid">

          <div>

            <div className="eyebrow">
              What you will learn
            </div>

            <h2 className="display">
              Practical knowledge you can use.
            </h2>


            <div className="course-highlights">

              {course.highlights.map(
                (highlight: string) => (

                  <div key={highlight}>

                    <CheckCircle2 size={18} />

                    <span>
                      {highlight}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          <aside className="course-info-card">

            <div className="eyebrow">
              Course information
            </div>

            <h3>
              {course.title}
            </h3>

            <div className="course-info-row">
              <span>Instructor</span>
              <strong>{course.instructor}</strong>
            </div>

            <div className="course-info-row">
              <span>Format</span>
              <strong>{course.format}</strong>
            </div>

            <div className="course-info-row">
              <span>Duration</span>
              <strong>{course.duration}</strong>
            </div>

            <div className="course-info-row">
              <span>Language</span>
              <strong>{course.language}</strong>
            </div>

            <div className="course-info-row">
              <span>Lessons</span>
              <strong>{course.lessons}</strong>
            </div>

          </aside>

        </div>

      </section>


      {/* =====================================================
          COURSE PROCESS
      ===================================================== */}

      <section className="section course-process-section">

        <div className="container">

          <div className="eyebrow">
            How it works
          </div>

          <h2 className="display">
            From enrollment to learning.
          </h2>


          <div className="course-process-grid">

            <div>
              <span>01</span>
              <BookOpen size={21} />
              <h3>Choose your course</h3>
              <p>
                Review the course details and decide
                whether it matches your learning goal.
              </p>
            </div>

            <div>
              <span>02</span>
              <ShieldCheck size={21} />
              <h3>Complete payment</h3>
              <p>
                Complete the secure online payment
                through the checkout process.
              </p>
            </div>

            <div>
              <span>03</span>
              <PlayCircle size={21} />
              <h3>Start learning</h3>
              <p>
                After successful enrollment, receive
                the information needed to begin.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="course-final-cta">

        <div className="container">

          <h2>
            Ready to start learning?
          </h2>

          <p>
            Enroll in {course.title} and begin your
            learning journey with Divyajyoti.
          </p>

          <Link
            href={`/education/${course.slug}/checkout`}
            className="btn btn-gold"
          >
            Buy this course
            <ArrowUpRight size={15} />
          </Link>

        </div>

      </section>

    </main>
  );
}