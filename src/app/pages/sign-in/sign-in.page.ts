import { Component, Inject, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { AppConfig, APP_CONFIG } from 'src/app/app.config';
import { Constants } from 'src/app/models/contants.models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss']
})
export class SignInPage implements OnInit {
  loading: boolean = false;
  phoneNumber: string;
  countryCode: string = '+55';
  phoneNumberFull: string;
  //countries: any;
  //phoneNumberHint: string;

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private service: ClientService,
    private platform: Platform,
    //private googlePlus: GooglePlus
  ) { }

  ngOnInit() {

  }

  privacy() {
    this.navCtrl.navigateRoot(['./tnc']);
  }

  async alertPhone() {
    let phone = this.phoneNumber.replace(/[^0-9 ]/g, "");
    phone = phone.replace(' ', '');

    if (phone === undefined || phone.length != 11) {
      this.showToast('Este número de celular é inválido');

    } else {
      this.phoneNumberFull = this.countryCode + phone;

      let alert = await this.alertCtrl.create({
        header: this.phoneNumber  ,
        message: 'Deseja continuar com este número de celular?',
        buttons: [{
          text: 'Não',
          role: 'cancel'
        }, {
          text: 'Sim',
          handler: () => {
            this.checkIfExists();
          }
        }]
      });
      alert.present();
    }
  }

  async checkIfExists() {
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde...',
    });

    await loading.present();
    this.loading = true;

    let navigationExtras: NavigationExtras = {
      queryParams: {
        phone: this.phoneNumberFull
      }
    };

    this.service.checkUser({ mobile_number: this.phoneNumberFull, role: "provider" }).subscribe(res => {
      console.log(res);
      this.loading = false;
      loading.dismiss();

      this.navCtrl.navigateRoot(['./verification'], navigationExtras);
    }, err => {
      console.log(err);
      this.loading = false;
      loading.dismiss();

      this.navCtrl.navigateRoot(['./register'], navigationExtras);
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: "middle",
      duration: 3000
    });
    toast.present();
  }

  /*
  signInGoogle() {
    if (this.platform.is('cordova')) {
      this.translate.get('logging_google').subscribe(value => {
        this.presentLoading(value);
      });
      this.googleOnPhone();
    }
  }
  */

  /*
  signInGoogle() {
    if (this.platform.is('cordova')) {
      this.translate.get('logging_google').subscribe(async value => {
        const loading = await this.loadingCtrl.create({
          message: value,
        });
        
        await loading.present();
        this.loading = true;
        
        let os = this.platform.is('ios') ? 'ios' : 'android';
        this.googlePlus.login({
          'webClientId': this.config.firebaseConfig.webApplicationId,
          'offline': false,
          'scopes': 'profile email'
        }).then(googleCredential => {
          console.log('google_success', JSON.stringify(googleCredential));
          this.translate.get('verifying_user').subscribe(value => {
            this.showToast(value);
            
            this.service.loginSocial(new SocialLoginRequest(googleCredential.idToken, "google", os)).subscribe(res => {
              loading.dismiss();
              this.loading = false;
              
              this.loginSocialSuccess(res);
            }, err => {
              console.log(err);
              loading.dismiss();
              this.loading = false;
              
              if (err && err.status && err.status == 404) {
                if (googleCredential.displayName && googleCredential.email) {
                  //this.navCtrl.push(SignupPage, { name: googleCredential.displayName, email: googleCredential.email });
                } else {
                  //this.navCtrl.push(SignupPage);
                }
              } else {
                this.showToast(err.error.message);
              }
            });
          });
        }).catch(err => {
          console.log('google_fail', err);
          loading.dismiss();
          this.loading = false;
        });
      });
    }
  }
  */

  loginSocialSuccess(res) {
    if (res.user.mobile_verified == 1) {
      window.localStorage.setItem(Constants.KEY_USER, JSON.stringify(res.user));
      window.localStorage.setItem(Constants.KEY_TOKEN, res.token);

      //this.events.publish('user:login', res.user);
      //this.app.getRootNav().setRoot(TabsPage);
    } else {
      //this.app.getRootNav().setRoot(OtpPage, { phoneNumberFull: res.user.mobile_number });
    }
  }

}
