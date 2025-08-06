import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountService = inject(AccountService);
  private router = inject(Router);
  protected toast = inject(ToastService);
  protected creds: any = {};

  login() {
    //console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigate(['/members']); // Navigate to members page after login
        this.toast.success('Login successful', 5000);
        this.creds = {}; // Clear credentials after successful login
      },
      error: (error: any) => {
        this.toast.error(error.error, 5000);
      },
    });
  }

  logout() {
    console.log('Logout clicked');
    this.accountService.logout();
    this.router.navigate(['/']);
  }
}
