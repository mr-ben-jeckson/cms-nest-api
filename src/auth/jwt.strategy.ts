import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'yourSecretKey',
        });
    }

    async validate(payload: any) {
        // Extract the token from the request is not necessary here
        // The token is not available directly in the payload

        // Here, you just validate the user based on the payload
        // The payload contains user information set during token creation

        // Optionally, you can check if the token is blacklisted if you have that functionality
        if (this.authService.isTokenBlacklisted(payload.sub)) {
            throw new UnauthorizedException('Token is blacklisted');
        }

        // Return user data from the payload
        return { userId: payload.sub, email: payload.email, isAdmin: payload.isAdmin };
    }
}
