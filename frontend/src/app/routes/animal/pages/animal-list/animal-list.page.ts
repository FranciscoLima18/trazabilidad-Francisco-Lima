import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  resource,
  OnInit,
  computed,
  signal,
  OnDestroy,
  Input,
  input,
} from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  eyeOutline,
  pencilOutline,
  homeOutline,
  mapOutline,
  filterOutline,
  pawOutline,
  calendarOutline,
  pulseOutline,
} from 'ionicons/icons';
import { Animal } from 'src/app/model/animal';
import { AnimalService } from 'src/app/services/animal.service';
import { RolePermissionService } from 'src/app/services/role-permission.service';
import {
  AnimalFiltersComponent,
  FilterValues,
} from '../../components/animal-filters/animal-filters.component';
import { WebSocketService } from 'src/app/services/websocket.service';
import { LandsService } from 'src/app/services/lands.service';

@Component({
  selector: 'app-animal-list',
  templateUrl: './animal-list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSpinner,
    IonRow,
    IonIcon,
    IonCol,
    IonFab,
    IonFabButton,
    IonGrid,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonBadge,
    AnimalFiltersComponent,
  ],
})
export class ListPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private animalService = inject(AnimalService);
  private title = inject(Title);
  private rolePermissionService = inject(RolePermissionService);

  // Data sources
  animals = signal<Animal[]>([]);
  speciesList = signal<string[]>([]);
  regionsList = signal<string[]>([]);

  // Websocket connection
  private wsService = inject(WebSocketService);
  private unsubscribe: (() => void) | null = null;

  // Filter signals
  speciesFilter = signal<string | null>(null);
  regionFilter = signal<string | null>(null);
  fromDate = signal<string | null>(null);
  toDate = signal<string | null>(null);

  // Computed filtered animals
  filteredAnimals = computed(() => {
    return this.animals().filter((animal) => {
      // Apply species filter if selected (using breed field)
      if (this.speciesFilter() && animal.breed !== this.speciesFilter()) {
        return false;
      }

      if (this.regionFilter()) {
      }

      // Apply date range filter if selected
      if (this.fromDate() && this.toDate()) {
        const animalDate = new Date(animal.birth_date);
        const fromDate = new Date(this.fromDate()!);
        const toDate = new Date(this.toDate()!);

        if (animalDate < fromDate || animalDate > toDate) {
          return false;
        }
      }

      return true;
    });
  });

  loading = signal<boolean>(false);

  // Role-based computed properties
  readonly permissions = computed(() =>
    this.rolePermissionService.permissions()
  );
  readonly canCreateAnimals = computed(
    () => this.permissions().canCreateAnimals
  );
  readonly canEditAnimals = computed(() => this.permissions().canEditAnimals);

  public landId = input.required<string>();

  constructor() {
    addIcons({
      eyeOutline,
      pencilOutline,
      addOutline,
      homeOutline,
      mapOutline,
      filterOutline,
      pawOutline,
      calendarOutline,
      pulseOutline,
    });
  }

  ngOnInit() {
    this.title.setTitle('Lista de Animales | Sistema de Trazabilidad');
    this.loadInitialData();
    this.readQueryParams();

    // Registrar handler para mensajes de animals
    this.unsubscribe = this.wsService.onMessage('animals', () => {
      console.log('Actualizando lista de animales por WebSocket');
      this.animalsResource.reload();
    });
  }

  ngOnDestroy() {
    // Desregistrar el handler cuando se destruye el componente
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  loadInitialData() {
    this.loading.set(true);

    // Load animals
    this.animalService
      .getAllAnimals()
      .then((data) => {
        this.animals.set(data);
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('Error loading animals:', err);
        this.loading.set(false);
      });

    // Load species list
    this.animalService
      .getSpeciesList()
      .then((data) => {
        this.speciesList.set(data);
      })
      .catch((err) => {
        console.error('Error loading species:', err);
      });

    // Load regions list
    this.animalService
      .getRegions()
      .then((data) => {
        this.regionsList.set(data);
      })
      .catch((err) => {
        console.error('Error loading regions:', err);
      });
  }

  readQueryParams() {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;

    if (queryParams.has('species')) {
      this.speciesFilter.set(queryParams.get('species'));
    }

    if (queryParams.has('region')) {
      this.regionFilter.set(queryParams.get('region'));
    }

    if (queryParams.has('from')) {
      this.fromDate.set(queryParams.get('from'));
    }

    if (queryParams.has('to')) {
      this.toDate.set(queryParams.get('to'));
    }
  }

  onFiltersApplied(filters: FilterValues) {
    // Update filter signals
    this.speciesFilter.set(filters.species);
    this.regionFilter.set(filters.region);
    this.fromDate.set(filters.from);
    this.toDate.set(filters.to);

    // Update URL query params
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        species: filters.species || null,
        region: filters.region || null,
        from: filters.from || null,
        to: filters.to || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onFiltersCleared() {
    // Reset all filter signals
    this.speciesFilter.set(null);
    this.regionFilter.set(null);
    this.fromDate.set(null);
    this.toDate.set(null);

    // Clear query params
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {},
    });
  }

  // Keep existing methods
  public animalsResource = resource({
    loader: async () => await this.animalService.getAllAnimals(),
  });

  goToSpecificAnimal(animal: Animal) {
    this.router.navigate([`/animal/${animal.id}`]);
  }

  goToEdit(animal: Animal) {
    this.router.navigate([`/animal/edit/${animal.id}`]);
  }

  goToCreate() {
    this.router.navigate(['/animal/create']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToMap() {
    // Preserve current filters when navigating to map
    const queryParams: any = {};
    if (this.speciesFilter()) queryParams.species = this.speciesFilter();
    if (this.regionFilter()) queryParams.region = this.regionFilter();
    if (this.fromDate()) queryParams.from = this.fromDate();
    if (this.toDate()) queryParams.to = this.toDate();

    this.router.navigate(['/animal/map'], { queryParams });
  }

  reload() {
    this.loadInitialData();
  }
}
