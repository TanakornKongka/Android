import { HttpServiceProvider } from './../../providers/http-service-provider';
import { UtilityProvider } from './../../providers/utility-provider';
import { NavController, ViewController, NavParams  } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Component, ViewChild, ElementRef } from '@angular/core';


declare var google;

@Component({
  selector: 'dialog-map',
  templateUrl: 'dialog-map.html'
})
export class MapDialog
{
  private user: any;
  markers: any = [];
  private locationData: any;
  
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(
    public geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    public params: NavParams,
    private util: UtilityProvider,
    public viewCtrl: ViewController)
  {
    this.locationData = params.get('locationData');
  }

  submit() {
    let data = { 
      'lat': this.markers[0].getPosition().lat() + "",
      'lng': this.markers[0].getPosition().lng() + ""
     };
    this.viewCtrl.dismiss(data);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.loadMap();

    //init location
    if(this.locationData != null){
      let latLng = new google.maps.LatLng(this.locationData.lat, this.locationData.lng);
      this.addMarker(latLng);
      this.setMapCenterByMarker();
    }else{
      this.getCurrentLocation();
    }

  }

  setMapCenterByMarker(){
    this.map.setCenter(this.markers[0].getPosition());
  }

  loadMap() {

    let latLng = new google.maps.LatLng(13.7640548, 100.5381642);
 
     let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        clickableIcons: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
     
      google.maps.event.addListener(this.map, 'click', (event) => {
        this.addMarker(event.latLng);
      })

  }


  getCurrentLocation(){
    let GPSoptions = {timeout: 5000, enableHighAccuracy: true};
    this.util.getCurrentLocation(
      (position)=>{
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.addMarker(latLng);
        this.setMapCenterByMarker();
      },
      (err)=>{
        console.log("Cannot get current location. with Error below...")
        console.log(err);
        console.log("==================================================");
      }
    );
  }

  addMarker(event){

    let marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: event
    });

    this.clearMarker();
    marker.setMap(this.map);
    this.markers.push(marker);

  }

  clearMarker(){
    this.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.markers = [];
  }

  

}