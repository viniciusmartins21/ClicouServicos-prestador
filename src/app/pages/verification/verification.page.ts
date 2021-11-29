import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular'
import { Constants } from 'src/app/models/contants.models';
import { ClientService } from 'src/app/services/client.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import firebase from 'firebase';
import { AuthenticationService } from 'src/app/services/guard/authentication.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
  providers: [ClientService, FirebaseService]
})
export class VerificationPage implements OnInit {
  loading: boolean = false;
  captchanotvarified: boolean = true;
  captchaVerified: boolean = false;
  intervalCalled: boolean = false;
  phoneNumberFull: string = '';
  verificationId: any;
  result: any;
  otp: any = '';
  timer: any;
  minutes: number = 0;
  seconds: number = 0;
  totalSeconds: number = 0;
  windowRef: any;

  constructor(
    private serviceFirebase: FirebaseService,
    private navCtrl: NavController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.phoneNumberFull = params["phone"];
    });

    this.sendOTP();
  }


  ionViewWillEnter() {
    this.makeCaptcha();
  }

  makeCaptcha() {
    this.windowRef = this.serviceFirebase.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function () {
        this.windowRef.recaptchaVerifier.captchanotvarified = true;
      }
    });
    this.windowRef.recaptchaVerifier.render();
  }

  sendOTP() {
    if (this.platform.is('cordova') || this.platform.is('ios')) {
      this.sendOtpPhone();
    } else {
      this.sendOtpBrowser();
    }

    if (this.intervalCalled) {
      clearInterval(this.timer);
    }
  }

  async sendOtpPhone() {
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde...',
    });

    await loading.present();
    this.loading = true;

    const appVerifier = this.windowRef.recaptchaVerifier;

    firebase.auth().signInWithPhoneNumber(this.phoneNumberFull, appVerifier).then((res: any) => {
      loading.dismiss();
      this.loading = false;
      this.windowRef.confirmationResult = res;
      this.result = res;

      this.verificationId = res.verificationId;

      if (res.instantVerification && res.code) {
        this.otp = res.code;
        this.showToast("Verificado automaticamente");
        this.verifyOtpPhone();
      } else {
        this.showToast('SMS enviado!');
        if (this.intervalCalled) {
          clearInterval(this.timer);
        }
        this.createInterval();
      }

    }).catch(err => {
      console.log("otp_send_fail", err);
      loading.dismiss();
      this.loading = false;

      this.changeToEmail();
    });
  }

  async sendOtpBrowser() {
    const loading = await this.loadingCtrl.create({
      message: 'Enviando SMS...',
    });

    await loading.present();
    this.loading = true;

    firebase.auth().signInWithPhoneNumber(this.phoneNumberFull, this.windowRef.recaptchaVerifier).then((res) => {
      console.log(res);
      loading.dismiss();
      this.loading = false;
      this.showToast("SMS enviado!");

      this.result = res;

      if (this.intervalCalled) {
        clearInterval(this.timer);
      }
      this.createInterval();

    }).catch(err => {
      console.log(err);
      loading.dismiss();
      this.loading = false;

      if (err.message) {
        this.showToast(err.message);
      } else {
        this.changeToEmail();
      }
    });
  }

  async loginUser(token) {
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde...',
    });

    await loading.present();
    this.loading = true;

    this.clientService.login({ token: token, role: "provider" }).subscribe(res => {
      loading.dismiss();
      this.loading = false;
      window.localStorage.setItem(Constants.KEY_USER, JSON.stringify(res.user));
      window.localStorage.setItem(Constants.KEY_TOKEN, res.token);
      this.auth.login(res.user.id);

    }, err => {
      console.log(err);
      loading.dismiss();
      this.loading = false;
      this.presentErrorAlert((err && err.error && err.error.message && String(err.error.message).toLowerCase().includes("role")) ? "O usuário já existe" : "Algo não deu certo");
    });
  }

  getUserToken(user) {
    user.getIdToken(false).then(res => {
      console.log('user_token_success', res);
      this.loginUser(res);
    }), err => {
      console.log('user_token_failure', err);
    };
  }

  createTimer() {
    this.intervalCalled = true;
    this.totalSeconds--;
    if (this.totalSeconds == 0) {
      clearInterval(this.timer);
    } else {
      this.seconds = (this.totalSeconds % 60);
      if (this.totalSeconds >= this.seconds) {
        this.minutes = (this.totalSeconds - this.seconds) / 60
      } else {
        this.minutes = 0;
      }
    }
  }

  createInterval() {
    this.totalSeconds = 120;
    this.createTimer();
    this.timer = setInterval(() => {
      this.createTimer();
    }, 1000);
  }

  verify() {
    if (this.platform.is('cordova')) {
      this.verifyOtpPhone();
    } else {
      this.verifyOtpBrowser();
    }
  }

  changeToEmail(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        phone: this.phoneNumberFull
      }
    };
    
    this.navCtrl.navigateRoot(['/verification-email'], navigationExtras);
  }

  submitVerif() {
    this.windowRef.confirmationResult.confirm(this.otp)
      .then(async result => {
        this.verifyOtpPhone();
      })
      .catch(err => {
        console.log('err2', err)
      });
  }

  async verifyOtpPhone() {
    const loading = await this.loadingCtrl.create({
      message: 'Verificando código...',
    });

    await loading.present();
    this.loading = true;

    const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.otp);

    firebase.auth().signInWithCredential(credential).then((info) => {
      loading.dismiss();
      this.loading = false;
      this.getUserToken(info.user);

    }).catch(err => {
      console.log('otp_verify_fail', err);
      loading.dismiss();
      this.loading = false;
      this.showToast('Verifique o código informado');
    })
  }

  async verifyOtpBrowser() {
    const loadingVerify = await this.loadingCtrl.create({
      message: 'Verificando código...',
    });

    await loadingVerify.present();
    this.loading = true;

    if (this.otp > 999) {

    } else {

    }
    setTimeout(() => {
      loadingVerify.dismiss()
      this.loading = false;
    }, 8000);

    this.result.confirm(this.otp).then(response => {
      console.log('otp_verify_success', response);
      loadingVerify.dismiss()
      this.loading = false;
      this.getUserToken(response.user);
    }).catch(err => {
      console.log('otp_verify_fail', err);
      loadingVerify.dismiss();
      this.loading = false;
      this.showToast('Verifique o código informado');
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

  async presentErrorAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Oops!',
      message: msg,
      backdropDismiss: false,
      buttons: ['Ok']
    });

    alert.present();
  }

}
