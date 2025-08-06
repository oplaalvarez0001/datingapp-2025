import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {
    this.createToastContainer();
  }

  private createToastElement(
    message: string,
    alertClass: string,
    duration: 5000
  ) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('alert', 'shadow-lg', 'mb-4', alertClass);
    toast.innerHTML = `
         <span>${message}</span>
         <button class="btn btn-sm btn-ghost ml-4 ">x</button>
    `;
    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });

    toastContainer.append(toast);

    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }

  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast toast-bottom toast-end';
      document.body.appendChild(toastContainer);
    }
  }

  success(message: string, duration: 5000) {
    this.createToastElement(message, 'alert-success', duration);
  }

  error(message: string, duration: 5000) {
    this.createToastElement(message, 'alert-error', duration);
  }

  warning(message: string, duration: 5000) {
    this.createToastElement(message, 'alert-warning', duration);
  }

  info(message: string, duration: 5000) {
    this.createToastElement(message, 'alert-info', duration);
  }
}
