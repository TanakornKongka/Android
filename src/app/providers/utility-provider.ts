declare var require: any;
import { Injectable, EventEmitter } from "@angular/core";
import { Platform, App } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { PopupProvider } from "../providers/popup-provider";
import { Device } from "@ionic-native/device";
import { NativeStorage } from "@ionic-native/native-storage";
import { Badge } from "@ionic-native/badge";
import { ToastController } from "ionic-angular";
import { LoginPage } from "../pages/login/login";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Geolocation } from "@ionic-native/geolocation";

import * as AppConst from "../../app/app.constant";
import { calcBindingFlags } from "../../../node_modules/@angular/core/src/view/util";

@Injectable()
export class UtilityProvider {
  private CryptoJS = require("../../../node_modules/crypto-js");
  private uuid: string = "no_uuid";
  private devicePlatform: string = "OTH";
  public themeColor: any;
  public onHandlerPushMessage: EventEmitter<any> = new EventEmitter();
  constructor(
    private platform: Platform,
    public popup: PopupProvider,
    public trans: TranslateService,
    private badge: Badge,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private nativeStorage: NativeStorage,
    private app: App,
    private toastCtrl: ToastController
  ) {
    platform.ready().then(() => {
      try {
        this.uuid = new Device().uuid != null ? new Device().uuid : "no_uuid";
      } catch (e) {
        this.uuid = "no_uuid";
      }
      try {
        this.devicePlatform =
          new Device().platform != null ? new Device().platform : "OTH";
      } catch (e) {
        this.devicePlatform = "OTH";
      }
    });
  }

  public toastPresent(
    messageText: string = null,
    closeButtonText: string = null,
    timeout: number = 3000,
    isTrans: boolean = true
  ): void {
    let message = messageText;
    let btnText = closeButtonText;
    if (messageText == null) {
      console.log("no message toast");
      return;
    }
    if (isTrans) {
      if (messageText) {
        message = this.getTrans(messageText);
      }
      if (btnText) {
        btnText = this.getTrans(closeButtonText);
      }
    }
    let toast = this.toastCtrl.create({
      message: message,
      duration: timeout,
      position: "bottom",
      showCloseButton: closeButtonText != null,
      closeButtonText: btnText,
    });
    toast.present(toast);
  }
  public storeDeviceRegisterId(pushDevice: any): void {
    this.writeFileWithCrypst(
      JSON.stringify(pushDevice),
      AppConst.saveDir.startup
    );
  }
  public storeDeviceToken(pushId: string, pushCode: string): void {
    let user = {
      reg_code: pushCode,
      reg_id: pushId,
      message_data: [],
      success: false,
    };
    console.log(
      "Post token for registered device with data " + JSON.stringify(user)
    );
    this.writeFileWithCrypst(JSON.stringify(user), AppConst.saveDir.notidata);
  }
  public removeDeviceToken(): void {
    this.removeFile(AppConst.saveDir.notidata);
  }
  public getRegisterId(): string {
    let tmpRegId = null;
    if (this.isHaveFile(AppConst.saveDir.startup)) {
      tmpRegId = this.loadFileWithCrypst(AppConst.saveDir.startup).registerId;
      if (tmpRegId == 0) {
        tmpRegId = AppConst.defaultRegisterId;
      }
    }
    return tmpRegId;
  }
  public getRegisterCode(): string {
    if (this.isHaveFile(AppConst.saveDir.notidata)) {
      return this.loadFileWithCrypst(AppConst.saveDir.notidata).reg_code;
    } else {
      return null;
    }
  }

