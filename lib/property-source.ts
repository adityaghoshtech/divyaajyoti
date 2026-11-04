
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
import { properties as fallbackProperties } from "@/lib/data";

export type SiteProperty = (typeof fallbackProperties)[number] & {
  videoUrl?: string;
  walkthroughVideoUrl?: string;
  walkthroughUrl?: string;
  images?: string[];
  videos?: { title: string; url: string }[];
  pricingOptions?: { label: string; price: number }[];
  brochureUrl?: string;
};

type ConvexProperty = {
  _id: string;
  title: string;
  slug: string;
  location: string;
  price: number;
  pricingOptions?: { label: string; price: number }[];
  type: string;
  beds: number;
  baths: number;
  area: number;
  image?: string;
  images?: string[];
  status: string;
  videoUrl?: string;
  walkthroughVideoUrl?: string;
  walkthroughUrl?: string;
  videos?: { title: string; url: string }[];
  brochureUrl?: string;
};

function normalizeGoogleDriveImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  const trimmed = url.trim();


  if (!trimmed.includes("drive.google.com")) {
    return trimmed;
  }

  
  const match =
    trimmed.match(/\/file\/d\/([^/]+)/) ||
    trimmed.match(/[?&]id=([^&]+)/);

  if (!match?.[1]) return trimmed;

  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w2000`;
}

/**
 * Normalize common Google Drive brochure sharing links.
 * The Drive file must be shared as "Anyone with the link - Viewer".
 */
function normalizeBrochureUrl(url?: string): string | undefined {
  if (!url || !url.trim()) return undefined;

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname !== "drive.google.com") {
      return trimmed;
    }

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
  } catch {
    return trimmed;
  }
}

function formatPrice(value: number) {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)} Cr`;
  }

  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)} Lakh`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function mapProperty(property: ConvexProperty): SiteProperty {
  const videoUrl =
    property.videoUrl ||
    property.walkthroughVideoUrl ||
    property.walkthroughUrl ||
    undefined;

  const images = [
    property.image,
    ...(property.images || []),
  ]
    .filter((url): url is string => Boolean(url))
    .map((url) => normalizeGoogleDriveImageUrl(url)!)
    .filter((url, index, array) => array.indexOf(url) === index);

  const normalizedPricing = property.pricingOptions?.filter(
    (option) =>
      option &&
      typeof option.label === "string" &&
      typeof option.price === "number"
  );

  return {
    slug: property.slug,
    title: property.title,
    location: property.location,
    price: formatPrice(property.price),
    type: property.type,
    beds: property.beds,
    baths: property.baths,
    area: `${property.area.toLocaleString("en-IN")} sq ft`,
    image:
      normalizeGoogleDriveImageUrl(property.image) ||
      images[0] ||
      fallbackProperties[0].image,
    images,
    tag: property.status === "active" ? "Available" : property.status,
 
    videoUrl,
    videos: property.videos || [],
    pricingOptions: normalizedPricing || [],
    brochureUrl: normalizeBrochureUrl(property.brochureUrl),
  };
}

export async function getProperties(): Promise<SiteProperty[]> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) return fallbackProperties;

  try {
    const client = new ConvexHttpClient(convexUrl);
    const records = await client.query(anyApi.properties.list, {});

    if (!records?.length) return fallbackProperties;

    return (records as ConvexProperty[]).map(mapProperty);
  } catch (error) {
    console.error(
      "Convex property query failed. Using local fallback data.",
      error
    );

    return fallbackProperties;
  }
}

export async function getPropertyBySlug(
  slug: string
): Promise<SiteProperty | undefined> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    return fallbackProperties.find(
      (property) => property.slug === slug
    );
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const record = await client.query(
      anyApi.properties.bySlug,
      { slug }
    );

    return record
      ? mapProperty(record as ConvexProperty)
      : undefined;
  } catch (error) {
    console.error(
      "Convex property detail query failed. Using local fallback data.",
      error
    );

    return fallbackProperties.find(
      (property) => property.slug === slug
    );
  }
}
