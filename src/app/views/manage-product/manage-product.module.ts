import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { FormsRoutingModule } from '../forms/forms-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { CustomFormsModule } from 'ngx-custom-validators';
import { ImageCropperModule } from 'ngx-img-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ManageProductComponent } from './manage-product.component';
import { ManageProductRouting } from './manage-product-routing.module';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    CustomFormsModule,
    NgbModule,
    TagInputModule,
    ImageCropperModule,
    TextMaskModule,
    FormWizardModule,
    FormsRoutingModule,
    ManageProductRouting,
    NgxPaginationModule,
    NgxDatatableModule
  ],
  declarations: [ManageProductComponent]
})
export class ManageProductModule { 

  
  
}
