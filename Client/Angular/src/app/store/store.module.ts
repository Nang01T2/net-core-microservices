import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { SharedModule } from "../shared/shared.module";
import { ProductItemsComponent } from './product-items/product-items.component';

@NgModule({
  declarations: [StoreComponent, ProductItemsComponent],
  imports: [CommonModule, SharedModule],
  exports: [StoreComponent],
})
export class StoreModule {}
