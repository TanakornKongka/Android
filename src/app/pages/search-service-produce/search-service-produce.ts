import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpServiceProvider } from '../../providers/http-service-provider';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import * as AppConst from "../../../app/app.constant";
import { WebHomePage } from '../web-home/web-home';
import { Content } from 'ionic-angular';
import { UtilityProvider } from '../../providers/utility-provider';
import { CompileMetadataResolver } from '@angular/compiler';
import { ResultSearchProducePage } from '../search-produce/result-search-produce/result-search-produce';

@IonicPage()
@Component({
  selector: 'page-search-service-produce',
  templateUrl: 'search-service-produce.html',
})
export class SearchServiceProducePage {

  @ViewChild(Content) content: Content;



  scrollToTop() {
    this.content.scrollToTop();
  }


  private pageData = { pageCode: AppConst.pageCode.canteen, curService: { service: "" } };



  private isDisable = false;
  private isShow = true;

  private user: any;
  private typeForm: FormGroup;

  private id: string = "";
  private nameCompany: string = "";

  private first = [];
  private sent = [];
  private area = [];
 
  private itemSRP = [];
  private itemMoney = [];
  private dummyTable = [];

  private produceItem = { "name": "สินค้า", "nameControl": "productType", "list": [] };

  private srpType = [
      { "name": "สำนักงานสรรพสามิตภาค", "nameControl": "fld1", "firstChoice": "" }
    , { "name": "สำนักงานสรรพสามิตพื้นที่", "nameControl": "fld2", "firstChoice": "" }
    , { "name": "สำนักงานสรรพสามิตพื้นที่สาขา", "nameControl": "fld3", "firstChoice": "" }
  ]

  private moneyStatus = [
    { "name": "สถานะ", "nameControl": "s1fld9", "firstChoice": "" }
  , { "name": "ช่องทางชำระเงิน", "nameControl": "s1fld10", "firstChoice": "" }
]



  private firstB =
    [{
      "key": "777777",
      "value": "เฉพาะหน่วยงานตัวเอง"
    },
    {
      "key": "888888",
      "value": "ทุกพื้นที่สาขา"
    }]


