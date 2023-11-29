import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpServiceProvider } from '../../providers/http-service-provider';
import { Platform,AlertController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { LoginPage } from '../login/login';
import { UtilityProvider } from '../../providers/utility-provider';
import { Content } from 'ionic-angular';
import * as AppConst from "../../../app/app.constant";

@IonicPage()
@Component({
  selector: 'page-search-by-highest-price',
  templateUrl: 'search-by-highest-price.html',
})
export class SearchByHighestPricePage {

  @ViewChild(Content) content: Content;
  private brandMainList = [];
  private typeForm: FormGroup;
  private user: any;
  private result:any = [];
  private searchTitle = "1";
  private page:number = 0;
  private amount:number = 10;
  private items = [];
  private title = [];
  private pageData = { pageCode: AppConst.pageCode.canteen, curService: { service: "" } };


  private product =
    [
      { "name": "กลุ่มสินค้า", "nameControl": "groupId", "firstChoice": "กรุณาเลือกกลุ่มสินค้า" }
      , { "name": "กลุ่มประเภทสินค้า(เฉพาะเบียร์,เบียร์(Brewpub),น้ำอัดลม", "nameControl": "catId", "firstChoice": "สินค้าทุกประเภท" }
      , { "name": "ยี่ห้อหลัก", "nameControl": "brandMainCode", "firstChoice": "กรุณาเลือกยี่ห้อหลัก" }
      , { "name": "ยี่ห้อรอง", "nameControl": "brandSecondCode", "firstChoice": "กรุณาเลือกยี่ห้อรอง" }
      , { "name": "แบบรุ่น", "nameControl": "modelCode", "firstChoice": "กรุณาเลือกแบบรุ่น" }
      , { "name": "ประเภทสถานที่ขายสินค้า", "nameControl": "storeTypeCode", "firstChoice": "กรุณาเลือกประเภทร้านค้า" }
      , { "name": "กลุ่มร้านค้า", "nameControl": "storeGroup", "firstChoice": "กรุณาเลือกกลุ่มร้าน" }
      , { "name": "ครั้งที่สำรวจ", "nameControl": "surveyNo", "firstChoice": "" }
      , { "name": "ปีที่สำรวจ", "nameControl": "yearSurvey", "firstChoice": "" }
    ]

  
  private sent = [];
  private highPriceSent = AppConst.srpSerchHighPrice;
  brandMain: any;
  brandSecond: any;
  Model: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
    public alertCtrl: AlertController,
    public util: UtilityProvider,
    public platform:Platform) {
    this.getInformation(this.searchTitle);
    this.getProduceTitle();
    this.user = { "company": "ศูนย์เทคโนโลยีสารสนเทศ", "name": " ปรัชญาวัต อัสราษี" }
      this.platform.resume.subscribe(()=>{
        this.getInformation(this.searchTitle);
        this.getProduceTitle();
      });
  }

  showList():boolean{
    
    if(this.result != []){ 
      return true;
    }else{
      return false;
    }
  }


  getInformation(searchTitle) {
    this.util.popup.loadingActive(true);
     this.title = this.product;
      this.items = [];
      this.getFromProduceType();

      this.getSentObjectProduceType();

      this.setItemProductList(searchTitle)
    
   
    this.util.popup.loadingActive(false);
  }

  setItemProductList(searchTitle): void {
    this.items = [];
    for (let i = 0; i < this.product.length; i++) {
        this.clearItemList(i);
    }
    console.log();
      this.getProduceTitle();
      this.getSurveyNo()
      this.getYearSurvey()
  }


  clearItemList(i){
    this.items[i] = [{"key":"","value": this.title[i].firstChoice}] 
}

  //ServiceCategory Start
  getProduceTitle() {
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSearchGroup;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[0] = this.util.convertJsonToObjectl(res, this.product[0].firstChoice);
      },
      (er) => {

      })
  }
  getCatId() {
    this.clearItemList(1);
    this.typeForm.value.catId = "";
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getCatId;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[1] = this.items[1].concat(this.util.convertJsonToObject(res));
        this.getBrandMainCode();
        this.util.popup.loadingActive(false);
       
      },
      (er) => {

      })
  }
  getBrandMainCode() {
    this.typeForm.value.brandMainCode = this.items[2][0];
    this.clearItemList(2);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getBrandMain;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        if (res != {} && res != []) {

        }
        let i = [];
        let r = [];
        r = this.util.convertJsonToObject(res)
        for (let j = 0; j < 100; j++) {
          if (j < r.length) {
            i.push(r[j])
          }

        }
        this.brandMainList = r;
        if (i[0] == undefined) {
          console.log("Empty")
          this.items[this.highPriceSent.brandMainCode] = this.items[this.highPriceSent.brandMainCode].concat(this.util.convertJsonToObject(res));
        } else {
          this.items[this.highPriceSent.brandMainCode] = this.items[this.highPriceSent.brandMainCode].concat(i);
        }

        this.util.popup.loadingActive(false);
       
      },
      (er) => {

      })

  }
  getBrandSecondCode() {
    this.typeForm.value.brandSecondCode = this.items[3][0];
    this.clearItemList(3);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getBrandSecond;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[3] = this.items[3].concat(this.util.convertJsonToObject(res));
        this.getModelCode() 
      },
      (er) => {

      })
  }
  getModelCode() {
    this.typeForm.value.modelCode = this.items[4][0];
    this.clearItemList(4);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getModel;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[4] =  this.items[4].concat(this.util.convertJsonToObject(res));
        this.util.popup.loadingActive(false);
      },
      (er) => {

      })
  }

  getSurveyNo() {
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSurveyNo;
    this.httpService.httpPost(this.pageData,[],
      (res) => {
        this.items[7] = this.util.convertJsonToObjectl(res, this.product[7].firstChoice);
      },
      (er) => {

      })
  }

  getYearSurvey() {
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getYearSurvey;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[8] = this.util.convertJsonToObjectl(res, this.product[8].firstChoice);
      },
      (er) => {

      })
  }
  //ServiceCategory END




  
 
  getStoreTypeCode() {
    this.typeForm.value.storeTypeCode = "";
    this.clearItemList(5);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getStoreType;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        //this.items[5] = this.items[5].concat(this.util.convertJsonToObject(res));
       
      },
      (er) => {

      })
  }
  getStoreGroup() {
    this.typeForm.value.storeGroup = "";
    this.clearItemList(6);
    console.log(this.items[6]);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getStoreGroup;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {

       // this.items[6] = this.items[6].concat(this.util.convertJsonToObject(res));
        this.util.popup.loadingActive(false);
      },
      (er) => {

      })
  }

 

 


  getValue(service, i) {
    //this.util.popup.loadingActive(true);
    if (this.searchTitle == "1") {
      console.log(service);
      this.sent[7].value = "1";
      this.sent[8].value = "2561";
      console.log( this.sent);
      switch (i) {
        case 0: this.sent[this.highPriceSent.groupId].value = service.groupId;
          if (service.groupId != "") {
            this.util.popup.loadingActive(true);
          }
          this.getCatId()
          this.getBrandMainCode();
          break
          case 1: this.sent[this.highPriceSent.catId].value = this.util.cutIndex(service.catId);
          if (service.catId != "") {
            this.util.popup.loadingActive(true);
          }
         
          this.getBrandMainCode();
          this.getBrandSecondCode();
          this.getModelCode();
          break
          case 2: this.sent[this.highPriceSent.brandMainCode].value = this.util.cutIndex(service.value.key);
          this.util.popup.loadingActive(true);
         // this.typeForm.value.brandMainCode = service;
         case 3: this.sent[this.highPriceSent.brandSecondCode].value = this.util.cutIndex(service.value.key);
         
         // this.typeForm.value.brandSecondCode = service;
          this.getModelCode();
          break
          case 4: this.sent[this.highPriceSent.modelCode].value = this.util.cutIndex(service.value.key);
          if (service.modelCode != "") {
            this.util.popup.loadingActive(true);
          } 
          //this.typeForm.value.modelCode = service;
          break
          case 5: this.sent[this.highPriceSent.storeTypeCode].value = this.util.cutIndex(service.value.key);
          if (service.storeTypeCode != "") {
            this.util.popup.loadingActive(true);
          }
          this.getStoreGroup();
          break
          case 6: this.sent[this.highPriceSent.storeGroup].value = this.util.cutIndex(service.value.key);
          if (service.storeGroup != "") {
            this.util.popup.loadingActive(true);
          } 
            break
        case 7: this.sent[this.highPriceSent.surveyNo].value = service.surveyNo
          break
        case 8: this.sent[this.highPriceSent.yearSurvey].value = service.yearSurvey;
          break
      }
    } 
    //this.util.popup.loadingActive(false);
  }


  getSentObjectProduceType() {
    this.httpService.http.get("assets/jsonData/Dummy-search-discovered.json")
      .subscribe(
        (data: any) => {
          let i = data.priceSent;
          this.sent = i;
        });
  }




  clearData() {
    this.result = [];
    this.content.scrollToTop();
    this.getInformation(this.searchTitle)

  }




  getFromProduceType() {
    this.typeForm = new FormGroup({
      groupId: new FormControl('', Validators.required),
      catId: new FormControl("", Validators.required),
      brandMainCode: new FormControl({ component: SelectSearchableComponent, value: this.product[2].firstChoice }, Validators.required),
      brandSecondCode: new FormControl({ component: SelectSearchableComponent, value: this.product[3].firstChoice }, Validators.required),
      modelCode: new FormControl({ component: SelectSearchableComponent, value: this.product[4].firstChoice }, Validators.required),
      storeTypeCode: new FormControl({ component: SelectSearchableComponent, value: this.product[5].firstChoice }, Validators.required),
      storeGroup: new FormControl({ component: SelectSearchableComponent, value: this.product[6].firstChoice }, Validators.required),
      surveyNo: new FormControl(1, Validators.required),
      yearSurvey: new FormControl(2561, Validators.required)
    });
    console.log( this.typeForm );
    
  }






  getSearchResult(searchTitle) {
    let arrayAmount = 0;
    if(searchTitle == "1"){
       this.pageData.curService = AppConst.srpSerchDiscoveredPageService.sentSearchHighestPrice;
       this.httpService.httpPost(this.pageData, this.sent,
        (res) => {
          if(res != null && res != [] && res != {} && res != 12 && res.length != 0 && res != [{"error":"error"}]){
         
            arrayAmount =  Math.ceil(res.length/this.amount);
  
            this.result.length = arrayAmount;
             
            for(let j = 0;j < arrayAmount;j++){
              let item = []; 
                for(let i=0 ; i < this.amount ; i++){
                 
                  if(i+(this.amount*j) < res.length){
                      res[i+(this.amount*j)].product_name = res[i].product_name.replace(/<br\s*[\/]?>/gi,"\n") 
                      item.push(res[i]);
                  }
                 
                }   
                console.log(j);
               this.result[j] = item;
             }
            console.log(this.result);
            this.util.popup.loadingActive(false);
            }
        },
        (er) => {
          console.log(er);
        })
    }
   
  }


  startSearch(type) {
    
    if (this.searchTitle == "1") {
      if (type.groupId == "" && type.brandMainCode.value == this.title[2].firstChoice) {
        this.alerFill("กลุ่มสินค้า" + " " + "ยี่ห้อหลัก");
      }
      else if (type.groupId == "") {
        this.alerFill("กลุ่มสินค้า");
      } else if (type.brandMainCode.value == this.title[2].firstChoice) {
        this.alerFill("ยี่ห้อหลัก");
      } else {
        this.getSearchResult(this.searchTitle)
      }
      

    }else{
      if (type.zoneCode == "") {
        this.alerFill("ภาค");
      } else {
        this.getSearchResult(this.searchTitle)
      }
    }

  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }

  alerFill(alert) {
    this.util.popup.alertPopup('SRP', 'E40011: กรุณาระบุ' + alert, 'OK')
  }

  empty() {
    this.util.popup.alertPopup('SRP', 'IOOO4:ไม่พบข้อมูลตามเงื่อนไขระบุ', 'OK')
  }

  



  isRedStar(i): boolean {
    if (this.searchTitle == "1") {
      if (i == 0 || i == 2) {
        return true;
      } else {
        return false;
      }
    } else {
      if (i == 0 || i == 7 || i == 8) {
        return true;
      } else {
        return false;
      }
    }
  }
  selectedType(i): boolean {
    if (this.searchTitle == "1") {
      if (2 > i || i > 4) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  selectedMain(i): boolean {
    if (this.searchTitle == "1") {
      if (i == 2) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  selectedSub(i): boolean {
    if (this.searchTitle == "1") {
      if (i == 3) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  selectedLine(i): boolean {
    if (this.searchTitle == "1") {
      if (i == 4) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  changePage(i){
    this.page = i;
    console.log( this.page);
    
  }

 

}
