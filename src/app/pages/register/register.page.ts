import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  email: any;
  password: any;
  name: any;

  constructor(
    public router: Router,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}


  ngOnInit() {}

  async signup() {
    if (!this.email || !this.password || !this.name) {
      const alert = await this.alertCtrl.create({
        message: "Please provide email, name and password",
        buttons: ["OK"],
      });
      return alert.present();
    }

    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
     loading.present();

    try {
      this.authService.register(this.email, this.password, this.name).then( async (res:any) => {

      

          if (res.ban) {
                 loading.dismiss();
                 this.router.navigateByUrl("/home");
          } else {
                 loading.dismiss();
                 const alert = await this.alertCtrl.create({
                     message: res.message,
                     buttons: ["OK"],
                });
                await alert.present();
          }

      });
    
    } catch (error) {
      // in case of login error
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error,
        buttons: ["OK"],
      });
      await alert.present();
    }
  }
}
