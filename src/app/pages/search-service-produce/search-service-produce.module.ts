import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchServiceProducePage } from './search-service-produce';

@NgModule({
  declarations: [
    SearchServiceProducePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchServiceProducePage),
  ],
})
export class SearchServiceProducePageModule {}
