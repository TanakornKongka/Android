import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UtilityProvider } from "../../../providers/utility-provider";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import * as AppConst from "../../../../app/app.constant";
import { HttpServiceProvider } from "../../../providers/http-service-provider";
import { LoginPage } from '../../login/login';
import * as _ from 'lodash';
import { SearchResultPage } from '../../search-result/search-result';

@IonicPage()
@Component({
  selector: 'survey-retial-product-step-3',
  templateUrl: 'survey-retial-product-step-3.html',
})
export class SurveyRetailProductPage3 {

  private storeDetails: any;
  private roundTypeForm: any;
  private addressTypeForm: any;
  private storeDetailsTypeForm: any;
  private productBarcodeDetailsForm: FormGroup;
  private pageData = { pageCode: AppConst.pageCode.survey_retail_product, curService: { service: "" } };
  private productSelected: any;
  private productDetails: any = [];
  private barcodeSuggestionList: any = [];
  private showBarcodeSuggestion: boolean = false;
  private isTimeout = true;
  private productGroupList: any = [];
  private productCategoryList: any = [];
  private sizeNameList: any = [];
  private brandMainList: any = [];
  private productNameList: any = [];
  private isProductRegis = true;
  private titleButton = "สินค้าที่ไม่ได้ขึ้นทะเบียน Barcode"
  private isRegistedBarcode = true
  groupId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public barcodeScanner: BarcodeScanner,
    private httpService: HttpServiceProvider,
    public util: UtilityProvider,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController
  ) {
    this.roundTypeForm = navParams.get('roundTypeForm');
    this.storeDetails = navParams.get('storeDetails');
    this.addressTypeForm = navParams.get('addressTypeForm');
    this.storeDetailsTypeForm = navParams.get('storeDetailsTypeForm');
    if (this.storeDetails == null) {
      this.storeDetails = {
        storeName: "Mock Store Name"
      }
    }
    this.productBarcodeDetailsForm = new FormGroup({
      barcodeId: new FormControl(""),
      productPrice: new FormControl(""),
      groupId: new FormControl("", Validators.required),
      catId: new FormControl(""),
      brandMainCode: new FormControl(""),
      productName: new FormControl(""),
      productPrice2: new FormControl(""),
      prodCatagory: new FormControl(""),
      degree: new FormControl(""),
      sizeDesc: new FormControl(""),
      sizeUnit: new FormControl(""),
      productDesc: new FormControl(""),
    });
    this.callServiceGetProductGroup();
  }

  callServiceGetProductGroup() {
    // this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.searchGroup;
    let requestData = [];
    this.httpService.httpPost(this.pageData, requestData,
      (res: any) => {
        // this.util.popup.loadingActive(false);
        let mapObj = _.map(this.util.convertJsonToObject(res), item => {
          item.key = item.key.split(',,')[1];
          return item;
        });
        this.productGroupList = mapObj;
      },
      (er) => {
        // this.util.popup.loadingActive(false);
        console.log(er);
      });
  }

  toggleRegistedBarcode() {
    if (this.isRegistedBarcode == true) {
      this.titleButton = "Scan Barcode"
      this.isRegistedBarcode = false;
    } else {
      this.titleButton = "สินค้าที่ไม่ได้ขึ้นทะเบียนบาร์โค้ด"
      this.isRegistedBarcode = true;
    }
    this.productDetails = [];
    // console.log(this.titleButton);
  }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      if (!barcodeData.cancelled) {
        this.productBarcodeDetailsForm.controls['barcodeId'].patchValue(barcodeData.text);
        this.getProductDetailsByBarcodeId();
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  getProductDetailsByBarcodeId() {
    this.productSelected = undefined;
    // this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.searchPdtByBarcode;
    let dataRequest = [
      { name: "barCode", value: this.productBarcodeDetailsForm.controls['barcodeId'].value }
    ];
    if (this.productBarcodeDetailsForm.controls['barcodeId'].value.trim() == "") {
      this.util.popup.loadingActive(false);
      return;
    }
    this.httpService.httpPost(this.pageData, dataRequest,
      (res) => {
        this.isTimeout = false;
        this.showBarcodeSuggestion = false;
        this.util.popup.loadingActive(false);
        this.titleButton = "สินค้าที่ไม่ได้ขึ้นทะเบียนบาร์โค้ด"
        this.isRegistedBarcode = true;
        if (res.length == 1) {
          this.productDetails = res;
          this.productSelected = res[0];
        } else if (res.length > 1) {
          this.productDetails = res;
        } else {
          this.util.popup.alertPopup("ผลการค้นหา", "ไม่พบสินค้า");
          this.productDetails = [];
          this.productBarcodeDetailsForm.controls['barcodeId'].setValue("");
        }
      },
      (er) => {
        this.isTimeout = false;
        this.util.popup.loadingActive(false);
        console.log(er);
      });

    setTimeout(() => {
      if (this.isTimeout) {
        this.util.popup.loadingActive(false);
        let alert = this.alertCtrl.create({
          title: 'Session Timeout',
          subTitle: 'ใช้เวลาค้นหานานเกินไป',
          buttons: [{
            text: 'ตกลง',
            handler: () => {
              this.httpService.unsubscribe();
              this.isTimeout = false;
            }
          }],
          enableBackdropDismiss: false
        });
        alert.present();
      }
    }, 7000);
  }

  getBarcodeSuggestion(event: any) {
    // console.log(event.value);
    let val = event.value;
    this.showBarcodeSuggestion = false
    if (val && val.trim() != '') {
      if (val)
        this.pageData.curService = AppConst.srpService.searchBarcodeRange;
      let dataRequest = [
        { name: "start", value: "0" },
        { name: "end", value: "100" },
        { name: "barcode", value: val }];
      this.httpService.httpPost(this.pageData, dataRequest,
        (res) => {
          this.showBarcodeSuggestion = true;
          this.barcodeSuggestionList = [];
          const userStr = JSON.stringify(res);
          JSON.parse(userStr, (key, value) => {
            this.barcodeSuggestionList.push(key);
          });
          this.barcodeSuggestionList.pop();
          // console.log(this.barcodeSuggestionList);
          // console.log(this.barcodeSuggestionList.indexOf(val));
          if (this.barcodeSuggestionList.indexOf(val) > -1) {
            this.showBarcodeSuggestion = false;
          }
        },
        (er) => {
          console.log(er);
        });
    } else {
      this.showBarcodeSuggestion = false;
    }
  }

  onClickBarcodeSuggestionItem(barcodeId) {
    this.productBarcodeDetailsForm.controls['barcodeId'].setValue(barcodeId);
    this.showBarcodeSuggestion = false;
    this.getProductDetailsByBarcodeId();
  }

  blurInput() {
    this.showBarcodeSuggestion = false;
  }

  onT3ChangeProductGroup(groupId) {
    // console.log("groupId==>", groupId);
    this.callServiceGetSizeName(groupId);
    this.callServiceGetBrandMainCodes(groupId);
    this.callServiceGetProductCatagories(groupId);
    this.productBarcodeDetailsForm.controls['catId'].patchValue('');
    this.productBarcodeDetailsForm.controls['degree'].patchValue('');
    this.productBarcodeDetailsForm.controls['sizeUnit'].patchValue('');
    this.productBarcodeDetailsForm.controls['sizeDesc'].patchValue('');
    this.productBarcodeDetailsForm.controls['productDesc'].patchValue('');
    this.productCategoryList = [];
    this.sizeNameList = [];
    this.groupId = groupId;
  }

  onT3ChangeCatId(catId) {
    // console.log('catId: ', catId);
    this.productBarcodeDetailsForm.controls['degree'].patchValue('');
    this.productBarcodeDetailsForm.controls['sizeUnit'].patchValue('');
    this.productBarcodeDetailsForm.controls['sizeDesc'].patchValue('');
    this.productBarcodeDetailsForm.controls['productDesc'].patchValue('');
  }

  onT3ChangeSizeUnit(sizeUnit) {
    // console.log('sizeUnit: ', sizeUnit);
    this.productBarcodeDetailsForm.controls['productDesc'].patchValue('');
  }

  callServiceGetSizeName(groupId) {
    if (groupId == "") {
      return;
    }
    this.pageData.curService = AppConst.srpService.searchSizeName;
    let requestData = [
      { name: "groupId", value: groupId }
    ]
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        let mapObj = _.map(this.util.convertJsonToObject(res), item => {
          item.key = item.key.split('||')[1];
          return item;
        });
        this.sizeNameList = mapObj;
        this.sizeNameList.splice(0, 0, { "key": "", "value": "หน่วยบรรจุทุกประเภท" });
        // console.log('this.sizeNameList: ', this.sizeNameList);
      },
      (er) => {
        // this.util.popup.loadingActive(false);
        console.log(er);
      });
  }

  callServiceGetProductCatagories(groupId) {
    if (groupId == "") {
      return;
    }
    this.pageData.curService = AppConst.srpService.searchProductCatagory;
    let requestData = [
      { name: "groupId", value: groupId }
    ]
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        let mapObj = _.map(this.util.convertJsonToObject(res), item => {
          item.key = item.key.split('||')[1];
          return item;
        });
        this.productCategoryList = mapObj;
        this.productCategoryList.splice(0, 0, { "key": "", "value": "สินค้าทุกประเภท" });
      },
      (er) => {
        // this.util.popup.loadingActive(false);
        console.log(er);
      });
  }

  callServiceGetBrandMainCodes(catId) {
    if (catId == "") {
      return;
    }
    // this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.searchBrandMainCode;
    let requestData = [
      { "name": "groupId", "value": this.productBarcodeDetailsForm.controls['groupId'].value.key },
      { "name": "prodCatagory", "value": this.productBarcodeDetailsForm.controls['catId'].value.key == undefined ? '' : this.productBarcodeDetailsForm.controls['catId'].value.key },
      { "name": "storeId", "value": this.isNotNull(this.storeDetails.storeId) },
      { "name": "storeCode", "value": this.isNotNull(this.storeDetails.storeCode) },
      { "name": "storeName", "value": this.storeDetailsTypeForm.value['storeName'] },
      { "name": "storeTypeCode", "value": this.storeDetailsTypeForm.value['storeLocationType'] },
      { "name": "storeGroupCode", "value": this.storeDetailsTypeForm.value['storeGroupType'] },
      { "name": "provinceCode", "value": this.storeDetailsTypeForm.value['storeProvince'] },
      { "name": "amphurCode", "value": this.addressTypeForm.value['district'] },
      { "name": "productCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.productCode) },
      { "name": "brandCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandCode) },
      { "name": "brandSecondCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandSecondCode) },
      { "name": "degreeCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.degreeCode) },
      { "name": "modelCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.modelCode) },
      { "name": "sizeCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.sizeCode) },
      { "name": "unitCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.unitCode) },
      { "name": "surveyNo", "value": this.roundTypeForm.value['surveyPeriod'] },
      { "name": "surveyDate", "value": this.roundTypeForm.value['surveyDate'] },
      { "name": "yearSurvey", "value": this.roundTypeForm.value['surveyYear'] },
      { "name": "barcodeFlag", "value": this.isRegistedBarcode ? "Y" : "" },
      { "name": "startAutoComplet", "value": "0" },
      { "name": "endAutoComplet", "value": "100" },
      { "name": "brandName", "value": "ยี่ห้อ : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandName)) },
      { "name": "modelDesc", "value": "แบบ/รุ่น : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.modelDesc)) },
      { "name": "packUnit", "value": "ขนาด/หน่วย : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.packUnit)) },
      { "name": "storeFlag", "value": this.storeDetailsTypeForm.value['storeLicenceNumber'] != '' ? "1" : "2" },
      { "name": "vatLicStatus", "value": "Y" },
      { "name": "zoningStatus", "value": "N" }
    ];
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        this.util.popup.loadingActive(false);
        let mapObj = _.map(this.util.convertJsonToObject(res), item => {
          item.key = item.key.split('||')[1];
          return item;
        });
        this.brandMainList = mapObj;
      },
      (er) => {
        this.util.popup.loadingActive(false);
      });
    this.callServiceGetProducts(this.productBarcodeDetailsForm.value['brandMainCode'].key == undefined ? '' : this.productBarcodeDetailsForm.value['brandMainCode'].key);
  }

  checkName(productName) {
    // console.log("productname", productName);
  }

  callServiceGetProducts(brandMainCode) {
    this.productBarcodeDetailsForm.controls['productName'].setValue("");
    if (brandMainCode == "") {
      return;
    }
    // this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.searchProduct;
    let requestData = [
      { "name": "brandMainCode", "value": brandMainCode },
      { "name": "groupId", "value": this.productBarcodeDetailsForm.controls['groupId'].value.key },
      { "name": "prodCatagory", "value": this.productBarcodeDetailsForm.controls['catId'].value.key == undefined ? '' : this.productBarcodeDetailsForm.controls['catId'].value.key },
      { "name": "storeId", "value": this.isNotNull(this.storeDetails.storeId) },
      { "name": "storeCode", "value": this.isNotNull(this.storeDetails.storeCode) },
      { "name": "storeName", "value": this.storeDetailsTypeForm.value['storeName'] },
      { "name": "storeTypeCode", "value": this.storeDetailsTypeForm.value['storeLocationType'] },
      { "name": "storeGroupCode", "value": this.storeDetailsTypeForm.value['storeGroupType'] },
      { "name": "provinceCode", "value": this.storeDetailsTypeForm.value['storeProvince'] },
      { "name": "amphurCode", "value": this.addressTypeForm.value['district'] },
      { "name": "productCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.productCode) },
      { "name": "brandCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandCode) },
      { "name": "brandSecondCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandSecondCode) },
      { "name": "degreeCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.degreeCode) },
      { "name": "modelCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.modelCode) },
      { "name": "sizeCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.sizeCode) },
      { "name": "unitCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.unitCode) },
      { "name": "surveyNo", "value": this.roundTypeForm.value['surveyPeriod'] },
      { "name": "surveyDate", "value": this.roundTypeForm.value['surveyDate'] },
      { "name": "yearSurvey", "value": this.roundTypeForm.value['surveyYear'] },
      { "name": "barcodeFlag", "value": this.isRegistedBarcode ? "Y" : "" },
      { "name": "startAutoComplet", "value": "0" },
      { "name": "endAutoComplet", "value": "100" },
      { "name": "brandName", "value": "ยี่ห้อ : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandName)) },
      { "name": "modelDesc", "value": "แบบ/รุ่น : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.modelDesc)) },
      { "name": "packUnit", "value": "ขนาด/หน่วย : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.packUnit)) },
      { "name": "storeFlag", "value": this.storeDetailsTypeForm.value['storeLicenceNumber'] != '' ? "1" : "2" },
      { "name": "vatLicStatus", "value": "Y" },
      { "name": "zoningStatus", "value": "N" },
    ]
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        this.util.popup.loadingActive(false);
        this.productNameList = this.util.convertJsonToObject(res);
      },
      (er) => {
        this.util.popup.loadingActive(false);
        console.log(er);
      });
  }

  clearInputData() {
    this.isRegistedBarcode = true;
    this.titleButton = "สินค้าที่ไม่ได้ขึ้นทะเบียนบาร์โค้ด"
    this.productDetails = [];
    this.productBarcodeDetailsForm.controls['productPrice'].setValue("");
    this.productBarcodeDetailsForm.controls['barcodeId'].setValue("");
    this.productBarcodeDetailsForm.controls['groupId'].setValue("");
    this.productBarcodeDetailsForm.controls['catId'].setValue("");
    this.productBarcodeDetailsForm.controls['degree'].setValue("");
    this.productBarcodeDetailsForm.controls['sizeDesc'].setValue("");
    this.productBarcodeDetailsForm.controls['sizeUnit'].setValue("");
    this.productBarcodeDetailsForm.controls['productDesc'].setValue("");
    this.productCategoryList = [];
    this.brandMainList = [];
    this.productNameList = [];
  }

  clearInputDataNotRegisQr() {
    this.isRegistedBarcode = false;
    this.titleButton = "Scan Barcode";
    this.productDetails = [];
    this.productBarcodeDetailsForm.controls['barcodeId'].setValue("");
    this.productBarcodeDetailsForm.controls['groupId'].setValue("");
    this.productBarcodeDetailsForm.controls['catId'].setValue("");
    this.productBarcodeDetailsForm.controls['brandMainCode'].setValue("");
    this.productBarcodeDetailsForm.controls['productName'].setValue("");
    this.productBarcodeDetailsForm.controls['productPrice'].setValue("");
    this.productBarcodeDetailsForm.controls['productPrice2'].setValue("");
    this.productCategoryList = [];
    this.brandMainList = [];
    this.productNameList = [];
  }

  isNotNull(value) {
    if (this.util.isNotNullOrEmpty(value)) {
      return value;
    }
    return "";
  }

  clickSaveProductData(endProcess) {
    // console.log(this.validation);
    if (!this.validation()) {
      this.util.popup.alertPopup('SRP', 'E0011: กรุณากรอกข้อมูลให้ครบ', 'OK');
    } else {
      this.util.popup.multiButtonPopup("บันทึกข้อมูล", "ต้องการบันทึก ใช่หรือไม่?", ["ยกเลิก", "ตกลง"],
        [
          //ยกเลิก
          () => { },
          //ตกลง
          () => {
            this.callServiceSaveProductData(endProcess);
          }
        ]);
    }
  }

  callServiceSaveProductData(endProcess) {
    this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.saveProductData;
    // console.log("pagedata.saveproduct", this.pageData.curService);
    let requestData = [
      { "name": "storeId", "value": this.isNotNull(this.storeDetails.storeId) },
      { "name": "storeCode", "value": this.isNotNull(this.storeDetails.storeCode) },
      { "name": "storeName", "value": this.storeDetailsTypeForm.value['storeName'] },
      { "name": "storeTypeCode", "value": this.storeDetailsTypeForm.value['storeLocationType'] },
      { "name": "storeGroupCode", "value": this.storeDetailsTypeForm.value['storeGroupType'] },
      { "name": "provinceCode", "value": this.storeDetailsTypeForm.value['storeProvince'] },
      { "name": "amphurCode", "value": this.addressTypeForm.value['district'] },
      { "name": "productCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.productCode) },
      { "name": "brandCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandCode) },
      { "name": "brandSecondCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandSecondCode) },
      { "name": "degreeCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.degreeCode) },
      { "name": "modelCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.modelCode) },
      { "name": "sizeCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.sizeCode) },
      { "name": "unitCode", "value": this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.unitCode) },
      { "name": "surveyNo", "value": this.roundTypeForm.value['surveyPeriod'] },
      { "name": "surveyDate", "value": this.roundTypeForm.value['surveyDate'] },
      { "name": "yearSurvey", "value": this.roundTypeForm.value['surveyYear'] },
      { "name": "barcodeFlag", "value": this.isRegistedBarcode ? "Y" : "" },
      { "name": "startAutoComplet", "value": "0" },
      { "name": "endAutoComplet", "value": "100" },
      { "name": "barCode", "value": this.productBarcodeDetailsForm.value['barcodeId'] },
      { "name": "brandName", "value": "ยี่ห้อ : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.brandName)) },
      { "name": "modelDesc", "value": "แบบ/รุ่น : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.modelDesc)) },
      { "name": "packUnit", "value": "ขนาด/หน่วย : " + (this.productSelected == undefined ? "" : this.isNotNull(this.productSelected.packUnit)) },
      { "name": "surveyPrice", "value": this.productBarcodeDetailsForm.value['productPrice'] },
      { "name": "groupId", "value": this.productBarcodeDetailsForm.value['groupId'].key == undefined ? '' : this.productBarcodeDetailsForm.value['groupId'].key },
      { "name": "prodCatagory", "value": this.productBarcodeDetailsForm.value['catId'].key == undefined ? '' : this.productBarcodeDetailsForm.value['catId'].key },
      { "name": "brandMainCode", "value": this.productBarcodeDetailsForm.value['brandMainCode'].key == undefined ? '' : this.productBarcodeDetailsForm.value['brandMainCode'].key },
      { "name": "productId", "value": this.productBarcodeDetailsForm.value['productName'] == '' ? '' : this.productBarcodeDetailsForm.value['productName'].key.split(',')[1] },
      { "name": "surveyPrice2", "value": this.productBarcodeDetailsForm.value['productPrice2'] },
      { "name": "storeFlag", "value": this.storeDetailsTypeForm.value['storeLicenceNumber'] != '' ? "1" : "2" },
      { "name": "vatLicStatus", "value": this.isNotNull(this.storeDetails.vatLicStatus) },
      { "name": "zoningStatus", "value": "N" },
      { "name": "surveyFrom", "value": "MOBILE" }
    ]
    // console.log("link", this.pageData);
    // console.log("requestData", requestData);
    // console.log(JSON.stringify(requestData));
    if (this.isNotNull(this.storeDetails.storeId) == '') {
      let alert = this.alertCtrl.create({
        subTitle: 'ข้อมูลร้านค้าไม่ครบถ้วนกรุณาตรวจสอบข้อมูลร้านค้าที่ หน้าข้อมูลร้านค้า',
        buttons: [{
          text: 'ตกลง',
          handler: () => {
            this.navCtrl.pop();
          }
        }],
        enableBackdropDismiss: false
      });
      alert.present();
    } else {
      this.httpService.httpPost(this.pageData, requestData,
        (res) => {
          //If "res" equal null or empty that mean Serve has some error with cookies
          if (!this.util.isNotNullOrEmpty(res)) {
            // this.util.popup.alertSessionPopup();
            localStorage.clear();
            window.location.reload();
          }
          // console.log(res[0].error);
          this.util.popup.loadingActive(false);
          if (res[0].error == "error") {
            this.util.popup.alertPopup('SRP', 'บันทึกข้อมูลไม่สำเร็จ', 'OK');
          } else {
            this.util.popup.alertPopup('SRP', 'บันทึกข้อมูลสำเร็จ', 'OK');
          }
          this.clearInputData();
          // if(this.isRegistedBarcode){
          //   this.clearInputData();
          // }else{
          //   this.clearInputDataNotRegisQr();
          // }
          if (endProcess) {
            this.navCtrl.popToRoot();
          }
        },
        (er) => {
          this.util.popup.loadingActive(false);
          console.log(er);
        });
    }
  }

  validation() {
    if (this.isRegistedBarcode) {
      if (this.productBarcodeDetailsForm.value['barcodeId'] == '' || this.productBarcodeDetailsForm.value['productPrice'] == "" || this.productSelected == undefined) {
        return false;
      }
    } else {
      if (
        this.productBarcodeDetailsForm.value['groupId'] == '' ||
        this.productBarcodeDetailsForm.value['productDesc'] == ''
        // this.productBarcodeDetailsForm.value['brandMainCode'] == '' ||
        // this.productBarcodeDetailsForm.value['productName'] == '' ||
        // this.productBarcodeDetailsForm.value['productPrice2'] == ''
      ) {
        return false;
      }
    }
    return true;
  }

  getModelProductSave(data) {
    this.productSelected = data;
    // console.log(this.productSelected);
  }

  async searchProduct() {
    if (!this.validation()) {
      this.util.popup.alertPopup('SRP', 'E0011: กรุณากรอกข้อมูลให้ครบ', 'OK');
    } else {
      this.util.popup.loadingActive(true);
      let requestData = [
        { "name": "groupId", "value": this.productBarcodeDetailsForm.value['groupId'].key == undefined ? '' : this.productBarcodeDetailsForm.value['groupId'].key },
        { "name": "prodCatagory", value: this.productBarcodeDetailsForm.value['catId'].key == undefined ? '' : this.productBarcodeDetailsForm.value['catId'].key },
        { "name": "degree", value: this.productBarcodeDetailsForm.value['degree'] },
        { "name": "sizeDesc", value: this.productBarcodeDetailsForm.value['sizeDesc'] },
        { "name": "sizeUnit", value: this.productBarcodeDetailsForm.value['sizeUnit'].value == undefined || this.productBarcodeDetailsForm.value['sizeUnit'].value === 'หน่วยบรรจุทุกประเภท' ? '' : this.productBarcodeDetailsForm.value['sizeUnit'].value },
        { "name": "productDesc", value: this.productBarcodeDetailsForm.value['productDesc'] },
        { "name": "storeId", value: this.isNotNull(this.storeDetails.storeId) },
        { "name": "yearSurvey", value: this.roundTypeForm.value['surveyYear'] },
        { "name": "surveyNo", value: this.roundTypeForm.value['surveyPeriod'] },
        { "name": "mode", value: "total" },
      ]
      // console.log('requestData : ', requestData);
      // this.presentProfileModal('');
      this.pageData.curService = AppConst.srpService.searchDataNonBarcode;
      await this.httpService.httpPost(this.pageData, requestData,
        (res: any) => {
          // console.log('res =====> ', res);
          this.isTimeout = false;
          if (res.length == 0 || res[0].error == "error") {
            this.util.popup.loadingActive(false);
            this.util.popup.alertPopup('SRP', 'E0011: ไม่พบข้อมูลที่ค้นหา', 'OK');
          } else {
            this.presentProfileModal(res, requestData);
            this.util.popup.loadingActive(false);
          }
        },
        async (er) => {
          this.isTimeout = false;
          this.util.popup.alertPopup("Session Timeout", "ใช้เวลาค้นหานานเกินไป", "OK", () => {
            this.util.popup.loadingActive(false);
            this.isTimeout = false;
          });
          console.log(er);
        });

      await setTimeout(() => {
        if (this.isTimeout) {
          this.util.popup.alertPopup("Session Timeout", "ใช้เวลาค้นหานานเกินไป", "OK", () => {
            this.util.popup.loadingActive(false);
            this.httpService.unsubscribe();
            this.isTimeout = false;
          });
        }
      }, 10000);
    }
  }

  presentProfileModal(data: any, requestData: any) {
    let profileModal = this.modalCtrl.create(SearchResultPage,
      {
        datas: data,
        roundTypeForm: this.roundTypeForm,
        storeDetails: this.storeDetails,
        addressTypeForm: this.addressTypeForm,
        storeDetailsTypeForm: this.storeDetailsTypeForm,
        requestData: requestData
      });
    profileModal.onDidDismiss(data => {
      // console.log(data);
      this.clearInputData();
    });
    profileModal.present();
  }

  endProcess() {
    this.navCtrl.popToRoot();
  }


}
