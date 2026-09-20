import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

import { articles } from "@/lib/data";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = articles.find(
    (item) => item.slug === slug
  );

  if (!article) {
    return (
      <main>
        <section className="section">
          <div className="container article-not-found">

            <div className="eyebrow">
              Insights
            </div>

            <h1>
              Article not found.
            </h1>

            <p>
              The article you are looking for could not
              be found.
            </p>

            <Link
              href="/insights"
              className="btn btn-dark"
              style={{ marginTop: 24 }}
            >
              <ArrowLeft size={15} />
              Back to insights
            </Link>

          </div>
        </section>
      </main>
    );
  }

  return (
    <main>

      {/* ARTICLE HERO */}

      <section className="article-hero">

        <div className="container">

          <Link
            href="/insights"
            className="article-back"
          >
            <ArrowLeft size={15} />
            Back to insights
          </Link>

          <div className="article-category">
            {article.category} · {article.date}
          </div>

          <h1>
            {article.title}
          </h1>

          <p className="article-excerpt">
            {article.excerpt}
          </p>

          <div className="article-meta">

            <span>
              <CalendarDays size={15} />
              {article.date}
            </span>

            <span>
              <Clock3 size={15} />
              5 min read
            </span>

          </div>

        </div>

      </section>


      {/* ARTICLE IMAGE */}

      <section className="article-image-section">

        <div className="container">

          <div
            className="article-cover"
            style={{
              backgroundImage:
                `url(${article.image})`,
            }}
          />

        </div>

      </section>


      {/* ARTICLE CONTENT */}

      <section className="section article-content-section">

        <div className="container article-layout">

          <article className="article-content">

            {article.content
              .split("\n\n")
              .map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}

          </article>


          {/* SIDEBAR */}

          <aside className="article-sidebar">

            <div className="article-sidebar-card">

              <div className="eyebrow">
                Divyajyoti
              </div>

              <h3>
                Want to discuss this further?
              </h3>

              <p>
                Speak with our team about your property,
                astrology, Vastu or learning questions.
              </p>

              <Link
                href="/consultation"
                className="btn btn-dark"
              >
                Book a consultation
                <ArrowUpRight size={14} />
              </Link>

            </div>

          </aside>

        </div>

      </section>


      {/* MORE INSIGHTS */}

      <section className="article-bottom">

        <div className="container">

          <Link
            href="/insights"
            className="btn btn-light"
          >
            <ArrowLeft size={15} />
            More insights
          </Link>

        </div>

      </section>

    </main>
  );
}