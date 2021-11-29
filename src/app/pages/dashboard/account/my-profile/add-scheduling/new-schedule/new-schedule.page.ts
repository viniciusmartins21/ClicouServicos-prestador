import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, NavParams, ModalController } from '@ionic/angular';
import { Attendance } from 'src/app/models/attendance.models';
import { Constants } from 'src/app/models/contants.models';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-new-schedule',
  templateUrl: './new-schedule.page.html',
  styleUrls: ['./new-schedule.page.scss'],
})
export class NewSchedulePage implements OnInit {
  loading: boolean = false;
  attendance: Attendance = new Attendance();
  attendance2: Attendance = new Attendance();
  type: string = 'em escritorio';

  constructor(
    private navCtrl: NavController,
    private clientService: ClientService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public modalController: ModalController,
    navParams: NavParams
  ) {
    this.attendance.type = navParams.get('data');
    this.attendance.duration = '6';
    if (this.attendance.type === 'domiciliar') {
      this.type = 'domiciliar';
    } else if (this.attendance.type == 'escritorio') {
      this.type = 'em escritório';
    }
    else if (this.attendance.type == 'consultorio') {
      this.type = 'em consultório';
    }
  }

  ngOnInit() {
  }

  convert(time) {
    let newTime = time.split('.')[0];
    newTime = newTime.split('T')[1];

    return newTime;
  }

  validate() {
    if (!this.attendance.weekday) {
      this.showToast('Selecione um dia da semana');
    } else if (!this.attendance.duration) {
      this.showToast('Selecione o tempo de duração');
    } else if (!this.attendance.s_time) {
      this.showToast('Selecione o horário inicial');
    } else if (!this.attendance.e_time) {
      this.showToast('Selecione o horário final');
    } else if (this.attendance.e_time < this.attendance.s_time) {
      this.showToast('O horário final não pode ser menor que o inicial');
    } else {
      this.save();
    }
  }

  async save() {
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde...',
    });

    await loading.present();
    this.loading = true;

    this.attendance2 = this.attendance;

    this.attendance2.s_time = this.convert(this.attendance.s_time);
    this.attendance2.e_time = this.convert(this.attendance.e_time);
    let oldPrice = '' + this.attendance.price;
    this.attendance2.price = Number(oldPrice.replace(',', '.'));

    this.clientService.saveScheduleTime(window.localStorage.getItem(Constants.KEY_TOKEN), this.attendance2).subscribe(res => {
      this.loading = false;
      loading.dismiss();

      if (res['message']) {
        this.showToast("Horário adicionado");
        this.modalController.dismiss(true);
      } else {
        this.showToast("Você já possui algum cadastro neste horário");
      }

    }, err => {
      console.log(err);
      this.loading = false;
      loading.dismiss();
      this.showToast("Tente novamente mais tarde");
    });

  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: "middle",
      duration: 4000
    });
    toast.present();
  }

}
