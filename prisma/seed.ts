import { Media, PrismaClient, Setting } from '@prisma/client';
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

    console.log('Admin seeded:', user);

    const passwordHashUser = await bcrypt.hash('user123', 10);
    const user2 = await prisma.user.create({
        data: {
            id: uuidv4(),  // Replace with a UUID if necessary
            email: 'user@gmail.com',
            name: 'User',
            password: passwordHashUser,
            isAdmin: false,
        },
    });
    console.log('User seeded:', user2);

    const privateSetting: {} = {
        SystemSetting: {
            autoEmail: false,
            verificationEmail: false,
            dateFormat: "D m Y",
            limitedBanner: 2,
            limitedFaq: 10
        }
    }
    const setting = await prisma.setting.create({
        data: {
            key: "1c10cde7-6111-46e7-980c-12fe136fdcb", // avoid to seed more rows
            name: 'private:setting',
            value: JSON.stringify(privateSetting),
        },
    });
    console.log('Private Setting seeded:', setting);

    const publicSetting: {} = {
        LandingPageSetting: {
            slider: true,
            cta: false,
            faqs: true,
            testimonials: false,
            toLogin: false,
            toRegister: false,
            googleIframe: true,
            socialLinks: false,
            searchForm: true
        },
        ModuleSetting: {
            menuDynamic: false,
            authentication: true,
            posts: true,
            topNav: false,
            footer: true
        }
    };
    const setting2 = await prisma.setting.create({
        data: {
            key: "1cc9cdb7-6111-46e7-980c-12fe136fdcb", // avoid to seed more rows
            name: 'public:setting',
            value: JSON.stringify(publicSetting),
        },
    });
    console.log('Public Setting seeded:', setting2);

    const mediaArray: Media[] = [];
    const mediaData1: Media = {
        id: "eb998a42-03b7-4334-92e4-b8858c5612a8", // avoid to seed more rows
        url: "https://plancy-asia.s3.ap-southeast-1.amazonaws.com/cms-api/d7a4c7ba-9ceb-4798-87f5-d3ba39eb42ab.jpeg",
        storage: "S3",
        mimeType: "image/jpeg",
        size: 1590509,
        extension: "jpeg",
        filename: "pexels-eberhardgross-28219391.jpg",
        originalName: "d7a4c7ba-9ceb-4798-87f5-d3ba39eb42ab.jpeg",
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        userId: user.id,
    };
    const mediaData2: Media = {
        id: "90b83fb5-32fb-4ecf-8ffb-2752a1b77d8b",
        url: "https://plancy-asia.s3.ap-southeast-1.amazonaws.com/cms-api/9a3be2b5-4c92-46f7-852f-1998daea035f.jpeg",
        storage: "S3",
        mimeType: "image/jpeg",
        size: 2093811,
        extension: "jpeg",
        filename: "pexels-kammeran-gonzalez-keola-3137381-28348904.jpg",
        originalName: "9a3be2b5-4c92-46f7-852f-1998daea035f.jpeg",
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        userId: user.id,
    };
    mediaArray.push(mediaData1, mediaData2);
    const media = await prisma.media.createMany({
        data: mediaArray,
    });
    console.log('2 Media seeded:', media);

    const slider = await prisma.setting.createMany({
        data: {
            name: "banner:slider",
            key: uuidv4(),
            value: JSON.stringify({
                mediaId: "eb998a42-03b7-4334-92e4-b8858c5612a8",
                imageUrl: "https://plancy-asia.s3.ap-southeast-1.amazonaws.com/cms-api/d7a4c7ba-9ceb-4798-87f5-d3ba39eb42ab.jpeg",
                header: "Welcome to Astro CMS",
                intro: "NestJS server and Astro Client, Vue 3 in Island Updated",
                button: true,
                buttonName: "Expore",
                buttonLink: "#",
                active: true,
                createdBy: user.id,
                createdAt: new Date()
            })
        },
    });
    console.log('Slider seeded:', slider);

    const slider2 = await prisma.setting.createMany({
        data: {
            name: "banner:slider",
            key: uuidv4(),
            value: JSON.stringify({
                mediaId: "90b83fb5-32fb-4ecf-8ffb-2752a1b77d8b",
                imageUrl: "https://plancy-asia.s3.ap-southeast-1.amazonaws.com/cms-api/9a3be2b5-4c92-46f7-852f-1998daea035f.jpeg",
                header: "Hello Helda",
                intro: "This is Introduction",
                button: true,
                buttonName: "View More",
                buttonLink: "#",
                createdBy: user.id,
                createdAt: new Date(),
                active: true
            })
        },
    });
    console.log('Slider 2 seeded:', slider2);

    const metaData = [
        {
            name: "description",
            content: "A concise, relevant description of your page, containing important keywords. Aim for around 150-160 characters."
        },
        {
            name: "robots",
            content: "index, follow"
        },
        {
            name: "authour",
            content: "Astro Client"
        },
        {
            property: "og:title",
            content: "Your Page Title"
        },
        {
            property: "og:description",
            content: "Brief description of your page for social sharing."
        },
        {
            property: "og:image",
            content: "https://www.example.com/image.jpg"
        },
        {
            property: "og:url",
            content: "https://www.example.com/page-url"
        },
        {
            name: "twitter:card",
            content: "summary_large_image"
        },
        {
            name: "twitter:title",
            content: "Your Page Title"
        },
        {
            name: "twitter:description",
            content: "Brief description for Twitter."
        },
        {
            name: "twitter:image",
            content: "https://www.example.com/image.jpg"
        }
    ];

    metaData.forEach(async (metaData) => {
        const meta = await prisma.setting.create({
            data: {
                name: "default:meta",
                key: uuidv4(),
                value: JSON.stringify(metaData)
            },
        });
        console.log('Meta Data seeded:', meta);
    });

}
  
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
