"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  Menu,
  X,
  Crown,
  BookOpen,
} from "lucide-react";

import { useState } from "react";
import { usePathname } from "next/navigation";


/* =========================================================
   MAIN NAVIGATION
========================================================= */

const navigation = [
  {
    label: "Astrology",
    href: "/astrology",
  },

  {
    label: "Property",
    href: "/properties",
  },

  {
    label: "VIP & Business",
    href: "/vip-business",
    vip: true,
  },

  {
    label: "Learning",
    href: "/education",
  },

  {
    label: "My Courses",
    href: "/my-courses",
    courses: true,
  },

  

  {
    label: "Insights",
    href: "/insights",
  },
];


export function SiteHeader() {
  const [open, setOpen] =
    useState(false);

  const pathname =
    usePathname();


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

          <span className="mark">
            D
          </span>


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

                  {item.vip && (
                    <Crown
                      className="nav-link-crown"
                      size={13}
                      strokeWidth={1.8}
                    />
                  )}


                  {/* =====================================
                      MY COURSES ICON
                  ===================================== */}

                  {item.courses && (
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
                    {item.label}
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
            CONSULTATION BUTTON
        ================================================= */}

        <div className="navcta">

          <Link
            className="btn btn-dark btn-sm header-consultation-btn"
            href=" /contact"
          >

            <span>
              Book a consultation
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
              ? "Close navigation menu"
              : "Open navigation menu"
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

                      {item.vip && (
                        <Crown
                          size={14}
                          strokeWidth={1.8}
                        />
                      )}


                      {/* MY COURSES */}

                      {item.courses && (
                        <BookOpen
                          size={15}
                          strokeWidth={1.8}
                        />
                      )}


                      {item.label}

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
                ABOUT
            =============================================== */}

            <Link
              href="/about"
              onClick={() =>
                setOpen(false)
              }
              className={`mobile-nav-link ${
                isActive("/about")
                  ? "mobile-nav-link-active"
                  : ""
              }`}
            >

              <span className="mobile-nav-label">
                About
              </span>

              <ArrowUpRight
                size={16}
                className="mobile-nav-arrow"
              />

            </Link>


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
                Book a consultation
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