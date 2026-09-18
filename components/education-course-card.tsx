import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react";
import type { EducationCourse } from "@/lib/data";

export function EducationCourseCard({
  course,
}: {
  course: EducationCourse;
}) {
  return (
    <article className="education-course-card">
      {/* IMAGE */}
      <Link
        href={`/education/${course.slug}`}
        className="education-course-image-link"
      >
        <div
          className="education-course-image"
          style={{
            backgroundImage: `url(${course.image})`,
          }}
        >
          <span className="education-course-level">
            {course.level}
          </span>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="education-course-content">
        <div className="education-course-category">
          {course.category}
        </div>

        <Link
          href={`/education/${course.slug}`}
          className="education-course-title-link"
        >
          <h3 className="education-course-title">
            {course.title}
          </h3>
        </Link>

        <p className="education-course-description">
          {course.description}
        </p>

        {/* META */}
        <div className="education-course-meta">
          <span>
            <Clock3 size={14} />
            {course.duration}
          </span>

          <span>
            <BookOpen size={14} />
            {course.lessons} lessons
          </span>
        </div>

        {/* FOOTER */}
        <div className="education-course-footer">
          <strong className="education-course-price">
            ₹{course.price.toLocaleString("en-IN")}
          </strong>

          <Link
            href={`/education/${course.slug}`}
            className="education-course-view"
          >
            View course
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}