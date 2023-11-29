import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilityProvider } from "../../providers/utility-provider";

/**
 * Generated class for the SecondMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-second-menu',
  templateUrl: 'second-menu.html',
})
export class SecondMenuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public util: UtilityProvider) {
  }

  private titleButton = "สินค้าที่ไม่ได้ขึ้นทะเบียน Barcode"

  private isOpen = true

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecondMenuPage');
  }


  openUnregistBarcode() {

    if (this.isOpen == false) {

      this.titleButton = "สินค้าที่ไม่ได้ขึ้นทะเบียนบาร์โค้ด"
      this.isOpen = true;

    } else {
      this.titleButton = "Scan Barcode"

      this.isOpen = false;

    }

    console.log(this.titleButton);

  }

}
