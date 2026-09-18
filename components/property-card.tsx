import Link from "next/link";
import {
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  ArrowUpRight,
  Heart,
} from "lucide-react";

export function PropertyCard({ p }: { p: any }) {
  return (
    <article className="property">

      {/* PROPERTY IMAGE */}
      <div
        className="property-img"
        style={{
          backgroundImage: `url(${p.image})`,
        }}
      >
        <span className="tag">
          {p.tag || p.status || "Available"}
        </span>

        <button
          className="heart"
          aria-label="Save property"
          type="button"
        >
          <Heart size={16} />
        </button>
      </div>

      {/* PROPERTY INFORMATION */}
      <div className="property-body">

        <div className="location">
          <MapPin size={13} />
          {p.location}
        </div>

        <h3>{p.title}</h3>

        <div className="price">
          {typeof p.price === "number"
            ? `₹${p.price.toLocaleString("en-IN")}`
            : p.price}
        </div>

        <div className="facts">

          <span>
            <BedDouble size={13} />
            {p.beds} beds
          </span>

          <span>
            <Bath size={13} />
            {p.baths} baths
          </span>

          <span>
            <Maximize2 size={13} />
            {p.area} sq.ft.
          </span>

        </div>

        <Link
          href={`/properties/${p.slug}`}
          className="btn btn-light btn-sm"
          style={{
            marginTop: 16,
            width: "100%",
          }}
        >
          View property
          <ArrowUpRight size={14} />
        </Link>

      </div>
    </article>
  );
}