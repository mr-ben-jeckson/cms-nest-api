import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header');
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify the token
            const decodedToken = this.jwtService.verify(token);

            // Check if user exists and is admin
            const user = await this.prismaService.user.findUnique({ where: { id: decodedToken.sub } });

            if (!user || !user.isAdmin) {
                throw new UnauthorizedException('Access denied');
            }

            return true;
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                // Handle token expiration
                throw new UnauthorizedException('JWT expired');
            }
            throw new UnauthorizedException('Invalid token');
        }
    }
}
