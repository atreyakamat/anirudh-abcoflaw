import { PrismaClient, Role } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const usersPath = path.join(__dirname, '..', 'test-users.json');
  if (!fs.existsSync(usersPath)) {
    console.error('test-users.json not found!');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(usersPath, 'utf-8');
  const emails = JSON.parse(fileContent);

  const roles = {
    admin: Role.ADMIN,
    receptionist: Role.RECEPTIONIST,
    lawyer: Role.LAWYER,
  };

  for (const [key, email] of Object.entries(emails)) {
    if (!email || email === '' || email.includes('example.com')) {
      console.log(`Skipping placeholder for ${key}: ${email}`);
      continue;
    }

    const role = roles[key as keyof typeof roles];
    if (!role) continue;

    const existingUser = await prisma.user.findUnique({ where: { email: email as string } });
    if (existingUser) {
      await prisma.user.update({
        where: { email: email as string },
        data: { role, isActive: true }
      });
      console.log(`Updated existing user ${email} to role ${role}`);
    } else {
      await prisma.user.create({
        data: {
          email: email as string,
          password: 'google-auth-placeholder',
          firstName: key.charAt(0).toUpperCase() + key.slice(1),
          lastName: 'User',
          role,
          isActive: true
        }
      });
      console.log(`Created new user ${email} with role ${role}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
