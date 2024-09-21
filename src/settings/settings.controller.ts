import { MediaService } from './../media/media.service';
import { SettingsService } from './settings.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { AdminGuard } from '@/auth/jwt.adminguard';
import { JwtAuthGuard } from '@/auth/jwt.authguard';
import { BannerSchema } from '@/http/setting/banner.schema';
import { GetUserId } from '@/ultils/app.user.decorator';
import { ResponseWrapper } from '@/ultils/app.wrapper';
import { Response } from 'express';

@ApiTags('settings') // Group endpoints under the "posts" tag
@Controller('settings')
@ApiBearerAuth()
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly mediaService: MediaService
    ) { }

    @Post('/admin/banners')
    @UseGuards(JwtAuthGuard)
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Adding a banner of landing pages' })
    @ApiResponse({ status: 201, description: 'Added new banner' })
    @ApiBody({ type: BannerSchema })
    async addBannerByAdmin(@Body() Setting: BannerSchema, @GetUserId() userId: string, @Res() res: Response) {
        // banner not allowed more
        if(!await this.settingsService.bannerAllowed()) {
            throw new HttpException(
                new ResponseWrapper(null, "Banner not allowed more", HttpStatus.BAD_REQUEST).toResponse(),
                HttpStatus.BAD_REQUEST
            );
        }
        // banner
        if(Setting.name != 'banner:slider') {
            throw new HttpException(
                new ResponseWrapper(null, "Name must be banner:slider", HttpStatus.BAD_REQUEST).toResponse(),
                HttpStatus.BAD_REQUEST
            );
        }
        // format for database
        Setting.name = "banner:slider"
        // String Json Check
        try {
            const settingObj = JSON.parse(Setting.value);
            // mediaId
            if(!settingObj.mediaId) {
                throw new HttpException(
                    new ResponseWrapper(null, "MediaId is required", HttpStatus.BAD_REQUEST).toResponse(),
                    HttpStatus.BAD_REQUEST
                );
            }
            // mediaId valid
            const checkId = await this.mediaService.getMediaById(settingObj.mediaId, null);
            if(!checkId) {
                throw new HttpException(
                    new ResponseWrapper(null, "MediaId is invalid", HttpStatus.BAD_REQUEST).toResponse(),
                    HttpStatus.BAD_REQUEST
                );
            } else {
                settingObj.imageUrl = checkId.url;
            }
            // header valid
            if(!settingObj.header) {
                settingObj.header = '';
            }
            // intro valid
            if(!settingObj.intro) {
                settingObj.intro = '';
            }
            // button valid
            if(settingObj.button) {
                settingObj.button = true;
            } else {
                settingObj.button = false;
            }
            // button exist
            if(settingObj.button && !settingObj.buttonName) {
                throw new HttpException(
                    new ResponseWrapper(null, "Button name is required", HttpStatus.BAD_REQUEST).toResponse(),
                    HttpStatus.BAD_REQUEST
                );
            }
            // button link exist
            if(settingObj.button && !settingObj.buttonLink) {
                throw new HttpException(
                    new ResponseWrapper(null, "Button link is required", HttpStatus.BAD_REQUEST).toResponse(),
                    HttpStatus.BAD_REQUEST
                );
            }
            // created By
            if(!settingObj.createdBy) {
                settingObj.createdBy = userId;
            }
            // created At
            if(!settingObj.createdAt) {
                settingObj.createdAt = new Date();
            }
            // active
            if(settingObj.active) {
                settingObj.active = true;
            } else {
                settingObj.active = false;
            }
            const {
                mediaId,
                imageUrl,
                header,
                intro,
                button,
                buttonName,
                buttonLink,
                createdBy,
                createdAt,
                active
            } = settingObj;
            Setting.value = JSON.stringify({
                mediaId,
                imageUrl,
                header,
                intro,
                button,
                buttonName,
                buttonLink,
                createdBy,
                createdAt,
                active
            });

        } catch (error: any) {
            throw new HttpException(
                new ResponseWrapper(null, error.message, HttpStatus.BAD_REQUEST).toResponse(),
                HttpStatus.BAD_REQUEST
            );
        }
        const resource = new ResponseWrapper(await this.settingsService.addSettingBanner(Setting), "Created Banner", 201);
        return res.status(resource.statusCode).json(resource.toResponse());
    }

    @Put('/admin/banners/:id')
    @UseGuards(JwtAuthGuard)
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Updating landing page banner' })
    @ApiResponse({ status: 200, description: 'Updated Successful' })
    @ApiParam({ name: 'id', type: String, required: true, description: 'Banner ID' })
    @ApiBody({ type: BannerSchema })
    async updateBannerByAdmin(@Param('id') id: string, @Body() Setting: BannerSchema, @GetUserId() userId: string, @Res() res: Response) {
        // banner not allowed more
        if (!await this.settingsService.bannerAllowed()) {
            throw new HttpException(
                new ResponseWrapper(null, "Banner not allowed more", HttpStatus.BAD_REQUEST).toResponse(),
                HttpStatus.BAD_REQUEST
            );
        }
        // banner
        if (Setting.name != 'banner:slider') {
            throw new HttpException(
                new ResponseWrapper(null, "Name must be banner:slider", HttpStatus.BAD_REQUEST).toResponse(),
                HttpStatus.BAD_REQUEST
            );
        }
        // format for database
        Setting.name = "banner:slider"
        // String Json Check
        try {
            const settingObj = JSON.parse(Setting.value);
            // mediaId
            if (!settingObj.mediaId) {
                throw new HttpException(
                    new ResponseWrapper(null, "MediaId is required", HttpStatus.BAD_REQUEST).toResponse(),
                    HttpStatus.BAD_REQUEST
                );
            }
            // mediaId valid
            const checkId = await this.mediaService.getMediaById(settingObj.mediaId, null);
            if (!checkId) {
                throw new HttpException(
                    new ResponseWrapper(null, "MediaId is invalid", HttpStatus.BAD_REQUEST).toResponse(),
                    HttpStatus.BAD_REQUEST
                );
            } else {
                settingObj.imageUrl = checkId.url;
            }
            // header valid
            if (!settingObj.header) {
                settingObj.header = '';
            }
            // intro valid
            if (!settingObj.intro) {
                settingObj.intro = '';
            }
            // button valid
            if (settingObj.button) {
                settingObj.button = true;
            } else {
                settingObj.button = false;
            }
            // button exist
            if (settingObj.button && !settingObj.buttonName) {
                throw new HttpException(
                    new ResponseWrapper(null, "Button name is required", HttpStatus.BAD_REQUEST).toResponse(),
                    HttpStatus.BAD_REQUEST
                );
            }
            // button link exist
            if (settingObj.button && !settingObj.buttonLink) {
                throw new HttpException(
                    new ResponseWrapper(null, "Button link is required", HttpStatus.BAD_REQUEST).toResponse(),
                    HttpStatus.BAD_REQUEST
                );
            }
            // created By
            if (!settingObj.createdBy) {
                settingObj.createdBy = userId;
            }
            // created At
            if (!settingObj.createdAt) {
                settingObj.createdAt = new Date();
            }
            // active
            if (settingObj.active) {
                settingObj.active = true;
            } else {
                settingObj.active = false;
            }
            const {
                mediaId,
                imageUrl,
                header,
                intro,
                button,
                buttonName,
                buttonLink,
                createdBy,
                createdAt,
                active
            } = settingObj;
            Setting.value = JSON.stringify({
                mediaId,
                imageUrl,
                header,
                intro,
                button,
                buttonName,
                buttonLink,
                createdBy,
                createdAt,
                active
            });

        } catch (error: any) {
            throw new HttpException(
                new ResponseWrapper(null, error.message, HttpStatus.BAD_REQUEST).toResponse(),
                HttpStatus.BAD_REQUEST
            );
        }
        const resource = new ResponseWrapper(await this.settingsService.updateSettingBanner(Setting, id), "Updated Banner Successfully", 200);
        return res.status(resource.statusCode).json(resource.toResponse());
    }

    @Get('/admin/meta-default')
    @UseGuards(JwtAuthGuard)
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Get All Default Meta by Admin' })
    @ApiResponse({ status: 200, description: 'Get All Default Meta by Admin' })
    async getDefaultMetaTagsByAdmin(@Res() res: Response) {
        const resource = new ResponseWrapper(await this.settingsService.getDefaultMetaTagsByAdmin(), "Get All Default Meta by Admin", 200);
        return res.status(resource.statusCode).json(resource.toResponse());
    }

    @Get('/banners')
    @ApiOperation({ summary: 'Get active banners' })
    @ApiResponse({ status: 200, description: 'Return active banners' })
    async getActiveBanners(@Res() res: Response) {
        const resource = new ResponseWrapper(await this.settingsService.getActiveBanners(), "Get Active Banners", 200);
        return res.status(resource.statusCode).json(resource.toResponse());
    }

    @Get('/meta-default')
    @ApiOperation({ summary: 'Get Default Meta'})
    @ApiResponse({ status: 200, description: 'Return default meat'})
    async getDefaultMetaTag(@Res() res: Response) {
        const resource = new ResponseWrapper(await this.settingsService.getDefaultMetaTags(), "Get Default Meta", 200);
        return res.status(resource.statusCode).json(resource.toResponse());
    }
}