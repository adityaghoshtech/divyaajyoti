
"use client";

import Link from "next/link";

import Image from "next/image";

import GoogleTranslator from "@/components/google-translator";

import {
  ArrowUpRight,
  Menu,
  X,
  Crown,
  BookOpen,
  Languages,
} from "lucide-react";

import { useState } from "react";

import { usePathname } from "next/navigation";

import {
  useLanguage,
  type Language,
} from "@/components/language-provider";


/* =========================================================
   MAIN NAVIGATION
========================================================= */

const navigation = [
  {
    label: "Astrology",
    key: "astrology",
    href: "/astrology",
  },

  {
    label: "Property",
    key: "property",
    href: "/properties",
  },

  {
    label: "Career Counselling",
    key: "careerCounselling",
    href: "/career-counselling",
  },

  {
    label: "Learning",
    key: "learning",
    href: "/education",
  },

  {
    label: "My Courses",
    key: "myCourses",
    href: "/my-courses",
    courses: true,
  },

  {
    label: "About",
    key: "about",
    href: "/about",
  },

  {
    label: "Insights",
    key: "insights",
    href: "/insights",
  },

] as const;


/* =========================================================
   LANGUAGE SELECTOR
========================================================= */

function LanguageSelector() {

  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="dj-language-selector">

      <Languages size={16} />

      <select
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value as Language)
        }
        aria-label={t("selectLanguage")}
        className="dj-language-select"
      >

        <option value="en">English</option>

        <option value="bn">বাংলা</option>

        <option value="hi">हिन्दी</option>

      </select>

    </div>
  );

}


/* =========================================================
   SITE HEADER
========================================================= */

export function SiteHeader() {

  const [open, setOpen] =
    useState(false);

  const pathname =
    usePathname();

  const { t } = useLanguage();


  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  const isActive = (
    href: string,
  ) => {

    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );

  };


  return (
    <header className="header">


      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ===================================================== */}


      <div className="container nav">


        {/* =================================================
            BRAND
        ================================================= */}


        <Link
          href="/"
          className="brand"
          onClick={() =>
            setOpen(false)
          }
        >

          {/* UPDATED LOGO SECTION */}

          <div className="brand-mark">

            <Image
              src="/logo.png"
              alt="Divyajyoti Logo"
              width={100}
              height={76}
              priority
              className="brand-logo"
              style={{
                width: "100px",
                height: "76px",
                objectFit: "contain",
                display: "block",
              }}
            />

          </div>


          <span className="brand-copy">

            <strong>
              Divyajyoti
            </strong>

            <small>
              Astrology • Property • Learning
            </small>

          </span>

        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}


        <nav
          className="navlinks"
          aria-label="Main navigation"
        >

          {navigation.map(
            (item) => {

              const active =
                isActive(
                  item.href,
                );


              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={`nav-link ${
                    active
                      ? "nav-link-active"
                      : ""
                  }`}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                >


                  {/* =====================================
                      VIP CROWN
                  ===================================== */}


                  {"vip" in item && item.vip === true && (

                    <Crown
                      className="nav-link-crown"
                      size={13}
                      strokeWidth={1.8}
                    />

                  )}


                  {/* =====================================
                      MY COURSES ICON
                  ===================================== */}


                  {"courses" in item && item.courses && (

                    <BookOpen
                      className="nav-link-course-icon"
                      size={14}
                      strokeWidth={1.8}
                    />

                  )}


                  {/* =====================================
                      TEXT
                  ===================================== */}


                  <span className="nav-link-text">

                    {item.key === "careerCounselling"
                      ? item.label
                      : t(item.key)}

                  </span>


                  {/* =====================================
                      ACTIVE / HOVER DOT
                  ===================================== */}


                  <span
                    className="nav-link-dot"
                    aria-hidden="true"
                  />


                </Link>
              );

            },
          )}


        </nav>


        {/* =================================================
            LANGUAGE SELECTOR + CONSULTATION BUTTON
        ================================================= */}


        <div className="navcta">

          <GoogleTranslator />


          <Link
            className="btn btn-dark btn-sm header-consultation-btn"
            href="/contact"
          >

            <span>
              {t("bookConsultation")}
            </span>

            <ArrowUpRight
              size={14}
              strokeWidth={2}
            />

          </Link>

        </div>


        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}


        <button
          className="menu"
          type="button"
          onClick={() =>
            setOpen(!open)
          }
          aria-label={
            open
              ? t("closeMenu")
              : t("openMenu")
          }
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >

          {open ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}

        </button>


      </div>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}


      {open && (


        <div
          id="mobile-navigation"
          className="mobile-menu"
        >

          <div className="container mobile-menu-inner">


            {/* ===============================================
                MOBILE LANGUAGE SELECTOR
            =============================================== */}


            <div className="mobile-language">

              <span className="mobile-language-label">
                {t("selectLanguage")}
              </span>

              <GoogleTranslator />

            </div>


            {/* ===============================================
                MAIN MOBILE NAVIGATION
            =============================================== */}


            {navigation.map(
              (item) => {

                const active =
                  isActive(
                    item.href,
                  );


                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    onClick={() =>
                      setOpen(false)
                    }
                    className={`mobile-nav-link ${
                      active
                        ? "mobile-nav-link-active"
                        : ""
                    }`}
                    aria-current={
                      active
                        ? "page"
                        : undefined
                    }
                  >

                    <span className="mobile-nav-label">


                      {/* VIP */}


                      {"vip" in item && item.vip === true && (

                        <Crown
                          size={14}
                          strokeWidth={1.8}
                        />

                      )}


                      {/* MY COURSES */}


                      {"courses" in item && item.courses && (

                        <BookOpen
                          size={15}
                          strokeWidth={1.8}
                        />

                      )}


                      {item.key === "careerCounselling"
                        ? item.label
                        : t(item.key)}


                    </span>


                    <ArrowUpRight
                      size={16}
                      className="mobile-nav-arrow"
                    />


                  </Link>
                );

              },
            )}





            {/* ===============================================
                CONSULTATION CTA
            =============================================== */}


            <Link
              className="btn btn-dark mobile-consultation-btn"
              href="/contact"
              onClick={() =>
                setOpen(false)
              }
            >


              <span>
                {t("bookConsultation")}
              </span>


              <ArrowUpRight
                size={16}
              />


            </Link>


          </div>


        </div>


      )}



    </header>
  );



}
