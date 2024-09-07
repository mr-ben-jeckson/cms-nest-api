import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const secret = process.env.JWT_SECRET || 'your_jwt_secret';
            const decoded = jwt.verify(token, secret);
            req.user = decoded; // Attach decoded token data to the request object
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
