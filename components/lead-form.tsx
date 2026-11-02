
"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

type LeadFormProps = {
  title?: string;
  source?: string;
  interest?: string;
  propertySlug?: string;
};

export function LeadForm({
  title = "Start a conversation",
  source = "website",
  interest = "General Enquiry",
  propertySlug,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter your enquiry.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          message: message.trim(),
          source,
          interest,
          propertySlug: propertySlug || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to submit your enquiry. Please try again."
        );
      }

      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lead-form-card">
      <div className="eyebrow">GET IN TOUCH</div>

      <h2>{title}</h2>

      <p className="lead-form-description">
        Share your details and our team will get back to you.
      </p>

      <div className="lead-interest">
        <span>Enquiry category</span>
        <strong>{interest}</strong>
      </div>

      <form onSubmit={handleSubmit} className="lead-form">
        <div className="lead-form-field">
          <label htmlFor="lead-name">Full name *</label>
          <input
            id="lead-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="lead-form-field">
          <label htmlFor="lead-phone">Phone number *</label>
          <input
            id="lead-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div>

        <div className="lead-form-field">
          <label htmlFor="lead-email">Email address</label>
          <input
            id="lead-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="lead-form-field">
          <label htmlFor="lead-message">How can we help? *</label>
          <textarea
            id="lead-message"
            placeholder="Tell us a little about what you need..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            required
          />
        </div>

        {error && (
          <div className="lead-form-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="lead-form-success" role="status">
            <CheckCircle2 size={19} />
            Your enquiry has been submitted successfully!
          </div>
        )}

        <button
          type="submit"
          className="btn btn-dark lead-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={17} className="lead-spinner" />
              Submitting...
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="lead-form-privacy">
        <ShieldCheck size={16} />
        Your information is handled privately.
      </div>

      <div className="lead-form-help">
        <MessageCircle size={15} />
        Our team will contact you using the details provided.
      </div>

      <style jsx>{`
        .lead-form-card {
          width: 100%;
          padding: 34px;
          border: 1px solid #e8e3d9;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 12px 40px rgba(17, 29, 49, 0.045);
        }

        .lead-form-card h2 {
          margin: 0;
          color: #172438;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 34px;
          font-weight: 500;
        }

        .lead-form-description {
          margin: 12px 0 22px;
          color: #718096;
          font-size: 14px;
          line-height: 1.7;
        }

        .lead-interest {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding: 13px 15px;
          border: 1px solid #eee6d8;
          border-radius: 8px;
          background: #fbf8f1;
        }

        .lead-interest span {
          color: #718096;
          font-size: 13px;
        }

        .lead-interest strong {
          color: #b17b30;
          font-size: 13px;
        }

        .lead-form {
          display: grid;
          gap: 18px;
        }

        .lead-form-field {
          display: grid;
          gap: 8px;
        }

        .lead-form-field label {
          color: #263449;
          font-size: 14px;
          font-weight: 650;
        }

        .lead-form-field input,
        .lead-form-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 14px;
          border: 1px solid #dedfe3;
          border-radius: 7px;
          outline: none;
          background: #fff;
          color: #172438;
          font: inherit;
          font-size: 14px;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .lead-form-field input {
          min-height: 48px;
        }

        .lead-form-field textarea {
          min-height: 125px;
          resize: vertical;
        }

        .lead-form-field input:focus,
        .lead-form-field textarea:focus {
          border-color: #c69a52;
          box-shadow: 0 0 0 3px rgba(198, 154, 82, 0.12);
        }

        .lead-submit {
          width: 100%;
          min-height: 50px;
          border: 0;
          cursor: pointer;
        }

        .lead-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .lead-form-error {
          padding: 12px;
          border-radius: 7px;
          background: #fff1f0;
          color: #b42318;
          font-size: 13px;
        }

        .lead-form-success {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px;
          border-radius: 7px;
          background: #edf8f0;
          color: #207044;
          font-size: 13px;
        }

        .lead-form-privacy,
        .lead-form-help {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          color: #778397;
          font-size: 12px;
        }

        .lead-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .lead-form-card {
            padding: 23px 18px;
          }

          .lead-form-card h2 {
            font-size: 29px;
          }
        }
      `}</style>
    </div>
  );
}
