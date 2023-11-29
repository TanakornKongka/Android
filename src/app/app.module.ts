import { BrowserModule, DomSanitizer } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  NavController,
} from "ionic-angular";
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";

import { MyApp } from "./app.component";
import { HomePage } from "../app/pages/home/home";
import { WebHomePage } from "../app/pages/web-home/web-home";
import { LoginPage } from "../app/pages/login/login";
import { RegisterPage } from "../app/pages/register/register";
import { SearchProducePage } from "../app/pages/search-produce/search-produce";
import { SearchByHighestPricePage } from "../app/pages/search-by-highest-price/search-by-highest-price";
import { SearchDiscoveredProducePage } from "../app/pages/search-discovered-produce/search-discovered-produce";
import { SearchServiceProducePage } from "../app/pages/search-service-produce/search-service-produce";
import { SurveyRetailProductPage } from "../app/pages/survey-retail-product/survey-retail-product";
import { SurveyRetailProductPage2 } from "../app/pages/survey-retail-product/survey-retial-product-step-2/survey-retail-product-step-2";
import { SurveyRetailProductPage3 } from "./app/../pages/survey-retail-product/survey-retial-product-step-3/survey-retial-product-step-3";

import { PushNotificationPage } from "../app/pages/push-notification/push-notification";
import { ResultSearchProducePage } from "../app/pages/search-produce/result-search-produce/result-search-produce";
import { PopoverLoadExcelPage } from "../app/pages/search-produce/popover-load-excel/popover-load-excel";
import { ResultSearchDiscoveredPage } from "../app/pages/search-discovered-produce/result-search-discovered/result-search-discovered";
import { ImageViewerDialog } from "./app/../pages/survey-retail-product/image-viewer/image-viewer";
import { PopoverSearchDiscoverPage } from "../app/pages/search-discovered-produce/popover-search-discover/popover-search-discover";
import { SecondMenuPage } from "../app/pages/second-menu/second-menu";
//provider
import { UtilityProvider } from "../app/providers/utility-provider";
import { HttpServiceProvider } from "../app/providers/http-service-provider";
import { PushNotificationProvider } from "../app/providers/push-notification-provider";
import { PopupProvider } from "../app/providers/popup-provider";
//plugin
//plugin

import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { Badge } from "@ionic-native/badge";
import { NativeStorage } from "@ionic-native/native-storage";
import { Camera, CameraOptions } from "@ionic-native/camera";

import { Dialogs } from "@ionic-native/dialogs";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import {
  ThemeableBrowser,
  ThemeableBrowserOptions,
  ThemeableBrowserObject,
} from "@ionic-native/themeable-browser";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { InAppBrowser } from "@ionic-native/in-app-browser";
//external lib
import { SelectSearchableModule } from "ionic-select-searchable";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { IonicImageViewerModule, ImageViewer } from "ionic-img-viewer";
import { AngularSvgIconModule } from "angular-svg-icon";
import { GoogleMaps } from "@ionic-native/google-maps";
import { Geolocation } from "@ionic-native/geolocation";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from "@ionic-native/barcode-scanner";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Deeplinks } from "@ionic-native/deeplinks";
import { Ionic2RatingModule } from "ionic2-rating";
//constant
import * as AppConst from "../app/app.constant";
import { MapDialog } from "../app/pages/dialog-map/dialog-map";
import { SearchResultPageModule } from "./pages/search-result/search-result.module";
import { CurrencyPipe } from "@angular/common";
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WebHomePage,
    LoginPage,
    RegisterPage,
    SearchProducePage,
    SearchByHighestPricePage,
    SearchDiscoveredProducePage,
    SearchServiceProducePage,
    SurveyRetailProductPage,
    SurveyRetailProductPage2,
    SurveyRetailProductPage3,
    PushNotificationPage,
    PopoverLoadExcelPage,
    ResultSearchProducePage,
    ResultSearchDiscoveredPage,
    PopoverSearchDiscoverPage,
    SecondMenuPage,
    MapDialog,
    ImageViewerDialog,
  ],
  imports: [
    SelectSearchableModule,
    BrowserModule,
    AngularSvgIconModule,
    HttpClientModule,
    IonicImageViewerModule,
    Ionic2RatingModule,
    SearchResultPageModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      backButtonIcon: "md-arrow-back",
      swipeBackEnabled: false,
      mode: "ios",
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(http, "./assets/i18n/", ".json"),
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WebHomePage,
    LoginPage,
    RegisterPage,
    SearchProducePage,
    SearchDiscoveredProducePage,
    SearchServiceProducePage,
    SearchByHighestPricePage,
    SurveyRetailProductPage,
    SurveyRetailProductPage2,
    SurveyRetailProductPage3,
    ResultSearchProducePage,
    PushNotificationPage,
    PopoverLoadExcelPage,
    ResultSearchDiscoveredPage,
    PopoverSearchDiscoverPage,
    SecondMenuPage,
    MapDialog,
    ImageViewerDialog,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UtilityProvider,
    HttpServiceProvider,
    PopupProvider,
    Deeplinks,
    // AdfsAuthenProvider,
    PushNotificationProvider,
    Push,
    Badge,
    NativeStorage,
    Camera,

    ThemeableBrowser,
    ScreenOrientation,
    InAppBrowser,
    GoogleMaps,
    Geolocation,
    LocationAccuracy,
    BarcodeScanner,
    Diagnostic,
    CurrencyPipe,

    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
})
export class AppModule {
  constructor(
    private util: UtilityProvider,
    private push: PushNotificationProvider
  ) {
    // if (util.isNotNullOrEmpty(util.loadFileWithCrypst(AppConst.saveDir.notidata)))
    // {
    // push.initPushNotification(AppConst.is_gcm_sandbox,
    //   response =>
    //   {
    //     console.log("Success get regCode");
    //   });
    // }
  }
}
