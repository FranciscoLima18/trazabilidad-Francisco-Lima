import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import UserFormComponent from '../../../routes/user/components/user-form/user-form.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    UserFormComponent,
  ],
})
export class RegisterPage {
  loading = signal(false);
  backendErrors = signal<any>(null);

  private userService = inject(UserService);
  private router = inject(Router);

  async onSubmit(data: {
    email: string;
    password: string;
    repeatPassword?: string;
    role_id: number;
  }) {
    // Limpiar errores anteriores
    this.backendErrors.set(null);
    this.loading.set(true);

    const user: any = {
      email: data.email,
      password: data.password,
      role_id: data.role_id,
    };
    if (data.repeatPassword) {
      user.repeatPassword = data.repeatPassword;
    }

    try {
      const usuarioCreado = await this.userService.postUser(user);
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      console.error('Error al crear el usuario:', error);

      // Procesar diferentes tipos de errores del backend
      if (error.error) {
        // Si el error viene con estructura específica
        if (error.error.errors) {
          // Errores de validación específicos por campo
          this.backendErrors.set(error.error.errors);
        } else if (error.error.message) {
          // Mensaje de error general
          this.backendErrors.set(error.error.message);
        } else if (typeof error.error === 'string') {
          // Error como string
          this.backendErrors.set(error.error);
        } else {
          // Error genérico
          this.backendErrors.set(
            'Error al crear el usuario. Intenta nuevamente.'
          );
        }
      } else if (error.message) {
        this.backendErrors.set(error.message);
      } else {
        this.backendErrors.set(
          'Error al crear el usuario. Intenta nuevamente.'
        );
      }
    } finally {
      this.loading.set(false);
    }
  }
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
