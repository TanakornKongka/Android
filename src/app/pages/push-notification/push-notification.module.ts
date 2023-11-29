import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PushNotificationPage } from './push-notification';

@NgModule({
  declarations: [
    PushNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(PushNotificationPage),
  ],
})
export class PushNotificationPageModule {}
