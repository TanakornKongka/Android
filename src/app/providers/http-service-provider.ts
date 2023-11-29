import { Injectable, ViewChild } from "@angular/core";
import { NavController, Platform, App } from "ionic-angular";
// import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/catch";
import { UtilityProvider } from "../providers/utility-provider";
import { Dialogs } from "@ionic-native/dialogs";
import { SearchDiscoveredProducePage } from "../pages/search-discovered-produce/search-discovered-produce";
import { LoginPage } from "../pages/login/login";
import * as AppConst from "../../app/app.constant";

@Injectable()
export class HttpServiceProvider {
  private curToken = null;
  private nav: any;
  private isRefresh: boolean = true;
  private requesting: any;
  private checkSession: boolean = true;
  constructor(
    private platform: Platform,
    public http: HttpClient,
    private app: App,
    private util: UtilityProvider
  ) {
    platform.ready().then(() => {
      this.nav = app.getActiveNav();
    });
  }
  private setParams(paramObj): HttpParams {
    let queryString: HttpParams = new HttpParams();
    if (paramObj) {
      for (let key in paramObj) {
        queryString = queryString.set(key, paramObj[key]);
      }
    }
    return queryString;
  }
  private successHttp(pageData, response, callback, isShowErrorPopup) {
    if (this.util.isNotNullOrEmpty(response)) {
      callback(response);
      return;
    }
  }
  private failHttp(
    pageData,
    param: any,
    httpFormType: AppConst.httpFormEnum,
    response,
    successCallback,
    failCallback,
    isShowErrorPopup
  ) {
    failCallback(response);
  }
  private async sendHttp(
    pageData,
    httpFormType: AppConst.httpFormEnum,
    param: any,
    success,
    fail,
    isShowErrorPopup
  ) {
    if (!this.util.isNotNullOrEmpty(this.util.getCurrentToken())) {
      this.goLogin();
      return;
    }
    let url = pageData.curService.service;
    let headers = new HttpHeaders();
    headers = headers.append(
      "Content-Type",
      AppConst.httpHeader.post.contentType
    );
    headers = headers.append("X-CSRF-TOKEN", this.util.getCurrentToken());
    this.requesting = await this.http
      .post(url, param, {
        headers: headers,
        observe: "response",
        withCredentials: true,
      })
      .timeout(AppConst.TimeOutHttp)
      // .map(res => res.json())
      .subscribe(
        (response: any) => {
          this.successHttp(pageData, response.body, success, isShowErrorPopup);
        },
        async (error) => {
          console.log(error);
          if (error.status == 403) {
            if (this.checkSession) {
              await this.util.popup.alertSessionPopup();
              this.checkSession = false;
            }
            // this.util.popup.alertPopupDismiss("", "หมดช่วงเวลาการใช้งาน กรุณาเข้าระบบอีกครั้ง", "ตกลง", () =>
            // {
            //   this.util.reopenApp();
            // });
          } else {
            this.failHttp(
              pageData,
              param,
              httpFormType,
              error.body,
              success,
              fail,
              isShowErrorPopup
            );
          }
        },
        () => {}
      );
  }
  public httpGet(
    pageData,
    param: any,
    successCallback,
    failCallback,
    isShowErrorPopup = true,
    isAddRegId = true
  ) {
    param = this.util.isNotNullOrEmpty(param) ? param : {};
    this.sendHttp(
      pageData,
      AppConst.httpFormEnum.get,
      param,
      (response) => {
        successCallback(response);
      },
      (error) => {
        failCallback(error);
      },
      isShowErrorPopup
    );
  }
  public httpLogin(param: any, successCallback, failCallback) {
    let headers = new HttpHeaders();
    let httpOption: any = {
      headers: headers,
      observe: "response",
      responseType: "text",
      withCredentials: true,
    };
    this.http
      .get(AppConst.srpService.loginToken.service, httpOption)
      .timeout(AppConst.TimeOutHttp)
      // .map(res => res.json())
      .subscribe(
        (rLogin: any) => {
          this.util.writeFileWithCrypst(
            JSON.stringify({
              currentToken: this.getTokenElement(rLogin.body, "input"),
            }),
            AppConst.saveDir.temp
          );
          headers = new HttpHeaders();
          // headers = headers.append("X-CSRF-TOKEN", this.util.getCurrentToken());
          headers = headers.append(
            "Content-Type",
            AppConst.httpHeader.post.contentTypeLogin
          );
          httpOption.headers = headers;
          param._csrf = this.util.getCurrentToken();
          this.http
            .post(
              AppConst.srpService.loginAuth.service,
              this.setParams(param),
              httpOption
            )
            .timeout(AppConst.TimeOutHttp)
            // .map(res => res.json())
            .subscribe(
              (rAuth: any) => {
                headers = new HttpHeaders();
                httpOption.headers = headers;
                if (rAuth.url == AppConst.edsrp + "/EDSRP/index.html") {
                  this.http
                    .get(rAuth.url, httpOption)
                    .timeout(AppConst.TimeOutHttp)
                    // .map(res => res.json())
                    .subscribe(
                      (rToken: any) => {
                        this.util.writeFileWithCrypst(
                          JSON.stringify({
                            currentToken: this.getTokenElement(
                              rToken.body,
                              "meta"
                            ),
                          }),
                          AppConst.saveDir.temp
                        );
                        successCallback({ status: "ok" });
                      },
                      (error) => {
                        failCallback(error);
                      },
                      () => {}
                    );
                } else {
                  failCallback({ status: "no" });
                }
              },
              (error) => {
                failCallback({ status: "no", data: error });
              },
              () => {}
            );
        },
        (error) => {
          failCallback({ status: "no", data: error });
        },
        () => {}
      );
  }
  private getTokenElement(htmlText, tagName) {
    let el = document.createElement("html");
    el.innerHTML = htmlText;
    let metas = el.getElementsByTagName(tagName);

    for (var i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute("name") == "_csrf") {
        if (tagName == "input") {
          return metas[i].getAttribute("value");
        } else if (tagName == "meta") {
          return metas[i].getAttribute("content");
        }
      }
    }
    return null;
  }
  public httpPost(
    pageData,
    param: any,
    successCallback,
    failCallback,
    isShowErrorPopup = true,
    isAddRegId = true
  ) {
    param = this.util.isNotNullOrEmpty(param) ? param : {};
    this.sendHttp(
      pageData,
      AppConst.httpFormEnum.post,
      param,
      (response) => {
        successCallback(response);
      },
      (error) => {
        failCallback(error);
      },
      isShowErrorPopup
    );
  }
  private sendLog(sendPath, httpMethods, dataResult, responseData) {}

  public getMessageBadge(callback: Function) {}
  public goLogin() {
    console.log("Go login");
    this.util.removeAllFile();
    this.util.reopenApp();
    // this.util.clearNativeBadge();
  }

  public logout(success, fail, isForceLogout: boolean = false) {
    this.util.popup.multiButtonPopup(
      "",
      "ยืนยันการออกจากระบบ",
      ["ยกเลิก", "ตกลง"],
      [
        () => {},
        () => {
          if (isForceLogout) {
            this.util.popup.loadingActive(true);
            this.util.removeAllFile();
            success();
          } else {
            this.util.popup.loadingActive(true);
            let headers = new HttpHeaders();
            let httpOption: any = {
              headers: headers,
              observe: "response",
              responseType: "text",
              withCredentials: true,
            };
            this.http
              .get(AppConst.srpService.logout.service, httpOption)
              .timeout(AppConst.TimeOutHttp)
              // .map(res => res.json())
              .subscribe(
                (response: any) => {
                  this.util.popup.loadingActive(false);
                  this.util.removeAllFile();
                  success({ status: "ok" });
                },
                (error) => {
                  this.util.popup.loadingActive(false);
                  fail({ status: "no", data: error });
                },
                () => {}
              );
          }
        },
      ]
    );
  }

  public unsubscribe() {
    this.requesting.unsubscribe();
  }
}
