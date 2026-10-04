
import Link from 'next/link';

import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Compass,
  Target,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Users,
  ClipboardCheck,
  MessageCircle,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

const services = [
  {
    icon: Compass,
    title: 'Career Direction & Planning',
    text: 'Understand your interests, strengths and goals to create a clear direction for your future career.',
  },
  {
    icon: ClipboardCheck,
    title: 'Career Assessment',
    text: 'Explore your skills, interests and personal strengths to identify career paths that suit you.',
  },
  {
    icon: BookOpen,
    title: 'Course & Education Guidance',
    text: 'Get guidance on choosing courses, colleges, higher education and professional learning opportunities.',
  },
  {
    icon: FileText,
    title: 'Resume & Profile Building',
    text: 'Present your qualifications, skills and experience through a professional resume and profile.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Interview & Job Preparation',
    text: 'Prepare for interviews, improve your communication and understand what employers expect.',
  },
  {
    icon: Target,
    title: 'Career Growth Guidance',
    text: 'Plan your next professional move, explore new opportunities and work towards your career goals.',
  },
];

const audiences = [
  {
    number: '01',
    title: 'School Students',
    text: 'Explore subjects, interests and possible career paths before making important academic decisions.',
  },
  {
    number: '02',
    title: 'College Students',
    text: 'Understand career opportunities, develop relevant skills and prepare for your professional journey.',
  },
  {
    number: '03',
    title: 'Fresh Graduates',
    text: 'Get support with job preparation, resume development, interviews and starting your career.',
  },
  {
    number: '04',
    title: 'Working Professionals',
    text: 'Explore career changes, professional development and opportunities for your next step.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Tell us about yourself',
    text: 'Share your education, interests, skills and the career questions you want to discuss.',
  },
  {
    number: '02',
    title: 'Understand your options',
    text: 'We discuss your goals and explore suitable career paths and opportunities.',
  },
  {
    number: '03',
    title: 'Create a career plan',
    text: 'Get practical next steps for learning, skill development and professional preparation.',
  },
  {
    number: '04',
    title: 'Move forward with clarity',
    text: 'Use your guidance plan to take informed steps towards your career goals.',
  },
];

