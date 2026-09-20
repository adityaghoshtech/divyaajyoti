import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand"><span className="mark">D</span><span><strong style={{ color: 'white' }}>Divyajyoti</strong><small style={{ color: '#8190a1' }}>Astrology • Property • Learning</small></span></div>
          <p style={{ maxWidth: 310, lineHeight: 1.75, fontSize: 13, color: '#93a0b0', marginTop: 20 }}>A considered digital experience for astrology, property, private services, learning and meaningful conversations.</p>
        </div>
        <div><h4>Explore</h4><Link href="/astrology">Astrology</Link><Link href="/properties">Property</Link><Link href="/vip-business">VIP & Business</Link><Link href="/education">Learning</Link></div>
        <div><h4>Discover</h4><Link href="/events">Events</Link><Link href="/insights">Insights</Link><Link href="/about">About Divyajyoti</Link><Link href="/list-property">List a property</Link></div>
        <div><h4>Connect</h4><Link href="/consultation">Book a consultation</Link><Link href="/contact">Talk to our team</Link><span style={{ display: 'block', fontSize: 12, color: '#8794a5', marginTop: 15 }}>Kolkata • West Bengal • India</span></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 Divyajyoti. All rights reserved.</span><span>Privacy • Terms • Responsible Guidance</span></div>
    </footer>
  );
}
