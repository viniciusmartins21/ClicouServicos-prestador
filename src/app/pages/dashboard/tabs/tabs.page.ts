import { Component, Inject } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { APP_CONFIG, AppConfig } from 'src/app/app.config';
import { Constants } from 'src/app/models/contants.models';
import { Profile } from 'src/app/models/profile.models';
import { ClientService } from 'src/app/services/client.service';
//import firebase from 'firebase';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  profile: Profile;
  subscriptions: Array<Subscription> = [];

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private navCtrl: NavController,
    private service: ClientService,
    private platform: Platform,
    private alertCtrl: AlertController,
    //diagnostic: Diagnostic, oneSignal: OneSignal,   private geolocation: Geolocation,
  ) {
    if (platform.is("cordova")) {
      /*
      oneSignal.getIds().then((id) => {
        if (id && id.userId) {
          let userMe: User = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
          firebase.database().ref(Constants.REF_USERS_FCM_IDS).child((userMe.id + "hp")).set(id.userId);
          let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
          service.updateUser(window.localStorage.getItem(Constants.KEY_TOKEN), {
            fcm_registration_id_provider: id.userId,
            language: (defaultLang && defaultLang.length) ? defaultLang : this.config.availableLanguages[0].code
          }).subscribe(res => {
            console.log(res);
          }, err => {
            console.log('update_user', err);
          });
        }
      });
      */

      this.service.logActivity(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
        console.log(res);
      }, err => {
        console.log('logActivity', err);
      });

      setTimeout(() => {
        let profile: Profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
        if (!profile || !profile.primary_category) {
          //this.navCtrl.push(MyprofilePage, { create_edit: true });
        }
      }, 500);

      /*
      diagnostic.isLocationEnabled().then((isAvailable) => {
        if (isAvailable) {
          this.setLocation();
        } else {
          this.alertLocationServices();
          this.setLocation();
        }
      }).catch((e) => {
        console.error(e);
        this.alertLocationServices();
        this.setLocation();
      });
      */
    }
  }

  refreshProfile() {
    let subscription: Subscription = this.service.getProfile(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
      this.profile = res;
      window.localStorage.setItem(Constants.KEY_PROFILE, JSON.stringify(res));
    }, err => {
      console.log('profile_get_err', err);
    });
    this.subscriptions.push(subscription);
  }

  /*
  setLocation() {
    this.geolocation.getCurrentPosition().then((position) => {
      let pur = new ProfileUpdateRequest();
      pur.longitude = String(position.coords.longitude);
      pur.latitude = String(position.coords.latitude);
      this.service.updateProfile(window.localStorage.getItem(Constants.KEY_TOKEN), pur).subscribe(res => {
        console.log(res);
      }, err => {
        console.log('logActivity', err);
      });
    }).catch((err) => {
      console.log("getCurrentPosition", err);
    });
  }
*/

}