    clear(){

      this.scrollToTop();
      this.getInformation();

    }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
    private iab: InAppBrowser,
    public alertCtrl: AlertController,
    public util: UtilityProvider) {

    this.getObjectForSent();
    this.typeForm = new FormGroup({
      fld1: new FormControl("", Validators.required),//ภาค
      fld2: new FormControl("", Validators.required),//พื้นที่
      fld3: new FormControl("", Validators.required),//พื้นที่สาขา
      offType: new FormControl("1", Validators.required),//พื้นที่ชำระ
      newRegId: new FormControl("", Validators.required),//ทะเบียนสรรพสามิต
      s1fld2_1: new FormControl("", Validators.required),//เลขประจำตัวผู้เสียภาษี
      s1fld4: new FormControl("", Validators.required),//ผู้ประกอบการ
      s1fld6: new FormControl("", Validators.required),//เลขที่ใบเสร็จรับเงิน
      s1fld9: new FormControl("0", Validators.required),//status
      s1fld10: new FormControl("0", Validators.required),//moneyType
      s1fld7: new FormControl("", Validators.required),//startdate
      s1fld8: new FormControl("", Validators.required),//enddate
      taxType: new FormControl("1", Validators.required),
      productType: new FormControl("0", Validators.required)
    });


    this.getInformation();
    this.user = { "company": "Mock_spnOfficeName", "name": "Mock_spnUserName" }
  }


  firstSelect(i) {


    this.first =
      [{
        "key": i + "7700",
        "value": "เฉพาะหน่วยงานตัวเอง"
      },
      {
        "key": i + "8800",
        "value": "ทุก จังหวัด/พื้นที่"
      }]


  }


  ionViewDidLoad() {
  
    // console.log('ionViewDidLoad SearchProducePage');
  }
  openBrowser() {

    const browser = this.iab.create('http://srpuat.excise.go.th/EDSRP/ana/anae0053/printReport')

  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }

  backHome() {
    this.navCtrl.setRoot(WebHomePage);
  }


  getObjectFindArea() {
    this.httpService.http.get("assets/jsonData/Dummy-service-product.json")
      .subscribe(
        (data: any) => {
          this.area = data.findareacode;
        });
  }

  getObjectForSent() {
    this.httpService.http.get("assets/jsonData/Dummy-service-product.json")
      .subscribe(
        (data: any) => {
          this.sent = data.sent;
        });
  }


  newValue() {
    this.typeForm = new FormGroup({
      fld1: new FormControl(this.typeForm.value.fld1, Validators.required),//ภาค
      fld2: new FormControl(this.typeForm.value.fld2, Validators.required),//พื้นที่
      fld3: new FormControl(this.typeForm.value.fld3, Validators.required),//พื้นที่สาขา
      offType: new FormControl(this.typeForm.value.offType, Validators.required),//พื้นที่ชำระ
      newRegId: new FormControl(this.typeForm.value.newRegId, Validators.required),//ทะเบียนสรรพสามิต
      s1fld2_1: new FormControl(this.typeForm.value.s1fld2_1, Validators.required),//เลขประจำตัวผู้เสียภาษี
      s1fld4: new FormControl(this.typeForm.value.s1fld4, Validators.required),//ผู้ประกอบการ
      s1fld6: new FormControl(this.typeForm.value.s1fld6, Validators.required),//เลขที่ใบเสร็จรับเงิน
      s1fld9: new FormControl(this.typeForm.value.s1fld9, Validators.required),//status
      s1fld10: new FormControl(this.typeForm.value.s1fld10, Validators.required),//moneyType
      s1fld7: new FormControl(this.typeForm.value.s1fld7, Validators.required),//startdate
      s1fld8: new FormControl(this.typeForm.value.s1fld8, Validators.required),//enddate
      taxType: new FormControl(this.typeForm.value.taxType, Validators.required),
      productType: new FormControl(this.typeForm.value.productType, Validators.required)
    });
  }


  getValue(service, i) {
    
    switch (i) {

      case 0: this.sent[16].value = service.fld1
       
        if (service.fld1 != "990000") {
          console.log("lemon");
          this.util.popup.loadingActive(true);
          this.area[0].value = this.sent[16].value;
          this.area[1].value = "";
          this.firstSelect(this.area[0].value.charAt(0) + this.area[0].value.charAt(1));
          this.typeForm.value.fld2 = this.area[0].value.charAt(0) + this.area[0].value.charAt(1) + "7700"
          this.itemSRP[2] = this.firstB;
          this.typeForm.value.fld3 = "777777"
          this.getAreaCode();
        } else {
          console.log("");
          
        
          this.getZoneCode();
          this.area[1].value = "";
          this.area[2].value = "";
        }

        break
      case 1:   this.sent[17].value =  service.fld2;
        if(!service.fld2.endsWith("7700") && service.fld2 != "999900" && !service.fld2.endsWith("8800")){
        this.sent[17].value =  this.util.cutIndex(service.fld2);
        this.util.popup.loadingActive(true);
        }else if (this.sent[17].value.endsWith("8800")) {
          this.typeForm.value.fld3 = "888888"
          this.itemSRP[2] = [this.firstB[1]]
          this.newValue();
        } else if  (this.sent[17].value.endsWith("7700")) {
          this.typeForm.value.fld3 = "777777"
          this.getAreaBrachCode();
        }else{
          this.getZoneCode();
          this.area[1].value = "";
          this.area[2].value = "";;
        }

        break
      case 2: this.sent[18].value = service.fld3;
      if(service.fld3 != "777777" && service.fld3 != "888888"){
        this.sent[18].value =  this.util.cutIndex(service.fld3);
         this.util.popup.loadingActive(true);
         console.log("second");
         
       }
      break

    }
    this.util.popup.loadingActive(false);
  }





  getZoneCode() { 
     //this.util.popup.loadingActive(true);
    this.httpService.http.get("assets/jsonData/Dummy-service-product.json")
      .subscribe(
        (data: any) => {
          this.itemSRP[0] = data.fld1;
          this.typeForm.value.fld1 = "990000"
          this.itemSRP[1] = [{ "key": "999900", "value": "ทั้งหมด" }]
          this.itemSRP[2] = [{ "key": "999999", "value": "ทั้งหมด" }]
          this.typeForm.value.fld2 = "999900"
          this.typeForm.value.fld3 = "999999"
          this.newValue()
           if( this.itemSRP[0].length != 1){
             this.util.popup.loadingActive(false);
        }
        },
        (er) => {

        });  
       
     
   }
  
  
  getAreaCode() {
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSearchAreaCode;
    this.httpService.httpPost(this.pageData, this.area,
      (res) => {
        this.itemSRP[1] = this.util.convertJsonToObjectl(res, this.srpType[1].firstChoice);
        this.itemSRP[1] = this.first.concat(this.itemSRP[1]);
        // this.typeForm.value.fld2 = this.itemSRP[1][0].key;
        this.newValue()
      },
      (er) => {

      })
  }
  getAreaBrachCode() {
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSearchAreaBranchCode;
    this.httpService.httpPost(this.pageData, this.area,
      (res) => {
        this.itemSRP[2] = this.util.convertJsonToObjectl(res, this.srpType[2].firstChoice);
        this.itemSRP[2] = this.firstB.concat(this.itemSRP[2]);
        // this.typeForm.value.fld2 = this.itemSRP[1][0].key;
        this.newValue()
      },
      (er) => {

      })
  }

  getProductType() {
    this.pageData.curService = AppConst.serviceAndProductService.getProductList;
    this.httpService.httpPost(this.pageData, "ANAE0047",
      (res) => {
        this.produceItem.list = res;
      },
      (er) => {

      })
  }




  getStatus() {
    this.httpService.http.get("assets/jsonData/Dummy-service-product.json")
      .subscribe(
        (data: any) => {
          this.itemMoney[0] = data.s1fld9;
        });
  }



  getMoney() {
    this.httpService.http.get("assets/jsonData/Dummy-service-product.json")
      .subscribe(
        (data: any) => {
          this.itemMoney[1] = data.s1fld10;
        });
  }


  getCustomer(text) {
    if(text.length == 17){
      this.util.popup.loadingActive(true);
      this.pageData.curService = AppConst.serviceAndProductService.getCustomer;
    this.httpService.httpPost(this.pageData, this.typeForm.value.newRegId,
      (res) => {
        if(res != null && res != [] && res != {} && res != 12 && res.length != 0 && res != [{"error":"error"}]){
          this.id = res[0]._pinnitId;
          this.nameCompany = res[0]._facFullName;

        }     
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
    }
    
  }



  getInformation() {

   
    this.isDisable = false;
    this.isShow = true;
    this.dummyTable = [];
    this.getObjectFindArea()
    this.getObjectForSent()
    if (this.sent != []) {
      console.log("Empty");
      
      this.getZoneCode();
      this.getStatus();
      this.getMoney();
      this.getProductType()
    }
  //  this.scrollToTop();
  }




  getSearchResult() { 
    this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.serviceAndProductService.sentSearch;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
       
        if (res != null && res != [] && res != {} && res != 12 && res.length != 0 && res != [{"error":"error"}]) {
          this.dummyTable = res;
          this.isShow = false;
          this.isDisable = true;
        } else {
          this.isShow = true;
          this.empty();
        }

        this.util.popup.loadingActive(false);

      },
      (er) => {

      })
  }

  startSearch(type) {
    var num: string = type.newRegId;
    var i: number = num.length;
    if (i != 17 && i != 0) {
      this.util.popup.alertPopup('SRP', 'E4006: เลขทะเบียนสรรพสามิตต้องมีความยาว 17 หลักเท่านั้น!', 'OK')
    } else {
      this.setObject()
    }
    console.log(num.length);
    
  }


  setObject() {
    this.sent[16].value = this.typeForm.value.fld1;
    this.sent[17].value = this.typeForm.value.fld2;
    this.sent[18].value = this.typeForm.value.fld3;
    this.sent[19].value = this.typeForm.value.offType;
    this.sent[20].value = this.typeForm.value.newRegId;
    this.sent[21].value = this.typeForm.value.s1fld2_1;
    this.sent[22].value = this.typeForm.value.s1fld4;
    this.sent[23].value = this.typeForm.value.s1fld6;
    this.sent[24].value = this.typeForm.value.s1fld7;
    this.sent[25].value = this.typeForm.value.s1fld8;
    this.sent[26].value = this.typeForm.value.s1fld9;
    this.sent[27].value = this.typeForm.value.s1fld10;
    this.sent[28].value = this.typeForm.value.taxType;
    this.sent[29].value = this.typeForm.value.productType;
    this.getSearchResult()
  }

  empty() {
    this.util.popup.alertPopup('SRP', 'IOOO4:ไม่พบข้อมูลตามเงื่อนไขระบุ', 'OK')
  }

  move() {
    this.navCtrl.push(ResultSearchProducePage);
  }

}
