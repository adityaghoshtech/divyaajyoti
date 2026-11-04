
import Link from "next/link";
import PropertyVideoPlayer from "@/components/PropertyVideoPlayer";
import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Phone,
  CalendarDays,
  Download,
  CheckCircle2,
  Heart,
  Car,
  ShieldCheck,
  Trees,
  Building2,
} from "lucide-react";

import { getProperties } from "@/lib/property-source";

// Convert YouTube URLs into embeddable URLs
function getYouTubeEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");

    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsed.pathname.split("/")[1] || "";
    } else if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      videoId =
        parsed.searchParams.get("v") ||
        parsed.pathname.match(
          /^\/(?:embed|shorts)\/([^/?]+)/
        )?.[1] ||
        "";
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

// Convert common Google Drive sharing links into the Drive video player URL.
// The Drive file must be shared as "Anyone with the link - Viewer".
function getGoogleDrivePreviewUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname !== "drive.google.com" && hostname !== "docs.google.com") {
      return null;
    }

    const pathMatch = parsed.pathname.match(/\/(?:file\/d|uc)\/([^/]+)/);
    const fileId =
      pathMatch?.[1] ||
      parsed.searchParams.get("id") ||
      "";

    if (!/^[a-zA-Z0-9_-]{10,}$/.test(fileId)) {
      return null;
    }

    return `https://drive.google.com/file/d/${fileId}/preview`;
  } catch {
    return null;
  }
}

