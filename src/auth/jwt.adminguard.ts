import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';

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
        const decodedToken = this.jwtService.verify(token);
        const user = await this.prismaService.user.findUnique({ where: { id: decodedToken.sub } });

        if (!user || !user.isAdmin) {
            throw new UnauthorizedException('Access denied');
        }

        return true;
    }
}
