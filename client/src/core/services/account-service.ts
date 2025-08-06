import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  baseUrl = 'https://localhost:5001/api';

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + '/account/register', creds).pipe(
      tap((user: User) => {
        this.setCurrentUser(user);
      })
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + '/account/login', creds).pipe(
      tap((user: User) => {
        this.setCurrentUser(user);
        console.log('User logged in:', user);
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    console.log('User logged out');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
