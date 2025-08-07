import { Routes } from '@angular/router';
import { userGuard } from 'src/app/guards/user.guard';
import { adminOrOperatorGuard } from 'src/app/guards/admin-or-operator.guard';
import { adminOrSelfGuard } from 'src/app/guards/admin-or-self.guard';
import { adminGuard } from 'src/app/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      // 1. Redirect inicial
      { path: '', redirectTo: 'list', pathMatch: 'full' },

      // 2. Rutas estáticas
      {
        path: 'list',
        canActivate: [userGuard], // All authenticated users can view list
        data: { menu: true, section: 'Animales', title: 'Lista de animales' },
        loadComponent: () =>
          import('./pages/animal-list/animal-list.page').then(
            (m) => m.ListPage
          ),
      },
      {
        path: 'create',
        canActivate: [adminOrOperatorGuard], // Only admin and operators can create
        data: { menu: true, section: 'Animales', title: 'Crear un animal' },
        loadComponent: () =>
          import('./pages/animal-create/animal-create.page').then(
            (m) => m.AnimalCreatePage
          ),
      },
      {
        path: 'map',
        canActivate: [userGuard], // All authenticated users can view map
        data: { menu: true, section: 'Animales', title: 'Mapa de animales' },
        loadComponent: () =>
          import('./pages/animal-map/animal-map.page').then(
            (m) => m.AnimalMapPage
          ),
      },

      {
        path: 'lastThree',
        canActivate: [userGuard],
        data: {
          menu: true,
          section: 'Animales',
          title: 'Ultimos tres Animales creados.',
        },
        loadComponent: () =>
          import('./pages/last3-animals/last3-animals.page').then(
            (m) => m.Last3AnimalsPage
          ),
      },

      // 3. Rutas con sub-segmentos dinámicos
      {
        path: 'edit/:id',
        canActivate: [adminOrOperatorGuard], // Only admin and operators can edit
        data: { title: 'Editar Animal' },
        loadComponent: () =>
          import('./pages/animal-edit/animal-edit.page').then(
            (m) => m.AnimalEditPage
          ),
      },
      {
        path: 'events/:id/sale',
        canActivate: [adminOrOperatorGuard], // Only admin and operators can manage sales
        data: { title: 'Ventas del Animal' },
        loadComponent: () =>
          import(
            './pages/animal-event/sale/pages/sale-list/sale-list.page'
          ).then((m) => m.SaleListPage),
      },
      {
        path: 'events/:id/sale/create',
        canActivate: [adminOrOperatorGuard], // Only admin and operators can create sales
        data: { title: 'Registrar Venta' },
        loadComponent: () =>
          import(
            './pages/animal-event/sale/pages/sale-create/sale-create.page'
          ).then((m) => m.SaleCreatePage),
      },
      {
        path: 'events/:id/vaccination',
        canActivate: [userGuard], // All users can view vaccinations
        data: { title: 'Vacunaciones del Animal' },
        loadComponent: () =>
          import(
            './pages/animal-event/vaccination/pages/vaccination-list/vaccination-list.page'
          ).then((m) => m.VaccinationListPage),
      },
      {
        path: 'events/:id/vaccination/create',
        canActivate: [adminOrOperatorGuard], // Only admin and operators can create vaccinations
        data: { title: 'Registrar Vacunación' },
        loadComponent: () =>
          import(
            './pages/animal-event/vaccination/pages/vaccination-create/vaccination-create.page'
          ).then((m) => m.VaccinationCreatePage),
      },
      {
        path: 'events/:id/weighing',
        canActivate: [userGuard], // All users can view weighings
        data: { title: 'Pesajes del Animal' },
        loadComponent: () =>
          import(
            './pages/animal-event/weighing/pages/weighing-list/weighing-list.page'
          ).then((m) => m.WeighingListPage),
      },
      {
        path: 'events/:id/weighing/create',
        canActivate: [adminOrOperatorGuard], // Only admin and operators can create weighings
        data: { title: 'Registrar Pesaje' },
        loadComponent: () =>
          import(
            './pages/animal-event/weighing/pages/weighing-create/weighing-create.page'
          ).then((m) => m.WeighingCreatePage),
      },
      {
        path: 'history/:id',
        canActivate: [userGuard], // All users can view history
        data: { title: 'Historial del Animal' },
        loadComponent: () =>
          import('./pages/animal-history/animal-history.page').then(
            (m) => m.HistoryPage
          ),
      },
      {
        path: 'movements/:id',
        canActivate: [userGuard], // All users can view movements
        data: { title: 'Movimientos del Animal' },
        loadComponent: () =>
          import('./pages/animal-movement/animal-movement.page').then(
            (m) => m.MovementPage
          ),
      },

      // 4. Ruta "lista por usuario"
      {
        path: ':userId/list',
        pathMatch: 'full',
        canActivate: [adminOrSelfGuard], // Admin or owner
        data: { title: 'Mis Animales' },
        loadComponent: () =>
          import('./pages/animal-user-list/animal-user-list.page').then(
            (m) => m.AnimalUserListPage
          ),
      },

      // 5. Ruta genérica detalle
      {
        path: ':animal_id',
        canActivate: [userGuard], // All authenticated users can view details
        data: { title: 'Detalle del Animal' },
        loadComponent: () =>
          import('./pages/animal-detail/animal-detail.page').then(
            (m) => m.DetailPage
          ),
      },
    ],
  },
];
