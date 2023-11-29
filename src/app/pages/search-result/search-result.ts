import { SearchData, Save } from './../../providers/search-data-model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as AppConst from "../../app.constant";
import { HttpServiceProvider } from '../../providers/http-service-provider';
import { UtilityProvider } from '../../providers/utility-provider';
import { CurrencyPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {
  rows = [];
  data = [];
  datas = [];
  requestData = [];
  searchDataNonBarcode: Array<SearchData>;
  searchData: SearchData;
  recordNumber: number = 0;
  saveModel: Save;
  perPage: number = 10;
  page: number = 1;
  totalPage: number;
  private storeDetails: any;
  private roundTypeForm: any;
  private addressTypeForm: any;
  private storeDetailsTypeForm: any;
  private pageData = { pageCode: AppConst.pageCode.survey_retail_product, curService: { service: "" } };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private httpService: HttpServiceProvider,
    public util: UtilityProvider,
    public currencyPipe: CurrencyPipe,
  ) {
    this.data = navParams.get('datas');
    this.roundTypeForm = navParams.get('roundTypeForm');
    this.storeDetails = navParams.get('storeDetails');
    this.addressTypeForm = navParams.get('addressTypeForm');
    this.storeDetailsTypeForm = navParams.get('storeDetailsTypeForm');
    this.requestData = navParams.get('requestData');
    this.totalPage = this.data[0].total;
  }

  ionViewDidLoad() {
    console.log('do get data')
    this.recordNumber = this.data[0].total;
    this.fecthData(1);
  }

  numberOnly(event: any): boolean {
    console.log('event')
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getData(fecthDatas: boolean, res: any): void {
    console.log('do get data')
    if (fecthDatas) {
      this.datas = res;
    } else {
      this.datas = this.data;
    }
    if (this.storeDetails == null) {
      this.storeDetails = {
        storeName: "Mock Store Name"
      }
    }
    this.searchDataNonBarcode = new Array<SearchData>();
    for (var i = 0; i < this.datas.length; i++) {
      this.searchData = new SearchData();
      if (this.datas[i].surveyPrice > 0) {
        this.searchData.disable = true;
        this.searchData.surveyPrice = this.formatMoney(this.datas[i].surveyPrice);
        console.log("__>",this.searchData.surveyPrice)
      } else {
        this.searchData.surveyPrice = "";
        this.searchData.disable = false;
      }
      this.searchData.productId = this.datas[i].productId;
      this.searchData.productName = this.datas[i].productName;
      this.searchData.index = i;
      this.searchDataNonBarcode.push(this.searchData);
    }
    this.rows = this.searchDataNonBarcode;
  }

  isNotNull(value: string): string {
    if (this.util.isNotNullOrEmpty(value)) {
      return value;
    }
    return "";
  }

  dismiss(): void {
    let data = '';
    this.viewCtrl.dismiss(data);
  }

  changeValue(value: any, item: any): void {
    this.searchDataNonBarcode[item.index].surveyPrice = value.value.toString();
  }

  insert(value: any): void {
    if (value.surveyPrice > 0) {
      let requestData =
      {
        "storeId": this.isNotNull(this.storeDetails.storeId),
        "storeCode": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.storeCode),
        "storeName": this.storeDetailsTypeForm.value['storeName'],
        "storeTypeCode": this.storeDetailsTypeForm.value['storeLocationType'],
        "storeGroupCode": this.storeDetailsTypeForm.value['storeGroupType'],
        "provinceCode": this.storeDetailsTypeForm.value['storeProvince'],
        "provinceName": '',
        "amphurCode": this.addressTypeForm.value['district'],
        "amphurName": '',
        "productId": value.productId,
        "surveyPrice": value.surveyPrice,
        "surveyNo": this.roundTypeForm.value['surveyPeriod'],
        "yearSurvey": this.roundTypeForm.value['surveyYear'],
        "surveyFrom": "MOBILE",
        "zoneCode": ""
      };
      this.util.popup.loadingActive(true);
      this.pageData.curService = AppConst.srpService.saveProductNonBarcodeData;
      this.httpService.httpPost(this.pageData, requestData,
        (res: any) => {
          this.util.popup.loadingActive(false);
          if (!this.util.isNotNullOrEmpty(res)) {
            localStorage.clear();
            window.location.reload();
          }
          if (res[0].error == "error") {
            this.util.popup.alertPopup('SRP', 'บันทึกข้อมูลไม่สำเร็จ', 'OK');
          } else {
            this.util.popup.alertPopup('SRP', 'บันทึกข้อมูลสำเร็จ', 'OK', () => {
              this.searchDataNonBarcode[value.index].surveyPrice = this.formatMoney(value.surveyPrice);
              this.searchDataNonBarcode[value.index].disable = true;
              // this.getData(true, this.searchDataNonBarcode);
            });
          }
          // if (endProcess) {
          //   this.navCtrl.popToRoot();
          // }
        },
        (er: any) => {
          this.util.popup.loadingActive(false);
          console.log(er);
        });
    } else {
      this.searchDataNonBarcode[value.index].surveyPrice = "";
      this.util.popup.alertPopup('SRP', 'ราคาต้องมากกว่า 0 บาท', 'OK');
    }
  }

  fecthData(rowPage: number): void {
    this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.searchDataNonBarcode;
    let req = [
      { "name": "groupId", "value": this.requestData[0].value },
      { "name": "prodCatagory", value: this.requestData[1].value },
      { "name": "degree", value: this.requestData[2].value },
      { "name": "sizeDesc", value: this.requestData[3].value },
      { "name": "sizeUnit", value: this.requestData[4].value },
      { "name": "productDesc", value: this.requestData[5].value },
      { "name": "storeId", value: this.requestData[6].value },
      { "name": "yearSurvey", value: this.requestData[7].value },
      { "name": "surveyNo", value: this.requestData[8].value },
      { "name": "mode", value: "" },
      { "name": "rowPage", value: rowPage },
    ]
    this.httpService.httpPost(this.pageData, req,
      (res: any) => {
        this.util.popup.loadingActive(false);
        if (res.length == 0 || res[0].error == "error") {
          this.util.popup.alertPopup('SRP', 'E0011: ไม่พบข้อมูลที่ค้นหา', 'OK');
          this.dismiss();
        } else {
          this.getData(true, res);
        }
      },
      (er: any) => {
        this.util.popup.loadingActive(false);
        this.util.popup.alertPopup('SRP', 'E0011: ไม่พบข้อมูลที่ค้นหา', 'OK');
        console.log(er);
      });
  }

  formatMoney(value: any): string {
    let current = (value === '') ? '' : this.currencyPipe.transform(value.replace(/\,/g, "")).replace("", "").substring(4);
    return value.charAt(0) === '-' ? "-" + current : current;
  }

  formatPrice(value: any): string {
    return (value === '') ? '' : value.substring(4).replace(/[^\d\.]/g, '');
  }

  pageChanged(page: number): void {
    this.page = page;
    this.fecthData(page);
  }
}
