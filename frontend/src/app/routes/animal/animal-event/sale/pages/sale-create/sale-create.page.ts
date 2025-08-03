// sale-create.page.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleService } from 'src/app/services/events/sale/sale.service';
import { SaleCreate } from 'src/app/model/events/sale';
import { IonicModule } from '@ionic/angular';
import SaleFormComponent from '../../components/sale-form/sale-form.component';

/**
 * Página para crear una venta de un animal
 */
@Component({
  selector: 'app-sale-create',
  templateUrl: './sale-create.page.html',
  styleUrls: ['./sale-create.page.scss'],
  standalone: true,
  imports: [IonicModule, SaleFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-sale-create' },
})
export class SaleCreatePage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private saleService = inject(SaleService);

  animalId = this.route.snapshot.paramMap.get('animal_id') ?? '';

  async handleSave(data: SaleCreate) {
    try {
      await this.saleService.createSale(this.animalId, data);
      this.router.navigate(['/eventos', this.animalId]);
    } catch (err) {
      console.error('Error creando venta', err);
    }
  }
}