  public getCurrentToken(): string {
    if (this.isHaveFile(AppConst.saveDir.temp)) {
      return this.loadFileWithCrypst(AppConst.saveDir.temp).currentToken;
    }
    return null;
  }
  public getSession(): string {
    if (this.isHaveFile(AppConst.saveDir.temp)) {
      return this.loadFileWithCrypst(AppConst.saveDir.temp).cookie;
    }
    return null;
  }
  public emitMessage(message: any): void {
    this.onHandlerPushMessage.emit(message);
  }
  public getCurrentLanguage(): string {
    return this.trans.currentLang;
  }
  public selectLanguage(value: string): void {
    if (value === "en") {
      this.trans.setDefaultLang("en");
    } else if (value === "th") {
      this.trans.setDefaultLang("th");
    }
  }
  public isJsonString(value: any): boolean {
    return /^[\],:{}\s]*$/.test(
      value
        .replace(/\\["\\\/bfnrtu]/g, "@")
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          "]"
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
    );
  }
  public getTrans(keyTranslate: string): string {
    return this.trans.instant(keyTranslate);
  }
  public isNotNullOrEmpty(value: any): boolean {
    //check is not null or empty string
    if (
      value !== undefined &&
      value !== null &&
      value !== "null" &&
      value !== "{}" &&
      value !== ""
    ) {
      return true;
    }
    return false;
  }
  public getDeviceType(): string {
    //get device platform
    let resultType = this.devicePlatform;
    if (
      this.devicePlatform.toLowerCase() === "android" ||
      this.devicePlatform.toLowerCase() === "amazon-fireos"
    ) {
      resultType = "AND";
    } else if (this.devicePlatform.toLowerCase() === "ios") {
      resultType = "IOS";
    } else {
      resultType = "OTH";
    }
    return resultType;
  }
  public convertDate(date) {
    let dateArray = date.split("-");
    let newDate = dateArray[0] + "." + dateArray[1] + "." + dateArray[2];
    return newDate;
  }
  public getUUID(): string {
    //get UUID
    return this.uuid;
  }
  public getAppVersion(): string {
    //get Ver
    let ver: string = "0.0.0";
    return AppConst.appVersion;
  }
  public downloadInternal(
    url: string //download file with browser
  ) {
    // window.open(AppConst.OAGServices.common.openDownload + encodeURIComponent(url), '_system');
  }
  public md5(
    value: string //md5
  ) {
    let m5 = this.CryptoJS.MD5(value);
    return m5.toString();
  }
  public txtToBase64(txtImg: string): string {
    //src base 64 prefix
    return txtImg ? "data:image/png;base64," + txtImg : "";
  }
  public convertNullToDat(value: string): string {
    return this.isNotNullOrEmpty(value) ? value : "-";
  }
  private e(v, secretCode): string {
    let encrypted = this.CryptoJS.AES.encrypt(
      JSON.stringify(v),
      this.CryptoJS.MD5(this.getUUID() + secretCode).toString()
    );
    return encrypted.toString();
    // return v.toString();
  }
  public writeFileWithCrypst(value: string, fileName: string): void {
    //save file
    if (!AppConst.isMobileDevice) {
      if (AppConst.isDev) {
        window.localStorage.setItem(fileName, value);
      } else {
        window.localStorage.setItem(fileName, this.e(value, fileName));
      }
    } else {
      if (AppConst.isDev) {
        this.nativeStorage.setItem(fileName, value).then(
          (obj) => {
            console.log("Stored item!");
            console.log(obj);
          },
          (error) => {
            console.error("Error storing item", error);
          }
        );
      } else {
        this.nativeStorage.setItem(fileName, this.e(value, fileName)).then(
          (obj) => {
            console.log("Stored item!");
            console.log(obj);
          },
          (error) => {
            console.error("Error storing item", error);
          }
        );
      }
    }
  }
  private d(encrypstValue: string, fileName: string): string {
    if (!this.isNotNullOrEmpty(encrypstValue)) {
      window.localStorage.clear();
      return null;
    } else {
      let decrypted = this.CryptoJS.AES.decrypt(
        encrypstValue,
        this.CryptoJS.MD5(this.getUUID() + fileName).toString()
      );
      return decrypted.toString(this.CryptoJS.enc.Utf8);
    }
  }
  public loadFileWithCrypst(fileName: string): any {
    //load file
    if (!AppConst.isMobileDevice) {
      let value = window.localStorage.getItem(fileName);
      let decrypt = null;
      if (AppConst.isDev) {
        decrypt = value;
      } else {
        decrypt = this.d(value, fileName);
      }
      if (decrypt === null) {
        return null;
      } else {
        try {
          return JSON.parse(JSON.parse(decrypt));
        } catch (e) {
          let de = null;
          try {
            de = JSON.parse(decrypt);
          } catch (error) {}
          return de;
        }
      }
    } else {
      this.nativeStorage.getItem(fileName).then(
        (data) => {
          let decrypt = null;
          if (AppConst.isDev) {
            decrypt = data;
          } else {
            decrypt = this.d(data, fileName);
          }
          try {
            return JSON.parse(JSON.parse(decrypt));
          } catch (e) {
            return JSON.parse(decrypt);
          }
        },
        (error) => {
          console.error(error);
          return null;
        }
      );
    }
  }
  public isHaveFile(fileName: string): boolean {
    let result = false;
    if (!AppConst.isMobileDevice) {
      result = this.isNotNullOrEmpty(window.localStorage.getItem(fileName))
        ? true
        : false;
    } else {
      this.nativeStorage.getItem(fileName).then(
        (data) => {
          result = this.isNotNullOrEmpty(data) ? true : false;
        },
        (error) => {
          result = false;
        }
      );
    }
    return result;
  }
  public removeFile(fileName: string): void {
    if (!AppConst.isMobileDevice) {
      window.localStorage.removeItem(fileName);
    } else {
      this.nativeStorage.remove(fileName);
    }
    console.log("==> remove file : " + fileName);
  }
  public removeAllFile(): void {
    // ignore startup
    this.removeFile(AppConst.saveDir.temp);
    this.removeFile(AppConst.saveDir.setting);
    this.removeFile(AppConst.saveDir.profile);
    this.removeFile(AppConst.saveDir.tempCanteen);
    console.warn("==> remove ALL file");
  }
  public getUserType(): AppConst.userTypeEnum {
    let tmpStartupData = null;
    if (this.isHaveFile(AppConst.saveDir.startup)) {
      tmpStartupData = this.loadFileWithCrypst(AppConst.saveDir.startup);
      return tmpStartupData.userType;
    }
    return null;
  }
  public isAdvanceUser(): boolean {
    if (this.getUserType() == AppConst.userTypeEnum.employee) {
      if (this.isHaveFile(AppConst.saveDir.profile)) {
        let tmp = this.loadFileWithCrypst(AppConst.saveDir.profile);
        return tmp.employeeType == "P";
      }
    }
    return false;
  }
  public ynToBool(yn: string): boolean {
    yn = yn.toLowerCase();
    return yn == "y" ? true : yn == "n" ? false : null;
  }
  public boolToYN(bool: boolean): string {
    return bool ? "Y" : "N";
  }
  public validateEmail(email: string): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }
  public getImageIsUnreadNoti(): string {
    return "assets/img/icon/ic_noti2.svg";
  }
  public setNativeBadge(num: number): void {
    if (AppConst.isShowNativeBadge) {
      this.badge.set(num);
    }
  }
  public increaseNativeBadge(increaseBy: number): void {
    if (AppConst.isShowNativeBadge) {
      this.badge.decrease(increaseBy);
    }
  }
  public decreaseNativeBadge(decreaseBy: number): void {
    if (AppConst.isShowNativeBadge) {
      this.badge.decrease(decreaseBy);
    }
  }
  public clearNativeBadge(): void {
    if (AppConst.isShowNativeBadge) {
      this.badge.clear();
    }
  }

