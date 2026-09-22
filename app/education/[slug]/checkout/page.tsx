"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  useMutation,
  useQuery,
} from "convex/react";

import {
  api,
} from "@/convex/_generated/api";

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


export default function CourseCheckoutPage() {

  const params =
    useParams();


  const slug =
    typeof params?.slug ===
    "string"
      ? params.slug
      : "";


  const course =
    useQuery(
      api.courses.bySlug,
      slug
        ? { slug }
        : "skip",
    );


  const [
    name,
    setName,
  ] = useState("");


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    phone,
    setPhone,
  ] = useState("");


  const [
    transactionId,
    setTransactionId,
  ] = useState("");


  const [
    paymentScreenshot,
    setPaymentScreenshot,
  ] =
    useState<File | null>(
      null,
    );


  const [
    lookupPhone,
    setLookupPhone,
  ] = useState("");


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const generateUploadUrl =
    useMutation(
      api.coursePayments
        .generateUploadUrl,
    );


  const submitPayment =
    useMutation(
      api.coursePayments
        .submitPayment,
    );


  /* =====================================================
     CHECK ONLY THE CURRENT PHONE + CURRENT COURSE
  ===================================================== */

  const enrollment =
    useQuery(
      api.coursePayments
        .getEnrollmentByPhone,
      lookupPhone && slug
        ? {
            phone:
              lookupPhone,

            courseSlug:
              slug,
          }
        : "skip",
    );


  const price =
    useMemo(
      () =>
        course &&
        typeof course.price ===
          "number"
          ? course.price
          : 0,
      [course],
    );


  const lessonCount =
    useMemo(
      () => {

        if (!course) {
          return 0;
        }

        return Array.isArray(
          course.lessons,
        )
          ? course.lessons.length
          : Number(
              course.lessons || 0,
            );

      },
      [course],
    );


  const image =
    course?.image ||
    course?.images?.[0] ||
    "";


  const status =
    String(
      enrollment?.status ??
        "",
    ).toUpperCase();


  /* =====================================================
     FILE CHANGE
  ===================================================== */

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {

    const file =
      event.target.files?.[0];


    setError("");


    if (!file) {

      setPaymentScreenshot(
        null,
      );

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setPaymentScreenshot(
        null,
      );

      event.target.value =
        "";

      setError(
        "Payment screenshot must be smaller than 5 MB.",
      );

      return;

    }


    if (
      !file.type.startsWith(
        "image/",
      )
    ) {

      setPaymentScreenshot(
        null,
      );

      event.target.value =
        "";

      setError(
        "Please upload a valid image file.",
      );

      return;

    }


    setPaymentScreenshot(
      file,
    );

  };


  /* =====================================================
     RESET CURRENT NUMBER
  ===================================================== */

  const resetNumber = () => {

    setLookupPhone("");

    setPhone("");

    setTransactionId("");

    setPaymentScreenshot(
      null,
    );

    setError("");

  };


  /* =====================================================
     SUBMIT
  ===================================================== */

  const submit = async (
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
        "Please enter a valid 10-digit mobile number.",
      );

      return;

    }


    if (
      transactionId.trim()
        .length < 4
    ) {

      setError(
        "Please enter a valid payment reference / UTR.",
      );

      return;

    }


    if (
      !paymentScreenshot
    ) {

      setError(
        "Please upload your payment screenshot.",
      );

      return;

    }


    setSubmitting(true);


    try {

      /* ===============================================
         UPLOAD SCREENSHOT
      =============================================== */

      const uploadUrl =
        await generateUploadUrl(
          {},
        );


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


      if (
        !response.ok
      ) {

        throw new Error(
          "Failed to upload payment screenshot.",
        );

      }


      const uploadResult =
        await response.json();


      if (
        !uploadResult.storageId
      ) {

        throw new Error(
          "Payment screenshot upload failed.",
        );

      }


      /* ===============================================
         CREATE ENROLLMENT
      =============================================== */

      await submitPayment(
        {

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
            uploadResult.storageId,

        },
      );


      /*
       * Only now do we start checking
       * this specific phone number.
       */

      setPhone(
        normalizedPhone,
      );

      setLookupPhone(
        normalizedPhone,
      );


      setTransactionId(
        "",
      );

      setPaymentScreenshot(
        null,
      );


    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Payment submission failed.",
      );

    } finally {

      setSubmitting(false);

    }

  };


  /* =====================================================
     COURSE LOADING
  ===================================================== */

  if (
    course ===
    undefined
  ) {

    return (
      <CheckoutMessage
        title="Loading checkout"
        text="Preparing your course enrollment."
        loading
      />
    );

  }


  /* =====================================================
     COURSE NOT FOUND
  ===================================================== */

  if (
    course ===
    null
  ) {

    return (
      <CheckoutMessage
        title="Course not found"
        text="The course may have been removed or the link may be incorrect."
        action={
          <Link href="/education">
            View courses
            <ArrowUpRight size={16} />
          </Link>
        }
      />
    );

  }


  /* =====================================================
     CHECKING CURRENT PHONE
  ===================================================== */

  if (
    lookupPhone &&
    enrollment ===
      undefined
  ) {

    return (
      <CheckoutMessage
        title="Checking your course access"
        text="Checking this mobile number against this course."
        loading
      />
    );

  }


  /* =====================================================
     APPROVED
  ===================================================== */

  if (
    enrollment &&
    status ===
      "APPROVED"
  ) {

    return (

      <main className="checkout-page-v2">

        <section className="checkout-result">

          <div className="checkout-result-card approved">

            <div className="checkout-result-icon">
              <CheckCircle2 size={38} />
            </div>

            <p className="eyebrow">
              PAYMENT SUCCESSFUL
            </p>

            <h1>
              Your course access
              is active.
            </h1>

            <p>
              Your payment for{" "}
              <strong>
                {course.title}
              </strong>{" "}
              has been approved by
              the Divyajyoti team.
            </p>

            <div className="checkout-approved-line">

              <CheckCircle2 size={17} />

              Course access activated

            </div>


            <Link
              href="/my-courses"
              className="checkout-primary-button"
            >
              Go to My Courses
              <ArrowUpRight size={17} />
            </Link>


            <button
              type="button"
              className="checkout-text-button"
              onClick={
                resetNumber
              }
            >
              Use another mobile number
            </button>

          </div>

        </section>

      </main>

    );

  }


  /* =====================================================
     PENDING
  ===================================================== */

  if (
    enrollment &&
    status ===
      "PENDING"
  ) {

    return (

      <main className="checkout-page-v2">

        <section className="checkout-result">

          <div className="checkout-result-card">

            <div className="checkout-result-icon pending">

              <Clock3 size={38} />

            </div>

            <p className="eyebrow">
              PAYMENT SUBMITTED
            </p>

            <h1>
              Your payment is
              under review.
            </h1>

            <p>
              We received the payment
              details for{" "}
              <strong>
                {course.title}
              </strong>.
              This page will update
              automatically after
              admin approval.
            </p>

            <div className="checkout-approved-line pending-line">

              <ShieldCheck size={17} />

              Status: Pending approval

            </div>


            <Link
              href={`/education/${course.slug}`}
              className="checkout-secondary-button"
            >
              Back to course
            </Link>


            <button
              type="button"
              className="checkout-text-button"
              onClick={
                resetNumber
              }
            >
              Use another mobile number
            </button>

          </div>

        </section>

      </main>

    );

  }


  /* =====================================================
     CHECKOUT FORM
  ===================================================== */

  return (

    <main className="checkout-page-v2">

      {/* HERO */}

      <section className="checkout-hero-v2">

        <div className="education-container">

          <Link
            href={`/education/${course.slug}/buy`}
            className="course-back"
          >
            <ArrowLeft size={16} />
            Back to course
          </Link>

          <p className="learning-kicker">
            DIVYAJYOTI • COURSE ENROLLMENT
          </p>

          <h1>
            Complete your enrollment.
          </h1>

          <p>
            Pay the course fee, then
            submit your UTR and payment
            screenshot for verification.
          </p>

        </div>

      </section>


      {/* MAIN */}

      <section className="checkout-main-v2">

        <div className="education-container checkout-v2-grid">

          {/* =================================================
              FORM
          ================================================= */}

          <div className="checkout-v2-form-card">

            <div className="checkout-v2-card-head">

              <div className="checkout-v2-icon">
                <CreditCard size={21} />
              </div>

              <div>

                <p className="eyebrow">
                  PAYMENT DETAILS
                </p>

                <h2>
                  Submit your payment
                </h2>

              </div>

            </div>


            <div className="checkout-number-note">

              <strong>
                Important
              </strong>

              <span>
                Use your own mobile number.
                Course access is linked to
                this number plus this course.
              </span>

            </div>


            {error && (

              <div className="checkout-v2-error">

                <XCircle size={17} />

                {error}

              </div>

            )}


            <form
              onSubmit={
                submit
              }
              className="checkout-v2-form"
            >

              {/* NAME */}

              <label>

                Full name

                <span className="checkout-v2-input">

                  <UserRound size={17} />

                  <input
                    value={
                      name
                    }
                    onChange={(
                      event,
                    ) =>
                      setName(
                        event.target.value,
                      )
                    }
                    placeholder="Enter your full name"
                    disabled={
                      submitting
                    }
                  />

                </span>

              </label>


              {/* EMAIL */}

              <label>

                Email address

                <input
                  type="email"
                  value={
                    email
                  }
                  onChange={(
                    event,
                  ) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  placeholder="you@example.com"
                  disabled={
                    submitting
                  }
                />

              </label>


              {/* PHONE */}

              <label>

                Mobile number

                <input
                  type="tel"
                  inputMode="numeric"
                  value={
                    phone
                  }
                  onChange={(
                    event,
                  ) => {

                    setPhone(
                      event.target.value,
                    );

                    setLookupPhone(
                      "",
                    );

                  }}
                  placeholder="Enter your 10-digit number"
                  disabled={
                    submitting
                  }
                />

                <small>
                  This is the number
                  you will use to access
                  My Courses.
                </small>

              </label>


              {/* UTR */}

              <label>

                UTR / transaction reference

                <input
                  value={
                    transactionId
                  }
                  onChange={(
                    event,
                  ) =>
                    setTransactionId(
                      event.target.value,
                    )
                  }
                  placeholder="Enter UTR / transaction ID"
                  disabled={
                    submitting
                  }
                />

              </label>


              {/* SCREENSHOT */}

              <div className="checkout-v2-form-field">

                <label htmlFor="payment-proof">
                  Payment screenshot
                </label>

                <label
                  htmlFor="payment-proof"
                  className="checkout-upload-v2"
                >

                  <Upload size={24} />

                  <strong>
                    {paymentScreenshot
                      ? paymentScreenshot.name
                      : "Upload payment screenshot"}
                  </strong>

                  <span>
                    PNG, JPG or WEBP
                    • maximum 5 MB
                  </span>

                </label>

                <input
                  id="payment-proof"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={
                    handleFileChange
                  }
                  disabled={
                    submitting
                  }
                  hidden
                />

              </div>


              {/* SUBMIT */}

              <button
                className="checkout-submit-v2"
                type="submit"
                disabled={
                  submitting
                }
              >

                {submitting
                  ? "Submitting payment..."
                  : (
                    <>
                      Submit payment
                      <ArrowUpRight size={17} />
                    </>
                  )}

              </button>


              <div className="checkout-security-v2">

                <ShieldCheck size={17} />

                Your payment details are
                stored for review by the
                Divyajyoti team.

              </div>

            </form>

          </div>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <aside className="checkout-v2-summary">

            <p className="eyebrow">
              YOUR COURSE
            </p>

            <h2>
              {course.title}
            </h2>

            <p>
              {course.category ||
                "Divyajyoti Learning"}
            </p>


            {image && (

              <div
                className="checkout-v2-image"
                style={{
                  backgroundImage:
                    `url(${image})`,
                }}
              />

            )}


            <div className="checkout-v2-facts">

              <span>
                <BookOpen size={16} />
                {lessonCount} lessons
              </span>

              <span>
                <Clock3 size={16} />
                {course.duration ||
                  "Flexible"}
              </span>

              <span>
                <GraduationCap size={16} />
                {course.level ||
                  "Professional"}
              </span>

            </div>


            <div className="checkout-v2-total">

              <span>
                Course fee
              </span>

              <strong>

                <IndianRupee size={18} />

                {price.toLocaleString(
                  "en-IN",
                )}

              </strong>

            </div>


            <div className="checkout-v2-steps">

              <strong>
                Payment process
              </strong>

              <div>
                <b>01</b>
                <span>
                  Complete the payment
                  using the Divyajyoti
                  payment method.
                </span>
              </div>

              <div>
                <b>02</b>
                <span>
                  Copy the UTR or
                  transaction reference.
                </span>
              </div>

              <div>
                <b>03</b>
                <span>
                  Upload your payment
                  screenshot.
                </span>
              </div>

              <div>
                <b>04</b>
                <span>
                  Submit for admin
                  verification.
                </span>
              </div>

            </div>


            <div className="checkout-v2-note">

              <ShieldCheck size={17} />

              Access is activated only
              after payment approval.

            </div>

          </aside>

        </div>

      </section>

    </main>

  );
}


/* =========================================================
   CHECKOUT MESSAGE
========================================================= */

function CheckoutMessage({
  title,
  text,
  loading = false,
  action,
}: {
  title: string;
  text: string;
  loading?: boolean;
  action?: ReactNode;
}) {

  return (

    <main className="checkout-page-v2">

      <section className="checkout-result">

        <div className="checkout-result-card">

          {loading ? (

            <Clock3
              className="checkout-message-spin"
              size={28}
            />

          ) : (

            <XCircle
              size={30}
            />

          )}


          <p className="eyebrow">
            DIVYAJYOTI • LEARNING
          </p>

          <h1>
            {title}
          </h1>

          <p>
            {text}
          </p>


          {action ?? (

            <Link
              href="/education"
              className="checkout-primary-button"
            >
              Back to Learning
              <ArrowUpRight size={16} />
            </Link>

          )}

        </div>

      </section>

    </main>

  );
}