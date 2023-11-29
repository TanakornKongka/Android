import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UtilityProvider } from "../../../providers/utility-provider";
import { HttpServiceProvider } from '../../../providers/http-service-provider';
import * as AppConst from "../../../../app/app.constant";
import { PopoverLoadExcelPage } from '../../../pages/search-produce/popover-load-excel/popover-load-excel';
import { PopoverController, PopoverOptions } from 'ionic-angular';
import { PopoverSearchDiscoverPage } from '../popover-search-discover/popover-search-discover';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AnonymousSubject } from 'rxjs/Subject';

@IonicPage()
@Component({
  selector: 'page-result-search-discovered',
  templateUrl: 'result-search-discovered.html',
})
export class ResultSearchDiscoveredPage {
  private showFab = [];
  private iconFab = [];
  private deleteItem = [];
  private allDelete = false;
  private page = 1;
  private productItems = [];
  private prize = 0;
  private isDelete = false;

  private isCanDelete: boolean;

  private refresh: any;
  private pre: number;
  private isOpen = 0;
  private pageData = { pageCode: AppConst.pageCode.canteen, curService: { service: "" } };
  private sent = { "svctl_no": "S000000000230", "item_no": "1", "price": "1,300,000.00" };
  private url: any;
  private amount = 0;
  private itemShow = [];
  private productItemShowSize = 0;
  private startDate: number = null;
  private endDate: number = null;
  constructor(public navCtrl: NavController,
    public util: UtilityProvider,
    public popoverCtrl: PopoverController,
    public httpService: HttpServiceProvider,
    public alertCtrl: AlertController,
    public navParams: NavParams) {
    this.productItems = this.navParams.get('itemList');
    this.refresh = this.navParams.get('sent');
    this.url = this.navParams.get('url');
    if (this.url == AppConst.srpSerchDiscoveredPageService.sentSearchByArea) {
      this.isCanDelete = true;
    } else {
      this.isCanDelete = false;
    }
    this.generateList(this.productItems, false);
    // if(this.productItems.length<20){
    //  this.itemShow = this.productItems;
    // }else{
    //   for(let i = 0;i<20;i++){
    //     this.itemShow.push(this.productItems[i]);
    //   }
    // }
   this.callServiceGetSearchRoundNo();
  }

  async generateList(product, check) {
    console.log("--->",product)
    this.showFab = [];
    this.iconFab = []; 
    this.deleteItem = [];
    
    
    
    if (product != undefined) {
      for (let i in product) {
        product[i].product_name = await this.cutIndex(product[i].product_name);
        // await this.deleteItem.push(check);
        await this.showFab.push(false);
        await this.iconFab.push("md-create");
      }
      let mapObj = _.map(product, (item:any) => {
        item.productDate = Number(moment(item.product_name[4], 'DD/MM/YYYY').format('YYYYMMDD'));
        if(item.productDate >= this.startDate && item.productDate <= this.endDate){
          this.deleteItem.push(check);
        }else{
          this.deleteItem.push(false);
        }
        return item;
      });
      this.itemShow = mapObj;
      this.amount = await this.itemShow.length;
    }
   
  }
  
  // doInfinite(infiniteScroll) {
  //   console.log('Begin async operation');
  //   setTimeout(() => {
  //     this.productItemShowSize = this.itemShow.length;
     
  //     if(this.page<=Math.floor(this.productItems.length/20)){
  //       for(let i = 0;i<20;i++){
  //         this.itemShow.push(this.productItems[(this.productItemShowSize-1)+i]);
  //       }
  //       this.page++;
  //     }
  //     if(this.itemShow.length<this.productItems.length){
  //     if(this.productItems.length%20!=0 && this.itemShow.length==this.productItems.length-(this.productItems.length%20)){
  //       for(let i = this.productItems.length-(this.productItems.length%20);i<this.productItems.length;i++){

  //         this.itemShow.push(this.productItems[i]);
  //       }
  //     }
  //   }
  //   if(this.itemShow.length == this.productItems.length){
  //     infiniteScroll.complete();
  //     infiniteScroll.enable(false);
  //   }
  //     console.log(this.page);
  //     infiniteScroll.complete();
  //     // for(let i = 0;i<20;i++){
  //     //   this.itemShow.push(this.productItems[(this.itemShow.length-1)+i]);
  //     //   console.log(this.productItems[(this.itemShow.length-1)+i]);
  //     // }
      
  //   }, 500);
  // }

  getDelete(i) {
    this.deleteItem[i] = !this.deleteItem[i];
    this.allDelete = false;
  }

  closeEdit(i) {
    this.showFab[i] = false;
    this.iconFab[i] = "md-create";
  }


  showEdit(i, product) {
     let price = ""
     let prices = product.product_name[3].split(',');

      for(let a = 0 ; a<prices.length ; a++){
           price = price+prices[a];
      }
  
    if (this.showFab[i] == false) {
      this.closeEdit(this.pre);
      this.showFab[i] = true;
      this.prize =  parseFloat(price);
      this.iconFab[i] = "md-checkmark";
      this.pre = i;
    } else {
      this.sentEdit(product)
    }
  }

  deleteAll(check) {
    console.log(check)
      this.allDelete = !check;
      this.refreshPage(this.allDelete);
  }


  choseDelete() {
    let deleteList = [];

    for (let i = 0; i < this.deleteItem.length; i++) {
      if (this.deleteItem[i] == true) {
        let p = this.itemShow[i].jsonPrimaryKey.SVCTL_NO;
        let l = this.itemShow[i].jsonPrimaryKey.ITEM_NO;
        let value = {
          "ITEM_NO": l,
          "SVCTL_NO": p
        };
        deleteList.push(value);
      }
    }
  
    this.alertDelete(deleteList);
  }

