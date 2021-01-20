import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController } from "@ionic/angular";
import { AuthService } from 'src/app/services/auth.service';
import { DEAL_STATUS_PENDING, DEAL_TIMEOUT, DEAL_STATUS_ACCEPTED } from 'src/app/services/constants';
import { DealService } from 'src/app/services/deal.service';
import { DriverService } from 'src/app/services/driver.service';
import { ModalJobPage } from '../modal-job/modal-job.page';
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  activo = "Activo";
  ban = true;
  user:any;


  constructor(
    public router: Router,
    public driverService: DriverService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dealService: DealService,
    public authService: AuthService,
    public menuCtrl: MenuController
  ) {
    this.authService.activo = true;
    this.menuCtrl.enable(true);
    this.getDriver();
  }


  update(res) {
    console.log(res.detail.checked);
    if (res.detail.checked) {
      this.authService.activo = true;
      this.activo = "Activo";
    } else {
      this.authService.activo = false;
      this.activo = "Offline";
    }
  }

  driver: any;
  deal: any;
  dealSubscription: any;

  ngOnInit() {}

  ionViewWillLeave() {
    if (this.dealSubscription) {
      // unsubscribe when leave this page
      this.dealSubscription.unsubscribe();
    }
  }

  // make array with range is n
  range(n) {
    return new Array(Math.round(n));
  }

  async getDriver() {
    // get user info from service
    // console.log(snapshot);
    this.driver = await this.driverService.getDriver();

    // if user did not complete registration, redirect to user setting
    if (this.driver.plate && this.driver.type) {
      this.watchDeals();
    } else {
      //this.router.navigateByUrl("/user");
    }
  }

  // confirm a job
  async confirmJob() {
    const confirm = await this.alertCtrl.create({
      header: "Are you sure?",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("Disagree clicked");
            this.dealService.removeDeal();
          },
        },
        {
          text: "Yes",
          handler: async () => {
            await this.dealService.acceptDeal(this.driver.id, this.deal);
            // go to pickup page
            this.router.navigateByUrl("/pick-up");
          },
        },
      ],
    });
    confirm.present();
  }

  // listen to deals
  async watchDeals() {
    // listen to deals
    this.dealSubscription = (await this.dealService.getDeal()).subscribe(
      async (snapshot: any) => {
        
        this.deal = snapshot;
       
        if (snapshot) {
          if (snapshot.status === DEAL_STATUS_PENDING) {
            // if deal expired
            if (snapshot.createdAt < Date.now() - DEAL_TIMEOUT * 1000) {
              return this.dealService.removeDeal();
            }

            // show modal
            const modal = await this.modalCtrl.create({
              component: ModalJobPage,
              componentProps: {
                deal: snapshot,
              },
            });

            await modal.present();

            // listen for modal close
            const { data } = await modal.onWillDismiss();

            if (data && data.accepted) {
              // show confirm box
              this.confirmJob();
            } else {
              this.dealService.removeDeal();
              // do nothing
            }
          } else if (snapshot.status === DEAL_STATUS_ACCEPTED) {
            this.dealService.removeDeal();
          }
        }
      }
    );
  }
}
