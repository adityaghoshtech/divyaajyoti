import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Providers from "../providers";

import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
} from "@/lib/admin-session";

export const runtime = "nodejs";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();

  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(token)) {
    redirect("/admin-login");
  }

  return <Providers>{children}</Providers>;
}
