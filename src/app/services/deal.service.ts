import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { TripService } from "./trip.service";
import { DEAL_STATUS_ACCEPTED } from "./constants";
import { ancestorWhere } from "tslint";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class DealService {
  constructor(
    public db: AngularFireDatabase,
    public tripService: TripService,
    public authService: AuthService
  ) {}

  async getDeal() {
    const user: any = await this.authService.getUserData();

    return this.db.object("deals/" + user.uid).valueChanges();
  }

  async removeDeal() {
    const user: any = await this.authService.getUserData();

    return this.db.object("deals/" + user.uid).remove();
  }

  // accept a deal
  async acceptDeal(driverId, deal) {
    deal.driverId = driverId;

    // create trip from deal
    const trip = await this.tripService.createFromDeal(deal);
    await this.tripService.setCurrentTripById(trip.key);
    // set tripId to deal
    await this.db.object("deals/" + driverId).update({
      status: DEAL_STATUS_ACCEPTED,
      tripId: trip.key,
    });
  }
}
