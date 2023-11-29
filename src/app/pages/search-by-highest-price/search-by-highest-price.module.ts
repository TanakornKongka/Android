import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchByHighestPricePage } from './search-by-highest-price';

@NgModule({
  declarations: [
    SearchByHighestPricePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchByHighestPricePage),
  ],
})
export class SearchByHighestPricePageModule {}
