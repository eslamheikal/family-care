import { Component, inject } from '@angular/core';
import { PagedList } from '../shared/models/paged-list.model';
import { ProductService } from '../shared/services/product.service';
import { GridColumn } from '../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../shared/enums/column.filter.type.enum';
import { CardContainer } from '../shared/components/card-container/card-container';
import { CardModule } from 'primeng/card';
import { Grid } from '../shared/components/grid/grid';
import { CancelBtn } from "../shared/buttons/cancel-btn/cancel-btn";
import { SaveBtn } from '../shared/buttons/save-btn/save-btn';
import { AddBtn } from "../shared/buttons/add-btn/add-btn";
import { Dropdown } from '../shared/components/dropdown/dropdown';
import { DropdownProps } from '../shared/props/dropdown.props';
import { DeleteConfirmation } from '../shared/components/delete-confirmation/delete-confirmation';
import { CommonModule } from '@angular/common';
import { ProgressBar } from '../shared/components/progress-bar/progress-bar';
import { Switch } from '../shared/components/switch/switch';
import { LoaderService } from '../shared/services/loader.service';

@Component({
  selector: 'app-ui-controls',
  imports: [Grid, CommonModule, CardModule, CardContainer, CancelBtn, SaveBtn, AddBtn, Dropdown, DeleteConfirmation,
    ProgressBar, 
    Switch
  ],
  templateUrl: './ui-controls.html',
  styleUrl: './ui-controls.scss'
})
export class UiControls {
   //#region Services
   products!: PagedList<any>;
   private productService = inject(ProductService);
   columns: GridColumn[] = [
     {field: 'name', title: 'الاسم', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text},
     {field: 'price', title: 'السعر', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text},
     {field: 'category', title: 'الصنف', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text},
     {field: 'description', title: 'الوصف', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text},
     {field: 'image', title: 'الصورة', columnType: ColumnTypeEnum.image, sortable: true, filterType: ColumnFilterTypeEnum.text},
     // {field: 'quantity', title: 'Quantity'},
     // {field: 'inventoryStatus', title: 'Inventory Status'},
   ];

   options: DropdownProps[] = [
    {label: 'الاسم', value: 'name'},
    {label: 'السعر', value: 'price'},
    {label: 'الصنف', value: 'category'},
    {label: 'الوصف', value: 'description'},
    {label: 'الصورة', value: 'image'},
   ];

   //#endregion
   
   public loaderService = inject(LoaderService);

   ngOnInit() {
     this.products = this.productService.getProductsDataPaged();
     this.products.items.forEach(item => {
       item.image = 'https://primefaces.org/cdn/primeng/images/demo/product/' + item.image;
       item.allowView = true;
       item.allowEdit = true;
       item.allowDelete = true;
     });
   }


   showDelete = false;
   showDeleteConfirmation() {
    this.showDelete = true;
  }

  onDeleteConfirm() {
    this.showDelete = false;
  }

  onDeleteCancel() {
    this.showDelete = false;
  }
}
