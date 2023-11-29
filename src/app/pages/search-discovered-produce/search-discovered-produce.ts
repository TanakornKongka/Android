import { Component, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpServiceProvider } from '../../providers/http-service-provider';
import { AlertController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { LoginPage } from '../login/login';
import { UtilityProvider } from '../../providers/utility-provider';
import { Content } from 'ionic-angular';
import * as AppConst from "../../../app/app.constant";
import { ResultSearchDiscoveredPage } from './result-search-discovered/result-search-discovered';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-search-discovered-produce',
  templateUrl: 'search-discovered-produce.html',
})

export class SearchDiscoveredProducePage {

  @ViewChild(Content) content: Content;
  @ViewChild('mySearch') mySearch;

  private brandMainList = [];
  private brandSecondList = [];
  private infinteForList = [];
  private dateStart = "";
  private dateEnd = [];
  private modelList = [];
  private allResultAmount: number;
  private page: number = 0;
  private productSent = AppConst.srpSerchDiscoveredSentT;
  private areaSent = AppConst.srpSerchDiscoveredSentA;
  private sentObject = AppConst.srpSerchProduceSent;
  private typeForm: FormGroup;
  private brandMainNameForm: FormGroup;
  private amount: number = 10;
  private user: any;
  private result: any = [];
  private searchTitle = "1";
  private items = [];
  private title = [];
  private pageData = { pageCode: AppConst.pageCode.canteen, curService: { service: "" } };
  private yearCurrent = new Date().getFullYear() + 543;
  private yearPast = this.yearCurrent - 10;
  private sent = [];
  private sentData = [];
  private unit: string;
  brandMain: any;
  brandSecond: any;
  Model: any;
  req = [];

  private initialZone = {
    zoneCode: { key: "", value: "กรุณาเลือกภาค" },
    areaCode: { key: "", value: "ทั้งหมด" },
    userStatus: ""
  };

