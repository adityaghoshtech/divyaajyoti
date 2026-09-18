import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Clock3,
  Sparkles,
} from "lucide-react";

const educationCourses = [
  // =========================
  // ASTROLOGY
  // =========================
  {
    slug: "astrology-foundation",
    title: "Astrology Foundation",
    category: "Astrology",
    level: "Beginner",
    duration: "12 weeks",
    lessons: 24,
    price: 4999,
    description:
      "Learn the basics of astrology, understand a birth chart and build a strong foundation.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "practical-chart-reading",
    title: "Practical Chart Reading",
    category: "Astrology",
    level: "Intermediate",
    duration: "14 weeks",
    lessons: 28,
    price: 7499,
    description:
      "Move from theory to practical chart reading with guided examples and regular practice.",
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "predictive-astrology",
    title: "Predictive Astrology",
    category: "Astrology",
    level: "Advanced",
    duration: "16 weeks",
    lessons: 32,
    price: 9999,
    description:
      "Develop a deeper understanding of timing and prediction through structured lessons and case studies.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "vastu-basics",
    title: "Vastu Basics",
    category: "Astrology",
    level: "Specialised",
    duration: "8 weeks",
    lessons: 16,
    price: 5999,
    description:
      "Learn Vastu principles and how to apply them to your home or workspace.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "applied-astrology",
    title: "Applied Astrology",
    category: "Astrology",
    level: "Practice",
    duration: "10 weeks",
    lessons: 20,
    price: 6999,
    description:
      "Learn through practical interpretation, case discussions and guided practice.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
  },

  // =========================
  // REAL ESTATE
  // =========================
  {
    slug: "real-estate-foundation",
    title: "Real Estate Foundation",
    category: "Real Estate",
    level: "Beginner",
    duration: "8 weeks",
    lessons: 16,
    price: 4999,
    description:
      "Understand property buying, documentation, location and basic valuation.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "property-investment",
    title: "Property Investment",
    category: "Real Estate",
    level: "Intermediate",
    duration: "10 weeks",
    lessons: 20,
    price: 6999,
    description:
      "Learn how to evaluate properties and make informed investment decisions.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "real-estate-masterclass",
    title: "Real Estate Masterclass",
    category: "Real Estate",
    level: "Advanced",
    duration: "12 weeks",
    lessons: 24,
    price: 8999,
    description:
      "Explore advanced property investment strategies, returns, risks and planning.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "property-valuation",
    title: "Property Valuation",
    category: "Real Estate",
    level: "Practical",
    duration: "6 weeks",
    lessons: 12,
    price: 5999,
    description:
      "Understand property valuation, pricing factors and market comparison.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "smart-property-buying",
    title: "Smart Property Buying",
    category: "Real Estate",
    level: "Specialised",
    duration: "7 weeks",
    lessons: 14,
    price: 6499,
    description:
      "Learn a practical framework for selecting and purchasing the right property.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function Education() {
  const astrologyCourses = educationCourses.filter(
    (course) => course.category === "Astrology"
  );

  const realEstateCourses = educationCourses.filter(
    (course) => course.category === "Real Estate"
  );

  return (
    <main className="education-page">

      {/* =========================
          ASTROLOGY
      ========================= */}

      <section
        className="education-course-section"
        id="astrology-courses"
      >
        <div className="education-container">

          <div className="course-section-heading">

            <div>
              <div className="eyebrow">
                01 / ASTROLOGY
              </div>

              <h1 className="display">
                Astrology learning paths.
              </h1>

              <p className="course-section-subtitle">
                Practical courses to help you understand,
                interpret and apply astrology in real life.
              </p>
            </div>

            <Link
              href="#astrology-courses"
              className="course-view-all"
            >
              View all astrology courses
              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="education-course-grid">
            {astrologyCourses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                icon={<Sparkles size={17} />}
              />
            ))}
          </div>

        </div>
      </section>


      {/* =========================
          REAL ESTATE
      ========================= */}

      <section
        className="education-course-section education-realestate"
        id="real-estate-courses"
      >
        <div className="education-container">

          <div className="course-section-heading">

            <div>
              <div className="eyebrow">
                02 / REAL ESTATE
              </div>

              <h2 className="display">
                Real estate learning paths.
              </h2>

              <p className="course-section-subtitle">
                Practical knowledge for better property
                decisions and long-term value.
              </p>
            </div>

            <Link
              href="#real-estate-courses"
              className="course-view-all"
            >
              View all real estate courses
              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="education-course-grid">
            {realEstateCourses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                icon={<Building2 size={17} />}
              />
            ))}
          </div>

        </div>
      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="education-cta">
        <div className="education-container">

          <div className="education-cta-inner">
            <BookOpen size={24} />

            <div>
              <div className="eyebrow">
                LEARN AT YOUR PACE
              </div>

              <h2>
                Choose a course and start building
                practical knowledge.
              </h2>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}


/* =========================================================
   COURSE CARD
   ========================================================= */

function CourseCard({
  course,
  icon,
}: {
  course: {
    slug: string;
    title: string;
    category: string;
    level: string;
    duration: string;
    lessons: number;
    price: number;
    description: string;
    image: string;
  };
  icon: React.ReactNode;
}) {
  return (
    <article className="education-course-card">

      {/* IMAGE */}

      <Link
        href={`/education/${course.slug}`}
        className="education-course-image"
        style={{
          backgroundImage: `url(${course.image})`,
        }}
      >
        <span className="course-level">
          {course.level}
        </span>
      </Link>


      {/* BODY */}

      <div className="education-course-body">

        <div className="course-icon">
          {icon}
        </div>

        <div className="course-category">
          {course.category}
        </div>

        <Link
          href={`/education/${course.slug}`}
          className="course-title-link"
        >
          <h3>
            {course.title}
          </h3>
        </Link>

        <p>
          {course.description}
        </p>


        {/* COURSE INFO */}

        <div className="education-course-meta">

          <span>
            <Clock3 size={13} />
            {course.duration}
          </span>

          <span>
            <BookOpen size={13} />
            {course.lessons} lessons
          </span>

        </div>


        {/* PRICE */}

        <div className="education-course-footer">

          <strong>
            ₹{course.price.toLocaleString("en-IN")}
          </strong>

          <Link
            href={`/education/${course.slug}`}
            className="course-view-link"
          >
            View course
            <ArrowRight size={14} />
          </Link>

        </div>

      </div>

    </article>
  );
}