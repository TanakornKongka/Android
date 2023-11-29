import { PopupProvider } from './../../../providers/popup-provider';

import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ModalController,
  ActionSheetController
} from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpServiceProvider } from "../../../providers/http-service-provider";
import * as AppConst from "../../../../app/app.constant";
import { UtilityProvider } from '../../../providers/utility-provider';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { ImageViewerDialog } from '.././image-viewer/image-viewer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MapDialog } from '../../dialog-map/dialog-map';
import { SurveyRetailProductPage3 } from '../survey-retial-product-step-3/survey-retial-product-step-3';
import { LoginPage } from '../../login/login';
import * as _ from 'lodash';

@Component({
  selector: 'survey-retail-product-step-2',
  templateUrl: 'survey-retail-product-step-2.html',
})
export class SurveyRetailProductPage2 {

  private typeForm: FormGroup;
  private roundTypeForm: FormGroup;
  private storeDetailsTypeForm: FormGroup;
  private tabLicenceTypeForm: FormGroup;
  private addressTypeForm: FormGroup;
  private user: any;
  private storeDetails: any;
  private pageData = { pageCode: AppConst.pageCode.survey_retail_product, curService: { service: "" } };
  private provinceList: any = [];
  private provinceListSelect: any = [];
  private provinceName = "";
  private districtList: any = [];
  private subDistrictList: any = [];
  private storeGroupList: any = [];
  private storeSubGroupList: any = [];
  private provinceCode: string = "";
  private partCode = "ios-arrow-up";
  private isPartCodeHidden = true;
  private isTimeout = true;
  private addFirst = "ios-arrow-up";
  private isHideFirst = true;
  private addSecond = "ios-arrow-up";
  private isHideSecond = true;
  private contactDetail = "ios-arrow-up";
  private iscontactDetail = true;
  private disableInput = false;
  private disableInputProvince = false;
  private storeInProvince: any = [];
  private TEMP_storeInProvince: any = [];
  private showStoreNameSuggestion: boolean = false;
  private showStoreNameSuggestionCH: boolean = false;
  private storeName: String = "";
  private storeImage: any = null;
  private locationData: any = null;
  private isStoreNameLoading: boolean = false;
  private showLicenceNumberInput = false;
  private isCanSelectProvince = true;
  private activeTab = "licence";
  @ViewChild('storeRegisVat') storeRegisVat1;
  @ViewChild('storeNoRegisVat') storeNoRegisVat1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: ModalController,
    private httpService: HttpServiceProvider,
    private util: UtilityProvider,
    public barcodeScanner: BarcodeScanner,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
  ) {
    this.roundTypeForm = navParams.get('roundTypeForm');
    this.typeForm = new FormGroup({
      storeType: new FormControl("licence")
    });
    this.tabLicenceTypeForm = new FormGroup({
      storeLicenceNumber: new FormControl(""),
      storeName: new FormControl(""),
      storeLocal: new FormControl(""),
      storeProvince: new FormControl(""),
      storeSubprovince: new FormControl(""),
      storeLocationType: new FormControl(""),
      storeGroupType: new FormControl(""),
      radioType: new FormControl("")
    });
    this.storeDetailsTypeForm = new FormGroup({
      storeLicenceNumber: new FormControl(""),
      storeProvince: new FormControl(""),
      storeProvince2: new FormControl(""),
      storeName: new FormControl(""),
      storeBranchNo: new FormControl(""),
      citizenID: new FormControl(""),
      storeLocationType: new FormControl(""),
      storeGroupType: new FormControl("")
    });
    this.addressTypeForm = new FormGroup({
      buildingName: new FormControl(""),
      roomNumber: new FormControl(""),
      floor: new FormControl(""),
      villageName: new FormControl(""),
      addressNumber: new FormControl(""),
      villageNumber: new FormControl(""),
      alley: new FormControl(""),
      road: new FormControl(""),
      district: new FormControl(""),
      subDistrict: new FormControl(""),
      postCode: new FormControl(""),
      phoneNumber: new FormControl(""),
      faxNumber: new FormControl(""),
      email: new FormControl("")
    });
    this.user = { "company": "Mock_spnOfficeName", "name": "Mock_spnUserName" };
    this.callServices();
  }

  private callServices() {
    this.callServiceGetStoreType();
    this.callServiceGetProvince();
    setTimeout(() => { this.callServiceGetInitZoneAreaByOfficeCode(); }, 500);
  }

  callServiceGetStoreType() {
    // console.log("pageData : ", this.pageData)
    this.pageData.curService = AppConst.srpService.searchStoreType;
    this.httpService.httpPost(this.pageData, [],
      (res) => {
        let mapObj = _.map(this.util.convertJsonToObject(res), item => {
          item.key = item.key.split(('|'))[1];
          return item;
        });
        this.storeGroupList = mapObj;
      },
      (er) => {
        console.log(er);
      });
  }

  callServiceGetStoreSubType(typeId) {
    if (typeId == "") {
      return;
    }
    this.pageData.curService = AppConst.srpService.searchStoreGroup;
    this.httpService.httpPost(this.pageData, [{ name: "storeTypeCode", value: typeId }],
      (res) => {
        let mapObj = _.map(this.util.convertJsonToObject(res), item => {
          item.key = item.key.split(('|'))[1];
          return item;
        });
        this.storeSubGroupList = mapObj;
      },
      (er) => {
        console.log(er);
      });
  }

  callServiceGetStoreInProcinve(provinceCode) {
    if (provinceCode == "") {
      return;
    }
    // this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.searchStoreMobile;
    let requestData = [
      { name: "provinceCode", value: provinceCode },
      { name: "storeName", value: this.storeDetailsTypeForm.value["storeName"] },
      { name: "limitRowNo", value: 50 }
    ];
    this.isStoreNameLoading = true;
    this.storeInProvince = [];
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        console.log(res);
        this.isStoreNameLoading = false;
        this.util.popup.loadingActive(false);
        this.storeInProvince = res;
        this.TEMP_storeInProvince = res;
        this.showStoreNameSuggestion = true;
      },
      (er) => {
        this.isStoreNameLoading = false;
        this.util.popup.loadingActive(false);
        console.log(er);
      });
  }

  getNolicencProvinceData(provinceCode) {
    this.provinceCode = provinceCode;
    this.callServiceGetDistrict(this.provinceCode);
  }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.storeDetailsTypeForm.controls['storeLicenceNumber'].setValue(barcodeData.text);
      this.searchByLicanceNO();
    }).catch(err => {
      console.log('Error', err);
    });
  }

  getStoreNameSuggestion(event: any) {
    let val = event.value;
    if (val && val.trim != "" && !this.showStoreNameSuggestionCH) {
      if (this.provinceCode != "") {
        for (let i = 0; i < this.storeInProvince.length; i++) {
          if (val == this.storeInProvince[i].storeName) {
            this.storeDetails = this.storeInProvince[i];
          }
        }
        this.callServiceGetStoreInProcinve(this.provinceCode);
      }
      // Show the results
      this.showStoreNameSuggestion = true;
    } else {
      // hide the results when the query is empty
      this.showStoreNameSuggestion = false;
      this.showStoreNameSuggestionCH = false;
    }
  }

  callServiceGetStoreDetails(StoreId) {
    if (StoreId == "") {
      return;
    }
    this.pageData.curService = AppConst.srpService.searchDataByStoreId;
    this.httpService.httpPost(this.pageData, [{ name: "storeId", value: StoreId }],
      (res) => {
        this.showStoreNameSuggestion = false;
        this.storeDetails = res[0];
        this.util.popup.loadingActive(false);
        // this.storeDetailsTypeForm.controls['storeName'].setValue(res[0].storeName);
        this.showStoreNameSuggestionCH = true;
        this.storeName = res[0].storeName;
        this.storeDetailsTypeForm.controls['storeBranchNo'].setValue(res[0].storeCode);
        this.storeDetailsTypeForm.controls['citizenID'].setValue(res[0].identityNo);
        this.storeDetailsTypeForm.controls['storeLocationType'].setValue(res[0].storeType);
        this.storeDetailsTypeForm.controls['storeGroupType'].setValue(res[0].storeGroup);
        this.addressTypeForm.controls["buildingName"].setValue(res[0].buildname);
        this.addressTypeForm.controls["roomNumber"].setValue(res[0].roomno);
        this.addressTypeForm.controls["floor"].setValue(res[0].floorno);
        this.addressTypeForm.controls["villageName"].setValue(res[0].village);
        this.addressTypeForm.controls["addressNumber"].setValue(res[0].addno);
        this.addressTypeForm.controls["villageNumber"].setValue(res[0].moono);
        this.addressTypeForm.controls["alley"].setValue(res[0].soiname);
        this.addressTypeForm.controls["road"].setValue(res[0].thnname);
        this.addressTypeForm.controls["district"].setValue(res[0].amphurCode);
        this.addressTypeForm.controls["subDistrict"].setValue(res[0].tambolCode);
        this.addressTypeForm.controls["postCode"].setValue(res[0].poscode);
        this.addressTypeForm.controls["phoneNumber"].setValue(res[0].telno);
        this.addressTypeForm.controls["faxNumber"].setValue(res[0].faxno);
        this.addressTypeForm.controls["email"].setValue(res[0].email);
        this.callServiceGetStoreSubType(res[0].storeType);
        this.callServiceGetSubDistrict(res[0].amphurCode);
        if (this.util.isNotNullOrEmpty(res[0].latitude)) {
          this.locationData = {
            'lat': res[0].latitude,
            'lng': res[0].longitude
          };
        }
        if (res[0].vatLicStatus == 'Y') {
          this.storeRegisVat1.nativeElement.checked = true;
        } else {
          this.storeNoRegisVat1.nativeElement.checked = true;
        }
        if (typeof res[0].imageBase64 !== 'undefined' && res[0].imageBase64 != '') {
          this.storeImage = res[0].imageBase64;
        } else {
          this.storeImage = null;
        }
      this.util.popup.loadingActive(false); 

      },
      (er) => {
      this.util.popup.loadingActive(false); 
        console.log(er);
      });
  }

  openPartCode() {
    if (this.isPartCodeHidden == false) {
      this.isPartCodeHidden = true;
      this.partCode = "ios-arrow-up";
    } else {
      this.isPartCodeHidden = false;
      this.partCode = "ios-arrow-down";
    }
  }

  openExpanasionFirst() {
    if (this.isHideFirst == false) {
      this.isHideFirst = true;
      this.addFirst = "ios-arrow-up";
    } else {
      this.isHideFirst = false;
      this.addFirst = "ios-arrow-down";
    }
  }

  openExpanasionSecond() {
    if (this.isHideSecond == false) {
      this.isHideSecond = true;
      this.addSecond = "ios-arrow-up";
    } else {
      this.isHideSecond = false;;
      this.addSecond = "ios-arrow-down";
    }
  }

  openContactDetail() {
    if (this.iscontactDetail == false) {
      this.iscontactDetail = true;
      this.contactDetail = "ios-arrow-up"
    } else {
      this.iscontactDetail = false;
      this.contactDetail = "ios-arrow-down"
    }
  }

  blurInput() {
    this.showStoreNameSuggestion = false;
  }

  chooseStore(storeDetails) {
    if (storeDetails.licNo != "") {
      this.showLicenceNumberInput = true;
      this.storeDetailsTypeForm.controls['storeLicenceNumber'].setValue(storeDetails.licNo);
      this.searchByLicanceNO();
    } else {
      this.util.popup.loadingActive(true); 
      this.callServiceGetStoreDetails(storeDetails.storeId)
    }
  }

  // Image chooseing
  chooseImage() {
    let result = "";
    let actionSheet = this.actionSheetCtrl.create({
      title: 'เลือกรูปภาพ',
      buttons: [
        {
          text: 'กล้องถ่ายภาพ',
          // role: 'destructive',
          handler: () => {
            result = this.getImageDevice(1);
          }
        },
        {
          text: 'อัลบั้ม',
          handler: () => {
            this.getImageDevice(0);
          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  getImageDevice(source) {
    let result = "";
    let options: CameraOptions = {
      quality: 30,
      sourceType: source, // 0- PHOTOLIBRARY, 1-CAMERA, 2-SAVEDPHOTOALBUM
      destinationType: 0, // 0-Base64, 1-FILE_URI, 2-NATIVE_URI 
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // targetWidth: 256,  // too low quality, img so blur
      // targetHeight: 256,
      targetWidth: 800,
      targetHeight: 800,
    };
    let base64Image = "";
    this.camera.getPicture(options).then((imageData) => {
      this.storeImage = imageData;
    }, (err) => {
      this.util.popup.alertPopup("", err);
    });
    return base64Image;
  }

  async searchByLicanceNO() {
    this.util.popup.loadingActive(true);
    let requestData = [
      { name: "licNo", value: this.storeDetailsTypeForm.value['storeLicenceNumber'] },
      { name: "surveyNo", value: this.roundTypeForm.value['surveyPeriod'] },
      { name: "yearSurvey", value: this.roundTypeForm.value['surveyYear'] },
      { name: "surveyDate", value: this.roundTypeForm.value['surveyDate'] }
    ];
    this.pageData.curService = AppConst.srpService.searchDataByLicNo;
    await this.httpService.httpPost(this.pageData, requestData,
      async (res) => {
        if(res.length == 1 && res[0].error != undefined  ){
          this.isTimeout = false;
          this.util.popup.loadingActive(false);
          this.addressTypeForm.reset()
          this.storeDetailsTypeForm.reset()
          this.tabLicenceTypeForm.reset()
          this.provinceCode = ""
          this.util.popup.alertPopup("ผลการค้นหา", "ไม่พบเลขที่ใบอนุญาตในระบบ");
        }else{
          this.isTimeout = false;
          this.storeDetails = res[0];
          this.util.popup.loadingActive(false);
          if (res.length != 0) {
            this.storeDetailsTypeForm.controls['storeName'].setValue(res[0].storeName);
            this.storeDetailsTypeForm.controls['storeProvince'].patchValue(res[0].provinceCode);
            this.provinceCode = res[0].provinceCode;
            this.storeDetailsTypeForm.controls['storeLocationType'].setValue(res[0].storeType);
            this.storeDetailsTypeForm.controls['storeGroupType'].setValue(res[0].storeGroup);
            this.addressTypeForm.controls["buildingName"].setValue(res[0].buildname);
            this.addressTypeForm.controls["roomNumber"].setValue(res[0].roomno);
            this.addressTypeForm.controls["floor"].setValue(res[0].floorno);
            this.addressTypeForm.controls["villageName"].setValue(res[0].village);
            this.addressTypeForm.controls["addressNumber"].setValue(res[0].addno);
            this.addressTypeForm.controls["villageNumber"].setValue(res[0].moono);
            this.addressTypeForm.controls["alley"].setValue(res[0].soiname);
            this.addressTypeForm.controls["road"].setValue(res[0].thnname);
            this.addressTypeForm.controls["district"].patchValue(res[0].amphurCode);
            this.addressTypeForm.controls["subDistrict"].patchValue(res[0].tambolCode);
            this.addressTypeForm.controls["postCode"].setValue(res[0].poscode);
            this.addressTypeForm.controls["phoneNumber"].setValue(res[0].telno);
            this.addressTypeForm.controls["faxNumber"].setValue(res[0].faxno);
            this.addressTypeForm.controls["email"].setValue(res[0].email);
            this.callServiceGetDistrict(res[0].provinceCode);
            this.callServiceGetSubDistrict(res[0].amphurCode);
            this.callServiceGetStoreSubType(res[0].storeType);
            if (this.util.isNotNullOrEmpty(res[0].latitude)) {
              this.locationData = {
                'lat': res[0].latitude,
                'lng': res[0].longitude
              };
            }
  
            //disable input cause regis store cannot edit details.
            this.disableInput = true;
            this.storeRegisVat1.nativeElement.disabled = true;
            this.storeNoRegisVat1.nativeElement.disabled = true;
            if (res[0].vatLicStatus == 'Y') {
              this.storeRegisVat1.nativeElement.checked = true;
            } else {
              this.storeNoRegisVat1.nativeElement.checked = true;
            }
            if (typeof res[0].imageBase64 !== 'undefined' && res[0].imageBase64 != '') {
              this.storeImage = res[0].imageBase64;
            } else {
              this.storeImage = null;
            }
          } else {
            // alert show not found result.
            // this.util.popup.alertPopup("ผลการค้นหา", "ร้านนี้อยู่นอกพื้นที่การสำรวจของท่าน ระบบไม่อนุญาตให้บันทึกการสำรวจราคาขายปลีก");
            this.util.popup.alertPopup("ผลการค้นหา", "ไม่พบเลขที่ใบอนุญาตในระบบ");
          }
        }
      },
      async (er) => {
        this.isTimeout = false;
        this.util.popup.loadingActive(false);
        console.log(er);
      });

    await setTimeout(() => {
      if (this.isTimeout) {
        this.util.popup.alertPopup("Session Timeout", "ใช้เวลาค้นหานานเกินไป", "OK", () => {
          this.httpService.unsubscribe();
          this.isTimeout = false;
        }, false);
      }
    }, 10000);
  }

  callServiceGetProvince() {
    this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.searchProvinceCode;
    this.httpService.httpPost(this.pageData, [],
      (res) => {
        this.util.popup.loadingActive(false);
        let splitObj = _.map(this.util.convertJsonToObject(res), item => {
          item.key = item.key.split('|')[1];
          return item;
        });
        this.provinceList = splitObj;
      },
      (er) => {
        this.util.popup.loadingActive(false);
        console.log(er);
      });
  }

  callServiceGetDistrict(provinceCode) {
    if (provinceCode == "") { return; }
    this.pageData.curService = AppConst.srpService.searchDistrict;
    let requestData = [
      { name: "provinceCode", value: provinceCode }
    ];
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        console.log(res)
        this.districtList = this.util.convertJsonToObject(res);
      },
      (er) => {
        console.log(er);
      });
  }

  callServiceGetSubDistrict(districtCode) {
    if (districtCode == "") { return; }
    this.pageData.curService = AppConst.srpService.searchSubDistrict;
    let requestData = [
      { name: "amphurCode", value: districtCode },
      { name: "provinceCode", value: this.provinceCode }
    ];
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        console.log(res);
        this.subDistrictList = this.util.convertJsonToObject(res);
      },
      (er) => {
        console.log(er);
      });
  }

  callServiceGetPostCode(subDistrictCode) {
    if (subDistrictCode == "") { return; }
    this.util.popup.loadingActive(true);
    this.pageData.curService = AppConst.srpService.searchPostCode;
    let requestData = [
      { name: "tambolCode", value: subDistrictCode },
      { name: "amphurCode", value: this.addressTypeForm.value['district'] },
      { name: "provinceCode", value: this.provinceCode }
    ];
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        this.util.popup.loadingActive(false);
        let data = this.util.convertJsonToObject(res);
        this.addressTypeForm.controls['postCode'].setValue(data[0].value);
      },
      (er) => {
        this.util.popup.loadingActive(false);
        console.log(er);
      });
  }

  nextPage() {
    if (this.validation()) {
      this.clickSaveStoreData();
    } else {
      this.util.popup.alertPopup('SRP', 'E0011: กรุณากรอกข้อมูลให้ครบ', 'OK');
    }
  }

  clearData() {
    this.storeDetails = null;
    this.disableInput = false;
    this.storeDetailsTypeForm.controls['storeLicenceNumber'].setValue("");
    this.storeDetailsTypeForm.controls['storeName'].setValue("");
    this.storeDetailsTypeForm.controls['storeProvince'].patchValue("");
    this.provinceCode = "";
    this.storeDetailsTypeForm.controls['storeLocationType'].setValue("");
    this.storeDetailsTypeForm.controls['storeGroupType'].setValue("");
    this.storeDetailsTypeForm.controls['storeBranchNo'].setValue("");
    this.storeDetailsTypeForm.controls['citizenID'].setValue("");
    this.addressTypeForm.controls["buildingName"].setValue("");
    this.addressTypeForm.controls["roomNumber"].setValue("");
    this.addressTypeForm.controls["floor"].setValue("");
    this.addressTypeForm.controls["villageName"].setValue("");
    this.addressTypeForm.controls["addressNumber"].setValue("");
    this.addressTypeForm.controls["villageNumber"].setValue("");
    this.addressTypeForm.controls["alley"].setValue("");
    this.addressTypeForm.controls["road"].setValue("");
    this.addressTypeForm.controls["district"].patchValue("");
    this.addressTypeForm.controls["subDistrict"].patchValue("");
    this.addressTypeForm.controls["postCode"].setValue("");
    this.addressTypeForm.controls["phoneNumber"].setValue("");
    this.addressTypeForm.controls["faxNumber"].setValue("");
    this.addressTypeForm.controls["email"].setValue("");
    this.storeRegisVat1.nativeElement.disabled = false;
    this.storeNoRegisVat1.nativeElement.disabled = false;
    this.storeRegisVat1.nativeElement.checked = false;
    this.storeNoRegisVat1.nativeElement.checked = false;
    this.storeImage = null;
  }

  openStoreImage() {
    let modal = this.alertCtrl.create(ImageViewerDialog, { imageData: this.storeImage }, { showBackdrop: true, enableBackdropDismiss: true });
    modal.present();
  }

  openMap() {
    let modal = this.alertCtrl.create(MapDialog, { locationData: this.locationData }, { showBackdrop: true, enableBackdropDismiss: false });
    modal.onDidDismiss(data => {
      if (data != null) {
        this.locationData = data;
      }
    });
    modal.present();
  }

  clickSaveStoreData() {
    this.util.popup.multiButtonPopup("บันทึกข้อมูล", "ต้องการบันทึก ใช่หรือไม่?", ["ยกเลิก", "ตกลง"],
      [
        //ยกเลิก
        () => { },
        //ตกลง
        () => {
          this.util.popup.loadingActive(true);
          this.callServiceSaveData();
        }
      ]);
  }

  isNotNull(value) {
    if (this.util.isNotNullOrEmpty(value)) {
      return value;
    }
    return "";
  }

  callServiceGetInitZoneAreaByOfficeCode() {
    this.pageData.curService = AppConst.srpService.initZoneAreaByOfficeCode;
    let requestData = [];
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        if (this.util.isNotNullOrEmpty(res.provinceCode)) {
          let provinceCode = res.provinceCode.replace(/'/g, "");
          for (let i = 0; i < this.provinceList.length; i++) {
            if (provinceCode == this.provinceList[i].key) {
              provinceCode = this.provinceList[i];
              this.provinceListSelect.push(this.provinceList[i]);
            }
          }
          this.storeDetailsTypeForm.controls['storeProvince'].setValue(provinceCode.key);
          this.provinceName = provinceCode.value;
          this.getNolicencProvinceData(provinceCode.key);
          this.disableInputProvince = true;
          this.isCanSelectProvince = false;
        }
      },
      (er) => {
        console.log("error:", er);
      });
  }

  async calImg(){
    let img:any;
    console.log(this.storeImage)
    if(this.storeImage != null){
       img = await this.storeImage.split('data:image/png;base64,');
       return img
    }else{
      return img = []
    }
  }

