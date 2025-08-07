import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  pawOutline,
  businessOutline,
  peopleOutline,
  pricetagOutline,
  statsChartOutline,
  documentTextOutline,
  eyeOutline,
  calendarOutline,
  timeOutline,
} from 'ionicons/icons';
import { MainStoreService } from 'src/app/services/main-store.service';
import { RolePermissionService } from 'src/app/services/role-permission.service';
import { AnimalService } from 'src/app/services/animal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonBadge,
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    IonSpinner,
    IonRow,
  ],
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private title = inject(Title);
  private mainStore = inject(MainStoreService);
  private rolePermissionService = inject(RolePermissionService);

  // Role-based computed properties
  readonly isAdmin = computed(() => this.mainStore.isAdmin());
  readonly canEditAnimals = computed(() => this.mainStore.isOperatorOrAdmin());
  readonly isConsulta = computed(() => this.mainStore.userRoleId() === 2);
  readonly permissions = computed(() =>
    this.rolePermissionService.permissions()
  );
  readonly roleName = computed(() => this.rolePermissionService.getRoleName());
  readonly userId = computed(() => this.mainStore.userId());
  userIdValue = this.userId();

  constructor() {
    addIcons({
      pawOutline,
      businessOutline,
      peopleOutline,
      pricetagOutline,
      statsChartOutline,
      documentTextOutline,
      eyeOutline,
      calendarOutline,
      timeOutline,
    });
  }

  ngOnInit() {
    this.title.setTitle('Panel de Control | Sistema de Trazabilidad');
    const userIdValue = this.userId();
    if (typeof userIdValue === 'string' && userIdValue.includes('[Computed:')) {
      const match = userIdValue.match(/\[Computed: ([^]+)\]/);
      if (match && match[1]) {
        this.userIdValue = match[1].trim();
      }
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
