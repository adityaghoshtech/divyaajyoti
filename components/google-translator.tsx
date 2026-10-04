
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;

    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
            layout?: number;
          },
          elementId: string
        ) => unknown;

        InlineLayout?: {
          SIMPLE: number;
        };
      };
    };
  }
}

export default function GoogleTranslator() {

  useEffect(() => {

    const elementId = "google_translate_element";

    const initializeGoogleTranslate = () => {

      const container =
        document.getElementById(elementId);

      const TranslateElement =
        window.google?.translate?.TranslateElement;

      if (!container || !TranslateElement) {
        return;
      }

      if (container.dataset.initialized === "true") {
        return;
      }

      container.innerHTML = "";

      new TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,bn,hi",
          autoDisplay: false,
          layout:
            window.google?.translate?.InlineLayout?.SIMPLE,
        },
        elementId
      );

      container.dataset.initialized = "true";
    };

    window.googleTranslateElementInit =
      initializeGoogleTranslate;

    const existingScript =
      document.getElementById("google-translate-script") as
        | HTMLScriptElement
        | null;

    if (window.google?.translate?.TranslateElement) {

      initializeGoogleTranslate();

    } else if (existingScript) {

      existingScript.addEventListener(
        "load",
        initializeGoogleTranslate,
        { once: true }
      );

    } else {

      const script = document.createElement("script");

      script.id = "google-translate-script";

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      script.onload = initializeGoogleTranslate;

      script.onerror = () => {
        console.error(
          "Google Translate failed to load. Check your internet connection or browser blocking settings."
        );
      };

      document.body.appendChild(script);

    }

    return () => {
      window.googleTranslateElementInit = undefined;
    };

  }, []);

  return (
    <div
      id="google_translate_element"
      className="google-translator"
    />
  );
}
