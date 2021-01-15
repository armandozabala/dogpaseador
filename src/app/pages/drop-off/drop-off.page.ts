import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AlertController } from "@ionic/angular";
import { DealService } from "src/app/services/deal.service";
import { TripService } from "src/app/services/trip.service";


@Component({
  selector: "app-drop-off",
  templateUrl: "./drop-off.page.html",
  styleUrls: ["./drop-off.page.scss"],
})
export class DropOffPage implements OnInit {
  // trip info
  public trip: any;

  constructor(
    public router: Router,
    public tripService: TripService,
    public alertCtrl: AlertController,
    public dealService: DealService
  ) {
    this.trip = tripService.getCurrentTrip();
  }

  ngOnInit() {}

  // show payment popup
  async showPayment() {
    const prompt = await this.alertCtrl.create({
      header: "Total (cash):",
      message: "<h1>" + this.trip.currency + this.trip.fee + "</h1>",
      buttons: [
        {
          text: "OK",
          handler: () => {
            // update this trip
            this.tripService.dropOff(this.trip.id);
            // clear deal
            this.dealService.removeDeal();
            // comeback to home page
            this.router.navigateByUrl("/home");
          },
        },
      ],
    });

    prompt.present();
  }
}
