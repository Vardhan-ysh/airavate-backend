import { Request, Response, NextFunction } from 'express';

// Simple validation middleware without express-validator for now
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    
    if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long' });
        return;
    }
    
    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    
    next();
};