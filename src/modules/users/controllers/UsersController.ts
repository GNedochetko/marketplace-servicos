import { Request, Response } from "express";
import CreateUserService from "../services/CreateUserService";
import ListUsersService from "../services/ListUsersService";
import ShowUserService from "../services/ShowUserService";
import UpdateUserService from "../services/UpdateUserService";
import User, { UserRole } from "../typeorm/entities/User";

interface UserParams {
    id: string;
}

interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}

function serializeUser(user: User): UserResponse {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}

class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password, role } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password,
            role,
        });

        return response.status(201).json(serializeUser(user));
    }

    public async index(request: Request, response: Response): Promise<Response> {
        const listUsers = new ListUsersService();

        const users = await listUsers.execute();

        return response.status(200).json(users.map(user => serializeUser(user)));
    }

    public async show(request: Request<UserParams>, response: Response): Promise<Response> {
        const { id } = request.params;

        const showUser = new ShowUserService();

        const user = await showUser.execute({ id });

        return response.status(200).json(serializeUser(user));
    }

    public async update(request: Request<UserParams>, response: Response): Promise<Response> {
        const { id } = request.params;
        const { name, email, password, role } = request.body;

        const updateUser = new UpdateUserService();

        const user = await updateUser.execute({
            id,
            name,
            email,
            password,
            role,
        });

        return response.status(200).json(serializeUser(user));
    }
}

export default UsersController;
