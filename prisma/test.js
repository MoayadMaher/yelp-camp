//import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: "query" })

prisma.user.create({ data: { name: 'mmmj' } });

async function main() {
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
}

main()
    .catch(e => {
        console.error(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


