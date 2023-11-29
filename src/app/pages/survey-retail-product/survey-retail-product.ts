
import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ModalController,
  ActionSheetController,
  Platform
} from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { MapDialog } from '../dialog-map/dialog-map';
import { WebHomePage } from '../web-home/web-home';
import { HttpServiceProvider } from "../../providers/http-service-provider";
import * as AppConst from "../../../app/app.constant";
import { UtilityProvider } from '../../providers/utility-provider';
import { SurveyRetailProductPage2 } from './survey-retial-product-step-2/survey-retail-product-step-2';

@Component({
  selector: 'page-survey-retail-product',
  templateUrl: 'survey-retail-product.html',
})

export class SurveyRetailProductPage {
  private typeForm: FormGroup;
  private DateNow: any = new Date();
  private DateNowString = (new Date()).getDate() + "/" + this.pad(((new Date()).getMonth() + 1), 2) + "/" + ((new Date()).getFullYear() + 543);
  private surveyPeriodOptions = [1, 2, 3, 4, 5];
  private setSurvayYear = (this.DateNow).getFullYear() + 543;
  private surveyYearOptions = [this.setSurvayYear - 1, this.setSurvayYear, this.setSurvayYear + 1];
  private surveyDateOptions = [this.DateNowString];
  private pageData = { pageCode: AppConst.pageCode.survey_retail_product, curService: { service: "" } };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: ModalController,
    private httpService: HttpServiceProvider,
    private util: UtilityProvider,
    public platform: Platform
  ) {
    this.typeForm = new FormGroup({
      surveyPeriod: new FormControl("1"),
      surveyYear: new FormControl((this.DateNow).getFullYear() + 543),
      surveyDate: new FormControl(this.DateNowString)
    });
    this.callServices();
    this.platform.resume.subscribe(() => {
      this.callServices();
    });
  }

  nextPage() {
    this.navCtrl.push(SurveyRetailProductPage2, { roundTypeForm: this.typeForm });
  }

  private callServices() {
    this.callServiceGetSearchRoundNo();
    this.callServiceCheckBlogWeb();
  }

  callServiceGetSearchRoundNo() {
    this.pageData.curService = AppConst.srpService.searchRoundNo;
    this.httpService.httpPost(this.pageData, [],
      (res) => {
        this.typeForm.controls['surveyPeriod'].setValue(res.ROUND);
        this.typeForm.controls['surveyYear'].setValue(res.YEAR);
      },
      (er) => {
        console.log(er);
      });
  }

  callServiceCheckBlogWeb() {
    this.pageData.curService = AppConst.srpService.checkBlogWeb;
    this.httpService.httpPost(this.pageData, [],
      (res) => {
        if (!this.util.isNotNullOrEmpty(res)) {
          // this.util.popup.alertSessionPopup();
          localStorage.clear();
          window.location.reload();
        }
        if (res.blogWeb == "true") {
          let data = res.lastSurveyRound.split(",");
          // if(data.length >= 4){
            let message = "ระบบได้ปิดการแจ้งสำรวจราคาขายปลีก ครั้งที่ " + data[0] + "/" + data[1] + " แล้ว เนื่องจากเกินระยะเวลาที่กำหนด " + data[2] + "-" + data[3];
            this.util.popup.alertPopupDismiss("SRP Survey", message, "ตกลง", 
              ()=>{
                this.navCtrl.pop();
              }
            );
          // }

        }
      },
      (er) => {
        console.log(er);
      });
  }

  // Format NUMBER with SIZE digit ex. 002
  pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
