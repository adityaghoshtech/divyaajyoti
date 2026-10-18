"use client";
import WhatsAppContact from "@/components/whatsapp-contact";

import Link from "next/link";

import {

  ArrowUpRight,

  ShieldCheck,

  Sparkles,

  Users,

  Compass,

  HeartHandshake,

  Building2,

  BookOpen,

  Star,

  GraduationCap,

  BriefcaseBusiness,

  MoveUpRight,

  CheckCircle2,

} from "lucide-react";

const values = [

  {

    number: "01",

    icon: ShieldCheck,

    title: "Trust First",

    description:

      "We believe meaningful relationships begin with trust. We aim to make information, expectations and important details clear before every decision.",

  },

  {

    number: "02",

    icon: Sparkles,

    title: "Human Judgement",

    description:

      "Technology helps us organise information, but understanding people requires empathy, experience and thoughtful human guidance.",

  },

  {

    number: "03",

    icon: HeartHandshake,

    title: "Long-term Relationships",

    description:

      "We look beyond individual transactions and focus on building relationships that continue to create value over time.",

  },

];

const services = [

  {

    number: "01",

    icon: Sparkles,

    title: "Astrology",

    description:

      "Explore traditional astrological knowledge and seek personalised guidance for life's important questions.",

    href: "/astrology",

  },

  {

    number: "02",

    icon: Building2,

    title: "Property",

    description:

      "Discover property opportunities and connect with a more considered property experience.",

    href: "/properties",

  },

  {

    number: "03",

    icon: BriefcaseBusiness,

    title: "VIP & Business",

    description:

      "Explore dedicated private services and opportunities designed around individual requirements.",

    href: "/vip-business",

  },

  {

    number: "04",

    icon: GraduationCap,

    title: "Learning",

    description:

      "Access educational programmes and courses designed to encourage knowledge and personal growth.",

    href: "/education",

  },

  {

    number: "05",

    icon: BookOpen,

    title: "Insights",

    description:

      "Discover useful ideas, perspectives and information across different areas of interest.",

    href: "/insights",

  },

  {

    number: "06",

    icon: Users,

    title: "Events",

    description:

      "Connect through meaningful experiences, activities and opportunities to learn together.",

    href: "/events",

  },

];

