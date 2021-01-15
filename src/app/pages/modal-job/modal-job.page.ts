import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DEAL_TIMEOUT } from "src/app/services/constants";
import { PlaceService } from "src/app/services/place.service";

@Component({
  selector: "app-modal-job",
  templateUrl: "./modal-job.page.html",
  styleUrls: ["./modal-job.page.scss"],
})
export class ModalJobPage implements OnInit {
  // job info
  public job: any;

  // remaining time for countdown
  public remainingTime = DEAL_TIMEOUT;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public placeService: PlaceService,
    public geolocation: Geolocation
  ) {
    this.job = navParams.get("deal");

    // get current location
    geolocation.getCurrentPosition().then(
      (resp) => {
        // resp.coords.longitude
        this.job.origin.distance = this.placeService
          .calcCrow(
            resp.coords.latitude,
            resp.coords.longitude,
            this.job.origin.location.lat,
            this.job.origin.location.lng
          )
          .toFixed(0);
        this.job.destination.distance = this.placeService
          .calcCrow(
            resp.coords.latitude,
            resp.coords.longitude,
            this.job.destination.location.lat,
            this.job.destination.location.lng
          )
          .toFixed(0);
      },
      (err) => {
        console.log(err);
      }
    );

    // start count down
    this.countDown();
  }

  ngOnInit() {}

  // close modal
  close() {
    this.modalCtrl.dismiss();
  }

  // count down
  countDown() {
    const interval = setInterval(() => {
      this.remainingTime--;

      // if time is over
      if (this.remainingTime === 0) {
        // stop interval
        clearInterval(interval);
        this.modalCtrl.dismiss();
      }
    }, 1000);
  }

  // accept job
  accept() {
    // close and accept a job
    this.modalCtrl.dismiss({ accepted: true });
  }
}
