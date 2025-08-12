import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service'; // Adjust the import path as necessary
import { NavigationExtras, Router } from '@angular/router'; // Adjust the import path as necessary

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService); // Assuming you have a ToastService for notifications
  const router = inject(Router); // Assuming you have a Router for navigation

  return next(req).pipe(
    catchError((error) => {
      // Handle the error
      if (error) {
        switch (error.status) {
          case 400:
            console.error('Bad Request:', error.message);
            if (error.error.errors) {
              const modelStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modelStateErrors.push(error.error.errors[key]);
                }
              }
              throw modelStateErrors.flat();
            } else {
              toast.error(error.error ,5000);
            }
            break;
          case 401:
            console.error('Unauthorized:', error.message);
            toast.error('Unauthorized access.', 5000);
            break;
          case 404:
            console.error('Not Found:', error.message);
            router.navigateByUrl('/not-found');
            break;
          case 500:
            console.error('Internal Server Error:', error.message);
            const navigationExtras : NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-errors', navigationExtras);
            break;
          default:
            toast.error('An unexpected error occurred.', 5000);
            break;
        }
      }
      throw error; // Re-throw the error to propagate it
    })
  );
};
