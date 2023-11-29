import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the PopoverLoadExcelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover-load-excel',
  templateUrl: 'popover-load-excel.html',
})
export class PopoverLoadExcelPage {

  constructor(public navCtrl: NavController,  
              private iab: InAppBrowser,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverLoadExcelPage');
  }

  openBrowser() {

    const browser = this.iab.create('http://srpuat.excise.go.th/EDSRP/srp/srpi0001/printReportExcel')

  }
}
