import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { StoreService } from './store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  products: IProduct[] = [];
  constructor(private storeService: StoreService) {}
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this.storeService.getProducts().subscribe({
      next: (response: { data: IProduct[] }) => {
        this.products = response.data;
      },
      error: (error: any) => console.log(error),
    });
  }
}
