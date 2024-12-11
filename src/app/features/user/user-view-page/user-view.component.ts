import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { CategoriesComponent } from '../components/categories/categories.component';
import { Product } from '@core/models/product.model';
import { Category } from '@core/constants/category.constant';
import { RatingComponent } from '../components/rating/rating.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { PaginationComponent } from '../../../layouts/pagintion/pagination.component';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [
    CurrencyPipe,
    AsyncPipe,
    NgFor,
    NgIf,
    SlicePipe,
    CategoriesComponent,
    PaginationComponent,
    RatingComponent,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  providers: [ProductService],
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition(':enter, :increment', [
        query('.product-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
        ]),
      ]),
    ]),
  ],
})
export class UserViewComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  totalProducts = 0;
  pageSize = 5;
  currentPage = 1;
  loading = true;
  selectedCategory: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(private productService: ProductService , private titleService : Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('User Page');
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    const categorySubscription = this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error(err);
      },
    });
    this.subscriptions.add(categorySubscription);
  }

  onCategorySelected(category: string): void {
    if (this.selectedCategory === category) {
          this.selectedCategory = null;
          this.loadProducts();
      return;
    }

    this.selectedCategory = category;
    this.loadProductsByCategory(category);
  }

  loadProductsByCategory(category: string): void {
    this.loading = true;
    const categoryProductsSubscription = this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.updateProductList(products);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
    this.subscriptions.add(categoryProductsSubscription);
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts();
    const productsSubscription = this.productService.products$.subscribe((data) => {
      this.products = data;
      this.updateProductList(data);
      this.totalProducts = data.length;
    });
    this.subscriptions.add(productsSubscription);
  }

  updateProductList(products: Product[]): void {
    this.products = products;
    this.totalProducts = products.length;
    this.paginateProducts(0, this.pageSize);
    this.loading = false;
  }

  onPageChange(page: any): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  paginateProducts(startIndex: number, endIndex: number): void {
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
