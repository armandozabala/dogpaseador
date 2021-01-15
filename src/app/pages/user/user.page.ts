import { Storage } from '@ionic/storage';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
  AlertController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import * as firebase from "firebase/app";

import { take } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/storage';

import { AuthService } from "src/app/services/auth.service";
import { SettingService } from "src/app/services/setting.service";
import { Firebase } from '@ionic-native/firebase/ngx';

@Component({
  selector: "app-user",
  templateUrl: "./user.page.html",
  styleUrls: ["./user.page.scss"],
})
export class UserPage implements OnInit {
  user: any;
  types: Array<any> = [];

  constructor(
    public router: Router,
    private firebase: Firebase,
    private storage: AngularFireStorage,
    public authService: AuthService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public settingService: SettingService,
    public alertCtrl: AlertController
  ) {
    this.getData();
  }

  ngOnInit() {}

  async getData() {
    const user: any = await this.authService.getUserData();

    // list of vehicle types
    this.settingService
      .getVehicleType()
      .pipe(take(1))
      .subscribe((snapshot) => {
        if (snapshot === null) {
          this.settingService
            .getDefaultVehicleType()
            .pipe(take(1))
            .subscribe((vehicle) => {
              this.types = Object.keys(vehicle);
            });
        } else {
          this.types = Object.keys(snapshot);
        }
      });

    this.authService
      .getUser(user.uid)
      .pipe(take(1))
      .subscribe((snapshot) => {
        // snapshot.id = user.uid;
        this.user = snapshot;
        this.user.uid = user.uid;
      });
  }

  // save user info
  async save() {
    if (!this.user.name) {
      return this.showAlert("Please enter name!");
    }
    if (!this.user.phoneNumber) {
      return this.showAlert("Please enter phone number!");
    }
    if (!this.user.plate) {
      return this.showAlert("Please enter plate!");
    }
    if (!this.user.brand) {
      return this.showAlert("Please enter brand!");
    }
    if (!this.user.type) {
      return this.showAlert("Please choose type!");
    }

    this.authService.updateUserProfile(this.user);

    this.router.navigateByUrl("/home");
    const toast = await this.toastCtrl.create({
      message: "Your profile has been updated",
      duration: 3000,
      position: "middle",
    });
    await toast.present();
  }

  // choose file for upload
  chooseFile() {
    document.getElementById("avatar").click();
  }

  // upload thumb for item
  async upload() {
    // Create a root reference
    const storageRef =  this.storage.ref('users');
    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await loading.present();

    for (const selectedFile of [
      (document.getElementById("avatar") as HTMLInputElement).files[0],
    ]) {
      const path = "/" + Date.now() + `${selectedFile.name}`;
      const iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          loading.dismiss();
          this.user.photoURL = downloadURL;
        });
      });
    }
  }

  // show alert with message
  async showAlert(message) {
    const alert = await this.alertCtrl.create({
      header: "Error",
      subHeader: message,
      buttons: ["OK"],
    });

    return alert.present();
  }
}
