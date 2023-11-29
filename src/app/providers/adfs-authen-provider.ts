import { Injectable } from "@angular/core";
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { UtilityProvider } from "../providers/utility-provider";
import { HttpServiceProvider } from "../providers/http-service-provider";

import * as AppConst from "../../app/app.constant";

@Injectable()
export class AdfsAuthenProvider
{
  private readonly responseObjects = {
    "success": { "status": "s", "message": "Authen Success" },
    "warn": { "status": "w", "message": "Authen Warning" },
    "fail": { "status": "f", "message": "Authen Fail" }
  };

  private devCodeADFS = "";
  private pageData: any = { pageCode: AppConst.pageCode.login, curService: {} };
  private readonly userTypeEnum = AppConst.userTypeEnum;
  private browser = null;
  constructor(
    private util: UtilityProvider,
    private httpService: HttpServiceProvider,
    private themeableBrowser: ThemeableBrowser
  )
  {
    console.log('Hello AdfsAuthenProvider');
  }
  public onClickOpenADFS(successCallback = null, failCallback = null): void
  {
  //   this.browser = this.themeableBrowser.create(AppConst.adfsAuthenLink, "_blank", AppConst.browserThemeoptions);
  //   this.browser.on("loadstart").subscribe(
  //     (event) => { console.log(event); },
  //     (err) =>
  //     {
  //       this.browser.close();
  //       failCallback(this.responseObjects.fail);
  //       this.browserError(err);
  //     });
  //   this.browser.on("loadstop").subscribe(
  //     (event) =>
  //     {
  //       if (event.url.indexOf(AppConst.redirect_uri_adfs) >= 0)
  //       {
  //         if (event.url.indexOf("?code=") >= 0)
  //         {
  //           let tmpCode = event.url.split("?code=")[1];
  //           this.browser.close();
  //           this.doLogin(tmpCode, successCallback, failCallback);
  //         }
  //         else if (event.url.indexOf("?error=access_denied") >= 0)
  //         {
  //           this.browser.close();
  //           failCallback(this.responseObjects.warn);
  //         }
  //       }
  //     },
  //     (err) =>
  //     {
  //       this.browser.close();
  //       failCallback(this.responseObjects.fail);
  //       this.browserError(err);
  //     });
  //   this.browser.on("loaderror").subscribe(
  //     (event) =>
  //     {
  //       this.browser.close();
  //       failCallback(this.responseObjects.warn);
  //       this.util.popup.alertPopup("popup.title.alert", "popup.dialog.checkInternet", "popup.button.cancel", null);
  //     },
  //     (err) =>
  //     {
  //       this.browser.close();
  //       failCallback(this.responseObjects.fail);
  //       this.browserError(err);
  //     });
  //   this.browser.on("exit").subscribe((event) =>
  //   {
  //     failCallback(this.responseObjects.warn);
  //     console.log(event);
  //   },
  //     (err) =>
  //     {
  //       this.browser.close();
  //       failCallback(this.responseObjects.fail);
  //       this.browserError(err);
  //     });
  }
  public doLogin(adfsCode: string = null, successCallback = null, failCallback = null): void
  {
    // let tmpParam: any = null;
    // this.util.popup.loadingActive(true);
    // this.pageData.curService = AppConst.scgService.loginUser;
    // tmpParam = {
    //   grant_type: AppConst.grantType.adfs,
    //   client_id: AppConst.clientToken.id,
    //   client_secret: AppConst.clientToken.secret,
    //   code: adfsCode,
    //   redirect_uri: AppConst.redirect_uri_adfs
    // };
    // this.httpService.httpLogin(tmpParam,
    //   response =>
    //   {
    //     if (this.util.isNotNullOrEmpty(response))
    //     {
    //       this.util.writeFileWithCrypst(JSON.stringify({ "currentToken": response.access_token, "refreshToken": response.refresh_token }), AppConst.saveDir.temp);

    //       let type = this.userTypeEnum.employee;
    //       let tmpStartupData = { userType: type, registerId: AppConst.defaultRegisterId, tempGuestId: 0 };
    //       if (this.util.isHaveFile(AppConst.saveDir.startup))
    //       {
    //         tmpStartupData = this.util.loadFileWithCrypst(AppConst.saveDir.startup);
    //         if (tmpStartupData.userType != type)
    //         {
    //           tmpStartupData.registerId = AppConst.defaultRegisterId;
    //         }
    //         tmpStartupData.userType = type;
    //       }

    //       this.pageData.curService = AppConst.scgService.settingRegisterDevice;
    //       this.httpService.httpPost(this.pageData,
    //         {
    //           registerId: tmpStartupData.registerId,
    //           deviceUuid: this.util.getUUID(),
    //           registerCode: this.util.getRegisterCode(),
    //           deviceType: this.util.getDeviceType(),
    //           receiveMsg: "Y",
    //           appVersion: this.util.getAppVersion()
    //         },
    //         response2 =>
    //         {
    //           if (this.util.isNotNullOrEmpty(response2))
    //           {
    //             if (this.util.isNotNullOrEmpty(response2.registerId))
    //             {
    //               tmpStartupData.registerId = response2.registerId;
    //               this.util.storeDeviceRegisterId(tmpStartupData); // save Register ID
    //             }
    //             //<<<case check call register
    //             if (this.util.isHaveFile(AppConst.saveDir.notidata))
    //             {
    //               let tmpNotiData = this.util.loadFileWithCrypst(AppConst.saveDir.notidata);
    //               if (tmpNotiData.success != true)
    //               {
    //                 if (this.util.isNotNullOrEmpty(this.util.getRegisterCode()))
    //                 {
    //                   tmpNotiData.success = true;
    //                   this.util.writeFileWithCrypst(JSON.stringify(tmpNotiData), AppConst.saveDir.notidata);
    //                 }
    //               }
    //               console.log("Data After response2 :" + JSON.stringify(this.util.loadFileWithCrypst(AppConst.saveDir.notidata)))
    //             }//case check call register>>>>
    //             this.util.writeFileWithCrypst(JSON.stringify(tmpStartupData), AppConst.saveDir.startup);
    //             console.log("UUID: " + this.util.getUUID());
    //             console.log(this.util.getCurrentToken());
    //             this.pageData.curService = AppConst.scgService.getUserProfile;
    //             this.httpService.httpGet(this.pageData, {},
    //               response3 =>
    //               {
    //                 let regId = "0";
    //                 console.log(response3)
    //                 if (response3.device)
    //                 {
    //                   regId = response3.device.registerId.toString();
    //                 }
    //                 if (this.util.isNotNullOrEmpty(response3))
    //                 {
    //                   this.util.writeFileWithCrypst(JSON.stringify(response3.profile), AppConst.saveDir.profile);
    //                   let tmpData = this.util.loadFileWithCrypst(AppConst.saveDir.temp);
    //                   tmpData.registerId = regId;
    //                   this.util.writeFileWithCrypst(JSON.stringify(tmpData), AppConst.saveDir.temp);
    //                   if (this.browser != null)
    //                   {
    //                     window.location.reload();
    //                   }
    //                   if (this.util.isNotNullOrEmpty(successCallback))
    //                   {
    //                     successCallback(this.responseObjects.success);
    //                   }
    //                   else
    //                   {
    //                     failCallback(this.responseObjects.warn);
    //                     console.warn("ADFS Success Callback IS NULL")
    //                   }
    //                   this.util.popup.loadingActive(false);
    //                 }
    //               },
    //               error =>
    //               {
    //                 console.log(error);
    //                 failCallback(this.responseObjects.fail);
    //                 this.util.popup.loadingActive(false);
    //               });
    //           }
    //         },
    //         error =>
    //         {
    //           failCallback(this.responseObjects.fail);
    //           console.log(error);
    //         });
    //     }
    //     else
    //     {
    //       failCallback(this.responseObjects.warn);
    //       this.util.popup.alertPopup("popup.title.alert", this.util.isNotNullOrEmpty(response.errorMessege) ? response.errorMessege : "popup.dialog.notResponseError", "popup.button.cancel", null);
    //     }
    //   },
    //   error =>
    //   {
    //     this.util.popup.loadingActive(false);
    //     failCallback(this.responseObjects.fail);
    //     if (this.util.isNotNullOrEmpty(error))
    //     {
    //       if (this.util.isNotNullOrEmpty(error.error_description) && error.response.code)
    //       {
    //         this.util.popup.alertPopupWithCode(
    //           "popup.title.alert",
    //           error.error_description,
    //           error.response.code,
    //           "popup.button.cancel", null
    //         );
    //       }
    //       else if (error.status == 401)
    //       {
    //         this.util.popup.alertPopup("popup.title.alert", "popup.dialog.validAuthen", "popup.button.cancel", null);
    //       }
    //       else
    //       {
    //         this.util.popup.alertPopup("popup.title.alert", "popup.dialog.checkInternet", "popup.button.cancel", null);
    //       }
    //     }
    //     else
    //     {
    //       this.util.popup.alertPopup("popup.title.alert", "popup.dialog.checkInternet", "popup.button.cancel", null);
    //     }
    //   }
    // );
  }
  private browserError(err): void
  {
    console.log(err);
    this.util.popup.alertPopup("popup.title.alert", "popup.dialog.notResponseError", "popup.button.cancel", null);
  }
}