import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _loggedIn = new BehaviorSubject<boolean>(false);
  private _activeUser = new BehaviorSubject<User | undefined>(undefined);
  private _token = new BehaviorSubject<string | undefined>(undefined);

  public loggedIn$ = this._loggedIn.asObservable();
  public activeUser$ = this._activeUser.asObservable();
  public token$ = this._token.asObservable();

  setLoggedIn(value: boolean) {
    this._loggedIn.next(value);
  }

  setActiveUser(user: User) {
    this._activeUser.next(user);
  }

  setToken(token: string) {
    this._token.next(token);
  }

  getToken() {
    return this._token.getValue();
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({ Authorization: 'Bearer ' + this._token.getValue() });
  }

  loggedIn() {
    return this._loggedIn.getValue();
  }

  logOut() {
    this._token.next(undefined);
    this._loggedIn.next(false);
    this._activeUser.next(undefined);
  }

  getActiveUser(): User | undefined {
    return this._activeUser.getValue();
  }

}