export default function VipBusinessPage() {
  return (
    <main className="career-page">

      {/* HERO SECTION */}

      <section className="pagehero vip-page-hero career-page-hero">

        <div className="container vip-page-grid career-hero-grid">

          <div className="career-hero-copy">

            <div className="eyebrow">
              <GraduationCap size={15} />
              Career Counselling
            </div>

            <h1 className="display">
              Find your direction.
              <span> Build your future.</span>
            </h1>

            <p>
              Every career journey is different. Get personal guidance to
              understand your strengths, explore opportunities and make
              informed decisions about your future.
            </p>

            <div className="hero-actions">

              <Link
                className="btn btn-dark"
                href="/contact"
              >
                Book Career Counselling
                <ArrowUpRight size={15} />
              </Link>

              <Link
                className="btn btn-light"
                href="#career-services"
              >
                Explore Our Services
                <ArrowRight size={15} />
              </Link>

            </div>

            <div className="career-hero-points">

              <span>
                <CheckCircle2 size={15} />
                Personal guidance
              </span>

              <span>
                <CheckCircle2 size={15} />
                Practical direction
              </span>

              <span>
                <CheckCircle2 size={15} />
                Career-focused support
              </span>

            </div>

          </div>

          <div className="career-hero-visual">

            <div className="career-page-photo" />

            <div className="career-photo-badge">

              <div className="career-photo-icon">
                <GraduationCap size={23} />
              </div>

              <div>
                <strong>Your Future Starts Here</strong>
                <small>Discover. Prepare. Grow.</small>
              </div>

            </div>

            <div className="career-photo-note">

              <span>YOUR CAREER JOURNEY</span>

              <strong>
                A clearer path towards your goals.
              </strong>

              <small>
                Guidance for students and professionals.
              </small>

            </div>

          </div>

        </div>

      </section>


      {/* INTRODUCTION */}

      <section className="section career-intro">

        <div className="container career-intro-grid">

          <div>

            <div className="eyebrow">
              A better way to plan your future
            </div>

            <h2 className="display">
              Your career deserves thoughtful decisions.
            </h2>

          </div>

          <div className="career-intro-copy">

            <p>
              Choosing a career, selecting the right course or preparing
              for your first job can feel confusing. There are many options,
              and it is not always easy to know where to begin.
            </p>

            <p>
              Divyajyoti Career Counselling aims to make this journey
              clearer through personal conversations, practical guidance
              and structured career planning.
            </p>

            <Link
              className="text-link"
              href="/contact"
            >
              Talk to a career counsellor
              <ArrowUpRight size={15} />
            </Link>

          </div>

        </div>

      </section>


      {/* SERVICES */}

      <section
        className="section career-services"
        id="career-services"
      >

        <div className="container">

          <div className="section-head career-section-heading">

            <div>

              <div className="eyebrow">
                What we can help with
              </div>

              <h2 className="display">
                Guidance for every stage of your career.
              </h2>

            </div>

            <p>
              From choosing an educational path to preparing for
              professional opportunities, get support based on your
              individual requirements.
            </p>

          </div>


          <div className="career-service-grid">

            {services.map(({ icon: Icon, title, text }, index) => (

              <article
                className="career-service-card"
                key={title}
              >

                <div className="career-service-top">

                  <div className="career-service-icon">
                    <Icon size={23} />
                  </div>

                  <span>
                    0{index + 1}
                  </span>

                </div>

                <h3>
                  {title}
                </h3>

                <p>
                  {text}
                </p>

                <Link href="/contact">

                  Discuss this service
                  <ArrowUpRight size={14} />

                </Link>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* WHO WE HELP */}

      <section className="section career-audience">

        <div className="container">

          <div className="career-audience-heading">

            <div className="eyebrow">
              Who we support
            </div>

            <h2 className="display">
              Career guidance at every stage of life.
            </h2>

            <p>
              Whether you are beginning your journey or considering
              a new direction, you can start with a conversation.
            </p>

          </div>


          <div className="career-audience-grid">

            {audiences.map((item) => (

              <article
                className="career-audience-card"
                key={item.number}
              >

                <span className="career-audience-number">
                  {item.number}
                </span>

                <div className="career-audience-line" />

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* COUNSELLING PROCESS */}

      <section className="section vip-process career-process">

        <div className="container vip-process-grid career-process-grid">

          <div>

            <div className="eyebrow">
              Our approach
            </div>

            <h2 className="display">
              A simple process. A clearer direction.
            </h2>

            <p>
              You do not need to have everything figured out before
              contacting us. Start with your questions and we can
              work through the next steps together.
            </p>

            <Link
              className="btn btn-dark career-process-btn"
              href="/contact"
            >
              Start Your Journey
              <ArrowUpRight size={15} />
            </Link>

          </div>


          <div className="career-process-list">

            {processSteps.map((step) => (

              <div
                className="career-process-item"
                key={step.number}
              >

                <b>
                  {step.number}
                </b>

                <span>

                  <strong>
                    {step.title}
                  </strong>

                  <small>
                    {step.text}
                  </small>

                </span>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* WHY CAREER COUNSELLING */}

      <section className="section career-benefits">

        <div className="container">

          <div className="career-benefits-card">

            <div className="career-benefits-icon">
              <Lightbulb size={29} />
            </div>

            <div className="career-benefits-content">

              <div className="eyebrow">
                The value of career guidance
              </div>

              <h2 className="display">
                Make your next decision with more clarity.
              </h2>

              <p>
                Career counselling is an opportunity to understand
                your options, ask questions and create a practical
                plan based on your interests and goals.
              </p>

              <div className="career-benefits-points">

                <span>
                  <CheckCircle2 size={16} />
                  Understand your strengths
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Explore relevant opportunities
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Plan your next steps
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Prepare with confidence
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}

      <section className="section career-final">

        <div className="container">

          <div className="career-final-card">

            <div className="eyebrow">
              Take the next step
            </div>

            <h2 className="display">
              Your future is worth planning.
            </h2>

            <p>
              Start a conversation with Divyajyoti and explore
              the career guidance that matches your needs.
            </p>

            <div className="career-final-actions">

              <Link
                className="btn btn-light"
                href="/contact"
              >
                Request Career Counselling
                <ArrowUpRight size={15} />
              </Link>

              <Link
                className="career-contact-link"
                href="/contact"
              >
                <MessageCircle size={15} />
                Contact our team
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
