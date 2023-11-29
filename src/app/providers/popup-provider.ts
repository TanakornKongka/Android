import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { LoadingController, AlertController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer } from "@angular/platform-browser";
// import { Dialogs } from '@ionic-native/dialogs';
import * as AppConst from "../../app/app.constant";
import { LoginPage } from "../pages/login/login";

@Injectable()
export class PopupProvider {
  private loading: any;
  private alert: any;
  private loadText: string;
  constructor(
    private sanitized: DomSanitizer,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    // private dialogs: Dialogs,
    public trans: TranslateService
  ) {}

  public loadingActive(isShow: boolean) {
    if (isShow) {
      this.loading = this.loadingCtrl.create({
        // content: this.trans.instant("global.loading"),
        dismissOnPageChange: true,
      });
      this.loading.present().catch(() => {});
    } else {
      if (this.loading) {
        this.loading.dismiss().catch(() => {});
      }
    }
  }

  public loadingActiveThen(isShow: boolean, callback) {
    if (isShow) {
      this.loading = this.loadingCtrl.create({
        // content: this.trans.instant("global.loading"),
        dismissOnPageChange: true,
      });
      this.loading.present().then(() => {
        if (callback != null) {
          callback();
        }
      });
    } else {
      if (this.loading) {
        this.loading.dismiss().catch(() => {});
      }
    }
  }

