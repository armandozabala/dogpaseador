import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { POSITION_INTERVAL, TRIP_STATUS_WAITING, TRIP_STATUS_GOING } from './services/constants';
import { PlaceService } from './services/place.service';
import { TripService } from './services/trip.service';
import { DriverService } from './services/driver.service';
declare var google: any;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  driver: any;
  user: any = {};

  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "home",
    },
    {
      title: "Wallet",
      url: "/wallet",
      icon: "albums",
    },
    {
      title: "Job history",
      url: "/job-history",
      icon: "time",
    },
    {
      title: "Setting",
      url: "/setting",
      icon: "settings",
    },
    {
      title: "User",
      url: "/user",
      icon: "help-circle",
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private placeService: PlaceService,
    private driverService: DriverService,
    private geolocation: Geolocation,
    private afAuth: AngularFireAuth,
    private tripService: TripService,
    private authService: AuthService,
    private backgroundMode: BackgroundMode
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.backgroundMode.enable();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.setDefaultPage();
      this.addAuthCheck();
    });
  }

  ngOnInit() {}

  getPosition() {
    // get current location
    console.log("finding current position");
   

    this.geolocation.getCurrentPosition().then(
      (resp) => {
        const latLng = new google.maps.LatLng(
          resp.coords.latitude,
          resp.coords.longitude
        );
        const geocoder = new google.maps.Geocoder();

        // debug
        // this.deb = resp.coords.latitude + ',' + resp.coords.longitude;
        // console.log('resp', resp);

        // find address from lat lng
        geocoder.geocode({ latLng }, (results, status) => {
          // console.log("status", status);
          if (status === google.maps.GeocoderStatus.OK) {
            // save locality
            const locality = this.placeService.setLocalityFromGeocoder(results);
            console.log("locality", locality);

            

            
            this.sendPositionTracking(
              locality,
              resp.coords.latitude,
              resp.coords.longitude
            );
            this.setPositionListen(locality);
            this.setLastActiveInterval(locality);
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setLastActiveInterval(locality) {

    
    setTimeout(() => {

     
      
        
      this.setLastActiveInterval(locality);
      if (this.authService.activo) {
        if (this.driver) {
          this.driverService.updateTimestamp(
            this.driver.id,
            this.driver.type,
            locality
          );
        }
      } else {
            this.driverService.removeActive(
              this.driver.id,
              this.driver.type,
              locality
            );
      }
   
    }, POSITION_INTERVAL);
  }

  async setPositionListen(locality) {
    setInterval(async () => {

        
      if (this.authService.activo) {
        if (this.driver) {
          const resp = await this.geolocation.getCurrentPosition();
          this.sendPositionTracking(
            locality,
            resp.coords.latitude,
            resp.coords.longitude
          );
        }
      } else {
        this.driverService.removeActive(
          this.driver.id,
          this.driver.type,
          locality
        );
      }
    }, POSITION_INTERVAL);
  }

  sendPositionTracking(locality, lat, lng) {
    // check for driver object, if it did not complete profile, stop updating location
    if (!this.driver || !this.driver.type) {
      return;
    }

    if (this.authService.activo) {
      this.driverService.updatePosition(
        this.driver.id,
        this.driver.type,
        locality,
        lat,
        lng,
        this.driver.rating,
        this.driver.name
      );
    }
  }

  setDefaultPage() {
    // check for login stage, then redirect
    this.afAuth.authState.pipe(take(1)).subscribe(async (authData) => {
      if (authData) {
       
        // check for uncompleted trip
        (await this.tripService.getTrips()).pipe(take(1)).subscribe((trips) => {
          trips.forEach((action:any) => {
            console.log("NADA");
            console.log(action.payload.val())
            const trip: any = { id: action.key, ...action.payload.val() };
            this.tripService.setCurrentTrip(trip);

            if (trip.status === TRIP_STATUS_WAITING) {
              this.router.navigateByUrl("/home");
            } else if (trip.status === TRIP_STATUS_GOING) {
              // console.log(trip.id);
              this.router.navigateByUrl("/drop-off");
            }
          });
        });

        this.user = authData;
      } else {
        this.router.navigateByUrl("/login");
      }
    });
  }

  addAuthCheck() {
    // get user data
    this.afAuth.authState.subscribe(async (authData) => {
      // console.log('authData', authData);
      if (authData) {
        this.user = authData;

        // get user info from service
        this.driverService.setUser(this.user);
        this.driver = await this.driverService.getDriver();
        this.driver.id = authData.uid;
        // start tracking position
        this.getPosition();
      } else {
        this.driver = null;
      }
    });
  }

  // logout
  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl("/login");
    });
  }
}
