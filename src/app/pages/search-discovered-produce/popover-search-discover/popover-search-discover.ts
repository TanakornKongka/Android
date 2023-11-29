import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { UtilityProvider } from '../../../providers/utility-provider';

/**
 * Generated class for the PopoverSearchDiscoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover-search-discover',
  templateUrl: 'popover-search-discover.html',
})
export class PopoverSearchDiscoverPage {
  private isDelete:boolean;
  private dataText:string;
  constructor(public navCtrl: NavController
            , public navParams: NavParams 
            , public viewCtrl: ViewController
            , public util: UtilityProvider) {
              this.isDelete= this.navParams.get('isDelete');
              if(this.isDelete == false){
                 this.dataText = "ลบสินค้า"
              }else{
                this.dataText = "ยกเลิกการลบสินค้า"
              }
             
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverSearchDiscoverPage');
  }

  openBrowser() {
    this.util.popup.loadingActive(true);
    if(this.isDelete == false){
      this.viewCtrl.dismiss(1)
      
    }else if(this.isDelete == true){
      
      this.viewCtrl.dismiss(2)
      
    }

    
  }
 

}
