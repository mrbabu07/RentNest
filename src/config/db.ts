import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const databaseUrl = new URL(connectionString);

// pg currently treats "require" as "verify-full"; make that behavior explicit.
if (databaseUrl.searchParams.get('sslmode') === 'require') {
    databaseUrl.searchParams.set('sslmode', 'verify-full');
}

const adapter = new PrismaPg({ connectionString: databaseUrl.toString() });
const prisma = new PrismaClient({ adapter });

export default prisma;