// Normalize brochure URL.
// Supports Google Drive sharing links and ordinary PDF URLs.
function getBrochureUrl(url?: string) {
  if (!url || !url.trim()) return "";

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (
      hostname === "drive.google.com" ||
      hostname === "docs.google.com"
    ) {
      const pathMatch = parsed.pathname.match(
        /\/(?:file\/d|document\/d)\/([^/]+)/
      );

      const fileId =
        pathMatch?.[1] ||
        parsed.searchParams.get("id") ||
        "";

      if (!/^[a-zA-Z0-9_-]{10,}$/.test(fileId)) {
        return trimmed;
      }

      return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}

export default async function PropertyDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Use the same source as /properties
  const properties = await getProperties();

  const property = properties.find(
    (item: any) => item.slug === slug
  );

  if (!property) {
    return (
      <main>
        <section className="section">
          <div className="container">
            <div className="eyebrow">Property</div>

            <h1>Property not found.</h1>

            <p>
              We could not find this property in the current
              property collection.
            </p>

            <Link
              href="/properties"
              className="btn btn-dark"
              style={{ marginTop: 24 }}
            >
              <ArrowLeft size={15} />
              Back to properties
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Use every gallery image saved from the admin form.
  // Older records fall back to the main image.
  const propertyImages: string[] = Array.from(
    new Set(
      [
        ...(((property as any).images as string[] | undefined) ?? []),
        property.image,
      ].filter(
        (url): url is string =>
          typeof url === "string" && url.trim().length > 0
      )
    )
  );

  // Support multiple configurations while keeping old properties compatible.
  const rawPricingOptions = (property as any).pricingOptions;

  const pricingOptions: Array<{ label: string; price: number }> =
    Array.isArray(rawPricingOptions)
      ? rawPricingOptions
          .map((option: any) => ({
            label: String(option?.label ?? "").trim(),
            price: Number(option?.price),
          }))
          .filter(
            (option: { label: string; price: number }) =>
              option.label &&
              Number.isFinite(option.price) &&
              option.price >= 0
          )
          .sort(
            (
              a: { label: string; price: number },
              b: { label: string; price: number }
            ) => a.price - b.price
          )
      : [];

  // Fallback for older records that only contain `price`.
  const displayPricingOptions =
    pricingOptions.length > 0
      ? pricingOptions
      : typeof property.price === "number"
        ? [
            {
              label: property.beds
                ? `${property.beds} Bedroom Configuration`
                : "Starting Price",
              price: property.price,
            },
          ]
        : [];

  const formatPrice = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const startingPrice = displayPricingOptions[0]
    ? formatPrice(displayPricingOptions[0].price)
    : "Price on request";

  // Support multiple Google Drive / YouTube walkthrough links.
  // Older properties with only videoUrl continue to work.
  const propertyVideosRaw =
    (property as typeof property & {
      videos?: { title?: string; url?: string }[];
      videoUrl?: string;
      walkthroughVideoUrl?: string;
      walkthroughUrl?: string;
    }).videos;

  const propertyVideos =
    Array.isArray(propertyVideosRaw) && propertyVideosRaw.length > 0
      ? propertyVideosRaw
          .filter(
            (video) =>
              typeof video.url === "string" && video.url.trim()
          )
          .map((video, index) => ({
            title: video.title?.trim() || `Property Video ${index + 1}`,
            url: video.url!.trim(),
          }))
      : [
          {
            title: "Property walkthrough",
            url:
              (property as any).videoUrl ||
              (property as any).walkthroughVideoUrl ||
              (property as any).walkthroughUrl ||
              "",
          },
        ].filter((video) => Boolean(video.url));

  // BROCHURE: Read the URL supplied by Convex/property-source.
  const brochureUrl = getBrochureUrl(
    (property as typeof property & {
      brochureUrl?: string;
    }).brochureUrl
  );

  return (
    <main>

      {/* =====================================================
          PROPERTY HEADER
      ===================================================== */}

      <section className="property-detail-top">
        <div className="container">

          <Link
            href="/properties"
            className="back-link"
          >
            <ArrowLeft size={15} />
            Back to properties
          </Link>

          <div className="property-detail-header">

            <div>

              <div className="eyebrow">
                {property.tag || "PROPERTY"}
              </div>

              <h1>{property.title}</h1>

              <p className="property-location">
                <MapPin size={16} />
                {property.location}
              </p>

            </div>

            <div className="property-price">
              <span
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Starting price
              </span>
              {startingPrice}
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          MAIN PROPERTY AREA
      ===================================================== */}

      <section className="section property-main-section">

        <div className="container">

          <div className="property-detail-grid">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div>

              {/* GALLERY */}

              <div className="property-gallery">
                <div
                  className="property-gallery-main"
                  style={{
                    backgroundImage: `url(${propertyImages[0] || property.image})`,
                  }}
                >
                  <div className="gallery-overlay">
                    <span>
                      Property Gallery ({propertyImages.length} photos)
                    </span>

                    <a href="#photos" className="gallery-view-button">
                      View photos & videos <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>

                <div className="property-gallery-small">
                  {propertyImages.slice(1, 3).map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      role="img"
                      aria-label={`Property gallery image ${index + 2}`}
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                  ))}
                </div>
              </div>


              {/* =================================================
                  QUICK NAVIGATION
              ================================================= */}

              <nav className="property-tabs">

                <a href="#overview">
                  Overview
                </a>

                <a href="#highlights">
                  Highlights
                </a>

                <a href="#amenities">
                  Amenities
                </a>

                <a href="#floor-plan">
                  Floor Plans
                </a>

                <a href="#location">
                  Location
                </a>

                <a href="#photos">
                  Photos & Videos
                </a>

              </nav>


              {/* =================================================
                  OVERVIEW
              ================================================= */}

              <section
                id="overview"
                className="property-section"
              >

                <div className="eyebrow">
                  PROPERTY OVERVIEW
                </div>

                <h2 className="display">
                  A closer look at {property.title}.
                </h2>

                <p className="property-description">
                  Explore this property in{" "}
                  {property.location}. Review the
                  specifications, layout, amenities and
                  location before making your decision.
                </p>

                <p className="property-description">
                  Divyajyoti's property team can help you
                  understand the property, arrange a visit
                  and answer questions about the opportunity.
                </p>

              </section>


              {/* =================================================
                  HIGHLIGHTS
              ================================================= */}

              <section
                id="highlights"
                className="property-section"
              >

                <div className="eyebrow">
                  PROPERTY HIGHLIGHTS
                </div>

                <h2>
                  Everything important at a glance.
                </h2>

                <div className="property-highlights">

                  <div>
                    <BedDouble size={21} />

                    <strong>
                      {property.beds}
                    </strong>

                    <span>
                      Bedrooms
                    </span>
                  </div>


                  <div>
                    <Bath size={21} />

                    <strong>
                      {property.baths}
                    </strong>

                    <span>
                      Bathrooms
                    </span>
                  </div>


                  <div>
                    <Ruler size={21} />

                    <strong>
                      {property.area}
                    </strong>

                    <span>
                      sq.ft.
                    </span>
                  </div>


                  <div>
                    <Building2 size={21} />

                    <strong>
                      {property.type}
                    </strong>

                    <span>
                      Property type
                    </span>
                  </div>

                </div>

              </section>


              {/* =================================================
                  KEY FEATURES
              ================================================= */}

              <section className="property-section">

                <div className="eyebrow">
                  KEY FEATURES
                </div>

                <h2>
                  Built around everyday living.
                </h2>

                <div className="property-feature-grid">

                  <div>
                    <Car size={20} />
                    <strong>Parking</strong>
                    <span>
                      Convenient parking availability.
                    </span>
                  </div>

                  <div>
                    <ShieldCheck size={20} />
                    <strong>Security</strong>
                    <span>
                      Security-focused residential environment.
                    </span>
                  </div>

                  <div>
                    <Trees size={20} />
                    <strong>Green spaces</strong>
                    <span>
                      Designed with comfortable surroundings.
                    </span>
                  </div>

                  <div>
                    <Building2 size={20} />
                    <strong>Modern living</strong>
                    <span>
                      Practical spaces for contemporary living.
                    </span>
                  </div>

                </div>

              </section>


              {/* =================================================
                  AMENITIES
              ================================================= */}

              <section
                id="amenities"
                className="property-section"
              >

                <div className="eyebrow">
                  AMENITIES
                </div>

                <h2>
                  Amenities and facilities.
                </h2>

                <div className="amenity-grid">

                  {[
                    "24/7 Security",
                    "Parking",
                    "Power Backup",
                    "Water Supply",
                    "Lift",
                    "Green Spaces",
                    "Community Area",
                    "Visitor Parking",
                  ].map((item) => (

                    <div key={item}>
                      <CheckCircle2 size={16} />
                      {item}
                    </div>

                  ))}

                </div>

              </section>


              {/* =================================================
                  FLOOR PLAN
              ================================================= */}

              <section
                id="floor-plan"
                className="property-section"
              >

                <div className="eyebrow">
                  FLOOR PLANS & PRICING
                </div>

                <h2>
                  Explore the available configurations.
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                    marginTop: 24,
                  }}
                >
                  {displayPricingOptions.map((option, index) => (
                    <div
                      key={`${option.label}-${index}`}
                      className="floor-plan-card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        gap: 14,
                        padding: 20,
                      }}
                    >
                      <div>
                        <strong>{option.label}</strong>

                        <span style={{ display: "block", marginTop: 8 }}>
                          {property.area
                            ? `${property.area} sq.ft. (indicative)`
                            : "Area on request"}
                        </span>

                        <strong
                          className="floor-price"
                          style={{ display: "block", marginTop: 12 }}
                        >
                          {formatPrice(option.price)}
                        </strong>
                      </div>

                      <Link
                        href={`/contact?service=property&property=${encodeURIComponent(property.slug)}&configuration=${encodeURIComponent(option.label)}`}
                        className="btn btn-light"
                      >
                        Enquire about {option.label}
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>

              </section>


              {/* =================================================
                  LOCATION
              ================================================= */}

              <section
                id="location"
                className="property-section"
              >

                <div className="eyebrow">
                  LOCATION
                </div>

                <h2>
                  A location worth exploring.
                </h2>

                <div className="location-box">

                  <MapPin size={23} />

                  <div>

                    <strong>
                      {property.location}
                    </strong>

                    <p>
                      Explore nearby schools, hospitals,
                      transport, shopping and everyday
                      conveniences.
                    </p>

                  </div>

                </div>

              </section>


              {/* =================================================
                  VASTU
              ================================================= */}

              <section className="property-section vastu-property">

                <div className="eyebrow">
                  DIVYAJYOTI VASTU
                </div>

                <h2>
                  Understand the property beyond its walls.
                </h2>

                <p>
                  For clients who want it, Divyajyoti can
                  provide a separate Vastu consultation
                  covering the property's entrance,
                  room placement, orientation and other
                  relevant considerations.
                </p>

                <Link
                  href={`/contact?service=vastu&property=${property.slug}`}
                  className="btn btn-dark"
                  style={{ marginTop: 20 }}
                >
                  Contact our team
                  <ArrowUpRight size={15} />
                </Link>

              </section>


              {/* =================================================
                  PHOTOS & VIDEOS
              ================================================= */}

              <section
                id="photos"
                className="property-section"
              >

                <div className="eyebrow">
                  PHOTOS & VIDEOS
                </div>

                <h2>
                  See the property in detail.
                </h2>

                {propertyImages.length > 0 && (
                  <div
                    className="property-photo-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 14,
                      margin: "24px 0 36px",
                    }}
                  >
                    {propertyImages.map((imageUrl, index) => (
                      <a
                        key={`${imageUrl}-${index}`}
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open property photo ${index + 1}`}
                        style={{
                          display: "block",
                          aspectRatio: "4 / 3",
                          overflow: "hidden",
                          background: "#eee",
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={`${property.title} property photo ${index + 1}`}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </a>
                    ))}
                  </div>
                )}

                <PropertyVideoPlayer
                  videos={propertyVideos}
                  propertyTitle={property.title}
                />

              </section>

            </div>


            {/* =================================================
                RIGHT CONTACT PANEL
            ================================================= */}

            <aside className="property-contact-card">

              <div className="property-contact-top">

                <span className="property-badge">
                  Available
                </span>

                <button
                  type="button"
                  className="icon-button"
                  aria-label="Save property"
                >
                  <Heart size={18} />
                </button>

              </div>


              <div className="eyebrow">
                INTERESTED IN THIS PROPERTY?
              </div>

              <h2>
                Let's arrange a conversation.
              </h2>

              <p>
                Speak with the Divyajyoti property team
                about this property, pricing, availability
                or a site visit.
              </p>


              <Link
                href={`/contact?service=property&property=${property.slug}`}
                className="btn btn-dark"
              >
                <Phone size={15} />
                Contact our team
              </Link>


              <Link
                href={`/properties/${property.slug}/site-visit`}
                className="btn btn-light"
              >
                <CalendarDays size={15} />
                Schedule site visit
              </Link>


              {/* =================================================
                  WORKING BROCHURE BUTTON
              ================================================= */}

              {brochureUrl ? (
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light"
                  aria-label={`View ${property.title} brochure`}
                >
                  <Download size={15} />
                  Request brochure
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-light"
                  disabled
                  title="No brochure has been uploaded for this property."
                  style={{
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }}
                >
                  <Download size={15} />
                  Brochure currently unavailable
                </button>
              )}


              <div className="property-contact-divider" />


              <div className="property-contact-info">

                <strong>
                  Need help deciding?
                </strong>

                <p>
                  Our team can help you understand the
                  property and arrange the next step.
                </p>

              </div>


              <div className="property-contact-note">

                <ShieldCheck size={16} />

                <span>
                  Your information is handled privately.
                </span>

              </div>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}