  convertJsonToObject(item): Array<any> {
    let items = [];
    const userStr = JSON.stringify(item);
    JSON.parse(userStr, (key, value) => {
      if (typeof value === "string") {
        let item = { key: "", value: "" };
        item.key = key;
        item.value = value;
        if (value != "") {
          items.push(item);
        }
      }
    });

    return items;
  }

  convertJsonToObjectForZone(item): Array<any> {
    let items = [];
    const userStr = JSON.stringify(item);
    JSON.parse(userStr, (key, value) => {
      if (typeof value === "string") {
        let item = { key: "", value: "" };
        item.key = this.cutIndex(key);
        item.value = value;
        if (value != "") {
          items.push(item);
        }
      }
    });

    return items;
  }

  convertJsonToObjectl(item, title): Array<any> {
    let items = [];
    const userStr = JSON.stringify(item);
    JSON.parse(userStr, (key, value) => {
      if (typeof value === "string") {
        let item = { key: "", value: "" };
        if (title != "") {
          items[0] = { key: "", value: title };
        }

        item.key = key;
        item.value = value;
        items.push(item);
      } else {
        if (title != "") {
          items[0] = { key: "", value: title };
        }
      }
    });
    return items;
  }

  cutIndex(text): string {
    let textSent;
    if (text != "") {
      textSent = text.split("|")[1];
    } else {
      textSent = text;
    }
    return textSent;
  }

