const { PrismaClient } = require('@prisma/client');
const cities = require('./cities.js');
const { places, descriptors } = require('./seedHelpers.js');

const prisma = new PrismaClient();

const sample = (array) =>
  array[Math.floor(Math.random() * array.length)];

async function seedDB() {
  try {
    // await prisma.campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
      const random1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;
      const camp = await prisma.campground.create({
        data: {
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere possimus ullam doloribus illum odit illo obcaecati dignissimos repellendus inventore beatae cum nobis, commodi assumenda, eum porro vel ex eos tempore.',
          price: price,
          authorId: 'da5f8793-6db4-4734-9ad6-1beac41c4a5e',
          images: {
            create: [
              {
                url: 'https://res.cloudinary.com/dynw0r4v0/image/upload/f_auto,q_auto/v1/YelpCamp/s5ssru4ruk4iwnmjei5y',
                filename: 'demo1',
              },
              {
                url: 'https://res.cloudinary.com/dynw0r4v0/image/upload/f_auto,q_auto/v1/YelpCamp/xly7k1xr9uzmkf6umf7p',
                filename: 'demo2',
              },
            ],
          },
        },
      });
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedDB();
