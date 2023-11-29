import { Component, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpServiceProvider } from '../../providers/http-service-provider';
import { AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { UtilityProvider } from "../../providers/utility-provider";
import { LoginPage } from '../login/login';
import { Content } from 'ionic-angular';
import * as AppConst from "../../../app/app.constant";
import { ResultSearchProducePage } from './result-search-produce/result-search-produce';

@IonicPage()
@Component({
  selector: 'page-search-produce',
  templateUrl: 'search-produce.html',
})

export class SearchProducePage {

  @ViewChild(Content) content: Content;
  scrollToTop() {
    this.content.scrollToTop();
  }

  private brandMainList = [];
  private isClear = "false"
  //private allResultAmount:number;
  //private page:number = 0;
  private sentObject = AppConst.srpSerchProduceSent;
  private loginForm: FormGroup;
  private typeForm: FormGroup;
  private brandMainNameForm: FormGroup;
  private user: any;
  private saleTypeData: any;
  private sent = [];
  private result = [];
  private pageData = { pageCode: AppConst.pageCode.canteen, curService: { service: "" } };
  private searchTitle = "1";
  private isShow: boolean;
  private barcode = ""
  private items = [];
  private isTimeout = true;
  private infinteForList = [];
  private req = [];
  private unit: string;
  private isShowBrandMainName = false;

  saleType = [
    {
      key: 1,
      value: 'ในประเทศ'
    },
    {
      key: 2,
      value: 'ส่งออก'
    }
  ];

  private title =
    [
      { "name": "กลุ่มสินค้า", "nameControl": "groupId", "firstChoice": "กรุณาเลือกกลุ่มสินค้า" }
      , { "name": "ดีกรี", "nameControl": "searchDegree", "firstChoice": "ดีกรี" }
      , { "name": "ขนาด (ปริมาตร)", "nameControl": "searchSize", "firstChoice": "ขนาด (ปริมาตร)" }
      , { "name": "หน่วยบรรจุ", "nameControl": "searchSizeName", "firstChoice": "หน่วยบรรจุ" }
      , { "name": "หน่วยนับ", "nameControl": "searchUnit", "firstChoice": "หน่วยนับ" }
      , { "name": "ขนาด", "nameControl": "size", "firstChoice": "ขนาด" }
    ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
    public alertCtrl: AlertController,
    public barcodeScanner: BarcodeScanner,
    public util: UtilityProvider,
    public platform: Platform
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('chorm', Validators.required),
      password: new FormControl('chorm23', Validators.required)
    });

    this.searchTitle = "1";
    this.platform.resume.subscribe(() => {
      this.newData();
    });
    this.newData();
    this.newBrandMainName()
    this.user = { "company": "Mock_spnOfficeName", "name": "Mock_spnUserName" };
  }

  newData() {
    this.typeForm = new FormGroup({
      saleTypeId: new FormControl(""),
      groupId: new FormControl("", Validators.required),
      searchSize: new FormControl("", Validators.required),
      size: new FormControl("", Validators.required),
      searchUnit: new FormControl("", Validators.required),
      searchDegree: new FormControl("", Validators.required),
      searchSizeName: new FormControl("", Validators.required)
    });
    this.typeForm.controls['saleTypeId'].setValue({
      key: 1,
      value: 'ในประเทศ'
    });
    this.setItemList()
  }

  newCall() {
    this.typeForm = new FormGroup({
      saleTypeId: new FormControl(this.typeForm.value.saleTypeId),
      groupId: new FormControl(this.typeForm.value.groupId, Validators.required),
      searchSize: new FormControl(this.typeForm.value.searchSize, Validators.required),
      size: new FormControl(this.typeForm.value.size, Validators.required),
      searchUnit: new FormControl(this.typeForm.value.searchUnit, Validators.required),
      searchDegree: new FormControl(this.typeForm.value.searchDegree, Validators.required),
      searchSizeName: new FormControl(this.typeForm.value.searchSizeName, Validators.required)
    });
    if (this.typeForm.value.groupId.key !== "" && this.typeForm.value.groupId !== "") {
      this.isShowBrandMainName = true;
    } else {
      this.isShowBrandMainName = false;
    }
  }

  newBrandMainName() {
    this.brandMainNameForm = new FormGroup({
      brandMainName: new FormControl("")
    });
  }

  setItemList(): void {
    for (let i = 0; i < 5; i++) {
      this.clearItemList(i)
    }
    this.getInformation(this.searchTitle);
  }

  clearItemList(i) {
    if (i != 0) {
      this.items[i] = [];
      this.items[i] = [{ "key": "", "value": this.title[i].firstChoice }]
    } else {
      this.items[i] = [{ "key": "", "value": this.title[i].firstChoice }]
    }
  }

  showList(): boolean {
    if (this.result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  scanBarcode() {
    this.util.popup.loadingActive(true);
    let scanOption = {
      disableSuccessBeep: true
    };
    this.barcodeScanner.scan(scanOption).then(barcodeData => {
      this.barcode = barcodeData.text;
      // this.getSearchResult();
      this.getSearchResultNonBarcode();
    }).catch(err => {
      this.util.popup.loadingActive(false);
    });
  }

  getSentObject() {
    this.httpService.http.get("assets/jsonData/Dummy-search-produce.json")
      .subscribe(
        (data: any) => {
          let i = data.sent;
          this.sent = i;
        });
  }

  saleTypeChanged(saleTypeId) {
  }

  getInformation(searchTitle) {
    this.sent = [];
    if (searchTitle == "1") {
      this.items = [];
      this.getSentObject();
      this.getProduceTitle();
      this.barcode = "";
      this.result = [];
      this.isShow = true;
    } else {
      this.getSentObject();
      this.getProduceTitle();
      this.result = [];
      this.barcode = "";
      this.isShow = false;
      this.typeForm.value.groupId = "";
    }
  }

  getValue(service, i) {
    this.util.popup.loadingActive(true);
    this.result = [];
    switch (i) {
      case 0: this.sent[this.sentObject.groupId].value = service.groupId.key;
        this.newBrandMainName()
        this.clearItemList(1);
        this.clearItemList(2);
        this.clearItemList(3);
        this.clearItemList(4);
        this.clearItemList(5);
        this.sent[2].value = "";
        this.sent[3].value = "";
        this.sent[4].value = "";
        this.sent[5].value = "";
        if (service.groupId.key === "7001" || service.groupId.key === "7002" || service.groupId.key === "7003") {
          this.getDegreeCode();
          this.getSizeCode();
          this.getSizeName();
          this.getUnit();
          this.unit = this.typeForm.value.searchSize.value;
        } else if (service.groupId.key === "0501" || service.groupId.key === "0802") {
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

      case 1: this.sent[this.sentObject.groupId].value = service.groupId.key;
        this.clearItemList(2);
        this.clearItemList(3);
        this.clearItemList(4);
        this.clearItemList(5);
        if (service.groupId.key === "7001" || service.groupId.key === "7002" || service.groupId.key === "7003") {
          this.getSizeCode();
          this.getSizeName();
          this.getUnit();
          this.unit = this.typeForm.value.searchSize.value;
        } else if (service.groupId.key === "0501" || service.groupId.key === "0802") {
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

      case 2: this.sent[this.sentObject.groupId].value = service.groupId.key;
        this.clearItemList(3);
        this.clearItemList(4);
        this.clearItemList(5);
        if (service.groupId.key === "7001" || service.groupId.key === "7002" || service.groupId.key === "7003") {
          this.getSizeName();
          this.getUnit();
          this.unit = this.typeForm.value.searchSize.value;
        } else if (service.groupId.key === "0501" || service.groupId.key === "0802") {
          this.getsize();
          this.unit = this.typeForm.value.size.value;
        } else {
          this.getSizeName();
          this.getUnit();
          this.unit = this.typeForm.value.searchSize.value;
        }
        this.util.popup.loadingActive(false);

        break;

      case 3: this.sent[this.sentObject.groupId].value = service.groupId.key;
        this.clearItemList(4);
        this.clearItemList(5);
        if (service.groupId.key === "7001" || service.groupId.key === "7002" || service.groupId.key === "7003") {
          this.getUnit();
          this.unit = this.typeForm.value.searchSize.value;
        } else if (service.groupId.key === "0501" || service.groupId.key === "0802") {
          this.getsize();
          this.unit = this.typeForm.value.size.value;
        } else {
          this.getUnit();
          this.unit = this.typeForm.value.searchSize.value;
        }
        this.util.popup.loadingActive(false);

        break;

      case 4: this.sent[this.sentObject.groupId].value = service.groupId.key;
        this.clearItemList(5);
        if (service.groupId.key === "7001" || service.groupId.key === "7002" || service.groupId.key === "7003") {
          this.util.popup.loadingActive(false);
          this.unit = this.typeForm.value.searchSize.value;
        } else if (service.groupId.key === "0501" || service.groupId.key === "0802") {
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
    this.newCall();
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

  private getProduceTitle(): void {
    this.typeForm.value.groupId = "";
    this.typeForm.value.catId = "";
    this.clearItemList(0);
    this.pageData.curService = AppConst.srpSerchProducePageService.getSearchGroup;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.setList(0, res);
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
    this.newCall();
  }

  getDegreeCode(): void {
    this.clearItemList(1);
    this.typeForm.value.searchDegree = "";
    this.pageData.curService = AppConst.searchProduceService.searchDegree;
    this.httpService.httpPost(this.pageData, this.sent,
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
    this.httpService.httpPost(this.pageData, this.sent,
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
    //        "value": this.sent[1].value
    //     }
    //  ];
    this.httpService.httpPost(this.pageData, this.sent,
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
    this.httpService.httpPost(this.pageData, this.sent,
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
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        this.setList(5, res);
        this.util.popup.loadingActive(false)
      },
      (er) => {
        this.util.popup.loadingActive(false);
      })
  }

  getNum() {
    this.getSearchResult()
  }

  getSearchResult() {
    let arrayAmount = 0;
    this.pageData.curService = AppConst.srpSerchProducePageService.sentSearch;
    this.sent[this.sentObject.barCode].value = this.barcode;
    this.sent[this.sentObject.txtBarCode].value = this.barcode;
    this.httpService.httpPost(this.pageData, this.sent,
      (res) => {
        if (res != null && res != [] && res != {} && res != 12 && res.length != 0 && res[0] != { "error": "error" }) {
          this.isTimeout = false;
          this.navCtrl.push(ResultSearchProducePage, {
            itemList: res,
            saleTypeSelected: this.typeForm.value['saleTypeId'].key,
            searchTitle: this.searchTitle
          });
        } else {
          this.isTimeout = false;
          this.result = [];
          this.empty();
          this.util.popup.loadingActive(false);
        }
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.isTimeout = false;
        this.util.popup.loadingActive(false);
      })

    setTimeout(() => {
      if (this.isTimeout) {
        this.util.popup.alertPopup("Session Timeout", "ใช้เวลาค้นหานานเกินไป", "OK", () => {
          this.httpService.unsubscribe();
          this.isTimeout = false;
          this.util.popup.loadingActive(false);
        }, false);
      }
    }, 10000);
  }

  startSearch(type) {
    this.util.popup.loadingActive(true);
    if (this.searchTitle == "1") {
      if (type.groupId != "" && type.groupId.key != "") {
        if (this.brandMainNameForm.value['brandMainName'] !== "") {
          this.getSearchResultNonBarcode();
        } else {
          this.alerFill("ยี่ห้อหลัก ยี่ห้อรอง แบบ/รุ่น (รายละเอียดสินค้า)")
        }
      } else {
        this.alerFill(this.title[0].name)
      }
    } else if (this.searchTitle != "1") {
      this.newBrandMainName()
      this.unit = "";
      this.typeForm.value.searchSizeName = "";
      this.typeForm.value.searchUnit = "";
      this.getSearchResultNonBarcode();
    }
  }

  getSearchResultNonBarcode() {
    this.pageData.curService = AppConst.searchProduceService.search;
    this.setReq();
    this.httpService.httpPost(this.pageData, this.req,
      (res) => {
        if (res != null && res != [] && res != {} && res != 12 && res.length != 0 && res[0] != { "error": "error" }) {
          this.isTimeout = false;
          this.navCtrl.push(ResultSearchProducePage, {
            itemList: res,
            saleTypeSelected: this.typeForm.value['saleTypeId'].key,
            searchTitle: this.searchTitle
          });
        } else {
          this.isTimeout = false;
          this.result = [];
          this.empty();
          this.util.popup.loadingActive(false);
        }
        this.util.popup.loadingActive(false);
      },
      (er) => {
        this.isTimeout = false;
        this.util.popup.loadingActive(false);
      })

    setTimeout(() => {
      if (this.isTimeout) {
        this.util.popup.alertPopup("Session Timeout", "ใช้เวลาค้นหานานเกินไป", "OK", () => {
          this.httpService.unsubscribe();
          this.isTimeout = false;
          this.util.popup.loadingActive(false);
        }, false);
      }
    }, 10000);
  }

  setReq() {
    this.req = [
      {
        "name": "barCode",
        "value": this.barcode
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
        "name": "brandMainName",
        "value": this.brandMainNameForm.value['brandMainName']
      }
    ];
  }

  alerFill(alert) {
    this.util.popup.alertPopup('SRP', 'E40011: กรุณาระบุ' + alert, 'OK')
    this.util.popup.loadingActive(false);
  }

  empty() {
    this.util.popup.alertPopup('SRP', 'IOOO4:ไม่พบข้อมูลตามเงื่อนไขระบุ', 'OK')
    this.util.popup.loadingActive(false);
  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }

  listShow(i): boolean {
    if (this.items[i] != undefined && this.items[i].length > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  getMore(event, i) {
    let n = [];
    let r = [];
    r = this.infinteForList[i];
    let amount = this.items[i].length;
    for (let j = amount; j < amount + 50; j++) {
      if (j < r.length) {
        n.push(r[j])
      }
    }
    this.items[i] = this.items[i].concat(n);
    event.component.items = this.items[i];
    event.infiniteScroll.complete();
  }
}
