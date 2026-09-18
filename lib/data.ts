export type Property = {
  slug: string;
  title: string;
  location: string;
  price: string;
  type: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  tag: string;
};

export type Course = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  description: string;
  image: string;
};

export type AstrologyCourse = Course & {
  level: string;
  format: string;
  mode: string;
};

export type Teacher = {
  name: string;
  role: string;
  experience: string;
  bio: string;
  specialties: string[];
  image: string;
};

export type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
};

export const properties: Property[] = [
  { slug: "the-veranda-residence", title: "The Veranda Residence", location: "New Town, Kolkata", price: "₹2.85 Cr", type: "Villa", beds: 4, baths: 4, area: "3,240 sq ft", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", tag: "Featured" },
  { slug: "the-olive-apartments", title: "The Olive Apartments", location: "Rajarhat, Kolkata", price: "₹1.42 Cr", type: "Apartment", beds: 3, baths: 3, area: "1,860 sq ft", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85", tag: "New" },
  { slug: "lakeview-estate", title: "Lakeview Estate", location: "Chandannagar, West Bengal", price: "₹3.65 Cr", type: "Bungalow", beds: 5, baths: 5, area: "4,800 sq ft", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", tag: "Private Listing" },
  { slug: "the-courtyard", title: "The Courtyard", location: "Ballygunge, Kolkata", price: "₹2.15 Cr", type: "Apartment", beds: 3, baths: 3, area: "2,120 sq ft", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85", tag: "Curated" },
  { slug: "garden-house", title: "Garden House", location: "Serampore, West Bengal", price: "₹1.95 Cr", type: "House", beds: 4, baths: 3, area: "2,900 sq ft", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85", tag: "Open House" },
  { slug: "skyline-penthouse", title: "Skyline Penthouse", location: "Salt Lake, Kolkata", price: "₹4.90 Cr", type: "Penthouse", beds: 4, baths: 5, area: "3,900 sq ft", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", tag: "Signature" },
];

export const astrologyCourses: AstrologyCourse[] = [
  { slug: "astrology-foundation", title: "Astrology Foundation", category: "Astrology", level: "Start here", duration: "12 weeks", format: "Live classes", mode: "Online / Offline", description: "Learn the basic ideas of astrology, understand a birth chart and build a strong foundation without rushing.", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1100&q=85" },
  { slug: "practical-chart-reading", title: "Practical Chart Reading", category: "Astrology", level: "Next step", duration: "14 weeks", format: "Live + practice", mode: "Online / Offline", description: "Move from theory to practice with guided chart reading, examples and regular doubt-clearing sessions.", image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1100&q=85" },
  { slug: "predictive-astrology", title: "Predictive Astrology", category: "Astrology", level: "Advanced", duration: "16 weeks", format: "Mentor-led", mode: "Limited batch", description: "Develop a deeper understanding of timing and prediction through structured lessons and case discussions.", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=85" },
];

export const astrologyTeachers: Teacher[] = [
  { name: "Lead Astrology Teacher", role: "Astrology • Consultation", experience: "Experienced teacher & practitioner", bio: "Teaches astrology through simple explanations, examples and patient chart discussions. The focus is on helping students understand why a chart is read in a certain way.", specialties: ["Birth charts", "Career guidance", "Chart practice"], image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85" },
  { name: "Senior Astrology Mentor", role: "Advanced Learning", experience: "Years of teaching & practice", bio: "Works with learners who already know the basics and want more confidence in chart reading, timing and practical interpretation.", specialties: ["Predictive astrology", "Mentorship", "Case study"], image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85" },
  { name: "Vastu & Guidance Mentor", role: "Vastu • Consultation", experience: "Experienced in practical guidance", bio: "Helps learners and clients understand space, direction and everyday changes without making the conversation difficult to follow.", specialties: ["Vastu", "Home guidance", "Consultation"], image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85" },
];

export const testimonials: Testimonial[] = [
  { name: "Aritra", role: "Astrology student", text: "The classes made astrology much easier for me. I liked that the teacher explained the reason behind each step instead of asking us to memorise everything." },
  { name: "Madhumita", role: "Consultation client", text: "The session was calm and easy to understand. I could ask my questions freely and the explanation was much simpler than I expected." },
  { name: "Soham", role: "Learning programme student", text: "The practical chart discussions helped me understand how the concepts connect. The regular doubt support was especially useful." },
];

export const courses: Course[] = [
  { slug: "foundations-of-data", title: "Foundations of Data & AI", category: "Technology", duration: "8 weeks", level: "Beginner", description: "Build a clear foundation in data and AI through guided lessons and practical exercises.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" },
  { slug: "design-thinking", title: "Design Thinking for Builders", category: "Design", duration: "6 weeks", level: "Intermediate", description: "Learn a practical way to understand users, shape ideas and build better solutions.", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1000&q=80" },
  { slug: "career-clarity", title: "Career Clarity & Direction", category: "Career", duration: "4 weeks", level: "All levels", description: "A guided programme for people who want to understand their options and plan their next step.", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80" },
];

export const articles: Article[] = [
  { slug: "buying-a-home-with-clarity", title: "Buying a home with clarity: the questions that matter", category: "Property", date: "12 Sep 2026", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80", excerpt: "A practical framework for comparing location, livability, documentation and long-term value." },
  { slug: "how-to-build-a-learning-system", title: "How to build a learning system that actually lasts", category: "Learning", date: "05 Sep 2026", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80", excerpt: "Move from collecting courses to creating a repeatable learning practice." },
  { slug: "vastu-as-a-design-lens", title: "Vastu as a thoughtful design lens", category: "Astrology & Vastu", date: "28 Aug 2026", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80", excerpt: "A balanced look at how spatial traditions can be considered alongside practical design." },
];
