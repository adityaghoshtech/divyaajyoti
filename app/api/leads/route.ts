
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = body.email
      ? String(body.email).trim()
      : undefined;
    const source = String(body.source ?? "website").trim();
    const interest = String(
      body.interest ?? "General Enquiry"
    ).trim();
    const message = body.message
      ? String(body.message).trim()
      : undefined;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    if (!convexUrl) {
      return NextResponse.json(
        { error: "Lead service is not configured." },
        { status: 500 }
      );
    }

    const client = new ConvexHttpClient(convexUrl);

    const id = await client.mutation(anyApi.leads.create, {
      name,
      phone,
      email,
      source,
      interest,
      message,
    });

    return NextResponse.json({
      ok: true,
      id,
      persisted: true,
    });
  } catch (error) {
    console.error("Lead submission failed:", error);

    return NextResponse.json(
      { error: "Unable to submit the enquiry right now." },
      { status: 500 }
    );
  }
}
