import { Component, inject } from '@angular/core';
import { Grid } from '../shared/components/grid/grid';
import { ProductService } from '../shared/services/product.service';
import { PagedList } from '../shared/models/paged-list.model';
import { GridColumn } from '../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../shared/enums/column.filter.type.enum';
import { CardModule } from 'primeng/card';
import { CardContainer } from "../shared/components/card-container/card-container";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // imports: [Grid, CardModule, CardContainer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

 
}
