import { Injectable } from "@angular/core";
import { Platform, NavController, App } from "ionic-angular";
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { UtilityProvider } from "../providers/utility-provider";
import { PopupProvider } from "../providers/popup-provider";
// import { MessagePage } from '../pages/message/message';
import { HttpServiceProvider } from "../providers/http-service-provider";

import * as AppConst from "../../app/app.constant";

@Injectable()
export class PushNotificationProvider {
  private pushObject: PushObject;
  private nav: any;
  private pageData = { pageCode: AppConst.pageCode.login, curService: {} };
  private readonly userTypeEnum = AppConst.userTypeEnum;
  constructor(
    private platform: Platform,
    private push: Push,
    private util: UtilityProvider,
    private popup: PopupProvider,
    private app: App,
    private httpService: HttpServiceProvider
  ) {
    platform.ready().then(() => {
      this.nav = app.getActiveNav();
    });
  }
  public initPushNotification(successCallback) {
    console.log("initPushNotification");
    if (!this.platform.is("cordova")) {
      console.warn(
        "Push notifications not initialized. Cordova is not available - Run in physical device"
      );
      return;
    }
    let options: PushOptions = {
      android: {
        senderID: AppConst.pushSenderId,
        sound: "true",
        // clearBadge: "true",
        vibrate: "true",
      },
      ios: {
        // senderID: AppConst.pushSenderId,
        fcmSandbox: AppConst.isSandbox,
        alert: "true",
        badge: "true",
        sound: "true",
        // clearBadge: "true"
      },
    };
    this.pushObject = this.push.init(options);
    this.pushObject.on("registration").subscribe((data: any) => {
      console.log("device token ->", data.registrationId);
      let notificationRegID = data.registrationId;
      let tmpNotiData: any = {
        reg_code: "",
        reg_id: "",
        message_data: [],
        success: false,
      };
      if (
        this.util.isNotNullOrEmpty(
          this.util.loadFileWithCrypst(AppConst.saveDir.notidata)
        )
      ) {
        tmpNotiData = this.util.loadFileWithCrypst(AppConst.saveDir.notidata);
      }
      tmpNotiData.reg_code = notificationRegID;
      this.util.writeFileWithCrypst(
        JSON.stringify(tmpNotiData),
        AppConst.saveDir.notidata
      );
      this.reSendRegisterDevice(); //add by tenrubito
      successCallback(data);
    });
    this.pushObject.on("notification").subscribe((data: any) => {
      let tmpNotiData = {
        reg_code: "",
        reg_id: "",
        message_data: [],
        success: false,
      };

      if (
        this.util.isNotNullOrEmpty(
          this.util.loadFileWithCrypst(AppConst.saveDir.notidata)
        )
      ) {
        tmpNotiData = this.util.loadFileWithCrypst(AppConst.saveDir.notidata);
      }
      tmpNotiData.message_data.push(data);
      this.util.writeFileWithCrypst(
        JSON.stringify(tmpNotiData),
        AppConst.saveDir.notidata
      );
      console.log(this.nav.getActive().name);
      if (this.util.isNotNullOrEmpty(data.count)) {
        this.util.setNativeBadge(data.count);
      }
      if (this.nav.getActive().name != "MessagePage") {
        // this.popup.multiButtonPopup(data.title, data.message, ["popup.button.go-message"], [() => { this.nav.push(MessagePage); }]);
      } else {
        this.popup.alertPopup(
          "message.new-msg",
          null,
          "popup.button.ok",
          () => {
            this.util.emitMessage(data);
          }
        );
      }
      // this.util.toastPresent("message.new-msg", "popup.button.ok", 1500);
      if (data.additionalData.foreground) {
        console.log("Received a notification", data);
      } else {
        console.log("Push notification clicked");
      }
    });
    this.pushObject
      .on("error")
      .subscribe((error) => console.error("Error with Push plugin", error));
  }
  public unregisterPushNotification(callback) {
    this.pushObject.unregister().then((response) => {
      callback(response);
    });
    this.pushObject
      .on("error")
      .subscribe((error) =>
        console.error("Error with Push plugin UN_REGISTER", error)
      );
  }
  private reSendRegisterDevice() {
    if (this.util.isHaveFile(AppConst.saveDir.notidata)) {
      let tmpNotiData = this.util.loadFileWithCrypst(AppConst.saveDir.notidata);
      if (tmpNotiData.success != true) {
        if (this.util.isNotNullOrEmpty(this.util.getCurrentToken())) {
          this.getRegisterDeviceAfterGetToken();
        }
      }
    }
  }
  private getRegisterDeviceAfterGetToken() {
    console.log("send token to server");
    let type = this.userTypeEnum.employee;
    let tmpStartupData = this.util.loadFileWithCrypst(AppConst.saveDir.startup);
    if (this.util.isHaveFile(AppConst.saveDir.startup)) {
      tmpStartupData = this.util.loadFileWithCrypst(AppConst.saveDir.startup);
      if (tmpStartupData.userType != type) {
        tmpStartupData.registerId = 0;
      }
      tmpStartupData.userType = type;
    }
    // this.pageData.curService = AppConst.scgService.settingRegisterDevice;
    this.httpService.httpPost(
      this.pageData,
      {
        registerId: tmpStartupData.registerId,
        deviceUuid: this.util.getUUID(),
        registerCode: this.util.getRegisterCode(),
        deviceType: this.util.getDeviceType(),
        receiveMsg: "Y",
        appVersion: this.util.getAppVersion(),
      },
      (response) => {
        console.log("TEST RESTPONSE" + JSON.stringify(response));
        if (this.util.isNotNullOrEmpty(response)) {
          if (this.util.isNotNullOrEmpty(response.registerId)) {
            tmpStartupData.registerId = response.registerId;
            this.util.storeDeviceRegisterId(tmpStartupData); // save Register ID
          } else {
          }
          let tmpNotiData = this.util.loadFileWithCrypst(
            AppConst.saveDir.notidata
          );
          if (tmpNotiData.success != true) {
            if (this.util.isNotNullOrEmpty(this.util.getRegisterCode())) {
              tmpNotiData.success = true;
              this.util.writeFileWithCrypst(
                JSON.stringify(tmpNotiData),
                AppConst.saveDir.notidata
              );
            }
          }
          this.util.writeFileWithCrypst(
            JSON.stringify(tmpStartupData),
            AppConst.saveDir.startup
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