  alertDelete(deleteList) {
    let title: string;
    let message: string;
    let button = [];
    if (deleteList.length == 0) {
      title = 'ไม่พบรายการที่ต้องการลบ'
      message = 'ต้องการทำการลบรายการต่อหรือไม่'
      button = [
        {
          text: 'ยกเลิก',
          handler: () => {
            this.isDelete = false;
          }
        },
        {
          text: 'ตกลง',
          handler: () => { }
        }
      ]
    } else {
      title = 'ยืนยันการลบ'
      message = 'ยืนยันการลบสินค้า ' + deleteList.length + ' รายการ'
      button = [
        {
          text: 'ยกเลิก',
          handler: () => { }
        },
        {
          text: 'ตกลง',
          handler: () => {
            this.sentDelete(deleteList)
          }
        }
      ]
    }
    this.buildAlert(title, message, button);
  }

  buildAlert(title, message, button) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      cssClass: "srp-delete-alert",
      buttons: button
    });
    alert.present();
  }

  async sentDelete(deleteList) {
    console.log("deleteList : ",deleteList);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.deleteSearch;
    await this.httpService.httpPost(this.pageData, deleteList,
      async (res) => {
        await this.refreshPage(false);
      },
      (er) => {

      })
  }


  sentEdit(product) {
    let p = product.jsonPrimaryKey.SVCTL_NO;
    let l = product.jsonPrimaryKey.ITEM_NO;

    this.sent = {
      "svctl_no": p,
      "item_no": l,
      "price": this.prize.toString()
    };

    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.editProduct;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.refreshPage(false);
      },
      (er) => {

      })
  }

  async refreshPage(check) {
    this.util.popup.loadingActive(true);
    this.pageData.curService = this.url;
    await this.httpService.httpPost(this.pageData, this.refresh,
      async (res) => {
        let mapObj = await _.map(res, (item:any )=> {
          item.jsonPrimaryKey = JSON.parse(item.jsonPrimaryKey);
          return item;
        });
        await this.generateList(mapObj, check);
        this.util.popup.loadingActive(false);
      },
      (er) => {

      })
  }




  cutIndex(text): any {
    console.log(text)
    let txt = text;
    let textSent : any = [];
    // textSent[0] = txt.split('ยี่ห้อ : ')[1].split('<br>แบบ')[0];
    // textSent[1] = txt.split('แบบ/รุ่น : ')[1].split('<br>ขนาด')[0].replace('<br>',' ');
    // textSent[2] = txt.split('ขนาด/หน่วย : ')[1].split('ราคาสำรวจ : ')[0].replace('<br>', ' ');
    // textSent[3] = txt.split('ราคาสำรวจ : ')[1].split("'>")[1].split('บาท')[0];
    // textSent[4] = txt.split('วันที่สำรวจ : ')[1].substr(0,10);
    // textSent[5] = txt.split('ชื่อร้านค้า : ')[1].split('<br>ประเภทสถานที่ขายสินค้า')[0];
    // textSent[6] = txt.split('ประเภทสถานที่ขายสินค้า : ')[1].split('<br>กลุ่มร้านค้า')[0];
    // textSent[7] = txt.split('กลุ่มร้านค้า : ')[1].split('<br>อำเภอ')[0];
    // textSent[8] = txt.split('อำเภอ/จังหวัด : ')[1].split('<br>ผู้สำรวจ')[0];
    // textSent[9] = txt.split('ผู้สำรวจ : ')[1].split('<br>สำรวจครั้งที่')[0];
    // textSent[10] = txt.split('สำรวจครั้งที่ : ')[1].split('<br>แหล่งที่มา')[0];
    // textSent[11] = txt.split('แหล่งที่มา: ')[1];

    textSent = text.split('<br>');
    for (let i = 0; i < 11; i++) {
      if (i != 4) {
        textSent[i] = textSent[i].split(':')[1];
      } else {
        textSent[4] = textSent[4].split(' ')[2] + " " + textSent[4].split(' ')[3];
      }
    }

    if (this.url == AppConst.srpSerchDiscoveredPageService.sentSearchByArea) {
        textSent[3] = textSent[3].split('>')[1];
        textSent[3] = textSent[3].split('</label')[0];
        textSent[3] = textSent[3].split(' ')[0] + " ";
    }else{
      textSent[3] = textSent[3].replace("บาท","");
    }
    return textSent;
  }

  private popOver(ev) {
    if (this.url == AppConst.srpSerchDiscoveredPageService.sentSearchByArea) {
      let popover = this.popoverCtrl.create(PopoverSearchDiscoverPage,{isDelete:this.isDelete});
      popover.present({
        ev: ev
      });

      popover.onDidDismiss(data => {
        this.openDeleteITem(data)
      });
    }

  }

  openDeleteITem(i) {
    if (i == 1) {
      this.isDelete = true; 
      this.util.popup.loadingActive(false);
    }else if(i == 2){
      this.isDelete = false;
      this.allDelete = false;
      for (let i of this.itemShow) {
        this.deleteItem.push(this.isDelete);
      }
      this.util.popup.loadingActive(false);
    }  
  }

  callServiceGetSearchRoundNo(){
    this.pageData.curService = AppConst.srpService.searchRoundNo;
    this.httpService.httpPost(this.pageData, [],
    (res) => { 
      this.startDate = Number(moment(res.STARTDATE).add(543 ,'year').format('YYYYMMDD'));
      this.endDate = Number(moment(res.ENDDATE).add(543 ,'year').format('YYYYMMDD'));
      console.log("startDate : ",this.startDate);
      console.log("endDate : ",this.endDate);
    },
    (er) => {});
  }
}
