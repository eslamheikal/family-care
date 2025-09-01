import { Request, Response } from 'express';
import { handleError } from '../helpers/handle-error.helper';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

const userService = new UserService();
const authService = new AuthService();

export default async function handler(req: Request, res: Response) {
  try {

    const token = req.headers.authorization;

    const isValidToken = await authService.isTokenValid(token!);
    if(!isValidToken) {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    const { method } = req;
    const { action } = req.query;

    if (method === 'GET' && action === 'paged') {
      const { page = '1', pageSize = '10', search = '', sortBy, sortOrder = 'desc' } = req.query;

      const options = {
        page: parseInt(page as string) || 1,
        pageSize: parseInt(pageSize as string) || 10,
        search: search as string,
        sortBy: sortBy as string || 'id',
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await userService.getUsersPaged(options);

      return res.status(200).json({
        success: true,
        ...result
      });
    }

    if (method === 'GET' && action === 'query') {

      //query by id or email or phone
      const { id } = req.query;
      const result = await userService.getUser(+id!);
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    if (method === 'GET' && action === 'activate') {
      const { id } = req.query;
      const result = await userService.activateUser(+id!);
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    if (method === 'GET' && action === 'deactivate') {
      const { id } = req.query;
      const result = await userService.deactivateUser(+id!);
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    if (method === 'POST' && action === 'create') {
      const user = req.body;
      const result = await userService.addUser(user);
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    if (method === 'PUT' && action === 'update') {
      const user = req.body;
      const result = await userService.updateUser(user);
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    if (method === 'DELETE' && action === 'delete') {
      const { id } = req.query;
      const result = await userService.deleteUser(+id!);
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    return res.status(405).json({
      error: 'Method not allowed or invalid action'
    });

  } catch (error) {
    console.error('Users API Error:', error);
    return handleError(res, error);
  }
}