import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [StoreComponent],
  imports: [CommonModule, SharedModule],
  exports: [StoreComponent],
})
export class StoreModule {}
