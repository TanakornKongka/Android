import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchResultPage } from './search-result';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  declarations: [
    SearchResultPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchResultPage),
    NgxPaginationModule,
    // NgxDatatableModule,
  ],
})
export class SearchResultPageModule {}
