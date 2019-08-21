import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TestRoutingModule } from './test-routing.module';
import { HelloComponent } from './hello/hello.component';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TestRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    HelloComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TestModule { }
