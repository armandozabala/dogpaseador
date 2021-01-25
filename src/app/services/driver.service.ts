import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class DriverService {
  user: any;

  constructor(public db: AngularFireDatabase, public authService: AuthService) {
    // this.user = this.authService.getUserData();
  }

  setUser(user) {
    this.user = user;
  }

  // get driver by id
  async getDriver() {
    const user: any = await this.authService.getUserData(); //this.user ||

    return new Promise((resolve) => {
      this.db
        .object("drivers/" + user.uid)
        .valueChanges()
        .pipe(take(1))
        .subscribe((snapshot: any) => {
          snapshot.id = user.uid;
          resolve(snapshot);
        });
    });
  }

  // update driver's position
  updatePosition(vehicleId, vehicleType, locality, lat, lng, rating, name) {
    const path = this.getUpdateUrl(vehicleId, vehicleType, locality);
    console.log("tracking", lat, lng);
    this.db
      .object(path)
      .valueChanges()
      .pipe(take(1))
      .subscribe((snapshot: any) => {
        // insert if not exists
        if (snapshot === null) {
          this.db.object(path).set({
            lat,
            lng,
            oldLat: lat,
            oldLng: lng,
            rating,
            name,
          });
        } else {
          // update
          this.db.object(path).update({
            lat,
            lng,
            oldLat: snapshot.lat || 0,
            oldLng: snapshot.lng || 0,
            rating,
            name,
          });
        }
      });
  }

  getUpdateUrl(vehicleId, vehicleType, locality) {
    return "localities/" + locality + "/" + vehicleType + "/" + vehicleId;
  }

  updateTimestamp(vehicleId, vehicleType, locality) {
    const path = this.getUpdateUrl(vehicleId, vehicleType, locality);
    this.db.object(path).update({
      last_active: Date.now(),
    });
  }

  removeActive(vehicleId, vehicleType, locality) {
    const path = this.getUpdateUrl(vehicleId, vehicleType, locality);
    this.db.object(path).update({
      last_active: null,
    });
  }
}
