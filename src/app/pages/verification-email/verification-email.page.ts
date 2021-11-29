import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/models/contants.models';
import { ClientService } from 'src/app/services/client.service';
import { AuthenticationService } from 'src/app/services/guard/authentication.service';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.page.html',
  styleUrls: ['./verification-email.page.scss'],
})
export class VerificationEmailPage implements OnInit {
  phoneNumberFull: string = '';
  loading: boolean = false;
  code: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private service: ClientService,
    private toastCtrl: ToastController,
    private auth: AuthenticationService
  ) { }


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.phoneNumberFull = params["phone"];
    });

    this.sendCode();
  }

  async sendCode() {
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde...',
    });

    await loading.present();
    this.loading = true;

    this.service.sendCodeEmail({ mobile_number: this.phoneNumberFull, role: "provider" }).subscribe((res: any) => {
      console.log(res);
      loading.dismiss();
      this.loading = false;

      if (!res['return']) {
        this.showToast('Não foi possível enviar o email');
      } else if (res['return']) {
        this.showToast(res['message']);
      } else {
        this.showToast('Algo não deu certo');
      }
    }, err => {
      console.log(err);
      loading.dismiss();
      this.loading = false;
      this.showToast('Tente novamente mais tarde');
    });
  }

  async verify() {
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde...',
    });

    await loading.present();
    this.loading = true;

    this.service.verifyCodeEmail({ mobile_number: this.phoneNumberFull, code: this.code, role: "provider" }).subscribe((res: any) => {
      console.log(res);
      loading.dismiss();
      this.loading = false;

      if (!res['return']) {
        this.showToast('Código inválido');

      } else if (res['return']) {
        window.localStorage.setItem(Constants.KEY_USER, JSON.stringify(res['user']));
        window.localStorage.setItem(Constants.KEY_TOKEN, res['token']);
        this.auth.login(res['user']['id']);

      } else {
        this.showToast('Algo não deu certo');
      }

    }, err => {
      console.log(err);
      loading.dismiss();
      this.loading = false;
      this.showToast('Tente novamente mais tarde');
    });
  }

  backPage() {
    this.navCtrl.navigateRoot(['sign-in']);
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: "middle",
      duration: 3000
    });
    toast.present();
  }


}
