"use client";

import { useState } from "react";
import { LeadForm } from "@/components/lead-form";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Home,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Video,
  X,
} from "lucide-react";

const services = [
  {
    id: "property",
    number: "01",
    icon: Home,
    title: "Property",
    subtitle: "Property guidance",
    description:
      "Shortlist review, property questions and guided discovery for your next move.",
    color: "navy",
  },
  {
    id: "astrology",
    number: "02",
    icon: Sparkles,
    title: "Astrology",
    subtitle: "Personal guidance",
    description:
      "Birth chart, timing, relationships and personal reflection through a focused session.",
    color: "gold",
  },
  {
    id: "learning",
    number: "03",
    icon: MessageCircle,
    title: "Learning",
    subtitle: "Education guidance",
    description:
      "Course selection, learning direction and practical guidance for your next step.",
    color: "cream",
  },
];

const expectations = [
  {
    icon: CalendarDays,
    title: "Focused session",
    text: "A structured conversation built around what you actually need.",
  },
  {
    icon: Video,
    title: "Online or phone",
    text: "Choose the format that works best for your consultation.",
  },
  {
    icon: ShieldCheck,
    title: "Private conversation",
    text: "Your shared information is handled with care and discretion.",
  },
];

const faqs = [
  {
    question: "How long is a consultation?",
    answer:
      "Most consultations are planned as focused sessions. The team can help determine the appropriate duration based on your requirement.",
  },
  {
    question: "Can I choose what I want to discuss?",
    answer:
      "Yes. You can share a little context through the enquiry form so the team can understand your requirement before the session.",
  },
  {
    question: "Are consultations available online?",
    answer:
      "Yes. Depending on the service, consultations can be arranged through an online video meeting or phone.",
  },
];

