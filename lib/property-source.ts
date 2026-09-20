import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
import { properties as fallbackProperties } from '@/lib/data';

export type SiteProperty = (typeof fallbackProperties)[number];

type ConvexProperty = {
  _id: string;
  title: string;
  slug: string;
  location: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  area: number;
  image?: string;
  status: string;
};

function formatPrice(value: number) {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)} Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)} Lakh`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function mapProperty(property: ConvexProperty): SiteProperty {
  return {
    slug: property.slug,
    title: property.title,
    location: property.location,
    price: formatPrice(property.price),
    type: property.type,
    beds: property.beds,
    baths: property.baths,
    area: `${property.area.toLocaleString('en-IN')} sq ft`,
    image: property.image || fallbackProperties[0].image,
    tag: property.status === 'active' ? 'Available' : property.status,
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
    console.error('Convex property query failed. Using local fallback data.', error);
    return fallbackProperties;
  }
}

export async function getPropertyBySlug(slug: string): Promise<SiteProperty | undefined> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return fallbackProperties.find((property) => property.slug === slug);

  try {
    const client = new ConvexHttpClient(convexUrl);
    const record = await client.query(anyApi.properties.bySlug, { slug });
    return record ? mapProperty(record as ConvexProperty) : undefined;
  } catch (error) {
    console.error('Convex property detail query failed. Using local fallback data.', error);
    return fallbackProperties.find((property) => property.slug === slug);
  }
}
