import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";
import { TripService } from "src/app/services/trip.service";

@Component({
  selector: "app-pick-up",
  templateUrl: "./pick-up.page.html",
  styleUrls: ["./pick-up.page.scss"],
})
export class PickUpPage implements OnInit {
  // trip info
  trip: any;
  passenger: any;

  constructor(public router: Router, public tripService: TripService) {
    this.trip = tripService.getCurrentTrip();
     console.log('Trip', this.trip);
    tripService
      .getPassenger(this.trip.passengerId)
      .pipe(take(1))
      .subscribe((snapshot) => {
        this.passenger = snapshot;
      });
  }

  ngOnInit() {}

  // pickup
  pickup() {
    this.tripService.pickUp(this.trip.id);
    this.router.navigateByUrl("/drop-off");
  }
}