export default function AboutPage() {

  return (

    <main className="about-page">

      {/* HERO SECTION */}

      <section className="about-hero">

        <div className="about-container about-hero-grid">

          <div className="about-hero-copy">

            <div className="about-eyebrow">

              <span />

              GET TO KNOW US

            </div>

            <h1>

              Built around a simple idea:

              <em> clarity is valuable.</em>

            </h1>

            <p className="about-hero-description">

              Divyajyoti brings together property, personal guidance,

              learning and private services in one considered digital

              experience, helping people move from curiosity to

              meaningful action.

            </p>

            <div className="about-hero-actions">

              <Link href="/contact" className="about-primary-btn">

                Get to know us

                <ArrowUpRight size={17} />

              </Link>

              <Link href="/astrology" className="about-secondary-btn">

                Explore our services

              </Link>

            </div>

            <div className="about-hero-note">

              <span className="about-note-icon">

                <CheckCircle2 size={16} />

              </span>

              <span>Guidance for life. Spaces for living. Learning for growth.</span>

            </div>

          </div>

          <div className="about-hero-visual">

            <div className="about-main-image" />

            <div className="about-image-overlay">

              <span>OUR PHILOSOPHY</span>

              <strong>

                Different journeys.

                <br />

                One thoughtful experience.

              </strong>

            </div>

            <div className="about-floating-card">

              <div className="about-floating-icon">

                <Star size={19} />

              </div>

              <div>

                <strong>People at the centre</strong>

                <span>Every interaction matters.</span>

              </div>

            </div>

            <div className="about-image-number">01 / 04</div>

          </div>

        </div>

      </section>

      {/* INTRODUCTION */}

      <section className="about-story-section">

        <div className="about-container">

          <div className="about-story-grid">

            <div className="about-story-label">

              <span className="about-section-kicker">

                OUR STORY

              </span>

              <div className="about-story-decoration">

                <span>D</span>

              </div>

              <p>

                One platform. Multiple possibilities.

              </p>

            </div>

            <div className="about-story-content">

              <h2>

                Bringing different aspects of life together,

                <span> with clarity and purpose.</span>

              </h2>

              <p>

                Every person has different aspirations and different

                questions at different stages of life. Sometimes it is

                about finding the right property. Sometimes it is about

                seeking guidance, learning something new or exploring

                a business opportunity.

              </p>

              <p>

                We created Divyajyoti around the idea that these

                experiences can exist within one connected ecosystem.

                Rather than navigating disconnected experiences,

                people can discover services, information and

                opportunities in one place.

              </p>

              <p>

                Our approach combines digital convenience with

                thoughtful human interaction, keeping trust,

                transparency and long-term relationships at the centre.

              </p>

              <Link href="/contact" className="about-text-link">

                Start a conversation

                <ArrowUpRight size={16} />

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* MISSION AND VISION */}

      <section className="about-purpose-section">

        <div className="about-container">

          <div className="about-purpose-heading">

            <span className="about-section-kicker">

              WHAT DRIVES US

            </span>

            <h2>

              Purpose behind

              <br />

              everything we do.

            </h2>

            <p>

              Our direction is shaped by a simple belief:

              better experiences begin with better understanding.

            </p>

          </div>

          <div className="about-purpose-grid">

            <article className="about-purpose-card about-mission">

              <div className="about-purpose-icon">

                <Compass size={23} />

              </div>

              <span className="about-card-label">

                OUR MISSION

              </span>

              <h3>

                Making important journeys simpler.

              </h3>

              <p>

                To create an accessible and connected platform

                where people can discover relevant services,

                find useful knowledge and make more informed

                decisions through thoughtful experiences.

              </p>

              <span className="about-purpose-number">01</span>

            </article>

            <article className="about-purpose-card about-vision">

              <div className="about-purpose-icon">

                <Sparkles size={23} />

              </div>

              <span className="about-card-label">

                OUR VISION

              </span>

              <h3>

                Building meaningful connections.

              </h3>

              <p>

                To build a trusted ecosystem that brings guidance,

                opportunities, knowledge and people together,

                creating value that extends beyond a single

                interaction.

              </p>

              <span className="about-purpose-number">02</span>

            </article>

          </div>

        </div>

      </section>

      {/* CORE VALUES */}

      <section className="about-values-section">

        <div className="about-container">

          <div className="about-section-heading">

            <div>

              <span className="about-section-kicker">

                WHAT WE BELIEVE IN

              </span>

              <h2>

                Our values shape

                <br />

                every experience.

              </h2>

            </div>

            <p>

              These principles guide how we build our platform,

              approach our services and interact with people.

            </p>

          </div>

          <div className="about-values-grid">

            {values.map((value) => {

              const Icon = value.icon;

              return (

                <article className="about-value-card" key={value.number}>

                  <div className="about-value-top">

                    <span>{value.number}</span>

                    <div className="about-value-icon">

                      <Icon size={23} />

                    </div>

                  </div>

                  <h3>{value.title}</h3>

                  <p>{value.description}</p>

                  <div className="about-value-line" />

                </article>

              );

            })}

          </div>

        </div>

      </section>

      {/* OUR ECOSYSTEM */}

      <section className="about-services-section">

        <div className="about-container">

          <div className="about-section-heading about-services-heading">

            <div>

              <span className="about-section-kicker about-gold-kicker">

                THE DIVYAJYOTI ECOSYSTEM

              </span>

              <h2>

                Different needs.

                <br />

                Connected experiences.

              </h2>

            </div>

            <p>

              Explore the different areas of Divyajyoti,

              each designed to serve a distinct purpose while

              remaining part of one connected platform.

            </p>

          </div>

          <div className="about-services-grid">

            {services.map((service) => {

              const Icon = service.icon;

              return (

                <Link

                  href={service.href}

                  key={service.number}

                  className="about-service-card"

                >

                  <div className="about-service-top">

                    <span>{service.number}</span>

                    <ArrowUpRight size={18} />

                  </div>

                  <div className="about-service-icon">

                    <Icon size={24} />

                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <span className="about-service-link">

                    Explore service

                    <MoveUpRight size={14} />

                  </span>

                </Link>

              );

            })}

          </div>

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="about-final-section">

        <div className="about-container">

          <div className="about-final-content">

            <div className="about-final-decoration">

              <Sparkles size={23} />

            </div>

            <span className="about-section-kicker about-gold-kicker">

              LET'S CONNECT

            </span>

            <h2>

              Every meaningful journey

              <br />

              begins with a conversation.

            </h2>

            <p>

              Whether you are exploring a service, looking for

              guidance or simply want to know more about us,

              we would be happy to hear from you.

            </p>

            <Link href="/contact" className="about-final-btn">

              Connect with our team

              <ArrowUpRight size={17} />

            </Link>

            <span className="about-final-location">

              KOLKATA · WEST BENGAL · INDIA

            </span>

          </div>

        </div>

      </section>

      {/* WHATSAPP QR CODE */}

      <WhatsAppContact />

      {/* PAGE-SPECIFIC STYLES */}

      <style jsx>{`

        .about-page {

          --about-navy: #101b2d;

          --about-gold: #bd914e;

          --about-cream: #f6f1e8;

          --about-paper: #fffefa;

          --about-muted: #68768a;

          --about-line: #e8e1d6;

          background: var(--about-paper);

          color: var(--about-navy);

          overflow: hidden;

        }

        .about-page * {

          box-sizing: border-box;

        }

        .about-container {

          width: min(1240px, calc(100% - 48px));

          margin: 0 auto;

        }

        .about-hero {

          background: linear-gradient(135deg, #f8f5ee, #f0e9dc);

          padding: 75px 0 85px;

        }

        .about-hero-grid {

          display: grid;

          grid-template-columns: 1fr 0.92fr;

          gap: 75px;

          align-items: center;

        }

        .about-hero-copy {

          padding: 20px 0;

        }

        .about-eyebrow,

        .about-section-kicker {

          font-size: 10px;

          font-weight: 800;

          letter-spacing: .2em;

          color: #a77c3f;

        }

        .about-eyebrow {

          display: flex;

          align-items: center;

          gap: 10px;

        }

        .about-eyebrow span {

          width: 28px;

          height: 1px;

          background: currentColor;

        }

        .about-hero h1 {

          font-family: var(--font-playfair, Georgia, serif);

          font-size: clamp(48px, 5.2vw, 70px);

          line-height: 1.04;

          letter-spacing: -.045em;

          font-weight: 500;

          margin: 24px 0;

        }

        .about-hero h1 em {

          display: block;

          color: #9c7540;

          font-style: normal;

        }

        .about-hero-description {

          max-width: 550px;

          font-size: 15px;

          line-height: 1.9;

          color: var(--about-muted);

        }

        .about-hero-actions {

          display: flex;

          gap: 13px;

          flex-wrap: wrap;

          margin-top: 30px;

        }

        .about-primary-btn,

        .about-final-btn {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          background: var(--about-navy);

          color: white;

          padding: 15px 22px;

          border-radius: 4px;

          text-decoration: none;

          font-size: 12px;

          font-weight: 700;

          transition: .25s;

        }

        .about-primary-btn:hover,

        .about-final-btn:hover {

          background: #263a55;

          transform: translateY(-3px);

        }

        .about-secondary-btn {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          border: 1px solid #d6cbbb;

          padding: 15px 20px;

          color: var(--about-navy);

          text-decoration: none;

          font-size: 12px;

          font-weight: 700;

          transition: .25s;

        }

        .about-secondary-btn:hover {

          background: white;

        }

        .about-hero-note {

          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 35px;

          font-size: 10px;

          color: #68768a;

          line-height: 1.6;

        }

        .about-note-icon {

          display: grid;

          place-items: center;

          color: #a67d43;

        }

        .about-hero-visual {

          height: 510px;

          position: relative;

        }

        .about-main-image {

          position: absolute;

          inset: 0 0 20px 30px;

          background:

            linear-gradient(180deg, transparent 35%, rgba(10,20,35,.7)),

            url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85")

            center/cover;

          border-radius: 8px 8px 100px 8px;

          box-shadow: 0 30px 70px rgba(16,27,45,.14);

        }

        .about-image-overlay {

          position: absolute;

          left: 55px;

          bottom: 65px;

          color: white;

        }

        .about-image-overlay span {

          font-size: 9px;

          letter-spacing: .2em;

          color: #e3c18e;

          font-weight: 800;

        }

        .about-image-overlay strong {

          display: block;

          font-family: var(--font-playfair, Georgia, serif);

          font-size: 27px;

          line-height: 1.3;

          margin-top: 12px;

          font-weight: 500;

        }

        .about-floating-card {

          position: absolute;

          top: 65px;

          left: 0;

          display: flex;

          align-items: center;

          gap: 12px;

          padding: 16px;

          background: #fffefa;

          border: 1px solid #e7dfd1;

          box-shadow: 0 15px 45px rgba(16,27,45,.13);

          border-radius: 8px;

        }

        .about-floating-icon {

          width: 38px;

          height: 38px;

          display: grid;

          place-items: center;

          color: #a77c3f;

          background: #f4eee3;

        }

        .about-floating-card strong,

        .about-floating-card span {

          display: block;

        }

        .about-floating-card strong {

          font-size: 11px;

        }

        .about-floating-card span {

          font-size: 9px;

          color: var(--about-muted);

          margin-top: 4px;

        }

        .about-image-number {

          position: absolute;

          right: 0;

          bottom: 0;

          font-size: 9px;

          letter-spacing: .18em;

          color: #8c795e;

        }

        .about-story-section {

          padding: 110px 0;

        }

        .about-story-grid {

          display: grid;

          grid-template-columns: .7fr 1.3fr;

          gap: 90px;

        }

        .about-story-decoration {

          width: 145px;

          height: 145px;

          margin-top: 35px;

          display: grid;

          place-items: center;

          border: 1px solid #e4d8c6;

          border-radius: 50%;

          background: #faf7f0;

        }

        .about-story-decoration span {

          font-family: var(--font-playfair, Georgia, serif);

          font-size: 78px;

          color: #b78d51;

        }

        .about-story-label p {

          font-family: var(--font-playfair, Georgia, serif);

          font-size: 16px;

          color: var(--about-muted);

        }

        .about-story-content h2 {

          font-family: var(--font-playfair, Georgia, serif);

          font-size: clamp(36px, 4vw, 49px);

          font-weight: 500;

          line-height: 1.13;

          letter-spacing: -.035em;

          margin: 0 0 25px;

        }

        .about-story-content h2 span {

          color: #a17b45;

        }

        .about-story-content p {

          font-size: 13px;

          line-height: 1.95;

          color: var(--about-muted);

          margin: 0 0 17px;

        }

        .about-text-link {

          display: inline-flex;

          gap: 9px;

          align-items: center;

          margin-top: 15px;

          color: var(--about-navy);

          text-decoration: none;

          font-size: 12px;

          font-weight: 800;

          border-bottom: 1px solid #c39a5b;

          padding-bottom: 7px;

        }

        .about-purpose-section {

          background: #f6f2e9;

          padding: 95px 0;

        }

        .about-purpose-heading {

          max-width: 650px;

          margin-bottom: 42px;

        }

        .about-purpose-heading h2,

        .about-section-heading h2 {

          font-family: var(--font-playfair, Georgia, serif);

          font-size: clamp(38px, 4vw, 53px);

          line-height: 1.06;

          letter-spacing: -.035em;

          font-weight: 500;

          margin: 15px 0;

        }

        .about-purpose-heading p,

        .about-section-heading > p {

          max-width: 450px;

          font-size: 13px;

          line-height: 1.8;

          color: var(--about-muted);

        }

        .about-purpose-grid {

          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 20px;

        }

        .about-purpose-card {

          position: relative;

          overflow: hidden;

          min-height: 345px;

          padding: 38px;

          border-radius: 5px;

        }

        .about-mission {

          background: var(--about-navy);

          color: white;

        }

        .about-vision {

          background: #e8dfd0;

          color: var(--about-navy);

        }

        .about-purpose-icon {

          width: 49px;

          height: 49px;

          display: grid;

          place-items: center;

          border: 1px solid rgba(196,153,88,.4);

          color: #c49a5c;

          margin-bottom: 32px;

        }

        .about-card-label {

          font-size: 9px;

          font-weight: 800;

          letter-spacing: .2em;

          color: #bd965d;

        }

        .about-purpose-card h3 {

          position: relative;

          z-index: 1;

          max-width: 380px;

          font-family: var(--font-playfair, Georgia, serif);

          font-size: 33px;

          font-weight: 500;

          line-height: 1.15;

          margin: 14px 0;

        }

        .about-purpose-card p {

          position: relative;

          z-index: 1;

          max-width: 450px;

          font-size: 12px;

          line-height: 1.85;

          color: inherit;

          opacity: .76;

        }

        .about-purpose-number {

          position: absolute;

          right: 20px;

          bottom: -40px;

          font-family: var(--font-playfair, Georgia, serif);

          font-size: 170px;

          opacity: .045;

        }

        .about-values-section {

          padding: 105px 0;

        }

        .about-section-heading {

          display: flex;

          justify-content: space-between;

          align-items: end;

          gap: 45px;

          margin-bottom: 40px;

        }

        .about-section-heading h2 {

          margin-bottom: 0;

        }

        .about-section-heading > p {

          margin-bottom: 5px;

        }

        .about-values-grid {

          display: grid;

          grid-template-columns: repeat(3, 1fr);

          border-top: 1px solid var(--about-line);

          border-bottom: 1px solid var(--about-line);

        }

        .about-value-card {

          padding: 30px 28px;

          border-right: 1px solid var(--about-line);

          display: flex;

          flex-direction: column;

          min-height: 280px;

        }

        .about-value-card:first-child {

          padding-left: 0;

        }

        .about-value-card:last-child {

          border-right: 0;

          padding-right: 0;

        }

        .about-value-top {

          display: flex;

          justify-content: space-between;

          align-items: center;

        }

        .about-value-top > span {

          font-size: 10px;

          color: #a68b67;

          letter-spacing: .1em;

        }

        .about-value-icon {

          width: 43px;

          height: 43px;

          display: grid;

          place-items: center;

          background: #f5f0e7;

          color: #ad844a;

          border-radius: 50%;

        }

        .about-value-card h3 {

          font-family: var(--font-playfair, Georgia, serif);

          font-size: 25px;

          font-weight: 500;

          margin: 28px 0 12px;

        }

        .about-value-card p {

          font-size: 12px;

          line-height: 1.85;

          color: var(--about-muted);

          margin: 0;

          max-width: 310px;

          flex: 1;

        }

        .about-value-line {

          width: 35px;

          height: 2px;

          background: #bd914e;

          margin-top: 25px;

        }

        .about-services-section {

          background: var(--about-navy);

          color: white;

          padding: 100px 0;

        }

        .about-services-heading h2 {

          color: white;

        }

        .about-services-heading > p {

          color: #aeb9c7;

        }

        .about-gold-kicker {

          color: #dfbd87;

        }

        .about-services-grid {

          display: grid;

          grid-template-columns: repeat(3, 1fr);

          gap: 14px;

        }

        .about-service-card {

          display: flex;

          flex-direction: column;

          min-height: 290px;

          padding: 25px;

          border: 1px solid rgba(255,255,255,.12);

          background: rgba(255,255,255,.035);

          color: white;

          text-decoration: none;

          transition: .3s;

        }

        .about-service-card:hover {

          background: rgba(255,255,255,.085);

          border-color: rgba(223,189,135,.55);

          transform: translateY(-5px);

        }

        .about-service-top {

          display: flex;

          justify-content: space-between;

          align-items: center;

          color: #8290a2;

          font-size: 10px;

        }

        .about-service-top svg {

          color: #d4b17b;

        }

        .about-service-icon {

          margin-top: 35px;

          color: #d9bb8a;

        }

        .about-service-card h3 {

          font-family: var(--font-playfair, Georgia, serif);

          font-size: 25px;

          font-weight: 500;

          margin: 15px 0 8px;

        }

        .about-service-card p {

          color: #aeb9c7;

          font-size: 11px;

          line-height: 1.8;

          margin: 0;

          flex: 1;

        }

        .about-service-link {

          display: flex;

          align-items: center;

          gap: 8px;

          margin-top: 24px;

          font-size: 10px;

          font-weight: 750;

          color: #e2c28f;

        }

        .about-final-section {

          padding: 100px 0;

          background:

            radial-gradient(circle at 50% 0%, rgba(197,150,75,.12), transparent 35%),

            #111e31;

          color: white;

          text-align: center;

        }

        .about-final-content {

          max-width: 760px;

          margin: 0 auto;

        }

        .about-final-decoration {

          width: 55px;

          height: 55px;

          border: 1px solid rgba(226,189,130,.4);

          display: grid;

          place-items: center;

          color: #e2bd82;

          border-radius: 50%;

          margin: 0 auto 25px;

        }

        .about-final-content h2 {

          font-family: var(--font-playfair, Georgia, serif);

          font-size: clamp(38px, 5vw, 58px);

          line-height: 1.08;

          font-weight: 500;

          letter-spacing: -.035em;

          margin: 20px 0;

        }

        .about-final-content > p {

          max-width: 540px;

          margin: 0 auto;

          color: #aeb9c7;

          font-size: 13px;

          line-height: 1.85;

        }

        .about-final-btn {

          margin-top: 30px;

          background: #d1a76a;

          color: #101b2d;

        }

        .about-final-btn:hover {

          background: #e4c28d;

        }

        .about-final-location {

          display: block;

          margin-top: 45px;

          font-size: 9px;

          letter-spacing: .2em;

          color: #8491a2;

        }

        @media (max-width: 1000px) {

          .about-hero-grid {

            grid-template-columns: 1fr 1fr;

            gap: 35px;

          }

          .about-story-grid {

            gap: 45px;

          }

          .about-services-grid {

            grid-template-columns: repeat(2, 1fr);

          }

        }

        @media (max-width: 700px) {

          .about-container {

            width: calc(100% - 32px);

          }

          .about-hero {

            padding: 48px 0 60px;

          }

          .about-hero-grid,

          .about-story-grid,

          .about-purpose-grid {

            grid-template-columns: 1fr;

          }

          .about-hero-grid {

            gap: 35px;

          }

          .about-hero h1 {

            font-size: 46px;

          }

          .about-hero-description {

            font-size: 14px;

          }

          .about-hero-actions {

            flex-direction: column;

          }

          .about-primary-btn,

          .about-secondary-btn {

            width: 100%;

          }

          .about-hero-visual {

            height: 360px;

            margin: 0 5px;

          }

          .about-main-image {

            inset: 0 0 15px 15px;

            border-radius: 5px 5px 65px 5px;

          }

          .about-floating-card {

            top: 28px;

            left: -5px;

            padding: 11px;

          }

          .about-image-overlay {

            left: 35px;

            bottom: 50px;

          }

          .about-image-overlay strong {

            font-size: 23px;

          }

          .about-story-section,

          .about-values-section {

            padding: 70px 0;

          }

          .about-story-grid {

            gap: 25px;

          }

          .about-story-decoration {

            width: 95px;

            height: 95px;

            margin-top: 20px;

          }

          .about-story-decoration span {

            font-size: 52px;

          }

          .about-story-content h2 {

            font-size: 37px;

          }

          .about-purpose-section {

            padding: 70px 0;

          }

          .about-purpose-heading h2,

          .about-section-heading h2 {

            font-size: 39px;

          }

          .about-purpose-card {

            min-height: 310px;

            padding: 28px;

          }

          .about-purpose-card h3 {

            font-size: 29px;

          }

          .about-section-heading {

            display: block;

            margin-bottom: 30px;

          }

          .about-section-heading > p {

            margin-top: 18px;

          }

          .about-values-grid {

            grid-template-columns: 1fr;

          }

          .about-value-card,

          .about-value-card:first-child,

          .about-value-card:last-child {

            padding: 25px 0;

            border-right: 0;

            border-bottom: 1px solid var(--about-line);

            min-height: 0;

          }

          .about-value-card:last-child {

            border-bottom: 0;

          }

          .about-value-card h3 {

            margin-top: 18px;

          }

          .about-services-section {

            padding: 75px 0;

          }

          .about-services-grid {

            grid-template-columns: 1fr;

          }

          .about-service-card {

            min-height: 260px;

          }

          .about-final-section {

            padding: 75px 0;

          }

          .about-final-content h2 {

            font-size: 39px;

          }

          .about-final-location {

            font-size: 8px;

          }

        }

        @media (max-width: 380px) {

          .about-hero h1 {

            font-size: 39px;

          }

          .about-hero-visual {

            height: 315px;

          }

          .about-image-overlay strong {

            font-size: 20px;

          }

          .about-purpose-card {

            padding: 24px;

          }

          .about-purpose-heading h2,

          .about-section-heading h2 {

            font-size: 35px;

          }

        }

        @media (prefers-reduced-motion: reduce) {

          .about-page *,

          .about-page *::before,

          .about-page *::after {

            scroll-behavior: auto !important;

            transition-duration: 0.01ms !important;

            animation-duration: 0.01ms !important;

          }

        }

      `}</style>

    </main>

  );

}

