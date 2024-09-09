import { ResponseWrapper } from '@/ultils/app.wrapper';
import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Request } from 'express';
import { LoginSchema } from '@/http/user/login.schema';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: LoginSchema })
    @ApiResponse({ status: 200, description: 'Successful login' })
    async login(@Body() FormInput: LoginSchema) {
        return new ResponseWrapper(await this.authService.login(FormInput.email, FormInput.password), "Success Login", 200);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Successful logout' })
    async logout(@Req() req: Request) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            await this.authService.logout(token);
        }
        return new ResponseWrapper(null, "Success Logout", 200);
    }
}
