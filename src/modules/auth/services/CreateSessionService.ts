import AppError from "@shared/errors/AppError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import CreateSessionDTO from "../dtos/CreateSessionDTO";
import { UserRole } from "@modules/users/typeorm/entities/User";
import UsersRepository from "@modules/users/typeorm/repositories/UsersRepository";

interface IAuthenticatedUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}

interface IResponse {
    user: IAuthenticatedUser;
    token: string;
}

class CreateSessionService {
    public async execute({ email, password }: CreateSessionDTO): Promise<IResponse> {
        const user = await UsersRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new AppError("Incorrect email/password combination", 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError("Incorrect email/password combination", 401);
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new AppError("JWT secret is not configured", 500);
        }

        const token = sign({}, jwtSecret, {
            subject: user.id,
            expiresIn: "1d",
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
            token,
        };
    }
}

export default CreateSessionService;
