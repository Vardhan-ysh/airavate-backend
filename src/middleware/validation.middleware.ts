import { Request, Response, NextFunction } from 'express';

// Simple validation middleware
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ message: 'Email, password, firstName, and lastName are required' });
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Please provide a valid email address' });
        return;
    }
    
    // Password strength validation
    if (password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 characters long' });
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
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Please provide a valid email address' });
        return;
    }
    
    next();
};