import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchProducePage } from './search-produce';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    SearchProducePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchProducePage),
    SelectSearchableModule,
    AngularSvgIconModule
  ],
})
export class SearchProducePageModule {}