async  callServiceSaveData() {
    this.pageData.curService = AppConst.srpService.saveStoreData;
    let storeImg;
    let setImg
    storeImg = await this.calImg()
    if(storeImg.length == 2){
      setImg = storeImg[1]
    }else if(storeImg.length == 0){
      setImg = ''
    }else{
      setImg = storeImg[0]
    }
    let requestData = [
      { "name": "pin", "value": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.pin) },
      { "name": "tin", "value": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.tin) },
      { "name": "licType", "value": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.licType) },
      { "name": "addNo", "value": this.addressTypeForm.value['addressNumber'] },
      { "name": "buildName", "value": this.addressTypeForm.value['buildingName'] },
      { "name": "floorNo", "value": this.addressTypeForm.value['floor'] },
      { "name": "roomNo", "value": this.addressTypeForm.value['roomNumber'] },
      { "name": "village", "value": this.addressTypeForm.value['villageName'] },
      { "name": "mooNo", "value": this.addressTypeForm.value['villageNumber'] },
      { "name": "soiName", "value": this.addressTypeForm.value['alley'] },
      { "name": "thnName", "value": this.addressTypeForm.value['road'] },
      { "name": "tambolCode", "value": this.addressTypeForm.value['subDistrict'] },
      { "name": "posCode", "value": this.addressTypeForm.value['postCode'] },
      { "name": "telNo", "value": this.addressTypeForm.value['phoneNumber'] },
      { "name": "faxNo", "value": this.isNotNull(this.addressTypeForm.value['faxNumber']) },
      { "name": "email", "value": this.isNotNull(this.addressTypeForm.value['email']) },
      { "name": "cusId", "value": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.cusId) },
      { "name": "facId", "value": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.facId) },
      { "name": "imageStore", "value": this.isNotNull(this.storeImage == null ? '' : setImg) },
      { "name": "imagePath", "value": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.imagePath) },
      { "name": "latitude", "value": this.locationData == null ? '' : this.locationData.lat },
      { "name": "longtitude", "value": this.locationData == null ? '' : this.locationData.lng },
      { "name": "licNo", "value": this.storeDetailsTypeForm.value['storeLicenceNumber'] },
      { "name": "storeName", "value": this.storeDetailsTypeForm.value['storeName'] },
      { "name": "provinceCode", "value": this.provinceCode },
      { "name": "amphurCode", "value": this.addressTypeForm.value['district'] },
      { "name": "storeTypeCode", "value": this.storeDetailsTypeForm.value['storeLocationType'] },
      { "name": "storeGroupCode", "value": this.storeDetailsTypeForm.value['storeGroupType'] },
      { "name": "vatLicStatus", "value": "N" },
      { "name": "zoningStatus", "value": "N" },
      { "name": "storeId", "value": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.storeId) },
      { "name": "storeCode", "value": this.isNotNull(this.storeDetails == null ? "" : this.storeDetails.storeCode) },
      { "name": "storeFlag", "value": this.storeDetailsTypeForm.value['storeLicenceNumber'] != '' ? "1" : "2" },
      { "name": "surveyNo", "value": this.roundTypeForm.value['surveyPeriod'] },
      { "name": "yearSurvey", "value": this.roundTypeForm.value['surveyYear'] },
      { "name": "surveyDate", "value": this.roundTypeForm.value['surveyDate'] },
      { "name": "vatLicStatus", "value": this.storeRegisVat1.nativeElement.checked ? "Y" : "N" },
      { "name": "zoningStatus", "value": "N" },
      { "name": "surveyFrom", "value": "MOBILE" }
    ]
    console.log("requestData", requestData);
    // console.log("requestData", JSON.stringify(requestData));
    // requestData[30].value : storeId
    this.httpService.httpPost(this.pageData, requestData,
      (res) => {
        // console.log("push detail : ", res);
        //If "res" equal null or empty that mean Serve has some error with cookies
        if (!this.util.isNotNullOrEmpty(res)) {
          // this.util.popup.alertSessionPopup();
          localStorage.clear();
          window.location.reload();
        }
        this.storeDetails = res[0];
         this.util.popup.loadingActive(false);
        this.navCtrl.push(SurveyRetailProductPage3, {
          roundTypeForm: this.roundTypeForm,
          storeDetails: this.storeDetails,
          addressTypeForm: this.addressTypeForm,
          storeDetailsTypeForm: this.storeDetailsTypeForm
        });
      },
      (er) => {
        this.util.popup.loadingActive(false);
        console.log(er);
      });
  }

  validation() {
    if (
      this.storeDetailsTypeForm.value['storeProvince'] == "" ||
      this.storeDetailsTypeForm.value['storeName'] == "" ||
      this.storeDetailsTypeForm.value['storeLocationType'] == "" ||
      this.storeDetailsTypeForm.value['storeGroupType'] == "" ||
      this.addressTypeForm.value['addressNumber'] == "" ||
      this.addressTypeForm.value['district'] == "" ||
      this.provinceCode == ""
    ) {
      return false;
    }
    return true;
  }
}
