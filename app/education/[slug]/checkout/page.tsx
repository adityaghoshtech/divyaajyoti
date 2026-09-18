import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { courses } from "@/lib/data";

export default async function CourseCheckout({
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
            <h1>Course not found.</h1>

            <Link
              href="/education"
              className="btn btn-dark"
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

      <section className="checkout-section">

        <div className="container">

          <Link
            href={`/education/${course.slug}`}
            className="course-back"
          >
            <ArrowLeft size={15} />
            Back to course
          </Link>


          <div className="checkout-grid">

            {/* FORM */}

            <div className="checkout-form-card">

              <div className="eyebrow">
                Course enrollment
              </div>

              <h1>
                Complete your enrollment.
              </h1>

              <p>
                Enter your details below. After continuing,
                you will be taken to the secure payment
                checkout.
              </p>


              <form
                action="/api/payment/create-order"
                method="POST"
                className="checkout-form"
              >

                <input
                  type="hidden"
                  name="courseSlug"
                  value={course.slug}
                />


                <div className="checkout-field">

                  <label>
                    Full name
                  </label>

                  <input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    required
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Email address
                  </label>

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Phone number
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91"
                    required
                  />

                </div>


                <button
                  type="submit"
                  className="btn btn-dark checkout-button"
                >
                  Continue to payment
                  <LockKeyhole size={15} />
                </button>

              </form>


              <div className="checkout-security">

                <ShieldCheck size={17} />

                <span>
                  Your payment information is processed
                  securely. Do not enter card details directly
                  into this form.
                </span>

              </div>

            </div>


            {/* ORDER SUMMARY */}

            <aside className="checkout-summary">

              <div className="eyebrow">
                Order summary
              </div>

              <div
                className="checkout-course-image"
                style={{
                  backgroundImage:
                    `url(${course.image})`,
                }}
              />

              <h2>
                {course.title}
              </h2>

              <p>
                {course.category} · {course.duration}
              </p>

              <div className="checkout-divider" />

              <div className="checkout-price-row">

                <span>
                  Course fee
                </span>

                <strong>
                  ₹{course.price.toLocaleString("en-IN")}
                </strong>

              </div>

              <div className="checkout-price-row total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{course.price.toLocaleString("en-IN")}
                </strong>

              </div>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}