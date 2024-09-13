import { Exclude, Expose } from 'class-transformer';

export class UserSerializer {
    @Expose() id: string;
    @Expose() name: string;
    @Expose() email: string;
    @Expose() createdAt: Date;
    @Expose() updatedAt: Date;
    @Expose() isAdmin: Boolean;
    get profileImage(): string {
        return this.profile?.url || null;
    }
    @Exclude() private profile: any;

    constructor(partial: Partial<UserSerializer>) {
        Object.assign(this, partial);
    }
}
