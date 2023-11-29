import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchDiscoveredProducePage } from './search-discovered-produce';

@NgModule({
  declarations: [
    SearchDiscoveredProducePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchDiscoveredProducePage),
  ],
})
export class SearchDiscoveredProducePageModule {}