export default function Consultation() {
  const [selectedService, setSelectedService] = useState("astrology");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const selected = services.find((item) => item.id === selectedService);

  return (
    <main className="consultation-page">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="consultation-hero">
        <div className="container consultation-hero-grid">
          <div className="consultation-hero-copy">
            <div className="consultation-eyebrow">
              <span />
              PRIVATE CONSULTATION
            </div>

            <h1>
              A thoughtful conversation
              <em> for your next step.</em>
            </h1>

            <p>
              Tell us what you are working through. Whether it is property,
              astrology, Vastu or learning, we will help shape the right
              conversation around it.
            </p>

            <div className="consultation-hero-actions">
              <a href="#book-consultation" className="consultation-primary-btn">
                Start your enquiry
                <ArrowUpRight size={17} />
              </a>

              <a href="#how-it-works" className="consultation-secondary-btn">
                How it works
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="consultation-trust-row">
              <div>
                <ShieldCheck size={17} />
                <span>Private & confidential</span>
              </div>

              <div>
                <Clock3 size={17} />
                <span>Focused sessions</span>
              </div>

              <div>
                <Video size={17} />
                <span>Online available</span>
              </div>
            </div>
          </div>

          <div className="consultation-hero-visual">
            <div className="consultation-orbit orbit-one" />
            <div className="consultation-orbit orbit-two" />

            <div className="consultation-visual-card">
              <div className="consultation-visual-top">
                <span>DIVYAJYOTI</span>
                <span>PRIVATE DESK</span>
              </div>

              <div className="consultation-monogram">D</div>

              <div className="consultation-visual-bottom">
                <span>ASTROLOGY</span>
                <span>VASTU</span>
                <span>PROPERTY</span>
              </div>
            </div>

            <div className="consultation-floating-card floating-top">
              <span className="floating-icon">
                <Sparkles size={16} />
              </span>

              <div>
                <strong>Personal guidance</strong>
                <small>Built around your question</small>
              </div>
            </div>

            <div className="consultation-floating-card floating-bottom">
              <div className="floating-check">
                <Check size={15} />
              </div>

              <div>
                <strong>One clear conversation</strong>
                <small>Less noise. More direction.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICE SELECTOR
      ========================================================= */}

      <section className="consultation-services">
        <div className="container">
          <div className="consultation-section-heading">
            <div>
              <div className="consultation-eyebrow dark">
                01 / CHOOSE YOUR CONVERSATION
              </div>

              <h2>
                Start with what
                <br />
                matters to you.
              </h2>
            </div>

            <p>
              Select the area closest to what you need. You can explain the
              details in the enquiry form.
            </p>
          </div>

          <div className="consultation-service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              const active = selectedService === service.id;

              return (
                <button
                  type="button"
                  key={service.id}
                  className={`consultation-service-card ${
                    active ? "active" : ""
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="service-card-top">
                    <span className="service-number">
                      {service.number}
                    </span>

                    <span className="service-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  <div
                    className={`consultation-service-icon ${service.color}`}
                  >
                    <Icon size={21} />
                  </div>

                  <div className="service-card-content">
                    <span>{service.subtitle}</span>

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>
                  </div>

                  <div className="service-card-select">
                    <span>
                      {active ? "Selected" : "Select service"}
                    </span>

                    {active && <Check size={15} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="selected-service-bar">
            <div>
              <span>Your selected conversation</span>
              <strong>{selected?.title}</strong>
            </div>

            <a href="#book-consultation">
              Continue
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOOKING / FORM
      ========================================================= */}

      <section
        id="book-consultation"
        className="consultation-booking-section"
      >
        <div className="container">
          <div className="consultation-booking-intro">
            <div>
              <div className="consultation-eyebrow dark">
                02 / TELL US A LITTLE MORE
              </div>

              <h2>
                Let's prepare the
                <br />
                right conversation.
              </h2>
            </div>

            <p>
              A little context helps our team understand what you are looking
              for and connect you with the appropriate session.
            </p>
          </div>

          <div className="consultation-booking-grid">
            <div className="consultation-process">
              <div className="process-label">YOUR JOURNEY</div>

              <div className="process-line" />

              <div className="process-item active">
                <span>01</span>
                <div>
                  <strong>Choose a service</strong>
                  <p>{selected?.title}</p>
                </div>
              </div>

              <div className="process-item">
                <span>02</span>
                <div>
                  <strong>Share your requirement</strong>
                  <p>Tell us what you would like to discuss.</p>
                </div>
              </div>

              <div className="process-item">
                <span>03</span>
                <div>
                  <strong>Our team connects</strong>
                  <p>We review your request and get in touch.</p>
                </div>
              </div>

              <div className="process-item">
                <span>04</span>
                <div>
                  <strong>Have your conversation</strong>
                  <p>A focused session built around your requirement.</p>
                </div>
              </div>

              <div className="consultation-note">
                <ShieldCheck size={18} />

                <div>
                  <strong>Your information stays private.</strong>
                  <p>
                    We only use the information you provide to understand and
                    respond to your enquiry.
                  </p>
                </div>
              </div>
            </div>

            <div className="consultation-form-wrapper">
              <div className="consultation-form-header">
                <div>
                  <span>PRIVATE ENQUIRY</span>
                  <h3>Request a consultation</h3>
                </div>

                <div className="form-selected-pill">
                  <span />
                  {selected?.title}
                </div>
              </div>

              <LeadForm title="Request a consultation" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHAT TO EXPECT
      ========================================================= */}

      <section id="how-it-works" className="consultation-expect">
        <div className="container">
          <div className="consultation-expect-heading">
            <div>
              <div className="consultation-eyebrow">
                03 / WHAT TO EXPECT
              </div>

              <h2>
                Simple by design.
                <br />
                Personal by nature.
              </h2>
            </div>

            <p>
              The experience should feel less like filling out a form and more
              like beginning a useful conversation.
            </p>
          </div>

          <div className="expect-grid">
            {expectations.map((item, index) => {
              const Icon = item.icon;

              return (
                <article className="expect-card" key={item.title}>
                  <div className="expect-number">
                    0{index + 1}
                  </div>

                  <div className="expect-icon">
                    <Icon size={20} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                  <span className="expect-line" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================= */}

      <section className="consultation-faq">
        <div className="container consultation-faq-grid">
          <div>
            <div className="consultation-eyebrow dark">
              04 / BEFORE YOU BOOK
            </div>

            <h2>
              A few things
              <br />
              worth knowing.
            </h2>

            <p>
              If you still have questions, share them with us through the
              enquiry form and our team can help.
            </p>

            <a href="#book-consultation" className="consultation-dark-btn">
              Ask a question
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div className={`faq-item ${open ? "open" : ""}`} key={faq.question}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(open ? null : index)
                    }
                  >
                    <span>{faq.question}</span>

                    <ChevronDown
                      size={18}
                      className="faq-chevron"
                    />
                  </button>

                  {open && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="consultation-final-cta">
        <div className="container">
          <div className="final-cta-inner">
            <div>
              <div className="consultation-eyebrow">
                READY WHEN YOU ARE
              </div>

              <h2>
                Some decisions deserve
                <br />
                a proper conversation.
              </h2>
            </div>

            <a href="#book-consultation" className="final-cta-button">
              Book a consultation
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="final-cta-footer">
            <span>DIVYAJYOTI</span>
            <span>ASTROLOGY • PROPERTY • LEARNING</span>
          </div>
        </div>
      </section>
    </main>
  );
}