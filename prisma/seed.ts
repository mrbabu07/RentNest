import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const databaseUrl = new URL(connectionString);

if (databaseUrl.searchParams.get('sslmode') === 'require') {
  databaseUrl.searchParams.set('sslmode', 'verify-full');
}

const adapter = new PrismaPg({ connectionString: databaseUrl.toString() });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const categoryNames = [
    'Apartment',
    'House',
    'Studio',
    'Duplex',
    'Room / Sublet',
    'Commercial Space',
  ];

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`${categoryNames.length} categories ready`);

  const adminEmail = 'admin@rentnest.com';
  const adminPassword = 'Admin@123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: 'RentNest Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    console.log(`Admin created -> email: ${adminEmail} | password: ${adminPassword}`);
  } else {
    console.log('Admin already exists, skipping creation');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
