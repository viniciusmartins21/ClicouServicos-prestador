import { Component, Inject, ViewChild } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Constants } from 'src/app/models/contants.models';
import { APP_CONFIG, AppConfig } from './app.config';
import { ClientService } from './services/client.service';
import { User } from './models/user.models';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [ClientService]

})
export class AppComponent {
  userMe: User;
  rtlSide = 'left';

  token = "";

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private clientService: ClientService,
    private oneSignal: OneSignal,
  ) {
    this.initializeApp();
    this.refreshSettings();

    this.clientService.getSettings().subscribe(res => {
      console.log('setting_setup_success');
      window.localStorage.setItem(Constants.KEY_SETTING, JSON.stringify(res));
    }, err => {
      console.log('setting_setup_error', err);
    });
  }

  refreshSettings() {
    this.clientService.getSettings().subscribe(res => {
      window.localStorage.setItem(Constants.KEY_SETTING, JSON.stringify(res));
    }, err => {
      console.log('setting_setup_error', err);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      firebase.initializeApp({
        apiKey: this.config.firebaseConfig.apiKey,
        authDomain: this.config.firebaseConfig.authDomain,
        databaseURL: this.config.firebaseConfig.databaseURL,
        projectId: this.config.firebaseConfig.projectId,
        storageBucket: this.config.firebaseConfig.storageBucket,
        messagingSenderId: this.config.firebaseConfig.messagingSenderId
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));

      if(this.platform.is('mobile')){
        this.updateUser();
      }

      this.globalize();
    });
  }

  globalize() {
    this.setDirectionAccordingly('pt');
    window.localStorage.setItem(Constants.KEY_LOCALE, 'pt');
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'ar': {
        this.rtlSide = 'rtl';
        break;
      }
      default: {
        this.rtlSide = 'ltr';
        break;
      }
    }
  }

  setupOneSignal(){
    console.log("############# START setupOneSignal");

    if (this.platform.is('android')) {
      this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
    }
    if (this.platform.is('ios')) {
      this.oneSignal.startInit(this.config.oneSignalAppId);
    }

    /* this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      console.log("############# NOVO PUSH #############");
    }); */

    this.oneSignal.endInit();

    this.oneSignal.getIds().then(id => {
      console.log(id.pushToken + " It's Push Token");
      console.log(id.userId + " It's Devices ID");
      this.token = id.userId;

      this.updateUser();
    });

    console.log("############# END setupOneSignal");
  }

  updateUser(){
    console.log("############# START updateUser AppComponents");

    this.clientService.updateUser(window.localStorage.getItem(Constants.KEY_TOKEN), {
      language: 'pt'
      //, fcm_registration_id_provider: this.token
    }).subscribe(res => {
      console.log(res);
    }, err => {
      console.log('update_user', err);
    });

    console.log("############# END updateUser");
  }

}