  private getTrans(transKey): any {
    return this.trans.instant(transKey);
  }
  private htmlProperty(value): any {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
  private getTranslate(
    titleKey,
    messageKey,
    buttonKeyList,
    isTranslate: boolean
  ) {
    let titleText = titleKey;
    let messageText = messageKey;
    let buttonTextList = [];
    if (isTranslate) {
      titleText = titleKey !== null ? this.getTrans(titleKey) : "";
      messageText = messageKey !== null ? this.getTrans(messageKey) : "";
      if (buttonKeyList !== null) {
        for (let b of buttonKeyList) {
          buttonTextList.push(this.getTrans(b));
        }
      }
    } else {
      for (let b of buttonKeyList) {
        buttonTextList.push(b);
      }
    }
    buttonTextList =
      buttonTextList.length <= 0 ? buttonKeyList[0] : buttonTextList;
    return { title: titleText, message: messageText, buttons: buttonTextList };
  }
  public alertPopup(
    titleText: string = "",
    messageText: string = "",
    buttonText: string = "ตกลง",
    buttonCallback: Function = null,
    isTranslate: boolean = true
  ) {
    let transData = this.getTranslate(
      titleText,
      messageText,
      [buttonText],
      isTranslate
    );
    this.alert = this.alertCtrl.create({
      title: this.htmlProperty(transData.title),
      message: this.htmlProperty(transData.message),
      cssClass: "model-custom-popup model-custom-popup-alert",
      enableBackdropDismiss: true,
      mode: "ios",
      buttons: [
        {
          text: transData.buttons[0],
          handler: () => {
            if (buttonCallback !== null) {
              buttonCallback();
            }
          },
        },
      ],
    });
    this.alert.present();
  }
  public alertPopupDismiss(
    titleText: string = "",
    messageText: string = "",
    buttonText: string = "ตกลง",
    buttonCallback: Function = null,
    isTranslate: boolean = true
  ) {
    let transData = this.getTranslate(
      titleText,
      messageText,
      [buttonText],
      isTranslate
    );
    this.alert = this.alertCtrl.create({
      title: this.htmlProperty(transData.title),
      message: this.htmlProperty(transData.message),
      cssClass: "model-custom-popup model-custom-popup-alert",
      enableBackdropDismiss: false,
      mode: "ios",
      buttons: [
        {
          text: transData.buttons[0],
          handler: () => {
            if (buttonCallback !== null) {
              buttonCallback();
            }
          },
        },
      ],
    });
    this.alert.present();
  }
  public alertPopupCustomContent(
    titleText: string = "",
    messageText: string = "",
    buttonText: string = "ตกลง",
    buttonCallback: Function = null,
    isTranslate: boolean = true
  ) {
    let transData = this.getTranslate(
      titleText,
      messageText,
      [buttonText],
      isTranslate
    );
    this.alert = this.alertCtrl.create({
      title: this.htmlProperty(transData.title),
      message: this.htmlProperty(transData.message),
      cssClass: "model-custom-popup model-custom-popup-alert-content",
      enableBackdropDismiss: true,
      mode: "ios",
      buttons: [
        {
          text: transData.buttons[0],
          handler: () => {
            if (buttonCallback !== null) {
              buttonCallback();
            }
          },
        },
      ],
    });
    this.alert.present();
  }
  public multiButtonPopup(
    titleText: string = "",
    messageText: string = "",
    buttonTextList: string[],
    buttonCallbackList: Function[] = null,
    isTranslate: boolean = false
  ) {
    let transData = this.getTranslate(
      titleText,
      messageText,
      buttonTextList,
      isTranslate
    );
    let buttons = [];
    // let cssClassData = "model-custom-popup";
    let cssClassData = "model-custom-popup model-custom-popup-alert";
    console.log(transData);
    // buttons.push({ text: this.getTrans("popup.button.cancel"), role: 'cancel', handler: () => { console.log('close'); } });
    for (let i = 0; i < transData.buttons.length; i++) {
      buttons.push({
        text: transData.buttons[i],
        handler: () => {
          buttonCallbackList[i]();
        },
      });
    }
    // cssClassData += buttons.length === 2 ? " model-custom-popup-confirmbutton" : " model-custom-popup-multibutton";
    this.alert = this.alertCtrl.create({
      title: this.htmlProperty(transData.title),
      message: this.htmlProperty(transData.message),
      cssClass: cssClassData,
      enableBackdropDismiss: false,
      mode: "ios",
      buttons: buttons,
    });
    this.alert.present();
  }
  public textInputPopup(
    titleText: string = "",
    messageText: string = "",
    buttonTextList: string[],
    inputPlaceholder: string = "",
    inputValue: string = "",
    buttonCallbackList: Function[] = null,
    isTranslate: boolean = true
  ) {
    let transData = this.getTranslate(
      titleText,
      messageText,
      buttonTextList,
      isTranslate
    );
    let buttons = [];
    let cssClassData = "model-custom-popup";
    buttons.push({
      text: this.getTrans("popup.button.cancel"),
      role: "cancel",
      handler: () => {
        console.log("close");
      },
    });
    for (let i = 0; i < transData.buttons.length; i++) {
      buttons.push({
        text: transData.buttons[i],
        handler: (data) => {
          buttonCallbackList[i](data);
        },
      });
    }
    inputPlaceholder =
      inputPlaceholder !== null ? this.getTrans(inputPlaceholder) : "";
    cssClassData +=
      buttons.length === 2
        ? " model-custom-popup-confirmbutton"
        : " model-custom-popup-multibutton";
    this.alert = this.alertCtrl.create({
      title: this.htmlProperty(transData.title),
      message: this.htmlProperty(transData.message),
      cssClass: cssClassData,
      enableBackdropDismiss: false,
      inputs: [
        { name: "textInput", placeholder: inputPlaceholder, value: inputValue },
      ],
      mode: "md",
      buttons: buttons,
    });
    this.alert.present();
  }
  public alertPopupWithCode(
    titleText: string = "",
    messageText: string = "",
    code: string = "",
    buttonText: string = "",
    buttonCallback: Function,
    isTranslate: boolean = true
  ) {
    let transData = this.getTranslate(
      titleText,
      messageText,
      [buttonText],
      isTranslate
    );
    this.alert = this.alertCtrl.create({
      title: this.htmlProperty(transData.title),
      message: this.htmlProperty(
        transData.message + '<p class="code-text">' + code + "</p>"
      ),
      cssClass: "model-custom-popup model-custom-popup-alert",
      enableBackdropDismiss: true,
      mode: "ios",
      buttons: [
        {
          text: transData.buttons[0],
          handler: () => {
            if (buttonCallback !== null) {
              buttonCallback();
            }
          },
        },
      ],
    });
    this.alert.present();
  }
  public alertSessionPopup() {
    this.alertPopupDismiss(
      "",
      "หมดช่วงเวลาการใช้งาน กรุณาเข้าระบบอีกครั้ง",
      "ตกลง",
      () => {
        localStorage.clear();
        window.location.reload();
      },
      false
    );
  }
}
