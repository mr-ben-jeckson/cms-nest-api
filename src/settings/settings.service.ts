import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Setting, Prisma } from '@prisma/client';
import { BannerSchema } from '@/http/setting/banner.schema';

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) { }

    async getSettingByKey(key: string): Promise<Setting | null> {
        return this.prisma.setting.findUnique({
            where: { key },
        });
    }

    async addSettingBanner(data: BannerSchema): Promise<Setting> {
        return this.prisma.setting.create({
            data,
        });
    }
}