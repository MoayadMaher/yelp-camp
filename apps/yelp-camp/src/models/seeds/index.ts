import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

import cities from './cities';
import { places, descriptors } from './seedHelpers';

// import dotenv from 'dotenv';
// dotenv.config();

const sample = (array: string[]): string => array[Math.floor(Math.random() * array.length)];

export async function seedDB() {
    const prisma = new PrismaClient();
    try {
        await prisma.campground.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const random1000: number = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 20) + 10;
            const camp = await prisma.campground.create({
                data: {
                    location: `${cities[random1000].city}, ${cities[random1000].state}`,
                    title: `${sample(descriptors)} ${sample(places)}`,
                    image: 'https://source.unsplash.com/collection/483251',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere possimus ullam doloribus illum odit illo obcaecati dignissimos repellendus inventore beatae cum nobis, commodi assumenda, eum porro vel ex eos tempore.',
                    price: price,
                    authorId: "da5f8793-6db4-4734-9ad6-1beac41c4a5e"
                }
            });
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}
