import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { MainStoreService } from 'src/app/services/main-store.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  imports: [
    CommonModule,
    FormsModule,
    //IonRow,
    //IonCol,
    IonButton,
    //IonGrid,
    IonInput,
    IonItem,
    IonIcon,
    IonLabel,
    IonSelectOption,
    IonSelect,
    IonSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-user-form' },
})
export default class UserFormComponent {
  //inputs
  user = input<any | null>(null);
  isEditMode = input<boolean>(false);
  error = signal<string>('');
  backendErrors = input<any>(null);

  //outputs
  submitted = output<any>();
  canceled = output<void>();

  private store = inject(MainStoreService);

  email = signal('');
  password = signal('');
  repeatPassword = signal('');
  role_id = signal<number | null>(null);

  touched = signal({
    email: false,
    password: false,
    repeatPassword: false,
    role: false,
  });

  loading = signal(false);

  // Computed para obtener errores específicos de campos
  fieldErrors = computed(() => {
    const errors = this.backendErrors();
    if (!errors) return {};

    if (typeof errors === 'object' && !Array.isArray(errors)) {
      return errors;
    }

    return {};
  });

  generalError = computed(() => {
    const errors = this.backendErrors();
    if (!errors) return '';

    if (typeof errors === 'string') {
      return errors;
    }

    if (typeof errors === 'object' && errors.message) {
      return errors.message;
    }

    return '';
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.email.set(u.email ?? '');
        this.role_id.set(u.role_id ?? null);
        this.password.set(u.password ?? null);
      }
    });
  }

  allValues = computed(() => ({
    email: this.email(),
    password: this.password(),
    repeatPassword: this.repeatPassword(),
    role_id: this.role_id(),
  }));

  showRoleSelect = computed(
    () => !this.isEditMode() || (this.isEditMode() && this.store.isAdmin())
  );

  formValid = computed(() => {
    const v = this.allValues();
    return (
      !!v.email &&
      (!!v.password || this.isEditMode()) &&
      (!!v.repeatPassword || this.isEditMode()) &&
      !!v.role_id
    );
  });

  onEmailChange(value: string | number | null | undefined) {
    this.email.set(typeof value === 'string' ? value : String(value ?? ''));
    this.touched.set({ ...this.touched(), email: true });
    // Limpiar error específico de este campo
    this.clearFieldError('email');
  }
  onPasswordChange(value: string | number | null | undefined) {
    this.password.set(typeof value === 'string' ? value : String(value ?? ''));
    this.touched.set({ ...this.touched(), password: true });
    // Limpiar error específico de este campo
    this.clearFieldError('password');
  }
  onRepeatPasswordChange(value: string | number | null | undefined) {
    this.repeatPassword.set(
      typeof value === 'string' ? value : String(value ?? '')
    );
    this.touched.set({ ...this.touched(), repeatPassword: true });
    // Limpiar error específico de este campo
    this.clearFieldError('repeatPassword');
    this.clearFieldError('confirmPassword');
  }
  onRoleChange(value: number | string | null | undefined) {
    // Siempre casteamos a number si es string o null
    const roleValue = typeof value === 'number' ? value : Number(value ?? 0);
    this.role_id.set(roleValue);
    this.touched.set({ ...this.touched(), role: true });
    // Limpiar error específico de este campo
    this.clearFieldError('role_id');
    this.clearFieldError('role');
  }

  // Método para limpiar error específico de un campo
  clearFieldError(fieldName: string): void {
    const currentErrors = this.backendErrors();
    if (
      currentErrors &&
      typeof currentErrors === 'object' &&
      !Array.isArray(currentErrors)
    ) {
      const newErrors = { ...currentErrors };
      delete newErrors[fieldName];

      if (Object.keys(newErrors).length === 0) {
      }
    }
  }

  getFieldError(fieldName: string): string {
    const errors = this.fieldErrors();
    return errors[fieldName] || '';
  }

  async onSubmit() {
    if (!this.formValid()) return;
    this.loading.set(true);
    try {
      this.submitted.emit({
        email: this.email(),
        password: this.password(),
        ...(this.isEditMode() ? {} : { repeatPassword: this.repeatPassword() }),
        role_id: this.role_id()!,
      });
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.canceled.emit();
  }
}
