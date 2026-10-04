
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            <span className="footer-brand-mark">
              <Image
                src="/logo.png"
                alt="Divyajyoti Logo"
                width={52}
                height={52}
                className="footer-brand-logo"
              />
            </span>

            <span>
              <strong style={{ color: "white" }}>
                Divyajyoti
              </strong>

              <small style={{ color: "#8190a1" }}>
                Astrology • Property • Learning
              </small>
            </span>
          </div>

          <p
            style={{
              maxWidth: 310,
              lineHeight: 1.75,
              fontSize: 13,
              color: "#93a0b0",
              marginTop: 20,
            }}
          >
            {t("footerDescription")}
          </p>
        </div>

        <div>
          <h4>{t("explore")}</h4>
          <Link href="/astrology">{t("astrology")}</Link>
          <Link href="/properties">{t("property")}</Link>
          <Link href="/vip-business">{t("vipBusiness")}</Link>
          <Link href="/education">{t("learning")}</Link>
        </div>

        <div>
          <h4>{t("discover")}</h4>
          <Link href="/events">{t("events")}</Link>
          <Link href="/insights">{t("insights")}</Link>
          <Link href="/about">{t("aboutDivyajyoti")}</Link>
          <Link href="/list-property">{t("listProperty")}</Link>
        </div>

        <div>
          <h4>{t("connect")}</h4>
          <Link href="/consultation">
            {t("bookConsultation")}
          </Link>
          <Link href="/contact">{t("talkToTeam")}</Link>

          <span
            style={{
              display: "block",
              fontSize: 12,
              color: "#8794a5",
              marginTop: 15,
            }}
          >
            {t("location")}
          </span>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © 2026 Divyajyoti. {t("copyright")}
        </span>

        <span>
          {t("privacy")} • {t("terms")} •{" "}
          {t("responsibleGuidance")}
        </span>
      </div>
 
    </footer>
  );
}
