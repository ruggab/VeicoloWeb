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
import { CreazioneVeicoloComponent } from './creazione-veicolo.component';
import { CreazioneVeicoloRouting } from './creazione-veicolo-routing.module';
import { UploadFileComponent } from 'src/app/shared/components/upload-file/upload-file.component';

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
    CreazioneVeicoloRouting,
    NgxPaginationModule,
    NgxDatatableModule
  ],
  declarations: [CreazioneVeicoloComponent, UploadFileComponent]
})
export class CreazioneVeicoloModule { }
