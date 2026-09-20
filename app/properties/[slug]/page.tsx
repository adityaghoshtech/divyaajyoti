import Link from "next/link";
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

  const price =
    typeof property.price === "number"
      ? `₹${Number(property.price).toLocaleString("en-IN")}`
      : property.price;

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
              {price}
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
                    backgroundImage: `url(${property.image})`,
                  }}
                >

                  <div className="gallery-overlay">

                    <span>
                      Property Gallery
                    </span>

                    <button
                      type="button"
                      className="gallery-view-button"
                    >
                      View photos & videos
                      <ArrowUpRight size={14} />
                    </button>

                  </div>

                </div>

                <div className="property-gallery-small">

                  <div
                    style={{
                      backgroundImage: `url(${property.image})`,
                    }}
                  />

                  <div
                    style={{
                      backgroundImage: `url(${property.image})`,
                    }}
                  />

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
                  Explore the available layout.
                </h2>

                <div className="floor-plan-card">

                  <div>

                    <strong>
                      {property.beds} Bedroom
                      Configuration
                    </strong>

                    <span>
                      {property.area} sq.ft.
                    </span>

                    <strong className="floor-price">
                      {price}
                    </strong>

                  </div>

                  <button
                    type="button"
                    className="btn btn-light"
                  >
                    View floor plan
                    <ArrowUpRight size={14} />
                  </button>

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
                  href={`/consultation?service=vastu&property=${property.slug}`}
                  className="btn btn-dark"
                  style={{ marginTop: 20 }}
                >
                  Request Vastu consultation
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

                <div className="property-video-box">

                  <div>

                    <div className="video-icon">
                      ▶
                    </div>

                    <strong>
                      Property walkthrough
                    </strong>

                    <p>
                      Property photos and video
                      walkthroughs can be added here.
                    </p>

                  </div>

                </div>

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
                href={`/consultation?service=property&property=${property.slug}`}
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


              <button
                type="button"
                className="btn btn-light"
              >
                <Download size={15} />
                Request brochure
              </button>


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