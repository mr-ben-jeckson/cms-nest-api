// user-transform.util.ts
import { User } from '@prisma/client';
import { UserSerializer } from './users.serializer';
import { plainToInstance } from 'class-transformer';

export function UserResponseTransformer(userData: User | User[] | null): UserSerializer | UserSerializer[] | null {
    if (Array.isArray(userData)) {
        // If it's an array, map each user to the serialized format
        return userData.length > 0
            ? plainToInstance(UserSerializer, userData, { excludeExtraneousValues: true })
            : [];
    } else if (userData) {
        // If it's a single user, serialize it
        return plainToInstance(UserSerializer, userData, { excludeExtraneousValues: true });
    }

    // Return null if no user data is passed
    return null;
}
