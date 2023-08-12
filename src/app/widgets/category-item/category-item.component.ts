import { Component, Input } from '@angular/core';
import { Data } from 'src/app/Data';
import { Category } from 'src/app/Models/Category';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})
export class CategoryItemComponent {
  category_image_path: string = Data.domain + '/category/';
  
  @Input() category!: Category;

}
