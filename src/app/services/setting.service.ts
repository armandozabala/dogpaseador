import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { PlaceService } from "./place.service";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class SettingService {
  constructor(
    public db: AngularFireDatabase,
    public storage: Storage,
    public placeService: PlaceService
  ) {}

  getVehicleType() {
    return this.db
      .object<any>(
        "master_settings/prices/" +
          this.placeService.getLocality() +
          "/vehicles"
      )
      .valueChanges();
  }

  getDefaultVehicleType() {
    return this.db
      .object<any>("master_settings/prices/default/vehicles")
      .valueChanges();
  }
}
