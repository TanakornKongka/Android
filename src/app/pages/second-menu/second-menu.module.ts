import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondMenuPage } from './second-menu';

@NgModule({
  declarations: [
    SecondMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondMenuPage),
  ],
})
export class SecondMenuPageModule {}
