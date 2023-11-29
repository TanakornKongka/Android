
import { UtilityProvider } from './../../providers/utility-provider';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SearchProducePage } from '../search-produce/search-produce';
import { SurveyRetailProductPage } from '../survey-retail-product/survey-retail-product';
import { SearchDiscoveredProducePage } from '../search-discovered-produce/search-discovered-produce';
import { SearchServiceProducePage } from '../search-service-produce/search-service-produce';
import { HttpServiceProvider } from './../../providers/http-service-provider';
import { LoginPage } from '../login/login';
import * as AppConst from "../../../app/app.constant";
import { PopupProvider } from '../../providers/popup-provider';

@Component({
  selector: 'page-web-home',
  templateUrl: 'web-home.html'
})

export class WebHomePage
{
  private user: any;
  private pageData = { pageCode: AppConst.pageCode.canteen, curService: { service: "" } };
  private appVersion: any;

  constructor(
    private navCtrl: NavController,
    private util: UtilityProvider,
    private httpService: HttpServiceProvider,
    public plt: Platform,
  )
  {
    this.user = { "company": "", "name": "" };
    this.appVersion = this.util.getAppVersion();
    this.init();
  }

  private init(): void
  {
    this.pageData.curService = AppConst.srpService.getSession;
    this.httpService.httpPost(this.pageData, {},
      (response) =>
      {
        if(!this.util.isNotNullOrEmpty(response)){
          // this.util.popup.alertSessionPopup();
          localStorage.clear();
          window.location.reload();
        }
        console.log(response);
        this.user.company = response.officeName;
        this.user.name = response.userFullName;
      },
      (error) =>{});
  }

  

  openSearchProduce()
  {
    this.navCtrl.push(SearchProducePage);
  }
  openSearchSurveyProduch()
  {
    this.navCtrl.push(SurveyRetailProductPage);
  }
  openSearchDiscovered()
  {
    this.pageData.curService = AppConst.srpService.searchRoundNo;
    this.httpService.httpPost(this.pageData, [],
    (res) =>
    {
      this.navCtrl.push(SearchDiscoveredProducePage,{
        searchRoundNo: res
      });
    },
    (er) => {});
  }
  openSearchProduchService()
  {
    this.navCtrl.push(SearchServiceProducePage);
  }
  

  logout()
  {
    this.httpService.logout(
      (response) =>
      {
        if (response.status == "ok")
        {
          this.navCtrl.setRoot(LoginPage);
        }
      },
      (error) =>
      {
        if (error.status == "no")
        {
          this.util.popup.alertPopup(null, 'โปรดตรวจสอบระบบเครือข่าย', 'OK')
        }
      }, false);

  }

}