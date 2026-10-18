
"use client";

import { QRCodeSVG } from "qrcode.react";
import { MessageCircle, Smartphone } from "lucide-react";

const WHATSAPP_NUMBER = "917980555167";

const WHATSAPP_MESSAGE =
  "Hello! I visited the Divyajyoti website and I'm interested in learning more about your services. Could you please share more details.";

const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);

// Standard WhatsApp link: works across more QR scanners and devices.
const whatsappWebLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

// Direct app link: may open the WhatsApp app directly on supported phones.
const whatsappAppLink = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

export default function WhatsAppContact() {
  return (
    <section className="whatsapp-contact" id="whatsapp-contact">
      <div className="whatsapp-contact-inner">
        <div className="whatsapp-contact-copy">
          <span className="whatsapp-contact-eyebrow">
            LET&apos;S CONNECT
          </span>

          <h2>
            Have a question?
            <br />
            <span>Let&apos;s talk on WhatsApp.</span>
          </h2>

          <p>
            Connect with Divyajyoti directly for information about our
            services, courses, property opportunities, and personal guidance.
            Scan the QR code with your phone to start a conversation.
          </p>

          <a
            className="whatsapp-contact-button"
            href={whatsappWebLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={19} />
            Chat with us on WhatsApp
          </a>

          <span className="whatsapp-contact-number">
            WhatsApp: +91 79805 55167
          </span>
        </div>

        <div className="whatsapp-qr-card">
          <div className="whatsapp-qr-heading">
            <Smartphone size={25} />

            <div>
              <strong>Scan to connect</strong>
              <span>Open your phone camera or QR scanner</span>
            </div>
          </div>

          <a
            href={whatsappAppLink}
            aria-label="Open WhatsApp chat with Divyajyoti"
          >
            <div className="whatsapp-qr-code">
              <QRCodeSVG
                value={whatsappAppLink}
                size={210}
                level="H"
                includeMargin
                title="Scan to open WhatsApp and contact Divyajyoti"
              />
            </div>
          </a>

          <p>
            Scan the code to open WhatsApp and start your conversation.
            You can review the message before sending it.
          </p>

          <p>
            If your QR scanner does not support direct app links, use the
            WhatsApp button on this page instead.
          </p>
        </div>
      </div>
    </section>
  );
}
