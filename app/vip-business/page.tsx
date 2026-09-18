import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, Circle, Crown, ShieldCheck, Users } from 'lucide-react';

const services = [
  { icon: Circle, title: 'Private astrology', text: 'One-to-one sessions for personal questions, planning and guidance.' },
  { icon: Building2, title: 'Private property desk', text: 'More personal help when you are exploring, comparing or managing a property decision.' },
  { icon: BriefcaseBusiness, title: 'Business support', text: 'Focused conversations for business owners, professionals and important work decisions.' },
  { icon: Users, title: 'Dedicated assistance', text: 'A single point of contact for clients who prefer a more private experience.' },
];

export default function VipBusinessPage() {
  return <main>
    <section className="pagehero vip-page-hero"><div className="container vip-page-grid"><div><div className="eyebrow"><Crown size={13} /> Private services</div><h1 className="display">For clients who need a more personal way to work with us.</h1><p>Divyajyoti VIP & Business is a private service desk across astrology, property and business-related guidance.</p><div className="hero-actions"><Link className="btn btn-dark" href="/consultation">Request a private conversation <ArrowUpRight size={15} /></Link><Link className="btn btn-light" href="/contact">Contact us <ArrowRight size={15} /></Link></div></div><div className="vip-page-photo" /></div></section>
    <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Private desk</div><h2 className="display">Services built around the person, not a package.</h2></div><p>Start with your requirement. We can understand the context and guide you to the appropriate service.</p></div><div className="service-large-grid">{services.map(({icon: Icon,title,text})=><article className="service-large" key={title}><div className="service-large-icon"><Icon /></div><h3>{title}</h3><p>{text}</p><Link href="/consultation">Enquire <ArrowUpRight size={13}/></Link></article>)}</div></div></section>
    <section className="section vip-process"><div className="container vip-process-grid"><div><div className="eyebrow">How it works</div><h2 className="display">Private, clear and simple.</h2><p>We do not expect you to know which service you need before you contact us.</p></div><div className="process-list"><div><b>01</b><span><strong>Tell us what you need</strong><small>Share the question, requirement or situation in simple words.</small></span></div><div><b>02</b><span><strong>We understand the context</strong><small>A team member connects with you and identifies the right service.</small></span></div><div><b>03</b><span><strong>Choose the next step</strong><small>Proceed with a consultation, property assistance or business-focused service.</small></span></div></div></div></section>
    <section className="section"><div className="container vip-note"><ShieldCheck /><div><div className="eyebrow">A considered approach</div><h2 className="display">Private does not have to mean complicated.</h2><p>The aim is simple: less back and forth, clearer communication and a service shaped around your requirement.</p></div></div></section>
  </main>;
}
