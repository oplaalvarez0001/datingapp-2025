import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../themes';
import { BusyService } from '../../core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  protected accountService = inject(AccountService);
  protected busyService = inject(BusyService);
  private router = inject(Router);
  protected toast = inject(ToastService);
  protected creds: any = {};
  protected selectedTheme = signal<string>(
    localStorage.getItem('theme') || 'light'
  );
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectedTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);

    //Sets the theme in DaisyUI
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }

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
