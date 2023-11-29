import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private firstStep = true;
  private secondStep = false;
  private thirdStep = false;
  private year = "2561"
  private iconEye:string;
  private isEye = false;
  private passwordType: string;
  private loginForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm: new FormControl('', Validators.required),
      fullname: new FormControl('', Validators.required),
      identitynum: new FormControl('', Validators.required),
      permissionnum: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      housenum: new FormControl('', Validators.required),
      province: new FormControl('f', Validators.required),
      district: new FormControl('f', Validators.required),
      subdistrict: new FormControl('f', Validators.required),
      road: new FormControl('', Validators.required),
      postcode: new FormControl('', Validators.required)
    });
    this.passwordType = "password"
    this.iconEye = "eye-off"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }


  eyeAppear(): boolean {

    console.log(this.loginForm.value.password);
    
    if (this.loginForm.value.password === '') {
      return false;
    } else {
      return true;
    }
  }

  isHidePass(){
    if (this.passwordType === "password") {
      this.passwordType = "text";
      this.iconEye = "eye"
    } else {
      this.passwordType = "password";
      this.iconEye = "eye-off"
    }
  }

  // eyeShow() {
  //   if (this.loginForm.value.password != '') {
  //     this.isEye = true;
  //   }
  // }

  nextStep(form) {
    console.log(form);
    if (this.firstStep == true) {
      this.firstStep = false;
      this.secondStep = true;
      this.thirdStep = false;

    } else if (this.secondStep == true) {
      this.firstStep = false;
      this.secondStep = false;
      this.thirdStep = true;

    } else if (this.thirdStep == true) {


    }

  }
  backStep(form) {


    //console.log(form);
    if (this.thirdStep == true) {
      this.firstStep = false;
      this.secondStep = true;
      this.thirdStep = false;

    } else if (this.secondStep == true) {
      this.firstStep = true;
      this.secondStep = false;
      this.thirdStep = false;

    } else if (this.firstStep == true) {


    }

  }

}
