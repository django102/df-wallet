import { Service } from "typedi";

import { Logger } from "../../lib/logger";
import AuthenticateUserOtp from "../models/payload/requests/AuthenticateUserOtp";
import AuthenticateUserRequest from "../models/payload/requests/AuthenticateUserRequest";
import CreateUserRequest from "../models/payload/requests/CreateUserRequest";
import User from "../models/postgres/User";
import { UserRepository } from "../repositories/UserRepository";

import UtilityService from "./UtilityService";


@Service()
export default class UserService {
    constructor(
        private log: Logger
    ){}


    public async create(req: CreateUserRequest): Promise<{isExists: boolean, user: User}> {
        const { email, password } = req;

        const existingUser = await UserRepository.findByEmail(email);
        if(existingUser) {
            return { isExists: true, user: existingUser };
        }

        const hashedPassword = await UtilityService.hashString(password);

        const createdUser = await UserRepository.add({ ...req, password: hashedPassword });

        const otp = UtilityService.generateRandomString({ length: 6, numericOnly: true });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        otp; // send otp to user

        return { isExists: false, user: createdUser };
    }

    public async validateEmail(req: AuthenticateUserOtp): Promise<boolean> {
        const { email, otp } = req;

        const user = await UserRepository.findByEmail(email);
        if(!user) {
            this.log.error("Could not validate user as user does not exist", { email, otp });
            return false;
        }

        // check otp storage to validate sent otp

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        email;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        otp;

        await UserRepository.updateByUser(user, { isActive: true, isEnabled: true, isValidated: true });

        return true;
    }

    public async authenticate(req: AuthenticateUserRequest): Promise<{isSuccess: boolean, message?: string, user?: User}> {
        const { email, password } = req;

        const existingUser = await UserRepository.findByEmail(email);
        if(!existingUser) {
            return { isSuccess: false, message: "Invalid email or password" };
        }

        const isPasswordCheckOK = await UtilityService.compareHash(password, existingUser.password);
        if(!isPasswordCheckOK) {
            return { isSuccess: false, message: "Invalid email or password" };
        }

        if(!existingUser.isValidated) {
            // resend Otp
            return{ isSuccess: false, message: "User account not validated. Please check your email for further instructions" };
        }

        if(!existingUser.isActive) {
            return{ isSuccess: false, message: "User account inactive. Please contact support" };
        }

        if(!existingUser.isEnabled) {
            return{ isSuccess: false, message: "User account disabled. Please contact support" };
        }

        if(!existingUser.isDeleted) {
            return{ isSuccess: false, message: "User account has been deleted. Please contact support if you want to restore your account" };
        }


        const user = UtilityService.sanitizeUserObject(existingUser);

        return { isSuccess: true, user };
    }

    public async getUserInformation(id: string): Promise<User> {
        const existingUser = await UserRepository.findById(id);
        const user = UtilityService.sanitizeUserObject(existingUser);
        return user;
    }

    public async setPin(id: string, pin: string): Promise<boolean> {
        const existingUser = await UserRepository.findById(id);
        await UserRepository.updateByUser(existingUser, { pin });
        return true;
    }

    public async listUsers(): Promise<User[]> {
        const allUsers = await UserRepository.list();

        const users = allUsers.map((user) => UtilityService.sanitizeUserObject(user));
        return users;
    }
}