  cutIndexComma(text): string {
    let textSent;
    if (text != "") {
      textSent = text.split(",")[1];
    } else {
      textSent = text;
    }
    return textSent;
  }

  public reopenApp() {
    window.location.reload();
  }

  public updateThemeColor(i): any {
    let themeColor: any;
    switch (i) {
      case 1:
        themeColor = AppConst.themeColor.blu;
        break;
      case 2:
        themeColor = AppConst.themeColor.ora;
        break;
      case 3:
        themeColor = AppConst.themeColor.gre;
        break;
      case 4:
        themeColor = AppConst.themeColor.vio;
        break;
      case 5:
        themeColor = AppConst.themeColor.pin;
        break;
    }
    return themeColor;
  }

  public getCurrentLocation(successCallback, failCallback) {
    this.diagnostic.isLocationAuthorized().then(
      (authorized) => {
        console.log(
          "Location is " + (authorized ? "authorized" : "unauthorized")
        );
        if (authorized) {
          this.doGetCurrent(successCallback);
        } else {
          if (this.getDeviceType() == "IOS") {
            // this.popCheckGPS();
            this.doGetCurrent(successCallback);
          } else {
            this.diagnostic
              .requestLocationAuthorization()
              .then(this.doGetCurrent, this.popCheckGPS);
          }
        }
      },
      (error) => {
        console.error("The following error occurred: " + error);
      }
    );
  }

  private doGetCurrent(successCallback) {
    console.log("en");
    this.diagnostic.isLocationEnabled().then(
      (enabled) => {
        console.log("location enable : " + enabled);
        if (enabled) {
          this.popup.loadingActive(true);
          this.geolocation
            .getCurrentPosition({ timeout: 5000, enableHighAccuracy: true })
            .then(
              (position) => {
                this.popup.loadingActive(false);
                successCallback(position);
              },
              (err) => {
                this.popup.loadingActive(false);
                this.popup.alertPopup(
                  "",
                  "กรุณาตรวจสอบสัญญาณ GPS",
                  "ตกลง",
                  () => {}
                );
              }
            );
        } else {
          this.popCheckGPS();
        }
      },
      (error) => {
        console.log("The following error occurred: " + error);
        this.popCheckGPS();
      }
    );
  }

  private popCheckGPS() {
    this.popup.multiButtonPopup(
      "",
      "กรุณาตรวจสอบสัญญาณ GPS",
      ["ตกลง", "ยกเลิก"],
      [
        () => {
          this.goSetting();
        },
        () => {},
      ]
    );
  }

  private goSetting() {
    if (this.getDeviceType() == "AND") {
      this.diagnostic.switchToLocationSettings();
    }
  }
}
