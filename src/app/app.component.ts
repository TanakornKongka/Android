import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import * as AppConst from "./app.constant";
import { UtilityProvider } from "./providers/utility-provider";
import { HomePage } from "./pages/home/home";
import { WebHomePage } from "./pages/web-home/web-home";

import { PushNotificationPage } from "./pages/push-notification/push-notification";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { LoginPage } from "./pages/login/login";
import { SearchProducePage } from "./pages/search-produce/search-produce";
import { SearchDiscoveredProducePage } from "./pages/search-discovered-produce/search-discovered-produce";
import { SearchServiceProducePage } from "./pages/search-service-produce/search-service-produce";
import { SurveyRetailProductPage } from "./pages/survey-retail-product/survey-retail-product";
import { Deeplinks } from "@ionic-native/deeplinks";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private rootPage: any = null;
  private prePage: any = this.rootPage;
  private pages = [
    {
      title: "Home",
      icon: "assets/images/icon/home.svg",
      component: WebHomePage,
      opens: true,
    },
    {
      title: "Logout",
      icon: "assets/images/icon/home.svg",
      component: LoginPage,
      opens: false,
    },
  ];

  private readonly userTypeEnum = AppConst.userTypeEnum;
  private usertype = this.userTypeEnum.guest;
  private profile: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private iab: InAppBrowser,
    private util: UtilityProvider,
    private deeplinks: Deeplinks
  ) {
    this.initializeApp();
    // this.prePage = LoginPage;
  }
  private initializeApp() {
    console.log('0');
    this.platform.ready().then(() => {
      console.log('1');
      this.statusBar.styleDefault();
      console.log('2');
      this.splashScreen.hide();
      console.log('3');
      // if (this.util.getCurrentToken())
      // {
      //   this.nav.setRoot(WebHomePage);
      // }
      // else
      // {
      this.util.removeAllFile();
      console.log('4');
      this.nav.setRoot(LoginPage);
      console.log('5');
      // }
    });
  }

  private openPage(page) {
    this.prePage.opens = false;
    this.nav.setRoot(page.component).then(() => {
      const index = this.nav.getActive().index;
      this.nav.remove(0, index);
    });
    page.opens = true;
    this.prePage = page;
  }

  private setRegis(type): void {
    let tmpStartupData = { userType: type, registerId: 0, tempGuestId: 0 };

    if (this.util.isHaveFile(AppConst.saveDir.startup)) {
      tmpStartupData = this.util.loadFileWithCrypst(AppConst.saveDir.startup);
      tmpStartupData.userType = type;
      console.log("tmpStartupData.tempGuestId :" + tmpStartupData.tempGuestId);
    }
    this.util.writeFileWithCrypst(
      JSON.stringify(tmpStartupData),
      AppConst.saveDir.startup
    );
  }

  hightlightColor(page): string {
    // if (page.opens == true)
    // {
    //   return "#4b7bfd"
    // }
    // else
    // {
    return "#414141";
    //}
  }
}
