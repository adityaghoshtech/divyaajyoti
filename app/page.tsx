import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CircleDot,
  Sparkles,
  Crown,
  GraduationCap,
  Home as HomeIcon,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
  BriefcaseBusiness
} from 'lucide-react';
import { properties, courses, articles, astrologyCourses, astrologyTeachers, testimonials } from '@/lib/data';
import { PropertyCard } from '@/components/property-card';
import { SectionHead } from '@/components/section';

export default function Home() {
  return (
    <main>
      <div className="announcement">
        <div className="container announcement-inner">
          <span><CircleDot size={13} /> Astrology classes & personal consultations are now open</span>
          <Link href="/astrology">Explore astrology <ArrowUpRight size={13} /></Link>
        </div>
      </div>

      <section className="hero-premium">
        <div className="container hero-premium-grid">
          <div className="hero-premium-copy">
            <div className="eyebrow"><Sparkles size={13} /> Divyajyoti • One trusted place</div>
            <h1 className="display">Guidance for life.<br /><span>Spaces for living.</span><br />Learning for growth.</h1>
            <p className="hero-premium-lead">Astrology, property, learning and private business services — brought together in one simple experience.</p>
            <div className="hero-actions">
              <Link className="btn btn-dark" href="/astrology">Explore astrology <ArrowUpRight size={15} /></Link>
              <Link className="btn btn-light" href="/properties">Explore properties <ArrowRight size={15} /></Link>
            </div>
            <div className="hero-trust-row">
              <span><Check size={13} /> Simple to understand</span>
              <span><Check size={13} /> Experienced people</span>
              <span><Check size={13} /> Personal support</span>
            </div>
          </div>

          <div className="hero-collage" aria-label="Divyajyoti services">
            <div className="collage-main-photo" />
            <div className="collage-astro-card">
              <div className="mini-label"><CircleDot size={12} /> Astrology</div>
              <h3 className="display">Learn. Ask. Understand.</h3>
              <p>Classes and personal guidance in clear, everyday language.</p>
              <Link href="/astrology">Discover <ArrowUpRight size={13} /></Link>
            </div>
            <div className="collage-vip-card">
              <span className="vip-icon"><Crown size={15} /></span>
              <div><b>VIP & Business Desk</b><small>Private guidance • Priority support</small></div>
            </div>
            <div className="collage-property-photo" />
            <div className="collage-caption"><span>01</span><b>A considered digital experience</b><small>Astrology • Property • Learning • Business</small></div>
          </div>
        </div>

        <div className="container service-nav">
          <Link className="service-nav-item active" href="/astrology"><span><CircleDot size={17} /></span><div><b>Astrology</b><small>Classes & consultations</small></div><ArrowUpRight size={14} /></Link>
          <Link className="service-nav-item" href="/properties"><span><HomeIcon size={17} /></span><div><b>Property</b><small>Homes & investments</small></div><ArrowUpRight size={14} /></Link>
          <Link className="service-nav-item" href="/vip-business"><span><Crown size={17} /></span><div><b>VIP & Business</b><small>Private services</small></div><ArrowUpRight size={14} /></Link>
          <Link className="service-nav-item" href="/education"><span><GraduationCap size={17} /></span><div><b>Learning</b><small>Courses & workshops</small></div><ArrowUpRight size={14} /></Link>
          <Link className="service-nav-item" href="/events"><span><CalendarDays size={17} /></span><div><b>Events</b><small>Talks & community</small></div><ArrowUpRight size={14} /></Link>
        </div>
      </section>

      <section className="section astrology-home-lead">
        <div className="container astrology-lead-grid">
          <div className="astrology-editorial-visual">
            <div className="astrology-photo" />
            <div className="astrology-note"><CircleDot size={15} /><span>ASTROLOGY STUDIO</span><b>Learn it step by step.</b><small>Live classes • Practice • Doubt support</small></div>
            <div className="astrology-number">01</div>
          </div>
          <div className="astrology-lead-copy">
            <div className="eyebrow">Astrology is a major part of Divyajyoti</div>
            <h2 className="display">A simple place to learn astrology and get personal guidance.</h2>
            <p>Start with the basics, practise reading charts and ask questions along the way. If you have a personal question, you can also speak with an experienced astrologer.</p>
            <p>We keep our language simple and our sessions focused, so you can understand what is being discussed and decide your next step yourself.</p>
            <div className="check-grid"><span><Check /> Beginner friendly</span><span><Check /> Live teacher support</span><span><Check /> Chart practice</span><span><Check /> Online & offline options</span></div>
            <div className="hero-actions"><Link className="btn btn-dark" href="/astrology">Explore astrology <ArrowUpRight size={15} /></Link><Link className="text-link" href="/consultation">Talk to an astrologer <ArrowRight size={14} /></Link></div>
          </div>
        </div>
      </section>

      <section className="section dark-service-section">
        <div className="container">
          <div className="section-head dark-head"><div><div className="eyebrow">The four ways to start</div><h2 className="display">Choose what you need today.</h2></div><p>One platform, different needs. You can begin with a class, a conversation, a property search or a private service.</p></div>
          <div className="service-card-grid">
            <Link href="/astrology#classes" className="big-service-card astro"><span className="service-index">01</span><CircleDot className="service-big-icon" /><h3 className="display">Astrology</h3><p>Learn astrology, understand charts and speak with an astrologer when you need personal guidance.</p><span className="service-link">Explore astrology <ArrowUpRight size={14} /></span></Link>
            <Link href="/properties" className="big-service-card property-service"><span className="service-index">02</span><Building2 className="service-big-icon" /><h3 className="display">Property</h3><p>Explore selected homes, land and spaces with clear details and a calmer way to compare.</p><span className="service-link">View properties <ArrowUpRight size={14} /></span></Link>
            <Link href="/vip-business" className="big-service-card vip"><span className="service-index">03</span><Crown className="service-big-icon" /><h3 className="display">VIP & Business</h3><p>Private consultations, business-focused guidance, property assistance and priority support.</p><span className="service-link">View private services <ArrowUpRight size={14} /></span></Link>
            <Link href="/education" className="big-service-card learning"><span className="service-index">04</span><GraduationCap className="service-big-icon" /><h3 className="display">Learning</h3><p>Useful courses and workshops for people who want to build knowledge at their own pace.</p><span className="service-link">Explore learning <ArrowUpRight size={14} /></span></Link>
          </div>
        </div>
      </section>

      <section className="section astrology-classes-home">
        <div className="container">
          <SectionHead eyebrow="Astrology classes" title="Start from where you are." text="No need to know everything before you begin. Choose a level and learn step by step." action={<Link className="btn btn-light btn-sm" href="/astrology#classes">View all classes <ArrowUpRight size={13} /></Link>} />
          <div className="class-showcase">
            {astrologyCourses.map((course, index) => (
              <Link className={`class-showcase-card ${index === 0 ? 'featured' : ''}`} href="/astrology#classes" key={course.slug}>
                <div className="class-image" style={{ backgroundImage: `url(${course.image})` }}><span>{course.level}</span></div>
                <div className="class-copy"><div className="eyebrow">{course.category}</div><h3 className="display">{course.title}</h3><p>{course.description}</p><div className="class-meta"><span>{course.duration}</span><span>{course.format}</span><ArrowUpRight size={15} /></div></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section teachers-home">
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">Our teachers</div><h2 className="display">People behind the learning.</h2></div><p>See who you will learn from, what they teach and the experience they bring.</p></div>
          <div className="teacher-home-grid">
            {astrologyTeachers.map((teacher) => <article className="teacher-home-card" key={teacher.name}><div className="teacher-home-photo" style={{ backgroundImage: `url(${teacher.image})` }}><span>{teacher.role}</span></div><div className="teacher-home-body"><div><h3 className="display">{teacher.name}</h3><span className="teacher-exp"><Star size={12} fill="currentColor" /> {teacher.experience}</span></div><p>{teacher.bio}</p><div className="teacher-tags">{teacher.specialties.map(x => <span key={x}>{x}</span>)}</div></div></article>)}
          </div>
        </div>
      </section>

      <section className="section feedback-home">
        <div className="container">
          <div className="feedback-top"><div><div className="eyebrow">Feedback</div><h2 className="display">What people remember.</h2></div><div className="feedback-rating"><span>★★★★★</span><small>From learners & consultation clients</small></div></div>
          <div className="feedback-grid">{testimonials.map(t => <article className="feedback-card" key={t.name}><div className="quote-symbol">“</div><p>{t.text}</p><div className="feedback-person"><span>{t.name[0]}</span><div><b>{t.name}</b><small>{t.role}</small></div></div></article>)}</div>
        </div>
      </section>

      <section className="section vip-home">
        <div className="container vip-home-grid">
          <div className="vip-home-visual"><div className="vip-main-photo" /><div className="vip-badge"><Crown size={14} /><span>PRIVATE DESK</span></div><div className="vip-mini-card"><b>Priority support</b><small>For personal, property & business needs</small></div></div>
          <div className="vip-home-copy"><div className="eyebrow">VIP & Business</div><h2 className="display">A private desk for important decisions.</h2><p>For clients who need more personal attention, Divyajyoti offers private services across astrology, property and business-related guidance.</p><div className="vip-list"><span><ShieldCheck /> Dedicated point of contact</span><span><BriefcaseBusiness /> Business-focused conversations</span><span><Building2 /> Private property assistance</span><span><CircleDot /> Personal astrology sessions</span></div><Link className="btn btn-dark" href="/vip-business">Explore VIP & Business <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>

      <section className="section property-home">
        <div className="container">
          <SectionHead eyebrow="Property" title="Find a place with more context." text="Selected homes and spaces, with the details you need before you take the next step." action={<Link className="btn btn-light btn-sm" href="/properties">View all properties <ArrowUpRight size={13} /></Link>} />
          <div className="grid3">{properties.slice(0, 3).map(p => <PropertyCard key={p.slug} p={p} />)}</div>
        </div>
      </section>

      <section className="section ecosystem-home">
        <div className="container ecosystem-grid">
          <div><div className="eyebrow">Beyond the core services</div><h2 className="display">Learn, meet people and keep exploring.</h2><p>Courses, events and useful articles complete the Divyajyoti experience.</p></div>
          <div className="ecosystem-links"><Link href="/education"><GraduationCap /><span><b>Learning Studio</b><small>Courses & practical workshops</small></span><ArrowUpRight /></Link><Link href="/events"><CalendarDays /><span><b>Events & sessions</b><small>Talks, classes & gatherings</small></span><ArrowUpRight /></Link><Link href="/insights"><BookOpen /><span><b>Divyajyoti Journal</b><small>Ideas, guides & useful reads</small></span><ArrowUpRight /></Link></div>
        </div>
      </section>

      <section className="final-cta premium-final"><div className="container final-cta-inner"><div className="eyebrow">Start with what matters to you</div><h2 className="display">One question is enough to begin.</h2><p>Whether it is astrology, a property, learning or a private business need, tell us what you are looking for.</p><div className="hero-actions final-cta-actions"><Link className="btn btn-gold" href="/consultation">Start a conversation <ArrowUpRight size={15} /></Link><Link className="btn btn-white" href="/astrology">Explore astrology <ArrowRight size={15} /></Link></div></div></section>
    </main>
  );
}
