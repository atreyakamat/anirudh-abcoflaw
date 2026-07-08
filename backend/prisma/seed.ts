import { PrismaClient, UserRole, AppointmentStatus, BookingSource, PaymentMethod, PaymentStatus, BlogPostStatus, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================
  // 1. Create Admin User
  // ============================================
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lawpractice.local' },
    update: {},
    create: {
      email: 'admin@lawpractice.local',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ============================================
  // 2. Create Receptionist User
  // ============================================
  const receptionistPassword = await hashPassword('receptionist123');
  const receptionist = await prisma.user.upsert({
    where: { email: 'receptionist@lawpractice.local' },
    update: {},
    create: {
      email: 'receptionist@lawpractice.local',
      username: 'receptionist',
      password: receptionistPassword,
      firstName: 'Priya',
      lastName: 'Sharma',
      role: UserRole.RECEPTIONIST,
    },
  });
  console.log('✅ Receptionist user created:', receptionist.email);

  // ============================================
  // 3. Create Lawyer User
  // ============================================
  const lawyerPassword = await hashPassword('lawyer123');
  const lawyer = await prisma.user.upsert({
    where: { email: 'lawyer@lawpractice.local' },
    update: {},
    create: {
      email: 'lawyer@lawpractice.local',
      username: 'lawyer',
      password: lawyerPassword,
      firstName: 'Anirudh',
      lastName: 'Lawyer',
      role: UserRole.LAWYER,
    },
  });
  console.log('✅ Lawyer user created:', lawyer.email);

  // ============================================
  // 4. Create Sample Clients
  // ============================================
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { email: 'rahul.gupta@example.com' },
      update: {},
      create: {
        email: 'rahul.gupta@example.com',
        phone: '+91-9876543210',
        firstName: 'Rahul',
        lastName: 'Gupta',
        notes: 'Corporate law consultation - NDA review',
      },
    }),
    prisma.client.upsert({
      where: { email: 'meera.patel@example.com' },
      update: {},
      create: {
        email: 'meera.patel@example.com',
        phone: '+91-9876543211',
        firstName: 'Meera',
        lastName: 'Patel',
        notes: 'Property dispute - Residential property',
      },
    }),
    prisma.client.upsert({
      where: { email: 'arjun.singh@example.com' },
      update: {},
      create: {
        email: 'arjun.singh@example.com',
        phone: '+91-9876543212',
        firstName: 'Arjun',
        lastName: 'Singh',
        notes: 'Family law consultation',
      },
    }),
    prisma.client.upsert({
      where: { email: 'priyanka.reddy@example.com' },
      update: {},
      create: {
        email: 'priyanka.reddy@example.com',
        phone: '+91-9876543213',
        firstName: 'Priyanka',
        lastName: 'Reddy',
        notes: 'Employment contract review',
      },
    }),
    prisma.client.upsert({
      where: { email: 'vikram.malhotra@example.com' },
      update: {},
      create: {
        email: 'vikram.malhotra@example.com',
        phone: '+91-9876543214',
        firstName: 'Vikram',
        lastName: 'Malhotra',
        notes: 'Startup legal compliance',
      },
    }),
  ]);
  console.log(`✅ ${clients.length} clients created`);

  // ============================================
  // 5. Create Appointments
  // ============================================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        clientId: clients[0].id,
        bookedByUserId: receptionist.id,
        description: 'Corporate law consultation - NDA and contract review for tech startup',
        preferredDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        preferredTime: '10:00',
        status: AppointmentStatus.CONFIRMED,
        source: BookingSource.WEBSITE,
      },
    }),
    prisma.appointment.create({
      data: {
        clientId: clients[1].id,
        description: 'Property dispute consultation - Residential property boundary issue',
        preferredDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        preferredTime: '11:00',
        status: AppointmentStatus.PENDING_REVIEW,
        source: BookingSource.CHATBOT,
      },
    }),
    prisma.appointment.create({
      data: {
        clientId: clients[2].id,
        bookedByUserId: receptionist.id,
        description: 'Family law consultation - Custody and divorce proceedings',
        preferredDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        preferredTime: '14:00',
        status: AppointmentStatus.PENDING_LAWYER_CONFIRMATION,
        source: BookingSource.RECEPTIONIST,
      },
    }),
    prisma.appointment.create({
      data: {
        clientId: clients[3].id,
        description: 'Employment contract review and negotiation strategy',
        preferredDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        preferredTime: '10:30',
        status: AppointmentStatus.UPCOMING,
        source: BookingSource.WEBSITE,
      },
    }),
    prisma.appointment.create({
      data: {
        clientId: clients[4].id,
        description: 'Startup legal compliance - Company registration and compliance',
        preferredDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        preferredTime: '15:00',
        status: AppointmentStatus.COMPLETED,
        source: BookingSource.WEBSITE,
      },
    }),
  ]);
  console.log(`✅ ${appointments.length} appointments created`);

  // ============================================
  // 6. Create Appointment History
  // ============================================
  for (const appointment of appointments) {
    await prisma.appointmentHistory.create({
      data: {
        appointmentId: appointment.id,
        changedByUser: receptionist.id,
        previousStatus: null,
        newStatus: AppointmentStatus.PENDING_REVIEW,
        reason: 'Appointment created via booking form',
      },
    });
  }
  console.log('✅ Appointment history entries created');

  // ============================================
  // 7. Create Payments
  // ============================================
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        appointmentId: appointments[4].id,
        clientId: clients[4].id,
        amount: 2500.00,
        method: PaymentMethod.CASH,
        status: PaymentStatus.PAID,
        referenceNumber: 'CASH-001',
        paidAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.payment.create({
      data: {
        appointmentId: appointments[0].id,
        clientId: clients[0].id,
        amount: 1500.00,
        method: PaymentMethod.GPAY,
        status: PaymentStatus.PAID,
        referenceNumber: 'GPAY-TXN-001',
        paidAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);
  console.log(`✅ ${payments.length} payments created`);

  // ============================================
  // 8. Create Blog Categories
  // ============================================
  const categories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: 'corporate-law' },
      update: {},
      create: {
        name: 'Corporate Law',
        slug: 'corporate-law',
        description: 'Articles about corporate and business law',
        order: 1,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'family-law' },
      update: {},
      create: {
        name: 'Family Law',
        slug: 'family-law',
        description: 'Articles about family law and custody matters',
        order: 2,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'property-law' },
      update: {},
      create: {
        name: 'Property Law',
        slug: 'property-law',
        description: 'Articles about property and real estate law',
        order: 3,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'legal-tips' },
      update: {},
      create: {
        name: 'Legal Tips',
        slug: 'legal-tips',
        description: 'General legal tips and advice',
        order: 4,
      },
    }),
  ]);
  console.log(`✅ ${categories.length} blog categories created`);

  // ============================================
  // 9. Create Blog Tags
  // ============================================
  const tags = await Promise.all([
    prisma.blogTag.upsert({ where: { slug: 'contracts' }, update: {}, create: { name: 'Contracts', slug: 'contracts' } }),
    prisma.blogTag.upsert({ where: { slug: 'compliance' }, update: {}, create: { name: 'Compliance', slug: 'compliance' } }),
    prisma.blogTag.upsert({ where: { slug: 'divorce' }, update: {}, create: { name: 'Divorce', slug: 'divorce' } }),
    prisma.blogTag.upsert({ where: { slug: 'custody' }, update: {}, create: { name: 'Custody', slug: 'custody' } }),
    prisma.blogTag.upsert({ where: { slug: 'property' }, update: {}, create: { name: 'Property', slug: 'property' } }),
    prisma.blogTag.upsert({ where: { slug: 'legal-rights' }, update: {}, create: { name: 'Legal Rights', slug: 'legal-rights' } }),
  ]);
  console.log(`✅ ${tags.length} blog tags created`);

  // ============================================
  // 10. Create Blog Posts
  // ============================================
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        authorId: lawyer.id,
        categoryId: categories[0].id,
        title: 'Understanding NDAs: A Complete Guide for Businesses',
        slug: 'understanding-ndas-complete-guide',
        excerpt: 'Non-Disclosure Agreements are essential for protecting your business secrets. Learn everything you need to know about NDAs.',
        content: `## What is an NDA?

A Non-Disclosure Agreement (NDA) is a legal contract that creates a confidential relationship between parties.

## Key Elements of an NDA

1. **Definition of Confidential Information** - Clearly define what information is protected
2. **Obligations of the Receiving Party** - What they can and cannot do
3. **Duration** - How long the NDA remains in effect
4. **Remedies** - What happens if there's a breach

## Types of NDAs

- **Unilateral NDA** - One party discloses information
- **Mutual NDA** - Both parties share confidential information
- **Multilateral NDA** - Three or more parties involved

## When to Use an NDA

- Before sharing business plans with potential investors
- When hiring new employees
- During merger/acquisition discussions
- When working with contractors or vendors

## Contact Us

Need help drafting an NDA? Contact our office for a consultation.`,
        featuredImage: '/images/blog/nda-guide.jpg',
        seoTitle: 'NDA Guide for Businesses - Legal Advice',
        seoDescription: 'Complete guide to Non-Disclosure Agreements for businesses. Learn about types, key elements, and when to use NDAs.',
        status: BlogPostStatus.PUBLISHED,
        publishedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        viewCount: 245,
        tags: {
          create: [
            { tagId: tags[0].id },
            { tagId: tags[1].id },
          ],
        },
      },
    }),
    prisma.blogPost.create({
      data: {
        authorId: lawyer.id,
        categoryId: categories[1].id,
        title: 'Child Custody Laws in India: What Parents Need to Know',
        slug: 'child-custody-laws-india',
        excerpt: 'Understanding child custody laws is crucial for parents going through separation or divorce.',
        content: `## Child Custody in India

Child custody matters are governed by the Hindu Minority and Guardianship Act, 1956 and the Guardians and Wards Act, 1890.

## Types of Custody

1. **Physical Custody** - Where the child lives
2. **Legal Custody** - Decision-making authority
3. **Joint Custody** - Both parents share responsibilities
4. **Sole Custody** - One parent has full custody

## Best Interest of the Child

The court always considers the best interest of the child when making custody decisions.

## Factors Considered by Courts

- Child's age and preference
- Parent's ability to provide
- Stability of environment
- Child's relationship with each parent

## Contact Us

For custody consultation, schedule an appointment with our office.`,
        featuredImage: '/images/blog/custody-laws.jpg',
        seoTitle: 'Child Custody Laws India - Legal Guide',
        seoDescription: 'Comprehensive guide to child custody laws in India for parents.',
        status: BlogPostStatus.PUBLISHED,
        publishedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        viewCount: 189,
        tags: {
          create: [
            { tagId: tags[2].id },
            { tagId: tags[3].id },
          ],
        },
      },
    }),
    prisma.blogPost.create({
      data: {
        authorId: lawyer.id,
        categoryId: categories[2].id,
        title: 'Property Registration: Step-by-Step Guide',
        slug: 'property-registration-guide',
        excerpt: 'A comprehensive guide to property registration process in India.',
        content: `## Property Registration Process

Property registration is mandatory for all real estate transactions in India.

## Documents Required

1. Sale deed
2. Property tax receipts
3. Encumbrance certificate
4. Identity proof of buyer and seller
5. Passport size photographs

## Registration Process

1. Prepare the sale deed
2. Pay stamp duty and registration fees
3. Visit the Sub-Registrar office
4. Get the deed registered
5. Collect the registered deed

## Stamp Duty

Stamp duty varies by state. It typically ranges from 3% to 7% of the property value.

## Contact Us

Need help with property registration? Contact our office.`,
        featuredImage: '/images/blog/property-registration.jpg',
        seoTitle: 'Property Registration Guide India',
        seoDescription: 'Step-by-step guide to property registration in India.',
        status: BlogPostStatus.PUBLISHED,
        publishedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        viewCount: 180,
        tags: {
          create: [
            { tagId: tags[4].id },
          ],
        },
      },
    }),
    prisma.blogPost.create({
      data: {
        authorId: lawyer.id,
        categoryId: categories[3].id,
        title: 'Top 5 Legal Rights Every Indian Citizen Should Know',
        slug: 'top-5-legal-rights-indian-citizens',
        excerpt: 'Know your legal rights as an Indian citizen. These rights can protect you in various situations.',
        content: `## Your Legal Rights

Every Indian citizen has fundamental rights guaranteed by the Constitution.

## 1. Right to Equality (Article 14-18)

All citizens are equal before law regardless of religion, race, caste, sex, or place of birth.

## 2. Right to Freedom (Article 19-22)

Freedom of speech, expression, assembly, association, movement, and residence.

## 3. Right Against Exploitation (Article 23-24)

Prohibition of traffic in human beings and forced labor.

## 4. Right to Freedom of Religion (Article 25-28)

Freedom of conscience and free profession, practice, and propagation of religion.

## 5. Right to Constitutional Remedies (Article 32)

Right to move the Supreme Court for enforcement of fundamental rights.

## Contact Us

Need legal help understanding your rights? Schedule a consultation.`,
        featuredImage: '/images/blog/legal-rights.jpg',
        seoTitle: 'Legal Rights Indian Citizens',
        seoDescription: 'Know your fundamental legal rights as an Indian citizen.',
        status: BlogPostStatus.DRAFT,
        viewCount: 0,
      },
    }),
  ]);
  console.log(`✅ ${blogPosts.length} blog posts created`);

  // ============================================
  // 11. Create FAQ Categories
  // ============================================
  const faqCategories = await Promise.all([
    prisma.faqCategory.upsert({
      where: { id: 'general' },
      update: {},
      create: {
        id: 'general',
        name: 'General',
        description: 'General questions about our services',
        order: 1,
      },
    }),
    prisma.faqCategory.upsert({
      where: { id: 'appointments' },
      update: {},
      create: {
        id: 'appointments',
        name: 'Appointments',
        description: 'Questions about booking and managing appointments',
        order: 2,
      },
    }),
    prisma.faqCategory.upsert({
      where: { id: 'legal' },
      update: {},
      create: {
        id: 'legal',
        name: 'Legal Services',
        description: 'Questions about our legal services',
        order: 3,
      },
    }),
    prisma.faqCategory.upsert({
      where: { id: 'fees' },
      update: {},
      create: {
        id: 'fees',
        name: 'Fees & Payments',
        description: 'Questions about fees and payment options',
        order: 4,
      },
    }),
  ]);
  console.log(`✅ ${faqCategories.length} FAQ categories created`);

  // ============================================
  // 12. Create FAQs
  // ============================================
  const faqs = await Promise.all([
    prisma.faq.create({
      data: {
        categoryId: 'general',
        question: 'What areas of law do you practice?',
        answer: 'We specialize in Corporate Law, Family Law, Property Law, Employment Law, and General Legal Consultation. Our team has extensive experience across multiple legal domains.',
        order: 1,
        isVisible: true,
      },
    }),
    prisma.faq.create({
      data: {
        categoryId: 'general',
        question: 'How can I schedule a consultation?',
        answer: 'You can schedule a consultation through our website booking form, by calling our office, or by using the chatbot on our website. We will confirm your appointment within 24 hours.',
        order: 2,
        isVisible: true,
      },
    }),
    prisma.faq.create({
      data: {
        categoryId: 'appointments',
        question: 'What are your office hours?',
        answer: 'Our office is open Monday to Saturday, from 9:00 AM to 6:00 PM. We are closed on Sundays and public holidays. Emergency consultations may be available by appointment.',
        order: 1,
        isVisible: true,
      },
    }),
    prisma.faq.create({
      data: {
        categoryId: 'appointments',
        question: 'Can I reschedule or cancel my appointment?',
        answer: 'Yes, you can reschedule or cancel your appointment up to 24 hours before the scheduled time. Please contact our office or use the client portal to make changes.',
        order: 2,
        isVisible: true,
      },
    }),
    prisma.faq.create({
      data: {
        categoryId: 'legal',
        question: 'Do you offer free initial consultations?',
        answer: 'We offer a brief free phone consultation to understand your legal needs and determine if our services are a good fit. For detailed legal advice, a paid consultation is required.',
        order: 1,
        isVisible: true,
      },
    }),
    prisma.faq.create({
      data: {
        categoryId: 'fees',
        question: 'What are your consultation fees?',
        answer: 'Consultation fees vary based on the type of legal service required. Please contact our office for current pricing. We accept cash, Google Pay, and bank transfers.',
        order: 1,
        isVisible: true,
      },
    }),
    prisma.faq.create({
      data: {
        categoryId: 'fees',
        question: 'What payment methods do you accept?',
        answer: 'We accept Cash, Google Pay (GPay), and Bank Transfers. All payments are recorded and receipts are provided for your records.',
        order: 2,
        isVisible: true,
      },
    }),
  ]);
  console.log(`✅ ${faqs.length} FAQs created`);

  // ============================================
  // 13. Create Settings
  // ============================================
  const settings = await Promise.all([
    prisma.setting.upsert({
      where: { key: 'office_hours_start' },
      update: {},
      create: { key: 'office_hours_start', value: '09:00', category: 'office_hours', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'office_hours_end' },
      update: {},
      create: { key: 'office_hours_end', value: '18:00', category: 'office_hours', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'consultation_duration' },
      update: {},
      create: { key: 'consultation_duration', value: 30, category: 'appointment', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'slot_interval' },
      update: {},
      create: { key: 'slot_interval', value: 30, category: 'appointment', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'sunday_closed' },
      update: {},
      create: { key: 'sunday_closed', value: true, category: 'office_hours', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'reminder_before_hours' },
      update: {},
      create: { key: 'reminder_before_hours', value: 24, category: 'notifications', isPublic: false },
    }),
    prisma.setting.upsert({
      where: { key: 'lawyer_name' },
      update: {},
      create: { key: 'lawyer_name', value: 'Anirudh', category: 'branding', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'lawyer_title' },
      update: {},
      create: { key: 'lawyer_title', value: 'Attorney at Law', category: 'branding', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'lawyer_email' },
      update: {},
      create: { key: 'lawyer_email', value: 'contact@lawpractice.com', category: 'contact', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'lawyer_phone' },
      update: {},
      create: { key: 'lawyer_phone', value: '+91-9876543210', category: 'contact', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'lawyer_address' },
      update: {},
      create: { key: 'lawyer_address', value: '123 Legal Street, Suite 100, Mumbai, India', category: 'contact', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'social_facebook' },
      update: {},
      create: { key: 'social_facebook', value: 'https://facebook.com/lawpractice', category: 'social', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'social_twitter' },
      update: {},
      create: { key: 'social_twitter', value: 'https://twitter.com/lawpractice', category: 'social', isPublic: true },
    }),
    prisma.setting.upsert({
      where: { key: 'social_linkedin' },
      update: {},
      create: { key: 'social_linkedin', value: 'https://linkedin.com/company/lawpractice', category: 'social', isPublic: true },
    }),
  ]);
  console.log(`✅ ${settings.length} settings created`);

  // ============================================
  // 14. Create Notifications
  // ============================================
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: receptionist.id,
        type: NotificationType.APPOINTMENT_CREATED,
        title: 'New Appointment Request',
        message: 'New appointment request from Rahul Gupta for tomorrow at 10:00 AM',
        data: { appointmentId: appointments[1].id },
      },
    }),
    prisma.notification.create({
      data: {
        userId: receptionist.id,
        type: NotificationType.APPOINTMENT_CONFIRMED,
        title: 'Appointment Confirmed',
        message: 'Appointment with Rahul Gupta has been confirmed',
        data: { appointmentId: appointments[0].id },
      },
    }),
    prisma.notification.create({
      data: {
        userId: lawyer.id,
        type: NotificationType.PAYMENT_RECEIVED,
        title: 'Payment Received',
        message: 'Payment of ₹2,500 received from Vikram Malhotra',
        data: { paymentId: payments[0].id },
      },
    }),
  ]);
  console.log(`✅ ${notifications.length} notifications created`);

  // ============================================
  // 15. Create Availability Slots
  // ============================================
  const availabilitySlots = [];
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const slotDate = new Date(today.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dayOfWeek = slotDate.getDay();

    // Skip Sunday (0)
    if (dayOfWeek === 0) continue;

    // Create slots from 9 AM to 6 PM (30-min intervals)
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = minute + 30;
        const endHour = endMinute >= 60 ? hour + 1 : hour;
        const endTime = `${(endHour).toString().padStart(2, '0')}:${(endMinute % 60).toString().padStart(2, '0')}`;

        await prisma.availabilitySlot.create({
          data: {
            userId: lawyer.id,
            date: slotDate,
            startTime,
            endTime,
            isAvailable: true,
          },
        });
      }
    }
  }
  console.log('✅ Availability slots created');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin:       admin / admin123');
  console.log('   Receptionist: receptionist / receptionist123');
  console.log('   Lawyer:      lawyer / lawyer123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });