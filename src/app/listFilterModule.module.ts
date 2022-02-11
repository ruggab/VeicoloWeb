import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import { ListFilterPipe } from './listFilter';

@NgModule({
  declarations:[ListFilterPipe], // <---
  imports:[CommonModule],
  exports:[ListFilterPipe] // <---
})

export class FilterListModule{}