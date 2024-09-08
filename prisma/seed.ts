import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Seed a user
    const user = await prisma.user.create({
        data: {
            id: uuidv4(),  // Replace with a UUID if necessary
            email: 'admin@gmail.com',
            name: 'Admin User',
            password: passwordHash,
            isAdmin: true,
        },
    });

    console.log('User seeded:', user);
}
  
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
