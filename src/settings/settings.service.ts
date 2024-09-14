import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Setting, Prisma } from '@prisma/client';
import { BannerSchema } from '@/http/setting/banner.schema';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library

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
}