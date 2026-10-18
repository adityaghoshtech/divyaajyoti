
"use client";

import { useState } from "react";
import { ArrowUpRight, X, ShoppingBag } from "lucide-react";

export default function ComingSoonButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-dark"
        onClick={() => setIsOpen(true)}
      >
        Explore ONLINE SHOPPING <ArrowUpRight size={15} />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10, 15, 30, 0.72)",
            padding: 20,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="coming-soon-title"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 440,
              padding: "44px 30px",
              borderRadius: 20,
              background: "#faf7f0",
              color: "#18233b",
              textAlign: "center",
              boxShadow: "0 20px 70px rgba(0,0,0,0.25)",
            }}
          >
            <button
              type="button"
              aria-label="Close popup"
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                border: 0,
                background: "transparent",
                cursor: "pointer",
                color: "#18233b",
              }}
            >
              <X size={22} />
            </button>

            <div style={{ marginBottom: 18 }}>
              <ShoppingBag size={42} strokeWidth={1.4} />
            </div>

            <p
              style={{
                color: "#a68142",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Divyajyoti
            </p>

            <h2
              id="coming-soon-title"
              style={{
                fontSize: 30,
                lineHeight: 1.2,
                margin: "12px 0",
              }}
            >
              Something Wonderful Is Coming
            </h2>

            <p style={{ color: "#626777", lineHeight: 1.7 }}>
              Our online shopping experience is currently being prepared.
              Stay tuned for something special!
            </p>

            <button
              type="button"
              className="btn btn-dark"
              onClick={() => setIsOpen(false)}
              style={{ marginTop: 18 }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
