import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Animal } from 'src/app/model/animal';
import { AnimalService } from 'src/app/services/animal.service';
import { MainStoreService } from 'src/app/services/main-store.service';
import { RouterLink } from '@angular/router';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-last3-animals',
  templateUrl: './last3-animals.page.html',
  styleUrls: ['./last3-animals.page.scss'],
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
export class Last3AnimalsPage implements OnInit {
  private animalService = inject(AnimalService);

  animalesRecientes = signal<Animal[]>([]);

  cargarAnimalesRecientes = signal<boolean>(false);

  private router = inject(Router);

  private mainStore = inject(MainStoreService);

  readonly isAdmin = computed(() => this.mainStore.isAdmin());

  ngOnInit() {
    // Load recent animals if user is admin
    if (this.isAdmin()) {
      this.cargarAnimalesRecientes();
    }

    // Load recent animals if user is admin
    if (this.isAdmin()) {
      this.loadRecentAnimals();
    }
  }

  async loadRecentAnimals() {
    try {
      this.cargarAnimalesRecientes.set(true);

      const todosLosAnimales = await this.animalService.getAllAnimals();

      const sortedAnimals = todosLosAnimales
        .sort(
          (a, b) =>
            new Date(b.birth_date).getTime() - new Date(a.birth_date).getTime()
        )
        .slice(0, 3);

      this.animalesRecientes.set(sortedAnimals);
    } catch (error) {
      console.error(error);
    } finally {
      this.cargarAnimalesRecientes.set(false);
    }
  }

  goToAnimal(animalId: string) {
    this.router.navigate(['/animal', animalId]);
  }
}
