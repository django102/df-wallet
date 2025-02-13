import { dataSource } from "../../config/postgres";
import User from "../models/postgres/User";


export const UserRepository = dataSource.getRepository(User).extend({
    async add(user: Partial<User>): Promise<User> {
        return this.save(user);
    },

    async findById(id: string): Promise<User> {
        return this.findOne({ where: { id } });
    },

    async findByEmail(email: string): Promise<User> {
        return this.findOne({ where: { email } });
    },

    async list(filter: any = {}): Promise<User[]> {
        return this.find({ ...filter });
    },

    async updateByUser(user: User, updates?: Partial<User>): Promise<User> {
        await this.update({ id: user.id }, updates);
        return { ...user, ...updates } as User;
    },

    async updateById(id: string, updates?: Partial<User>): Promise<User> {
        const user = await this.findById(id);
        await this.update({ id }, updates);

        return { ...user, ...updates };
    }
});