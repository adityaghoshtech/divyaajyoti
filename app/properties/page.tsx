import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { getProperties } from "@/lib/property-source";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

type Props = {
  searchParams: Promise<{
    type?: string;
  }>;
};

export default async function Properties({
  searchParams,
}: Props) {
  const params = await searchParams;

  const selectedType = params.type || "All";

  const allProperties = await getProperties();

  const properties =
    selectedType === "All"
      ? allProperties
      : allProperties.filter((p: any) => {
          const propertyType = String(p.type || "").toLowerCase();
          const filterType = selectedType.toLowerCase();

          return (
            propertyType === filterType ||
            propertyType.includes(filterType)
          );
        });

  return (
    <main>

      {/* =====================================================
          PAGE HERO
      ===================================================== */}

      <section className="pagehero">
        <div className="container">

          <div className="eyebrow">
            Property collection
          </div>

          <h1>
            Find a place with a little more thought behind it.
          </h1>

          <p>
            Explore a curated collection of residences,
            estates and investment opportunities across
            Kolkata and West Bengal.
          </p>

        </div>
      </section>


      {/* =====================================================
          PROPERTY COLLECTION
      ===================================================== */}

      <section className="section">

        <div className="container">

          {/* =================================================
              CATEGORY FILTERS
          ================================================= */}

          <div className="toolbar">

            <div className="filters">

              <Link
                href="/properties"
                className={`pill ${
                  selectedType === "All"
                    ? "active"
                    : ""
                }`}
              >
                All properties
              </Link>

              <Link
                href="/properties?type=Apartment"
                className={`pill ${
                  selectedType === "Apartment"
                    ? "active"
                    : ""
                }`}
              >
                Apartments
              </Link>

              <Link
                href="/properties?type=Villa"
                className={`pill ${
                  selectedType === "Villa"
                    ? "active"
                    : ""
                }`}
              >
                Villas
              </Link>

              <Link
                href="/properties?type=Bungalow"
                className={`pill ${
                  selectedType === "Bungalow"
                    ? "active"
                    : ""
                }`}
              >
                Bungalows
              </Link>

            </div>

            <button
              type="button"
              className="btn btn-light btn-sm"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <form
            className="searchbar"
            style={{
              marginTop: 0,
              marginBottom: 28,
            }}
          >

            <div className="searchfield">

              <label>
                Search
              </label>

              <input
                name="search"
                placeholder="Location, property or keyword"
              />

            </div>


            <div className="searchfield">

              <label>
                Property type
              </label>

              <select
                name="type"
                defaultValue={selectedType}
              >
                <option value="All">
                  Any type
                </option>

                <option value="Apartment">
                  Apartment
                </option>

                <option value="Villa">
                  Villa
                </option>

                <option value="Bungalow">
                  Bungalow
                </option>
              </select>

            </div>


            <div className="searchfield">

              <label>
                Budget
              </label>

              <select name="budget">

                <option value="">
                  Any budget
                </option>

                <option value="under1">
                  Under ₹1 Cr
                </option>

                <option value="1to3">
                  ₹1–3 Cr
                </option>

                <option value="3plus">
                  ₹3 Cr+
                </option>

              </select>

            </div>


            <button
              type="submit"
              className="btn btn-dark"
            >
              <Search size={15} />
              Search
            </button>

          </form>


          {/* =================================================
              RESULT INFORMATION
          ================================================= */}

          <div className="property-results-header">

            <div>

              <div className="eyebrow">
                {selectedType === "All"
                  ? "All properties"
                  : selectedType}
              </div>

              <p>
                {properties.length}{" "}
                {properties.length === 1
                  ? "property"
                  : "properties"}{" "}
                available
              </p>

            </div>

            {selectedType !== "All" && (
              <Link
                href="/properties"
                className="clear-filter"
              >
                Clear filter
              </Link>
            )}

          </div>


          {/* =================================================
              PROPERTY CARDS
          ================================================= */}

          {properties.length > 0 ? (

            <div className="grid3">

              {properties.map((p: any) => (
                <PropertyCard
                  key={p.slug}
                  p={p}
                />
              ))}

            </div>

          ) : (

            <div className="property-empty">

              <div className="eyebrow">
                No properties found
              </div>

              <h2>
                No {selectedType.toLowerCase()}s
                are currently available.
              </h2>

              <p>
                Try another property category or
                return to the complete collection.
              </p>

              <Link
                href="/properties"
                className="btn btn-dark"
                style={{ marginTop: 20 }}
              >
                View all properties
              </Link>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}