import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.appointmentHistory.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.calendarBlock.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      displayName: 'Practice Admin',
      role: 'admin',
      passwordHint: 'admin123',
      active: true,
    },
  });

  const receptionist = await prisma.user.create({
    data: {
      username: 'receptionist',
      displayName: 'Receptionist',
      role: 'receptionist',
      passwordHint: 'admin123',
      active: true,
    },
  });

  const lawyer = await prisma.user.create({
    data: {
      username: 'lawyer',
      displayName: 'Lead Lawyer',
      role: 'lawyer',
      passwordHint: 'admin123',
      active: true,
    },
  });

  const category = await prisma.blogCategory.create({
    data: {
      name: 'Consultations',
      slug: 'consultations',
      description: 'Consultation workflow and practice guidance',
      order: 1,
    },
  });

  await prisma.fAQ.createMany({
    data: [
      {
        category: 'Booking',
        question: 'How do I book a consultation?',
        answer: 'Use the consultation form or chatbot to submit an inquiry for manual review.',
        sortOrder: 1,
        visible: true,
      },
      {
        category: 'Documents',
        question: 'Can I upload documents?',
        answer: 'Yes, the booking flow accepts PDF, DOCX, JPG, and PNG files up to 10 MB.',
        sortOrder: 2,
        visible: true,
      },
    ],
  });

  await prisma.client.create({
    data: {
      fullName: 'Aman Verma',
      phone: '9999999999',
      email: 'aman.verma@example.com',
      notes: 'Seed client for portal verification and dashboard review.',
      source: 'website',
      appointments: {
        create: {
          createdById: receptionist.id,
          bookingSource: 'website',
          preferredDate: new Date('2026-07-15T00:00:00.000Z'),
          preferredTime: '11:00',
          scheduledAt: new Date('2026-07-15T05:30:00.000Z'),
          durationMinutes: 30,
          status: 'confirmed',
          notes: 'Seeded consultation',
          paymentStatus: 'paid',
          consultationFee: '2500.00',
          bookedBy: 'Reception team',
        },
      },
      payments: {
        create: {
          amount: '2500.00',
          method: 'gpay',
          referenceNumber: 'SEED-GPAY-001',
          status: 'paid',
          paidAt: new Date('2026-07-14T10:30:00.000Z'),
          notes: 'Initial consultation fee',
        },
      },
      documents: {
        create: {
          fileName: 'seed-id-proof.pdf',
          originalName: 'id-proof.pdf',
          mimeType: 'application/pdf',
          fileSize: 120000,
          storagePath: 'seed/seed-id-proof.pdf',
          uploadedById: receptionist.id,
        },
      },
    },
  });

  await prisma.blog.create({
    data: {
      title: 'How to prepare for your first consultation',
      slug: 'prepare-for-your-first-consultation',
      excerpt: 'A short guide to organizing documents and expectations before your intake call.',
      content: 'Prepare documents, write a concise timeline, and identify the outcome you want from the consultation.',
      seoTitle: 'Prepare for your first consultation',
      metaDescription: 'Checklist for new legal consultation clients.',
      featuredImageUrl: null,
      tags: ['consultation', 'intake'],
      visibility: 'published',
      publishedAt: new Date('2026-07-01T00:00:00.000Z'),
      authorId: lawyer.id,
      categoryId: category.id,
    },
  });

  await prisma.setting.createMany({
    data: [
      { key: 'office-hours', value: { start: '09:00', end: '18:00', sundayClosed: true }, updatedById: admin.id },
      { key: 'consultation-duration', value: { minutes: 30 }, updatedById: admin.id },
      { key: 'contact-details', value: { phone: '+91 99999 99999', email: 'office@example.com' }, updatedById: admin.id },
    ],
  });

  await prisma.calendarBlock.create({
    data: {
      date: new Date('2026-07-20T00:00:00.000Z'),
      startTime: '13:00',
      endTime: '15:00',
      reason: 'Court appearance',
    },
  });

  await prisma.notification.create({
    data: {
      userId: receptionist.id,
      channel: 'in_app',
      title: 'Seed data ready',
      body: 'The seeded practice dataset has been created successfully.',
      status: 'unread',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'seed.create',
      entity: 'bootstrap',
      entityId: 'seed',
      metadata: { note: 'Initial local seed data created' },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });