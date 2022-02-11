import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboadDefaultComponent } from './dashboad-default/dashboad-default.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { FilterListModule } from '../../listFilterModule.module';



@NgModule({
  imports: [
    MatTableModule,
    CommonModule,
    SharedComponentsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    FormsModule,
    NgbModule,
    DashboardRoutingModule,
    FilterListModule
      ],
  declarations: [
    DashboadDefaultComponent
    ]
})
export class DashboardModule { }
