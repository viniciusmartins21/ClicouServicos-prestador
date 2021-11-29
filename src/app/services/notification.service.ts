/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Inject, Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { APP_CONFIG, AppConfig } from '../app.config';
import { Constants } from '../models/contants.models';
import { MyNotification } from '../models/notifications.models';
import { ClientService } from './client.service';
import firebase from 'firebase';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  token = "";

  constructor(
    private oneSignal: OneSignal,
    @Inject(APP_CONFIG) private config: AppConfig,
    private clientService: ClientService,
    private platform: Platform,
  ) { }

  start(userId: string) {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
      }
      if (this.platform.is('ios')) {
        this.oneSignal.startInit(this.config.oneSignalAppId);
      }

      this.oneSignal.removeExternalUserId();
      this.oneSignal.setExternalUserId(userId);

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

      this.oneSignal.handleNotificationReceived().subscribe((data) => {
        let notifications: Array<MyNotification> = JSON.parse(window.localStorage.getItem(Constants.KEY_NOTIFICATIONS));
        if (!notifications) {notifications = new Array<MyNotification>();}
        notifications.push(new MyNotification((data.payload.additionalData && data.payload.additionalData.title) ? data.payload.additionalData.title : data.payload.title,
          (data.payload.additionalData && data.payload.additionalData.body) ? data.payload.additionalData.body : data.payload.body,
          String(new Date().getTime())));
        window.localStorage.setItem(Constants.KEY_NOTIFICATIONS, JSON.stringify(notifications));
        let noti_ids_processed: Array<string> = JSON.parse(window.localStorage.getItem('noti_ids_processed'));
        if (!noti_ids_processed) {noti_ids_processed = new Array<string>();}
        noti_ids_processed.push(data.payload.notificationID);
        window.localStorage.setItem('noti_ids_processed', JSON.stringify(noti_ids_processed));
      });

      this.oneSignal.handleNotificationOpened().subscribe((data) => {
        let noti_ids_processed: Array<string> = JSON.parse(window.localStorage.getItem('noti_ids_processed'));
        if (!noti_ids_processed) {noti_ids_processed = new Array<string>();}
        const index = noti_ids_processed.indexOf(data.notification.payload.notificationID);
        if (index === -1) {
          let notifications: Array<MyNotification> = JSON.parse(window.localStorage.getItem(Constants.KEY_NOTIFICATIONS));
          if (!notifications) {notifications = new Array<MyNotification>();}
          notifications.push(new MyNotification((data.notification.payload.additionalData && data.notification.payload.additionalData.title) ? data.notification.payload.additionalData.title : data.notification.payload.title,
            (data.notification.payload.additionalData && data.notification.payload.additionalData.body) ? data.notification.payload.additionalData.body : data.notification.payload.body,
            String(new Date().getTime())));
          window.localStorage.setItem(Constants.KEY_NOTIFICATIONS, JSON.stringify(notifications));
        } else {
          noti_ids_processed.splice(index, 1);
          window.localStorage.setItem('noti_ids_processed', JSON.stringify(noti_ids_processed));
        }
      });

      this.oneSignal.endInit();

      this.oneSignal.getIds().then(id => {
        console.log("################################################################");
        console.log(id.pushToken + " It's Push Token");
        console.log(id.userId + " It's Devices ID");
        this.token = id.userId;

        this.updatePlayerId();
      });
    });
  }

  end() {
    if (this.platform.is('android')) {
      this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
    }
    if (this.platform.is('ios')) {
      this.oneSignal.startInit(this.config.oneSignalAppId);
    }
    this.oneSignal.removeExternalUserId();
    this.oneSignal.endInit();
  }

  updatePlayerId() {
    console.log("##### **** START UPDATE USER NotificationService");

    if (this.token != "" && window.localStorage.getItem(Constants.KEY_USER)) {
      const userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
      firebase.database().ref(Constants.REF_USERS_FCM_IDS).child((userMe.id + 'hc')).set(this.token);

      const defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);

      this.clientService.updateUser(window.localStorage.getItem(Constants.KEY_TOKEN), {
        fcm_registration_id_provider: this.token,
        language: (defaultLang && defaultLang.length) ? defaultLang : this.config.availableLanguages[0].code
      }).subscribe(res => {
        console.log('updateUser', res);
      }, err => {
        console.log('updateUser', err);
      });
    }
    console.log("##### **** END UPDATE USER NotificationService");
  }

}
