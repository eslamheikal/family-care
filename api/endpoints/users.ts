import { Request, Response } from 'express';
import { handleError } from '../helpers/handle-error.helper';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UserRoleEnum } from '../enums/user-role.enum';

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

    const userId = await authService.getUserIdFromToken(token!);
    if(!userId.isSuccess) {
      return res.status(401).json({
        error: userId.errors
      });
    }

    const userRole = await authService.getUserRoleFromToken(token!);
    const parentId = await authService.getParentIdFromToken(token!);
    
    const { method } = req;
    const { action } = req.query;

    if (method === 'GET' && action === 'parents') {
      const result = await userService.getFamilyParents();
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    if (method === 'GET' && action === 'members') {
      const { parentId } = req.query;

      const result = await userService.getFamilyMembers(+parentId!);
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    if (method === 'GET' && action === 'get') {

      const { id } = req.query;

      const result = await userService.getUser(+id!, +userId.value!, userRole.value!, +parentId.value!);
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

      const userRole = await authService.getUserRoleFromToken(token!);
      
      if(userRole.value === UserRoleEnum.Parent) {
        user.parentId = userId.value!;
        user.role = UserRoleEnum.Member;
      }

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