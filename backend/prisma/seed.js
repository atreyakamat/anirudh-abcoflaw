import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database tables...');
  
  // Clear tables in reverse dependency order to respect foreign key constraints
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.chatbotMessage.deleteMany();
  await prisma.chatbotSession.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.appointmentNote.deleteMany();
  await prisma.appointmentHistory.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.client.deleteMany();
  await prisma.clientPortalUser.deleteMany();
  await prisma.blogPostTag.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogTag.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.faqCategory.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding baseline system users...');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@abcoflaw.com',
      username: 'admin',
      password: 'password_hash_here',
      firstName: 'Practice',
      lastName: 'Admin',
      role: 'ADMIN', // Upper case Enum match
      isActive: true,
    },
  });

  const receptionist = await prisma.user.create({
    data: {
      email: 'reception@abcoflaw.com',
      username: 'receptionist',
      password: 'password_hash_here',
      firstName: 'Staff',
      lastName: 'Receptionist',
      role: 'RECEPTIONIST',
      isActive: true,
    },
  });

  const lawyer = await prisma.user.create({
    data: {
      email: 'lawyer@abcoflaw.com',
      username: 'lawyer',
      password: 'password_hash_here',
      firstName: 'Lead',
      lastName: 'Lawyer',
      role: 'LAWYER',
      isActive: true,
    },
  });

  console.log('Seeding FAQ structures...');

  const faqCategory = await prisma.faqCategory.create({
    data: {
      name: 'Booking & Documents',
      description: 'Frequently asked questions regarding client onboarding workflows.',
      order: 1,
    },
  });

  await prisma.faq.createMany({
    data: [
      {
        categoryId: faqCategory.id,
        question: 'How do I book a consultation?',
        answer: 'Use the consultation form or chatbot to submit an inquiry for manual review.',
        order: 1,
        isVisible: true,
      },
      {
        categoryId: faqCategory.id,
        question: 'Can I upload documents securely?',
        answer: 'Yes, the client portal accepts PDF, DOCX, JPG, and PNG files.',
        order: 2,
        isVisible: true,
      },
    ],
  });

  console.log('Seeding Client profiles and active appointments...');

  const client = await prisma.client.create({
    data: {
      firstName: 'Aman',
      lastName: 'Verma',
      phone: '9999999999',
      email: 'aman.verma@example.com',
      notes: 'Seed client for portal verification and dashboard review.',
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      clientId: client.id,
      bookedByUserId: receptionist.id,
      description: 'Initial consultation regarding business compliance structures.',
      preferredDate: new Date('2026-07-25T00:00:00.000Z'),
      preferredTime: '11:00',
      status: 'CONFIRMED',
      source: 'WEBSITE',
    },
  });

  await prisma.payment.create({
    data: {
      appointmentId: appointment.id,
      clientId: client.id,
      amount: 2500.00,
      method: 'GPAY',
      status: 'PAID',
      referenceNumber: 'SEED-GPAY-001',
      paidAt: new Date(),
      notes: 'Initial consulting intake fee.',
    },
  });

  console.log('Seeding content items...');

  const blogCategory = await prisma.blogCategory.create({
    data: {
      name: 'Consultations',
      slug: 'consultations',
      description: 'Consultation workflow and practice guidance.',
      order: 1,
    },
  });

  await prisma.blogPost.create({
    data: {
      authorId: lawyer.id,
      categoryId: blogCategory.id,
      title: 'How to prepare for your first consultation',
      slug: 'prepare-for-your-first-consultation',
      excerpt: 'A short guide to organizing documents before your intake call.',
      content: 'Prepare documents, write a concise timeline, and identify your core metrics.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('Populating configuration settings...');

  await prisma.setting.createMany({
    data: [
      { key: 'office-hours', value: { start: '09:00', end: '18:00', sundayClosed: true }, category: 'general', isPublic: true },
      { key: 'consultation-duration', value: { minutes: 30 }, category: 'general', isPublic: false },
    ],
  });

  console.log('🚀 Database seeding operations completed successfully.');
}

main()
  .catch((error) => {
    console.error('❌ Error executing database seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
