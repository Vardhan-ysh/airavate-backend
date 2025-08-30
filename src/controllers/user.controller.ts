import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving users', error });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving user', error });
        }
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        const userData = req.body;
        try {
            const newUser = await this.userService.createUser(userData);
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating user', error });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const userData = req.body;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        try {
            const updatedUser = await this.userService.updateUser(id, userData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating user', error });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        try {
            const deletedUser = await this.userService.deleteUser(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting user', error });
        }
    }
}