import { User } from "../models/user";
import { DbQueries } from "../lib/db-queries";
import { UserMapper } from "../mappers/user.mapper";
import { Result } from "../utils/result";
import jwt from 'jsonwebtoken';
import { DbBuilder } from "../lib/db-builder";
import { UserRoleEnum } from "../enums/user-role.enum";

// JWT payload interface
interface JWTPayload {                                                                                                                  
  userId: string;
  email?: string;
  role?: UserRoleEnum;
  iat?: number;
  exp?: number;
}

const userQueries = new DbQueries('users', 'id');

export class AuthService {

  async login(emailOrPhone: string, password: string): Promise<Result<{
    user: User;
    token: string;
  }>> {
    try {
      // Query user by email OR phone
      const whereClause = DbBuilder.or(
        DbBuilder.and(DbBuilder.condition('email', '==', emailOrPhone)),
        DbBuilder.and(DbBuilder.condition('phone', '==', emailOrPhone))
      );

      const users = await userQueries.query({ where: whereClause });

      // Check if user exists
      if (users.length === 0) {
        return Result.failure(['User not found']);
      }

      // Check if password is correct
      const user = users.find(user => user.password === password);
      if (user === undefined) {
        return Result.failure(['Invalid password']);
      }

      const mappedUser = UserMapper.toModel(user);

      // Check if JWT_SECRET is configured
      if (!process.env['JWT_SECRET']) {
        console.error('JWT_SECRET environment variable is not configured');
        return Result.failure(['Authentication service configuration error']);
      }

      // Generate token with user information
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(tokenPayload, process.env['JWT_SECRET']);

      return Result.success({ user: mappedUser, token: token });
    } catch (error) {
      console.error('Login error:', error);
      return Result.failure(['Login failed. Please try again.']);
    }
  }

  async validateToken(token: string): Promise<Result<JWTPayload>> {
    try {
      // Check if JWT_SECRET is configured
      if (!process.env['JWT_SECRET']) {
        console.error('JWT_SECRET environment variable is not configured');
        return Result.failure(['Authentication service configuration error']);
      }

      // Check if token is provided
      if (!token || token.trim() === '') {
        return Result.failure(['Token is required']);
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      // Verify and decode the token
      const decoded = jwt.verify(cleanToken, process.env['JWT_SECRET']) as JWTPayload;
      
      return Result.success(decoded);
    } catch (error: any) {
      console.error('Token validation error:', error.message);
      
      // Provide specific error messages based on the error type
      if (error.name === 'TokenExpiredError') {
        return Result.failure(['Token has expired']);
      } else if (error.name === 'JsonWebTokenError') {
        return Result.failure(['Invalid token']);
      } else if (error.name === 'NotBeforeError') {
        return Result.failure(['Token not active yet']);
      } else {
        return Result.failure(['Token validation failed']);
      }
    }
  }

  async getUserFromToken(token: string): Promise<Result<User>> {
    try {
      const tokenResult = await this.validateToken(token);
      
      if (!tokenResult.isSuccess) {
        return Result.failure(tokenResult.errors || ['Token validation failed']);
      }

      const payload = tokenResult.value!;
      
      // Get user from database
      const user = await userQueries.getById(payload.userId);
      
      if (!user) {
        return Result.failure(['User not found']);
      }

      const mappedUser = UserMapper.toModel(user);
      return Result.success(mappedUser);
    } catch (error) {
      console.error('Get user from token error:', error);
      return Result.failure(['Failed to get user from token']);
    }
  }

  async refreshToken(token: string): Promise<Result<{ token: string; user: User }>> {
    try {
      const tokenResult = await this.validateToken(token);
      
      if (!tokenResult.isSuccess) {
        return Result.failure(tokenResult.errors || ['Token validation failed']);
      }

      const payload = tokenResult.value!;
      
      // Get user from database
      const user = await userQueries.getById(payload.userId);
      
      if (!user) {
        return Result.failure(['User not found']);
      }

      const mappedUser = UserMapper.toModel(user);

      // Generate new token
      const newTokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const newToken = jwt.sign(newTokenPayload, process.env['JWT_SECRET']!, { 
        expiresIn: '24h'
      });

      return Result.success({ token: newToken, user: mappedUser });
    } catch (error) {
      console.error('Refresh token error:', error);
      return Result.failure(['Failed to refresh token']);
    }
  }


  async isTokenValid(token: string): Promise<boolean> {
    try {
      const result = await this.validateToken(token);

      return result.isSuccess;
    } catch (error) {
      return false;
    }
  }

  async getUserIdFromToken(token: string): Promise<Result<number>> {
    try {
      const tokenResult = await this.validateToken(token);
      
      if (!tokenResult.isSuccess) {
        return Result.failure(tokenResult.errors || ['Token validation failed']);
      }

      return Result.success(parseInt(tokenResult.value!.userId));
    } catch (error) {
      console.error('Get user ID from token error:', error);
      return Result.failure(['Failed to get user ID from token']);
    }
  }

  async getUserRoleFromToken(token: string): Promise<Result<UserRoleEnum>> {
    try {
      const tokenResult = await this.validateToken(token);
      return Result.success(tokenResult.value!.role as UserRoleEnum);
    } catch (error) {
      console.error('Get user role from token error:', error);
      return Result.failure(['Failed to get user role from token']);
    }
  }
}