  private thMonth = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายาน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  ];

  private product =
    [
      { "name": "กลุ่มสินค้า", "nameControl": "groupId", "firstChoice": "กรุณาเลือกกลุ่มสินค้า" },
      { "name": "ดีกรี", "nameControl": "searchDegree", "firstChoice": "ดีกรี" },
      { "name": "ขนาด (ปริมาตร)", "nameControl": "searchSize", "firstChoice": "ขนาด (ปริมาตร)" },
      { "name": "หน่วยบรรจุ", "nameControl": "searchSizeName", "firstChoice": "หน่วยบรรจุ" },
      { "name": "หน่วยนับ", "nameControl": "searchUnit", "firstChoice": "หน่วยนับ" },
      { "name": "ขนาด", "nameControl": "size", "firstChoice": "ขนาด" },
      { "name": "ครั้งที่สำรวจ", "nameControl": "surveyNo", "firstChoice": this.navParams.get('searchRoundNo').ROUND },
      { "name": "ปีที่สำรวจ", "nameControl": "yearSurvey", "firstChoice": this.navParams.get('searchRoundNo').YEAR },
      { "name": "ยี่ห้อหลัก ยี่ห้อรอง แบบ/รุ่น (รายละเอียดสินค้า)", "nameControl": "productName", "firstChoice": '' },
    ];

  private area =
    [
      { "name": "สำนักงานสรรพสามิตภาค", "nameControl": "zoneCode", "firstChoice": "กรุณาเลือกภาค" },
      { "name": "สำนักงานสรรพสามิตพื้นที่", "nameControl": "areaCode", "firstChoice": "ทั้งหมด" },
      { "name": "สำนักงานสรรพสามิตพื้นที่สาขา", "nameControl": "areaBranchCode", "firstChoice": "ทั้งหมด" },
      { "name": "ประเภทสถานที่ขายสินค้า", "nameControl": "storeTypeCode", "firstChoice": "กรุณาเลือกประเภทร้านค้า" }
      , { "name": "กลุ่มร้านค้า", "nameControl": "storeGroup", "firstChoice": "กรุณาเลือกกลุ่มร้านค้า" }
      , { "name": "กลุ่มสินค้า", "nameControl": "groupId", "firstChoice": "กรุณาเลือกกลุ่มสินค้า" }
      , { "name": "ครั้งที่สำรวจ", "nameControl": "surveyNo", "firstChoice": this.navParams.get('searchRoundNo').ROUND }
      , { "name": "ปีที่สำรวจ", "nameControl": "yearSurvey", "firstChoice": this.navParams.get('searchRoundNo').YEAR }
      , { "name": "กลุ่มประเภทสินค้า(เฉพาะเบียร์,เบียร์(Brewpub),น้ำอัดลม)", "nameControl": "catId", "firstChoice": "สินค้าทุกประเภท" }
    ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
    public alertCtrl: AlertController,
    public util: UtilityProvider,
    public platform: Platform
  ) {
    this.getInitailZone();
    this.getInformation(this.searchTitle);
    this.user = { "company": "Mock_spnOfficeName", "name": "Mock_spnUserName" }
    this.platform.resume.subscribe(() => {
      this.getInitailZone();
      this.getInformation(this.searchTitle);
    });
  }

  //ServiceArea
  getInitailZone() {
    // let ob = {"areaName":"สำนักงานสรรพสามิตพื้นที่นครปฐม 1","areaCode":"1|070100","userStatus":"area","zoneName":"สำนักงานสรรพสามิตภาคที่ 7","zoneCode":"1|070000"}
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getIntialZone;
    this.httpService.httpPost(this.pageData, null,
      (res) => {
        if (res.zoneCode != undefined && res.areaCode != undefined) {
          this.initialZone.zoneCode = { key: this.util.cutIndex(res.zoneCode), value: res.zoneName }
          this.initialZone.areaCode = { key: this.util.cutIndex(res.areaCode), value: res.areaName }
          this.initialZone.userStatus = res.userStatus
        } else {
          this.initialZone.userStatus = res.userStatus
        }
      },
      (er) => { })
  }

  getInformation(searchTitle) {
    console.log(searchTitle);
    this.result = [];
    this.sentData = [];
    if (searchTitle == "1") {
      this.title = this.product;
      this.getFromProduceType();
      this.getSentObject();
      this.getSentObjectProduceType();
      this.setItemProductList(searchTitle)
    } else {
      this.title = this.area;
      this.getFromProduceArea();
      this.getSentObjectProduceArea()
      this.setItemProductList(searchTitle)
    }
  }

  getFromProduceType() {
    let round = this.navParams.get('searchRoundNo').ROUND;
    let year = this.navParams.get('searchRoundNo').YEAR;
    this.typeForm = new FormGroup({
      groupId: new FormControl("", Validators.required),
      searchSize: new FormControl("", Validators.required),
      size: new FormControl("", Validators.required),
      searchUnit: new FormControl("", Validators.required),
      searchDegree: new FormControl("", Validators.required),
      searchSizeName: new FormControl("", Validators.required),
      productName: new FormControl("", Validators.required),
      surveyNo: new FormControl({key: round, value: round}, Validators.required),
      yearSurvey: new FormControl({key: year, value: year}, Validators.required),
      surveyDateTo: new FormControl("", Validators.required),
      surveyDateFrom: new FormControl("", Validators.required)
    });
  }

  getFromProduceArea() {
    let round = this.navParams.get('searchRoundNo').ROUND;
    let year = this.navParams.get('searchRoundNo').YEAR;
    this.typeForm = new FormGroup({
      zoneCode: new FormControl(this.initialZone.zoneCode, Validators.required),
      areaCode: new FormControl(this.initialZone.areaCode, Validators.required),
      areaBranchCode: new FormControl("", Validators.required),
      storeTypeCode: new FormControl("", Validators.required),
      storeGroup: new FormControl("", Validators.required),
      groupId: new FormControl("", Validators.required),
      catId: new FormControl("", Validators.required),
      surveyNo: new FormControl({key: round, value: round}, Validators.required),
      yearSurvey: new FormControl({key: year, value: year}, Validators.required),
      surveyDateTo: new FormControl("", Validators.required),
      surveyDateFrom: new FormControl("", Validators.required),
      productName: new FormControl("", Validators.required)
    });
  }

  newCall() {
    let value = this.typeForm.value;
    if (this.searchTitle == "1") {
      this.typeForm = new FormGroup({
        groupId: new FormControl(this.typeForm.value.groupId, Validators.required),
        searchSize: new FormControl(this.typeForm.value.searchSize, Validators.required),
        size: new FormControl(this.typeForm.value.size, Validators.required),
        searchUnit: new FormControl(this.typeForm.value.searchUnit, Validators.required),
        searchDegree: new FormControl(this.typeForm.value.searchDegree, Validators.required),
        searchSizeName: new FormControl(this.typeForm.value.searchSizeName, Validators.required),
        productName: new FormControl(this.typeForm.value.productName, Validators.required),
        surveyNo: new FormControl(value.surveyNo, Validators.required),
        yearSurvey: new FormControl(value.yearSurvey, Validators.required),
        surveyDateTo: new FormControl(value.surveyDateTo, Validators.required),
        surveyDateFrom: new FormControl(value.surveyDateFrom, Validators.required)
      });
    } else {
      this.typeForm = new FormGroup({
        zoneCode: new FormControl(value.zoneCode, Validators.required),
        areaCode: new FormControl(value.areaCode, Validators.required),
        areaBranchCode: new FormControl(value.areaBranchCode, Validators.required),
        storeTypeCode: new FormControl(value.storeTypeCode, Validators.required),
        storeGroup: new FormControl(value.storeGroup, Validators.required),
        groupId: new FormControl(value.groupId, Validators.required),
        catId: new FormControl(value.catId, Validators.required),
        surveyNo: new FormControl(value.surveyNo, Validators.required),
        yearSurvey: new FormControl(value.yearSurvey, Validators.required),
        surveyDateTo: new FormControl(value.surveyDateTo, Validators.required),
        surveyDateFrom: new FormControl(value.surveyDateFrom, Validators.required),
        productName: new FormControl(value.productName, Validators.required)
      });
    }
  }

  setItemProductList(searchTitle): void {
    this.items = [];
    this.sent = []
    if (searchTitle == "1") {
      this.getProduceTitle();
      this.getSurveyNo();
      this.getYearSurvey();
      for (let i = 0; i < this.product.length; i++) {
        this.clearItemList(i);
      }
    } else {
      // this.util.popup.loadingActive(true);
      this.getZoneCode()
      this.getStoreTypeCode()
      this.getAreaGroupId()
      // this.getAreaSurveyNo()
      // this.getAreaYearSurvey()
      this.getSurveyNo();
      this.getYearSurvey();
      for (let i = 0; i < this.area.length; i++) {
        this.clearItemList(i);
      }
      this.util.popup.loadingActive(false);
    }
  }

  isDisable(i): boolean {
    if (this.searchTitle != "1" && this.initialZone.zoneCode.key != "") {
      if (i == 0 || i == 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  intialTitle(i): string {
    let title: string
    if (i == 0) {
      title = this.initialZone.zoneCode.value
    } else if (i == 1) {
      title = this.initialZone.areaCode.value
    }
    return title;
  }

  clearItemList(i: any) {
    this.items[i] = [{ "key": "", "value": this.title[i].firstChoice }]
  }

  resetList(num) {
    for (let i = num; i < 6; i++) {
      this.clearItemList(i);
    }
  }

  //ServiceCategory Start
  getProduceTitle() {
    // this.util.popup.loadingActive(true);
    this.typeForm.value.groupId = "";
    for (let i = 0; i < 6; i++) {
      this.clearItemList(i);
    }
    this.pageData.curService = AppConst.srpSerchProducePageService.getSearchGroup;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.productSent.groupId] = this.items[this.productSent.groupId].concat(this.util.convertJsonToObject(res));
        if (this.items[this.productSent.groupId] != "") {
          this.util.popup.loadingActive(false);
        }
      },
      (er) => {
        this.util.popup.loadingActive(false);
      });
  }

  getSurveyNo() {
    this.clearItemList(this.productSent.surveyNo);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSurveyNo;
    this.httpService.httpPost(this.pageData, [],
      (res) => {
        this.items[this.productSent.surveyNo] = this.util.convertJsonToObject(res);
        this.util.popup.loadingActive(false);
      },
      (er) => { })
  }

  getYearSurvey() {
    this.clearItemList(this.productSent.yearSurvey);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getYearSurvey;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.productSent.yearSurvey] = this.util.convertJsonToObject(res);
        this.util.popup.loadingActive(false);
      },
      (er) => { })
  }

  getZoneCode() {
    this.typeForm.value.zoneCode = this.initialZone.zoneCode;
    this.clearItemList(this.areaSent.zoneCode);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getZoneCode;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.zoneCode] = this.items[this.areaSent.zoneCode].concat(this.util.convertJsonToObjectForZone(res));
        this.util.popup.loadingActive(false);
        if (this.initialZone.zoneCode.key != "") {
          this.typeForm.value.zoneCode = this.initialZone.zoneCode
          this.getValue(this.typeForm.value, 0)
          this.typeForm.value.areaCode = this.initialZone.areaCode
        }
        this.newCall();
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getAreaCode() {
    this.typeForm.value.areaCode = "";
    this.clearItemList(this.areaSent.areaCode);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSearchAreaCode;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.areaCode] = this.items[this.areaSent.areaCode].concat(this.util.convertJsonToObjectForZone(res));
        if (this.initialZone.areaCode.key != "") {
          this.typeForm.value.areaCode = this.initialZone.areaCode
          this.getValue(this.typeForm.value, 1)
        }
        this.newCall();
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getAreaBrachCode() {
    this.typeForm.value.areaBranchCode = "";
    this.clearItemList(this.areaSent.areaBranchCode);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSearchAreaBranchCode;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.areaBranchCode] = this.items[this.areaSent.areaBranchCode].concat(this.util.convertJsonToObject(res));
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getStoreTypeCode() {
    this.typeForm.value.storeTypeCode = "";
    this.clearItemList(this.areaSent.storeTypeCode);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getStoreType;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.storeTypeCode] = this.items[this.areaSent.storeTypeCode].concat(this.util.convertJsonToObject(res));
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getStoreGroup() {
    this.typeForm.value.storeGroup = "";
    this.clearItemList(this.areaSent.storeGroup);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getStoreGroup;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.storeGroup] = this.items[this.areaSent.storeGroup].concat(this.util.convertJsonToObject(res));
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getAreaGroupId() {
    this.typeForm.value.groupId = "";
    this.clearItemList(this.areaSent.groupId);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSearchGroup;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.groupId] = this.items[this.areaSent.groupId].concat(this.util.convertJsonToObject(res));
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getAreaCatId() {
    this.typeForm.value.catId = "";
    this.clearItemList(this.areaSent.catId);
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getCatId;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.catId] = this.items[this.areaSent.catId].concat(this.util.convertJsonToObject(res));
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getAreaSurveyNo() {
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getSurveyNo;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.surveyNo] = this.util.convertJsonToObject(res);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getAreaYearSurvey() {
    this.pageData.curService = AppConst.srpSerchDiscoveredPageService.getYearSurvey;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.items[this.areaSent.yearSurvey] = this.util.convertJsonToObject(res);
        console.log('this.sent : ', this.sent);
        this.typeForm.value.surveyNo = this.navParams.get('searchRoundNo').ROUND;
        this.typeForm.value.yearSurvey = this.navParams.get('searchRoundNo').YEAR;
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  //ServiceArea End
  getValue(service: any, i: any) {
    this.checkGrouoId();
    if (this.searchTitle == "1") {
      switch (i) {
        case 0: this.sentData[this.sentObject.groupId].value = this.typeForm.value.groupId.key;
          this.newBrandMainName()
          this.clearItemList(1);
          this.clearItemList(2);
          this.clearItemList(3);
          this.clearItemList(4);
          this.clearItemList(5);
          this.sentData[2].value = "";
          this.sentData[3].value = "";
          this.sentData[4].value = "";
          this.sentData[5].value = "";
          if (this.typeForm.value.groupId.key === "7001" || this.typeForm.value.groupId.key === "7002" || this.typeForm.value.groupId.key === "7003") {
            this.getDegreeCode();
            this.getSizeCode();
            this.getSizeName();
            this.getUnit();
            this.unit = this.typeForm.value.searchSize.value;
          } else if (this.typeForm.value.groupId.key === "0501" || this.typeForm.value.groupId.key === "0802") {
            this.getsize();
            this.unit = this.typeForm.value.size.value;
          } else {
            this.getSizeCode();
            this.getSizeName();
            this.getUnit();
            this.unit = this.typeForm.value.searchSize.value;
          }
          this.util.popup.loadingActive(false);
          break;

        case 1: this.sentData[this.sentObject.groupId].value = this.typeForm.value.groupId.key;
          this.clearItemList(2);
          this.clearItemList(3);
          this.clearItemList(4);
          this.clearItemList(5);
          if (this.typeForm.value.groupId.key === "7001" || this.typeForm.value.groupId.key === "7002" || this.typeForm.value.groupId.key === "7003") {
            this.getSizeCode();
            this.getSizeName();
            this.getUnit();
            this.unit = this.typeForm.value.searchSize.value;
          } else if (this.typeForm.value.groupId.key === "0501" || this.typeForm.value.groupId.key === "0802") {
            this.getsize();
            this.unit = this.typeForm.value.size.value;
          } else {
            this.getSizeCode();
            this.getSizeName();
            this.getUnit();
            this.unit = this.typeForm.value.searchSize.value;
          }
          this.util.popup.loadingActive(false);
          break;

        case 2: this.sentData[this.sentObject.groupId].value = this.typeForm.value.groupId.key;
          this.clearItemList(3);
          this.clearItemList(4);
          this.clearItemList(5);
          if (this.typeForm.value.groupId.key === "7001" || this.typeForm.value.groupId.key === "7002" || this.typeForm.value.groupId.key === "7003") {
            this.getSizeName();
            this.getUnit();
            this.unit = this.typeForm.value.searchSize.value;
          } else if (this.typeForm.value.groupId.key === "0501" || this.typeForm.value.groupId.key === "0802") {
            this.getsize();
            this.unit = this.typeForm.value.size.value;
          } else {
            this.getSizeName();
            this.getUnit();
            this.unit = this.typeForm.value.searchSize.value;
          }
          this.util.popup.loadingActive(false);
          break;

        case 3: this.sentData[this.sentObject.groupId].value = this.typeForm.value.groupId.key;
          this.clearItemList(4);
          this.clearItemList(5);
          if (this.typeForm.value.groupId.key === "7001" || this.typeForm.value.groupId.key === "7002" || this.typeForm.value.groupId.key === "7003") {
            this.getUnit();
            this.unit = this.typeForm.value.searchSize.value;
          } else if (this.typeForm.value.groupId.key === "0501" || this.typeForm.value.groupId.key === "0802") {
            this.getsize();
            this.unit = this.typeForm.value.size.value;
          } else {
            this.getUnit();
            this.unit = this.typeForm.value.searchSize.value;
          }
          this.util.popup.loadingActive(false);
          break;

        case 4: this.sentData[this.sentObject.groupId].value = this.typeForm.value.groupId.key;
          this.clearItemList(5);
          if (this.typeForm.value.groupId.key === "7001" || this.typeForm.value.groupId.key === "7002" || this.typeForm.value.groupId.key === "7003") {
            this.util.popup.loadingActive(false);
            this.unit = this.typeForm.value.searchSize.value;
          } else if (this.typeForm.value.groupId.key === "0501" || this.typeForm.value.groupId.key === "0802") {
            this.util.popup.loadingActive(false);
            this.unit = this.typeForm.value.size.value;
          } else {
            this.unit = this.typeForm.value.searchSize.value;
            this.util.popup.loadingActive(false);
          }
          break;

        case 5:
          this.unit = this.typeForm.value.size.value;
          this.util.popup.loadingActive(false);
          break;
      }
    } else {
      switch (i) {
        case 0: this.sent[this.areaSent.zoneCode].value = service.zoneCode.key;
          // this.util.popup.loadingActive(true);
          this.clearItemList(2)
          this.sent[1].value = ""
          this.sent[2].value = ""
          this.getAreaCode()
          break;

        case 1: this.sent[this.areaSent.areaCode].value = service.areaCode.key;
          // this.util.popup.loadingActive(true);
          this.sent[2].value = ""
          this.getAreaBrachCode();
          break;

        case 2: this.sent[this.areaSent.areaBranchCode].value = this.util.cutIndex(service.areaBranchCode.key);
          break;

        case 3: this.sent[this.areaSent.storeTypeCode].value = this.util.cutIndex(service.storeTypeCode.key);
          this.clearItemList(4);
          this.sent[4].value = ""
          if (service.storeTypeCode.key != "") {
            // this.util.popup.loadingActive(true);
            this.getStoreGroup();
          }
          break;

        case 4: this.sent[this.areaSent.storeGroup].value = service.storeGroup.key;
          break;

        case 5: this.sent[this.areaSent.groupId].value = this.typeForm.value.groupId.key;
          this.clearItemList(6);
          this.sent[6].value = ""
          if (this.typeForm.value.groupId.key != "") {
            // this.util.popup.loadingActive(true);
            this.getAreaCatId();
          }
          break;

        case 8:
          if (service.catId.key != "") {
            this.sent[this.areaSent.catId].value = this.util.cutIndexComma(service.catId.key);
          } else {
            this.sent[this.areaSent.catId].value = service.catId.key;
          }
          break;

        case 7: this.sent[this.areaSent.surveyNo].value = service.surveyNo.key;
          break;

        case 8: this.sent[this.areaSent.yearSurvey].value = service.yearSurvey.key;
          break;
      }
    }
    this.newCall()
    //this.util.popup.loadingActive(false);
  }

  newBrandMainName() {
    this.brandMainNameForm = new FormGroup({
      brandMainName: new FormControl("")
    });
  }

  getDegreeCode(): void {
    this.clearItemList(1);
    this.typeForm.value.searchDegree = "";
    this.pageData.curService = AppConst.searchProduceService.searchDegree;
    this.httpService.httpPost(this.pageData, this.sentData,
      (res) => {
        this.setList(1, res);
        this.util.popup.loadingActive(false)
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getSizeCode(): void {
    this.clearItemList(2);
    this.typeForm.value.searchSize = "";
    this.pageData.curService = AppConst.searchProduceService.searchSize;
    this.httpService.httpPost(this.pageData, this.sentData,
      (res) => {
        this.setList(2, res);
        this.util.popup.loadingActive(false)
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getSizeName(): void {
    this.clearItemList(3);
    this.typeForm.value.searchSizeName = "";
    this.pageData.curService = AppConst.searchProduceService.searchSize;
    //   var req = [ 
    //     { 
    //        "name":"groupId",
    //        "value": this.typeForm.value.groupId.key
    //     }
    //  ];
    this.httpService.httpPost(this.pageData, this.sentData,
      (res) => {
        this.setList(3, res);
        this.util.popup.loadingActive(false)
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getUnit(): void {
    this.clearItemList(4);
    this.typeForm.value.searchUnit = "";
    this.pageData.curService = AppConst.searchProduceService.searchUnit;
    this.httpService.httpPost(this.pageData, this.sentData,
      (res) => {
        this.setList(4, res);
        this.util.popup.loadingActive(false)
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getsize(): void {
    this.clearItemList(5);
    this.typeForm.value.searchSize = "";
    this.pageData.curService = AppConst.searchProduceService.searchSize;
    this.httpService.httpPost(this.pageData, this.sentData,
      (res) => {
        this.setList(5, res);
        this.util.popup.loadingActive(false)
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getSentObjectProduceType() {
    this.httpService.http.get("assets/jsonData/Dummy-search-discovered.json")
      .subscribe(
        (data: any) => {
          let i = data.productSentT;
          this.sent = i;
        });
  }

  getSentObjectProduceArea() {
    this.httpService.http.get("assets/jsonData/Dummy-search-discovered.json")
      .subscribe(
        (data: any) => {
          let i = data.areaSent;
          this.sent = i;
        });
  }

  checkDate(checkDate): string {
    let day
    if (checkDate != "") {
      day = new Date(checkDate);
      return this.formatDateTime(day.getDate()) + "/" + this.formatDateTime(day.getMonth() + 1) + "/" + day.getFullYear();
    } else {
      return ""
    }
  }

  formatDateTime(value: number): string {
    return value < 10 ? "0" + value.toString() : value.toString();
  }

  getSearchResult(searchTitle: string) {
    this.util.popup.loadingActive(true);

    let startDate = this.typeForm.value.surveyDateTo;
    let endDate = this.typeForm.value.surveyDateFrom;
    let reqData = [];
    if (searchTitle == "1") {
      this.setReq();
      this.pageData.curService = AppConst.srpSerchDiscoveredPageService.sentSearch;
      reqData = this.req;
    } else {
      this.pageData.curService = AppConst.srpSerchDiscoveredPageService.sentSearchByArea;
      this.sent[this.areaSent.surveyDateTo].value = this.checkDate(startDate);
      this.sent[this.areaSent.surveyDateFrom].value = this.checkDate(endDate);
      this.sent[this.areaSent.surveyNo].value = this.typeForm.value.surveyNo.value;
      this.sent[this.areaSent.yearSurvey].value = this.typeForm.value.yearSurvey.value;
      reqData = this.sent;
    }
    this.httpService.httpPost(this.pageData, reqData,
      (res) => {
        let mapObj;
        if (searchTitle == "1") {
          mapObj = res;
        } else {
          mapObj = _.map(res, (item:any) => {
            item.jsonPrimaryKey = JSON.parse(item.jsonPrimaryKey);
            return item;
          });
        }
        if (res != null && res != [] && res != {} && res != 12 && res.length != 0) {
          this.navCtrl.push(ResultSearchDiscoveredPage, { itemList: mapObj, sent: this.sent, url: this.pageData.curService });
        } else {
          this.empty();
        }
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  showList(): boolean {
    if (this.result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  startSearch(type) {
    if (this.searchTitle == "1") {
      if (type.groupId == "") {
        this.alerFill("กลุ่มสินค้า");
      }
      else if (type.productName == "") {
        this.alerFill("ยี่ห้อหลัก ยี่ห้อรอง แบบ/รุ่น (รายละเอียดสินค้า)");
      } else {
        this.getSearchResult(this.searchTitle)
      }
    } else {
      if (type.zoneCode.key == "") {
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
      if (i == 0 || i == 6 || i == 7) {
        return true;
      } else {
        return false;
      }
    } else {
      if (i == 0 || i == 6 || i == 7) {
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
      if (i == 0 || i == 1) {
        return !this.isDisable(i);
      } else {
        return true;
      }
    }
  }

  selectedMain(i): boolean {
    if (this.searchTitle == "1") {
      if (i == 2) {
        return true;
      } else {
        return false;
      }
    }
  }

  selectedSub(i): boolean {
    if (this.searchTitle == "1") {
      if (i == 3) {
        return true;
      } else {
        return false;
      }
    } else if (this.searchTitle == "2") {
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
    }
  }

  changePage(i) {
    if (i >= 0 && i < this.result.length) {
      this.page = i;
    } else if (i == -2) {
      this.page = this.result.length - 1;
    }
  }

  public clearDateTo() {
    this.typeForm.value.surveyDateTo = ""
    this.newCall()
  }

  public clearDateFrom() {
    this.typeForm.value.surveyDateFrom = ""
    this.newCall()
  }

  setList(num, res) {
    let i = [];
    let r = [];
    r = this.util.convertJsonToObject(res)
    for (let j = 0; j < 50; j++) {
      if (j < r.length) {
        i.push(r[j])
      }
    }
    this.infinteForList[num] = r;
    if (i[0] == undefined) {
      this.items[num] = this.items[num].concat(this.util.convertJsonToObject(res));
    } else {
      this.items[num] = this.items[num].concat(i);
    }
  }

  getSentObject() {
    this.httpService.http.get("assets/jsonData/Dummy-search-produce.json")
      .subscribe(
        (data: any) => {
          let i = data.sent;
          this.sentData = i;
        });
  }

  checkGrouoId() {
    if (this.typeForm.value.groupId.key == '' || this.typeForm.value.groupId == '') {
      return false;
    } else {
      return true;
    }
  }

  setReq() {
    this.req = [
      {
        "name": "catId",
        "value": ''
      },
      {
        "name": "brandMainCode",
        "value": ''
      },
      {
        "name": "brandSecondCode",
        "value": ''
      },
      {
        "name": "modelCode",
        "value": ''
      },
      {
        "name": "userStatus",
        "value": this.initialZone.userStatus
      },
      {
        "name": "groupId",
        "value": this.typeForm.value.groupId.key || ''
      },
      {
        "name": "degree",
        "value": this.typeForm.value.searchDegree.value || ''
      },
      {
        "name": "sizeCode",
        "value": this.unit || ''
      },
      {
        "name": "sizeName",
        "value": this.typeForm.value.searchSizeName.value || ''
      },
      {
        "name": "unitCode",
        "value": this.typeForm.value.searchUnit.value || ''
      },
      {
        "name": "productDesc",
        "value": this.typeForm.value.productName || ''
      },
      {
        "name": "surveyNo",
        "value": this.typeForm.value.surveyNo.value || ''
      },
      {
        "name": "yearSurvey",
        "value": this.typeForm.value.yearSurvey.value || ''
      },
      {
        "name": "surveyDateTo",
        "value": this.checkDate(this.typeForm.value.surveyDateTo)
      },
      {
        "name": "surveyDateFrom",
        "value": this.checkDate(this.typeForm.value.surveyDateFrom)
      }
    ];
  }
}


