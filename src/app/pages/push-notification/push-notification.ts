import { Component, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { UtilityProvider } from "../../providers/utility-provider";
import { PushNotificationProvider } from '../../providers/push-notification-provider';

import * as AppConst from "../../../app/app.constant";

@Component({
  selector: 'page-push-notification',
  templateUrl: 'push-notification.html'
})
export class PushNotificationPage
{
  private onHandlerPushMessage: EventEmitter<any>;
  private isSandbox: boolean;
  private regCode: String = "";
  private notiData = null;
  private messageList = [];
  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private navParams: NavParams,
    private util: UtilityProvider,
    private push: PushNotificationProvider,
    private cdRef: ChangeDetectorRef
  )
  {
    this.regCode = "";
    // push.onHandlerPushMessage.subscribe(item => { this.reloadNoti() });
  }
  private ionViewDidLoad()
  {
    console.log('ionViewDidLoad PushNotificationPage');
    if (this.util.isNotNullOrEmpty(this.util.loadFileWithCrypst(AppConst.saveDir.notidata)))
    {
      this.notiData = this.util.loadFileWithCrypst(AppConst.saveDir.notidata);
      this.isSandbox = this.notiData.is_sandbox;
      this.regCode = this.notiData.reg_code;
      // this.push.initPushNotification(this.isSandbox, response => { this.getRegisterCode(response) });
    }
    else
    {
      console.log("no register push");
      this.isSandbox = true;
    }
    this.reloadNoti();
  }
  private ionViewDidLeave()
  {
    console.log("leave page");
  }
  private reloadNoti(): void
  {
    console.log("Reload Noti");
    if (this.util.isNotNullOrEmpty(this.util.loadFileWithCrypst(AppConst.saveDir.notidata)))
    {
      this.messageList = this.util.loadFileWithCrypst(AppConst.saveDir.notidata).message_data;
    }
    this.cdRef.detectChanges();
  }
  private onClickRegisterPushNoti()
  {
    console.log("Register Push")
    // this.push.initPushNotification(this.isSandbox, response => { this.getRegisterCode(response) });
  }
  private getRegisterCode(data)
  {
    console.log(data.registrationId);
    this.regCode = data.registrationId;
    this.cdRef.detectChanges();
  }
  private onClickUnRegisterPushNoti()
  {
    this.push.unregisterPushNotification(
      (data) =>
      {
        console.log("UN REGISTER PUSH");
        this.util.removeFile(AppConst.saveDir.notidata);
        this.regCode = "";
        this.cdRef.detectChanges();
      });
  }
  private onClickDeleteMessage()
  {
    if (this.util.isNotNullOrEmpty(this.util.loadFileWithCrypst(AppConst.saveDir.notidata)))
    {
      let tmpNotidata = this.util.loadFileWithCrypst(AppConst.saveDir.notidata);
      this.messageList = [];
      tmpNotidata.message_data = this.messageList;
      this.util.writeFileWithCrypst(tmpNotidata, AppConst.saveDir.notidata);
    }
    this.cdRef.detectChanges();
  }
  private genJsonString(value)
  {
    return JSON.stringify(value);
  }
}