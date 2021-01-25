import { Injectable } from "@angular/core";
import { DEFAULT_AVATAR } from "./constants";
import { AngularFireDatabase } from "@angular/fire/database";
import { Storage } from "@ionic/storage";
import { take } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";
import { resolve } from "dns";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: any;
  activo = false;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public storage: Storage
  ) {}

  // get current user data from firebase
  getUserData() {
    return new Promise((resolve) => {
      this.afAuth.authState.pipe(take(1)).subscribe((authData) => {
        resolve(authData);
      });
    });
  }

  // get passenger by id
  getUser(id) {
    return this.db.object("drivers/" + id).valueChanges();
  }

  // login by email and password
  login(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // login with facebook
  /*async loginWithFacebook() {
    const fbData: FacebookLoginResponse = await this.facebook.login([
      "email",
      "public_profile",
    ]);
    const credential = firebase.auth.FacebookAuthProvider.credential(
      fbData.authResponse.accessToken
    );
    const result = await this.afAuth.auth.signInWithCredential(credential);
    return this.createUserIfNotExist(result);
  }

  // login with google
  async loginWithGoogle() {
    const res = await this.googlePlus.login({});
    const credential = firebase.auth.GoogleAuthProvider.credential(
      null,
      res.accessToken
    );
    const result = await this.afAuth.auth.signInWithCredential(credential);
    return this.createUserIfNotExist(result);
  }*/

  logout() {
    return this.afAuth.signOut();
  }

  // register new account
  register(email, password, name) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((authData: any) => {

        // update passenger object
        this.updateUserProfile({
          uid: authData.user.uid,
          name,
          email,
        });

        this.setupInitData(authData.user.uid);

        let ban;

        return ban = {
             ban: true
        };
      })
      .catch((err) => {
        let error;

        return error = {
          code: err.code,
          message: err.message,
          ban: false
        }
      });

      

  }

  // update user display name and photo
  async updateUserProfile(user) {
    const name = user.name || user.email;
    const photoUrl = user.photoURL || DEFAULT_AVATAR;
    const userData: any = await this.getUserData();

   /* userData.updateProfile({
      displayName: name,
      photoURL: photoUrl,
    });*/

    // create or update passenger
    await this.db.object("drivers/" + user.uid).update({
      name,
      userId: user.uid,
      photoURL: photoUrl,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      plate: user.plate || "",
      brand: user.brand || "",
      type: user.type || "",
    });
  }

  // create new user if not exist
  createUserIfNotExist(user) {
    // check if user does not exist
    this.getUser(user.uid)
      .pipe(take(1))
      .subscribe((snapshot) => {
        if (snapshot === null) {
          // update passenger object
          this.updateUserProfile(user);
          this.setupInitData(user.uid);
        }
      });
  }

  // setup init data for user
  setupInitData(driverId) {
    this.db.object("drivers/" + driverId).update({
      balance: 10,
      rating: 4,
      refCode: driverId.substring(1, 4),
    });
  }
}
