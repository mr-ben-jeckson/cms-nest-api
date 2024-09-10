import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from '@/users/users.service'; // Adjust the import path

@Injectable()
export class AdminMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const secret = process.env.JWT_SECRET || 'your_jwt_secret';
            const decoded: any = jwt.verify(token, secret);

            // Fetch the user from the database
            const user = await this.userService.getUserById(decoded.sub);

            if (user && user.isAdmin) {
                req.user = user; // Attach user data to the request object
                next();
            } else {
                throw new ForbiddenException('User does not have admin privileges');
            }
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }

}
