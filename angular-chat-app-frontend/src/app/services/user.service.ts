import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  registerUser(userData: {userName: string, email: string, password: string}): Observable<User> {
    return this.httpClient.post<User>(`${env.baseUrl}/register`, userData)
  }

  loginUser(loginData: { email: string, password: string }): Observable<User & { token: string }> {
    return this.httpClient.post<User & { token: string }>(`${env.baseUrl}/login`, loginData)
  }
}
