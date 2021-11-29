import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/models/contants.models';
import { Profile } from 'src/app/models/profile.models';
import { User } from 'src/app/models/user.models';
import { ClientService } from 'src/app/services/client.service';
import { AuthenticationService } from 'src/app/services/guard/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  providers: [ClientService]
})
export class AccountPage implements OnInit {
  loading: boolean = false;
  user: User;
  profile: Profile;
  subscriptions: Array<Subscription> = [];

  constructor(
    private route: Router,
    private alertCtrl: AlertController,
    private service: ClientService,
    private toastCtrl: ToastController,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    if (JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE))) {
      this.profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
      this.loading = false;
      this.startTimer();
    } else {
      this.refreshProfile();
    }
  }

  refreshProfile() {
    this.loading = true;
    let subscription: Subscription = this.service.getProfile(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
      this.profile = res;
      this.loading = false;
      window.localStorage.setItem(Constants.KEY_PROFILE, JSON.stringify(res));
      this.startTimer();
    }, err => {
      console.log('profile_get_err', err);
      this.loading = false;
      this.showToast('Falha ao atualizar dados');
    });
    this.subscriptions.push(subscription);
  }

  async logout() {
    let alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: 'Deseja sair do aplicativo?',
      buttons: [{
        text: 'Não',
        role: 'cancel',
        handler: () => {

        }
      },
      {
        text: 'Sim',
        handler: () => {
          this.auth.logout();
        }
      }]
    });
    await alert.present();
  }

  myProfile() {
    this.route.navigate(['./my-profile']);
  }

  contactUs() {
    this.route.navigate(['./contact-us']);
  }

  terms() {
    this.route.navigate(['./tnc']);
  }

  feedback() {
    this.route.navigate(['./feedback'])
  }

  notifications() {
    this.route.navigate(['./notifications']);
  }

  bankAccount() {
    this.route.navigate(['./bank-account']);
  }

  faqs() {
    this.route.navigate(['./faq']);
  }

  startTimer() {
    setTimeout(() => {
      this.user = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
      this.profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
      this.startTimer();
    }, 2000);
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
