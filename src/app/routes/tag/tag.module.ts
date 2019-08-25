import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TagRoutingModule } from './tag-routing.module';
import { TagComponent } from './tag.component';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TagRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    TagComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TagModule { }
