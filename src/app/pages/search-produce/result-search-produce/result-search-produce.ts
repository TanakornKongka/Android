import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, List } from 'ionic-angular';
import { UtilityProvider } from "../../../providers/utility-provider";
import { PopoverLoadExcelPage } from '../../../pages/search-produce/popover-load-excel/popover-load-excel';
import { PopoverController, PopoverOptions } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as AppConst from "../../../../app/app.constant";
@IonicPage()
@Component({
  selector: 'page-result-search-produce',
  templateUrl: 'result-search-produce.html',
})

export class ResultSearchProducePage {

  private splite = [];
  private itemList = [];
  private saleTypeSelected = 0;
  private saleTypeId = 0;
  private dateSource: any;
  private saleType = "";
  private resultList: Array<resultSerchProduce>;
  private searchTitle: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public util: UtilityProvider
  ) {
    this.itemList = this.navParams.get('itemList');
    this.saleTypeSelected = this.navParams.get('saleTypeSelected');
    this.searchTitle = this.navParams.get('searchTitle');
    // if (this.searchTitle === '1') {
      this.resultList = new Array<resultSerchProduce>();
      for (let i = 0; i < this.itemList.length; i++) {
        var result = new resultSerchProduce();
        result.showregId = "เลขทะเบียนสรรพสามิต : " + this.itemList[i].showregId;
        result.facName = this.itemList[i].titleName + " " + this.itemList[i].facName + " " + this.itemList[i].suffixName;
        result.brandName = this.itemList[i].brandName + " " + this.itemList[i].brandSecond;
        result.desc = this.itemList[i].modelDesc + " " + this.itemList[i].degreeDesc + " " + this.itemList[i].sizeDesc;
        result.barcode = "barcode : " + this.itemList[i].barcode;
        result.usedDate = this.itemList[i].usedDate;
        result.retailPrice = this.itemList[i].retailPrice + " บาท";
        this.resultList.push(result);
      }
    // } 
    // else {
    //   for (let i = 0; i < this.itemList.length; i++) {
    //     this.splite.push(this.cutIndex(this.itemList[i].product_name));
    //   }
    //   let sortMapObj = _.sortBy(this.splite, async (item) => {
    //     let convertDate = await moment(item[3]).format('YYYYMMDD');
    //     return Number(convertDate);
    //   });
    //   this.dateSource = sortMapObj.reverse();
    //   this.resultList = new Array<resultSerchProduce>();
    //   for (let i = 0; i < this.dateSource.length; i++) {
    //     var result = new resultSerchProduce();
    //     result.showregId = this.dateSource[i][0];
    //     result.facName = this.dateSource[i][1];
    //     result.brandName = this.dateSource[i][2][0];
    //     result.desc = this.dateSource[i][2][1];
    //     result.barcode = this.dateSource[i][3];
    //     result.usedDate = this.dateSource[i][4];
    //     result.retailPrice = this.dateSource[i][6];
    //     this.resultList.push(result);
    //   }
    // }
  }

  private checkSaleType(i: number) {
    this.saleType = this.cutIndex(this.itemList[i].product_name)[7];
    if (this.saleType.trim() == "ส่งออก") {
      this.saleTypeId = 2;
    }
    else {
      this.saleTypeId = 1;
    }
  }

  cutIndex(text): any {
    let textSent
    textSent = text.split('<br>');
    textSent[2] = textSent[2].split('  ');
    if (textSent[2].length == 3) {
      textSent[2][0] = textSent[2][0] + textSent[2][1]
    }
    textSent[4] = textSent[4].split(':')[1];
    textSent[4] = _.trim(textSent[4]);
    textSent[6] = textSent[5].split(':')[1];
    textSent[7] = textSent[5].split(':')[0].substring(16, textSent[5].split(':')[0].length);

    return textSent;
  }


  // doInfinite(infiniteScroll) {
  //   console.log('Begin async operation');

  //   setTimeout(() => {
  //     for (let i = this.splite.length; i < this.splite.length+10; i++) {
  //       this.splite.push(this.cutIndex(this.itemList[i].product_name));
  //     }

  //     infiniteScroll.complete();
  //   }, 500);
  // }

}

class resultSerchProduce {
  "showregId": string;
  "facName": string;
  "brandName": string;
  "desc": string;
  "barcode": string;
  "usedDate": string;
  "retailPrice": string;
}
