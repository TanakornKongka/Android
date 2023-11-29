import { HttpServiceProvider } from './../../providers/http-service-provider';
import { UtilityProvider } from './../../providers/utility-provider';
import { Component } from '@angular/core';
import { Platform,NavController } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage
{

  private newsList: any = [];
  private menutab = "tabSubmit"; 
  //tabSubmit

  constructor(
    private navCtrl: NavController,
    private util: UtilityProvider,
    private httpService: HttpServiceProvider,
    private platform:Platform)
  {
    this.platform.resume.subscribe(()=>{
      this.AddNewList();
    });
    
    this.AddNewList();

  }



  private AddNewList() {
    this.httpService.http.get("assets/jsonData/DummyHomeData.json")
      .subscribe((data: any) => {
        console.log(data);
        data.news.forEach(aNews => {
          this.newsList.push(aNews);
        });
      });
  }

   setSegmentColor(value): string {
    let result = "transparent";
    if (this.menutab == value)
    {
      result = "#E93C83";
    }
    return result;
  }
  
}