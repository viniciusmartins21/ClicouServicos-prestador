import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController, LoadingController, ToastController, AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { Attendance } from 'src/app/models/attendance.models';
import { Constants } from 'src/app/models/contants.models';
import { Profile } from 'src/app/models/profile.models';
import { ClientService } from 'src/app/services/client.service';
import { NewSchedulePage } from './new-schedule/new-schedule.page';

@Component({
  selector: 'app-add-scheduling',
  templateUrl: './add-scheduling.page.html',
  styleUrls: ['./add-scheduling.page.scss'],
  providers: [ClientService]
})
export class AddSchedulingPage implements OnInit {
  loading: boolean = false;
  profile: Profile;
  page: number = 1;
  escritorio: Array<Attendance> = [];
  home: Array<Attendance> = [];
  clinic: Array<Attendance> = [];

  constructor(
    private navCtrl: NavController,
    private service: ClientService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.loadPage();
  }

  segmentChanged(event: any) {
    this.page = event.detail.value;
  }

  async loadPage() {
    this.loading = true;

    this.escritorio = [];
    this.home = [];
    this.clinic = [];

    this.service.getScheduleTime(window.localStorage.getItem(Constants.KEY_TOKEN), 1).subscribe((res: any) => {
      console.log(res);
      this.loading = false;

      res.forEach(element => {
        if (element['type'] == 'escritorio') {
          element.durationShow = element.duration + ' minutos';
          element.weekdayShow = this.setWeekDay(element.weekday);
          this.escritorio.push(element);

        } else if (element['type'] == 'domiciliar') {
          element.durationShow = element.duration + ' minutos';
          element.weekdayShow = this.setWeekDay(element.weekday);
          this.home.push(element);

        } else if (element['type'] == 'consultorio') {
          element.durationShow = element.duration + ' minutos';
          element.weekdayShow = this.setWeekDay(element.weekday);
          this.clinic.push(element);
        }
      });
    }, err => {
      console.log(err);
      this.loading = false;
      this.showToast("Falha ao carregar dados");
    });
  }

  async delete(content) {
    let alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: 'Tem certeza que deseja deletar este horário?',
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

          this.service.deleteScheduleTime(window.localStorage.getItem(Constants.KEY_TOKEN), content.id).subscribe(res => {
            this.loading = false;
            loading.dismiss();
            this.showToast("Horário apagado");
            this.loadPage();

          }, err => {
            console.log(err);
            this.loading = false;
            loading.dismiss();
            this.showToast("Tente novamente mais tarde");
          });
        }
      }]
    });
    alert.present();
  }

  update(item) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: item.id,
        type: item.type,
        s_time: item.s_time,
        e_time: item.e_time,
        duration: item.duration,
        weekday: item.weekday
      }
    };

    this.navCtrl.navigateRoot(['./new-schedule'], navigationExtras);
  }

  setWeekDay(day: string) {
    let data = '';

    if (day == 'Monday') {
      data = 'Segunda-feira'

    } else if (day == 'Tuesday') {
      data = 'Terça-feira'

    } else if (day == 'Wednesday') {
      data = 'Quarta-feira'

    } else if (day == 'Thursday') {
      data = 'Quinta-feira'

    } else if (day == 'Friday') {
      data = 'Sexta-feira'

    } else if (day == 'Saturday') {
      data = 'Sábado'

    } else if (day == 'Sunday') {
      data = 'Domingo'
    }

    return data;
  }

  async openModal(type: any) {
    const modal = await this.modalController.create({
      component: NewSchedulePage,
      mode: 'ios',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        data: type
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        if (data['data']) {
          this.loadPage();
        }
      });

    return await modal.present();
  }

  //PULL TO REFRESH
  refresh(event) {
    this.loading = true;
    setTimeout(() => {
      this.loadPage();
      event.target.complete();
    }, 1500);
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
