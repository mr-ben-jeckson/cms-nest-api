import { ResponseWrapper } from '@/ultils/app.wrapper';
import { Controller, Post, Body, Req, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Request, Response } from 'express';
import { LoginSchema } from '@/http/user/login.schema';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterSchema } from '@/http/user/register.schema';
import { UserService } from '@/users/users.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: LoginSchema })
    @ApiResponse({ status: 200, description: 'Successful login' })
    async login(@Body() FormInput: LoginSchema, @Res() res: Response) {
        const resource = new ResponseWrapper(await this.authService.login(FormInput.email, FormInput.password), "Success Login", HttpStatus.OK);
        return res.status(resource.statusCode).json(resource.toResponse());
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Successful logout' })
    async logout(@Req() req: Request, @Res() res: Response) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            await this.authService.logout(token);
        }
        return res.status(204)
    }

    @Post('register')
    @ApiOperation({ summary: 'Register user' })
    @ApiBody({ type: RegisterSchema })
    @ApiResponse({ status: 200, description: 'Successful registration' })
    async register(@Body() FormInput: RegisterSchema, @Res() res: Response) {
        FormInput.isAdmin = false; // Only allow to create admin in user controller
        const isEmailExist = await this.userService.getUserByEmail(FormInput.email);
        if (isEmailExist) {
            throw new HttpException(
                new ResponseWrapper(null, "Email already exists", HttpStatus.BAD_REQUEST).toResponse(),
                HttpStatus.BAD_REQUEST
            );
        }
        const isPhoneExist = await this.userService.isPhoneUsed(FormInput.phone);
        if (isPhoneExist) {
            throw new HttpException(
                new ResponseWrapper(null, "Phone already exists", HttpStatus.BAD_REQUEST).toResponse(),
                HttpStatus.BAD_REQUEST
            );
        }
        const resource = new ResponseWrapper(await this.authService.register(FormInput), "Successful Registration", 201);
        return res.status(resource.statusCode).json(resource.toResponse());
    }
}
