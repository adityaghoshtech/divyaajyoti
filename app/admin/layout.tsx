import type { ReactNode } from "react";
import Providers from "../providers";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
