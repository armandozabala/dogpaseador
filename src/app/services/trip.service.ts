import { Injectable } from "@angular/core";
import {
  TRIP_STATUS_FINISHED,
  TRIP_STATUS_GOING,
  TRIP_STATUS_WAITING,
} from "./constants";
import { AuthService } from "./auth.service";
import { AngularFireDatabase } from "@angular/fire/database";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TripService {
  currentTrip: any;

  constructor(
    public db: AngularFireDatabase,
    public authService: AuthService
  ) {}

  // create trip from deal object
  createFromDeal(deal) {
    deal.status = TRIP_STATUS_WAITING;
    return this.db.list("trips").push(deal);
  }

  // pickup passenger
  pickUp(tripId) {
    // console.log('Pick up trip: ', tripId);
    this.db.object("trips/" + tripId).update({
      pickedUpAt: Date.now(),
      status: TRIP_STATUS_GOING,
    });
  }

  // drop off
  dropOff(tripId) {
    this.db.object("trips/" + tripId).update({
      droppedOffAt: Date.now(),
      status: TRIP_STATUS_FINISHED,
    });
  }

  setCurrentTrip(trip) {
    this.currentTrip = trip;
  }

  setCurrentTripById(id) {
    return new Promise((resolve) => {
      this.db
        .object("trips/" + id)
        .valueChanges()
        .pipe(take(1))
        .subscribe((snapshot) => {
          this.currentTrip = snapshot;
          this.currentTrip.id = id;
          // console.log('Current trip', this.currentTrip);
          resolve(snapshot);
        });
    });
  }

  getCurrentTrip() {
    // console.log(this.currentTrip);
    return this.currentTrip;
  }

  getPassenger(passengerId) {
    return this.db.object("passengers/" + passengerId).valueChanges();
  }

  // get driver's trip
  async getTrips() {
    const user: any = await this.authService.getUserData();

    return this.db
      .list("trips", (ref) => ref.orderByChild("driverId").equalTo(user.uid))
      .snapshotChanges();
  }
}
