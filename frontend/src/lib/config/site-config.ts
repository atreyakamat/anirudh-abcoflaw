/**
 * Central site configuration for AB & Co. Legal
 * Single source of truth for firm NAP, advocate profile, practice areas, fee policies, and legal disclaimers.
 * Complies with Bar Council of India Rule 36 (BCI 1975).
 */

export const VERIFY_BEFORE_PUBLICATION = {
  centralGovtNotaryStatus: 'Appointed Central Government Notary (Govt. of India)',
  directPhone: '+91-9422445340',
  officeAddressDetail: 'Porvorim, North Goa (near Panaji), 403521',
};

export const SITE_CONFIG = {
  firmName: 'AB & Co. Legal',
  lawyerName: 'Mr. Anirudha Sinai Borkar',
  lawyerTitle: 'Advocate',
  formalNameWithTitle: 'Adv. Anirudha Sinai Borkar',
  founderTitle: 'Founder, AB & Co. Legal',
  location: 'Porvorim, North Goa (near Panaji)',
  primaryCity: 'Panaji',
  state: 'Goa',
  tagline: 'Legal Made Simple',
  
  credentials: {
    llb: 'Bachelor of Laws (LL.B., Salgaonkar College of Law, Goa, 2003)',
    llm: 'Master of Laws in International Business Law (LL.M., University of Aberdeen, UK, 2009)',
    experience: '20+ years of legal practice at the Goa Bar',
    courts: 'Goa District & Sessions Courts and the Bombay High Court (Panaji Bench)',
    languages: ['English', 'Konkani', 'Hindi', 'Portuguese'],
  },

  contact: {
    address: 'Porvorim, North Goa (near Panaji), Goa - 403521',
    email: 'info@abco.legal',
    phone: VERIFY_BEFORE_PUBLICATION.directPhone,
    officeHours: 'Mon–Fri: 10:00–17:00 IST (Meetings by prior appointment)',
  },

  consultation: {
    fee: '₹2,500',
    durationMinutes: 60,
    feeNotice: 'Initial administrative consultation — ₹2,500 / 60 minutes. Payment is required prior to appointment confirmation.',
    rescheduleNotice: 'Please provide at least 24 hours advance notice for cancellations or rescheduling.',
  },

  bciDisclaimer: {
    headerBanner: 'Website information is provided for general informational purposes and is intended to remain consistent with applicable professional standards governing advocates in India.',
    rule36Notice: 'In accordance with Rule 36 of the Bar Council of India Rules (1975), this website does not solicit legal work or advertise services. All content is strictly educational and administrative.',
    fullLegalDisclaimer: `The information contained on this website is provided for general informational purposes only and does not constitute legal advice or representation. Accessing or using this website, submitting an appointment request, or communicating with AB & Co. Legal through electronic forms does not create an advocate-client relationship. Legal outcomes depend on specific facts and applicable law. Users should seek formal legal advice appropriate to their specific circumstances before acting on any information on this site.`,
  },

  practiceAreas: [
    {
      slug: 'civil-criminal-litigation',
      title: 'Civil & Criminal Litigation',
      shortDesc: 'Representation in civil disputes, property litigation, contracts, and criminal proceedings before Goa trial courts and the Bombay High Court (Panaji Bench).',
      details: 'Handling civil suits, injunctions, summary suits, appeal proceedings, property ownership disputes, contractual claims, and defense in criminal proceedings under applicable Indian codes.',
      relevantDocs: ['Pleadings & court papers', 'Prior legal notices & replies', 'Imputed contracts or agreements', 'Government identity proofs'],
    },
    {
      slug: 'property-conveyancing',
      title: 'Property & Conveyancing',
      shortDesc: 'Real estate advisory, title verification, drafting sale agreements, leases, conveyancing, stamp duty guidance, and resolving property title disputes in Goa.',
      details: 'Due diligence for Goa land and built property, verification of Form I & XIV revenue records, survey plans, title deeds, drafting sale deeds, development agreements, and RERA compliance guidance.',
      relevantDocs: ['Title deeds & prior conveyances', 'Form I & XIV / Survey Plans', 'Mutation records & tax receipts', 'Draft agreements or notices'],
    },
    {
      slug: 'family-law-succession',
      title: 'Family Law & Succession (Goa Civil Code)',
      shortDesc: 'Inheritance, wills, probate, inventory proceedings, and family law under Goa’s unique Portuguese Civil Law framework.',
      details: 'Guidance on succession rights, drafting wills, inventory proceedings before judicial magistrates/civil courts, partition of estate, matrimonial matters, and family settlement deeds under Goa Civil Code principles.',
      relevantDocs: ['Death certificates of ancestors', 'Genealogy / Family trees', 'Wills or codicils', 'Title records of estate assets'],
    },
    {
      slug: 'business-commercial-advisory',
      title: 'Business & Commercial Advisory',
      shortDesc: 'Legal counsel for startups, local businesses, statutory compliance, corporate governance, commercial contracts, and dispute resolution.',
      details: 'Drafting shareholder agreements, commercial vendor contracts, non-disclosure agreements, partnership deeds, statutory compliance reviews, and pre-litigation commercial negotiation.',
      relevantDocs: ['Certificate of incorporation / Registration', 'Constitutive documents (MOA/AOA/Deed)', 'Existing commercial agreements', 'Correspondence regarding dispute'],
    },
    {
      slug: 'notary-ip-services',
      title: 'Notarial & IP Services',
      shortDesc: 'Central Government Notary services for official document attestation, and preliminary Intellectual Property guidance.',
      details: 'Official notarisation, affidavits, power of attorney attestations under Central Government Notary authorization, alongside preliminary trademark & copyright orientation (collaborating with specialist IP counsel for formal registrations).',
      relevantDocs: ['Original documents for attestation', 'Valid government photo ID', 'Draft affidavits or power of attorney'],
    },
  ],
};
