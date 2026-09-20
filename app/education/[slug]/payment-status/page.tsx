"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowRight,
  RefreshCw,
  BookOpen,
} from "lucide-react";

import {
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";

export default function PaymentStatusPage() {
  const params = useParams();

  const slug = String(
    params.slug ?? "",
  );

  const [enrollmentId, setEnrollmentId] =
    useState<string | null>(null);

  useEffect(() => {
    const id =
      localStorage.getItem(
        `divyajyoti_enrollment_${slug}`,
      );

    setEnrollmentId(id);
  }, [slug]);

  const enrollment =
    useQuery(
      api.coursePayments.getEnrollment,
      enrollmentId
        ? {
            enrollmentId:
              enrollmentId as any,
          }
        : "skip",
    );

  if (!enrollmentId) {
    return (
      <main className="payment-status-page">
        <div className="payment-status-card">
          <XCircle
            size={56}
            className="payment-status-icon error"
          />

          <h1>
            Enrollment not found
          </h1>

          <p>
            We could not find your payment
            submission on this device.
          </p>

          <Link
            href={`/education/${slug}`}
            className="payment-status-button"
          >
            Back to Course
          </Link>
        </div>
      </main>
    );
  }

  if (enrollment === undefined) {
    return (
      <main className="payment-status-page">
        <div className="payment-status-card">
          <RefreshCw
            size={42}
            className="payment-loading-icon"
          />

          <h1>
            Checking payment status
          </h1>

          <p>
            Please wait while we check your
            enrollment.
          </p>
        </div>
      </main>
    );
  }

  if (!enrollment) {
    return (
      <main className="payment-status-page">
        <div className="payment-status-card">
          <XCircle
            size={56}
            className="payment-status-icon error"
          />

          <h1>
            Enrollment not found
          </h1>

          <p>
            This enrollment could not be
            found.
          </p>
        </div>
      </main>
    );
  }

  const status =
    String(
      enrollment.status ?? "",
    ).toUpperCase();

  /* =========================================================
     APPROVED
     ========================================================= */

  if (status === "APPROVED") {
    return (
      <main className="payment-status-page">
        <div className="payment-status-card success-card">
          <div className="payment-success-icon">
            <CheckCircle2 size={54} />
          </div>

          <span className="payment-status-eyebrow">
            PAYMENT SUCCESSFUL
          </span>

          <h1>
            Your payment has been approved.
          </h1>

          <p>
            Congratulations,{" "}
            <strong>
              {enrollment.name}
            </strong>
            .
          </p>

          <p>
            You can now access your
            <strong>
              {" "}
              {enrollment.courseTitle}
            </strong>
            course.
          </p>

          <div className="payment-success-box">
            <BookOpen size={22} />

            <div>
              <strong>
                Course access unlocked
              </strong>

              <span>
                Your enrollment is now
                active.
              </span>
            </div>
          </div>

          <Link
            href={`/education/${slug}/learn`}
            className="payment-status-button primary"
          >
            Open My Course
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     REJECTED
     ========================================================= */

  if (status === "REJECTED") {
    return (
      <main className="payment-status-page">
        <div className="payment-status-card">
          <div className="payment-rejected-icon">
            <XCircle size={54} />
          </div>

          <span className="payment-status-eyebrow rejected">
            PAYMENT REJECTED
          </span>

          <h1>
            We could not approve this
            payment.
          </h1>

          <p>
            Please review the payment
            information and contact the
            Divyajyoti team.
          </p>

          <Link
            href={`/education/${slug}/checkout`}
            className="payment-status-button primary"
          >
            Submit Again
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     PENDING
     ========================================================= */

  return (
    <main className="payment-status-page">
      <div className="payment-status-card">
        <div className="payment-pending-icon">
          <Clock3 size={54} />
        </div>

        <span className="payment-status-eyebrow pending">
          PAYMENT UNDER REVIEW
        </span>

        <h1>
          Your payment has been
          submitted.
        </h1>

        <p>
          Thank you,{" "}
          <strong>
            {enrollment.name}
          </strong>
          .
        </p>

        <p>
          Our team is currently checking
          your payment proof and UTR.
        </p>

        <div className="payment-pending-box">
          <Clock3 size={21} />

          <div>
            <strong>
              Waiting for admin approval
            </strong>

            <span>
              This page will automatically
              update after your payment is
              reviewed.
            </span>
          </div>
        </div>

        <Link
          href={`/education/${slug}`}
          className="payment-status-button"
        >
          Back to Course
        </Link>
      </div>
    </main>
  );
}