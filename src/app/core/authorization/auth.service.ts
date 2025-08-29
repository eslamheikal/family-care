import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { LoginResult } from '../models/login-result.model';
import { UserRoleEnum } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';
  private readonly REMEMBER_ME_KEY = 'remember_me';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  saveAuthData(authData: LoginResult, rememberMe: boolean = false): void {
    if (rememberMe) {
      // Use localStorage for persistent storage
      localStorage.setItem(this.TOKEN_KEY, authData.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
      localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
    } else {
      // Use sessionStorage for session-only storage
      sessionStorage.setItem(this.TOKEN_KEY, authData.token);
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
      localStorage.removeItem(this.REMEMBER_ME_KEY);
    }
    this.currentUserSubject.next(authData.user);
  }

  getToken(): string | null {
    // Check localStorage first (remember me), then sessionStorage
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    // Check localStorage first (remember me), then sessionStorage
    const userStr = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isRememberMeEnabled(): boolean {
    return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }

  updateUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    // Clear both localStorage and sessionStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  hasRole(role: UserRoleEnum): boolean {
    const user = this.getCurrentUserSync();
    return user?.role === role;
  }

  hasAnyRole(roles: UserRoleEnum[]): boolean {
    const user = this.getCurrentUserSync();
    return user ? roles.includes(user.role) : false;
  }

  private loadUserFromStorage(): void {
    const user = this.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    } else {
      // Ensure we emit null if no user is found
      this.currentUserSubject.next(null);
    }
  }

  get isAdmin(): boolean {
    return this.hasRole(UserRoleEnum.Admin);
  }

  get isEmployee(): boolean {
    return this.hasRole(UserRoleEnum.Employee);
  }

  get isFamilyParent(): boolean {
    return this.hasRole(UserRoleEnum.FamilyParent);
  }

  get isFamilyMember(): boolean {
    return this.hasRole(UserRoleEnum.FamilyMember);
  }
}