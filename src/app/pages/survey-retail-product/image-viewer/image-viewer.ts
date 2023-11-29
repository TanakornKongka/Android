import { HttpServiceProvider } from './../../../providers/http-service-provider';
import { UtilityProvider } from './../../../providers/utility-provider';
import { NavController, NavParams } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';


declare var google;

@Component({
  selector: 'dialog-image-viewer',
  templateUrl: 'image-viewer.html'
})
export class ImageViewerDialog
{
  public imageData: any;
  
  constructor(public platform: Platform, 
    params: NavParams,
    public viewCtrl: ViewController,
    private _DomSanitizationService: DomSanitizer)
  {
    let base64 = params.get('imageData');
    let rawImageBase64 = base64.replace("data:image/png;base64,","");

    this.imageData = 'data:image/jpeg;base64,' + rawImageBase64;
  }

  
}