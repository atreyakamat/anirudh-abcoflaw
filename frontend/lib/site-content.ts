export const siteNavigation = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
] as const;

export const practiceAreas = [
  'Property disputes',
  'Family law consultations',
  'Criminal defense guidance',
  'Business and corporate advisory',
  'Consumer court matters',
  'Document review and strategy sessions',
] as const;

export const testimonials = [
  {
    name: 'Aman Verma',
    role: 'Business Owner',
    quote: 'The booking flow was clear, and the consultation call arrived exactly as promised.',
  },
  {
    name: 'Nisha Kapoor',
    role: 'Client',
    quote: 'Professional communication, organized follow-up, and a dashboard that keeps everything visible.',
  },
  {
    name: 'Rahul Jain',
    role: 'Family Matter Client',
    quote: 'I could share documents, choose a time, and get a proper review instead of endless back-and-forth.',
  },
] as const;

export const faqItems = [
  {
    question: 'Do you provide legal advice over chat?',
    answer: 'No. The chatbot only answers service and booking questions and guides clients into the consultation workflow.',
  },
  {
    question: 'What happens after I submit a booking request?',
    answer: 'The request is created as an inquiry in Pending Review status. The receptionist and lawyer review it before confirmation.',
  },
  {
    question: 'Can I upload documents?',
    answer: 'Yes. PDF, DOCX, JPG, and PNG files up to 10 MB are accepted at booking time.',
  },
] as const;

export const blogPosts = [
  {
    title: 'How to prepare for your first legal consultation',
    slug: 'prepare-for-first-legal-consultation',
    category: 'Consultations',
    excerpt: 'A practical checklist that helps clients arrive informed and saves time during intake.',
  },
  {
    title: 'Why structured documentation reduces dispute risk',
    slug: 'structured-documentation-dispute-risk',
    category: 'Practice Management',
    excerpt: 'How consistent record keeping improves both client trust and operational clarity.',
  },
  {
    title: 'What to expect from a consultation booking workflow',
    slug: 'consultation-booking-workflow',
    category: 'Process',
    excerpt: 'An overview of the intake process from inquiry to confirmation.',
  },
] as const;
