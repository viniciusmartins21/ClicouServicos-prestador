import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SignUpRequest } from 'src/app/models/signup-request.models';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  loading: boolean = false;
  signUpRequest = new SignUpRequest('', '', '', '');
  phoneNumberFull: string = '';

  constructor(
    private navCtrl: NavController,
    private clientService: ClientService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.phoneNumberFull = params["phone"];
    });
  }

  sign_in() {
    this.navCtrl.navigateRoot(['./sign-in']);
  }

  requestSignUp() {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!this.signUpRequest.name.length) {
      this.showToast('Este nome é inválido');
    } else if (this.signUpRequest.email.length <= 5 || !reg.test(this.signUpRequest.email)) {
      this.showToast('Este email é inválido');
    } else {
      this.alertPhone();
    }
  }

  async alertPhone() {
    let alert = await this.alertCtrl.create({
      header: this.phoneNumberFull,
      message: 'Deseja realizar o cadastro com este número de celular?',
      buttons: [{
        text: 'Não',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }, {
        text: 'Sim',
        handler: () => {
          this.signUpRequest.password = String(Math.floor(100000 + Math.random() * 900000));
          this.signUpRequest.mobile_number = this.phoneNumberFull;
          this.signUp();
        }
      }]
    });
    await alert.present();
  }

  async signUp() {
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde...'
    });

    await loading.present();
    this.loading = true;

    this.clientService.signUp(this.signUpRequest).subscribe(res => {
      console.log(res);
      this.loading = false;
      loading.dismiss();

      let navigationExtras: NavigationExtras = {
        queryParams: {
          phone: res.user.mobile_number
        }
      };

      this.navCtrl.navigateRoot(['./verification'], navigationExtras);

    }, err => {
      console.log(err);
      this.loading = false;
      loading.dismiss();
      let msg;

      msg = 'Não foi possível continuar';
      if (err && err.error && err.error.errors) {
        if (err.error.errors.email) {
          msg = 'Não foi possível continuar com este email';
        } else if (err.error.errors.mobile_number) {
          msg = 'Não foi possível continuar com este celular';
        } else if (err.error.errors.password) {
          msg = 'Não foi possível continuar com este nome';
        }
      }
      this.presentErrorAlert(msg);
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
