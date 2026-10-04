"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SiteVisitPage() {
  const params = useParams();
  const router = useRouter();

  const slug = String(params?.slug ?? "").trim();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const property = useQuery(
    api.properties.bySlug,
    slug ? { slug } : "skip",
  );

  const createSiteVisit = useMutation(
    api.siteVisits.create,
  );

  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(
      date.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanDate = preferredDate.trim();
    const cleanNotes = notes.trim();

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (!cleanPhone) {
      setError("Please enter your phone number.");
      return;
    }

    if (!cleanDate) {
      setError("Please select a preferred visit date.");
      return;
    }

    if (!slug) {
      setError(
        "The property could not be identified.",
      );
      return;
    }

    setBusy(true);

    try {
      await createSiteVisit({
        propertySlug: slug,
        name: cleanName,
        phone: cleanPhone,
        email:
          cleanEmail || undefined,
        preferredDate: cleanDate,
        notes:
          cleanNotes || undefined,
      });

      setSubmitted(true);
    } catch (submitError) {
      console.error(
        "Site visit submission failed:",
        submitError,
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to schedule the site visit right now.",
      );
    } finally {
      setBusy(false);
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (property === undefined) {
    return (
      <main>
        <section className="section">
          <div
            className="container"
            style={{
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <div
              className="sticky-card"
              style={{
                padding: 40,
                textAlign: "center",
              }}
            >
              <Loader2
                size={28}
                className="spin"
              />

              <p
                style={{
                  marginTop: 16,
                  color: "#667085",
                }}
              >
                Loading property details...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     PROPERTY NOT FOUND
  ========================================================= */

  if (property === null) {
    return (
      <main>
        <section className="section">
          <div
            className="container"
            style={{
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <Link
              href="/properties"
              className="back-link"
            >
              <ArrowLeft size={15} />
              Back to properties
            </Link>

            <div
              className="sticky-card"
              style={{
                marginTop: 30,
                padding: 40,
              }}
            >
              <div className="eyebrow">
                Property
              </div>

              <h1
                className="display"
                style={{
                  marginTop: 10,
                }}
              >
                Property not found.
              </h1>

              <p
                className="copy"
                style={{
                  marginTop: 14,
                }}
              >
                We could not find this property in
                the current collection.
              </p>

              <Link
                href="/properties"
                className="btn btn-dark"
                style={{
                  marginTop: 24,
                }}
              >
                <ArrowLeft size={15} />
                Back to properties
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     SUCCESS SCREEN
  ========================================================= */

  if (submitted) {
    return (
      <main>
        <section className="pagehero">
          <div className="container">
            <div className="eyebrow">
              Site visit request
            </div>

            <h1>
              Your visit request has been received.
            </h1>

            <p>
              Thank you, {name}. Our property team
              will contact you on {phone} to confirm
              the visit.
            </p>
          </div>
        </section>

        <section className="section">
          <div
            className="container"
            style={{
              maxWidth: 850,
              margin: "0 auto",
            }}
          >
            <div
              className="sticky-card"
              style={{
                padding: 40,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: "0 auto 20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "rgba(16, 185, 129, 0.10)",
                  color: "#059669",
                }}
              >
                <CheckCircle2 size={34} />
              </div>

              <div className="eyebrow">
                REQUEST RECEIVED
              </div>

              <h2
                className="display"
                style={{
                  fontSize: 36,
                  marginTop: 8,
                }}
              >
                We will be in touch shortly.
              </h2>

              <p
                className="copy"
                style={{
                  maxWidth: 600,
                  margin:
                    "14px auto 0",
                }}
              >
                Your request for a site visit at{" "}
                <strong>
                  {property.title}
                </strong>{" "}
                has been recorded.
              </p>

              <div
                style={{
                  marginTop: 28,
                  padding: 20,
                  border:
                    "1px solid #e7e1d8",
                  borderRadius: 12,
                  textAlign: "left",
                  background: "#faf8f4",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <CalendarDays
                    size={18}
                    style={{
                      marginTop: 2,
                    }}
                  />

                  <div>
                    <strong>
                      Requested date
                    </strong>

                    <p
                      style={{
                        marginTop: 4,
                      }}
                    >
                      {preferredDate}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    marginTop: 18,
                  }}
                >
                  <MapPin
                    size={18}
                    style={{
                      marginTop: 2,
                    }}
                  />

                  <div>
                    <strong>
                      Property
                    </strong>

                    <p
                      style={{
                        marginTop: 4,
                      }}
                    >
                      {property.title}
                    </p>

                    <p
                      style={{
                        marginTop: 2,
                        color: "#667085",
                      }}
                    >
                      {property.location}
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: 28,
                }}
              >
                <Link
                  href={`/properties/${slug}`}
                  className="btn btn-dark"
                >
                  View property
                  <ArrowUpRight
                    size={14}
                  />
                </Link>

                <Link
                  href="/properties"
                  className="btn btn-light"
                >
                  Explore properties
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     MAIN FORM
  ========================================================= */

  return (
    <main>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="pagehero">
        <div className="container">
          <Link
            href={`/properties/${slug}`}
            className="back-link"
          >
            <ArrowLeft size={15} />
            Back to property
          </Link>

          <div
            className="eyebrow"
            style={{
              marginTop: 28,
            }}
          >
            Schedule a site visit
          </div>

          <h1>
            See {property.title} in person.
          </h1>

          <p>
            Tell us when you would like to visit
            and our property team will coordinate
            the next step with you.
          </p>
        </div>
      </section>

      {/* =====================================================
          FORM SECTION
      ===================================================== */}

      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.35fr) minmax(300px, 0.65fr)",
              gap: 30,
              alignItems: "start",
            }}
          >
            {/* =================================================
                FORM
            ================================================= */}

            <div
              className="sticky-card"
              style={{
                padding: 34,
              }}
            >
              <div className="eyebrow">
                VISIT REQUEST
              </div>

              <h2
                className="display"
                style={{
                  fontSize: 34,
                  marginTop: 8,
                }}
              >
                Tell us how we can arrange it.
              </h2>

              <p
                className="copy"
                style={{
                  marginTop: 12,
                }}
              >
                Fill in your details and preferred
                date. Our team will contact you to
                confirm the visit.
              </p>

              <form
                onSubmit={handleSubmit}
                style={{
                  marginTop: 28,
                }}
              >
                {/* NAME */}

                <label
                  style={{
                    display: "block",
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    <User size={14} />
                    Name
                  </span>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value,
                      )
                    }
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                  />
                </label>

                {/* PHONE */}

                <label
                  style={{
                    display: "block",
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    <Phone size={14} />
                    Phone
                  </span>

                  <input
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value,
                      )
                    }
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                  />
                </label>

                {/* EMAIL */}

                <label
                  style={{
                    display: "block",
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    <Mail size={14} />
                    Email
                  </span>

                  <input
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </label>

                {/* DATE */}

                <label
                  style={{
                    display: "block",
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    <CalendarDays
                      size={14}
                    />
                    Preferred visit date
                  </span>

                  <input
                    type="date"
                    value={preferredDate}
                    min={today}
                    onChange={(event) =>
                      setPreferredDate(
                        event.target.value,
                      )
                    }
                    required
                  />
                </label>

                {/* NOTES */}

                <label
                  style={{
                    display: "block",
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    <MessageSquare
                      size={14}
                    />
                    Additional note
                  </span>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(
                        event.target.value,
                      )
                    }
                    rows={5}
                    placeholder="Tell us anything we should know about your visit..."
                  />
                </label>

                {/* ERROR */}

                {error && (
                  <div
                    role="alert"
                    style={{
                      marginBottom: 18,
                      padding: 14,
                      borderRadius: 10,
                      background:
                        "rgba(220, 38, 38, 0.08)",
                      color: "#b42318",
                      fontSize: 14,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={busy}
                  style={{
                    width: "100%",
                  }}
                >
                  {busy ? (
                    <>
                      <Loader2
                        size={15}
                        className="spin"
                      />
                      Sending request...
                    </>
                  ) : (
                    <>
                      Request site visit
                      <ArrowUpRight
                        size={15}
                      />
                    </>
                  )}
                </button>

                <p
                  style={{
                    marginTop: 14,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: "#7b8494",
                    textAlign: "center",
                  }}
                >
                  Your information is used to
                  coordinate this property visit.
                </p>
              </form>
            </div>

            {/* =================================================
                PROPERTY SUMMARY
            ================================================= */}

            <aside
              className="sticky-card"
              style={{
                overflow: "hidden",
              }}
            >
              {/* PROPERTY IMAGE */}

              {property.image && (
                <div
                  style={{
                    height: 250,
                    backgroundImage: `url(${property.image})`,
                    backgroundSize: "cover",
                    backgroundPosition:
                      "center",
                  }}
                />
              )}

              <div
                style={{
                  padding: 26,
                }}
              >
                <div className="eyebrow">
                  PROPERTY
                </div>

                <h2
                  style={{
                    marginTop: 8,
                    fontSize: 26,
                    lineHeight: 1.2,
                  }}
                >
                  {property.title}
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "flex-start",
                    gap: 8,
                    marginTop: 14,
                    color: "#667085",
                  }}
                >
                  <MapPin
                    size={16}
                    style={{
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  />

                  <span>
                    {property.location}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, 1fr)",
                    gap: 10,
                    marginTop: 24,
                  }}
                >
                  <div
                    style={{
                      padding: 12,
                      border:
                        "1px solid #e7e1d8",
                      borderRadius: 10,
                    }}
                  >
                    <strong
                      style={{
                        display:
                          "block",
                      }}
                    >
                      {property.beds}
                    </strong>

                    <span
                      style={{
                        fontSize: 12,
                        color:
                          "#667085",
                      }}
                    >
                      Beds
                    </span>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      border:
                        "1px solid #e7e1d8",
                      borderRadius: 10,
                    }}
                  >
                    <strong
                      style={{
                        display:
                          "block",
                      }}
                    >
                      {property.baths}
                    </strong>

                    <span
                      style={{
                        fontSize: 12,
                        color:
                          "#667085",
                      }}
                    >
                      Baths
                    </span>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      border:
                        "1px solid #e7e1d8",
                      borderRadius: 10,
                    }}
                  >
                    <strong
                      style={{
                        display:
                          "block",
                      }}
                    >
                      {property.area}
                    </strong>

                    <span
                      style={{
                        fontSize: 12,
                        color:
                          "#667085",
                      }}
                    >
                      Area
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 22,
                    paddingTop: 20,
                    borderTop:
                      "1px solid #e7e1d8",
                  }}
                >
                  <span
                    style={{
                      display:
                        "block",
                      fontSize: 12,
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.08em",
                      color:
                        "#8a6a32",
                      fontWeight: 700,
                    }}
                  >
                    Price
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      marginTop: 4,
                      fontSize: 24,
                    }}
                  >
                    {typeof property.price ===
                    "number"
                      ? `₹${property.price.toLocaleString(
                          "en-IN",
                        )}`
                      : property.price}
                  </strong>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}