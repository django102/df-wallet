import { dataSource } from "../../config/postgres";
import UserWithdrawalInformation from "../models/postgres/UserWithdrawalInformation";


export const UserWithdrawalInformationRepository = dataSource.getRepository(UserWithdrawalInformation).extend({
    async add(account: Partial<UserWithdrawalInformation>): Promise<UserWithdrawalInformation> {
        return this.save(account);
    },

    async findById(id: number): Promise<UserWithdrawalInformation> {
        return this.findOne({ where: { id } });
    },

    async list(userId: string): Promise<UserWithdrawalInformation[]> {
        return this.find({ where: { userId } });
    },

    async updateUserAccount(accountId: number, updates?: Partial<UserWithdrawalInformation>): Promise<void> {
        await this.update({ id: accountId }, updates);
    },

    async deleteUserWithdrawalAccount(accountId: number) {
        const account = await this.findById(accountId);
        return this.remove([account]);
    }
});