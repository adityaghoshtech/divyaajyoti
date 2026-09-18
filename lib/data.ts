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
  price: number;
  instructor: string;
  format: string;
  lessons: number;
  language: string;
  highlights: string[];
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
  content: string;
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
  { slug: "astrology-foundation", title: "Astrology Foundation", category: "Astrology", level: "Start here", duration: "12 weeks", format: "Live classes", mode: "Online / Offline", description: "Learn the basic ideas of astrology, understand a birth chart and build a strong foundation without rushing.", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1100&q=85", price: 4999, instructor: "Divyajyoti Astrology Faculty", lessons: 24, language: "English / Bengali", highlights: ["Understanding the zodiac and planets", "Birth chart fundamentals", "Houses and planetary placements", "Basic chart interpretation", "Live doubt-clearing sessions"] },
  { slug: "practical-chart-reading", title: "Practical Chart Reading", category: "Astrology", level: "Next step", duration: "14 weeks", format: "Live + practice", mode: "Online / Offline", description: "Move from theory to practice with guided chart reading, examples and regular doubt-clearing sessions.", image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1100&q=85", price: 7499, instructor: "Senior Divyajyoti Astrology Mentor", lessons: 28, language: "English / Bengali", highlights: ["Chart reading methodology", "Planetary combinations", "Practical case studies", "Guided chart interpretation"] },
  { slug: "predictive-astrology", title: "Predictive Astrology", category: "Astrology", level: "Advanced", duration: "16 weeks", format: "Mentor-led", mode: "Limited batch", description: "Develop a deeper understanding of timing and prediction through structured lessons and case discussions.", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=85", price: 9999, instructor: "Senior Divyajyoti Astrology Mentor", lessons: 32, language: "English / Bengali", highlights: ["Timing techniques", "Predictive methods", "Case discussions", "Advanced chart interpretation"] },
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
  {
    slug: "astrology-foundation",
    title: "Astrology Foundation",
    category: "Astrology",
    duration: "12 weeks",
    level: "Beginner",
    description:
      "Learn the fundamentals of astrology, understand a birth chart and develop a strong foundation through guided practical learning.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
    price: 4999,
    instructor: "Divyajyoti Astrology Faculty",
    format: "Live online classes",
    lessons: 24,
    language: "English / Bengali",
    highlights: [
      "Understanding the zodiac and planets",
      "Birth chart fundamentals",
      "Houses and planetary placements",
      "Basic chart interpretation",
      "Live doubt-clearing sessions",
      "Practical chart exercises",
    ],
  },

  {
    slug: "practical-chart-reading",
    title: "Practical Chart Reading",
    category: "Astrology",
    duration: "14 weeks",
    level: "Intermediate",
    description:
      "Move from astrology theory to practical chart reading with guided examples, case discussions and regular practice.",
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=85",
    price: 7499,
    instructor: "Senior Divyajyoti Astrology Mentor",
    format: "Live + practical sessions",
    lessons: 28,
    language: "English / Bengali",
    highlights: [
      "Chart reading methodology",
      "Planetary combinations",
      "Career and relationship indicators",
      "Practical case studies",
      "Guided chart interpretation",
      "Weekly doubt sessions",
    ],
  },

  {
    slug: "real-estate-foundation",
    title: "Real Estate Investment Foundation",
    category: "Real Estate",
    duration: "8 weeks",
    level: "Beginner",
    description:
      "Understand the fundamentals of property investment, location analysis, documentation, valuation and decision-making.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
    price: 5999,
    instructor: "Divyajyoti Property Faculty",
    format: "Live online classes",
    lessons: 16,
    language: "English / Bengali",
    highlights: [
      "Understanding real estate markets",
      "Location and property analysis",
      "Basic property valuation",
      "Documentation fundamentals",
      "Investment planning",
      "Risk identification",
    ],
  },

  {
    slug: "property-investment-masterclass",
    title: "Property Investment Masterclass",
    category: "Real Estate",
    duration: "10 weeks",
    level: "Intermediate",
    description:
      "Develop a practical framework for evaluating property opportunities, rental potential, investment risk and long-term value.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    price: 8999,
    instructor: "Divyajyoti Property Mentor",
    format: "Mentor-led programme",
    lessons: 20,
    language: "English / Bengali",
    highlights: [
      "Property opportunity analysis",
      "Rental yield fundamentals",
      "Investment calculations",
      "Location comparison",
      "Due-diligence checklist",
      "Real-world property case studies",
    ],
  },
];

export const articles: Article[] = [
  {
    slug: "buying-a-home-with-clarity",
    title: "Buying a home with clarity: the questions that matter",
    category: "Property",
    date: "12 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
    excerpt:
      "A practical framework for comparing location, livability, documentation and long-term value.",
    content: `Buying a home is an important decision, and asking the right questions can make the process much clearer.

Start with the location. Think about how the property fits your everyday life, including access to transportation, schools, healthcare, shopping and other important services.

Next, understand the property itself. Look carefully at the layout, usable space, construction quality, amenities and maintenance requirements.

Documentation is another important part of the process. Before making a commitment, review the relevant property documents carefully and seek professional assistance where required.

It is also useful to think beyond the immediate purchase. Consider how the property fits your longer-term plans, lifestyle and financial goals.

A good property decision is not only about finding an attractive home. It is about understanding the complete picture before taking the next step.`,
  },

  {
    slug: "how-to-build-a-learning-system",
    title: "How to build a learning system that actually lasts",
    category: "Learning",
    date: "05 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",
    excerpt:
      "Move from collecting courses to creating a repeatable learning practice.",
    content: `Learning becomes more useful when it becomes a consistent practice rather than a collection of saved courses.

Start with one clear goal. Decide what you want to be able to do after completing your learning journey.

Break that goal into smaller topics and create a realistic schedule. Short and consistent learning sessions can be easier to maintain than occasional long sessions.

Practice is just as important as learning. Use exercises, projects and real-world examples to turn information into usable skills.

It is also important to review your progress regularly. Identify what you understand, what still feels difficult and what you should practise next.

A strong learning system does not need to be complicated. It needs to be consistent, practical and connected to a clear outcome.`,
  },

  {
    slug: "vastu-as-a-design-lens",
    title: "Vastu as a thoughtful design lens",
    category: "Astrology & Vastu",
    date: "28 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    excerpt:
      "A balanced look at how spatial traditions can be considered alongside practical design.",
    content: `Vastu can be considered as one perspective when thinking about how a home or workspace is arranged.

The conversation can begin with the orientation, layout and use of different spaces.

For example, a property can be reviewed by looking at its entrance, room placement, circulation and the way different areas are used.

The practical requirements of the people living or working in the space should remain part of the conversation as well.

Every property is different, so Vastu guidance should be considered in the context of the specific space rather than as a one-size-fits-all approach.

At Divyajyoti, the goal is to explain these considerations in simple language and help clients understand the available options.`,
  },
];
export type EducationCourse = {
  slug: string;
  title: string;
  category: "Astrology" | "Real Estate";
  level: string;
  duration: string;
  lessons: number;
  price: number;
  description: string;
  image: string;
};

export const educationCourses: EducationCourse[] = [
  // =========================
  // ASTROLOGY
  // =========================

  {
    slug: "astrology-foundation",
    title: "Astrology Foundation",
    category: "Astrology",
    level: "Beginner",
    duration: "12 weeks",
    lessons: 24,
    price: 4999,
    description:
      "Learn the basics of astrology, understand a birth chart and build a strong foundation.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
  },

  {
    slug: "practical-chart-reading",
    title: "Practical Chart Reading",
    category: "Astrology",
    level: "Intermediate",
    duration: "14 weeks",
    lessons: 28,
    price: 7499,
    description:
      "Move from theory to practical chart reading with guided examples and regular practice.",
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=85",
  },

  {
    slug: "predictive-astrology",
    title: "Predictive Astrology",
    category: "Astrology",
    level: "Advanced",
    duration: "16 weeks",
    lessons: 32,
    price: 9999,
    description:
      "Develop a deeper understanding of timing and prediction through structured lessons and case studies.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
  },

  {
    slug: "vastu-basics",
    title: "Vastu Basics",
    category: "Astrology",
    level: "Specialised",
    duration: "8 weeks",
    lessons: 16,
    price: 5999,
    description:
      "Learn Vastu principles and understand how to apply them to your home or workspace.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },

  {
    slug: "applied-astrology",
    title: "Applied Astrology",
    category: "Astrology",
    level: "Practice",
    duration: "10 weeks",
    lessons: 20,
    price: 6999,
    description:
      "Learn through practical interpretation, case discussions and guided doubt-clearing sessions.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
  },

  // =========================
  // REAL ESTATE
  // =========================

  {
    slug: "real-estate-foundation",
    title: "Real Estate Foundation",
    category: "Real Estate",
    level: "Beginner",
    duration: "8 weeks",
    lessons: 16,
    price: 4999,
    description:
      "Understand the fundamentals of property buying, documentation, location and valuation.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
  },

  {
    slug: "property-investment",
    title: "Property Investment",
    category: "Real Estate",
    level: "Intermediate",
    duration: "10 weeks",
    lessons: 20,
    price: 6999,
    description:
      "Learn how to evaluate properties, compare opportunities and make informed investment decisions.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
  },

  {
    slug: "real-estate-investment",
    title: "Real Estate Investment Masterclass",
    category: "Real Estate",
    level: "Advanced",
    duration: "12 weeks",
    lessons: 24,
    price: 8999,
    description:
      "Explore advanced property investment strategies, returns, risks and long-term planning.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },

  {
    slug: "property-valuation",
    title: "Property Valuation",
    category: "Real Estate",
    level: "Practical",
    duration: "6 weeks",
    lessons: 12,
    price: 5999,
    description:
      "Understand property valuation, pricing factors, market comparison and investment potential.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  },

  {
    slug: "smart-property-buying",
    title: "Smart Property Buying",
    category: "Real Estate",
    level: "Specialised",
    duration: "7 weeks",
    lessons: 14,
    price: 6499,
    description:
      "Learn a practical framework for selecting, evaluating and purchasing the right property.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
];
