import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        // Handle JWT expiration
        if (info instanceof TokenExpiredError) {
            throw new UnauthorizedException('JWT expired');
        }

        // Handle other possible errors (like invalid token, no user)
        if (err || !user) {
            throw new UnauthorizedException('Unauthorized access');
        }

        // Return the authenticated user if no errors
        return user;
    }
}
