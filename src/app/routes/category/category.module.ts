import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    CategoryRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    CategoryComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class CategoryModule { }
