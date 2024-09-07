import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new ForbiddenException('Authorization header missing');
        }

        const token = authHeader.replace('Bearer ', '');
        const decodedToken = this.jwtService.decode(token) as { sub: string }; 

        if (!decodedToken?.sub) {
            throw new ForbiddenException('Invalid token');
        }

        const user = await this.prismaService.user.findUnique({
            where: { id: decodedToken.sub },
            select: { isAdmin: true },
        });

        if (!user || !user.isAdmin) {
            throw new ForbiddenException('You do not have permission to access this resource.');
        }

        return true;
    }
}