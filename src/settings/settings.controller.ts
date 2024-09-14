import { Setting } from '@prisma/client';
import { SettingsService } from './settings.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('settings') // Group endpoints under the "posts" tag
@Controller('settings')
@ApiBearerAuth()
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }
}