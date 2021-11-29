import { Injectable } from '@angular/core';
import { Platform, AlertController, LoadingController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Constants } from 'src/app/models/contants.models';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authState = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private navCtrl: NavController,
    private serviceNotification: NotificationService
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  async ifLoggedIn() {
    if (window.localStorage.getItem(Constants.KEY_USER)) {
      this.authState.next(true);
      this.navCtrl.navigateRoot(['./tabs']);
    } else {
      this.navCtrl.navigateRoot(['./sign-in']);
    }
  }

  login(userId: string) {
    if (this.platform.is('cordova')) {
      this.serviceNotification.start(userId);
    }
    this.authState.next(true);
    this.navCtrl.navigateRoot(['./tabs']);
  }

  async logout() {
    this.authState.next(false);
    window.localStorage.removeItem(Constants.KEY_USER);
    window.localStorage.removeItem(Constants.KEY_TOKEN);
    window.localStorage.removeItem(Constants.KEY_PROFILE);
    window.localStorage.removeItem(Constants.KEY_NOTIFICATIONS);
    window.localStorage.removeItem(Constants.KEY_CARD_INFO);
    if(this.platform.is('cordova')) {this.serviceNotification.end();}
    this.navCtrl.navigateRoot(['./sign-in']);
  }

  isAuthenticated() {
    return this.authState.value;
  }

}
