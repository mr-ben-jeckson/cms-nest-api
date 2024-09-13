import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly blacklistedTokens: Set<string> = new Set();

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return { userId: user.id, email: user.email, isAdmin: user.isAdmin, isFlagged: user.isFlagged };
        }
        return null;
    }

    async login(email: string, password: string): Promise<{ accessToken: string }> {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (user.isFlagged) {
            throw new UnauthorizedException('Your account is flagged');
        }
        const payload = { email: user.email, sub: user.userId, isAdmin: user.isAdmin };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }

    async logout(token: string): Promise<void> {
        // Add the token to the blacklist
        this.blacklistedTokens.add(token);
    }

    async register(registerInput: any): Promise<any> {
        return this.userService.createUser(registerInput);
    }

    // Check if token is blacklisted
    isTokenBlacklisted(token: string): boolean {
        return this.blacklistedTokens.has(token);
    }
}
