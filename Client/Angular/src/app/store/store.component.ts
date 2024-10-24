import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { IProduct } from "../shared/models/product";
import { StoreService } from "./store.service";
import { IBrand } from "../shared/models/brand";
import { IType } from "../shared/models/type";
import { StoreParams } from "../shared/models/storeParams";

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrl: "./store.component.scss",
})
export class StoreComponent implements OnInit {
  @ViewChild("search") searchTerm?: ElementRef;

  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  storeParams = new StoreParams();
  totalCount = 0;
  sortOptions = [
    { name: "Alphabetical", value: "name" },
    { name: "Price: Ascending", value: "priceAsc" },
    { name: "Price: Descending", value: "priceDesc" },
  ];

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.storeService.getProducts(this.storeParams).subscribe({
      next: (response) => {
        console.log("response=", response);
        this.products = response.data;
        this.storeParams.pageIndex = response.pageIndex;
        this.storeParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: (error) => console.log("error=", error),
    });
  }

  getBrands() {
    this.storeService.getBrands().subscribe({
      next: (response) => {
        this.brands = [{ id: "", name: "All" }, ...response];
      },
      error: (error) => console.log(error),
    });
  }

  getTypes() {
    this.storeService.getTypes().subscribe({
      next: (response) => {
        this.types = [{ id: "", name: "All" }, ...response];
      },
      error: (error) => console.log(error),
    });
  }

  onTypeSelected(typeId: string) {
    this.storeParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.storeParams.sort = sort;
    this.getProducts();
  }

  onBrandSelected(brandId: string) {
    this.storeParams.brandId = brandId;
    this.getProducts();
  }

  onPageChanged(event: any) {
    this.storeParams.pageIndex = event.page;
    this.getProducts();
  }

  onSearch() {
    this.storeParams.search = this.searchTerm?.nativeElement.value;
    this.storeParams.pageIndex = 1;
    this.getProducts();
  }

  onReset() {
    if (this.searchTerm) {
      this.searchTerm.nativeElement.value = "";
      this.storeParams = new StoreParams();
      this.getProducts();
    }
  }
}
