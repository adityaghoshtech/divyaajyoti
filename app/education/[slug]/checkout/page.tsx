"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  useMutation,
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";


export default function CourseCheckoutPage() {
  const params = useParams();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : "";


  /* =========================================================
     COURSE
  ========================================================= */

  const course = useQuery(
    api.courses.bySlug,
    slug
      ? {
          slug,
        }
      : "skip",
  );


  /* =========================================================
     FORM
  ========================================================= */

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [transactionId, setTransactionId] =
    useState("");

  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);


  /* =========================================================
     USER-SPECIFIC PHONE

     This is extremely important.

     The course is NOT the identity.

     Identity =
       phone + courseSlug
  ========================================================= */

  const [lookupPhone, setLookupPhone] =
    useState("");


  /* =========================================================
     UI STATE
  ========================================================= */

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =========================================================
     CONVEX MUTATIONS
  ========================================================= */

  const generateUploadUrl =
    useMutation(
      api.coursePayments.generateUploadUrl,
    );

  const submitPayment =
    useMutation(
      api.coursePayments.submitPayment,
    );


  /* =========================================================
     LOAD SAVED USER PHONE
  ========================================================= */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const savedPhone =
      localStorage.getItem(
        "divyajyoti_student_phone",
      );

    if (savedPhone) {
      setPhone(savedPhone);

      /*
       * Only this phone is checked
       * against this course.
       */
      setLookupPhone(savedPhone);
    }
  }, []);


  /* =========================================================
     GET USER-SPECIFIC ENROLLMENT

     IMPORTANT:

     We DO NOT query by course only.

     We query:

       phone
       +
       courseSlug
  ========================================================= */

  const enrollment =
    useQuery(
      api.coursePayments.getEnrollmentByPhone,

      lookupPhone && slug
        ? {
            phone:
              lookupPhone,

            courseSlug:
              slug,
          }
        : "skip",
    );


  /* =========================================================
     PRICE
  ========================================================= */

  const price =
    useMemo(() => {
      if (!course) {
        return 0;
      }

      return typeof course.price ===
        "number"
        ? course.price
        : 0;
    }, [course]);


  /* =========================================================
     IMAGE
  ========================================================= */

  const courseImage =
    useMemo(() => {
      if (!course) {
        return "";
      }

      if (course.image) {
        return course.image;
      }

      if (
        Array.isArray(
          course.images,
        ) &&
        course.images.length > 0
      ) {
        return course.images[0];
      }

      return "";
    }, [course]);


  /* =========================================================
     LESSON COUNT
  ========================================================= */

  const lessonCount =
    useMemo(() => {
      if (!course) {
        return 0;
      }

      if (
        Array.isArray(
          course.lessons,
        )
      ) {
        return course.lessons.length;
      }

      return Number(
        course.lessons || 0,
      );
    }, [course]);


  /* =========================================================
     STATUS
  ========================================================= */

  const status =
    String(
      enrollment?.status ?? "",
    ).toUpperCase();


  /* =========================================================
     FILE VALIDATION
  ========================================================= */

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      setPaymentScreenshot(null);
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Payment screenshot must be smaller than 5 MB.",
      );

      event.target.value = "";

      setPaymentScreenshot(null);

      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setError(
        "Please upload a valid image file.",
      );

      event.target.value = "";

      setPaymentScreenshot(null);

      return;
    }

    setPaymentScreenshot(
      file,
    );
  };


  /* =========================================================
     CHANGE USER

     Useful if another person uses the same browser.

     This does NOT delete their database enrollment.

     It only changes the local browser identity.
  ========================================================= */

  const changeUser = () => {
    localStorage.removeItem(
      "divyajyoti_student_phone",
    );

    setLookupPhone("");

    setPhone("");

    setName("");

    setEmail("");

    setTransactionId("");

    setPaymentScreenshot(null);

    setError("");
  };


  /* =========================================================
     SUBMIT PAYMENT
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");


    if (!course) {
      setError(
        "Course information could not be loaded.",
      );

      return;
    }


    if (!name.trim()) {
      setError(
        "Please enter your full name.",
      );

      return;
    }


    if (!email.trim()) {
      setError(
        "Please enter your email address.",
      );

      return;
    }


    if (!phone.trim()) {
      setError(
        "Please enter your phone number.",
      );

      return;
    }


    /*
     * Normalize phone before saving.

     * Example:

       +91 98368 02673

     becomes:

       919836802673

     This prevents different formatting
     from creating duplicate users.
    */

    const normalizedPhone =
      phone.replace(
        /\D/g,
        "",
      );


    if (
      normalizedPhone.length <
      10
    ) {
      setError(
        "Please enter a valid mobile number.",
      );

      return;
    }


    if (
      transactionId.trim().length <
      4
    ) {
      setError(
        "Please enter a valid payment reference / UTR.",
      );

      return;
    }


    if (!paymentScreenshot) {
      setError(
        "Please upload your payment screenshot.",
      );

      return;
    }


    setSubmitting(true);


    try {

      /* =====================================================
         SAVE USER PHONE

         This is the identity used by My Courses.
      ===================================================== */

      localStorage.setItem(
        "divyajyoti_student_phone",
        normalizedPhone,
      );


      /* =====================================================
         1. GET CONVEX UPLOAD URL
      ===================================================== */

      const uploadUrl =
        await generateUploadUrl({});


      if (!uploadUrl) {
        throw new Error(
          "Could not create upload URL.",
        );
      }


      /* =====================================================
         2. UPLOAD PAYMENT SCREENSHOT
      ===================================================== */

      const response =
        await fetch(
          uploadUrl,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                paymentScreenshot.type,
            },

            body:
              paymentScreenshot,
          },
        );


      if (!response.ok) {
        throw new Error(
          "Failed to upload payment screenshot.",
        );
      }


      const uploadResult =
        await response.json();


      const storageId =
        uploadResult.storageId;


      if (!storageId) {
        throw new Error(
          "Payment screenshot upload failed.",
        );
      }


      /* =====================================================
         3. CREATE / REUSE USER-SPECIFIC ENROLLMENT
      ===================================================== */

      await submitPayment({
        courseSlug:
          course.slug,

        courseTitle:
          course.title,

        name:
          name.trim(),

        email:
          email
            .trim()
            .toLowerCase(),

        phone:
          normalizedPhone,

        amount:
          price,

        paymentReference:
          transactionId.trim(),

        paymentProofStorageId:
          storageId,
      });


      /* =====================================================
         4. IMPORTANT

         DO NOT STORE:

         divyajyoti_enrollment_${slug}

         anymore.

         The phone is the identity.
      ===================================================== */

      setLookupPhone(
        normalizedPhone,
      );

      setPaymentScreenshot(null);

      setTransactionId("");

    } catch (err) {
      console.error(
        "Payment submission error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Payment submission failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };


  /* =========================================================
     COURSE LOADING
  ========================================================= */

  if (course === undefined) {
    return (
      <main className="checkout-page">

        <section className="checkout-loading">

          <div className="checkout-loading-card">

            <div className="checkout-spinner" />

            <p>
              Loading checkout...
            </p>

          </div>

        </section>

      </main>
    );
  }


  /* =========================================================
     COURSE NOT FOUND
  ========================================================= */

  if (course === null) {
    return (
      <main className="checkout-page">

        <section className="checkout-status-page">

          <div className="checkout-success-card">

            <XCircle
              size={50}
              className="checkout-error-icon"
            />

            <div className="checkout-status-label">
              COURSE NOT FOUND
            </div>

            <h1>
              This course is no longer available.
            </h1>

            <p>
              The course could not be found.
            </p>

            <Link
              href="/education"
              className="checkout-success-button"
            >
              View Courses

              <ArrowUpRight
                size={17}
              />
            </Link>

          </div>

        </section>

      </main>
    );
  }


  /* =========================================================
     APPROVED

     ONLY THE CURRENT PHONE NUMBER
     + CURRENT COURSE
     CAN REACH THIS SCREEN.
  ========================================================= */

  if (
    enrollment &&
    status === "APPROVED"
  ) {
    return (
      <main className="checkout-page">

        <section className="checkout-status-page">

          <div className="checkout-success-card">

            <div className="checkout-success-icon">
              <CheckCircle2
                size={38}
              />
            </div>

            <div className="checkout-status-label">
              PAYMENT SUCCESSFUL
            </div>

            <h1>
              Your payment has
              <br />
              been approved.
            </h1>

            <p>
              Your payment for{" "}
              <strong>
                {course.title}
              </strong>{" "}
              has been successfully verified.
            </p>


            <div className="checkout-approved-box">

              <CheckCircle2
                size={18}
              />

              <span>
                Course access activated
              </span>

            </div>


            <Link
              href="/my-courses"
              className="checkout-success-button"
            >
              Go to My Courses

              <ArrowUpRight
                size={17}
              />
            </Link>


            <button
              type="button"
              className="checkout-secondary-button"
              onClick={changeUser}
            >
              Use a different mobile number
            </button>

          </div>

        </section>

      </main>
    );
  }


  /* =========================================================
     REJECTED
  ========================================================= */

  if (
    enrollment &&
    status === "REJECTED"
  ) {
    return (
      <main className="checkout-page">

        <section className="checkout-status-page">

          <div className="checkout-success-card">

            <div className="checkout-rejected-icon">

              <XCircle
                size={38}
              />

            </div>

            <div className="checkout-status-label">
              PAYMENT REJECTED
            </div>

            <h1>
              Your payment could not be approved.
            </h1>

            <p>
              Please check your payment details
              and submit them again.
            </p>


            {enrollment.adminNote && (
              <div className="checkout-admin-note">

                <strong>
                  Admin note
                </strong>

                <p>
                  {enrollment.adminNote}
                </p>

              </div>
            )}


            <button
              type="button"
              className="checkout-success-button"
              onClick={() => {

                /*
                 * Stop checking the old rejected
                 * enrollment.

                 * The next submission can create
                 * a new enrollment.
                 */

                setLookupPhone("");

                setTransactionId("");

                setPaymentScreenshot(null);

                setError("");

              }}
            >
              Submit Again

              <ArrowUpRight
                size={17}
              />

            </button>

          </div>

        </section>

      </main>
    );
  }


  /* =========================================================
     PENDING
  ========================================================= */

  if (
    enrollment &&
    status === "PENDING"
  ) {
    return (
      <main className="checkout-page">

        <section className="checkout-status-page">

          <div className="checkout-success-card">

            <div className="checkout-pending-icon">

              <Clock3
                size={38}
              />

            </div>

            <div className="checkout-status-label">
              PAYMENT SUBMITTED
            </div>

            <h1>
              Your payment is under review.
            </h1>

            <p>
              We have received your payment
              details for{" "}
              <strong>
                {course.title}
              </strong>.
            </p>

            <p>
              Our team will verify your payment
              and approve your course access.
            </p>


            <div className="checkout-status-line">

              <Clock3
                size={18}
              />

              <strong>
                Status: Pending approval
              </strong>

            </div>


            <div className="checkout-review-note">

              <ShieldCheck
                size={18}
              />

              <span>
                This page updates automatically
                when your payment is approved.
              </span>

            </div>


            <Link
              href={`/education/${course.slug}`}
              className="checkout-secondary-button"
            >
              Back to Course
            </Link>


            <button
              type="button"
              className="checkout-secondary-button"
              onClick={changeUser}
            >
              Use a different mobile number
            </button>

          </div>

        </section>

      </main>
    );
  }


  /* =========================================================
     CHECKING USER-SPECIFIC ENROLLMENT
  ========================================================= */

  if (
    lookupPhone &&
    enrollment === undefined
  ) {
    return (
      <main className="checkout-page">

        <section className="checkout-status-page">

          <div className="checkout-success-card">

            <div className="checkout-loading-small">

              <div className="checkout-spinner" />

            </div>

            <div className="checkout-status-label">
              CHECKING PAYMENT
            </div>

            <h1>
              Checking your payment status.
            </h1>

            <p>
              Please wait...
            </p>

          </div>

        </section>

      </main>
    );
  }


  /* =========================================================
     PAYMENT FORM
  ========================================================= */

  return (
    <main className="checkout-page">

      <section className="checkout-top">

        <div className="education-container">

          <Link
            href={`/education/${course.slug}/buy`}
            className="checkout-back"
          >
            <ArrowLeft
              size={16}
            />

            Back to course
          </Link>


          <div className="checkout-heading">

            <div>

              <div className="eyebrow">
                SECURE COURSE CHECKOUT
              </div>

              <h1>
                Complete your enrollment.
              </h1>

              <p>
                Complete your payment and
                submit your transaction details
                for verification.
              </p>

            </div>

          </div>

        </div>

      </section>


      <section className="checkout-main">

        <div className="education-container">

          <div className="checkout-grid">


            {/* =================================================
                FORM
            ================================================= */}

            <div className="checkout-form-card">

              <div className="checkout-form-icon">

                <CreditCard
                  size={22}
                />

              </div>

              <div className="checkout-form-label">
                PAYMENT DETAILS
              </div>

              <h2>
                Submit your payment
              </h2>

              <p className="checkout-form-description">
                Make your payment and enter
                your transaction information below.
              </p>


              {error && (
                <div className="checkout-error">

                  <XCircle
                    size={18}
                  />

                  <span>
                    {error}
                  </span>

                </div>
              )}


              <form
                onSubmit={
                  handleSubmit
                }
                className="checkout-form"
              >


                {/* NAME */}

                <div className="checkout-field">

                  <label htmlFor="name">
                    Full Name
                  </label>

                  <div className="checkout-input-wrap">

                    <UserRound
                      size={17}
                    />

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value,
                        )
                      }
                      placeholder="Enter your full name"
                      disabled={submitting}
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div className="checkout-field">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value,
                      )
                    }
                    placeholder="you@example.com"
                    disabled={submitting}
                  />

                </div>


                {/* PHONE */}

                <div className="checkout-field">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value,
                      )
                    }
                    placeholder="+91 98765 43210"
                    disabled={submitting}
                  />

                  <small>
                    This mobile number identifies
                    your course access.
                  </small>

                </div>


                {/* UTR */}

                <div className="checkout-field">

                  <label htmlFor="transactionId">
                    UTR / Transaction Reference
                  </label>

                  <input
                    id="transactionId"
                    type="text"
                    value={transactionId}
                    onChange={(e) =>
                      setTransactionId(
                        e.target.value,
                      )
                    }
                    placeholder="Enter UTR / transaction ID"
                    disabled={submitting}
                  />

                  <small>
                    Enter the transaction
                    reference shown by your
                    UPI or banking app.
                  </small>

                </div>


                {/* SCREENSHOT */}

                <div className="checkout-field">

                  <label htmlFor="paymentScreenshot">
                    Payment Screenshot
                  </label>

                  <label
                    htmlFor="paymentScreenshot"
                    className="checkout-upload"
                  >

                    <Upload
                      size={25}
                    />

                    <strong>
                      {paymentScreenshot
                        ? paymentScreenshot.name
                        : "Upload payment screenshot"}
                    </strong>

                    <span>
                      PNG, JPG or WEBP up to 5 MB
                    </span>

                  </label>

                  <input
                    id="paymentScreenshot"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={
                      handleFileChange
                    }
                    disabled={
                      submitting
                    }
                    className="checkout-file-input"
                  />

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="checkout-button"
                  disabled={submitting}
                >

                  {submitting ? (
                    <>
                      <span className="checkout-button-spinner" />

                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Payment

                      <ArrowUpRight
                        size={17}
                      />
                    </>
                  )}

                </button>


                <div className="checkout-security">

                  <ShieldCheck
                    size={17}
                  />

                  <span>
                    Your payment information is
                    securely stored and reviewed
                    by the Divyajyoti team.
                  </span>

                </div>

              </form>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <aside className="checkout-summary">

              <div className="checkout-summary-label">
                YOUR COURSE
              </div>

              <h2>
                {course.title}
              </h2>

              <p className="checkout-summary-category">
                {course.category ||
                  "Divyajyoti Education"}
              </p>


              {courseImage && (
                <div
                  className="checkout-course-image"
                  style={{
                    backgroundImage:
                      `url(${courseImage})`,
                  }}
                />
              )}


              <div className="checkout-course-info">

                <div>

                  <Clock3
                    size={16}
                  />

                  <span>
                    {course.duration ||
                      "Flexible learning"}
                  </span>

                </div>


                <div>

                  <BookOpen
                    size={16}
                  />

                  <span>
                    {lessonCount} lessons
                  </span>

                </div>


                <div>

                  <GraduationCap
                    size={16}
                  />

                  <span>
                    {course.level ||
                      "Professional"}
                  </span>

                </div>

              </div>


              <div className="checkout-divider" />


              <div className="checkout-price-row">

                <span>
                  Course fee
                </span>

                <strong>
                  ₹
                  {price.toLocaleString(
                    "en-IN",
                  )}
                </strong>

              </div>


              <div className="checkout-price-row total">

                <span>
                  Total
                </span>

                <strong>

                  <IndianRupee
                    size={17}
                  />

                  {price.toLocaleString(
                    "en-IN",
                  )}

                </strong>

              </div>


              <div className="checkout-payment-box">

                <div className="checkout-payment-box-header">

                  <CreditCard
                    size={18}
                  />

                  <strong>
                    Payment Instructions
                  </strong>

                </div>

                <p>
                  Complete the payment using
                  the approved Divyajyoti payment
                  method, then submit the UTR
                  and screenshot.
                </p>


                <div className="checkout-payment-steps">

                  <div>

                    <span>
                      1
                    </span>

                    <p>
                      Complete the payment.
                    </p>

                  </div>


                  <div>

                    <span>
                      2
                    </span>

                    <p>
                      Copy your UTR / transaction
                      reference.
                    </p>

                  </div>


                  <div>

                    <span>
                      3
                    </span>

                    <p>
                      Upload your payment
                      screenshot.
                    </p>

                  </div>


                  <div>

                    <span>
                      4
                    </span>

                    <p>
                      Submit the form for review.
                    </p>

                  </div>

                </div>

              </div>


              <div className="checkout-summary-note">

                <ShieldCheck
                  size={17}
                />

                <span>
                  Course access is activated
                  only after payment verification.
                </span>

              </div>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}