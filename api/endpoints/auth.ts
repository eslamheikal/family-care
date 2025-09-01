import { Request, Response } from 'express';
import { handleError } from '../helpers/handle-error.helper';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export default async function handler(req: Request, res: Response) {
  try {
    const { method } = req;
    const { action } = req.query;

    if (method === 'POST' && action === 'login') {
      const { emailOrPhone, password } = req.body;
      const result = await authService.login(emailOrPhone, password);
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    return res.status(405).json({
      error: 'Method not allowed or invalid action'
    });

  } catch (error) {
    console.error('Auth API Error:', error);
    return handleError(res, error);
  }
}