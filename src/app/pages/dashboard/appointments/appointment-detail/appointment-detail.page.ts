/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, NavParams, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/models/contants.models';
import { User } from 'src/app/models/user.models';
import { Chat } from 'src/app/models/chat.models';
import { ClientService } from 'src/app/services/client.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.page.html',
  styleUrls: ['./appointment-detail.page.scss'],
  providers: [ClientService]
})
export class AppointmentDetailPage implements OnInit {
  loading: boolean = false;
  isToday: boolean = false;
  isOld: boolean = false;
  time: number = 1;
  data = {
    id: 0,
    provider: {
      latitude: '',
      longitude: '',
      image_url: '',
      primary_category: {
        description: ''
      },
      user: {
        id: '',
        email: '',
        name: '',
        image_url: '',
        mobile_number: ''
      },
      address: ''
    },
    user: {
      id: '',
      email: '',
      name: '',
      image_url: '',
      mobile_number: ''
    },
    address: {
      latitude: '',
      longitude: '',
      address: '',
      title: ''
    },
    category: {
      title: ''
    },
    image_url: '',
    statusShow: '',
    method_payment: '',
    status_pg: '',
    status: '',
    type: '',
    date: '',
    time_from: '',
    price: ''
  };

  constructor(
    private modal: ModalController,
    private navCtrl: NavController,
    private service: ClientService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private backgroundMode: BackgroundMode,
    private geolocation: Geolocation,
    private clipboard: Clipboard,
    navParams: NavParams
  ) {
    this.data = navParams.get('data');
    console.log(this.data);
    if (this.data.type === 'online') {
      this.data.type = 'Online';
    } else if (this.data.type === 'escritorio') {
      this.data.type = 'No profissional';
    } else if (this.data.type === 'domiciliar') {
      this.data.type = 'Domiciliar';
    }

    if (this.data.status_pg === '0' || this.data.status_pg === 'Aguardando pagamento') {
      this.data.status_pg = 'Aguardando pagamento';
    } else {
      this.data.status_pg = 'Pago';
    }

    if (this.data.method_payment === 'cartao') {
      this.data.method_payment = 'Cartão';
    } else {
      this.data.method_payment = 'Dinheiro';
    }

    this.backgroundMode.on('deactivate').subscribe(() => {
    });
  }


  ngOnInit() {
    this.verifyDate();
    this.look();
  }

  verifyDate() {
    const currentDate = new Date();
    let day = '';
    let month = '';
    const year = currentDate.getFullYear();

    if (currentDate.getDate() < 10) {
      day = '0' + currentDate.getDate();
    } else {
      day = '' + currentDate.getDate();
    }

    if (currentDate.getMonth() + 1 < 10) {
      month = '0' + (currentDate.getMonth() + 1);
    } else {
      month = '' + (currentDate.getMonth() + 1);
    }

    const finalDate = day + '/' + month + '/' + year;

    if (finalDate === this.data.date) {
      this.isToday = true;
    } else if (finalDate > this.data.date) {
      this.isOld = true;
    }
  }

  async update(status: string) {
    let msg = '';

    if (status === 'accepted') { msg = 'Deseja aceitar este compromisso?'; }
    if (status === 'rejected') { msg = 'Deseja cancelar este compromisso?'; }
    if (status === 'onway') { msg = 'Você confirma que está à caminho para este compromisso?'; }
    if (status === 'ongoing') { msg = 'Você confirma que este compromisso está em andamento?'; }
    if (status === 'complete') { msg = 'Você confirma que este compromisso foi concluído?'; }

    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: msg,
      buttons: [{
        text: 'Não',
        role: 'cancel'
      }, {
        text: 'Sim',
        handler: async () => {
          const loading = await this.loadingCtrl.create({
            message: 'Aguarde...',
          });

          await loading.present();
          this.loading = true;

          this.send(loading, status);
        }
      }]
    });
    alert.present();
  }

  send(loading, status) {
    this.service.updateAppointment(window.localStorage.getItem(Constants.KEY_TOKEN), this.data.id, status).subscribe((res) => {
      console.log(res);
      this.loading = false;
      loading.dismiss();
      this.modal.dismiss(true);
      this.showToast('Compromisso atualizado');

      if (status === 'onway') { this.look(); }
      if (status === 'ongoing' || status === 'complete') {
        this.backgroundMode.disable();
      }

    }, err => {
      console.log('err', err);
      this.loading = false;
      loading.dismiss();
      this.showToast('Tente novamente mais tarde');
    });
  }

  openMap() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.data.id,
        latitude: this.data.address.latitude,
        longitude: this.data.address.longitude,
        category: this.data.category.title,
        name: this.data.user.name,
        image_url: this.data.user.image_url
      }
    };

    this.modal.dismiss(false);
    this.navCtrl.navigateForward(['./map-view'], navigationExtras);
  }

  openMap2() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.data.id,
        latitude: this.data.provider.latitude,
        longitude: this.data.provider.longitude,
        category: this.data.category.title,
        name: this.data.user.name,
        image_url: this.data.user.image_url
      }
    };

    this.modal.dismiss(false);
    this.navCtrl.navigateForward(['./map-view'], navigationExtras);
  }

  copy() {
    this.clipboard.copy(this.data.address.address);
    this.showToast('Endereço copiado');
  }

  copy2() {
    this.clipboard.copy(this.data.provider.address);
    this.showToast('Endereço copiado');
  }

  look() {
    setTimeout(() => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.sendCoords(resp.coords.latitude, resp.coords.longitude);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }, this.time);
  }

  sendCoords(latitude, longitude) {
    this.service.sendCoord(window.localStorage.getItem(Constants.KEY_TOKEN), this.data.id, { latitude, longitude }).subscribe((res) => {
      const test = JSON.parse(window.localStorage.getItem(Constants.KEY_SETTING));
      const minutes = Number(test[17].value);
      this.time = minutes * 60000;
      if (this.backgroundMode.isActive()) { this.look(); }
    }, err => {
      console.log(err);
    });
  }

  chat() {
    const newUserMe: User = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    const chat = new Chat();
    chat.chatId = this.data.user.id + 'hc';
    chat.chatImage = (this.data.user.image_url && this.data.user.image_url.length) ? this.data.user.image_url : 'assets/imgs/empty_dp.png';
    chat.chatName = this.data.user.name;
    chat.chatStatus = this.data.user.email;
    chat.myId = newUserMe.id + 'hp';

    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(chat)
      }
    };

    this.modal.dismiss(false);
    this.navCtrl.navigateForward(['./chat'], navigationExtras);
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

}
