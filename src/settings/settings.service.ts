import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Setting, Prisma } from '@prisma/client';
import { BannerSchema } from '@/http/setting/banner.schema';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library
import { FormattedBanner } from '@/interface/banner.response';
import { MetaFace } from '@/interface/meta.response';

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) { }

    async getSettingByKey(key: string): Promise<Setting | null> {
        return this.prisma.setting.findUnique({
            where: { key },
        });
    }

    async addSettingBanner(data: BannerSchema): Promise<Setting> {
        const bannerKey = uuidv4();
        return this.prisma.setting.create({
            data: {
                ...data,
                key: data?.key || bannerKey,
            }
        });
    }

    async getActiveBanners() : Promise<FormattedBanner[]> {
        const banners = await this.prisma.setting.findMany({
            where: {
                name: 'banner',
                value: {
                    contains: '"active":true',
                },
            }
        });
        const formattedBanners = banners.map(banner => {
            const parsedValue = JSON.parse(banner.value);
            return {
                id: banner.id,
                key: banner.key,
                mediaId: parsedValue.mediaId,
                url: parsedValue.imageUrl,
                header: parsedValue.header,
                intro: parsedValue.intro,
                button: parsedValue?.button,
                buttonName: parsedValue?.buttonName,
                buttonLink: parsedValue?.buttonLink,
            };
        });
        return formattedBanners;
    }

    async getDefaultMetaTags(): Promise<MetaFace[]> {
        const metaTags = await this.prisma.setting.findMany({
            where: {
                name: 'default:meta',
            }
        });
        const metaTagsArray = metaTags.map(tag => {
            return {
                name: tag.name,
                value: JSON.parse(tag.value),
            };
        });
        return metaTagsArray;
    }
}