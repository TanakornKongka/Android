import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HttpServiceProvider } from "../../providers/http-service-provider";
import { UtilityProvider } from "../../providers/utility-provider";
import { WebHomePage } from '../web-home/web-home';
import * as AppConst from "../../../app/app.constant";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage
{
  private verInfo = AppConst.appVersion;
  private verInfoService = "V."+AppConst.appVersion;
  private exSrp = AppConst.exSrp;
  private loginForm: FormGroup;
  private pageData = { pageCode: AppConst.pageCode.canteen, curService: { service: "" } };
  private options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpServiceProvider,
    private util: UtilityProvider,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private inAppBrowser: InAppBrowser)
  {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.getToken();
  }

  ionViewDidLoad()
  {
    console.log('ionViewDidLoad LoginPage');
  }

  openSignUp()
  {
    this.navCtrl.push(RegisterPage);
  }

  private doLogin(): void
  {
    console.log("login form : ",this.loginForm.value)
    this.util.popup.loadingActive(true);
    this.httpService.httpLogin(this.loginForm.value,
      (response) =>
      {
        if (response.status == "ok")
        {
          this.util.popup.loadingActive(false);
          this.navCtrl.setRoot(WebHomePage);
        }
      },
      (error) =>
      {
        console.log(error);
        this.util.popup.loadingActive(false);
        this.util.popup.alertPopup(null, 'Username หรือ Password ผิดพลาดกรุณาลองอีกครั้ง', 'OK')
      });
  }

  async getToken(){
    let headers = new HttpHeaders();
    let httpOption: any =
    {
      headers: headers,
      observe: 'response',
      responseType: "text",
      withCredentials: true
    };
    await this.http.get(AppConst.srpService.loginToken.service, httpOption).subscribe(
      async (token: any) => {
        await this.util.writeFileWithCrypst(JSON.stringify({ currentToken: this.getTokenElement(token.body, "input") }), AppConst.saveDir.temp);
        this.checkVersion();
      }
    )
  }

  private getTokenElement(htmlText, tagName){
    let el = document.createElement('html');
    el.innerHTML = htmlText;
    let metas = el.getElementsByTagName(tagName);

    for (var i = 0; i < metas.length; i++)
    {
      if (metas[i].getAttribute("name") == "_csrf")
      {
        if (tagName == "input")
        {
          return metas[i].getAttribute("value");
        }
        else if (tagName == "meta")
        {
          return metas[i].getAttribute("content");
        }
      }
    }
    return null;
  }

  async checkVersion(){
    const param = [
      { "name": "platForm", "value": "MOBILE" },
      { "name": "mobileVersion", "value": this.verInfoService }
    ];
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", AppConst.httpHeader.post.contentType);
    headers = headers.append("X-CSRF-TOKEN", this.util.getCurrentToken());
    let url = AppConst.srpService.checkVersion.service;
    this.http.post(url, param, { headers: headers, observe: 'response', withCredentials: true }).subscribe(
      res => {
        if(res.body == "false"){
          let alert = this.alertCtrl.create({
            title: 'Download App?',
            message: 'version ที่ท่านใช้งานอยู่ต่ำกว่า version ปัจจุบัน กรุณา download และ install app version ใหม่',
            buttons: [
              {
                text: 'ยกเลิก',
                handler: () => {}
              },
              {
                text: 'ตกลง',
                handler: () => {
                  this.openLinkAppDownload();
                }
              }
            ]
          });
          alert.present();
        }
      }
    )
  }

  openLinkAppDownload(){
    const url = this.exSrp+'/EDSRP/login';
    // const url = 'http://srpuat.excise.go.th/EDSRP/login';
    const target = "_system";
    this.inAppBrowser.create(url, target, this.options);
  }
  
}